"use client";

import QuantityPicker from "@/components/cart/QuantityPicker";
import OrderBreakdown from "@/components/order/OrderBreakdown";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/lib/cart-context";
import { formatMoney } from "@/lib/formatMoney";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import { CartItem } from "../types";

type Cart = {
    items: CartItem[];
};

type CartClientProps = {
    cart: Cart | null;
};

export default function CartClient({ cart }: CartClientProps) {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const { refreshCart, clearCart, state, updateQuantity, hydrateCart } =
        useCart();

    const items = state.items;

    useEffect(() => {
        if (cart?.items) {
            hydrateCart(cart.items);
        }
    }, []);

    if (items.length === 0) {
        return (
            <section className="min-h-[calc(100vh-64px)] flex flex-col items-center justify-center text-center space-y-6">
                <div className="p-6 bg-gray-100 rounded-lg">
                    <HiOutlineTrash size={40} className="text-gray-500" />
                </div>
                <div>
                    <h1 className="mb-1 text-2xl font-semibold">
                        Your cart is empty
                    </h1>
                    <p className="text-gray-600">
                        You haven't added anything to your cart yet.
                    </p>
                </div>

                <Link
                    href="/"
                    className="px-6 py-3 text-white transition rounded-md bg-accent hover:bg-gray-800"
                >
                    Start shopping
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
        <section className="min-h-fit h-[calc(100vh-64px)] py-8 mx-auto">
            {/* Back */}
            <BackButton text="Back" />
            <div className="flex flex-col gap-6 mt-4 lg:flex-row">
                {/* LEFT: ITEMS */}
                <div className="grow">
                    <div className="flex items-center justify-between mb-2">
                        <h1 className="text-2xl font-semibold">
                            Cart
                            {`(${items.length} ${
                                items.length === 1 ? "item" : "items"
                            })`}
                        </h1>
                        <button
                            onClick={clearCart}
                            className="flex items-center h-10 px-4 space-x-1 text-sm text-white transition-colors rounded-lg bg-accent hover:bg-gray-700"
                        >
                            <HiOutlineTrash size={18} />
                            <p>Clear Cart</p>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="">
                            <div className="divide-y">
                                {items.map((item) => (
                                    <div
                                        key={item.id}
                                        className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-y-2 gap-x-4 py-6 items-center"
                                    >
                                        <div className="space-y-4">
                                            {/* Image */}
                                            <div
                                                onClick={() =>
                                                    router.push(
                                                        `/product/${item.product.id}`
                                                    )
                                                }
                                                className="relative overflow-hidden bg-gray-100 cursor-pointer sm:w-40 sm:h-40 w-30 h-30 shrink-0"
                                            >
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                            <div className="flex justify-center">
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
                                            </div>
                                        </div>

                                        {/* Product info */}
                                        <div className="flex flex-col justify-start h-full pt-2 space-y-4 truncate sm:space-x-4 sm:flex-row">
                                            <div className="truncate">
                                                <Link
                                                    href={`/product/${item.product.id}`}
                                                    className="font-medium sm:text-lg hover:underline"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-sm text-gray-500 sm:text-base">
                                                    {formatMoney(
                                                        item.product.price
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex flex-row items-end justify-between sm:flex-col sm:items-end grow">
                                                {/* Subtotal */}
                                                <p className="flex items-center h-10 font-medium sm:text-lg sm:h-auto">
                                                    {formatMoney(
                                                        item.product.price *
                                                            item.quantity
                                                    )}
                                                </p>
                                                {/* Remove */}
                                                <div className="flex justify-end w-full">
                                                    <button
                                                        onClick={() =>
                                                            removeItem(item.id)
                                                        }
                                                        className="flex items-center justify-center w-10 h-10 transition-colors border rounded-full hover:bg-gray-100"
                                                        aria-label="Remove item"
                                                    >
                                                        <HiOutlineTrash
                                                            size={18}
                                                        />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: SUMMARY */}
                <Container className="p-4 border lg:max-w-sm sm:p-6 lg:sticky lg:top-24 h-fit">
                    {/* <div className="p-8 text-sm border rounded-lg h-fit sm:sticky sm:top-24"> */}
                    <h2 className="mb-4 text-2xl font-semibold">Summary</h2>
                    <OrderBreakdown
                        subtotal={subtotal}
                        shippingFee={SHIPPING_FEE}
                        tax={tax}
                        total={total}
                        removeTopBorder
                    />
                    <Button
                        disabled={loading}
                        className="mt-4"
                        onClick={() => {
                            setLoading(true);
                            router.push("/checkout");
                        }}
                    >
                        {loading ? "Preparing Checkout…" : "Checkout"}
                    </Button>
                </Container>
            </div>
        </section>
    );
}
