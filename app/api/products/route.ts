import { NextResponse } from "next/server";
import { getProducts } from "@/lib/getProducts";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor") ?? undefined;

    const data = await getProducts(cursor);

    return NextResponse.json(data);
}
