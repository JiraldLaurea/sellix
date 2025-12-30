import Image from "next/image";
import { Product } from "@/lib/mock-products";

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    return (
        <div className="group border rounded-lg overflow-hidden hover:shadow-md transition">
            <div className="relative aspect-square bg-gray-100">
                <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition"
                />
            </div>

            <div className="p-4 space-y-2">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-600">
                    ${(product.price / 100).toFixed(2)}
                </p>

                <button className="mt-2 w-full rounded-md bg-black text-white py-2 text-sm hover:bg-gray-800 transition">
                    Add to cart
                </button>
            </div>
        </div>
    );
}
