import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

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

    const order = await prisma.order.create({
        data: {
            orderNumber: crypto.randomUUID(),
            total: total,
            userId: session.user.id,
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

    return NextResponse.json(order);
}
