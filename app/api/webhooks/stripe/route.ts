import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";

export async function POST(req: Request) {
    const body = await req.text();
    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
        return new Response("Missing Stripe signature", { status: 400 });
    }

    let event;

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

    // ✅ Payment succeeded
    if (event.type === "payment_intent.succeeded") {
        const intent = event.data.object;

        await prisma.order.update({
            where: {
                paymentIntentId: intent.id,
            },
            data: {
                status: "PAID",
                paidAt: new Date(),
            },
        });
    }

    // (Optional but recommended)
    if (event.type === "payment_intent.payment_failed") {
        const intent = event.data.object;

        console.warn(
            "❌ Payment failed for",
            intent.id,
            intent.last_payment_error?.message
        );
    }

    return new Response(null, { status: 200 });
}
