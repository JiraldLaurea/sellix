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
        <li className="space-y-10">
            <Link
                href={href}
                className={cn(
                    "group relative flex items-center gap-3 h-12 px-5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-black",
                    "",
                    isActive && "bg-gray-50 text-black"
                )}
            >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{label}</span>

                {count !== undefined && (
                    <span className="text-xs text-gray-500">{count}</span>
                )}
            </Link>
        </li>
    );
}
