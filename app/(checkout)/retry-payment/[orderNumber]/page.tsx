import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import RetryPaymentClient from "../../../(account)/orders/[id]/pay/RetryPaymentClient";

type Props = {
    params: Promise<{
        orderNumber: string;
    }>;
};

export default async function RetryPaymentPage({ params }: Props) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const orderNumber = (await params).orderNumber;

    const order = await prisma.order.findFirst({
        where: {
            orderNumber,
            userId: session.user.id,
            status: "PENDING",
        },
    });

    if (!order || !order.paymentIntentId) {
        redirect("/orders/");
    }

    const intent = await stripe.paymentIntents.retrieve(order.paymentIntentId);

    if (!intent.client_secret) {
        redirect("/orders/");
    }

    return (
        <RetryPaymentClient
            orderNumber={orderNumber}
            clientSecret={intent.client_secret}
        />
    );
}
