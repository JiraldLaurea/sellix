import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import crypto from "crypto";
import { Prisma } from "@prisma/client";

type CartItemWithProduct = Prisma.CartItemGetPayload<{
    include: { product: true };
}>;

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

    const total = cart.items.reduce(
        (sum: number, item: CartItemWithProduct) =>
            sum + item.product.price * item.quantity,
        0
    );

    /* ======================================================
       3️⃣ Create order
    ====================================================== */
    const order = await prisma.order.create({
        data: {
            orderNumber: crypto.randomUUID(),
            total,
            userId: session.user.id,
            status: "PENDING",
            items: {
                create: cart.items.map((item) => ({
                    productId: item.productId,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                })),
            },
        },
    });

    /* ======================================================
       4️⃣ Create Stripe PaymentIntent
    ====================================================== */
    const paymentIntent = await stripe.paymentIntents.create({
        amount: order.total, // cents
        currency: "usd",
        metadata: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            userId: session.user.id,
        },
        automatic_payment_methods: { enabled: true },
    });

    /* ======================================================
       5️⃣ Save paymentIntentId
    ====================================================== */
    await prisma.order.update({
        where: { id: order.id },
        data: {
            paymentIntentId: paymentIntent.id,
        },
    });

    /* ======================================================
       6️⃣ Return Stripe client data
    ====================================================== */
    return NextResponse.json({
        hasPendingOrder: false,
        orderNumber: order.orderNumber,
        clientSecret: paymentIntent.client_secret,
    });
}
