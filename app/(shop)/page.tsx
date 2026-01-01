import ProductCard from "@/components/product/ProductCard";
import { products } from "@/lib/mock-products";

export default function ShopPage() {
    return (
        <section className="py-8">
            <h1 className="mb-4 text-4xl font-semibold">Products</h1>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </section>
    );
}
