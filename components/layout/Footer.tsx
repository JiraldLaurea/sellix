"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Footer() {
    const { status } = useSession();
    const pathname = usePathname();

    // Hide footer if not authenticated
    if (pathname === "/login" || pathname === "/signup") return null;

    return (
        <div className="flex justify-center py-10 border-t bg-gray-50">
            <div className="flex flex-col-reverse items-center justify-center w-full max-w-6xl px-4 sm:justify-between sm:flex-row">
                <p className="text-sm text-gray-600">©2026 Jirald Calusay</p>
            </div>
            <div />
        </div>
    );
}
