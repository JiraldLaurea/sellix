"use client";

import { useState } from "react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { Button } from "../ui/Button";

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

        toast.success("Order Cancelled Successfully");
        router.push("/orders/");
    }

    return (
        <div className="flex gap-3 justify-end w-full">
            <Button
                className="sm:w-fit!"
                variant="secondary"
                disabled={loading}
                onClick={handleCancel}
            >
                {loading ? "Cancelling…" : "Cancel Order"}
            </Button>
            <Button
                className="sm:w-fit!"
                disabled={loading}
                onClick={() => router.push(`/orders//${orderNumber}/pay`)}
            >
                Complete Payment
            </Button>
        </div>
    );
}
