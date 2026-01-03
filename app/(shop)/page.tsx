"use client";

import ProductCard from "@/components/product/ProductCard";
import { products } from "@/lib/mock-products";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function ShopPage() {
    const status = useAuthGuard();

    if (status === "loading") {
        return <p className="py-16 text-center">Loading…</p>;
    }

    if (status !== "authenticated") return null;

    return (
        <section className="py-8">
            <h1 className="mb-4 text-4xl font-semibold">Products</h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
