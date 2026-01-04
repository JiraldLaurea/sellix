"use client";

import * as Popover from "@radix-ui/react-popover";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import Avatar from "./Avatar";

export default function AccountMenu() {
    const { data: session, status } = useSession();

    return (
        <Popover.Root>
            <Popover.Trigger>
                <Avatar session={session} />
            </Popover.Trigger>

            <Popover.Content
                align="end"
                sideOffset={8}
                className="w-48 rounded-md border bg-white p-2 shadow-md"
            >
                {status === "authenticated" ? (
                    <>
                        <div className="flex flex-col items-center space-y-2 mb-4 p-2">
                            <Avatar session={session} hasDefaultCursor />
                            <p className="text-xs">{session?.user?.email}</p>
                        </div>

                        <MenuItem href="/account/profile">Profile</MenuItem>
                        {/* <MenuItem href="/account">My Account</MenuItem> */}
                        <MenuItem href="/account/orders">Orders</MenuItem>

                        <button
                            onClick={() =>
                                signOut({
                                    callbackUrl: "/login",
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
        <Popover.Close asChild>
            <Link
                href={href}
                className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none"
            >
                {children}
            </Link>
        </Popover.Close>
    );
}
