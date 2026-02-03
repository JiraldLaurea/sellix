import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const PAGE_SIZE = 4;

type SortKey = "name_asc" | "name_desc" | "price_asc" | "price_desc";

const ORDER_BY: Record<SortKey, Prisma.ProductOrderByWithRelationInput[]> = {
    name_asc: [{ name: "asc" }, { id: "asc" }],
    name_desc: [{ name: "desc" }, { id: "asc" }],
    price_asc: [{ price: "asc" }, { id: "asc" }],
    price_desc: [{ price: "desc" }, { id: "asc" }],
};

export async function getProducts(cursor?: string, sort: SortKey = "name_asc") {
    const [products, totalCount] = await Promise.all([
        prisma.product.findMany({
            take: PAGE_SIZE + 1,
            ...(cursor && {
                skip: 1,
                cursor: { id: cursor },
            }),
            include: { category: true },
            orderBy: ORDER_BY[sort],
        }),
        prisma.product.count(),
    ]);

    const hasMore = products.length > PAGE_SIZE;
    const items = hasMore ? products.slice(0, PAGE_SIZE) : products;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
        items,
        nextCursor,
        totalCount,
    };
}
