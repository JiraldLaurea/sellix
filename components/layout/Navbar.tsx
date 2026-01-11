"use client";

import { useCart } from "@/lib/cart-context";
import * as Popover from "@radix-ui/react-popover";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import AccountMenu from "../navbar/AccountMenu";

export default function Navbar() {
    const { state } = useCart();
    const { status } = useSession();

    // Hide navbar if not authenticated
    if (status !== "authenticated") {
        return null;
    }

    const itemCount = state.items.length;

    return (
        <header className="sticky top-0 z-50 block h-16 bg-white border-b">
            <div className="container flex items-center justify-between h-full max-w-6xl px-4 mx-auto">
                <div className="">
                    {/* Logo */}
                    <Link href="/">
                        <Image
                            src={"/img/brand_logo.png"}
                            alt={"Brand Logo"}
                            width={0}
                            height={0}
                            sizes="100px"
                            style={{ width: "100px", height: "auto" }}
                            className="object-contain"
                        />
                    </Link>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-4">
                    {/* Mobile menu */}

                    {/* Cart */}
                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <Link
                                href="/cart"
                                prefetch
                                className="relative flex items-center justify-center w-10 h-10 transition rounded-lg hover:bg-gray-100"
                            >
                                <HiOutlineShoppingBag size={30} />
                                {itemCount > 0 && (
                                    <span className="absolute select-none top-0 -right-1 bg-red-500 text-white text-[10px] leading-0 rounded-full h-4 w-4 flex items-center justify-center">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                        </Popover.Trigger>
                    </Popover.Root>
                    {/* Account menu */}
                    <AccountMenu />
                </div>
            </div>
        </header>
    );
}
