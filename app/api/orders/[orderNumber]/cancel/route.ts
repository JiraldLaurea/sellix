import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { stripe } from "@/lib/stripe";

export async function POST(
    req: Request,
    context: { params: Promise<{ orderNumber?: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderNumber } = await context.params;

    const order = await prisma.order.findFirst({
        where: {
            orderNumber: orderNumber,
            userId: session.user.id,
        },
    });

    if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status !== "PENDING") {
        return NextResponse.json(
            { error: "Only pending orders can be canceled" },
            { status: 400 }
        );
    }

    // 🔴 Cancel Stripe PaymentIntent (best-effort)
    if (order.paymentIntentId) {
        try {
            await stripe.paymentIntents.cancel(order.paymentIntentId);
        } catch {
            // Stripe may already have canceled it — do not block user
        }
    }

    await prisma.order.update({
        where: { id: order.id },
        data: {
            status: "CANCELLED",
        },
    });

    return NextResponse.json({ success: true });
}
