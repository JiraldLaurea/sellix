"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-context";

export default function Navbar() {
    const { state } = useCart();

    console.log("NAVBAR CART:", state.items);
    console.log("NAVBAR PROVIDER MOUNTED");

    const itemCount = state.items.reduce(
        (total, item) => total + item.quantity,
        0
    );

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                <Link href="/" className="text-lg font-semibold">
                    E-Commerce
                </Link>

                <Link href="/cart" className="relative">
                    🛒
                    {itemCount > 0 && (
                        <span className="absolute -top-2 -right-3 bg-black text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {itemCount}
                        </span>
                    )}
                </Link>
            </div>
        </header>
    );
}
