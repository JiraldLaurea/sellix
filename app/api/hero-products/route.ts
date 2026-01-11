import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

const TARGET_PRODUCTS = [
    "Rolex Cellini Moonphase",
    "iPhone 13 Pro",
    "Apple Airpods",
];

export async function GET() {
    const products = await prisma.product.findMany({
        where: {
            name: { in: TARGET_PRODUCTS },
        },
        take: 3,
    });

    return NextResponse.json(products);
}
