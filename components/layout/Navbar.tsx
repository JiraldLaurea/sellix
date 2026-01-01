"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import * as Popover from "@radix-ui/react-popover";

export default function Navbar() {
    const { state } = useCart();

    const itemCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const total = state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    return (
        <header className="border-b sticky top-0 z-100 bg-white">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-lg font-semibold">
                    E-Commerce
                </Link>

                <Popover.Root>
                    <Popover.Trigger asChild>
                        <button className="relative">
                            🛒
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-3 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                    {itemCount}
                                </span>
                            )}
                        </button>
                    </Popover.Trigger>

                    <Popover.Content
                        align="end"
                        sideOffset={8}
                        className="w-72 bg-white border rounded-md shadow-lg p-4 z-50"
                    >
                        {state.items.length === 0 ? (
                            <p className="text-sm text-gray-600">
                                Your cart is empty
                            </p>
                        ) : (
                            <>
                                <p className="font-medium mb-2">Cart</p>

                                <ul className="space-y-2">
                                    {state.items
                                        .slice(0, 3)
                                        .map(({ product, quantity }) => (
                                            <li
                                                key={product.id}
                                                className="text-sm flex justify-between"
                                            >
                                                <span>
                                                    {product.name} × {quantity}
                                                </span>
                                                <span>
                                                    $
                                                    {(
                                                        (product.price *
                                                            quantity) /
                                                        100
                                                    ).toFixed(2)}
                                                </span>
                                            </li>
                                        ))}
                                </ul>

                                <div className="border-t mt-3 mb-2 pt-3 flex justify-between text-sm font-medium">
                                    <span>Total</span>
                                    <span>${(total / 100).toFixed(2)}</span>
                                </div>
                                <Link href="/cart">
                                    <button
                                        className={
                                            "w-full rounded-md py-2 text-sm transition bg-black text-white hover:bg-gray-800"
                                        }
                                    >
                                        View cart
                                    </button>
                                </Link>
                            </>
                        )}
                    </Popover.Content>
                </Popover.Root>
            </div>
        </header>
    );
}
