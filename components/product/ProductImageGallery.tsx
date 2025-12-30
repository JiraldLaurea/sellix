"use client";

import { useState } from "react";
import Image from "next/image";

type Props = {
    images: string[];
    alt: string;
};

export default function ProductImageGallery({ images, alt }: Props) {
    const [activeImage, setActiveImage] = useState(images[0]);

    return (
        <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <Image
                    src={activeImage}
                    alt={alt}
                    fill
                    className="object-cover"
                />
            </div>

            <div className="flex gap-3">
                {images.map((img) => (
                    <button
                        key={img}
                        onClick={() => setActiveImage(img)}
                        className={`relative h-20 w-20 rounded-md overflow-hidden border
              ${activeImage === img ? "border-black" : "border-transparent"}
            `}
                    >
                        <Image src={img} alt="" fill className="object-cover" />
                    </button>
                ))}
            </div>
        </div>
    );
}
