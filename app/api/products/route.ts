import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProducts } from "@/lib/getProducts";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor") ?? undefined;
    const category = searchParams.get("category");
    const query = searchParams.get("q");
    const autocomplete = searchParams.get("autocomplete") === "true";

    // ✅ IMPORTANT: only treat min/max as active if present
    const minParam = searchParams.get("min");
    const maxParam = searchParams.get("max");

    const min = minParam ? Number(minParam) * 100 : undefined;
    const max = maxParam ? Number(maxParam) * 100 : undefined;

    const hasFilters = Boolean(category || query || minParam || maxParam);

    // 🔹 FILTERED QUERY (category / search / price)
    if (hasFilters && !cursor) {
        const items = await prisma.product.findMany({
            where: {
                ...(category && { categoryId: category }),
                ...(query && {
                    name: { contains: query, mode: "insensitive" },
                }),
                ...(min !== undefined || max !== undefined
                    ? {
                          price: {
                              ...(min !== undefined && { gte: min }),
                              ...(max !== undefined && { lte: max }),
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
