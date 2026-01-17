"use client";

import PageContainer from "@/components/ui/PageContainer";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const INITIAL_COUNT = 4;
const STEP = 20;

type Category = {
    id: string;
    name: string;
    image: string | null;
    itemCount: number;
};

export default function CategoryClient({
    categories,
}: {
    categories: Category[];
}) {
    const [visible, setVisible] = useState(INITIAL_COUNT);

    const showMore = () => setVisible((v) => v + STEP);

    return (
        <PageContainer className="min-h-auto">
            <h1 className="mb-8 text-3xl font-semibold">Browse Categories</h1>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
                {categories.slice(0, visible).map((category) => (
                    <Link
                        key={category.id}
                        href={`/search?category=${category.id}`}
                        className="flex flex-col h-full overflow-hidden border rounded-xl"
                    >
                        <div className="p-4 bg-gray-50">
                            <div className="relative w-full aspect-square">
                                {category.image && (
                                    <Image
                                        src={category.image}
                                        alt={category.name}
                                        fill
                                        sizes="10vw"
                                        className="object-contain"
                                    />
                                )}
                            </div>
                        </div>
                        <div className="w-full p-4 text-left border-t">
                            <p className="text-sm font-medium">
                                {category.name}
                            </p>
                            <p className="text-xs text-gray-500">
                                {category.itemCount} items
                            </p>
                        </div>
                    </Link>
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
