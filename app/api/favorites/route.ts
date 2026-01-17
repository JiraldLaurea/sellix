import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json([], { status: 200 });
    }

    const favorites = await prisma.favorite.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            product: {
                include: {
                    category: true,
                },
            },
        },
    });

    return NextResponse.json(favorites.map((f) => f.product));
}
