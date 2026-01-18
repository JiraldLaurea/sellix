"use client";

import { useCartCount } from "@/lib/cart-context";
import * as Popover from "@radix-ui/react-popover";
import debounce from "lodash/debounce";
import { useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
import { useCallback, useEffect, useRef, useState } from "react";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { IoCloseOutline, IoSearchOutline } from "react-icons/io5";
import AccountMenu from "../navbar/AccountMenu";
import * as Dialog from "@radix-ui/react-dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

export default function Navbar() {
    const { status } = useSession({ required: false });
    const [searchInput, setSearchInput] = useState<string>("");
    const [isSearchOpened, setIsSearchOpened] = useState<boolean>(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const [suggestions, setSuggestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isDesktopSuggestionOpen, setIsDesktopSuggestionOpen] =
        useState(false);
    const [isMobileSuggestionOpen, setIsMobileSuggestionOpen] = useState(false);
    const [isSuggestionMenuOpen, setIsSuggestionMenuOpen] = useState(false);

    const isOpen = Boolean(searchInput.trim());

    const router = useRouter();

    const fetchSuggestions = async (value: string) => {
        if (!value.trim()) {
            setSuggestions([]);
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch(
                `/api/products?q=${encodeURIComponent(value)}&autocomplete=true`,
            );
            const data = await res.json();
            setSuggestions(data.items ?? []);
        } catch {
            setSuggestions([]);
        } finally {
            setIsLoading(false);
        }
    };

    const debouncedFetch = useCallback(debounce(fetchSuggestions, 500), []);

    const handleSearch = () => {
        if (!searchInput.trim()) return;

        setIsDesktopSuggestionOpen(false);

        router.push(`/search?q=${encodeURIComponent(searchInput.trim())}`);
    };

    const itemCount = useCartCount();

    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect((): any => {
        if (isSearchOpened) {
            searchInputRef.current?.focus();
        }
    }, [isSearchOpened]);

    if (status === "loading" && pathname !== "/login")
        return (
            <header className="sticky top-0 z-50 block h-16 bg-white border-b">
                <div className="containe animate-pulse grid grid-cols-2 sm:grid-cols-[120px_1fr_120px] gap-4 items-center h-full max-w-6xl px-4 mx-auto">
                    <div className="bg-gray-200 rounded-lg h-9 w-30" />
                    <div className="justify-center flex-1 hidden w-full h-11 sm:flex">
                        <div
                            className={`w-full max-w-md bg-gray-200 flex items-center h-11 p-1 pl-4 border overflow-hidden rounded-full`}
                        ></div>
                    </div>
                    {/* Right controls */}
                    <div className="flex items-center justify-end gap-3">
                        <div className="flex w-10 h-10 bg-gray-200 rounded-lg sm:hidden" />
                        <div className="w-10 h-10 transition bg-gray-200 rounded-lg " />
                        <div className="w-10 h-10 transition bg-gray-200 rounded-full " />
                    </div>
                </div>
            </header>
        );

    if (status !== "authenticated") return null;

    return (
        <header className="sticky top-0 z-50 block h-16 bg-white border-b">
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
                {/* <Button onClick={testDebounce}>TEST</Button> */}

                {/* Middle controls */}
                <Popover.Root
                    open={isDesktopSuggestionOpen}
                    onOpenChange={(open) => {
                        setIsDesktopSuggestionOpen(open);
                        if (!open) {
                            setSuggestions([]);
                            setIsLoading(false);
                        }
                    }}
                >
                    <div className="relative justify-center flex-1 hidden sm:flex">
                        {/* INPUT (ANCHOR) */}
                        <Popover.Anchor asChild>
                            <div
                                ref={searchContainerRef}
                                className="flex items-center w-full max-w-md p-1 pl-4 overflow-hidden border rounded-full h-11"
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
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSearchInput(value);

                                        if (!value.trim()) {
                                            debouncedFetch.cancel();
                                            setSuggestions([]);
                                            setIsLoading(false);
                                            setIsDesktopSuggestionOpen(false);
                                            return;
                                        }

                                        setIsLoading(true);
                                        setSuggestions([]);
                                        setIsDesktopSuggestionOpen(true);
                                        debouncedFetch(value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") handleSearch();
                                    }}
                                    className="flex-1 h-full text-sm grow focus:outline-none placeholder:text-neutral-600"
                                />

                                {/* Clear */}
                                {searchInput.trim() && (
                                    <div
                                        onClick={() => {
                                            setSearchInput("");
                                            setSuggestions([]);
                                        }}
                                        className="flex items-center justify-center text-black rounded-full cursor-pointer w-9 h-9 hover:bg-gray-100"
                                    >
                                        <IoCloseOutline size={22} />
                                    </div>
                                )}
                            </div>
                        </Popover.Anchor>

                        {/* MENU */}
                        <Popover.Content
                            side="bottom"
                            align="center"
                            sideOffset={0}
                            onOpenAutoFocus={(e) => e.preventDefault()}
                            onCloseAutoFocus={(e) => e.preventDefault()}
                            className="z-50 w-(--radix-popover-trigger-width) truncate text-ellipsis px-4 max-w-md py-4 bg-white border shadow-lg rounded-xl"
                        >
                            {/* Loading */}
                            {isLoading && (
                                <div className="w-full px-4 py-3 text-sm text-gray-500">
                                    Searching…
                                </div>
                            )}

                            {/* Results */}
                            {!isLoading &&
                                suggestions.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setSuggestions([]);
                                            setSearchInput("");
                                            setIsDesktopSuggestionOpen(false);
                                            router.push(`/product/${item.id}`);
                                        }}
                                        className="flex w-full px-4 py-3 space-x-2 text-sm text-left truncate rounded-lg hover:bg-gray-100"
                                    >
                                        <IoSearchOutline size={22} />
                                        <p className="truncate">{item.name}</p>
                                    </button>
                                ))}

                            {/* Empty */}
                            {!isLoading && suggestions.length === 0 && (
                                <div className="w-full px-4 py-3 text-sm text-left text-gray-500">
                                    No search results found
                                </div>
                            )}
                        </Popover.Content>
                    </div>
                </Popover.Root>

                {/* Right controls */}
                <div className="flex items-center justify-end gap-3">
                    <div
                        onClick={() => {
                            setIsSearchOpened(true);
                        }}
                        className="relative flex items-center justify-center w-10 h-10 transition rounded-lg cursor-pointer sm:hidden hover:bg-gray-100"
                    >
                        <IoSearchOutline size={30} />
                    </div>

                    {/* Cart */}
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

                    {/* Account menu */}
                    <AccountMenu />
                </div>
            </div>
            {/* Mobile Search Overlay */}
            <Dialog.Root open={isSearchOpened} onOpenChange={setIsSearchOpened}>
                <Dialog.Portal>
                    {/* Overlay */}
                    <Dialog.Overlay className="fixed inset-0 z-50 bg-white sm:hidden" />

                    {/* Content */}
                    <Dialog.Content
                        className="fixed inset-0 z-50 flex flex-col bg-white sm:hidden"
                        onOpenAutoFocus={(e) => e.preventDefault()}
                    >
                        {/* REQUIRED TITLE */}
                        <Dialog.Title className="sr-only">
                            Search products
                        </Dialog.Title>

                        {/* TOP BAR */}
                        <div className="flex items-center gap-3 px-4 py-3 border-b">
                            <div className="flex items-center w-full h-12 gap-2 px-3 border rounded-full grow">
                                <IoSearchOutline
                                    size={22}
                                    className="text-gray-500"
                                />

                                <input
                                    ref={searchInputRef}
                                    autoFocus
                                    type="search"
                                    placeholder="Search products"
                                    value={searchInput}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        setSearchInput(value);

                                        if (!value.trim()) {
                                            debouncedFetch.cancel();
                                            setSuggestions([]);
                                            setIsLoading(false);
                                            return;
                                        }

                                        setIsLoading(true);
                                        setSuggestions([]);
                                        debouncedFetch(value);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            setSearchInput("");
                                            handleSearch();
                                            setIsSearchOpened(false);
                                        }
                                    }}
                                    className="flex-1 h-10 focus:outline-none"
                                />
                                {searchInput.trim() && (
                                    <div
                                        onClick={() => {
                                            setSearchInput("");
                                            setSuggestions([]);
                                            // setIsSuggestionMenuOpen(false);
                                            // searchInputRef.current?.focus();
                                        }}
                                        className="bg-accent  text-white rounded-full p-0.5 cursor-pointer"
                                    >
                                        <IoCloseOutline size={18} />
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setIsSearchOpened(false);
                                }}
                                className="flex items-center justify-center flex-none transition-colors border rounded-full w-11 h-11 hover:bg-gray-100"
                            >
                                <IoCloseOutline size={30} />
                            </button>
                        </div>

                        {/* RESULTS */}
                        <div className="flex-1 overflow-y-auto">
                            {isLoading && (
                                <div className="py-6 text-sm text-center text-gray-500">
                                    Searching…
                                </div>
                            )}

                            {!isLoading &&
                                suggestions.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setIsSearchOpened(false);
                                            router.push(`/product/${item.id}`);
                                        }}
                                        className="flex w-full gap-2 py-5 text-left px-[29px] hover:bg-gray-100"
                                    >
                                        <IoSearchOutline size={22} />
                                        <span>{item.name}</span>
                                    </button>
                                ))}

                            {!isLoading &&
                                suggestions.length === 0 &&
                                searchInput && (
                                    <div className="py-6 text-sm text-center text-gray-500">
                                        No results found
                                    </div>
                                )}
                        </div>
                    </Dialog.Content>
                </Dialog.Portal>
            </Dialog.Root>
        </header>
    );
}
