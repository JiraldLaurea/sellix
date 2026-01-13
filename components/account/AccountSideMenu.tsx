"use client";

import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    MdFavorite,
    MdFavoriteBorder,
    MdLogout,
    MdOutlineShoppingBag,
    MdPerson,
    MdPersonOutline,
    MdShoppingBag,
} from "react-icons/md";

type Props = {
    orderCount?: number;
    favoritesCount?: number;
};

export default function AccountSideMenu({
    orderCount = 0,
    favoritesCount = 0,
}: Props) {
    const pathname = usePathname();

    const dashboardLinks = [
        {
            label: "Orders",
            href: "/orders",
            count: orderCount,
            icon: MdOutlineShoppingBag,
            activeIcon: MdShoppingBag,
        },
        {
            label: "Favorites",
            href: "/favorites",
            count: favoritesCount,
            icon: MdFavoriteBorder,
            activeIcon: MdFavorite,
        },
    ];

    const accountLinks = [
        {
            label: "Profile",
            href: "/profile",
            icon: MdPersonOutline,
            activeIcon: MdPerson,
        },
    ];

    return (
        <aside className="w-64 sticky top-24 shrink-0 rounded-lg border bg-white h-fit p-4 hidden lg:block">
            <h2 className="text-xs text-gray-500 px-3 pt-3 mb-2 font-medium">
                DASHBOARD
            </h2>

            <ul className="space-y-1">
                {dashboardLinks.map((link) => {
                    const isActive =
                        pathname === link.href ||
                        pathname.startsWith(`${link.href}/`);

                    const Icon = isActive ? link.activeIcon : link.icon;

                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg text-gray-500 hover:text-black px-3 py-2 text-sm hover:transition-colors hover:bg-gray-100",
                                    isActive &&
                                        "bg-gray-100 text-black hover:transition-none"
                                )}
                            >
                                <Icon
                                    className={cn("h-5 w-5", isActive && "")}
                                />
                                <span className="flex-1">{link.label}</span>

                                {link.count !== undefined && (
                                    <span
                                        className={cn(
                                            "text-xs text-gray-500",
                                            isActive && ""
                                        )}
                                    >
                                        {link.count}
                                    </span>
                                )}
                            </Link>
                        </li>
                    );
                })}

                <hr className="my-3" />

                <h2 className="text-xs text-gray-500 px-3 pt-3 mb-2 font-medium">
                    ACCOUNT
                </h2>

                {accountLinks.map((link) => {
                    const isActive =
                        pathname === link.href ||
                        pathname.startsWith(`${link.href}/`);

                    const Icon = isActive ? link.activeIcon : link.icon;

                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg text-gray-500 hover:text-black px-3 py-2 text-sm hover:transition-colors hover:bg-gray-100",
                                    isActive &&
                                        "bg-gray-100 text-black hover:transition-none"
                                )}
                            >
                                <Icon
                                    className={cn("h-5 w-5", isActive && "")}
                                />
                                <span className="flex-1">{link.label}</span>
                            </Link>
                        </li>
                    );
                })}

                <hr className="my-3" />

                <li>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex w-full items-center gap-3 rounded-lg text-gray-500 px-3 py-2 text-sm transition hover:bg-gray-100"
                    >
                        <MdLogout className="h-5 w-5 " />
                        <span>Sign out</span>
                    </button>
                </li>
            </ul>
        </aside>
    );
}
