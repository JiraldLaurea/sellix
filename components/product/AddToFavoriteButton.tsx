"use client";

import { Product } from "@/app/types";
import { useFavorites } from "@/lib/favorites-context";
import { showSuccessToast } from "@/lib/toast/showSuccessToast";
import { showWarningToast } from "@/lib/toast/showWarningToast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { Spinner } from "../ui/Spinner";

type ButtonType = "regular" | "mini";

type Props = {
    product: Product;
    buttonType: ButtonType;
    className?: string;
};

export default function AddToFavoriteButton({
    product,
    buttonType,
    className,
}: Props) {
    const router = useRouter();
    const { toggleFavorite, isFavorite } = useFavorites();
    const [loading, setLoading] = useState(false);

    const favorited = isFavorite(product.id);
    const isDisabled = loading;

    async function handleToggle() {
        if (isDisabled) return;

        setLoading(true);
        const result = await toggleFavorite(product.id);
        setLoading(false);

        if (!result.success) {
            if (result.reason === "unauthorized") {
                router.push("/login");
                return;
            }

            showWarningToast("Something went wrong");
            return;
        }

        favorited
            ? showSuccessToast("Item Removed from Favorites", product.name)
            : showSuccessToast("Item Added to Favorites", product.name);
    }

    if (buttonType === "mini") {
        return (
            <button
                onClick={handleToggle}
                disabled={isDisabled}
                className={`rounded-lg flex items-center justify-center border w-9 h-9 sm:w-10 sm:h-10
                hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:hover:bg-inherit
                ${className}`}
            >
                {loading ? (
                    <Spinner borderColor="border-black" />
                ) : favorited ? (
                    <FaHeart size={14} />
                ) : (
                    <FaRegHeart size={14} />
                )}
            </button>
        );
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isDisabled}
            className={`rounded-lg h-10 text-sm border w-full flex items-center justify-center space-x-2
            hover:bg-gray-100 transition-colors disabled:opacity-50
            ${className}
            ${favorited ? "" : ""}`}
        >
            {loading ? (
                <div className="flex items-center justify-center h-full">
                    <Spinner borderColor="border-black" />
                </div>
            ) : favorited ? (
                <>
                    <FaHeart size={14} />
                    <p>Remove from Favorites</p>
                </>
            ) : (
                <>
                    <FaRegHeart size={14} /> <p>Add to Favorites</p>
                </>
            )}
        </button>
    );
}
