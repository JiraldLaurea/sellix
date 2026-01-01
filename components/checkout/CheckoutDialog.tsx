"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { useCart } from "@/lib/cart-context";
import { useRouter } from "next/navigation";

export default function CheckoutDialog({
    children,
}: {
    children: React.ReactNode;
}) {
    const { state, dispatch } = useCart();
    const router = useRouter();

    const total = state.items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

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
                                    {product.name} × {quantity}
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
                            <button className="flex-1 border rounded-md py-2">
                                Cancel
                            </button>
                        </Dialog.Close>

                        <button
                            onClick={() => {
                                dispatch({ type: "SET_CART", items: [] });
                                router.push("/");
                            }}
                            className="flex-1 bg-accent text-white rounded-md py-2 hover:bg-gray-800"
                        >
                            Place order
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}
