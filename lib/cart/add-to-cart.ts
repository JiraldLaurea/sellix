export async function addToCart(
    productId: string,
    quantity: number = 1
): Promise<{ success: boolean; status?: number; error?: string }> {
    const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
    });

    if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        return {
            success: false,
            status: res.status,
            error: data.error,
        };
    }

    return { success: true };
}
