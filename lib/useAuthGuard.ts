"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export function useAuthGuard() {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
        null
    );

    useEffect(() => {
        const user = localStorage.getItem("user");

        if (!user) {
            router.replace("/login");
            setIsAuthenticated(false);
        } else {
            setIsAuthenticated(true);
        }
    }, [router]);

    return isAuthenticated;
}
