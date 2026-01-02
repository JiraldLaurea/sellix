"use client";

import Image from "next/image";
import Link from "next/link";
import QuantityPicker from "@/components/cart/QuantityPicker";
import { useCart } from "@/lib/cart-context";
import CheckoutDialog from "@/components/checkout/CheckoutDialog";

export default function CartPage() {
    const { state, dispatch } = useCart();

    const subtotal = state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    // For now total === subtotal (future: shipping, tax)
    const total = subtotal;

    // ✅ Empty state (unchanged)
    if (state.items.length === 0) {
        return (
            <section className="pb-16 text-center flex flex-col items-center min-h-[calc(100vh-64px)] justify-center">
                <h1 className="text-2xl mb-4">Your cart is empty</h1>
                <Link
                    href="/"
                    className="inline-block rounded-md bg-accent text-white px-6 py-3 hover:bg-gray-800 transition"
                >
                    Continue shopping
                </Link>
            </section>
        );
    }

    return (
        <section className="py-8 max-w-4xl mx-auto">
            <h1 className="text-2xl font-medium mb-6">Your Cart</h1>

            {/* Cart items */}
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
                        <div className="grow flex flex-col justify-between">
                            <div>
                                <Link
                                    className="font-medium"
                                    href={`/product/${product.id}`}
                                >
                                    {product.name}
                                </Link>
                                <p className="text-sm text-gray-600">
                                    ${(product.price / 100).toFixed(2)}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 mt-3">
                                <QuantityPicker
                                    quantity={quantity}
                                    max={product.stock}
                                    onChange={(next) =>
                                        dispatch({
                                            type: "SET_QUANTITY",
                                            productId: product.id,
                                            quantity: next,
                                        })
                                    }
                                />
                            </div>
                        </div>

                        {/* Item total + remove */}
                        <div className="flex flex-col justify-between items-end">
                            <div className="font-medium">
                                ${((product.price * quantity) / 100).toFixed(2)}
                            </div>

                            <button
                                onClick={() =>
                                    dispatch({
                                        type: "REMOVE_ITEM",
                                        productId: product.id,
                                    })
                                }
                                className="text-sm text-red-600 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cart summary */}
            <div className="mt-10 border-t pt-6 space-y-4">
                <div>
                    <div className="flex justify-between text-base">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                            ${(subtotal / 100).toFixed(2)}
                        </span>
                    </div>

                    <p className="text-sm text-gray-500">
                        Shipping and taxes calculated at checkout.
                    </p>
                </div>

                <div>
                    <div className="flex mb-6 justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>${(total / 100).toFixed(2)}</span>
                    </div>

                    <div className="flex justify-end">
                        <CheckoutDialog>
                            <button className="rounded-md bg-accent text-white px-6 py-2 hover:bg-gray-800 transition">
                                Proceed to Checkout
                            </button>
                        </CheckoutDialog>
                    </div>
                </div>
            </div>
        </section>
    );
}
