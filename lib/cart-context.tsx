"use client";

import { AddToCartResult, CartItem, CartState } from "@/app/types";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { delay } from "./delay";

const CartContext = createContext<{
    state: CartState;
    loading: boolean;
    addToCart: (
        productId: string,
        quantity: number
    ) => Promise<AddToCartResult>;
    refreshCart: () => Promise<void>;
    removeCartItem: (cartItemId: string) => Promise<void>;
    clearCart: () => Promise<void>;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    hydrateCart: (items: CartItem[]) => void;
}>({
    state: { items: [] },
    loading: false,
    addToCart: async () => ({ success: false }),
    refreshCart: async () => {},
    removeCartItem: async () => {},
    clearCart: async () => {},
    updateQuantity: () => {},
    hydrateCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<CartState>({ items: [] });
    const [loading, setLoading] = useState<boolean>(true);

    // 🔁 Debounce timer for quantity sync
    const syncTimeout = useRef<NodeJS.Timeout | null>(null);

    const hydrateCart = (items: CartItem[]) => {
        setState({ items });
    };

    const addToCart = async (
        productId: string,
        quantity: number
    ): Promise<AddToCartResult> => {
        const res = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity }),
        });

        // Force visible loading state
        await delay(500);

        if (!res.ok) {
            const data = await res.json().catch(() => ({}));

            if (res.status === 401) {
                return { success: false, reason: "unauthorized" };
            }

            if (data.error === "Max stock reached") {
                return { success: false, reason: "max_stock" };
            }

            return { success: false, reason: "unknown" };
        }

        // Sync cart after success
        await refreshCart();

        return { success: true };
    };

    const refreshCart = async () => {
        const res = await fetch("/api/cart", {
            next: { revalidate: 0 }, // Disable caching
        });

        const data = await res.json();
        setState({ items: data?.items ?? [] });
        setLoading(false);
    };

    const removeCartItem = async (cartItemId: string) => {
        // Optimistic UI
        setState((prev) => ({
            ...prev,
            items: prev.items.filter((i) => i.id !== cartItemId),
        }));

        await fetch("/api/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartItemId }),
        });
    };

    const clearCart = async () => {
        await fetch("/api/cart/clear", {
            method: "DELETE",
        });

        // Force visible loading state
        await delay(800);

        // Immediate UI response
        setState({ items: [] });

        // Full refresh is OK here (rare action)
        router.refresh();
    };

    // Optimistic + debounced quantity update
    const updateQuantity = (cartItemId: string, quantity: number) => {
        // 1️⃣ Optimistic UI update
        setState((prev) => ({
            ...prev,
            items: prev.items.map((item) =>
                item.id === cartItemId ? { ...item, quantity } : item
            ),
        }));

        // 2️⃣ Debounced server sync
        if (syncTimeout.current) {
            clearTimeout(syncTimeout.current);
        }

        syncTimeout.current = setTimeout(async () => {
            const res = await fetch("/api/cart", {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ cartItemId, quantity }),
            });

            // Rollback on failure
            if (!res.ok) {
                await refreshCart();
            }
        }, 400);
    };

    // 🔄 Fetch cart on mount
    useEffect(() => {
        refreshCart();
    }, []);

    return (
        <CartContext.Provider
            value={{
                state,
                loading,
                addToCart,
                refreshCart,
                removeCartItem,
                clearCart,
                updateQuantity,
                hydrateCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
