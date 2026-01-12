"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/app/types";
import PageContainer from "@/components/ui/PageContainer";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/Button";

export default function HeroCarousel() {
    const [emblaRef] = useEmblaCarousel(
        {
            loop: true,
            align: "center",
        },
        [
            Autoplay({
                delay: 3000,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
            }),
        ]
    );
    const router = useRouter();

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        async function loadProducts() {
            const res = await fetch("/api/hero-products");

            const data = await res.json();

            setProducts(data);
        }

        loadProducts();
    }, []);

    return (
        <PageContainer className="relative max-w-full px-0! flex items-center  bg-linear-to-r from-black via-neutral-900 to-black text-white">
            <div
                className="overflow-hidden embla md:h-100 select-none"
                ref={emblaRef}
            >
                <div className="flex h-full!">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-[0_0_100%] flex h-full! items-center justify-center"
                        >
                            <div className="flex px-4 md:px-8 max-w-6xl md:space-y-0  md:pb-0 w-full md:flex-row flex-col-reverse items-center justify-between">
                                {/* LEFT */}
                                <div className="space-y-6">
                                    <span className="inline-block rounded-full bg-white text-black px-4 py-1 text-sm font-semibold">
                                        Opening Sale 50%
                                    </span>

                                    <h1 className="text-3xl md:text-5xl font-bold leading-tight">
                                        {product.name}
                                    </h1>

                                    <p className="text-gray-300 line-clamp-3">
                                        {product.description}
                                    </p>
                                    <Button
                                        onClick={() =>
                                            router.push(
                                                `/product/${product.id}`
                                            )
                                        }
                                        className="bg-blue-500 text-base! w-fit! h-12 font-semibold hover:bg-blue-600!"
                                    >
                                        Shop now
                                    </Button>
                                </div>

                                {/* RIGHT */}
                                <div className="flex-none mb-8 md:mb-0 relative w-70 h-70 lg:w-105 lg:h-105">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        quality={100}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                                        className="object-cover"
                                        priority
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </PageContainer>
    );
}
