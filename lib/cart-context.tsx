"use client";

import { AddToCartResult, CartItem, CartState } from "@/app/types";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from "react";
import { delay } from "./delay";

type CartContextType = {
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
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const { status } = useSession();

    const [state, setState] = useState<CartState>({ items: [] });
    const [loading, setLoading] = useState(true);

    // 🔁 Debounce timer for quantity sync
    const syncTimeout = useRef<NodeJS.Timeout | null>(null);

    // Fetch cart when user becomes authenticated
    useEffect(() => {
        if (status === "authenticated") {
            refreshCart();
        }
    }, [status]);

    // Cleanup debounce timer on unmount / HMR
    useEffect(() => {
        return () => {
            if (syncTimeout.current) clearTimeout(syncTimeout.current);
        };
    }, []);

    const hydrateCart = useCallback((items: CartItem[]) => {
        setState({ items });
        setLoading(false);
    }, []);

    const refreshCart = useCallback(async () => {
        const res = await fetch("/api/cart", {
            cache: "no-store", // Disable caching
        });

        const data = await res.json();
        setState({ items: data?.items ?? [] });
        setLoading(false);
    }, []);

    const addToCart = useCallback(
        async (
            productId: string,
            quantity: number
        ): Promise<AddToCartResult> => {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, quantity }),
            });

            // Force visible loading state
            await delay(350);

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
        },
        [refreshCart]
    );

    const removeCartItem = useCallback(async (cartItemId: string) => {
        // Optimistic UI
        setState((prev) => ({
            items: prev.items.filter((i) => i.id !== cartItemId),
        }));

        await fetch("/api/cart", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ cartItemId }),
        });
    }, []);

    const clearCart = useCallback(async () => {
        await fetch("/api/cart/clear", {
            method: "DELETE",
        });

        // Force visible loading state
        await delay(800);

        // Immediate UI response
        setState({ items: [] });

        // Full refresh is OK here (rare action)
        router.refresh();
    }, [router]);

    // Optimistic + debounced quantity update
    const updateQuantity = useCallback(
        (cartItemId: string, quantity: number) => {
            // 1️⃣ Optimistic UI update
            setState((prev) => ({
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
        },
        [refreshCart]
    );

    const value = useMemo(
        () => ({
            state,
            loading,
            addToCart,
            refreshCart,
            removeCartItem,
            clearCart,
            updateQuantity,
            hydrateCart,
        }),
        [
            state,
            loading,
            addToCart,
            refreshCart,
            removeCartItem,
            clearCart,
            updateQuantity,
            hydrateCart,
        ]
    );

    return (
        <CartContext.Provider value={value}>{children}</CartContext.Provider>
    );
}

export const useCart = () => {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error("useCart must be used within CartProvider");
    return ctx;
};

// ✅ Selector (use this in Navbar)
export const useCartCount = () => {
    const { state } = useCart();
    return state.items.length;
};
