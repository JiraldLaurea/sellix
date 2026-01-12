"use client";

import { Product } from "@/app/types/product";
import { useCart } from "@/lib/cart-context";
import { showSuccessToast } from "@/lib/toast/showSuccessToast";
import { showWarningToast } from "@/lib/toast/showWarningToast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Spinner } from "../ui/Spinner";

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
    const { addToCart } = useCart();

    async function handleAddToCart() {
        setLoading(true);

        const result = await addToCart(product.id, quantity);

        setLoading(false);

        // Check for errors
        if (!result.success) {
            if (result.reason === "unauthorized") {
                router.push("/login");
                return;
            }

            if (result.reason === "max_stock") {
                showWarningToast("You've reached the maximum available stock");

                return;
            }

            showWarningToast("You've reached the maximum available stock");

            return;
        }

        showSuccessToast("Item Added to Cart", `${product.name}`);
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
            className={`rounded-lg h-12 text-sm bg-accent text-white hover:bg-neutral-700 w-full sm:max-w-30 transition-colors disabled:opacity-15 disabled:hover:bg-accent
            ${className}`}
        >
            {product.stock === 0 ? (
                "Out of stock"
            ) : loading ? (
                <div className="flex items-center justify-center h-full">
                    <Spinner />
                </div>
            ) : (
                "Add to Cart"
            )}
        </button>
    );
}
