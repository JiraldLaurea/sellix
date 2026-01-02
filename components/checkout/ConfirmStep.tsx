"use client";

import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";

type Props = {
    address: {
        name: string;
        email: string;
        address: string;
        city: string;
        postalCode: string;
    };
    subtotal: number;
    onBack: () => void;
};

export default function ConfirmStep({ address, subtotal, onBack }: Props) {
    const router = useRouter();
    const { state } = useCart();

    const placeOrder = () => {
        // 🔔 Cart clearing already handled in your app
        router.push("/order-success");
    };

    return (
        <div className="space-y-6">
            {/* Shipping address */}
            <div className="border rounded-md p-4">
                <h2 className="font-medium mb-2">Shipping Address</h2>
                <p>{address.name}</p>
                <p>{address.email}</p>
                <p>{address.address}</p>
                <p>
                    {address.city}, {address.postalCode}
                </p>
            </div>

            {/* Order summary */}
            <div className="border rounded-md p-4 space-y-2">
                <h2 className="font-medium mb-2">Order Summary</h2>

                {state.items.map(({ product, quantity }) => (
                    <div
                        key={product.id}
                        className="flex justify-between text-sm"
                    >
                        <span>
                            {product.name} × {quantity}
                        </span>
                        <span>
                            ${((product.price * quantity) / 100).toFixed(2)}
                        </span>
                    </div>
                ))}

                <div className="border-t pt-2 mt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${(subtotal / 100).toFixed(2)}</span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
                <button
                    onClick={onBack}
                    className="flex-1 border rounded-md py-3"
                >
                    Back
                </button>

                <button
                    onClick={placeOrder}
                    className="flex-1 bg-black text-white rounded-md py-3"
                >
                    Place Order
                </button>
            </div>
        </div>
    );
}
