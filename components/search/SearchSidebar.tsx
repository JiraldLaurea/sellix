"use client";

import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import { useEffect, useState } from "react";
import { FaCaretDown } from "react-icons/fa6";
import Slider from "@mui/material/Slider";
import Button from "@mui/material/Button";

type Category = {
    id: string;
    name: string;
};

type SearchSidebarProps = {
    categories: Category[];
    activeCategory?: string | null;
    min: number;
    max: number;
    onParamChange: (key: string, value?: string) => void;
};

export default function SearchSidebar({
    categories,
    activeCategory,
    min,
    max,
    onParamChange,
}: SearchSidebarProps) {
    const [open, setOpen] = useState(false);
    const [priceRange, setPriceRange] = useState<[number, number]>([
        min,
        Number.isFinite(max) ? max : 300,
    ]);

    useEffect(() => {
        setPriceRange([0, 300]);
    }, [activeCategory]);

    return (
        <aside className="hidden w-64 h-[calc(100vh-64px)] shrink-0 md:block">
            <div className="space-y-8">
                {/* Categories */}
                <div>
                    <h2 className="mb-2 text-sm font-medium">Category</h2>

                    <Popover.Root open={open} onOpenChange={setOpen}>
                        <Popover.Trigger asChild>
                            <button className="w-full h-10 px-4 transition-colors rounded-lg text-sm bg-linear-to-t font-medium from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-500 text-white hover:bg-gray-50 flex items-center justify-between">
                                <span className="truncate">
                                    {activeCategory
                                        ? categories.find(
                                              (c) => c.id === activeCategory,
                                          )?.name
                                        : "All Categories"}
                                </span>

                                <FaCaretDown
                                    className={cn(
                                        "text-white transition-transform",
                                        open && "rotate-180",
                                    )}
                                />
                            </button>
                        </Popover.Trigger>

                        <Popover.Content
                            align="start"
                            sideOffset={1}
                            className="w-[var(--radix-popover-trigger-width)] z-50 rounded-xl max-h-70 overflow-y-auto border bg-white shadow-lg p-2 space-y-1"
                        >
                            {/* All Categories */}
                            <button
                                onClick={() => {
                                    onParamChange("category", undefined);

                                    setOpen(false);
                                }}
                                className={cn(
                                    "w-full flex items-center h-10 px-4 rounded-lg text-sm text-gray-700 hover:bg-gray-100",
                                    !activeCategory &&
                                        "bg-gray-100 font-medium",
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
                                            onParamChange("category", cat.id);
                                            onParamChange("min", undefined);
                                            onParamChange("max", undefined);
                                            setOpen(false);
                                        }}
                                        className={cn(
                                            "w-full flex items-center h-10 px-4 rounded-lg text-sm text-gray-700 hover:bg-gray-100",
                                            isActive &&
                                                "bg-gray-100 font-medium",
                                        )}
                                    >
                                        {cat.name}
                                    </button>
                                );
                            })}
                        </Popover.Content>
                    </Popover.Root>
                </div>

                {/* Price Range */}
                <div>
                    <h3 className="mb-3 text-sm font-medium">Price Range</h3>

                    {(() => {
                        return (
                            <>
                                {/* Slider */}
                                <Slider
                                    size="small"
                                    value={priceRange}
                                    min={0}
                                    max={300}
                                    onChange={(_, v) =>
                                        setPriceRange(v as [number, number])
                                    }
                                    valueLabelDisplay="auto"
                                    sx={{
                                        color: "black",
                                        mb: 3,
                                    }}
                                />

                                {/* Inputs */}
                                <div className="flex items-center gap-2 mb-3">
                                    <input
                                        type="number"
                                        value={priceRange[0]}
                                        onChange={(e) =>
                                            setPriceRange([
                                                +e.target.value,
                                                priceRange[1],
                                            ])
                                        }
                                        className="w-full rounded-lg border px-3 py-2 text-sm"
                                    />
                                    <span className="text-gray-400">–</span>
                                    <input
                                        type="number"
                                        value={priceRange[1]}
                                        onChange={(e) =>
                                            setPriceRange([
                                                priceRange[0],
                                                +e.target.value,
                                            ])
                                        }
                                        className="w-full rounded-lg border px-3 py-2 text-sm"
                                    />
                                </div>

                                {/* Apply Button */}
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{
                                        backgroundColor: "black",
                                        "&:hover": { backgroundColor: "#111" },
                                        textTransform: "none",
                                    }}
                                    onClick={() => {
                                        onParamChange(
                                            "min",
                                            priceRange[0].toString(),
                                        );
                                        onParamChange(
                                            "max",
                                            priceRange[1].toString(),
                                        );
                                    }}
                                >
                                    Apply
                                </Button>
                            </>
                        );
                    })()}
                </div>
            </div>
        </aside>
    );
}
