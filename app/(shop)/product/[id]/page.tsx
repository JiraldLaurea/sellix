import { getProductById } from "@/lib/getProductById";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function CheckoutPage({ params }: Props) {
    const productId = (await params).id;

    const product = await getProductById(productId);

    if (!product) {
        notFound();
    }

    return (
        <main className="min-h-[calc(100vh-64px)] flex items-center justify-center">
            <ProductClient product={product} />
        </main>
    );
}
