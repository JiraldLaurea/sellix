"use client";

import {
    PaymentElement,
    useElements,
    useStripe,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "./ui/Button";

export default function PaymentForm({ orderNumber }: { orderNumber: string }) {
    const stripe = useStripe();
    const elements = useElements();
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!stripe || !elements) {
            setError("Stripe not ready");
            return;
        }

        setLoading(true);
        setError(null);

        // 1️⃣ Validate PaymentElement
        const { error: submitError } = await elements.submit();
        if (submitError) {
            setError(submitError.message ?? "Payment validation failed");
            setLoading(false);
            return;
        }

        // 2️⃣ Confirm payment
        const { error, paymentIntent } = await stripe.confirmPayment({
            elements,
            redirect: "if_required",
        });

        if (error) {
            setError(error.message ?? "Payment failed");
            setLoading(false);
            return;
        }

        // 3️⃣ Payment succeeded → refresh cart UI
        if (paymentIntent?.status === "succeeded") {
            router.push(`/order-success?order=${orderNumber}`);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 text-sm">
            <h1 className="text-2xl font-semibold mb-6">Payment</h1>
            <PaymentElement />
            {error && <p className="text-red-500">{error}</p>}
            <Button buttonType="submit" disabled={!stripe || loading}>
                {loading ? "Processing…" : "Pay now"}
            </Button>
        </form>
    );
}
