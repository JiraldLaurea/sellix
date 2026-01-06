"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

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
        router.push("/account/orders");
    }

    return (
        <div className="flex gap-3">
            <button
                disabled={loading}
                onClick={handleCancel}
                className="rounded-md border px-6 py-2 hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
                {loading ? "Cancelling…" : "Cancel Order"}
            </button>
            <button
                disabled={loading}
                onClick={() =>
                    router.push(`/account/orders/${orderNumber}/pay`)
                }
                className="rounded-md bg-black px-6 py-2 text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
            >
                Complete Payment
            </button>
        </div>
    );
}
