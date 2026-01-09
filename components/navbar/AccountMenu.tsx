"use client";

import * as Popover from "@radix-ui/react-popover";
import { LucideReceiptText } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineLogout } from "react-icons/md";
import { MenuItem } from "../account/MenuItem";
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
                className="w-64 rounded-lg border bg-white p-2 shadow-md"
            >
                <div className="flex flex-col pt-2 px-4">
                    {/* <Avatar session={session} hasDefaultCursor /> */}
                    <p className="font-semibold">{session?.user?.name}</p>
                    <p className="text-xs text-gray-500">
                        {session?.user?.email}
                    </p>
                </div>

                <hr className="mb-2 mt-4" />

                <MenuItem
                    Icon={FaRegUser}
                    href="/account/profile"
                    text="Profile"
                />
                <MenuItem
                    Icon={LucideReceiptText}
                    href="/orders/"
                    text="Orders"
                />

                <hr className="my-2" />

                <MenuItem
                    onClick={() =>
                        signOut({
                            callbackUrl: "/login",
                        })
                    }
                    Icon={MdOutlineLogout}
                    href=""
                    text="Sign Out"
                    extraClassName="text-red-600"
                />
            </Popover.Content>
        </Popover.Root>
    );
}
