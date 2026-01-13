"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { IconType } from "react-icons";

type SideMenuItemProps = {
    label: string;
    href: string;
    icon: IconType;
    activeIcon: IconType;
    count?: number;
};

export function SideMenuItem({
    label,
    href,
    icon,
    activeIcon,
    count,
}: SideMenuItemProps) {
    const pathname = usePathname();

    const isActive = pathname === href || pathname.startsWith(`${href}/`);

    const Icon = isActive ? activeIcon : icon;

    return (
        <li>
            <Link
                href={href}
                className={cn(
                    "group relative flex items-center gap-3 py-2 px-5 text-sm rounded-lg text-gray-500 hover:text-black",
                    "",
                    isActive && "text-black"
                )}
            >
                {/* Vertical indicator */}
                <span
                    className={cn(
                        "absolute left-0 top-1/2 h-0 w-0.5 -translate-y-1/2 bg-black transition-all",
                        "group-hover:h-full",
                        isActive && "h-full"
                    )}
                />

                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{label}</span>

                {count !== undefined && (
                    <span className="text-xs text-gray-500">{count}</span>
                )}
            </Link>
        </li>
    );
}
