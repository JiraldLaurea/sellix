"use client";

import { useFilters } from "@/lib/filter-context";
import { showSuccessToast } from "@/lib/toast/showSuccessToast";
import { cn } from "@/lib/utils";
import Slider from "@mui/material/Slider";
import * as Popover from "@radix-ui/react-popover";
import debounce from "lodash/debounce";
import { useEffect, useMemo, useState } from "react";
import { FaCaretDown } from "react-icons/fa6";
import { Button } from "../ui/Button";

type Category = {
    id: string;
    name: string;
};

type SearchSidebarProps = {
    categories: Category[];
    activeCategory?: string | null;

    updateParam: (params: Record<string, string | undefined>) => void;
};

export default function SearchSidebar({
    categories,
    activeCategory,
    updateParam,
}: SearchSidebarProps) {
    const [open, setOpen] = useState(false);
    // const [priceRange, setPriceRange] = useState<[number, number]>([min, max]);

    const { filters, setPriceRange, resetPriceRange } = useFilters();

    const [localRange, setLocalRange] = useState<[number, number]>(
        filters.priceRange,
    );

    const [min, max] = filters.priceRange;

    const debouncedSetPriceRange = useMemo(
        () =>
            debounce((range: [number, number]) => {
                setPriceRange(range);
            }, 200),
        [setPriceRange],
    );

    useEffect(() => {
        return () => {
            debouncedSetPriceRange.cancel();
        };
    }, [debouncedSetPriceRange]);

    useEffect(() => {
        setLocalRange(filters.priceRange);
    }, [filters.priceRange]);

    return (
        <aside className="hidden w-72 h-[calc(100vh-64px)] shrink-0 md:block">
            <div className="space-y-0 pl-8 pt-6">
                {/* Categories */}
                <div>
                    <h2 className="mb-2 text-xs font-medium">CATEGORY</h2>

                    <Popover.Root open={open} onOpenChange={setOpen}>
                        <Popover.Trigger asChild>
                            <button className="w-full h-10 px-4 transition-colors rounded-lg text-sm border hover:bg-gray-100 flex items-center justify-between">
                                <span className="truncate">
                                    {activeCategory
                                        ? categories.find(
                                              (c) => c.id === activeCategory,
                                          )?.name
                                        : "All Categories"}
                                </span>

                                <FaCaretDown
                                    className={cn(
                                        " transition-transform",
                                        open && "rotate-180",
                                    )}
                                />
                            </button>
                        </Popover.Trigger>

                        <Popover.Content
                            align="start"
                            sideOffset={1}
                            className="w-(--radix-popover-trigger-width) z-50 rounded-lg border bg-white shadow-lg pr-1 py-2 pl-2 overflow-hidden"
                        >
                            <div className="max-h-70 overflow-y-auto space-y-1 pr-2">
                                {/* All Categories */}
                                <button
                                    onClick={() => {
                                        updateParam({
                                            category: undefined,
                                            sort: "name_asc",
                                        });
                                        resetPriceRange();
                                        setOpen(false);
                                    }}
                                    className={cn(
                                        "w-full flex items-center h-10 px-4 text-sm rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                                        !activeCategory && "bg-gray-100",
                                    )}
                                >
                                    All Categories
                                </button>

                                {categories.map((cat) => {
                                    const isActive = activeCategory === cat.id;

                                    return (
                                        <button
                                            key={cat.id}
                                            onClick={() => {
                                                updateParam({
                                                    category: cat.id,
                                                    sort: "name_asc",
                                                });
                                                resetPriceRange();
                                                setOpen(false);
                                            }}
                                            className={cn(
                                                "w-full flex items-center h-10 px-4 text-sm rounded-lg text-gray-700 hover:bg-gray-100 transition-colors",
                                                isActive && "bg-gray-100",
                                            )}
                                        >
                                            {cat.name}
                                        </button>
                                    );
                                })}
                            </div>
                        </Popover.Content>
                    </Popover.Root>
                </div>

                <hr className="my-6" />

                {/* Price Range */}
                <div>
                    <h2 className="mb-2 text-xs font-medium">PRICE RANGE</h2>
                    {/* <h3 className="mb-3 text-sm font-medium">Price Range</h3> */}

                    {/* Slider */}
                    <Slider
                        size="small"
                        value={localRange}
                        min={0}
                        max={500}
                        onChange={(_, newValue) => {
                            setLocalRange(newValue as [number, number]); // instant
                            debouncedSetPriceRange(
                                newValue as [number, number],
                            ); // debounced
                        }}
                        valueLabelDisplay="auto"
                        sx={{
                            color: "#2b7fff",
                        }}
                    />

                    {/* Inputs */}
                    <div className="flex items-center gap-2 mb-3">
                        <input
                            type="number"
                            value={localRange[0]}
                            onChange={(e) =>
                                setLocalRange([+e.target.value, localRange[1]])
                            }
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                        <span className="text-gray-500">-</span>
                        <input
                            max={500}
                            type="number"
                            value={localRange[1]}
                            onChange={(e) =>
                                setLocalRange([localRange[0], +e.target.value])
                            }
                            className="w-full rounded-lg border px-3 py-2 text-sm"
                        />
                    </div>
                </div>

                <hr className="my-6" />

                {/* APPLY AND CLEAR FILTER BUTTONS */}
                <div>
                    <Button
                        onClick={() => {
                            updateParam({
                                min: min !== 0 ? min.toString() : undefined,
                                max: max.toString(),
                            });

                            showSuccessToast(
                                "Filter Applied",
                                min + " - " + max,
                            );
                        }}
                    >
                        Apply Filter
                    </Button>

                    <Button
                        variant="secondary"
                        className="mt-2"
                        onClick={() => {
                            resetPriceRange();
                            updateParam({
                                min: undefined,
                                max: undefined,
                            });
                            showSuccessToast("Filter Cleared");
                        }}
                    >
                        Clear Filter
                    </Button>
                </div>
            </div>
        </aside>
    );
}
