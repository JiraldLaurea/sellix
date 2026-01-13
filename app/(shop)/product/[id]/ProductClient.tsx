"use client";

import { Product } from "@/app/types";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import { BackButton } from "@/components/ui/BackButton";
import PageContainer from "@/components/ui/PageContainer";
import { formatMoney } from "@/lib/formatMoney";

export default function ProductClient({ product }: { product: Product }) {
    return (
        <PageContainer className="grid gap-8 py-8 md:grid-cols-2 w-full items-center">
            {/* Image */}
            <ProductImageGallery images={product.images} alt={product.name} />

            {/* Details */}
            <div className="space-y-6">
                <BackButton text="Back" />

                <div className="space-y-4">
                    <div className="space-y-2">
                        <h1 className="text-2xl font-semibold">
                            {product.name}
                        </h1>
                        <p className="text-gray-600 text-sm">
                            Category:{" "}
                            <span className="font-semibold">
                                {product.category.name}
                            </span>
                        </p>
                    </div>
                    <p className="text-3xl font-semibold">
                        {formatMoney(product.price)}
                    </p>
                    <p className="text-gray-600">{product.description}</p>
                </div>

                {/* Quantity + Add to cart */}
                <ProductPurchase product={product} />
            </div>
        </PageContainer>
    );
}
