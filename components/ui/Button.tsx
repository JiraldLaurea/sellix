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
            className={`w-full rounded-lg text-sm px-6 h-11  transition-colors flex items-center justify-center gap-2
                ${
                    variant === "primary"
                        ? "bg-accent disabled:opacity-15 text-white hover:bg-gray-700 disabled:hover:bg-accent"
                        : "border hover:bg-gray-100 disabled:hover:bg-inherit disabled:opacity-50"
                }
                ${className}`}
        >
            {children}
        </button>
    );
}
