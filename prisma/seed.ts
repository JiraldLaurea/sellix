import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const LIMIT = 50;

async function seedCategories() {
    const res = await fetch("https://api.escuelajs.co/api/v1/categories");
    const categories = await res.json();

    for (const category of categories) {
        await prisma.category.upsert({
            where: { id: String(category.id) },
            update: {},
            create: {
                id: String(category.id),
                name: category.name,
                image: category.image,
            },
        });
    }

    console.log(`✅ Seeded ${categories.length} categories`);
}

async function seedProducts() {
    let offset = 0;
    let total = 0;

    while (true) {
        const res = await fetch(
            `https://api.escuelajs.co/api/v1/products?offset=${offset}&limit=${LIMIT}`
        );

        const products = await res.json();
        if (!products.length) break;

        for (const product of products) {
            if (!product.category?.id || !product.images?.length) continue;

            await prisma.product.upsert({
                where: { id: String(product.id) },
                update: {},
                create: {
                    id: String(product.id),
                    name: product.title,
                    description: product.description,
                    price: product.price * 100,
                    stock: 10,
                    images: product.images,
                    categoryId: String(product.category.id), // ✅ RELATION
                },
            });

            total++;
        }

        offset += LIMIT;
    }

    console.log(`✅ Seeded ${total} products`);
}

async function main() {
    await seedCategories();
    await seedProducts();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
