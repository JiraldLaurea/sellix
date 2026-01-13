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
            <Popover.Trigger className="focus:outline-none select-none">
                <Avatar width={40} height={40} session={session} />
            </Popover.Trigger>

            <Popover.Content
                align="end"
                sideOffset={0}
                className=" bg-white pb-3 border rounded-lg shadow-md w-60 focus:outline-none"
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

                <hr className="mt-5 mb-3" />

                <MenuItem
                    Icon={LucideReceiptText}
                    href="/orders/"
                    text="Orders"
                />
                <MenuItem Icon={FaRegHeart} href="/profile" text="Favorites" />
                <MenuItem Icon={FaRegUser} href="/profile" text="Profile" />

                <hr className="my-3" />

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
