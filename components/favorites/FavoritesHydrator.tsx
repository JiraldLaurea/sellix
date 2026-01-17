"use client";

import { useEffect, useRef } from "react";
import { useFavorites } from "@/lib/favorites-context";

export default function FavoritesHydrator({
    favoriteIds,
}: {
    favoriteIds: string[];
}) {
    const { hydrateFavorites } = useFavorites();
    const hydratedRef = useRef(false);

    useEffect(() => {
        if (hydratedRef.current) return;
        if (!favoriteIds.length) return;

        hydrateFavorites(favoriteIds);
        hydratedRef.current = true;
    }, [favoriteIds, hydrateFavorites]);

    return null;
}
