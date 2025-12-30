import { products } from "@/lib/mock-products";
import { notFound } from "next/navigation";
import ProductImageGallery from "@/components/product/ProductImageGallery";

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

                <div className="flex items-center gap-4 pt-4">
                    <input
                        type="number"
                        min={1}
                        defaultValue={1}
                        className="w-20 border rounded-md px-3 py-2"
                    />

                    <button
                        disabled={product.stock === 0}
                        className={`flex-1 rounded-md py-3 transition ${
                            product.stock === 0
                                ? "bg-gray-400 cursor-not-allowed"
                                : "bg-black text-white hover:bg-gray-800"
                        }`}
                    >
                        {product.stock === 0 ? "Out of stock" : "Add to cart"}
                    </button>
                </div>
            </div>
        </section>
    );
}
