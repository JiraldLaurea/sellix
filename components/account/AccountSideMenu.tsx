"use client";

import { SideMenuItem } from "@/components/account/side-menu-item";
import { useFavorites } from "@/lib/favorites-context";
import { signOut } from "next-auth/react";
import { LuPackage } from "react-icons/lu";
import { MdFavoriteBorder, MdLogout, MdPersonOutline } from "react-icons/md";

type Props = {
    orderCount?: number;
    favoritesCount?: number;
};

export default function AccountSideMenu({
    orderCount = 0,
    favoritesCount = 0,
}: Props) {
    const { favorites } = useFavorites();

    const dashboardLinks = [
        {
            label: "Orders",
            href: "/orders",
            count: orderCount,
            icon: LuPackage,
            activeIcon: LuPackage,
        },
        {
            label: "Favorites",
            href: "/favorites",
            count: favorites.length,
            icon: MdFavoriteBorder,
            activeIcon: MdFavoriteBorder,
        },
    ];

    const accountLinks = [
        {
            label: "Profile",
            href: "/profile",
            icon: MdPersonOutline,
            activeIcon: MdPersonOutline,
        },
    ];

    return (
        <aside className="sticky hidden w-64 py-3 bg-white border top-24 shrink-0 rounded-xl h-fit md:block">
            <h2 className="px-5 my-3 text-xs font-medium text-gray-500">
                Dashboards
            </h2>

            <ul className="space-y-2">
                {dashboardLinks.map((link) => (
                    <SideMenuItem key={link.href} {...link} />
                ))}

                <h2 className="px-5 my-3 text-xs font-medium text-gray-500">
                    Account
                </h2>

                {accountLinks.map((link) => (
                    <SideMenuItem key={link.href} {...link} />
                ))}

                <hr className="my-3" />

                <li className="px-4">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="relative flex items-center w-full h-10 gap-3 px-4 text-sm text-gray-700 transition-colors rounded-lg group hover:bg-gray-100"
                    >
                        <MdLogout className="w-5 h-5" />
                        <span>Sign Out</span>
                    </button>
                </li>
            </ul>
        </aside>
    );
}
