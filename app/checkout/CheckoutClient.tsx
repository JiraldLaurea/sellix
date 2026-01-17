"use client";

import OrderBreakdown from "@/components/order/OrderBreakdown";
import PaymentForm from "@/components/PaymentForm";
import StripeProvider from "@/components/StripeProvider";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Spinner } from "@/components/ui/Spinner";
import { useCart } from "@/lib/cart-context";
import { formatMoney } from "@/lib/formatMoney";
import { showSuccessToast } from "@/lib/toast/showSuccessToast";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";

export default function CheckoutClient() {
    const { state } = useCart();
    const router = useRouter();

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    type PendingOrderItem = {
        id: string;
        name: string;
        price: number;
        quantity: number;
    };

    const [pendingOrder, setPendingOrder] = useState<string | null>(null);
    const [pendingItems, setPendingItems] = useState<PendingOrderItem[]>([]);
    const [pendingSubtotal, setPendingSubtotal] = useState<number>(0);
    const [pendingShipping, setPendingShipping] = useState<number>(0);
    const [pendingTax, setPendingTax] = useState<number>(0);
    const [pendingTotal, setPendingTotal] = useState<number>(0);
    const [cancelling, setCancelling] = useState(false);

    /* ======================================================
       Pricing (DISPLAY ONLY — server is source of truth)
    ====================================================== */
    const SHIPPING_FEE = 1500; // $15.00
    const TAX_RATE = 0.07;

    const subtotal = state.items.reduce(
        (sum: number, item) => sum + item.product.price * item.quantity,
        0,
    );

    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + SHIPPING_FEE + tax;

    /* ======================================================
       Cancel Order
    ====================================================== */

    async function handleCancelOrder() {
        setCancelling(true);
        await fetch(`/api/orders/${pendingOrder}/cancel`, {
            method: "POST",
        });
        setPendingOrder(null);
        setPendingItems([]);
        setPendingTotal(0);
        setCancelling(false);
        showSuccessToast("Order Cancelled Successfully");
    }

    /* ======================================================
       Checkout
    ====================================================== */
    async function handleCheckout() {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Checkout failed");
            }

            const data = await res.json();

            if (data.hasPendingOrder) {
                setPendingOrder(data.orderNumber);

                const res = await fetch(`/api/orders/${data.orderNumber}`);
                const order = await res.json();

                setPendingItems(order.items);
                setPendingSubtotal(order.subtotal);
                setPendingShipping(order.shipping);
                setPendingTax(order.tax);
                setPendingTotal(order.total);

                setLoading(false);
                return;
            }

            setClientSecret(data.clientSecret);
            setOrderNumber(data.orderNumber);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again.",
            );
            setLoading(false);
        }
    }

    /* ======================================================
       Redirect if cart empty
    ====================================================== */
    useEffect(() => {
        if (state.items.length === 0 && !clientSecret) {
            router.replace("/cart");
        }
    }, [state.items.length, clientSecret, router]);

    if (state.items.length === 0 && !clientSecret) {
        return null;
    }

    /* ======================================================
       Pending order UI (unchanged)
    ====================================================== */
    if (pendingOrder) {
        return (
            <Container>
                <div>
                    <h1 className="mb-6 text-2xl font-semibold">
                        Pending payment detected
                    </h1>
                    <div className="flex items-center px-4 py-3 space-x-2 space-y-2 text-sm rounded-lg sm:py-4 sm:px-6 text-amber-600 bg-amber-100">
                        <p>
                            You have an unfinished payment with the following
                            items. You can continue payment or cancel and start
                            a new checkout.
                        </p>
                    </div>
                </div>

                <div className="mt-6 mb-4 rounded-lg sm:p-6 sm:border">
                    <ul className="space-y-2">
                        {pendingItems ? (
                            <>
                                {pendingItems.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex justify-between space-x-6"
                                    >
                                        <ul className="truncate">
                                            {item.quantity} x {item.name}
                                        </ul>
                                        <ul>
                                            {formatMoney(
                                                item.price * item.quantity,
                                            )}
                                        </ul>
                                    </li>
                                ))}
                            </>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <div className="w-40 h-5 bg-gray-200 rounded-md animate-pulse" />
                                    <div className="w-20 h-5 bg-gray-200 rounded-md animate-pulse" />
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-5 bg-gray-200 rounded-md w-34 animate-pulse" />
                                    <div className="h-5 bg-gray-200 rounded-md w-30 animate-pulse" />
                                </div>
                                <div className="flex justify-between">
                                    <div className="h-5 bg-gray-200 rounded-md w-46 animate-pulse" />
                                    <div className="w-24 h-5 bg-gray-200 rounded-md animate-pulse" />
                                </div>
                            </div>
                        )}
                    </ul>

                    {/* PENDING Breakdown */}
                    <OrderBreakdown
                        subtotal={pendingSubtotal}
                        shippingFee={pendingShipping}
                        tax={pendingTax}
                        total={pendingTotal}
                    />
                </div>

                <div className="space-y-3">
                    <Button
                        disabled={cancelling || loading}
                        onClick={() => {
                            setLoading(true);
                            router.push(`/retry-payment/${pendingOrder}`);
                        }}
                    >
                        {loading ? <Spinner /> : "Continue Payment"}
                    </Button>

                    <div className="flex flex-col items-center gap-3 sm:flex-row">
                        <Button
                            variant="secondary"
                            disabled={cancelling || loading}
                            onClick={handleCancelOrder}
                        >
                            {cancelling ? (
                                <Spinner borderColor="border-black" />
                            ) : (
                                "Cancel and Start New"
                            )}
                        </Button>
                        <Button
                            variant="secondary"
                            onClick={() =>
                                router.push(`/orders/${pendingOrder}`)
                            }
                            disabled={cancelling || loading}
                        >
                            View Order Details
                        </Button>
                    </div>
                </div>
            </Container>
        );
    }

    /* ======================================================
       Checkout UI
    ====================================================== */
    return (
        <Container>
            {!clientSecret && (
                <>
                    <h1 className="mb-6 text-2xl font-semibold">Checkout</h1>

                    <ul className="space-y-2">
                        {state.items.map((item) => (
                            <li
                                key={item.product.id}
                                className="flex justify-between space-x-6"
                            >
                                <ul className="truncate">
                                    {item.quantity}x {item.product.name}
                                </ul>
                                <ul>
                                    {formatMoney(
                                        item.product.price * item.quantity,
                                    )}
                                </ul>
                            </li>
                        ))}
                    </ul>

                    {/* Breakdown */}
                    <OrderBreakdown
                        subtotal={subtotal}
                        shippingFee={SHIPPING_FEE}
                        tax={tax}
                        total={total}
                    />

                    {error && (
                        <p className="mt-4 text-sm text-red-500">{error}</p>
                    )}

                    <Button
                        className="mt-4"
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? <Spinner /> : "Proceed to Payment"}
                    </Button>
                </>
            )}

            {clientSecret && orderNumber && (
                <>
                    <StripeProvider clientSecret={clientSecret}>
                        <PaymentForm orderNumber={orderNumber} />
                    </StripeProvider>
                </>
            )}
        </Container>
    );
}
