import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getProducts } from "@/lib/getProducts";
import { Prisma } from "@prisma/client";

type SortKey = "name_asc" | "name_desc" | "price_asc" | "price_desc";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor") ?? undefined;
    const category = searchParams.get("category");
    const query = searchParams.get("q");
    const autocomplete = searchParams.get("autocomplete") === "true";

    const minParam = searchParams.get("min");
    const maxParam = searchParams.get("max");

    const min = minParam ? Number(minParam) * 100 : undefined;
    const max = maxParam ? Number(maxParam) * 100 : undefined;

    const hasFilters = Boolean(category || query || minParam || maxParam);

    const sort = (searchParams.get("sort") ?? "name_asc") as SortKey;

    const ORDER_BY: Record<SortKey, Prisma.ProductOrderByWithRelationInput[]> =
        {
            name_asc: [{ name: "asc" }, { id: "asc" }],
            name_desc: [{ name: "desc" }, { id: "asc" }],
            price_asc: [{ price: "asc" }, { id: "asc" }],
            price_desc: [{ price: "desc" }, { id: "asc" }],
        };

    // 🔹 FILTERED QUERY
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
            include: { category: true },
            take: autocomplete ? 6 : undefined,
            orderBy: ORDER_BY[sort],
        });

        return NextResponse.json({ items });
    }

    // 🔹 INFINITE SCROLL (All Products)
    const data = await getProducts(cursor, sort);
    return NextResponse.json(data);
}
