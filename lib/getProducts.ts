import { prisma } from "@/lib/prisma";

export async function getProducts(limit = 20) {
    return prisma.product.findMany({
        take: limit,
        orderBy: {
            createdAt: "asc",
        },
    });
}
