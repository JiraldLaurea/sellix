"use client";

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
}>({
    state: { items: [] },
    refreshCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [state, setState] = useState<CartState>({ items: [] });

    const refreshCart = async () => {
        const res = await fetch("/api/cart");
        const data = await res.json();
        if (data) setState({ items: data.items });
    };

    // 🔄 Fetch cart on mount
    useEffect(() => {
        refreshCart();
    }, []);

    return (
        <CartContext.Provider value={{ state, refreshCart }}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);
