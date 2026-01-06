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

    const total = state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
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

    return (
        <div className="w-full max-w-xl bg-white border p-8 rounded-lg">
            {/* =========================
                STEP 1 — ORDER SUMMARY
            ========================== */}
            {!clientSecret && (
                <>
                    <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

                    <ul className="space-y-3 text-sm">
                        {state.items.map(({ product, quantity }) => (
                            <li
                                key={product.id}
                                className="flex justify-between"
                            >
                                <span>
                                    {product.name} x {quantity}
                                </span>
                                <span>
                                    $
                                    {((product.price * quantity) / 100).toFixed(
                                        2
                                    )}
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
