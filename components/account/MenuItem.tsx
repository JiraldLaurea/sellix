import { MenuItemProps } from "@/app/types";
import * as Popover from "@radix-ui/react-popover";
import { signOut } from "next-auth/react";
import Link from "next/link";

export function MenuItem({
    Icon,
    href,
    text,
    extraClassName,
    onClick,
}: MenuItemProps) {
    return (
        <Popover.Close asChild className="w-full">
            <Link
                onClick={onClick}
                href={href}
                className={`flex items-center space-x-2 w-full rounded-lg px-3 py-2 hover:bg-gray-100 focus:outline-none 
                    ${extraClassName}`}
            >
                <div
                    className={`p-1.5 text-white rounded-lg
                    ${extraClassName ? "bg-red-500" : "bg-accent"}`}
                >
                    <div className="relative w-3.5 h-3.5">
                        <Icon className="w-full h-full" />
                    </div>
                </div>
                <p className="text-sm">{text}</p>
            </Link>
        </Popover.Close>
    );
}
