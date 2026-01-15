"use client";

import PageContainer from "@/components/ui/PageContainer";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const INITIAL_COUNT = 5;
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
        <PageContainer>
            <h1 className="mb-8 text-3xl font-semibold">Browse Categories</h1>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-5">
                {categories.slice(0, visible).map((category) => (
                    <Link
                        key={category.id}
                        href={`/search?category=${category.id}`}
                        className="flex h-full flex-col overflow-hidden rounded-xl border"
                    >
                        <div className="relative aspect-square w-full bg-gray-50 p-2">
                            {category.image && (
                                <Image
                                    src={category.image}
                                    alt={category.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 100vw"
                                    className="object-contain"
                                />
                            )}
                        </div>

                        <div className="w-full border-t p-4 text-left">
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
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={showMore}
                        className="w-full sm:w-fit rounded-lg border bg-linear-to-t from-blue-600 to-blue-500 px-6 py-2 text-sm font-medium text-white transition hover:from-blue-700"
                    >
                        Show All Categories
                    </button>
                </div>
            )}
        </PageContainer>
    );
}
