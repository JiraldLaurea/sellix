"use client";

import { useEffect, useState } from "react";
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

export default function OrdersPage() {
    const authStatus = useAuthGuard();
    const [orders, setOrders] = useState<Order[]>([]);
    const status = useAuthGuard();

    useEffect(() => {
        if (status !== "authenticated") {
            return;
        }
        const stored = localStorage.getItem("orders");
        if (stored) {
            setOrders(JSON.parse(stored));
        }
    }, [authStatus]);

    if (authStatus === null) {
        return (
            <section className="py-16 text-center">
                <p>Checking authentication…</p>
            </section>
        );
    }

    if (status === "loading") {
        return (
            <div className="pb-16 text-center flex flex-col items-center min-h-[calc(100vh-64px)] justify-center">
                <p className="text-center">Loading…</p>
            </div>
        );
    }

    if (status !== "authenticated") {
        return null;
    }

    if (orders.length === 0) {
        return (
            <section className="pb-16 text-center flex flex-col items-center min-h-[calc(100vh-64px)] justify-center">
                <h1 className="text-2xl mb-4">No orders yet</h1>
                <Link
                    href="/"
                    className="inline-block rounded-md bg-accent text-white px-6 py-3 hover:bg-gray-800 transition"
                >
                    Start shopping
                </Link>
            </section>
        );
    }

    return (
        <section className="max-w-3xl mx-auto py-10">
            <h1 className="text-2xl font-semibold mb-6">Your Orders</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Link
                        key={order.orderNumber}
                        href={`/account/orders/${order.orderNumber}`}
                        className="block border rounded-md p-4 hover:bg-gray-50 transition"
                    >
                        <div className="flex justify-between mb-2">
                            <div>
                                <p className="font-medium">
                                    Order {order.orderNumber}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            <p className="font-medium">
                                ${(order.total / 100).toFixed(2)}
                            </p>
                        </div>

                        <div className="text-sm text-gray-600">
                            {order.items.length} item
                            {order.items.length > 1 && "s"}
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
