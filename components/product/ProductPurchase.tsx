"use client";

import { useState } from "react";
import QuantityPicker from "@/components/cart/QuantityPicker";
import AddToCartButton from "@/components/product/AddToCartButton";
import { Product } from "@/app/types/product";
import { toast } from "sonner";
import { useCart } from "@/lib/cart-context";

type Props = {
    product: Product;
};

export default function ProductPurchase({ product }: Props) {
    const { state } = useCart();

    const cartItem = state.items.find((item) => item.product.id === product.id);
    const quantityInCart = cartItem?.quantity ?? 0;
    const remainingStock = Math.max(product.stock - quantityInCart, 0);

    const max = remainingStock;

    const [quantity, setQuantity] = useState(remainingStock > 0 ? 1 : 0);
    const handleQuantityChange = (next: number) => {
        if (remainingStock === 0) {
            setQuantity(0);
            toast.error("No more stock available");
            return;
        }

        if (next < 1) {
            setQuantity(1);
            return;
        }

        if (next > remainingStock) {
            setQuantity(remainingStock);
            toast.error("No more stock available");
            return;
        }
        setQuantity(next);
    };

    return (
        <div className="pt-4 flex items-center space-x-4">
            <QuantityPicker
                quantity={quantity}
                max={max}
                onChange={handleQuantityChange}
            />
            <AddToCartButton
                product={product}
                quantity={quantity}
                className="w-full h-10"
            />
        </div>
    );
}
