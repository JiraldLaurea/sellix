"use client";

import { useState } from "react";
import { Product } from "@/lib/mock-products";
import QuantityPicker from "@/components/cart/QuantityPicker";
import AddToCartButton from "@/components/product/AddToCartButton";

type Props = {
    product: Product;
};

export default function ProductPurchase({ product }: Props) {
    const [quantity, setQuantity] = useState(1);

    return (
        <div className="flex items-center gap-4 pt-4">
            <QuantityPicker
                quantity={quantity}
                max={product.stock}
                onChange={setQuantity}
            />

            <AddToCartButton product={product} quantity={quantity} />
        </div>
    );
}
