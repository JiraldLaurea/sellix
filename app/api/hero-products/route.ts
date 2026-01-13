import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const FEATURED_PRODUCTS = [
    "Realme XT",
    "Rolex Cellini Moonphase",
    "Apple Airpods",
    "Gucci Bloom Eau de",
];

export async function GET() {
    const products = await prisma.product.findMany({
        where: {
            name: { in: FEATURED_PRODUCTS, mode: "insensitive" },
        },
        orderBy: { name: "asc" },
        take: 4,
    });

    return NextResponse.json(products);
}
