"use client";

import { useEffect, useState } from "react";
import { Product } from "@/lib/mock-products";
import QuantityPicker from "@/components/cart/QuantityPicker";
import AddToCartButton from "@/components/product/AddToCartButton";
import { useCart } from "@/lib/cart-context";
import { getRemainingStock } from "@/lib/cart-selectors";

type Props = {
    product: Product;
};

export default function ProductPurchase({ product }: Props) {
    const { state } = useCart();
    const [quantity, setQuantity] = useState(1);

    const remainingStock = getRemainingStock(product, state.items);

    useEffect(() => {
        if (quantity > remainingStock) {
            setQuantity(Math.max(1, remainingStock));
        }
    }, [remainingStock]);

    return (
        <div className="flex items-center gap-4 pt-4">
            <QuantityPicker
                quantity={quantity}
                max={remainingStock}
                onChange={setQuantity}
            />

            <AddToCartButton product={product} quantity={quantity} />
        </div>
    );
}
