"use client";

import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import { BackButton } from "@/components/ui/BackButton";
import { formatMoney } from "@/lib/formatMoney";
import { useRouter } from "next/navigation";

type Props = {
    product: any;
};

export default function ProductClient({ product }: Props) {
    const router = useRouter();
    return (
        <section className="grid gap-8 py-8 md:grid-cols-2">
            {/* Image */}
            <ProductImageGallery images={product.images} alt={product.name} />

            {/* Details */}
            <div className="space-y-4">
                <BackButton text="Back" />
                <h1 className="text-2xl font-semibold">{product.name}</h1>

                <p className="text-xl text-gray-800">
                    {formatMoney(product.price)}
                </p>

                <p className="text-gray-600">{product.description}</p>

                {/* Quantity + Add to cart */}
                <ProductPurchase product={product} />
            </div>
        </section>
    );
}
