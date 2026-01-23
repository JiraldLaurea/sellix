import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProducts } from "@/lib/getProducts";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor") ?? undefined;
    const category = searchParams.get("category");
    const query = searchParams.get("q");
    const autocomplete = searchParams.get("autocomplete") === "true";

    const min = Number(searchParams.get("min")) * 100;
    const max = Number(searchParams.get("max")) * 100;

    const hasFilters = Boolean(category || query || min || max);

    // 🔹 FILTERED QUERY (category / search ONLY)
    if (hasFilters && !cursor) {
        const items = await prisma.product.findMany({
            where: {
                ...(category && { categoryId: category }),
                ...(query && {
                    name: { contains: query, mode: "insensitive" },
                }),
                ...(min || max
                    ? {
                          price: {
                              ...(min && { gte: min }),
                              ...(max && { lte: max }),
                          },
                      }
                    : {}),
            },
            include: {
                category: true,
            },
            take: autocomplete ? 6 : undefined,
            orderBy: {
                createdAt: "asc",
            },
        });

        return NextResponse.json({ items });
    }

    // 🔹 INFINITE SCROLL (All Products)
    const data = await getProducts(cursor);
    return NextResponse.json(data);
}
