import { prisma } from "@/lib/prisma";
import CategoryClient from "./components/CategoryClient";

export default async function CategoriesSection() {
    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            image: true,
            _count: {
                select: {
                    products: true,
                },
            },
        },
    });

    return (
        <CategoryClient
            categories={categories.map((c) => ({
                id: c.id,
                name: c.name,
                image: c.image,
                itemCount: c._count.products,
            }))}
        />
    );
}
