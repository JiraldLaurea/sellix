"use client";

import { Product } from "@/lib/mock-products";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

type Props = {
    product: Product;
    quantity: number;
};

export default function AddToCartButton({ product, quantity }: Props) {
    const { state, dispatch } = useCart();

    const itemInCart = state.items.find(
        (item) => item.product.id === product.id
    );
    const quantityInCart = itemInCart?.quantity ?? 0;
    const isMaxedOut = quantityInCart >= product.stock;

    return (
        <button
            disabled={product.stock === 0 || isMaxedOut}
            onClick={() => {
                dispatch({
                    type: "ADD_ITEM",
                    product,
                    quantity,
                });
                toast.success("Added to cart");
            }}
            className={`rounded-md px-6 py-2
                        ${
                            product.stock === 0 || isMaxedOut
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-accent text-white hover:bg-gray-800"
                        } `}
        >
            {product.stock === 0
                ? "Out of stock"
                : isMaxedOut
                ? "Max quantity reached"
                : "Add to cart"}
        </button>
    );
}
