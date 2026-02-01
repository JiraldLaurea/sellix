"use client";

import { ProductUI } from "@/app/types";
import { formatMoney } from "@/lib/formatMoney";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import AddToCartButton from "./AddToCartButton";
import AddToFavoriteButton from "./AddToFavoriteButton";

type Props = {
    product: ProductUI;
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
                            sizes="50vw"
                            className="object-cover"
                        />
                    </div>
                </div>
            </Link>

            {/* Product Info */}
            <div className="flex flex-col p-3 space-y-6 sm:p-4 grow">
                <div className="flex flex-col truncate grow text-ellipsis text-wrap">
                    <Link
                        href={`/search?category=${product.category.id}`}
                        className="text-xs hover:underline text-gray-500 sm:text-sm w-fit"
                    >
                        {product.category.name}
                    </Link>
                    <Link
                        href={`/product/${product.id}`}
                        className="text-xs font-medium w-fit hover:underline text sm:text-sm"
                    >
                        {product.name}
                    </Link>
                </div>
                <div className="flex flex-col space-y-1">
                    <p className="font-semibold text-sm text-black sm:text-lg">
                        {formatMoney(product.price)}
                    </p>
                    <div className="flex justify-end space-x-1">
                        <AddToFavoriteButton
                            product={product}
                            buttonType="mini"
                        />
                        <AddToCartButton
                            product={product}
                            quantity={quantity}
                            buttonType="mini"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
