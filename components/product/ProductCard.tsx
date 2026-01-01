"use client";

import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/mock-products";
import { useCart } from "@/lib/cart-context";
import { toast } from "sonner";

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    const { state, dispatch } = useCart();

    const itemInCart = state.items.find(
        (item) => item.product.id === product.id
    );
    const quantityInCart = itemInCart?.quantity ?? 0;
    const isMaxedOut = quantityInCart >= product.stock;

    return (
        <div className="group border rounded-lg overflow-hidden hover:shadow-md transition">
            {/* Clickable area */}
            <Link href={`/product/${product.id}`}>
                <div className="relative aspect-square bg-gray-100">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="p-4 space-y-2">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                        ${(product.price / 100).toFixed(2)}
                    </p>
                </div>
            </Link>

            {/* Action area */}
            <div className="px-4 pb-4">
                <button
                    disabled={product.stock === 0 || isMaxedOut}
                    onClick={() => {
                        dispatch({ type: "ADD_ITEM", product });
                        toast.success("Added to cart");
                    }}
                    className={`w-full rounded-md py-2 text-sm transition
            ${
                product.stock === 0 || isMaxedOut
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-accent text-white hover:bg-gray-800"
            }
          `}
                >
                    {product.stock === 0
                        ? "Out of stock"
                        : isMaxedOut
                        ? "Max quantity reached"
                        : "Add to cart"}
                </button>
            </div>
        </div>
    );
}
