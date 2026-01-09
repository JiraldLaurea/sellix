"use client";

import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductPurchase from "@/components/product/ProductPurchase";
import { formatMoney } from "@/lib/formatMoney";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

type Props = {
    product: any;
};

export default function ProductClient({ product }: Props) {
    const router = useRouter();
    return (
        <section className="py-8 grid gap-8 md:grid-cols-2">
            {/* Image */}

            <ProductImageGallery images={product.images} alt={product.name} />

            {/* Details */}
            <div className="space-y-4">
                <div
                    onClick={() => router.back()}
                    className="text-gray-600 cursor-pointer hover:underline flex items-center w-fit"
                >
                    <IoIosArrowBack size={24} />
                    <p>Back</p>
                </div>
                <h1 className="text-2xl font-semibold">{product.name}</h1>

                <p className="text-xl text-gray-800">
                    {formatMoney(product.price / 100).toFixed(2)}
                </p>

                <p className="text-gray-600">{product.description}</p>

                {/* Quantity + Add to cart */}
                <ProductPurchase product={product} />
            </div>
        </section>
    );
}
