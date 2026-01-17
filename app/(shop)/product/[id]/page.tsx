import { getProductById } from "@/lib/getProductById";
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function ProductDetailsPage({ params }: Props) {
    const productId = (await params).id;

    const product = await getProductById(productId);

    if (!product) {
        notFound();
    }

    return <ProductClient product={product} />;
}
