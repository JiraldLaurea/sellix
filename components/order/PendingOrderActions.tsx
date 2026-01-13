"use client";

import { showSuccessToast } from "@/lib/toast/showSuccessToast";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";

export default function PendingOrderActions({
    orderNumber,
}: {
    orderNumber: string;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function handleCancel() {
        if (loading) return;

        setLoading(true);

        await fetch(`/api/orders/${orderNumber}/cancel`, {
            method: "POST",
        });

        router.push("/orders/");
        showSuccessToast("Order Cancelled Successfully");
    }

    return (
        <div className="flex gap-3 justify-end w-full">
            <Button
                className="sm:w-34 sm:p-0"
                variant="secondary"
                disabled={loading}
                onClick={handleCancel}
            >
                {loading ? (
                    <Spinner borderColor="border-black" />
                ) : (
                    "Cancel Order"
                )}
            </Button>
            <Button
                className="sm:w-fit!"
                disabled={loading}
                onClick={() => router.push(`/retry-payment/${orderNumber}`)}
            >
                Complete Payment
            </Button>
        </div>
    );
}
