"use client";

import PaymentForm from "@/components/PaymentForm";
import StripeProvider from "@/components/StripeProvider";
import { Container } from "@/components/ui/Container";

export default function RetryPaymentClient({
    orderNumber,
    clientSecret,
}: {
    orderNumber: string;
    clientSecret: string;
}) {
    return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center">
            <Container>
                <StripeProvider clientSecret={clientSecret}>
                    <PaymentForm orderNumber={orderNumber} />
                </StripeProvider>
            </Container>
        </div>
    );
}
