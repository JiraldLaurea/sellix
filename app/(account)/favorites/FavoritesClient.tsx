"use client";

import { useEffect } from "react";
import Link from "next/link";
import { LuHeart } from "react-icons/lu";
import ProductCard from "@/components/product/ProductCard";
import PageContainer from "@/components/ui/PageContainer";
import { Product } from "@/app/types";
import { useFavorites } from "@/lib/favorites-context";

type Props = {
    products: Product[];
    favoriteIds: string[]; // ✅ NEW
};

export default function FavoritesClient({ products, favoriteIds }: Props) {
    const { favorites } = useFavorites();

    // LIVE FILTERING
    const visibleProducts = products.filter((p) => favorites.includes(p.id));

    if (visibleProducts.length === 0) {
        return (
            <PageContainer className="p-0! -my-8 flex flex-col items-center justify-center text-center space-y-6">
                <div className="p-6 bg-gray-100 rounded-xl">
                    <LuHeart size={40} className="text-gray-500" />
                </div>

                <div>
                    <h1 className="mb-1 text-2xl font-semibold">
                        No favorites yet
                    </h1>
                    <p className="text-gray-600">
                        Items you favorite will appear here
                    </p>
                </div>

                <Link
                    href="/"
                    className="flex items-center justify-center h-12 px-6 text-sm font-medium text-white transition rounded-lg bg-linear-to-t from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-500"
                >
                    Start shopping
                </Link>
            </PageContainer>
        );
    }

    return (
        <section className="max-w-6xl">
            <h1 className="mb-6 text-3xl font-semibold">Favorites</h1>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
                {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
