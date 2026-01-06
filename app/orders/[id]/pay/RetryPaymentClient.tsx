"use client";

import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "@/components/PaymentForm";

const stripePromise = loadStripe(
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export default function RetryPaymentClient({
    orderNumber,
    clientSecret,
}: {
    orderNumber: string;
    clientSecret: string;
}) {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
            <div className="w-full max-w-xl bg-white border p-8 rounded-lg">
                <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <PaymentForm orderNumber={orderNumber} />
                </Elements>
            </div>
        </div>
    );
}
