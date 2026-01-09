"use client";

import OrderBreakdown from "@/components/order/OrderBreakdown";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-context";
import { formatMoney } from "@/lib/formatMoney";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type OrderStatus = "PENDING" | "PAID" | "FULFILLED" | "REFUNDED";

type Order = {
    orderNumber: string;
    status: OrderStatus;

    subtotal: number;
    shipping: number;
    tax: number;
    total: number;

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
    const { refreshCart } = useCart();

    /* ======================================================
       Poll order until webhook confirms payment
    ====================================================== */
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
                    refreshCart();
                    clearInterval(interval);
                }
            } catch {
                // ignore transient errors
            }

            setAttempts((a) => a + 1);
        }, 1500);

        return () => clearInterval(interval);
    }, [orderNumber, refreshCart]);

    /* ======================================================
       Lock page if webhook never confirms
    ====================================================== */
    useEffect(() => {
        if (
            attempts > 20 &&
            order?.status !== "PAID" &&
            order?.status !== "FULFILLED"
        ) {
            router.replace("/orders");
        }
    }, [attempts, order?.status, router]);

    /* ======================================================
       Loading while webhook confirms
    ====================================================== */
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

    /* ======================================================
       Not paid → no access
    ====================================================== */
    if (order.status !== "PAID" && order.status !== "FULFILLED") {
        return null;
    }

    const SHIPPING_FEE = 1500; // $15.00
    const TAX_RATE = 0.07;

    const computedSubtotal =
        order.subtotal ??
        order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const computedShipping = order.shipping ?? SHIPPING_FEE;

    const computedTax = order.tax ?? Math.round(computedSubtotal * TAX_RATE);

    /* ======================================================
       PAID / FULFILLED
    ====================================================== */
    return (
        <section className="min-h-[calc(100vh-64px)] flex items-center justify-center py-8">
            <div className="max-w-xl w-full space-y-6 text-center">
                <div className="text-5xl">✅</div>

                <h1 className="text-2xl font-semibold">Order confirmed</h1>

                <div className="space-y-1">
                    <p className="text-sm text-gray-500">Order number</p>
                    <p className="text-lg">{order.orderNumber}</p>
                </div>

                {/* Items */}
                <div className="border rounded-lg p-8 text-left space-y-2 text-sm">
                    {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between">
                            <span>
                                {item.name} x {item.quantity}
                            </span>
                            <span>
                                {formatMoney(item.price * item.quantity)}
                            </span>
                        </div>
                    ))}

                    {/* Breakdown */}
                    <OrderBreakdown
                        subtotal={computedSubtotal}
                        shippingFee={computedShipping}
                        tax={computedTax}
                        total={order.total}
                    />
                    <div className="space-y-3 mt-6">
                        <Button
                            onClick={() => {
                                router.push("/");
                            }}
                        >
                            Continue shopping
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                router.push(`/orders/${orderNumber}`)
                            }
                        >
                            View Order Details
                        </Button>
                    </div>
                </div>

                {/* Actions */}
            </div>
        </section>
    );
}
