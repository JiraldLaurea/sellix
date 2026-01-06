import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import Stripe from "stripe";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
        return new Response("Missing Stripe signature", { status: 400 });
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET!
        );
    } catch (err) {
        console.error("❌ Webhook signature verification failed", err);
        return new Response("Invalid signature", { status: 400 });
    }

    /* ======================================================
       PAYMENT SUCCEEDED
    ====================================================== */
    if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object as Stripe.PaymentIntent;

        const orderId = intent.metadata.orderId;
        const userId = intent.metadata.userId;

        if (!orderId || !userId) {
            console.warn("⚠️ Missing metadata on PaymentIntent", intent.id);
            return new Response(null, { status: 200 });
        }

        // 🔒 Idempotency guard (Stripe may retry)
        const existingOrder = await prisma.order.findUnique({
            where: { id: orderId },
        });

        if (!existingOrder || existingOrder.status === "PAID") {
            return new Response(null, { status: 200 });
        }

        // 1️⃣ Mark order as PAID
        await prisma.order.update({
            where: { id: orderId },
            data: {
                status: "PAID",
                paidAt: new Date(),
            },
        });

        // 2️⃣ Clear cart
        const cart = await prisma.cart.findUnique({
            where: { userId },
        });

        if (cart) {
            await prisma.cartItem.deleteMany({
                where: { cartId: cart.id },
            });
        }
    }

    /* ======================================================
       PAYMENT FAILED (optional logging)
    ====================================================== */
    if (event.type === "payment_intent.payment_failed") {
        const intent = event.data.object as Stripe.PaymentIntent;

        console.warn(
            "❌ Payment failed:",
            intent.id,
            intent.last_payment_error?.message
        );
    }

    return new Response(null, { status: 200 });
}
