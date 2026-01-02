"use client";

import { Product } from "@/lib/mock-products";
import { useCart } from "@/lib/cart-context";

type Props = {
    product: Product;
    quantity: number;
};

export default function AddToCartButton({ product, quantity }: Props) {
    const { dispatch } = useCart();

    return (
        <button
            onClick={() =>
                dispatch({
                    type: "ADD_ITEM",
                    product,
                    quantity,
                })
            }
            className="rounded-md bg-black px-6 py-2 text-white hover:bg-gray-800"
        >
            Add to cart
        </button>
    );
}
