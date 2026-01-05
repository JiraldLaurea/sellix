"use client";

import { Product } from "@/app/types/product";
import { useCart } from "@/lib/cart-context";
import { addToCart } from "@/lib/cart/add-to-cart";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
    product: Product;
    quantity: number;
    className?: string;
};

export default function AddToCartButton({
    product,
    quantity,
    className,
}: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const { refreshCart } = useCart();

    async function handleAddToCart() {
        setLoading(true);

        const result = await addToCart(product.id, quantity);

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

    return (
        <button
            disabled={disabled}
            onClick={handleAddToCart}
            className={`rounded-md px-6 py-2 transition
        ${
            disabled
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-accent text-white hover:bg-gray-800"
        } ${className}`}
        >
            {product.stock === 0
                ? "Out of stock"
                : loading
                ? "Adding..."
                : "Add to cart"}
        </button>
    );
}
