import { Suspense } from "react";
import { getProducts } from "@/lib/getProducts";
import SearchResults from "./search-results";

export default async function SearchPage() {
    const products = await getProducts();

    return (
        <Suspense fallback={<SearchSkeleton />}>
            <SearchResults products={products} />
        </Suspense>
    );
}

function SearchSkeleton() {
    return (
        <div className="max-w-6xl mx-auto py-8 px-4">
            <div className="h-6 w-48 bg-gray-200 rounded mb-4" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-64 bg-gray-100 rounded" />
                ))}
            </div>
        </div>
    );
}
