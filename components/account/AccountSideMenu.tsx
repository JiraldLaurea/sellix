"use client";

import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    MdFavoriteBorder,
    MdOutlineLogout,
    MdOutlineShoppingBag,
    MdPersonOutline,
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

    const links = [
        {
            label: "Orders",
            href: "/orders",
            count: orderCount,
            icon: MdOutlineShoppingBag,
        },
        {
            label: "Favorites",
            href: "/favorites",
            count: favoritesCount,
            icon: MdFavoriteBorder,
        },
        {
            label: "Profile",
            href: "/profile",
            icon: MdPersonOutline,
        },
    ];

    return (
        <aside className="w-64 shrink-0 rounded-lg border bg-white h-fit p-4 hidden lg:block">
            <h2 className="text-xs text-gray-500 px-4 py-3">DASHBOARD</h2>

            <ul className="space-y-2">
                {links.map((link) => {
                    const Icon = link.icon;
                    const isActive =
                        pathname === link.href ||
                        pathname.startsWith(`${link.href}/`);

                    return (
                        <li key={link.href}>
                            <Link
                                href={link.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition hover:bg-gray-100",
                                    isActive && "bg-gray-100"
                                )}
                            >
                                <Icon className="h-5 w-5 text-gray-600" />
                                <span className="flex-1">{link.label}</span>

                                {link.count !== undefined && (
                                    <span className="text-xs text-gray-500">
                                        {link.count}
                                    </span>
                                )}
                            </Link>
                        </li>
                    );
                })}

                <hr className="my-3" />

                <li>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm transition hover:bg-gray-100"
                    >
                        <MdOutlineLogout className="h-5 w-5 text-gray-600" />
                        <span>Sign out</span>
                    </button>
                </li>
            </ul>
        </aside>
    );
}
