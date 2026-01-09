import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function DELETE() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 1️⃣ Find the user's cart
    const cart = await prisma.cart.findUnique({
        where: {
            userId: session.user.id,
        },
    });

    if (!cart) {
        return NextResponse.json({ success: true });
    }

    // 2️⃣ Clear all cart items
    await prisma.cartItem.deleteMany({
        where: {
            cartId: cart.id,
        },
    });

    return NextResponse.json({ success: true });
}
