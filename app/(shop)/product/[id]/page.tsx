import { products } from "@/lib/mock-products";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductPurchase from "@/components/product/ProductPurchase";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProductPage({ params }: Props) {
    const { id } = await params;

    const product = products.find((p) => p.id === id);

    if (!product) {
        notFound();
    }

    return (
        <section className="py-8 grid gap-8 md:grid-cols-2">
            {/* Image */}
            <ProductImageGallery images={product.images} alt={product.name} />

            {/* Details */}
            <div className="space-y-4">
                <h1 className="text-2xl font-semibold">{product.name}</h1>

                <p className="text-xl text-gray-800">
                    ${(product.price / 100).toFixed(2)}
                </p>

                <p className="text-gray-600">{product.description}</p>

                {/* Quantity + Add to cart */}
                <ProductPurchase product={product} />
            </div>
        </section>
    );
}
