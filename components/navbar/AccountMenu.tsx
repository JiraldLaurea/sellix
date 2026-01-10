"use client";

import * as Popover from "@radix-ui/react-popover";
import { LucideReceiptText } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { MenuItem } from "../account/MenuItem";
import Avatar from "./Avatar";
import { FaRegHeart } from "react-icons/fa6";

export default function AccountMenu() {
    const { data: session } = useSession();

    return (
        <Popover.Root>
            <Popover.Trigger>
                <Avatar width={40} height={40} session={session} />
            </Popover.Trigger>

            <Popover.Content
                align="end"
                sideOffset={8}
                className="p-2 bg-white border rounded-lg shadow-md w-60"
            >
                <div className="flex flex-col items-center px-4 pt-2 space-y-2 text-center">
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

                <div className="px-2">
                    <hr className="mt-5 mb-3" />
                </div>

                <MenuItem
                    Icon={LucideReceiptText}
                    href="/orders/"
                    text="Orders"
                />
                <MenuItem
                    Icon={FaRegHeart}
                    href="/account/profile"
                    text="Favorites"
                />
                <MenuItem
                    Icon={FaRegUser}
                    href="/account/profile"
                    text="Profile"
                />

                <div className="px-2">
                    <hr className="my-3" />
                </div>

                <MenuItem
                    onClick={() =>
                        signOut({
                            callbackUrl: "/login",
                        })
                    }
                    Icon={MdOutlineLogout}
                    href=""
                    text="Sign Out"
                    extraClassName=""
                />
            </Popover.Content>
        </Popover.Root>
    );
}
