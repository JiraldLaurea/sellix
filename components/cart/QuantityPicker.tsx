"use client";
import { showWarningToast } from "@/lib/toast/showWarningToast";
import { FaMinus, FaPlus } from "react-icons/fa6";

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
            showWarningToast(
                "You have reached the maximum quantity available for this item"
            );
        }
    };

    const isDisabled = max === 0;

    return (
        <div className="relative flex gap-1">
            <div className="flex px-1 h-11 items-center overflow-hidden border rounded-full w-fit">
                <button
                    onClick={decrement}
                    disabled={quantity <= 1 || isDisabled}
                    aria-label="Decrease quantity"
                    className="flex items-center justify-center w-9 h-9 text-black transition-colors rounded-full disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-inherit"
                >
                    <FaMinus size={12} />
                </button>

                <p className="flex items-center justify-center h-9 select-none w-7">
                    {isDisabled ? 0 : quantity}
                </p>
                <button
                    onClick={increment}
                    disabled={isDisabled}
                    aria-label="Increase quantity"
                    className="flex items-center justify-center w-9 h-9 text-sm text-black transition-colors rounded-full disabled:text-gray-300 hover:bg-gray-100 disabled:hover:bg-inherit"
                >
                    <FaPlus size={12} />
                </button>
            </div>
        </div>
    );
}
