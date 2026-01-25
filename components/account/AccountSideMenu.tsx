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
        <aside className="sticky hidden w-72 py-6 bg-white top-16 shrink-0 h-fit md:block">
            <ul className="space-y-4 pr-4 pl-8">
                <div className="space-y-1">
                    <h2 className="mb-2 text-xs font-medium">DASHBOARDS</h2>
                    {dashboardLinks.map((link) => (
                        <SideMenuItem key={link.href} {...link} />
                    ))}
                </div>

                <div className="space-y-1">
                    <h2 className="mb-2 text-xs font-medium">ACCOUNT</h2>
                    {accountLinks.map((link) => (
                        <SideMenuItem key={link.href} {...link} />
                    ))}
                    <li className="">
                        <button
                            onClick={() => signOut({ callbackUrl: "/login" })}
                            className="relative flex items-center w-full h-10 gap-3 px-4 text-sm text-gray-700 transition-colors rounded-lg group hover:bg-gray-100"
                        >
                            <MdLogout className="w-5 h-5" />
                            <span>Sign Out</span>
                        </button>
                    </li>
                </div>
            </ul>
        </aside>
    );
}
