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
        <div className="px-2">
            <Popover.Close asChild className="w-full rounded-lg px-4">
                <Link
                    onClick={onClick}
                    href={href}
                    className={`flex items-center space-x-3 w-full px-0 h-10 transition-colors hover:bg-gray-100 focus:outline-none 
                    ${extraClassName}`}
                >
                    <div className="relative w-5 h-5">
                        <Icon className="w-full h-full" />
                    </div>

                    <p className="text-sm">{text}</p>
                </Link>
            </Popover.Close>
        </div>
    );
}
