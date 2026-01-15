"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import { Product } from "../types";
import PageContainer from "@/components/ui/PageContainer";
import SearchSidebar from "@/components/search/SearchSidebar";

type Category = {
    id: string;
    name: string;
};

type SearchResultsProps = {
    initialProducts: Product[];
    initialCursor: string | null;
    totalCount: number;
    categories: Category[];
};

export default function SearchResults({
    initialProducts,
    initialCursor,
    totalCount,
    categories,
}: SearchResultsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const query = searchParams.get("q")?.toLowerCase() ?? "";
    const category = searchParams.get("category");
    const min = Number(searchParams.get("min")) || 0;
    const max = Number(searchParams.get("max")) || Infinity;

    const [items, setItems] = useState(initialProducts);
    const [cursor, setCursor] = useState<string | null>(initialCursor);

    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const activeCategory = useMemo(() => {
        if (!category) return null;
        return categories.find((c) => c.id === category)?.name ?? null;
    }, [category, categories]);

    const filteredProducts = useMemo(() => {
        return items.filter((product) => {
            const matchesQuery = product.name.toLowerCase().includes(query);

            const matchesCategory = category
                ? product.category.id === category
                : true;

            const matchesPrice = product.price >= min && product.price <= max;

            return matchesQuery && matchesCategory && matchesPrice;
        });
    }, [items, query, category, min, max]);

    const updateParam = (key: string, value?: string) => {
        const params = new URLSearchParams(searchParams.toString());

        if (!value) {
            params.delete(key);
        } else {
            params.set(key, value);
        }

        // ✅ when selecting a category, remove search query
        if (key === "category") {
            params.delete("q");
        }

        router.push(`/search?${params.toString()}`);
    };

    const loadMore = async () => {
        if (!hasMore || !cursor) return;

        const res = await fetch(`/api/products?cursor=${cursor}`);
        const data = await res.json();

        setItems((prev) => [...prev, ...data.items]);
        setCursor(data.nextCursor);
        setHasMore(Boolean(data.nextCursor));
    };

    useEffect(() => {
        if (category || query) return; // ✅ only All Products

        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && loadMore(),
            { rootMargin: "200px" }
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [cursor, category, query]);

    const visibleProducts = !category && !query ? items : filteredProducts;

    return (
        <PageContainer>
            <div className="flex gap-6">
                <SearchSidebar
                    categories={categories}
                    activeCategory={category}
                    min={min}
                    max={max}
                    onParamChange={updateParam}
                />
                {/* Results */}
                <section className="flex-1">
                    {/* ALL PRODUCTS */}
                    {!category && !query && (
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold">
                                All Products
                            </h1>
                            <p className="text-sm text-gray-500">
                                {totalCount} items
                            </p>
                        </div>
                    )}

                    {/* SEARCH RESULTS */}
                    {!category && query && (
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold">
                                Search results for “{query}”
                            </h1>
                            <p className="text-sm text-gray-500">
                                {filteredProducts.length}{" "}
                                {filteredProducts.length === 1
                                    ? "result"
                                    : "results"}{" "}
                                found
                            </p>
                        </div>
                    )}

                    {/* SELECTED CATEGORY */}
                    {activeCategory && (
                        <div className="mb-6">
                            <h1 className="text-2xl font-semibold">
                                {activeCategory}
                            </h1>
                            <p className="text-sm text-gray-500">
                                {filteredProducts.length} items
                            </p>
                        </div>
                    )}

                    {filteredProducts.length === 0 ? (
                        <p className="text-gray-500">No products found.</p>
                    ) : (
                        <>
                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                                {visibleProducts.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </div>
                            {!category && !query && hasMore && (
                                <div ref={loaderRef} className="h-10" />
                            )}
                        </>
                    )}
                </section>
            </div>
        </PageContainer>
    );
}
