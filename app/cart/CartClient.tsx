"use client";

import QuantityPicker from "@/components/cart/QuantityPicker";
import { useCart } from "@/lib/cart-context";
import { updateCartQuantity } from "@/lib/cart/update-cart-quantity";
import { formatMoney } from "@/lib/formatMoney";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { HiOutlineTrash } from "react-icons/hi2";
import { IoIosArrowBack } from "react-icons/io";
import { toast } from "sonner";

type CartItem = {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        stock: number;
        images: string[];
    };
};

type Cart = {
    items: CartItem[];
};

type CartClientProps = {
    cart: Cart | null;
};

export default function CartClient({ cart }: CartClientProps) {
    const router = useRouter();
    const { refreshCart } = useCart();

    const items = cart?.items ?? [];

    if (items.length === 0) {
        return (
            <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center">
                <h1 className="text-2xl mb-4">Your cart is empty</h1>
                <Link
                    href="/"
                    className="rounded-md bg-accent text-white px-6 py-3 hover:bg-gray-800 transition"
                >
                    Continue shopping
                </Link>
            </section>
        );
    }

    const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );

    const SHIPPING_FEE = 1500; // $15.00
    const TAX_RATE = 0.07;

    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + SHIPPING_FEE + tax;

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

    return (
        <section className="max-w-6xl py-6 mx-auto">
            {/* Back */}
            <div
                onClick={() => router.back()}
                className="flex items-center gap-1 text-gray-600 cursor-pointer hover:underline w-fit mb-6"
            >
                <IoIosArrowBack size={20} />
                <span>Back</span>
            </div>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Cart</h1>
                <p className="text-gray-600">
                    {items.length} {items.length === 1 ? "item" : "items"}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
                {/* LEFT: ITEMS */}
                <div>
                    <div className="overflow-x-auto">
                        <div className="min-w-160">
                            {/* Header */}
                            <div className="grid grid-cols-[80px_1fr_140px_120px_40px] h-8 border-b gap-4 text-sm text-gray-600">
                                <span>Items</span>
                                <span />
                                <span className="text-center">Qty</span>
                                <span className="text-right">Subtotal</span>
                                <span />
                            </div>

                            {/* Rows */}
                            <div className="divide-y">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="grid grid-cols-[80px_1fr_140px_120px_40px] gap-4 py-6 items-center"
                                    >
                                        {/* Image */}
                                        <div className="relative w-20 h-20 bg-gray-100 rounded-md overflow-hidden shrink-0">
                                            <Image
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>

                                        {/* Product info */}
                                        <div className="min-w-0">
                                            <Link
                                                href={`/product/${item.product.id}`}
                                                className="font-medium text-sm hover:underline block truncate"
                                            >
                                                {item.product.name}
                                            </Link>
                                            <p className="text-sm text-gray-500">
                                                {formatMoney(
                                                    item.product.price
                                                )}
                                            </p>
                                        </div>

                                        {/* Qty */}
                                        <div className="flex justify-center">
                                            <QuantityPicker
                                                quantity={item.quantity}
                                                max={item.product.stock}
                                                onChange={(next) =>
                                                    updateQuantity(
                                                        item.id,
                                                        next
                                                    )
                                                }
                                            />
                                        </div>

                                        {/* Subtotal */}
                                        <div className="text-right font-medium whitespace-nowrap">
                                            {formatMoney(
                                                item.product.price *
                                                    item.quantity
                                            )}
                                        </div>

                                        {/* Remove */}
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="flex justify-center items-center h-10 w-10 rounded-full text-gray-500 hover:bg-gray-100 transition-colors"
                                            aria-label="Remove item"
                                        >
                                            <HiOutlineTrash size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: SUMMARY */}
                <div className="border rounded-lg p-6 h-fit sm:sticky sm:top-24">
                    <h2 className="text-lg font-semibold mb-4">Summary</h2>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Subtotal</span>
                            <span>{formatMoney(subtotal)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Shipping</span>
                            <span>{formatMoney(SHIPPING_FEE)}</span>
                        </div>

                        <div className="flex justify-between">
                            <span className="text-gray-600">Tax (7%)</span>
                            <span>{formatMoney(tax)}</span>
                        </div>

                        <div className="border-t pt-3 flex justify-between font-semibold text-base">
                            <span>Total</span>
                            <span>{formatMoney(total)}</span>
                        </div>
                    </div>

                    <Link href="/checkout">
                        <button className="mt-6 w-full rounded-md bg-accent text-white py-3 hover:bg-gray-800 transition">
                            Checkout
                        </button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
