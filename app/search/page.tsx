import PageContainer from "@/components/ui/PageContainer";
import { getProducts } from "@/lib/getProducts";
import { prisma } from "@/lib/prisma";
import SearchResults from "./search-results";

export default async function SearchPage() {
    const { items, nextCursor, totalCount } = await getProducts();

    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
        },
        orderBy: {
            name: "asc",
        },
    });

    return (
        <SearchResults
            initialProducts={items}
            initialCursor={nextCursor}
            categories={categories}
            totalCount={totalCount}
        />
    );
}

function SearchSkeleton() {
    return (
        <PageContainer>
            <div className="mb-4 h-6 w-48 rounded bg-gray-200" />
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-64 rounded bg-gray-100" />
                ))}
            </div>
        </PageContainer>
    );
}
