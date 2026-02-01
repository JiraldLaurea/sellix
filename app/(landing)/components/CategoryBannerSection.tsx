import SectionContainer from "@/components/ui/SectionContainer";
import Link from "next/link";
import Image from "next/image";

type BannerItem = {
    title: string;
    description: string;
    image: string;
    href: string;
    className?: string;
};

export default function CategoryBannerSection({
    items,
}: {
    items: BannerItem[];
}) {
    return (
        <SectionContainer className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {items.map((item) => (
                <div
                    key={item.title}
                    className={`relative overflow-hidden rounded-2xl h-70 ${item.className}`}
                >
                    {/* Image container */}
                    <div className="absolute inset-0 flex items-center justify-end pr-6">
                        <div className="relative h-[85%] aspect-[3/4] max-w-[220px] sm:max-w-[260px]">
                            <Image
                                src={item.image}
                                alt={item.title}
                                fill
                                className="object-contain"
                                sizes="(max-width: 640px) 180px, 260px"
                                priority
                            />
                        </div>
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-linear-to-r from-black/20 via-black/10 to-transparent" />

                    {/* Content */}
                    <div className="relative z-10 p-8 h-full flex flex-col justify-between max-w-sm">
                        <div>
                            <h2 className="text-2xl font-semibold text-white">
                                {item.title}
                            </h2>
                            <p className="mt-2 text-white/90">
                                {item.description}
                            </p>
                        </div>

                        <Link
                            href={item.href}
                            className="inline-block w-fit rounded-lg bg-accent px-6 py-3 text-white font-medium hover:bg-neutral-800 transition-colors"
                        >
                            Shop Now
                        </Link>
                    </div>
                </div>
            ))}
        </SectionContainer>
    );
}
