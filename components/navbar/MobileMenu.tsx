"use client";

import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Link from "next/link";
import { Menu } from "lucide-react";

export default function MobileMenu() {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    aria-label="Open menu"
                    className="md:hidden p-2 rounded-md hover:bg-gray-100"
                >
                    <Menu className="h-5 w-5" />
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Content
                align="end"
                sideOffset={8}
                className="w-48 rounded-md border bg-white p-2 shadow-md"
            >
                <NavItem href="/">Home</NavItem>
                <NavItem href="/shop">Shop</NavItem>
                <NavItem href="/cart">Cart</NavItem>

                <DropdownMenu.Separator className="my-1 h-px bg-gray-200" />

                <NavItem href="/account">Account</NavItem>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    );
}

function NavItem({
    href,
    children,
}: {
    href: string;
    children: React.ReactNode;
}) {
    return (
        <DropdownMenu.Item asChild>
            <Link
                href={href}
                className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100 focus:outline-none"
            >
                {children}
            </Link>
        </DropdownMenu.Item>
    );
}
