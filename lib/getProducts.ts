import { prisma } from "@/lib/prisma";

export async function getProducts() {
    return prisma.product.findMany({
        include: {
            category: true, // ✅ include related category
        },
        orderBy: {
            createdAt: "asc",
        },
    });
}
