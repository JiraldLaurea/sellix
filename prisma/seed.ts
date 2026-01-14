import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const LIMIT = 50;

async function seedCategories() {
    const res = await fetch("https://dummyjson.com/products/categories");
    const categories = await res.json();

    for (const category of categories) {
        await prisma.category.upsert({
            where: { id: category.slug },
            update: {},
            create: {
                id: category.slug,
                name: category.name,
                image: null,
            },
        });
    }

    console.log(`✅ Seeded ${categories.length} categories`);
}

async function seedProducts() {
    let skip = 0;
    let total = 0;

    while (true) {
        const res = await fetch(
            `https://dummyjson.com/products?limit=${LIMIT}&skip=${skip}`
        );

        const data = await res.json();
        const products = data.products;

        if (!products.length) break;

        for (const product of products) {
            if (!product.category || !product.images?.length) continue;

            await prisma.product.upsert({
                where: { id: String(product.id) },
                update: {},
                create: {
                    id: String(product.id),
                    name: product.title,
                    description: product.description,
                    price: product.price * 100,
                    stock: product.stock ?? 10,
                    images: product.images,
                    categoryId: product.category,
                },
            });

            total++;
        }

        skip += LIMIT;
    }

    console.log(`✅ Seeded ${total} products`);
}

async function attachCategoryImages() {
    const categories = await prisma.category.findMany({
        where: { image: null },
    });

    for (const category of categories) {
        const product = await prisma.product.findFirst({
            where: {
                categoryId: category.id,
                images: { isEmpty: false },
            },
        });

        if (!product) continue;

        await prisma.category.update({
            where: { id: category.id },
            data: {
                image: product.images[0],
            },
        });
    }

    console.log("✅ Attached category images from products");
}

async function main() {
    await seedCategories();
    await seedProducts();
    await attachCategoryImages();
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
