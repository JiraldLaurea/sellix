import { prisma } from "@/lib/prisma";

export async function getAllProducts() {
    return prisma.product.findMany({
        include: {
            category: true,
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}
