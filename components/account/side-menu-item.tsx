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
        <li className="">
            <Link
                href={href}
                className={cn(
                    "group relative flex rounded-lg items-center gap-3 h-10 px-4 text-sm text-gray-700",
                    isActive
                        ? "bg-gray-100"
                        : "hover:bg-gray-100 hover:transition-colors",
                )}
            >
                <Icon className="w-5 h-5 shrink-0" />
                <span className="flex-1">{label}</span>

                {count !== undefined && (
                    <span
                        className={cn(
                            "text-xs text-gray-700",
                            isActive && "transition-none",
                        )}
                    >
                        {count}
                    </span>
                )}
            </Link>
        </li>
    );
}
