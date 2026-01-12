import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const FEATURED_PRODUCTS = [
    "Rolex Cellini Moonphase",
    "iPhone X",
    "Apple Airpods",
    "Gucci Bloom Eau de",
];

export async function GET() {
    const products = await prisma.product.findMany({
        where: {
            name: { in: FEATURED_PRODUCTS },
        },
        orderBy: { name: "asc" },
        take: 4,
    });

    return NextResponse.json(products);
}
