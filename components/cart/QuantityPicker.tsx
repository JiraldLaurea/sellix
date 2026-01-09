"use client";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { toast } from "sonner";

type Props = {
    quantity: number;
    max: number;
    onChange: (next: number) => void;
    onMaxReached?: () => void; // ✅ optional UX hook
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
        // Show toast when max quantity is reached
        else {
            toast.error("You've reached the maximum available stock");
        }
    };

    const isDisabled = max === 0;

    return (
        <div className="flex relative gap-1">
            <div className="flex w-fit items-center border rounded-md overflow-hidden">
                <button
                    onClick={decrement}
                    disabled={quantity <= 1 || isDisabled}
                    aria-label="Decrease quantity"
                    className="w-10 text-black h-10 disabled:text-gray-300 flex items-center justify-center transition-colors hover:bg-gray-100 disabled:hover:bg-inherit"
                >
                    <FaMinus size={12} />
                </button>

                <p className="w-10 text-sm select-none flex items-center justify-center h-10  border-x">
                    {isDisabled ? 0 : quantity}
                </p>
                <button
                    onClick={increment}
                    disabled={isDisabled}
                    aria-label="Increase quantity"
                    className="w-10 h-10 text-black text-sm disabled:text-gray-300 flex items-center justify-center transition-colors hover:bg-gray-100 disabled:hover:bg-inherit"
                >
                    <FaPlus size={12} />
                </button>
            </div>
            {/* Optional helper text */}
        </div>
    );
}
