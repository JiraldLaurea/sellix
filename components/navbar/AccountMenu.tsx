"use client";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function AccountMenu() {
    const { status } = useSession();

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
                {status === "authenticated" ? (
                    <>
                        <MenuItem href="/account/profile">Profile</MenuItem>
                        <MenuItem href="/account">My Account</MenuItem>
                        <MenuItem href="/account/orders">Orders</MenuItem>

                        <button
                            onClick={() =>
                                signOut({
                                    callbackUrl: "/",
                                })
                            }
                            className="w-full text-left rounded-md px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                        >
                            Sign out
                        </button>
                        {/* <Popover.Separator className="my-1 h-px bg-gray-200" /> */}
                    </>
                ) : (
                    <>
                        <MenuItem href="/login">Sign in</MenuItem>
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
