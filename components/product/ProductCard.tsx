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
                <div className="p-4 border-b bg-gray-50">
                    <div className="relative aspect-square">
                        <Image
                            src={product.images[0]}
                            alt={product.name}
                            fill
                            sizes="10vw"
                            className="object-cover"
                        />
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex flex-col p-3 space-y-6 sm:p-4 grow">
                <div className="flex flex-col truncate grow text-ellipsis text-wrap">
                    <small className="text-xs text-gray-500 sm:text-sm w-fit">
                        {product.category.name}
                    </small>
                    <Link
                        href={`/product/${product.id}`}
                        className="text-xs font-medium w-fit hover:underline text sm:text-sm"
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
