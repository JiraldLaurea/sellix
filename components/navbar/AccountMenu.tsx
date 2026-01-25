"use client";

import * as Popover from "@radix-ui/react-popover";
import { signOut, useSession } from "next-auth/react";
import { LuPackage } from "react-icons/lu";
import { MdFavoriteBorder, MdLogout, MdPersonOutline } from "react-icons/md";
import { MenuItem } from "../account/MenuItem";
import Avatar from "./Avatar";

export default function AccountMenu() {
    const { data: session, status } = useSession();

    return (
        <Popover.Root>
            <Popover.Trigger className="select-none focus:outline-none">
                <Avatar width={40} height={40} session={session} />
            </Popover.Trigger>

            <Popover.Content
                align="end"
                sideOffset={0}
                className="w-64 pb-2 bg-white border shadow-lg rounded-xl focus:outline-none"
            >
                <div className="flex flex-col items-center px-4 pt-4 space-y-2 text-center">
                    <Avatar
                        width={50}
                        height={50}
                        session={session}
                        hasDefaultCursor
                    />
                    <div>
                        <p className="font-semibold">{session?.user?.name}</p>
                        <p className="text-xs text-gray-500">
                            {session?.user?.email}
                        </p>
                    </div>
                </div>

                <hr className="mt-5 mb-2" />
                <div className="space-y-2">
                    <MenuItem Icon={LuPackage} href="/orders/" text="Orders" />
                    <MenuItem
                        Icon={MdFavoriteBorder}
                        href="/favorites"
                        text="Favorites"
                    />
                    <MenuItem
                        Icon={MdPersonOutline}
                        href="/profile"
                        text="Profile"
                    />
                </div>

                <hr className="my-2" />

                <MenuItem
                    onClick={() =>
                        signOut({
                            callbackUrl: "/login",
                        })
                    }
                    Icon={MdLogout}
                    href=""
                    text="Sign Out"
                    extraClassName=""
                />
            </Popover.Content>
        </Popover.Root>
    );
}
