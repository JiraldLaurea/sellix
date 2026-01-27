"use client";

import { Product } from "@/app/types";
import ProductCard from "@/components/product/ProductCard";
import { Header } from "@/components/ui/Header";
import PageContainer from "@/components/ui/PageContainer";
import { useFavorites } from "@/lib/favorites-context";
import Link from "next/link";
import { LuHeart } from "react-icons/lu";

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
            <PageContainer className="p-0! -my-6 flex flex-col items-center justify-center text-center space-y-6">
                <div className="p-4 bg-gray-100 rounded-lg">
                    <LuHeart size={30} className="text-gray-400" />
                </div>
                <div className="text-gray-500 space-y-1">
                    <h1 className="mb-1 text-lg font-medium">
                        No favorites yet
                    </h1>
                    <p className="text-sm">
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
            <Header text="Favorites" />

            <div className="grid grid-cols-2 gap-2 sm:gap-3 md:grid-cols-2 lg:grid-cols-3">
                {visibleProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
