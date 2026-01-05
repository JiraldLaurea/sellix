import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
    const res = await fetch("https://api.escuelajs.co/api/v1/products");
    const products = await res.json();

    for (const product of products.slice(0, 20)) {
        await prisma.product.upsert({
            where: { id: String(product.id) },
            update: {},
            create: {
                id: String(product.id),
                name: product.title,
                description: product.description,
                price: product.price * 100, // cents
                stock: 10,
                images: product.images,
            },
        });
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
