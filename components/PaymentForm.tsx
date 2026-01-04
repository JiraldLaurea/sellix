"use client";

import {
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PaymentForm({
    orderNumber,
    onSuccess,
}: {
    orderNumber: string;
    onSuccess: () => void;
}) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!stripe || !elements) return;

        setLoading(true);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/order/success?order=${orderNumber}`,
            },
            redirect: "if_required",
        });

        if (error) {
            setError(error.message ?? "Payment failed");
            setLoading(false);
            return;
        }

        // If no redirect was needed, manually push
        if (!error) {
            onSuccess();
            router.push(`/order-success?order=${orderNumber}`);
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <PaymentElement />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={!stripe || loading}
                className="mt-6 w-full rounded bg-accent py-3 text-white disabled:opacity-50 hover:bg-gray-800 transition"
            >
                {loading ? "Processing…" : "Pay now"}
            </button>
        </form>
    );
}
