"use client";

import { Product } from "@/app/types";
import ProductCard from "@/components/product/ProductCard";
import PageContainer from "@/components/ui/PageContainer";

type ShopClientProps = {
    products: Product[];
};

export default function ShopClient({ products }: ShopClientProps) {
    return (
        <>
            <PageContainer>
                <div id="nav-trigger" className="h-px w-px" />
                <h1 className="mb-4 text-4xl font-semibold">
                    Products Catalog
                </h1>
                <div
                    id="nav-trigger"
                    className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4"
                >
                    {products ? (
                        <>
                            {products.map((product: Product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </>
                    ) : (
                        <>
                            <div className="flex flex-col bg-gray-100 border rounded-lg h-107 animate-pulse" />
                            <div className="flex flex-col bg-gray-100 border rounded-lg h-107 animate-pulse" />
                            <div className="flex flex-col bg-gray-100 border rounded-lg h-107 animate-pulse" />
                            <div className="flex flex-col bg-gray-100 border rounded-lg h-107 animate-pulse" />
                        </>
                    )}
                </div>
            </PageContainer>
        </>
    );
}
