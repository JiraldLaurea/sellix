"use client";

import QuantityPicker from "@/components/cart/QuantityPicker";
import OrderBreakdown from "@/components/order/OrderBreakdown";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { useCart } from "@/lib/cart-context";
import { formatMoney } from "@/lib/formatMoney";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import { IoIosArrowBack } from "react-icons/io";

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
                    <h1 className="text-2xl font-semibold mb-1">
                        Your cart is empty
                    </h1>
                    <p className="text-gray-600">
                        You haven't added anything to your cart yet.
                    </p>
                </div>

                <Link
                    href="/"
                    className="rounded-md bg-accent text-white px-6 py-3 hover:bg-gray-800 transition"
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
            <div
                onClick={() => router.back()}
                className="flex items-center gap-1 text-gray-600 cursor-pointer hover:underline w-fit mb-6"
            >
                <IoIosArrowBack size={20} />
                <span>Back</span>
            </div>
            <div className="flex gap-8 flex-col lg:flex-row">
                {/* LEFT: ITEMS */}
                <div className="sm:grow">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">
                            Cart
                            {`(${items.length} ${
                                items.length === 1 ? "item" : "items"
                            })`}
                        </h1>
                        <button
                            onClick={clearCart}
                            className="border px-3 rounded-lg flex items-center space-x-1 text-sm font-medium border-red-300 hover:bg-red-50 transition-colors text-red-500 py-2"
                        >
                            <HiOutlineTrash size={18} />
                            <p>Clear Cart</p>
                        </button>
                    </div>
                    <div className="overflow-x-auto">
                        <div className="min-w-160">
                            {/* Header */}
                            <div className="grid grid-cols-[80px_1fr_120px_100px_40px] h-8 border-b gap-4 text-sm text-gray-600">
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
                                        className="grid grid-cols-[80px_1fr_120px_100px_40px] gap-4 py-6 items-center"
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
                                            className="flex justify-center items-center h-10 w-10 rounded-full text-red-500 hover:bg-red-50 transition-colors"
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
                <Container className="lg:max-w-sm border p-6 sm:p-8 lg:sticky lg:top-24 h-fit">
                    {/* <div className="border rounded-lg text-sm p-8 h-fit sm:sticky sm:top-24"> */}
                    <h2 className="text-2xl font-semibold mb-4">Summary</h2>
                    <OrderBreakdown
                        subtotal={subtotal}
                        shippingFee={SHIPPING_FEE}
                        tax={tax}
                        total={total}
                        removeTopBorder
                    />
                    <Button
                        className="mt-4"
                        onClick={() => router.push("/checkout")}
                    >
                        Checkout
                    </Button>
                </Container>
            </div>
        </section>
    );
}
