"use client";

import { useSearchParams } from "next/navigation";
import { createContext, useContext, useState } from "react";

export type FiltersState = {
    priceRange: [number, number];
    // future filters
    // rating?: number;
    // inStock?: boolean;
    // sort?: "asc" | "desc";
};

type FilterContextType = {
    filters: FiltersState;
    setPriceRange: (range: [number, number]) => void;
    resetPriceRange: () => void;
    resetAllFilters: () => void;
};

const FilterContext = createContext<FilterContextType | null>(null);

export function FilterProvider({ children }: { children: React.ReactNode }) {
    const searchParams = useSearchParams();

    const minParam = searchParams.get("min");
    const maxParam = searchParams.get("max");

    const min = minParam ? Number(minParam) : 0;
    const max = maxParam ? Number(maxParam) : 500;

    const DEFAULT_PRICE = [min, max] as [number, number];

    const [filters, setFilters] = useState<FiltersState>({
        priceRange: DEFAULT_PRICE,
    });

    const setPriceRange = (range: [number, number]) => {
        setFilters((prev) => ({
            ...prev,
            priceRange: range,
        }));
    };

    const resetPriceRange = () => {
        setFilters((prev) => ({
            ...prev,
            priceRange: [0, 500] as [number, number],
        }));
    };

    const resetAllFilters = () => {
        setFilters({
            priceRange: DEFAULT_PRICE,
        });
    };

    return (
        <FilterContext.Provider
            value={{
                filters,
                setPriceRange,
                resetPriceRange,
                resetAllFilters,
            }}
        >
            {children}
        </FilterContext.Provider>
    );
}

export const useFilters = () => {
    const ctx = useContext(FilterContext);
    if (!ctx) {
        throw new Error("useFilters must be used within FilterProvider");
    }
    return ctx;
};
