"use client";

import CartSkeleton from "@/components/cart/CartSkeleton";
import QuantityPicker from "@/components/cart/QuantityPicker";
import OrderBreakdown from "@/components/order/OrderBreakdown";
import AddToFavoriteButton from "@/components/product/AddToFavoriteButton";
import { BackButton } from "@/components/ui/BackButton";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import PageContainer from "@/components/ui/PageContainer";
import { Spinner } from "@/components/ui/Spinner";
import { useCart } from "@/lib/cart-context";
import { formatMoney } from "@/lib/formatMoney";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useState } from "react";
import { HiOutlineTrash } from "react-icons/hi2";
import { CartItem, Product } from "../types";

type Cart = {
    items: CartItem[];
};

type CartClientProps = {
    cart: Cart | null;
};

export default function CartClient({ cart }: CartClientProps) {
    const router = useRouter();
    const {
        state,
        loading,
        clearingCartItem,
        hydrateCart,
        removeCartItem,
        clearCart,
        updateQuantity,
    } = useCart();
    const [clearingCart, setClearingCart] = useState(false);
    // const [clearingCartItem, setClearingCartItem] = useState(false);

    useEffect(() => {
        if (state.items.length === 0 && cart?.items) {
            hydrateCart(cart.items);
        }
    }, [cart]);

    const items = state.items;

    async function handleRemoveCartItem(cartItemId: string) {
        await removeCartItem(cartItemId);
    }

    async function handleClearCart() {
        setClearingCart(true);
        await clearCart();
        setClearingCart(false);
    }

    const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
    );

    const SHIPPING_FEE = 1500; // $15.00
    const TAX_RATE = 0.07;

    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + SHIPPING_FEE + tax;

    // LOADING CART
    if (loading)
        return (
            <PageContainer>
                <CartSkeleton />
            </PageContainer>
        );

    // EMPTY CART
    if (items.length === 0) {
        return (
            <PageContainer className="flex flex-col items-center justify-center space-y-6 text-center min-h-[calc(100vh-64px)]">
                <div className="p-4 bg-gray-100 rounded-lg">
                    <HiOutlineTrash size={30} className="text-gray-400" />
                </div>
                <div className="text-gray-500 space-y-1">
                    <h1 className="mb-1 text-lg font-medium">
                        Your cart is empty
                    </h1>
                    <p className="text-sm">
                        You haven't added anything to your cart yet
                    </p>
                </div>
                <Button
                    className="h-12 w-fit!"
                    onClick={() => router.push("/")}
                >
                    Start shopping
                </Button>
            </PageContainer>
        );
    }

    return (
        <PageContainer className="min-h-[calc(100vh-64px)]">
            {/* Back */}
            <BackButton text="Back" />
            <div className="flex flex-col mt-4 sm:gap-6 lg:flex-row">
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
                            disabled={clearingCart}
                            onClick={handleClearCart}
                            className="disabled:opacity-50 hover:bg-gray-100 disabled:hover:bg-inherit flex items-center h-10 w-31.25 justify-center space-x-2 text-sm border transition-colors rounded-lg"
                        >
                            {clearingCart ? (
                                <Spinner borderColor="border-black" />
                            ) : (
                                <>
                                    <HiOutlineTrash size={18} />{" "}
                                    <p>Clear Cart </p>
                                </>
                            )}
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
                                                        `/product/${item.product.id}`,
                                                    )
                                                }
                                                className="p-4 overflow-hidden bg-gray-100 border cursor-pointer sm:w-40 sm:h-40 w-30 h-30 shrink-0"
                                            >
                                                <div className="relative w-full aspect-square">
                                                    <Image
                                                        src={
                                                            item.product
                                                                .images[0]
                                                        }
                                                        alt={item.product.name}
                                                        fill
                                                        sizes="10vw"
                                                        className="object-cover"
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex justify-center">
                                                {/* Qty */}
                                                <div className="flex justify-between space-x-1">
                                                    <QuantityPicker
                                                        quantity={item.quantity}
                                                        max={item.product.stock}
                                                        onChange={(next) =>
                                                            updateQuantity(
                                                                item.id,
                                                                next,
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
                                                    className="font-medium hover:underline"
                                                >
                                                    {item.product.name}
                                                </Link>
                                                <p className="text-sm text-gray-500 sm:text-base">
                                                    {formatMoney(
                                                        item.product.price,
                                                    )}
                                                </p>
                                            </div>
                                            <div className="flex flex-row items-end justify-between sm:flex-col sm:items-end grow">
                                                {/* Subtotal */}
                                                <p className="flex items-center h-9 sm:h-10 font-medium">
                                                    {formatMoney(
                                                        item.product.price *
                                                            item.quantity,
                                                    )}
                                                </p>
                                                {/* Remove */}
                                                <div className="flex flex-col items-end justify-end w-full gap-2 sm:flex-row">
                                                    <AddToFavoriteButton
                                                        className="rounded-full! h-10! w-10!"
                                                        buttonType="mini"
                                                        product={
                                                            item.product as Product
                                                        }
                                                    />
                                                    <button
                                                        disabled={
                                                            clearingCartItem ===
                                                            item.id
                                                        }
                                                        onClick={() => {
                                                            handleRemoveCartItem(
                                                                item.id,
                                                            );
                                                        }}
                                                        className="flex items-center disabled:opacity-50 justify-center w-10 h-10 transition-colors border rounded-full hover:bg-gray-100"
                                                        aria-label="Remove item"
                                                    >
                                                        {clearingCartItem ===
                                                        item.id ? (
                                                            <div className="flex items-center justify-center h-full">
                                                                <Spinner borderColor="border-black" />
                                                            </div>
                                                        ) : (
                                                            <HiOutlineTrash
                                                                size={18}
                                                            />
                                                        )}
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
                <Container className="p-0 pt-6 border-t rounded-none sm:border sm:rounded-xl lg:max-w-sm sm:p-6 lg:sticky lg:top-24 h-fit">
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
                        disabled={clearingCart}
                        className="mt-4"
                        onClick={() => {
                            router.push("/checkout");
                        }}
                    >
                        Checkout
                    </Button>
                </Container>
            </div>
        </PageContainer>
    );
}
