export async function updateCartQuantity(
    cartItemId: string,
    quantity: number
): Promise<{ success: boolean; status?: number; error?: string }> {
    const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItemId, quantity }),
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
