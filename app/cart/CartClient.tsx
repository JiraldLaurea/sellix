"use client";

import Image from "next/image";
import Link from "next/link";
import QuantityPicker from "@/components/cart/QuantityPicker";
import { useRouter } from "next/navigation";
import { updateCartQuantity } from "@/lib/cart/update-cart-quantity";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";
import { IoIosArrowBack } from "react-icons/io";

type CartClientProps = {
    cart: any; // we’ll type this later
};

export default function CartClient({ cart }: CartClientProps) {
    const router = useRouter();
    const { refreshCart } = useCart();

    const items = cart?.items ?? [];

    if (items.length === 0) {
        return (
            <section className="pb-16 text-center flex flex-col items-center min-h-[calc(100vh-64px)] justify-center">
                <h1 className="text-2xl mb-4">Your cart is empty</h1>
                <Link
                    href="/"
                    className="inline-block rounded-md bg-accent text-white px-6 py-3 hover:bg-gray-800 transition"
                >
                    Continue shopping
                </Link>
            </section>
        );
    }

    const subtotal = cart.items.reduce(
        (sum: number, item: any) => sum + item.product.price * item.quantity,
        0
    );

    const total = subtotal;

    async function updateQuantity(cartItemId: string, quantity: number) {
        const result = await updateCartQuantity(cartItemId, quantity);

        if (!result.success) {
            toast.error("Unable to update quantity");
            return;
        }

        await refreshCart();
        router.refresh();
    }

    async function removeItem(cartItemId: string) {
        await fetch("/api/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartItemId }),
        });

        await refreshCart();
        router.refresh();
    }

    console.log("LENGTH", items.length);

    return (
        <section className="p-8 max-w-3xl mx-auto rounded-lg my-6">
            <div
                onClick={() => router.back()}
                className="text-gray-600 cursor-pointer hover:underline flex items-center w-fit mb-6"
            >
                <IoIosArrowBack size={24} />
                <p>Back</p>
            </div>
            <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>

            <div className="space-y-4">
                {cart.items.map((item: any, index: number) => (
                    <div
                        key={item.id}
                        className={`flex gap-4  pb-4 ${
                            index === items.length - 1 ? "" : "border-b"
                        }`}
                    >
                        <div className="relative w-24 h-24 bg-gray-100 rounded-md overflow-hidden">
                            <Image
                                src={item.product.images[0]}
                                alt={item.product.name}
                                fill
                                className="object-cover"
                            />
                        </div>

                        <div className="grow flex flex-col justify-between">
                            <div>
                                <Link
                                    className="font-medium"
                                    href={`/product/${item.product.id}`}
                                >
                                    {item.product.name}
                                </Link>
                                <p className="text-sm text-gray-600">
                                    ${(item.product.price / 100).toFixed(2)}
                                </p>
                            </div>

                            <QuantityPicker
                                quantity={item.quantity}
                                max={item.product.stock}
                                onChange={(next) =>
                                    updateQuantity(item.id, next)
                                }
                            />
                        </div>

                        <div className="flex flex-col justify-between items-end">
                            <div className="font-medium">
                                $
                                {(
                                    (item.product.price * item.quantity) /
                                    100
                                ).toFixed(2)}
                            </div>

                            <button
                                onClick={() => removeItem(item.id)}
                                className="text-sm text-red-600 hover:underline"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="border-t pt-6 space-y-6">
                <div className="space-y-2">
                    <div className="flex justify-between text-base">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="font-medium">
                            ${(subtotal / 100).toFixed(2)}
                        </span>
                    </div>
                    <div className="flex justify-between text-lg font-semibold">
                        <span>Total</span>
                        <span>${(total / 100).toFixed(2)}</span>
                    </div>
                </div>

                <div className="sm:flex sm:justify-end">
                    <Link href="/checkout">
                        <button className="rounded-md w-full sm:w-fit bg-accent text-white px-6 py-3 hover:bg-gray-800 transition">
                            Proceed to Checkout
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
