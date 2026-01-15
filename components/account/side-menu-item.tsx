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
        <li className="space-y-10 px-4">
            <Link
                href={href}
                className={cn(
                    "group relative flex rounded-lg items-center gap-3 h-10 px-4 text-sm text-gray-500",
                    isActive
                        ? "bg-linear-to-t font-medium from-blue-600  to-blue-500 text-white"
                        : "hover:bg-gray-100 hover:text-black hover:transition-colors"
                )}
            >
                <Icon className="h-5 w-5 shrink-0" />
                <span className="flex-1">{label}</span>

                {count !== undefined && (
                    <span
                        className={cn(
                            "text-xs text-gray-500",
                            isActive && "transition-none text-white"
                        )}
                    >
                        {count}
                    </span>
                )}
            </Link>
        </li>
    );
}
