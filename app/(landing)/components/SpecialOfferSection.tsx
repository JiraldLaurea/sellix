"use client";

import { Header } from "@/components/ui/Header";
import SectionContainer from "@/components/ui/SectionContainer";
import { formatMoney } from "@/lib/formatMoney";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

type Product = {
    id: string;
    name: string;
    price: number;
    images: string[];
};

const BG_COLORS = ["bg-orange-100", "bg-purple-100", "bg-blue-100"];
const BG_COLORS_HOVERED = [
    "hover:bg-orange-200",
    "hover:bg-purple-200",
    "hover:bg-blue-200",
];

function getTimeLeft(end: number) {
    const diff = end - Date.now();

    if (diff <= 0) {
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    return {
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
    };
}

export default function SpecialOfferSection({
    products,
}: {
    products: Product[];
}) {
    const [endTime] = useState(Date.now() + 1000 * 60 * 60 * 30); // 30h
    const [time, setTime] = useState(getTimeLeft(endTime));

    useEffect(() => {
        const interval = setInterval(() => {
            setTime(getTimeLeft(endTime));
        }, 1000);

        return () => clearInterval(interval);
    }, [endTime]);

    return (
        <SectionContainer>
            <Header text="Special Offer" />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product, i) => (
                    <Link
                        key={product.id}
                        href={`/product/${product.id}`}
                        className={`rounded-2xl p-6 text-center transition-colors ${BG_COLORS[i % BG_COLORS.length]} ${BG_COLORS_HOVERED[i % BG_COLORS_HOVERED.length]}`}
                    >
                        <div className="relative w-full h-68 mb-4">
                            <Image
                                src={product.images[0]}
                                alt={product.name}
                                fill
                                className="object-contain"
                            />
                        </div>

                        <p className="text-sm text-muted-foreground">
                            {product.name}
                        </p>

                        <p className="text-lg font-semibold mt-1">
                            From {formatMoney(product.price)}
                        </p>

                        {/* countdown */}
                        <div className="flex justify-center gap-4 mt-4">
                            {[
                                { label: "days", value: time.days },
                                { label: "hours", value: time.hours },
                                { label: "minutes", value: time.minutes },
                                { label: "seconds", value: time.seconds },
                            ].map(({ label, value }) => (
                                <div
                                    key={label}
                                    className="flex flex-col items-center"
                                >
                                    <div className="w-12 h-10 flex items-center justify-center bg-black text-white rounded-md text-sm font-medium tabular-nums">
                                        {String(value).padStart(2, "0")}
                                    </div>

                                    <span className="mt-1 text-xs text-muted-foreground">
                                        {label}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Link>
                ))}
            </div>
        </SectionContainer>
    );
}
