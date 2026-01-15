"use client";

import { formatMoney } from "@/lib/formatMoney";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddToCartButton from "./AddToCartButton";
import { Product } from "@/app/types";

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
        <div className="flex flex-col h-full overflow-hidden border rounded-xl">
            {/* Clickable area */}
            <Link href={`/product/${product.id}`}>
                <div className="relative bg-gray-50 border-b transition-colors aspect-square">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                        className="object-cover"
                    />
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex flex-col p-3 space-y-6 sm:p-4 grow">
                <div className="truncate grow text-ellipsis text-wrap flex flex-col">
                    <small className="text-xs sm:text-sm text-gray-500 w-fit">
                        {product.category.name}
                    </small>
                    <Link
                        href={`/product/${product.id}`}
                        className="text-xs w-fit hover:underline text sm:text-sm font-medium"
                    >
                        {product.name}
                    </Link>
                </div>
                <div className="flex items-end justify-between">
                    <p className="font-semibold text-black sm:text-lg">
                        {formatMoney(product.price)}
                    </p>
                    <AddToCartButton
                        product={product}
                        quantity={quantity}
                        buttonType="mini"
                    />
                </div>
            </div>
        </div>
    );
}
