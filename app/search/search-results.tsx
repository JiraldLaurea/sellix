"use client";

import ProductCard from "@/components/product/ProductCard";
import ProductCardSkeleton from "@/components/product/ProductCardSkeleton";
import SearchSidebar from "@/components/search/SearchSidebar";
import PageContainer from "@/components/ui/PageContainer";
import { useFilters } from "@/lib/filter-context";
import * as Popover from "@radix-ui/react-popover";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { RxCaretSort } from "react-icons/rx";
import { Product } from "../types";
import { MdOutlineSearchOff } from "react-icons/md";
import ProductCardContainer from "@/components/ui/ProductCardContainer";

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
    const [isFiltering, setIsFiltering] = useState(true);
    // const [total, setTotal] = useState(totalCount);

    const { resetPriceRange } = useFilters();

    const query = searchParams.get("q")?.toLowerCase() ?? "";
    const category = searchParams.get("category");

    // const min = Number(searchParams.get("min")) || 0;
    // const max = Number(searchParams.get("max")) || 300;

    const [items, setItems] = useState(initialProducts);
    const [cursor, setCursor] = useState<string | null>(initialCursor);

    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement | null>(null);

    const hasActiveFilters = Boolean(category || query);

    const SORT_OPTIONS = [
        { label: "Alphabetical (A-Z)", value: "name_asc" },
        { label: "Alphabetical (Z-A)", value: "name_desc" },
        { label: "Price (Low-High)", value: "price_asc" },
        { label: "Price (High-Low)", value: "price_desc" },
    ];

    const sort = searchParams.get("sort") ?? "name_asc";

    const activeSortLabel =
        SORT_OPTIONS.find((o) => o.value === sort)?.label ??
        "Alphabetical (A-Z)";

    // const { filters, setPriceRange, resetPriceRange } = useFilters();

    const activeCategory = useMemo(() => {
        if (!category) return null;
        return categories.find((c) => c.id === category)?.name ?? null;
    }, [category, categories]);

    // const filteredProducts = useMemo(() => {
    //     return items.filter((product) => {
    //         const matchesQuery = product.name.toLowerCase().includes(query);

    //         const matchesCategory = category
    //             ? product.category.id === category
    //             : true;

    //         const matchesPrice = product.price >= min && product.price <= max;

    //         return matchesQuery && matchesCategory && matchesPrice;
    //     });
    // }, [items, query, category, min, max]);

    const loadMore = async () => {
        if (!hasMore || !cursor) return;

        const res = await fetch(`/api/products?cursor=${cursor}`);
        const data = await res.json();

        setItems((prev) => [...prev, ...data.items]);
        setCursor(data.nextCursor);
        setHasMore(Boolean(data.nextCursor));
    };

    const updateParam = (
        paramsToUpdate: Record<string, string | undefined>,
    ) => {
        const params = new URLSearchParams(searchParams.toString());

        // resetPriceRange();

        Object.entries(paramsToUpdate).forEach(([key, value]) => {
            if (!value) {
                params.delete(key);
            } else {
                params.set(key, value);
            }

            // when selecting a category, remove search query
            if (key === "category") {
                params.delete("q");
                // Clear previous price filter params
                params.delete("min");
                params.delete("max");
            }
        });

        router.push(`/search?${params.toString()}`);
    };

    const minParam = searchParams.get("min");
    const maxParam = searchParams.get("max");

    useEffect(() => {
        if (!category && !query && !minParam && !maxParam) return;

        const fetchFiltered = async () => {
            // setIsFiltering(true);

            const params = new URLSearchParams();
            if (category) params.set("category", category);
            if (query) params.set("q", query);
            if (minParam) params.set("min", minParam);
            if (maxParam) params.set("max", maxParam);

            const res = await fetch(`/api/products?${params.toString()}`);
            const data = await res.json();

            setItems(data.items); // ✅ update items
            setCursor(null);
            setHasMore(false);
            setIsFiltering(false);
        };

        fetchFiltered();
    }, [category, query, minParam, maxParam]);

    useEffect(() => {
        if (category || query) return; // ✅ only All Products

        const observer = new IntersectionObserver(
            ([entry]) => entry.isIntersecting && loadMore(),
            { rootMargin: "200px" },
        );

        if (loaderRef.current) observer.observe(loaderRef.current);
        return () => observer.disconnect();
    }, [cursor, category, query]);

    useEffect(() => {
        if (category || query || minParam || maxParam) return;

        // ✅ reset back to All Products state
        setItems(initialProducts);
        setCursor(initialCursor);
        setHasMore(Boolean(initialCursor));
    }, [category, query, initialProducts, initialCursor]);

    const sortedProducts = useMemo(() => {
        const sorted = [...items];

        switch (sort) {
            case "name_desc":
                return sorted.sort((a, b) => b.name.localeCompare(a.name));
            case "price_asc":
                return sorted.sort((a, b) => a.price - b.price);
            case "price_desc":
                return sorted.sort((a, b) => b.price - a.price);
            default:
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
        }
    }, [items, sort]);

    const visibleProducts = sortedProducts;

    return (
        <PageContainer className="md:p-0! max-w-7xl! flex flex-col">
            <div className="flex">
                {/* SEARCH FILTER */}
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
                    <div className="flex lg:flex-row flex-col justify-between space-y-4 lg:space-y-0 lg:items-end mb-6">
                        {/* ALL PRODUCTS */}
                        {!category && !query && (
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    All Products
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {minParam || maxParam
                                        ? items.length === 1
                                            ? "1 item"
                                            : `${items.length} items`
                                        : totalCount + " items"}
                                </p>
                            </div>
                        )}

                        {/* SEARCH RESULTS */}
                        {!category && query && (
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    Search results for “{query}”
                                </h1>
                                <p className="text-sm text-gray-500">
                                    {items.length}{" "}
                                    {items.length === 1 ? "result" : "results"}{" "}
                                    found
                                </p>
                            </div>
                        )}

                        {/* SELECTED CATEGORY */}
                        {activeCategory && !isFiltering && (
                            <div>
                                <h1 className="text-2xl font-semibold">
                                    {activeCategory}
                                </h1>

                                <p className="text-sm text-gray-500">
                                    {items.length} items
                                </p>
                            </div>
                        )}
                        {/* SORT BY BUTTON */}
                        {hasActiveFilters && items.length !== 0 && (
                            <Popover.Root>
                                <div className="flex justify-end mb-0">
                                    <Popover.Trigger className="pr-3 w-fit pl-4 mb-0 h-10 border flex space-x-1 items-center rounded-lg hover:bg-gray-100 transition-colors">
                                        <p className="text-sm">
                                            {activeSortLabel}
                                        </p>
                                        <RxCaretSort size={18} />
                                    </Popover.Trigger>
                                </div>

                                <Popover.Content
                                    align="end"
                                    sideOffset={1}
                                    className="z-50 w-50 rounded-lg border bg-white shadow-lg p-2 space-y-1"
                                >
                                    {SORT_OPTIONS.map((option) => (
                                        <Popover.Close
                                            key={option.value}
                                            onClick={() =>
                                                updateParam({
                                                    sort: option.value,
                                                })
                                            }
                                            className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
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

                    {!hasActiveFilters && isFiltering ? (
                        <>
                            <div className="mb-6 space-y-2">
                                <div className="w-60 h-7 bg-gray-200 animate-pulse rounded-lg" />
                                <div className="text-sm h-4 w-20 bg-gray-200 animate-pulse rounded-lg" />
                            </div>
                            <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-3">
                                {Array.from({ length: 6 }).map((_, i) => (
                                    <ProductCardSkeleton key={i} />
                                ))}
                            </div>
                        </>
                    ) : hasActiveFilters && items.length === 0 ? (
                        // 🔹 EMPTY STATE
                        <div className="text-center grow pb-13 text-gray-500 flex flex-col items-center justify-center space-y-6">
                            <div className="p-4 bg-gray-100 rounded-lg">
                                <MdOutlineSearchOff
                                    size={30}
                                    className="text-gray-400"
                                />
                            </div>
                            <div>
                                <h2 className="text-lg font-medium">
                                    No results found
                                </h2>
                                <p className="text-sm mt-1">
                                    Try adjusting your filters or price range
                                </p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <ProductCardContainer className="md:grid-cols-2! lg:grid-cols-3! ">
                                {visibleProducts.map((product) => (
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
