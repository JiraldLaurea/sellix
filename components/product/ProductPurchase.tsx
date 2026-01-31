"use client";

import { Product } from "@/app/types";
import QuantityPicker from "@/components/cart/QuantityPicker";
import AddToCartButton from "@/components/product/AddToCartButton";
import { useCart } from "@/lib/cart-context";
import { showWarningToast } from "@/lib/toast/showWarningToast";
import { useEffect, useState } from "react";
import AddToFavoriteButton from "./AddToFavoriteButton";

type Props = {
    product: Product;
};

export default function ProductPurchase({ product }: Props) {
    const { state } = useCart();

    const cartItem = state.items.find((item) => item.product.id === product.id);
    const quantityInCart = cartItem?.quantity ?? 0;
    const remainingStock = Math.max(product.stock - quantityInCart, 0);

    const [quantity, setQuantity] = useState(0);

    // Keep quantity in sync with remaining stock
    useEffect(() => {
        setQuantity(remainingStock > 0 ? 1 : 0);
    }, [remainingStock]);

    const handleQuantityChange = (next: number) => {
        if (remainingStock === 0) {
            setQuantity(0);
            showWarningToast("No more stock available");
            return;
        }

        if (next < 0) {
            setQuantity(0);
            return;
        }

        if (next > remainingStock) {
            setQuantity(remainingStock);
            showWarningToast("No more stock available");
            return;
        }

        setQuantity(next);
    };

    return (
        <div className="space-y-6">
            <div className="flex space-x-2">
                <QuantityPicker
                    quantity={quantity}
                    max={remainingStock}
                    onChange={handleQuantityChange}
                />
                <AddToCartButton
                    buttonType="regular"
                    product={product}
                    quantity={quantity}
                    disabled={quantity === 0} // ✅ disable when 0
                    className="max-w-40"
                />
                <AddToFavoriteButton
                    buttonType="mini"
                    product={product}
                    className="w-10 h-10"
                />
            </div>
            <div>
                <div className="flex flex-col items-center gap-2 sm:flex-row"></div>
                {remainingStock === 0 && (
                    <p className="p-4 mt-2 text-xs text-center rounded-lg bg-amber-50 text-amber-500 sm:text-left">
                        You have reached the maximum quantity available for this
                        item
                    </p>
                )}
            </div>
        </div>
    );
}
