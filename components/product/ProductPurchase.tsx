"use client";

import { useState } from "react";
import QuantityPicker from "@/components/cart/QuantityPicker";
import AddToCartButton from "@/components/product/AddToCartButton";
import { Product } from "@/app/types/product";
import { toast } from "sonner";

type Props = {
    product: Product;
};

export default function ProductPurchase({ product }: Props) {
    const max = product.stock;

    const [quantity, setQuantity] = useState(max > 0 ? 1 : 0);

    // ✅ CLAMP HERE — not in useEffect
    const handleQuantityChange = (next: number) => {
        if (max === 0) {
            setQuantity(0);
            return;
        }

        if (next < 1) {
            setQuantity(1);
            return;
        }

        if (next > max) {
            setQuantity(max);
            toast.error("No more stock available");
            return;
        }

        setQuantity(next);
    };

    return (
        <div className="pt-4 space-y-4">
            <QuantityPicker
                quantity={quantity}
                max={max}
                onChange={handleQuantityChange}
            />

            <AddToCartButton
                product={product}
                quantity={quantity}
                className="w-full sm:w-fit"
            />
        </div>
    );
}
