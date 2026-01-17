"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { delay } from "./delay";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Result = { success: true } | { success: false; reason?: "unauthorized" };

type FavoritesContextType = {
    favorites: string[];
    isFavorite: (productId: string) => boolean;
    toggleFavorite: (productId: string) => Promise<Result>;
    hydrateFavorites: (ids: string[]) => void;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
    const [favorites, setFavorites] = useState<string[]>([]);
    const { status } = useSession();
    const router = useRouter();

    function isFavorite(id: string) {
        return favorites.includes(id);
    }

    function hydrateFavorites(ids: string[]) {
        setFavorites(ids);
    }

    async function toggleFavorite(productId: string): Promise<Result> {
        const res = await fetch("/api/favorites/toggle", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId }),
        });

        // Force visible loading state
        await delay(350);

        if (!res.ok) {
            if (res.status === 401) {
                return { success: false, reason: "unauthorized" };
            }
            return { success: false };
        }

        setFavorites((prev) =>
            prev.includes(productId)
                ? prev.filter((id) => id !== productId)
                : [...prev, productId],
        );

        return { success: true };
    }

    return (
        <FavoritesContext.Provider
            value={{ favorites, isFavorite, toggleFavorite, hydrateFavorites }}
        >
            {children}
        </FavoritesContext.Provider>
    );
}

export function useFavorites() {
    const ctx = useContext(FavoritesContext);
    if (!ctx)
        throw new Error("useFavorites must be used within FavoritesProvider");
    return ctx;
}
