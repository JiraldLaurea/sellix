import Link from "next/link";
import Image from "next/image";
import { Product } from "@/lib/mock-products";

type Props = {
    product: Product;
};

export default function ProductCard({ product }: Props) {
    return (
        <Link href={`/product/${product.id}`} className="block">
            <div className="group border rounded-lg overflow-hidden hover:shadow-md transition">
                <div className="relative aspect-square bg-gray-100">
                    <Image
                        src={product.images[0]}
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

                    <button
                        disabled={product.stock === 0}
                        className={`mt-2 w-full rounded-md py-2 text-sm transition
              ${
                  product.stock === 0
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black text-white hover:bg-gray-800"
              }
            `}
                    >
                        {product.stock === 0 ? "Out of stock" : "Add to cart"}
                    </button>
                </div>
            </div>
        </Link>
    );
}
