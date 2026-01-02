"use client";

type Props = {
    quantity: number;
    max: number;
    onChange: (next: number) => void;
};

export default function QuantityPicker({ quantity, max, onChange }: Props) {
    const decrement = () => {
        if (quantity > 1) {
            onChange(quantity - 1);
        }
    };

    const increment = () => {
        if (quantity < max) {
            onChange(quantity + 1);
        }
    };

    return (
        <div className="flex items-center border rounded-md overflow-hidden">
            <button
                onClick={decrement}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
                className="px-3 py-1 text-sm disabled:opacity-40"
            >
                -
            </button>

            <span className="px-3 text-sm select-none w-8 text-center">
                {quantity}
            </span>

            <button
                onClick={increment}
                disabled={quantity >= max}
                aria-label="Increase quantity"
                className="px-3 py-1 text-sm disabled:opacity-40"
            >
                +
            </button>
        </div>
    );
}
