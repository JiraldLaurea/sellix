"use client";

import { Product } from "@/lib/mock-products";
import { useCart } from "@/lib/cart-context";

type Props = {
    product: Product;
};

export default function AddToCartButton({ product }: Props) {
    const { dispatch } = useCart();

    return (
        <button
            disabled={product.stock === 0}
            onClick={() => dispatch({ type: "ADD_ITEM", product })}
            className={`flex-1 rounded-md py-3 transition
        ${
            product.stock === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800"
        }
      `}
        >
            {product.stock === 0 ? "Out of stock" : "Add to cart"}
        </button>
    );
}
