import { Product } from "@/app/types/product"; // optional, or inline type

export async function getProducts(limit = 20): Promise<Product[]> {
    const res = await fetch("https://api.escuelajs.co/api/v1/products", {
        cache: "no-store", // always fresh (client-safe)
    });

    if (!res.ok) {
        throw new Error("Failed to fetch products");
    }

    const data = await res.json();

    return data.slice(0, limit).map((p: any) => ({
        id: String(p.id),
        name: p.title,
        price: Math.round(p.price * 100), // cents
        description: p.description,
        stock: Math.floor(Math.random() * 20) + 1, // mock stock
        images: (p.images ?? []).map(normalizeImage),
    }));
}

function normalizeImage(url: string): string {
    if (url.startsWith("https://corsproxy.io/?")) {
        return decodeURIComponent(url.replace("https://corsproxy.io/?", ""));
    }
    return url;
}
