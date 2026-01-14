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
        <aside className="w-64 sticky top-24 shrink-0 rounded-lg border bg-white h-fit py-3 hidden lg:block">
            <h2 className="text-xs text-gray-500 px-5 my-3 font-medium">
                Dashboard
            </h2>

            <ul>
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

                <li>
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className="group w-full relative flex items-center gap-3 h-12 px-5 text-sm text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
                    >
                        <MdLogout className="h-5 w-5" />
                        <span>Sign Out</span>
                    </button>
                </li>

                {/* <li className="px-4">
                    <button
                        onClick={() => signOut({ callbackUrl: "/login" })}
                        className={`flex items-center space-x-1 w-full px-2 py-1.5 transition-colors hover:bg-gray-100 focus:outline-none 
              `}
                    >
                        <div className={`p-2`}>
                            <div className="relative w-5 h-5">
                                <MdLogout className="h-5 w-5" />
                            </div>
                        </div>
                        <p className="text-sm">Sign out</p>
                    </button>
                </li> */}
            </ul>
        </aside>
    );
}
