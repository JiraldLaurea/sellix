"use client";

import { useCart } from "@/lib/cart-context";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import StripeProvider from "@/components/StripeProvider";
import PaymentForm from "@/components/PaymentForm";

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
    const [pendingTotal, setPendingTotal] = useState<number>(0);
    const [cancelling, setCancelling] = useState(false);

    const total = state.items.reduce(
        (sum: number, item) => sum + item.product.price * item.quantity,
        0
    );

    async function handleCheckout() {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    items: state.items,
                    total,
                }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Checkout failed");
            }

            const data = await res.json();

            if (data.hasPendingOrder) {
                setPendingOrder(data.orderNumber);

                // 🔄 Fetch pending order details
                const res = await fetch(`/api/orders/${data.orderNumber}`);
                const order = await res.json();

                setPendingItems(order.items);
                setPendingTotal(order.total);

                setLoading(false);
                return;
            }

            // ✅ This triggers Stripe Elements rendering
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

    // ⛔ Redirect if cart empty and no payment in progress
    useEffect(() => {
        if (state.items.length === 0 && !clientSecret) {
            router.replace("/cart");
        }
    }, [state.items.length, clientSecret, router]);

    if (state.items.length === 0 && !clientSecret) {
        return null;
    }

    if (pendingOrder) {
        return (
            <div className="w-full max-w-xl bg-white border p-8 rounded-lg space-y-6 my-6">
                <div>
                    <h1 className="text-2xl font-semibold mb-4">
                        Pending payment detected
                    </h1>
                    <p className="text-sm text-amber-600">
                        You have an unfinished payment with the following items.
                        You can continue payment or cancel and start a new
                        checkout.
                    </p>
                </div>

                {/* 🧾 Pending order items */}
                <div className="border rounded-md p-4 space-y-2 text-sm">
                    {pendingItems.map((item: PendingOrderItem) => (
                        <div key={item.id} className="flex justify-between">
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
                        <span>${(pendingTotal / 100).toFixed(2)}</span>
                    </div>
                </div>

                {/* 🔘 Actions */}
                <div className="space-y-3">
                    <button
                        disabled={cancelling}
                        onClick={() =>
                            router.push(`/orders//${pendingOrder}/pay`)
                        }
                        className="w-full rounded-md bg-accent py-3 text-white hover:bg-gray-800 transition disabled:opacity-50"
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

                            // Reset pending state
                            setPendingOrder(null);
                            setPendingItems([]);
                            setPendingTotal(0);
                            setCancelling(false);

                            // // 🔁 Resume checkout flow automatically
                            // handleCheckout();
                        }}
                        className="w-full rounded-md border py-3 hover:bg-gray-100 transition-colors disabled:opacity-50"
                    >
                        {cancelling ? "Cancelling…" : "Cancel and Start New"}
                    </button>

                    <button
                        disabled={cancelling}
                        onClick={() => router.push("/orders/")}
                        className="w-full rounded-md border py-3 hover:bg-gray-100 transition-colors"
                    >
                        View my Orders
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-xl bg-white border p-8 rounded-lg my-6">
            {/* =========================
                STEP 1 — ORDER SUMMARY
            ========================== */}
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
                                    $
                                    {(
                                        (item.product.price * item.quantity) /
                                        100
                                    ).toFixed(2)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    <div className="border-t mt-6 pt-4 flex justify-between font-medium">
                        <span>Total</span>
                        <span>${(total / 100).toFixed(2)}</span>
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

            {/* =========================
                STEP 2 — STRIPE PAYMENT
            ========================== */}
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
