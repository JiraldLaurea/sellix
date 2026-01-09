import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(
    req: Request,
    context: { params: Promise<{ orderNumber?: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // ✅ MUST await params
    const { orderNumber } = await context.params;

    if (!orderNumber) {
        return NextResponse.json(
            { error: "Missing order number" },
            { status: 400 }
        );
    }

    const order = await prisma.order.findUnique({
        where: { orderNumber },
        select: {
            orderNumber: true,
            status: true,
            paidAt: true,
            subtotal: true,
            shipping: true,
            tax: true,
            total: true,
            items: {
                select: {
                    id: true,
                    name: true,
                    price: true,
                    quantity: true,
                },
            },
        },
    });

    if (!order) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(order);
}
