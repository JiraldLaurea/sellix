"use client";

import { CartItem, CartState } from "@/app/types";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

const CartContext = createContext<{
    state: CartState;
    refreshCart: () => Promise<void>;
    clearCart: () => Promise<void>;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    hydrateCart: (items: CartItem[]) => void;
}>({
    state: { items: [] },
    refreshCart: async () => {},
    clearCart: async () => {},
    updateQuantity: () => {},
    hydrateCart: () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<CartState>({ items: [] });

    // 🔁 Debounce timer for quantity sync
    const syncTimeout = useRef<NodeJS.Timeout | null>(null);

    const hydrateCart = (items: CartItem[]) => {
        setState({ items });
    };

    const refreshCart = async () => {
        const res = await fetch("/api/cart", { cache: "no-store" });
        const data = await res.json();
        if (data?.items) {
            setState({ items: data.items });
        }
    };

    const clearCart = async () => {
        await fetch("/api/cart/clear", {
            method: "DELETE",
        });

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
                refreshCart,
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
