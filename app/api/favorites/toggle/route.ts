import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json(
            { success: false, reason: "unauthorized" },
            { status: 401 },
        );
    }

    const { productId } = await req.json();

    const existing = await prisma.favorite.findUnique({
        where: {
            userId_productId: {
                userId: session.user.id,
                productId,
            },
        },
    });

    if (existing) {
        await prisma.favorite.delete({
            where: { id: existing.id },
        });
    } else {
        await prisma.favorite.create({
            data: {
                userId: session.user.id,
                productId,
            },
        });
    }

    return NextResponse.json({ success: true });
}
