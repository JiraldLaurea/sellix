"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useAuthGuard } from "@/lib/useAuthGuard";

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

export default function OrderDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [order, setOrder] = useState<Order | null>(null);

    const authStatus = useAuthGuard();

    useEffect(() => {
        if (authStatus !== "authenticated") return;

        const stored = localStorage.getItem("orders");
        if (!stored) return;

        const orders: Order[] = JSON.parse(stored);
        setOrder(orders.find((o) => o.orderNumber === id) ?? null);
    }, [authStatus, id]);

    if (authStatus === "loading") {
        return (
            <section className="pb-16 text-center flex flex-col items-center min-h-[calc(100vh-64px)] justify-center">
                <p>Loading order…</p>
            </section>
        );
    }

    if (!order) {
        return (
            <section className="pb-16 text-center flex flex-col items-center min-h-[calc(100vh-64px)] justify-center">
                <h1 className="text-xl mb-4">Order not found</h1>
                <Link href="/account/orders" className="underline">
                    Back to orders
                </Link>
            </section>
        );
    }

    return (
        <section className="max-w-3xl mx-auto py-10 space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Order {order.orderNumber}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <Link
                    href="/account/orders"
                    className="text-sm text-gray-600 hover:underline"
                >
                    Back to orders
                </Link>
            </div>

            {/* Items */}
            <div className="border rounded-md p-4 space-y-3">
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
            </div>

            {/* Total */}
            <div className="flex justify-between text-lg font-medium border-t pt-4">
                <span>Total</span>
                <span>${(order.total / 100).toFixed(2)}</span>
            </div>
        </section>
    );
}
