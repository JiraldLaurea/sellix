"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function CartPage() {
    const { state, dispatch } = useCart();

    console.log(state);

    const total = state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    if (state.items.length === 0) {
        return (
            <section className="py-12 text-center">
                <h1 className="text-2xl font-semibold mb-4">
                    Your cart is empty
                </h1>
                <Link
                    href="/"
                    className="inline-block rounded-md bg-black text-white px-6 py-3 hover:bg-gray-800 transition"
                >
                    Continue shopping
                </Link>
            </section>
        );
    }

    return (
        <section className="py-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

            <div className="space-y-6">
                {state.items.map(({ product, quantity }) => (
                    <div
                        key={product.id}
                        className="flex gap-4 border rounded-lg p-4"
                    >
                        {/* Image */}
                        <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Info */}
                        <div className="flex-1">
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-600">
                                ${(product.price / 100).toFixed(2)}
                            </p>

                            <div className="flex items-center gap-3 mt-3">
                                <button
                                    onClick={() =>
                                        dispatch({
                                            type: "DECREMENT",
                                            productId: product.id,
                                        })
                                    }
                                    className="h-8 w-8 border rounded-md hover:bg-gray-100"
                                >
                                    -
                                </button>

                                <span className="min-w-[24px] text-center">
                                    {quantity}
                                </span>

                                <button
                                    disabled={quantity >= product.stock}
                                    onClick={() =>
                                        dispatch({
                                            type: "INCREMENT",
                                            productId: product.id,
                                        })
                                    }
                                    className={`h-8 w-8 border rounded-md
                                                ${
                                                    quantity >= product.stock
                                                        ? "cursor-not-allowed bg-gray-200"
                                                        : "hover:bg-gray-100"
                                                }
                                            `}
                                >
                                    +
                                </button>

                                <button
                                    onClick={() =>
                                        dispatch({
                                            type: "REMOVE_ITEM",
                                            productId: product.id,
                                        })
                                    }
                                    className="ml-4 text-sm text-red-600 hover:underline"
                                >
                                    Remove
                                </button>
                            </div>
                        </div>

                        {/* Item total */}
                        <div className="font-medium">
                            ${((product.price * quantity) / 100).toFixed(2)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart summary */}
            <div className="mt-8 flex justify-between items-center border-t pt-6">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-semibold">
                    ${(total / 100).toFixed(2)}
                </span>
            </div>

            <div className="mt-6 text-right">
                <button className="rounded-md bg-black text-white px-6 py-3 hover:bg-gray-800 transition">
                    Checkout
                </button>
            </div>
        </section>
    );
}
