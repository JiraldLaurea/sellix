import React, { ReactNode } from "react";

type ContainerProps = {
    children: ReactNode;
    className?: string;
};

export function Container({ children, className }: ContainerProps) {
    return (
        <div
            className={`w-full text-sm bg-white rounded-lg
                ${
                    className
                        ? `${className}`
                        : "max-w-xl px-4 sm:p-8 my-8 sm:border"
                }`}
        >
            {children}
        </div>
    );
}
