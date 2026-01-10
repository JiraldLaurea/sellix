import { MenuItemProps } from "@/app/types";
import * as Popover from "@radix-ui/react-popover";
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
                className={`flex items-center space-x-3 w-full rounded-lg px-2 py-1.5 transition-colors hover:bg-gray-100 focus:outline-none 
                    ${extraClassName}`}
            >
                <div className={`p-2 border rounded-md bg-white`}>
                    <div className="relative w-4 h-4">
                        <Icon className="w-full h-full" />
                    </div>
                </div>
                <p className="text-sm">{text}</p>
            </Link>
        </Popover.Close>
    );
}
