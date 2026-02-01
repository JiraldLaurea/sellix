"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaGithub, FaLinkedin } from "react-icons/fa6";

export default function Footer() {
    const { status } = useSession();
    const pathname = usePathname();

    // Hide footer if not authenticated
    if (
        pathname === "/login" ||
        pathname === "/signup" ||
        pathname.startsWith("/search")
    )
        return null;

    return (
        <div className="flex justify-center py-10 border-t bg-gray-50">
            <div className="flex text-sm text-gray-600 flex-col space-y-6 sm:space-y-0 items-center justify-center w-full max-w-7xl px-8 sm:justify-between sm:flex-row">
                <p>©2026 Jirald Calusay</p>
                <div className="sm:space-y-0 space-y-2">
                    <div className="flex items-center mb-4 space-x-4 sm:space-x-8 sm:mb-0">
                        <Link
                            href="https://www.linkedin.com/in/jirald-calusay-064b09220"
                            target="_blank"
                            className="flex items-center space-x-1"
                        >
                            <FaLinkedin size={25} />
                            <p>LinkedIn</p>
                        </Link>
                        <Link
                            href="https://github.com/JiraldLaurea"
                            target="_blank"
                            className="flex items-center space-x-1"
                        >
                            <FaGithub size={25} />
                            <p>Github</p>
                        </Link>
                    </div>
                </div>
            </div>
            <div />
        </div>
    );
}
