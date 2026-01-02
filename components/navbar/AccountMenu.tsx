"use client";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";

type Props = {
    isAuthenticated?: boolean;
};

export default function AccountMenu({ isAuthenticated = false }: Props) {
    return (
        <Popover.Root>
            <Popover.Trigger asChild>
                <button
                    aria-label="Account menu"
                    className="rounded-full select-none border h-9 w-9 flex items-center justify-center text-sm hover:bg-gray-100"
                >
                    👤
                </button>
            </Popover.Trigger>

            <Popover.Content
                align="end"
                sideOffset={8}
                className="w-44 rounded-md border bg-white p-2 shadow-md"
            >
                {isAuthenticated ? (
                    <>
                        <MenuItem href="/account">My Account</MenuItem>
                        <MenuItem href="/account/orders">Orders</MenuItem>

                        {/* <Popover.Separator className="my-1 h-px bg-gray-200" />

                        <Popover.Item
                            className="cursor-pointer rounded-md px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                            onClick={() => {
                                // later: logout()
                                console.log("logout");
                            }}
                        >
                            Sign out
                        </Popover.Item> */}
                    </>
                ) : (
                    <>
                        <MenuItem href="/login">Sign in</MenuItem>
                        <MenuItem href="/register">Create account</MenuItem>
                    </>
                )}
            </Popover.Content>
        </Popover.Root>
    );
}

function MenuItem({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <Link
            href={href}
            className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none"
        >
            {children}
        </Link>
    );
}
