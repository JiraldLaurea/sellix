import ProductCard from "@/components/product/ProductCard";
import { getProducts } from "@/lib/getProducts";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { Product } from "../types/product";

export default async function ShopPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const products = await getProducts(20);

    return (
        <section className="py-8">
            <h1 className="mb-4 text-4xl font-semibold">Products Catalog</h1>
            <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
                {products ? (
                    <>
                        {products.map((product: Product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </>
                ) : (
                    <>
                        <div className="flex flex-col bg-gray-100 border rounded-lg h-107 animate-pulse" />
                        <div className="flex flex-col bg-gray-100 border rounded-lg h-107 animate-pulse" />
                        <div className="flex flex-col bg-gray-100 border rounded-lg h-107 animate-pulse" />
                        <div className="flex flex-col bg-gray-100 border rounded-lg h-107 animate-pulse" />
                    </>
                )}
            </div>
        </section>
    );
}
