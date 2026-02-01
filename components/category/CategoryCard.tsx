"use client";

import { CategoryCardProps } from "@/app/types";
import Image from "next/image";
import Link from "next/link";

export default function CategoryCard({
    category,
}: {
    category: CategoryCardProps;
}) {
    return (
        <Link
            key={category.id}
            href={`/search?category=${category.id}`}
            className="flex flex-col h-full overflow-hidden border rounded-xl"
        >
            <div className="p-8 bg-gray-50">
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
            <div className="w-full p-3 text-left border-t">
                <p className="text-sm font-medium">{category.name}</p>
                <p className="text-xs text-gray-500">
                    {category.itemCount} items
                </p>
            </div>
        </Link>
    );
}
