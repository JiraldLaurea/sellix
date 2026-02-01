"use client";

import { Product } from "@/app/types";
import ProductCard from "@/components/product/ProductCard";
import { Header } from "@/components/ui/Header";
import ProductCardContainer from "@/components/ui/ProductCardContainer";
import SectionContainer from "@/components/ui/SectionContainer";
import { useEffect, useRef, useState } from "react";

type ShopClientProps = {
    initialProducts: Product[];
    initialCursor: string | null;
};

export default function ShopClient({
    initialProducts,
    initialCursor,
}: ShopClientProps) {
    const [products, setProducts] = useState(initialProducts);
    const [cursor, setCursor] = useState<string | null>(initialCursor);
    const [loading, setLoading] = useState(false);

    const loadMoreRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!cursor) return;

        const observer = new IntersectionObserver(async ([entry]) => {
            if (!entry.isIntersecting || loading) return;

            setLoading(true);

            const res = await fetch(`/api/products?cursor=${cursor}`);
            const data = await res.json();

            setProducts((prev) => [...prev, ...data.items]);
            setCursor(data.nextCursor);
            setLoading(false);
        });

        if (loadMoreRef.current) {
            observer.observe(loadMoreRef.current);
        }

        return () => observer.disconnect();
    }, [cursor, loading]);

    return (
        <SectionContainer>
            <Header text="Products Catalog" />

            <ProductCardContainer>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}

                {loading &&
                    Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="bg-gray-100 border h-107 animate-pulse"
                        />
                    ))}
            </ProductCardContainer>

            {cursor && <div ref={loadMoreRef} className="h-1" />}
        </SectionContainer>
    );
}
