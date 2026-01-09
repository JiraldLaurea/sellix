"use client";

import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

type CartItem = {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
    };
};

type CartState = {
    items: CartItem[];
};

const CartContext = createContext<{
    state: CartState;
    refreshCart: () => Promise<void>;
    clearCart: () => Promise<void>;
}>({
    state: { items: [] },
    refreshCart: async () => {},
    clearCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const [state, setState] = useState<CartState>({ items: [] });

    const refreshCart = async () => {
        const res = await fetch("/api/cart");
        const data = await res.json();
        if (data) setState({ items: data.items });
    };

    const clearCart = async () => {
        await fetch("/api/cart/clear", {
            method: "DELETE",
        });

        // Immediately clear client state
        setState({ items: [] });
        router.refresh();
    };

    // 🔄 Fetch cart on mount
    useEffect(() => {
        refreshCart();
    }, []);

    return (
        <CartContext.Provider value={{ state, refreshCart, clearCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
