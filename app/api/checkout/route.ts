import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { items, total } = body;

    if (!items || items.length === 0 || typeof total !== "number") {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 1️⃣ Create order FIRST (source of truth)
    const order = await prisma.order.create({
        data: {
            orderNumber: crypto.randomUUID(),
            total: total,
            userId: session.user.id,
            status: "PENDING",
            items: {
                create: items.map((item: any) => ({
                    productId: item.product.id,
                    name: item.product.name,
                    price: item.product.price,
                    quantity: item.quantity,
                })),
            },
        },
        include: {
            items: true,
        },
    });

    // 2️⃣ Create Stripe PaymentIntent
    const paymentIntent = await stripe.paymentIntents.create({
        amount: order.total, // ✅ cents (matches DB)
        currency: "usd",
        metadata: {
            orderId: order.id,
            orderNumber: order.orderNumber,
            userId: session.user.id,
        },
        automatic_payment_methods: {
            enabled: true,
        },
    });

    // 3️⃣ Persist PaymentIntent ID
    await prisma.order.update({
        where: { id: order.id },
        data: {
            paymentIntentId: paymentIntent.id,
        },
    });

    // 4️⃣ Return safe client data
    return NextResponse.json({
        orderNumber: order.orderNumber,
        clientSecret: paymentIntent.client_secret,
    });
}
