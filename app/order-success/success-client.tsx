"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type OrderStatus = "PENDING" | "PAID" | "FULFILLED" | "REFUNDED";

type Order = {
    orderNumber: string;
    total: number;
    status: OrderStatus;
    items: {
        id: string;
        name: string;
        price: number;
        quantity: number;
    }[];
};

export default function SuccessClient({
    orderNumber,
}: {
    orderNumber: string;
}) {
    const router = useRouter();
    const [order, setOrder] = useState<Order | null>(null);
    const [attempts, setAttempts] = useState(0);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/orders/${orderNumber}`, {
                    cache: "no-store",
                });

                if (!res.ok) return;

                const data = await res.json();
                setOrder(data);

                if (data.status === "PAID" || data.status === "FULFILLED") {
                    clearInterval(interval);
                }
            } catch {
                // ignore transient errors
            }

            setAttempts((a) => a + 1);
        }, 1500);

        return () => clearInterval(interval);
    }, [orderNumber]);

    // 🔐 Lock page if webhook never confirms
    useEffect(() => {
        if (
            attempts > 20 &&
            order?.status !== "PAID" &&
            order?.status !== "FULFILLED"
        ) {
            router.replace("/account/orders");
        }
    }, [attempts, order?.status, router]);

    // 🟡 Loading while webhook confirms
    if (!order || order.status === "PENDING") {
        return (
            <section className="min-h-[calc(100vh-64px)] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="animate-spin h-8 w-8 border-2 border-black border-t-transparent rounded-full mx-auto" />
                    <p className="text-sm text-gray-600">
                        Confirming your payment…
                    </p>
                </div>
            </section>
        );
    }

    // ❌ Not paid → no access
    if (order.status !== "PAID" && order.status !== "FULFILLED") {
        return null;
    }

    // ✅ PAID — render YOUR ORIGINAL JSX
    return (
        <section className="min-h-[calc(100vh-64px)] flex items-center justify-center py-6">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="text-5xl">✅</div>

                <h1 className="text-2xl font-semibold">Order confirmed</h1>

                <div className="space-y-1">
                    <p className="text-sm text-gray-500">Order number</p>
                    <p className="text-lg">{order.orderNumber}</p>
                </div>

                <div className="border rounded-md p-4 text-left space-y-2">
                    {order.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between text-sm"
                        >
                            <span>
                                {item.name} x {item.quantity}
                            </span>
                            <span>
                                $
                                {((item.price * item.quantity) / 100).toFixed(
                                    2
                                )}
                            </span>
                        </div>
                    ))}

                    <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>${(order.total / 100).toFixed(2)}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Link
                        href="/account/orders"
                        className="block rounded-md border py-3 hover:bg-gray-50 transition"
                    >
                        View orders
                    </Link>

                    <Link
                        href="/"
                        className="block rounded-md bg-black py-3 text-white hover:bg-gray-800 transition"
                    >
                        Continue shopping
                    </Link>
                </div>
            </div>
        </section>
    );
}
