"use client";

import { Product } from "@/app/types/product";
import {
    createContext,
    useContext,
    useReducer,
    ReactNode,
    useEffect,
} from "react";

type CartItem = {
    product: Product;
    quantity: number;
};

type CartState = {
    items: CartItem[];
};

type CartAction =
    | { type: "ADD_ITEM"; product: Product; quantity: number }
    | { type: "REMOVE_ITEM"; productId: string }
    | { type: "INCREMENT"; productId: string }
    | { type: "DECREMENT"; productId: string }
    | { type: "SET_CART"; items: CartItem[] }
    | {
          type: "SET_QUANTITY";
          productId: string;
          quantity: number;
      }
    | { type: "CLEAR_CART" };

const CartContext = createContext<{
    state: CartState;
    dispatch: React.Dispatch<CartAction>;
} | null>(null);

function cartReducer(state: CartState, action: CartAction): CartState {
    switch (action.type) {
        case "ADD_ITEM": {
            const qty = Math.max(1, action.quantity ?? 1);

            const existing = state.items.find(
                (item) => item.product.id === action.product.id
            );

            if (existing) {
                return {
                    items: state.items.map((item) =>
                        item.product.id === action.product.id
                            ? {
                                  ...item,
                                  quantity: Math.min(
                                      item.quantity + qty,
                                      item.product.stock
                                  ),
                              }
                            : item
                    ),
                };
            }

            return {
                items: [
                    ...state.items,
                    {
                        product: action.product,
                        quantity: Math.min(qty, action.product.stock),
                    },
                ],
            };
        }

        case "REMOVE_ITEM":
            return {
                items: state.items.filter(
                    (item) => item.product.id !== action.productId
                ),
            };

        case "INCREMENT": {
            return {
                items: state.items.map((item) => {
                    if (item.product.id !== action.productId) return item;

                    // stop at stock limit
                    if (item.quantity >= item.product.stock) return item;

                    return { ...item, quantity: item.quantity + 1 };
                }),
            };
        }

        case "DECREMENT": {
            return {
                items: state.items
                    .map((item) =>
                        item.product.id === action.productId
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    )
                    .filter((item) => item.quantity > 0),
            };
        }

        case "SET_CART":
            return {
                items: action.items,
            };

        case "SET_QUANTITY": {
            return {
                items: state.items.map((item) =>
                    item.product.id === action.productId
                        ? {
                              ...item,
                              quantity: Math.max(
                                  1,
                                  Math.min(action.quantity, item.product.stock)
                              ),
                          }
                        : item
                ),
            };
        }

        case "CLEAR_CART":
            return { items: [] };

        default:
            return state;
    }
}

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] });

    // 🔁 Load cart from localStorage on first mount
    useEffect(() => {
        const stored = localStorage.getItem("cart");
        if (stored) {
            dispatch({ type: "SET_CART", items: JSON.parse(stored) });
        }
    }, []);

    // 💾 Save cart to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(state.items));
    }, [state.items]);

    return (
        <CartContext.Provider value={{ state, dispatch }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error("useCart must be used within CartProvider");
    }
    return context;
}
