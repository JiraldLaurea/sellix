import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(
    _: Request,
    { params }: { params: Promise<{ orderNumber: string }> }
) {
    const session = await getServerSession(authOptions);
    const { orderNumber } = await params;

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const order = await prisma.order.findFirst({
        where: {
            orderNumber: orderNumber,
            userId: session.user.id,
            status: "PENDING",
        },
    });

    if (!order || !order.paymentIntentId) {
        return NextResponse.json(
            { error: "Order not payable" },
            { status: 400 }
        );
    }

    const intent = await stripe.paymentIntents.retrieve(order.paymentIntentId);

    return NextResponse.json({
        clientSecret: intent.client_secret,
    });
}
