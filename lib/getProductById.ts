import { Product } from "@/app/types/product";

export async function getProductById(id: string): Promise<Product | null> {
    const res = await fetch(`https://api.escuelajs.co/api/v1/products/${id}`, {
        cache: "no-store", // always fresh
    });

    console.log("RESPONSE", res);

    if (!res.ok) {
        return null;
    }

    const p = await res.json();

    return {
        id: String(p.id),
        name: p.title,
        price: Math.round(p.price * 100), // cents
        description: p.description,
        stock: Math.floor(Math.random() * 20) + 1,
        images: (p.images ?? []).map(normalizeImage),
    };
}

function normalizeImage(url: string): string {
    if (url.startsWith("https://corsproxy.io/?")) {
        return decodeURIComponent(url.replace("https://corsproxy.io/?", ""));
    }
    return url;
}
