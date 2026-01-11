"use client";

import OrderBreakdown from "@/components/order/OrderBreakdown";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import PageContainer from "@/components/ui/PageContainer";
import { useCart } from "@/lib/cart-context";
import { formatMoney } from "@/lib/formatMoney";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";

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
                <div className="space-y-4 text-center">
                    <div className="w-8 h-8 mx-auto border-2 border-black rounded-full animate-spin border-t-transparent" />
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
        // <section className="min-h-[calc(100vh-64px)] flex items-center justify-center py-8">
        <PageContainer className="flex items-center justify-center">
            <div className="flex flex-col items-center w-full max-w-xl space-y-6 text-center">
                <div className="space-y-4">
                    <div className="flex flex-col items-center space-y-2">
                        <FaCheckCircle size={60} className="text-green-500" />
                        <h1 className="text-2xl font-semibold">
                            Order confirmed
                        </h1>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm text-gray-500">Order number</p>
                        <p className="text-lg">{order.orderNumber}</p>
                    </div>
                </div>

                {/* Items */}
                <Container className="my-0 sm:border sm:p-8">
                    <h1 className="mb-6 text-2xl font-semibold text-left">
                        Ordered Items
                    </h1>
                    <ul className="space-y-2">
                        {order.items.map((item) => (
                            <li
                                key={item.id}
                                className="flex justify-between space-x-6"
                            >
                                <ul className="truncate">
                                    {item.quantity} x {item.name}
                                </ul>
                                <ul>
                                    {formatMoney(item.price * item.quantity)}
                                </ul>
                            </li>
                        ))}
                    </ul>
                    {/* Breakdown */}
                    <OrderBreakdown
                        subtotal={computedSubtotal}
                        shippingFee={computedShipping}
                        tax={computedTax}
                        total={order.total}
                    />
                    <div className="mt-4 space-y-3">
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
                </Container>

                {/* Actions */}
            </div>
        </PageContainer>
    );
}
