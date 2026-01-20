"use client";

import { cn } from "@/lib/utils";
import * as Popover from "@radix-ui/react-popover";
import { useState } from "react";
import { FaCaretDown } from "react-icons/fa6";

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

    return (
        <aside className="hidden w-72 sticky top-16 h-[calc(100vh-64px)] overflow-y-auto py-6 pl-8 shrink-0 md:block">
            <div className="space-y-8">
                {/* Categories */}
                <div>
                    <h2 className="mb-3 text-xs font-medium text-gray-500">
                        Categories
                    </h2>

                    <Popover.Root open={open} onOpenChange={setOpen}>
                        <Popover.Trigger asChild>
                            <button className="w-full h-11 px-4 rounded-lg border text-sm hover:bg-gray-50 flex items-center justify-between">
                                <span className="truncate">
                                    {activeCategory
                                        ? categories.find(
                                              (c) => c.id === activeCategory,
                                          )?.name
                                        : "All Categories"}
                                </span>

                                <FaCaretDown
                                    className={cn(
                                        "text-gray-500 transition-transform",
                                        open && "rotate-180",
                                    )}
                                />
                            </button>
                        </Popover.Trigger>

                        <Popover.Content
                            align="start"
                            sideOffset={6}
                            className="w-(--radix-popover-trigger-width) max-h-60 overflow-y-auto border bg-white shadow-lg p-1 space-y-1 py-4"
                        >
                            {categories.map((cat) => {
                                const isActive = activeCategory === cat.id;

                                return (
                                    <button
                                        key={cat.id}
                                        onClick={() => {
                                            onParamChange(
                                                "category",
                                                isActive ? undefined : cat.id,
                                            );
                                            setOpen(false); // ✅ close on select
                                        }}
                                        className={cn(
                                            "w-full flex items-center h-10 px-4 rounded-lg text-sm text-gray-700 hover:bg-gray-100",
                                            isActive && "bg-gray-100",
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
                    <div className="flex gap-2">
                        <input
                            type="number"
                            placeholder="Min"
                            defaultValue={min || ""}
                            className="w-full rounded border px-2 py-1 text-sm"
                            onBlur={(e) => onParamChange("min", e.target.value)}
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            defaultValue={max !== Infinity ? max : ""}
                            className="w-full rounded border px-2 py-1 text-sm"
                            onBlur={(e) => onParamChange("max", e.target.value)}
                        />
                    </div>
                </div>
            </div>
        </aside>
    );
}
