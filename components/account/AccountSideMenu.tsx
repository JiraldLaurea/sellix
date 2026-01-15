"use client";

import { SideMenuItem } from "@/components/account/side-menu-item";
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
            count: favoritesCount,
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
        <aside className="w-64 sticky top-24 shrink-0 rounded-xl border bg-white h-fit py-3 hidden lg:block">
            <h2 className="text-xs text-gray-500 px-5 my-3 font-medium">
                Dashboards
            </h2>

            <ul className="space-y-2">
                {dashboardLinks.map((link) => (
                    <SideMenuItem key={link.href} {...link} />
                ))}

                <h2 className="text-xs text-gray-500 px-5 my-3 font-medium">
                    Account
                </h2>

                {accountLinks.map((link) => (
                    <SideMenuItem key={link.href} {...link} />
                ))}

                <hr className="my-3" />

                <li className="px-4">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="group w-full relative flex items-center gap-3 h-10 rounded-lg px-4 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
                    >
                        <MdLogout className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                </li>
            </ul>
        </aside>
    );
}
