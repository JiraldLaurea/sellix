"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function CheckoutDialog({
    children,
}: {
    children: React.ReactNode;
}) {
    const { state, dispatch } = useCart();
    const router = useRouter();
    const [isProcessing, setIsProcessing] = useState(false);

    const total = state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const handleCheckout = async () => {
        if (isProcessing) return;

        setIsProcessing(true);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    items: state.items,
                    total,
                }),
            });

            if (!res.ok) {
                throw new Error("Checkout failed");
            }

            // ✅ parse response JSON
            const data = await res.json();

            // ✅ Order is now persisted in DB
            dispatch({ type: "CLEAR_CART" });

            router.push(`/order-success?order=${data.orderNumber}`);
        } catch (error) {
            console.error(error);
            setIsProcessing(false);
        }
    };

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>{children}</Dialog.Trigger>

            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50" />

                <Dialog.Content className="fixed z-100 top-1/2 left-1/2 w-[90vw] max-w-md -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 shadow-lg">
                    <Dialog.Title className="text-lg font-semibold mb-4">
                        Confirm checkout
                    </Dialog.Title>

                    <ul className="space-y-2 text-sm">
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

                    <div className="border-t mt-4 pt-4 flex justify-between font-medium">
                        <span>Total</span>
                        <span>${(total / 100).toFixed(2)}</span>
                    </div>

                    <div className="mt-6 flex gap-3">
                        <Dialog.Close asChild>
                            <button
                                disabled={isProcessing}
                                className="flex-1 border rounded-md py-2"
                            >
                                Cancel
                            </button>
                        </Dialog.Close>

                        <button
                            disabled={isProcessing}
                            onClick={handleCheckout}
                            className="flex-1 bg-accent text-white rounded-md py-2 hover:bg-gray-800 disabled:opacity-50"
                        >
                            {isProcessing ? "Placing order…" : "Place order"}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
