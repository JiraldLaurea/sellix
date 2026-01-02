"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import * as Popover from "@radix-ui/react-popover";
import MobileMenu from "@/components/navbar/MobileMenu";
import AccountMenu from "../navbar/AccountMenu";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function Navbar() {
    const { state } = useCart();

    const itemCount = state.items.reduce(
        (total, item) => total + (item.quantity ?? 0),
        0
    );

    const total = state.items.reduce(
        (sum, item) => sum + item.product.price * (item.quantity ?? 0),
        0
    );

    // const [isAuthenticated, setIsAuthenticated] = useState(false);

    // useEffect(() => {
    //     setIsAuthenticated(!!localStorage.getItem("user"));
    // }, []);

    return (
        <header className="border-b sticky top-0 z-50 h-16 bg-white ">
            <div className="container mx-auto px-4 h-full flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="text-lg">
                    Ecommerce
                </Link>

                {/* Right controls */}
                <div className="flex items-center gap-4">
                    {/* Mobile menu */}
                    <MobileMenu />

                    {/* Cart popover */}
                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <button
                                aria-label="Open cart"
                                className="relative w-9 h-9"
                            >
                                🛒
                                {itemCount > 0 && (
                                    <span className="absolute select-none -top-1 -right-1 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
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
                                                        {product.name} x
                                                        {quantity ?? 1}
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

                                    <Popover.Close asChild>
                                        <Link
                                            href="/cart"
                                            className="w-full rounded-md py-2 text-sm transition bg-accent text-white hover:bg-gray-800 text-center block"
                                        >
                                            View cart
                                        </Link>
                                    </Popover.Close>
                                </>
                            )}
                        </Popover.Content>
                    </Popover.Root>

                    {/* Account menu */}
                    <AccountMenu />
                </div>
            </div>
        </header>
    );
}
