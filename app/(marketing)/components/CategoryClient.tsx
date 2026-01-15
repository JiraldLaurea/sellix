"use client";

import PageContainer from "@/components/ui/PageContainer";
import Image from "next/image";
import { useState } from "react";

const INITIAL_COUNT = 10;
const STEP = 20;

export default function CategoryClient({
    categories,
}: {
    categories: {
        id: string;
        name: string;
        image: string | null;
    }[];
}) {
    const [visible, setVisible] = useState(INITIAL_COUNT);

    const showMore = () => setVisible((v) => v + STEP);

    return (
        <PageContainer>
            <h1 className="mb-4 text-4xl font-semibold">Categories</h1>

            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4 lg:grid-cols-5">
                {categories.slice(0, visible).map((category) => (
                    <div key={category.id} className="space-y-2">
                        <div
                            // href={`/shop?category=${category.id}`}
                            className="group rounded-lg border overflow-hidden block"
                        >
                            <div className="bg-gray-100 py-2">
                                <div className="relative aspect-square">
                                    {category.image && (
                                        <Image
                                            src={category.image}
                                            alt={category.name}
                                            fill
                                            className="object-contain"
                                        />
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <p className="text-sm font-medium cursor-pointer hover:underline">
                                {category.name}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {visible < categories.length && (
                <div className="mt-8 flex justify-center">
                    <button
                        onClick={showMore}
                        className="px-6 hover:from-blue-700 from-blue-600 text-sm  to-blue-500 text-white font-medium bg-linear-to-t py-2 w-full sm:w-fit border rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        Show All Categories
                    </button>
                </div>
            )}
        </PageContainer>
    );
}
