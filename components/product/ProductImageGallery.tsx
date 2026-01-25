"use client";

import Image from "next/image";
import { useRef, useState } from "react";

type Props = {
    images: string[];
    alt: string;
};

const MIN_LOADING_MS = 350;
const FADE_OUT_MS = 100;

export default function ProductImageGallery({ images, alt }: Props) {
    const [selectedImage, setSelectedImage] = useState(images[0]); // UI feedback
    const [activeImage, setActiveImage] = useState(images[0]); // rendered image
    const [isMainLoading, setIsMainLoading] = useState(false);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>(
        {},
    );

    const loadStartRef = useRef(0);

    const handleSelect = (img: string) => {
        if (img === selectedImage) return;

        // instant outline update
        setSelectedImage(img);

        // fade current image
        setIsFadingOut(true);

        setTimeout(() => {
            loadStartRef.current = Date.now();
            setIsMainLoading(true);
            setActiveImage(img);
            setIsFadingOut(false);
        }, FADE_OUT_MS);
    };

    const handleMainLoaded = () => {
        const elapsed = Date.now() - loadStartRef.current;
        const remaining = Math.max(0, MIN_LOADING_MS - elapsed);

        setTimeout(() => {
            setIsMainLoading(false);
        }, remaining);
    };

    return (
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            {/* SELECTED IMAGE */}
            <div className="p-4 overflow-hidden border rounded-md bg-gray-50 flex-1 max-h-fit">
                <div className="relative aspect-square">
                    {isMainLoading && (
                        <div className="absolute inset-0 z-10 bg-gray-50 animate-pulse" />
                    )}

                    <Image
                        src={activeImage}
                        alt={alt}
                        quality={25}
                        fill
                        sizes="(max-width: 768px) 25vw, 25vw"
                        className={`object-cover transition-opacity duration-300 ${
                            isFadingOut || isMainLoading
                                ? "opacity-0"
                                : "opacity-100"
                        }`}
                        priority
                        onLoad={handleMainLoaded}
                    />
                </div>
            </div>

            {/* IMAGE GALLERY */}
            <div className="flex p-1 md:pt-1 md:pl-1 select-none gap-3 md:flex-col overflow-x-auto md:pr-4 md:max-h-112 sm:w-[calc(100vw-78px)] w-[calc(100vw-46px)] md:w-fit md:overflow-y-auto md:overflow-visible">
                {images.map((img) => {
                    const isLoaded = loadedImages[img];

                    return (
                        <button
                            key={img}
                            onClick={() => handleSelect(img)}
                            className={`relative border flex-none h-20 w-20 rounded-md overflow-hidden
                            ${
                                selectedImage === img
                                    ? "outline-2 outline-black"
                                    : ""
                            }
                            `}
                        >
                            {!isLoaded && (
                                <div className="absolute inset-0 bg-gray-100 animate-pulse" />
                            )}
                            <div className="p-2 bg-gray-50">
                                <div className="relative aspect aspect-square">
                                    <Image
                                        src={img}
                                        alt=""
                                        fill
                                        quality={50}
                                        sizes="10vw"
                                        className={`object-cover transition-opacity duration-300 ${
                                            isLoaded
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                        onLoad={() =>
                                            setLoadedImages((prev) => ({
                                                ...prev,
                                                [img]: true,
                                            }))
                                        }
                                    />
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
