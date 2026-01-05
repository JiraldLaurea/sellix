"use client";

import { Product } from "@/app/types/product";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import AddToCartButton from "./AddToCartButton";

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    const router = useRouter();
    // const { state } = useCart();

    // console.log("STATE", state);

    // const itemInCart = state.items.find(
    //     (item) => item.product.id === product.id
    // );

    // const quantityInCart = itemInCart?.quantity ?? 0;
    // const isMaxedOut = quantityInCart >= product.stock;

    const [quantity, setQuantity] = useState(1);

    // Clamp quantity to available stock (UX only)
    useEffect(() => {
        if (quantity > product.stock) {
            setQuantity(Math.max(1, product.stock));
        }
    }, [quantity, product.stock]);

    return (
        <div className="group border flex flex-col rounded-lg overflow-hidden hover:shadow-md transition">
            {/* Clickable area */}
            <Link href={`/product/${product.id}`} className="grow">
                <div className="relative aspect-square bg-gray-100">
                    <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="p-4 space-y-2 ">
                    <h3 className="font-medium">{product.name}</h3>
                    <p className="text-sm text-gray-600">
                        ${(product.price / 100).toFixed(2)}
                    </p>
                </div>
            </Link>

            {/* Action area */}
            <div className="px-4 pb-4">
                <AddToCartButton
                    product={product}
                    quantity={quantity}
                    className="w-full"
                />
            </div>
        </div>
    );
}
