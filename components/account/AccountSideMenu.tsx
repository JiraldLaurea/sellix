"use client";

import { SideMenuItem } from "@/components/account/side-menu-item";
import { signOut } from "next-auth/react";
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
        <aside className="w-64 sticky top-24 shrink-0 rounded-lg border bg-white h-fit py-4 hidden lg:block">
            <h2 className="text-xs text-gray-500 px-5 pt-3 mb-2 font-medium">
                DASHBOARD
            </h2>

            <ul>
                {dashboardLinks.map((link) => (
                    <SideMenuItem key={link.href} {...link} />
                ))}

                <hr className="my-4" />

                <h2 className="text-xs text-gray-500 px-5 pt-3 mb-2 font-medium">
                    ACCOUNT
                </h2>

                {accountLinks.map((link) => (
                    <SideMenuItem key={link.href} {...link} />
                ))}

                <hr className="mt-4 mb-6" />

                <li className="px-4">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="flex border bg-accent text-white justify-center w-full items-center gap-2 rounded-lg px-3 h-12 text-sm hover:bg-neutral-700 transition-colors"
                    >
                        <MdLogout className="h-5 w-5" />
                        <span>Sign out</span>
                    </button>
                </li>
            </ul>
        </aside>
    );
}
