"use client";

import { Product } from "@/app/types/product";
import { useCart } from "@/lib/cart-context";
import { addToCart } from "@/lib/cart/add-to-cart";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { toast } from "sonner";

type ButtonType = "regular" | "mini";

type AddToCartButtonProps = {
    product: Product;
    quantity: number;
    className?: string;
    buttonType: ButtonType;
};

export default function AddToCartButton({
    product,
    quantity,
    className,
    buttonType,
}: AddToCartButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { refreshCart } = useCart();

    function delay(ms: number) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function handleAddToCart() {
        setLoading(true);

        const MIN_LOADING_TIME = 800; // ms

        const [result] = await Promise.all([
            addToCart(product.id, quantity),
            delay(MIN_LOADING_TIME),
        ]);

        setLoading(false);

        if (!result.success) {
            if (result.status === 401) {
                router.push("/login");
                return;
            }

            if (result.error === "Max stock reached") {
                toast.error("You've reached the maximum available stock");
                return;
            }

            toast.error("Unable to add to cart");
            return;
        }

        await refreshCart();
        toast.success("Added to cart");
    }

    const disabled = product.stock === 0 || loading;

    if (buttonType === "mini") {
        return (
            <button
                disabled={disabled || loading}
                onClick={handleAddToCart}
                className={`rounded-lg flex items-center justify-center border w-9 h-9 sm:w-10 sm:h-10 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:hover:bg-inherit
            ${className}`}
            >
                {loading ? (
                    <div className="w-3 h-3 border-2 border-black rounded-full animate-spin border-t-transparent" />
                ) : (
                    <FaPlus size={14} />
                )}
            </button>
        );
    }

    return (
        <button
            disabled={disabled || loading}
            onClick={handleAddToCart}
            className={`rounded-md h-10 text-sm bg-accent text-white hover:bg-gray-800 w-full sm:max-w-50 transition disabled:opacity-50 disabled:hover:bg-accent
            ${className}`}
        >
            {product.stock === 0 ? (
                "Out of stock"
            ) : loading ? (
                <div className="flex items-center justify-center h-full">
                    <div className="w-4 h-4 border-2 border-white rounded-full animate-spin border-t-transparent" />
                </div>
            ) : (
                "Add to Cart"
            )}
        </button>
    );
}
