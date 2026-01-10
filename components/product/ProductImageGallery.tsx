"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
    images: string[];
    alt: string;
};

export default function ProductImageGallery({ images, alt }: Props) {
    const [activeImage, setActiveImage] = useState(images[0]);
    const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>(
        {}
    );

    return (
        <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative overflow-hidden bg-gray-100 rounded-md grow aspect-square">
                <Image
                    src={activeImage}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    className="object-cover"
                    preload
                    loading="eager"
                />
            </div>

            <div className="flex gap-3 md:flex-col">
                {images.map((img) => {
                    const isLoaded = loadedImages[img];

                    return (
                        <button
                            key={img}
                            onClick={() => setActiveImage(img)}
                            className={`relative h-20 w-20 rounded-md overflow-hidden
                ${activeImage === img ? "ring-2 ring-offset-2" : ""}
              `}
                        >
                            {/* Skeleton */}
                            {!isLoaded && (
                                <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                            )}

                            <Image
                                src={img}
                                alt=""
                                fill
                                quality={50}
                                sizes="(max-width: 768px) 10vw, (max-width: 1200px) 10vw, 10vw"
                                className={`object-cover transition-opacity duration-300
                  ${isLoaded ? "opacity-100" : "opacity-0"}
                `}
                                onLoad={() =>
                                    setLoadedImages((prev) => ({
                                        ...prev,
                                        [img]: true,
                                    }))
                                }
                            />
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
