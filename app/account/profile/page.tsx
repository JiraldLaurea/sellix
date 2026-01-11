"use client";

import { useSession } from "next-auth/react";
import { useAuthGuard } from "@/lib/useAuthGuard";

export default function ProfilePage() {
    const status = useAuthGuard();
    const { data } = useSession();

    if (status === "loading") {
        return <p className="py-16 text-center">Loading…</p>;
    }

    if (status !== "authenticated") return null;

    return (
        <section className="max-w-xl mx-auto py-10 px-4 space-y-6 min-h-[calc(100vh-64px)]">
            <h1 className="text-2xl font-semibold">Profile</h1>

            <div className="border rounded-md p-4 space-y-2">
                <p>Email: {data?.user?.email}</p>
                <p>User ID: {data?.user?.id}</p>
            </div>
        </section>
    );
}
