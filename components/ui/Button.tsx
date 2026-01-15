import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

type Variant = "primary" | "secondary";

type ButtonType = "submit" | "reset" | "button" | undefined;

type ButtonProps = {
    disabled?: boolean;
    children: ReactNode;
    onClick?: () => void;
    variant?: Variant;
    className?: string;
    buttonType?: ButtonType;
};

export function Button({
    disabled,
    onClick,
    children,
    variant = "primary",
    className,
    buttonType,
}: ButtonProps) {
    return (
        <button
            type={buttonType}
            onClick={onClick}
            disabled={disabled}
            className={cn(
                "w-full rounded-lg text-sm px-6 h-10 transition-colors flex items-center justify-center gap-2",
                variant === "primary"
                    ? "bg-linear-to-t font-medium from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-500 disabled:opacity-15 text-white  disabled:hover:bg-accent"
                    : "border hover:bg-gray-100 disabled:hover:bg-inherit disabled:opacity-50",
                className
            )}
        >
            {children}
        </button>
    );
}
