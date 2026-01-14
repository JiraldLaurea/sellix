import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import crypto from "crypto";

export async function POST() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    /* ======================================================
       0️⃣ Check for existing PENDING order
    ====================================================== */
    const existingPendingOrder = await prisma.order.findFirst({
        where: {
            userId: session.user.id,
            status: "PENDING",
        },
    });

    if (existingPendingOrder) {
        return NextResponse.json(
            {
                hasPendingOrder: true,
                orderNumber: existingPendingOrder.orderNumber,
            },
            { status: 200 }
        );
    }

    /* ======================================================
       1️⃣ Fetch cart from DB (SOURCE OF TRUTH)
    ====================================================== */
    const cart = await prisma.cart.findUnique({
        where: { userId: session.user.id },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    if (!cart || cart.items.length === 0) {
        return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    /* ======================================================
       2️⃣ Revalidate stock (CRITICAL)
    ====================================================== */
    for (const item of cart.items) {
        if (item.quantity > item.product.stock) {
            return NextResponse.json(
                { error: `Not enough stock for ${item.product.name}` },
                { status: 400 }
            );
        }
    }

    /* ======================================================
       3️⃣ Calculate pricing (AUTHORITATIVE)
    ====================================================== */
    type CartItemWithProduct = (typeof cart.items)[number];

    const SHIPPING_FEE = 1500; // $15.00
    const TAX_RATE = 0.07;

    const subtotal = cart.items.reduce(
        (sum: number, item: CartItemWithProduct) =>
            sum + item.product.price * item.quantity,
        0
    );

    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + SHIPPING_FEE + tax;
    const orderNumber = Math.floor(100000 + Math.random() * 900000).toString();

    /* ======================================================
       4️⃣ Create order (LOCK TOTALS)
    ====================================================== */
    const order = await prisma.order.create({
        data: {
            orderNumber: orderNumber,
            subtotal: subtotal,
            shipping: SHIPPING_FEE,
            tax: tax,
            total: total,
            userId: session.user.id,
            status: "PENDING",
            items: {
                create: cart.items.map((item: CartItemWithProduct) => ({
                    productId: item.productId,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                })),
            },
        },
    });

    /* ======================================================
       5️⃣ Create Stripe PaymentIntent
    ====================================================== */
    const paymentIntent = await stripe.paymentIntents.create({
        amount: order.total, // MUST match DB
        currency: "usd",
        metadata: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            userId: session.user.id,
        },
        automatic_payment_methods: { enabled: true },
    });

    /* ======================================================
       6️⃣ Save paymentIntentId
    ====================================================== */
    await prisma.order.update({
        where: { id: order.id },
        data: {
            paymentIntentId: paymentIntent.id,
        },
    });

    /* ======================================================
       7️⃣ Return Stripe client data
    ====================================================== */
    return NextResponse.json({
        hasPendingOrder: false,
        orderNumber: order.orderNumber,
        clientSecret: paymentIntent.client_secret,
    });
}
