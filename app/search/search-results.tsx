"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import * as Popover from "@radix-ui/react-popover";
import { RxCaretSort } from "react-icons/rx";
import { MdOutlineSearchOff } from "react-icons/md";

import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import SearchSidebar from "@/components/search/SearchSidebar";
import PageContainer from "@/components/ui/PageContainer";
import ProductCardContainer from "@/components/ui/ProductCardContainer";

import { Product } from "../types";

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

const SORT_OPTIONS = [
    { label: "Alphabetical (A-Z)", value: "name_asc" },
    { label: "Alphabetical (Z-A)", value: "name_desc" },
    { label: "Price (Low-High)", value: "price_asc" },
    { label: "Price (High-Low)", value: "price_desc" },
];

export default function SearchResults({
    initialProducts,
    initialCursor,
    totalCount,
    categories,
}: SearchResultsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();

    const query = searchParams.get("q") ?? "";
    const category = searchParams.get("category");
    const minParam = searchParams.get("min");
    const maxParam = searchParams.get("max");
    const sort = searchParams.get("sort") ?? "name_asc";

    const [items, setItems] = useState<Product[]>(initialProducts);
    const [cursor, setCursor] = useState<string | null>(initialCursor);
    const [hasMore, setHasMore] = useState(Boolean(initialCursor));
    const [isLoading, setIsLoading] = useState(false);

    const loaderRef = useRef<HTMLDivElement | null>(null);

    const hasActiveFilters = Boolean(category || query || minParam || maxParam);

    const activeCategory = useMemo(() => {
        if (!category) return null;
        return categories.find((c) => c.id === category)?.name ?? null;
    }, [category, categories]);

    const activeSortLabel =
        SORT_OPTIONS.find((o) => o.value === sort)?.label ??
        "Alphabetical (A-Z)";

    // 🔹 MAIN FETCH
    useEffect(() => {
        const fetchProducts = async () => {
            setIsLoading(true);

            const params = new URLSearchParams();
            if (category) params.set("category", category);
            if (query) params.set("q", query);
            if (minParam) params.set("min", minParam);
            if (maxParam) params.set("max", maxParam);
            params.set("sort", sort);

            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();

            setItems(data.items);
            setCursor(data.nextCursor ?? null);
            setHasMore(Boolean(data.nextCursor));
            setIsLoading(false);
        };

        fetchProducts();
    }, [category, query, minParam, maxParam, sort]);

    // 🔹 INFINITE SCROLL
    const loadMore = async () => {
        if (!hasMore || !cursor || isLoading) return;

        const params = new URLSearchParams();
        params.set("cursor", cursor);
        params.set("sort", sort);

        const res = await fetch(`/api/products?${params.toString()}`);
        const data = await res.json();

        setItems((prev) => [...prev, ...data.items]);
        setCursor(data.nextCursor);
        setHasMore(Boolean(data.nextCursor));
    };

    useEffect(() => {
        if (category || query) return;

        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && loadMore(),
            { rootMargin: "200px" },
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [cursor, category, query, sort]);

    const updateParam = (
        paramsToUpdate: Record<string, string | undefined>,
    ) => {
        const params = new URLSearchParams(searchParams.toString());

        Object.entries(paramsToUpdate).forEach(([key, value]) => {
            if (!value) params.delete(key);
            else params.set(key, value);

            if (key === "category") {
                params.delete("q");
                params.delete("min");
                params.delete("max");
            }
        });

        router.push(`/search?${params.toString()}`);
    };

    return (
        <PageContainer className="md:p-0! max-w-7xl! flex flex-col">
            <div className="flex">
                {/* SIDEBAR */}
                <div className="hidden md:block min-h-[calc(100vh-64px)] border-r">
                    <SearchSidebar
                        categories={categories}
                        activeCategory={category}
                        updateParam={updateParam}
                    />
                </div>

                {/* RESULTS */}
                <section className="flex-1 md:p-6 flex flex-col">
                    {/* HEADER */}
                    <div className="flex flex-col lg:flex-row justify-between gap-4 mb-6">
                        <div>
                            {!category && !query && (
                                <>
                                    <h1 className="text-2xl font-semibold">
                                        All Products
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {totalCount} items
                                    </p>
                                </>
                            )}

                            {query && (
                                <>
                                    <h1 className="text-2xl font-semibold">
                                        Search results for “{query}”
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {items.length} results
                                    </p>
                                </>
                            )}

                            {activeCategory && (
                                <>
                                    <h1 className="text-2xl font-semibold">
                                        {activeCategory}
                                    </h1>
                                    <p className="text-sm text-gray-500">
                                        {items.length} items
                                    </p>
                                </>
                            )}
                        </div>

                        {items.length > 0 && (
                            <Popover.Root>
                                <Popover.Trigger className="h-10 px-4 border rounded-lg flex items-center gap-1">
                                    <span className="text-sm">
                                        {activeSortLabel}
                                    </span>
                                    <RxCaretSort size={18} />
                                </Popover.Trigger>

                                <Popover.Content
                                    align="end"
                                    sideOffset={4}
                                    className="z-50 w-52 rounded-lg border bg-white shadow p-2 space-y-1"
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <Popover.Close
                                            key={option.value}
                                            onClick={() =>
                                                updateParam({
                                                    sort: option.value,
                                                })
                                            }
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 ${
                                                sort === option.value
                                                    ? "bg-gray-100"
                                                    : ""
                                            }`}
                                        >
                                            {option.label}
                                        </Popover.Close>
                                    ))}
                                </Popover.Content>
                            </Popover.Root>
                        )}
                    </div>

                    {/* CONTENT */}
                    {isLoading ? (
                        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <ProductCardSkeleton key={i} />
                            ))}
                        </div>
                    ) : hasActiveFilters && items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center grow text-gray-500 py-20">
                            <div className="p-4 bg-gray-100 rounded-lg">
                                <MdOutlineSearchOff
                                    size={30}
                                    className="text-gray-400"
                                />
                            </div>
                            <h2 className="mt-4 text-lg font-medium">
                                No results found
                            </h2>
                            <p className="text-sm mt-1">
                                Try adjusting your filters or price range
                            </p>
                        </div>
                    ) : (
                        <>
                            <ProductCardContainer className="md:grid-cols-2! lg:grid-cols-3!">
                                {items.map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                    />
                                ))}
                            </ProductCardContainer>

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
