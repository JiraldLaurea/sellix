import { prisma } from "@/lib/prisma";

const PAGE_SIZE = 12;

export async function getProducts(cursor?: string) {
    const products = await prisma.product.findMany({
        take: PAGE_SIZE + 1,
        ...(cursor && {
            skip: 1,
            cursor: { id: cursor },
        }),
        include: {
            category: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });

    const hasMore = products.length > PAGE_SIZE;
    const items = hasMore ? products.slice(0, -1) : products;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return {
        items,
        nextCursor,
    };
}
