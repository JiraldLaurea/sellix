"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Product } from "@/app/types";
import PageContainer from "@/components/ui/PageContainer";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/Button";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";

export default function HeroCarousel() {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const router = useRouter();

    const isMobile = () => window.matchMedia("(max-width: 48rem)").matches;

    const [watchDrag, setWatchDrag] = useState(false);

    useEffect(() => {
        setWatchDrag(isMobile());

        const mq = window.matchMedia("(max-width: 48rem)");
        const handler = (e: MediaQueryListEvent) => setWatchDrag(e.matches);
        mq.addEventListener("change", handler);

        return () => mq.removeEventListener("change", handler);
    }, []);

    const [emblaRef, emblaApi] = useEmblaCarousel(
        {
            loop: true,
            duration: 20,
            watchDrag,
        },
        [
            Autoplay({
                delay: 5000,
                stopOnInteraction: false,
                stopOnMouseEnter: false,
            }),
        ]
    );

    useEffect(() => {
        if (!emblaApi) return;

        const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());

        emblaApi.on("select", onSelect);
        onSelect();

        return () => {
            emblaApi.off("select", onSelect);
        };
    }, [emblaApi]);

    useEffect(() => {
        async function loadProducts() {
            const res = await fetch("/api/hero-products");

            const data = await res.json();

            setProducts(data);
        }

        loadProducts();
    }, []);

    return (
        <PageContainer className="relative max-w-full px-0! flex items-center bg-accent text-white">
            <div
                className="overflow-hidden relative embla md:h-115 select-none  flex justify-center"
                ref={emblaRef}
            >
                <div className="flex relative w-full max-w-6x mx-auto">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="flex-[0_0_100%] flex pb-8 md:pb-8 items-center justify-center"
                        >
                            <div className="flex px-4 max-w-6xl md:space-y-0  md:pb-0 w-full md:flex-row flex-col-reverse items-center justify-between">
                                {/* LEFT */}
                                <div className="space-y-4 md:space-y-6">
                                    <span className="inline-block rounded-full bg-white text-black px-4 py-1 text-xs md:text-sm font-semibold">
                                        Opening Sale 50% Discount
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
                                        className="md:w-fit! text-base! h-12 font-semibold hover:bg-blue-600!"
                                    >
                                        Shop Now
                                    </Button>
                                </div>

                                {/* RIGHT */}
                                <div className="flex-none mb-8 md:mb-0 relative w-70 h-70 lg:w-100 lg:h-100">
                                    <Image
                                        src={product.images[0]}
                                        alt={product.name}
                                        fill
                                        preload
                                        loading="eager"
                                        quality={100}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                                        className="object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots + Arrows */}
                {products.length > 0 && (
                    <div className="absolute bottom-0 w-full left-0">
                        <div className="flex items-center space-x-4 justify-center md:justify-start px-4 max-w-6xl mx-auto">
                            {/* DOTS */}
                            <div className="space-x-2 w-18">
                                {products.map((_, index) => (
                                    <button
                                        key={index}
                                        className={`h-2 cursor-default rounded-full duration-300
                                                    ${
                                                        index === selectedIndex
                                                            ? "w-6 bg-white"
                                                            : "w-2 bg-neutral-600"
                                                    }`}
                                    />
                                ))}
                            </div>
                            <div className="hidden md:flex">
                                {/* LEFT CARET */}
                                <button
                                    onClick={() => emblaApi?.scrollPrev()}
                                    className="h-8 w-8 text-neutral-400 flex items-center justify-center rounded-full  border-neutral-700 hover:text-white  hover:bg-neutral-800 transition-colors"
                                    aria-label="Previous slide"
                                >
                                    <FaAngleLeft size={14} className="" />
                                </button>

                                {/* RIGHT CARET */}
                                <button
                                    onClick={() => emblaApi?.scrollNext()}
                                    className="h-8 w-8 text-neutral-400 flex items-center justify-center rounded-full  border-neutral-700 hover:text-white  hover:bg-neutral-800 transition-colors"
                                    aria-label="Next slide"
                                >
                                    <FaAngleRight size={14} className="" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageContainer>
    );
}
