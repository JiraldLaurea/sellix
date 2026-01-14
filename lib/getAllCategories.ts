import { prisma } from "@/lib/prisma";

export async function getAllCategories() {
    return prisma.category.findMany({
        orderBy: {
            createdAt: "asc",
        },
    });
}
