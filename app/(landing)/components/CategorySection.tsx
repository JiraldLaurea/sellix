"use client";

import { CategoryCardProps } from "@/app/types";
import CategoryCard from "@/components/category/CategoryCard";
import { Header } from "@/components/ui/Header";
import SectionContainer from "@/components/ui/SectionContainer";
import { useState } from "react";

const INITIAL_COUNT = 5;
const STEP = 20;

export default function CategorySection({
    categories,
}: {
    categories: CategoryCardProps[];
}) {
    const [visible, setVisible] = useState(INITIAL_COUNT);

    const showMore = () => setVisible((v) => v + STEP);

    return (
        <SectionContainer className="min-h-auto">
            <Header text="Categories" />

            <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-4 lg:grid-cols-5">
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
        </SectionContainer>
    );
}
