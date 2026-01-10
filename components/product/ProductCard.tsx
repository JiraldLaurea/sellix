"use client";

import { Product } from "@/app/types/product";
import { formatMoney } from "@/lib/formatMoney";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddToCartButton from "./AddToCartButton";

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    const [quantity, setQuantity] = useState(1);

    // Clamp quantity to available stock (UX only)
    useEffect(() => {
        if (quantity > product.stock) {
            setQuantity(Math.max(1, product.stock));
        }
    }, [quantity, product.stock]);

    return (
        <div className="flex flex-col overflow-hidden border rounded-lg">
            {/* Clickable area */}
            <Link href={`/product/${product.id}`} className="grow">
                <div className="relative bg-gray-100 aspect-square">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="p-3 truncate sm:space-y-1 sm:p-4">
                    <h3 className="text-sm font-medium truncate sm:text-base">
                        {product.name}
                    </h3>
                    <p className="text-xs text-gray-600 sm:text-sm">
                        {formatMoney(product.price)}
                    </p>
                </div>
            </Link>

            {/* Action area */}
            <div className="px-3 pb-3 sm:pb-4 sm:px-4">
                <AddToCartButton
                    product={product}
                    quantity={quantity}
                    className="w-full h-9"
                />
            </div>
        </div>
    );
}
