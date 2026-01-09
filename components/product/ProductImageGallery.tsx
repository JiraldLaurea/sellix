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
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="relative grow aspect-square bg-gray-100 rounded-md overflow-hidden">
                <Image
                    src={activeImage}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
                    className="object-cover"
                />
            </div>

            <div className="flex md:flex-col gap-3">
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
                                <div className="absolute inset-0 animate-pulse bg-gray-200" />
                            )}

                            <Image
                                src={img}
                                alt=""
                                fill
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
