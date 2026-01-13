"use client";

import { useCart } from "@/lib/cart-context";
import * as Popover from "@radix-ui/react-popover";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { useEffect, useRef, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import AccountMenu from "../navbar/AccountMenu";

export default function Navbar() {
    const { state } = useCart();
    const { status } = useSession();
    const [searchInput, setSearchInput] = useState<string>("");
    const [isSearchOpened, setIsSearchOpened] = useState<boolean>(false);

    const router = useRouter();

    const handleSearch = () => {
        if (!searchInput.trim()) return;

        router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    };

    const itemCount = state.items.length;

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect((): any => {
        if (isSearchOpened) {
            searchInputRef.current?.focus();
        }
    }, [isSearchOpened]);

    if (status === "unauthenticated") return null;

    return (
        <header className="sticky top-0 z-50 block h-16 bg-white border-b">
            {/* Mobile Search Overlay */}
            {isSearchOpened && (
                <div className="absolute space-x-2 flex items-center px-4 inset-0 z-50 bg-white sm:hidden">
                    <div className="flex grow border rounded-full items-center h-13 px-4 gap-2">
                        <IoSearchOutline size={22} className="text-gray-500" />
                        <input
                            ref={searchInputRef}
                            type="search"
                            enterKeyHint="search"
                            placeholder="Search products"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                    setIsSearchOpened(false);
                                }
                            }}
                            className="flex-1 h-11 sm:text-sm focus:outline-none"
                        />
                        {searchInput && (
                            <div
                                onClick={() => {
                                    setSearchInput("");
                                    searchInputRef.current?.focus();
                                }}
                                className="bg-accent text-white rounded-full p-0.5 cursor-pointer"
                            >
                                <IoCloseOutline size={20} />
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            setSearchInput("");
                            setIsSearchOpened(false);
                        }}
                        className="w-11 h-11 border flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                    >
                        <IoCloseOutline size={30} />
                    </button>
                </div>
            )}

            <div className="container grid grid-cols-2 sm:grid-cols-[120px_1fr_120px] gap-4 items-center h-full max-w-6xl px-4 mx-auto">
                {/* Left controls */}
                <Link href="/" className="w-fit">
                    <Image
                        src={"/img/brand_logo_light.png"}
                        alt={"Brand Logo"}
                        width={0}
                        height={0}
                        preload
                        loading="eager"
                        sizes="120px"
                        style={{ width: "120px", height: "auto" }}
                        className="object-contain transition-none"
                    />
                </Link>

                {/* Middle controls */}
                <div className="flex-1 sm:flex justify-center hidden ">
                    <div
                        className={`w-full max-w-md flex items-center h-11 p-1 pl-4 border overflow-hidden rounded-full`}
                    >
                        {/* Search icon */}
                        <div className="pr-2 text-gray-500">
                            <IoSearchOutline size={22} />
                        </div>

                        {/* Input */}
                        <input
                            type="search"
                            enterKeyHint="search"
                            placeholder="Search products"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    handleSearch();
                                }
                            }}
                            className={`grow flex-1 h-full text-sm focus:outline-none placeholder:text-neutral-600"`}
                        />

                        {/* Clear input */}
                        <div
                            onClick={() => setSearchInput("")}
                            className={`${
                                searchInput.trim() ? "block" : "hidden"
                            } w-9 h-9 flex items-center justify-center  text-black hover:bg-gray-100 rounded-full cursor-pointer`}
                        >
                            <IoCloseOutline size={22} />
                        </div>
                    </div>
                </div>

                {/* Right controls */}
                <div className="flex items-center gap-3 justify-end">
                    <div
                        onClick={() => setIsSearchOpened(true)}
                        className="relative sm:hidden cursor-pointer flex items-center justify-center w-10 h-10 transition rounded-lg hover:bg-gray-100"
                    >
                        <IoSearchOutline size={30} />
                    </div>

                    {/* Cart */}
                    <Popover.Root>
                        <Popover.Trigger asChild>
                            <Link
                                href="/cart"
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
