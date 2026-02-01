import SectionContainer from "@/components/ui/SectionContainer";
import { Header } from "@/components/ui/Header";
import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";
import { ProductUI } from "@/app/types";
import ProductCardContainer from "@/components/ui/ProductCardContainer";

export default function CategoryPreviewSection({
    title,
    categoryId,
    products,
}: {
    title: string;
    categoryId: string;
    products: ProductUI[];
}) {
    return (
        <SectionContainer>
            <div className="flex items-center justify-between mb-4 sm:mb-6 ">
                <Header text={title} className="mb-0!" />

                <Link
                    href={`/search?category=${categoryId}`}
                    className="text-blue-500 text-sm font-medium hover:underline"
                >
                    Show more
                </Link>
            </div>

            <ProductCardContainer>
                {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </ProductCardContainer>
        </SectionContainer>
    );
}
