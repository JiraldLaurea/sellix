// app/api/cart/route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/auth/require-user";

export async function GET() {
    const auth = await requireUser();

    if ("error" in auth) {
        return auth.error;
    }

    const cart = await prisma.cart.findUnique({
        where: {
            userId: auth.userId,
        },
        include: {
            items: {
                include: {
                    product: true,
                },
            },
        },
    });

    // Return null if the cart does not exist yet
    return NextResponse.json(cart);
}

export async function POST(req: Request) {
    const auth = await requireUser();

    if ("error" in auth) {
        return auth.error;
    }

    const { productId, quantity = 1 } = await req.json();

    if (!productId || typeof quantity !== "number" || quantity < 1) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // 1️⃣ Ensure product exists
    const product = await prisma.product.findUnique({
        where: { id: productId },
    });

    if (!product) {
        return NextResponse.json(
            { error: "Product not found" },
            { status: 404 }
        );
    }

    // 2️⃣ Find or create cart
    const cart = await prisma.cart.upsert({
        where: { userId: auth.userId },
        create: { userId: auth.userId },
        update: {},
    });

    // 3️⃣ Get existing cart item (if any)
    const existingItem = await prisma.cartItem.findUnique({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
    });

    const currentQty = existingItem?.quantity ?? 0;
    const nextQty = currentQty + quantity;

    // 🚫 Enforce max stock (authoritative)
    if (nextQty > product.stock) {
        return NextResponse.json(
            {
                error: "Max stock reached",
                max: product.stock,
                current: currentQty,
            },
            { status: 400 }
        );
    }

    // 4️⃣ Safe upsert
    const cartItem = await prisma.cartItem.upsert({
        where: {
            cartId_productId: {
                cartId: cart.id,
                productId,
            },
        },
        update: {
            quantity: nextQty, // explicit is safer than increment here
        },
        create: {
            cartId: cart.id,
            productId,
            quantity,
        },
    });

    return NextResponse.json({ cartItem });
}

export async function PATCH(req: Request) {
    const auth = await requireUser();

    if ("error" in auth) {
        return auth.error;
    }

    const body = await req.json();
    const { cartItemId, quantity } = body;

    if (!cartItemId || typeof quantity !== "number" || quantity < 1) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Ensure item belongs to the user's cart
    const cartItem = await prisma.cartItem.findFirst({
        where: {
            id: cartItemId,
            cart: {
                userId: auth.userId,
            },
        },
    });

    if (!cartItem) {
        return NextResponse.json(
            { error: "Cart item not found" },
            { status: 404 }
        );
    }

    const updatedItem = await prisma.cartItem.update({
        where: { id: cartItemId },
        data: { quantity },
    });

    return NextResponse.json(updatedItem);
}

export async function DELETE(req: Request) {
    const auth = await requireUser();

    if ("error" in auth) {
        return auth.error;
    }

    const body = await req.json();
    const { cartItemId } = body;

    if (!cartItemId) {
        return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    // Ensure item belongs to the user's cart
    const cartItem = await prisma.cartItem.findFirst({
        where: {
            id: cartItemId,
            cart: {
                userId: auth.userId,
            },
        },
    });

    if (!cartItem) {
        return NextResponse.json(
            { error: "Cart item not found" },
            { status: 404 }
        );
    }

    await prisma.cartItem.delete({
        where: { id: cartItemId },
    });

    return NextResponse.json({ success: true });
}
