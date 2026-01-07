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
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {products ? (
                    <>
                        {products.map((product: Product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </>
                ) : (
                    <>
                        <div className=" border flex h-107 flex-col rounded-lg animate-pulse bg-gray-100" />
                        <div className=" border flex h-107 flex-col rounded-lg animate-pulse bg-gray-100" />
                        <div className=" border flex h-107 flex-col rounded-lg animate-pulse bg-gray-100" />
                        <div className=" border flex h-107 flex-col rounded-lg animate-pulse bg-gray-100" />
                    </>
                )}
            </div>
        </section>
    );
}
