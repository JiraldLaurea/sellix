"use client";

import { CategoryCardProps } from "@/app/types";
import CategoryCard from "@/components/category/CategoryCard";
import PageContainer from "@/components/ui/PageContainer";
import { useState } from "react";

const INITIAL_COUNT = 4;
const STEP = 20;

export default function CategoryClient({
    categories,
}: {
    categories: CategoryCardProps[];
}) {
    const [visible, setVisible] = useState(INITIAL_COUNT);

    const showMore = () => setVisible((v) => v + STEP);

    return (
        <PageContainer className="min-h-auto">
            <h1 className="mb-8 text-3xl font-semibold">Browse Categories</h1>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                {categories.slice(0, visible).map((category) => (
                    <CategoryCard key={category.id} category={category} />
                ))}
            </div>

            {visible < categories.length && (
                <div className="flex justify-center mt-8">
                    <button
                        onClick={showMore}
                        className="w-full px-6 py-2 text-sm font-medium text-white transition border rounded-lg sm:w-fit bg-linear-to-t from-blue-600 to-blue-500 hover:from-blue-700"
                    >
                        Show All Categories
                    </button>
                </div>
            )}
        </PageContainer>
    );
}
