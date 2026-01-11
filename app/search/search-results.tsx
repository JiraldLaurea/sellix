"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useMemo } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "../types";

const CATEGORIES = ["Hoodies", "Sweatshirts", "Joggers"];

export default function SearchResults({ products }: { products: Product[] }) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const query = searchParams.get("q")?.toLowerCase() ?? "";
    const category = searchParams.get("category");
    const min = Number(searchParams.get("min")) || 0;
    const max = Number(searchParams.get("max")) || Infinity;

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const matchesQuery = product.name.toLowerCase().includes(query);
            const matchesCategory = category
                ? product.category.name === category
                : true;
            const matchesPrice = product.price >= min && product.price <= max;

            return matchesQuery && matchesCategory && matchesPrice;
        });
    }, [products, query, category, min, max]);

    const updateParam = (key: string, value?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (!value) params.delete(key);
        else params.set(key, value);

        router.push(`/search?${params.toString()}`);
    };

    return (
        <div className="max-w-6xl mx-auto py-8 min-h-[calc(100vh-64px)] grid grid-cols-12 gap-6">
            {/* Sidebar */}
            <aside className="hidden md:block col-span-3">
                <div className="space-y-6">
                    {/* Categories */}
                    <div>
                        <h3 className="font-medium mb-3">Categories</h3>
                        <div className="space-y-2">
                            {CATEGORIES.map((cat) => (
                                <label
                                    key={cat}
                                    className="flex items-center gap-2 text-sm cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        checked={category === cat}
                                        onChange={() =>
                                            updateParam(
                                                "category",
                                                category === cat
                                                    ? undefined
                                                    : cat
                                            )
                                        }
                                    />
                                    {cat}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="font-medium mb-3">Price Range</h3>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                placeholder="Min"
                                defaultValue={min || ""}
                                className="w-full border rounded px-2 py-1 text-sm"
                                onBlur={(e) =>
                                    updateParam("min", e.target.value)
                                }
                            />
                            <input
                                type="number"
                                placeholder="Max"
                                defaultValue={max !== Infinity ? max : ""}
                                className="w-full border rounded px-2 py-1 text-sm"
                                onBlur={(e) =>
                                    updateParam("max", e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            </aside>

            {/* Results */}
            <section className="col-span-12 md:col-span-9">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-lg font-semibold">
                        Searching for “{query}”
                    </h1>
                    <p className="text-sm text-gray-600">
                        {filteredProducts.length}{" "}
                        {filteredProducts.length > 1 ? "results" : "result"}{" "}
                        found
                    </p>
                </div>

                {filteredProducts.length === 0 ? (
                    <p className="text-gray-500">No products found.</p>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                        {filteredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}
