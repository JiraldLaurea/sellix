import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProducts } from "@/lib/getProducts";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor") ?? undefined;
    const category = searchParams.get("category");
    const query = searchParams.get("q");

    // 🔹 Filtered fetch (category or search)
    if (category || query) {
        const items = await prisma.product.findMany({
            where: {
                ...(category && { categoryId: category }),
                ...(query && {
                    name: { contains: query, mode: "insensitive" },
                }),
            },
            include: {
                category: true,
            },
            orderBy: {
                createdAt: "asc",
            },
        });

        return NextResponse.json({ items });
    }

    // 🔹 Infinite scroll (All Products)
    const data = await getProducts(cursor);

    return NextResponse.json(data);
}
