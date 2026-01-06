"use client";

type Props = {
    quantity: number;
    max: number;
    onChange: (next: number) => void;
    onMaxReached?: () => void; // ✅ optional UX hook
};

export default function QuantityPicker({
    quantity,
    max,
    onChange,
    onMaxReached,
}: Props) {
    const decrement = () => {
        if (quantity > 1) {
            onChange(quantity - 1);
        }
    };

    const increment = () => {
        if (quantity < max) {
            onChange(quantity + 1);
        } else {
            onMaxReached?.(); // ✅ notify parent if provided
        }
    };

    const isDisabled = max === 0;

    return (
        <div className="flex flex-col gap-1">
            {/* Optional helper text */}
            {quantity >= max && max > 0 && (
                <span className="text-xs text-amber-500">
                    Max available stock reached
                </span>
            )}
            <div className="flex w-fit items-center border rounded-md overflow-hidden">
                <button
                    onClick={decrement}
                    disabled={quantity <= 1 || isDisabled}
                    aria-label="Decrease quantity"
                    className="px-3 py-1 text-sm disabled:opacity-40"
                >
                    -
                </button>

                <span className="px-3 text-sm select-none w-8 text-center">
                    {isDisabled ? 0 : quantity}
                </span>

                <button
                    onClick={increment}
                    disabled={quantity >= max || isDisabled}
                    aria-label="Increase quantity"
                    className="px-3 py-1 text-sm disabled:opacity-40"
                >
                    +
                </button>
            </div>
        </div>
    );
}
