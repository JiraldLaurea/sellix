"use client";

import { useCart } from "@/lib/cart-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StripeProvider from "@/components/StripeProvider";
import PaymentForm from "@/components/PaymentForm";
import { formatMoney } from "@/lib/formatMoney";
import { toast } from "sonner";

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
        0
    );

    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + SHIPPING_FEE + tax;

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
                    : "Something went wrong. Please try again."
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
            <div className="w-full max-w-xl bg-white border p-8 rounded-lg space-y-6 my-6">
                <div>
                    <h1 className="text-2xl font-semibold mb-4">
                        Pending payment detected
                    </h1>
                    <p className="text-sm text-amber-600 bg-amber-100 p-4 rounded-lg">
                        You have an unfinished payment with the following items.
                        You can continue payment or cancel and start a new
                        checkout.
                    </p>
                </div>

                <div className="space-y-2 text-sm border rounded-lg p-4">
                    <ul className="space-y-3">
                        {pendingItems.map((item) => (
                            <li key={item.id} className="flex justify-between">
                                <span>
                                    {item.name} x {item.quantity}
                                </span>
                                <span>
                                    {formatMoney(item.price * item.quantity)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <hr className="my-4" />

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>{formatMoney(pendingSubtotal)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span>{formatMoney(pendingShipping)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax</span>
                            <span>{formatMoney(pendingTax)}</span>
                        </div>

                        <hr className="my-4" />

                        <div className="flex justify-between font-medium text-base">
                            <span>Total</span>
                            <span>{formatMoney(pendingTotal)}</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        disabled={cancelling}
                        onClick={() =>
                            router.push(`/orders/${pendingOrder}/pay`)
                        }
                        className="w-full rounded-lg bg-accent py-3 text-white hover:bg-gray-800 transition disabled:opacity-50"
                    >
                        Continue Payment
                    </button>

                    <button
                        disabled={cancelling}
                        onClick={async () => {
                            setCancelling(true);
                            await fetch(`/api/orders/${pendingOrder}/cancel`, {
                                method: "POST",
                            });
                            setPendingOrder(null);
                            setPendingItems([]);
                            setPendingTotal(0);
                            setCancelling(false);
                            toast.success("Order Cancelled Successfully");
                        }}
                        className="w-full rounded-lg border py-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        {cancelling ? "Cancelling…" : "Cancel and Start New"}
                    </button>

                    <button
                        disabled={cancelling}
                        onClick={() => router.push("/orders")}
                        className="w-full rounded-lg border py-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        View my Orders
                    </button>
                    <button
                        disabled={cancelling}
                        onClick={() => router.push("/cart")}
                        className="w-full rounded-lg border py-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        View Cart
                    </button>
                </div>
            </div>
        );
    }

    /* ======================================================
       Checkout UI
    ====================================================== */
    return (
        <div className="w-full max-w-xl bg-white border p-8 rounded-lg my-6">
            {!clientSecret && (
                <>
                    <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

                    <ul className="space-y-3 text-sm">
                        {state.items.map((item) => (
                            <li
                                key={item.product.id}
                                className="flex justify-between"
                            >
                                <span>
                                    {item.product.name} x {item.quantity}
                                </span>
                                <span>
                                    {formatMoney(
                                        item.product.price * item.quantity
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <hr className="my-4" />

                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>{formatMoney(subtotal)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span>{formatMoney(SHIPPING_FEE)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax (7%)</span>
                            <span>{formatMoney(tax)}</span>
                        </div>
                        <hr className="my-4" />
                        <div className="flex justify-between font-medium text-base">
                            <span>Total</span>
                            <span>{formatMoney(total)}</span>
                        </div>
                    </div>

                    {error && (
                        <p className="mt-4 text-sm text-red-500">{error}</p>
                    )}

                    <button
                        onClick={handleCheckout}
                        disabled={loading}
                        className="mt-6 w-full rounded-md bg-accent py-3 text-white disabled:opacity-50 hover:bg-gray-800 transition"
                    >
                        {loading ? "Preparing payment…" : "Proceed to Payment"}
                    </button>
                </>
            )}

            {clientSecret && orderNumber && (
                <>
                    <h1 className="text-2xl font-semibold mb-6">Payment</h1>

                    <StripeProvider clientSecret={clientSecret}>
                        <PaymentForm orderNumber={orderNumber} />
                    </StripeProvider>
                </>
            )}
        </div>
    );
}
