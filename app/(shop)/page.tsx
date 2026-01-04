"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { useAuthGuard } from "@/lib/useAuthGuard";
import { getProducts } from "@/lib/getProducts";

export type Product = {
    id: string;
    name: string;
    price: number; // cents
    description: string;
    stock: number;
    images: string[];
};

export default function ShopPage() {
    const status = useAuthGuard();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status !== "authenticated") return;

        getProducts(20)
            .then(setProducts)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, [status]);

    if (status !== "authenticated") return null;

    return (
        <section className="py-8">
            <h1 className="mb-4 text-4xl font-semibold">Products</h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products && !loading ? (
                    <>
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </>
                ) : (
                    <>
                        <div className=" border flex h-107 flex-col rounded-lg animate-pulse bg-gray-100" />
                        <div className=" border flex h-107 flex-col rounded-lg animate-pulse bg-gray-100" />
                        <div className=" border flex h-107 flex-col rounded-lg animate-pulse bg-gray-100" />
                        <div className=" border flex h-107 flex-col rounded-lg animate-pulse bg-gray-100" />
                    </>
                )}
            </div>
        </section>
    );
}
