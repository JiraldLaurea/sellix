"use client";

import { useCart } from "@/lib/cart-context";
import { showSuccessToast } from "@/lib/toast/showSuccessToast";
import { showWarningToast } from "@/lib/toast/showWarningToast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { Spinner } from "../ui/Spinner";
import { ProductUI } from "@/app/types";

type ButtonType = "regular" | "mini";

type AddToCartButtonProps = {
    product: ProductUI;
    quantity: number;
    className?: string;
    buttonType: ButtonType;
    disabled?: boolean; // ✅ new prop
};

export default function AddToCartButton({
    product,
    quantity,
    className,
    buttonType,
    disabled = false,
}: AddToCartButtonProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { addToCart } = useCart();

    const isDisabled = disabled || loading;

    async function handleAddToCart() {
        if (isDisabled) return;

        setLoading(true);
        const result = await addToCart(product.id, quantity);
        setLoading(false);

        if (!result.success) {
            if (result.reason === "unauthorized") {
                router.push("/login");
                return;
            }

            showWarningToast(
                "You have reached the maximum quantity available for this item",
            );
            return;
        }

        showSuccessToast("Item Added to Cart", product.name);
    }

    if (buttonType === "mini") {
        return (
            <button
                disabled={isDisabled}
                onClick={handleAddToCart}
                className={`rounded-lg flex items-center justify-center border w-9 h-9 sm:w-10 sm:h-10
                hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:hover:bg-inherit
                ${className}`}
            >
                {loading ? (
                    <Spinner borderColor="border-black" />
                ) : (
                    <FaPlus size={14} />
                )}
            </button>
        );
    }

    return (
        <button
            disabled={isDisabled}
            onClick={handleAddToCart}
            className={`rounded-lg h-10 text-sm bg-linear-to-t font-medium from-blue-600  to-blue-500 hover:from-blue-700 hover:to-blue-500 text-white hover:bg-neutral-700
            w-full transition-colors disabled:opacity-15
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
