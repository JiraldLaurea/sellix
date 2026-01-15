"use client";

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
    return (
        <aside className="hidden w-60 shrink-0 md:block">
            <div className="space-y-6">
                {/* Categories */}
                <div>
                    <h3 className="mb-3 text-sm font-medium">Categories</h3>
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <label
                                key={cat.id}
                                className="flex cursor-pointer items-center gap-2 text-sm"
                            >
                                <input
                                    type="checkbox"
                                    checked={activeCategory === cat.id}
                                    onChange={() =>
                                        onParamChange(
                                            "category",
                                            activeCategory === cat.id
                                                ? undefined
                                                : cat.id
                                        )
                                    }
                                />
                                {cat.name}
                            </label>
                        ))}
                    </div>
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
