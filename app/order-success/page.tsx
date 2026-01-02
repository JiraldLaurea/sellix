"use client";

import { useCart } from "@/lib/cart-context";
import Link from "next/link";
import { useEffect, useState } from "react";

type Order = {
    orderNumber: string;
    items: {
        product: {
            id: string;
            name: string;
            price: number;
        };
        quantity: number;
    }[];
    total: number;
    createdAt: string;
};

export default function OrderSuccessPage() {
    const [order, setOrder] = useState<Order | null>(null);
    const { dispatch } = useCart();

    useEffect(() => {
        const stored = localStorage.getItem("lastOrder");
        if (stored) {
            setOrder(JSON.parse(stored));
        }
    }, []);

    useEffect(() => {
        dispatch({ type: "SET_CART", items: [] });
    }, []);

    if (!order) {
        return (
            <section className="py-16 text-center">
                <h1 className="text-xl">Order not found</h1>
                <Link href="/" className="underline">
                    Go home
                </Link>
            </section>
        );
    }

    return (
        <section className="min-h-[calc(100vh-64px)] flex items-center justify-center py-6">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="text-5xl">✅</div>

                <h1 className="text-2xl font-semibold">Order confirmed</h1>
                <div className="space-y-2">
                    <p className="text-sm text-gray-500">Order number</p>
                    <p className="text-lg">{order.orderNumber}</p>
                </div>

                <div className="border rounded-md p-4 text-left space-y-2">
                    {order.items.map(({ product, quantity }) => (
                        <div
                            key={product.id}
                            className="flex justify-between text-sm"
                        >
                            <span>
                                {product.name} × {quantity}
                            </span>
                            <span>
                                ${((product.price * quantity) / 100).toFixed(2)}
                            </span>
                        </div>
                    ))}

                    <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>${(order.total / 100).toFixed(2)}</span>
                    </div>
                </div>

                <Link
                    href="/"
                    className="block rounded-md bg-black py-3 text-white hover:bg-gray-800 transition"
                >
                    Continue shopping
                </Link>
            </div>
        </section>
    );
}
