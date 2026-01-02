"use client";

import { useAuthGuard } from "@/lib/useAuthGuard";

export default function ProfilePage() {
    const isAuthenticated = useAuthGuard();

    if (isAuthenticated === null) {
        return (
            <section className="py-16 text-center">
                <p>Loading profile…</p>
            </section>
        );
    }

    if (!isAuthenticated) {
        return null; // redirected by guard
    }

    const user =
        typeof window !== "undefined"
            ? JSON.parse(localStorage.getItem("user") || "{}")
            : null;

    return (
        <section className="max-w-xl mx-auto py-10 space-y-6">
            <h1 className="text-2xl font-semibold">Profile</h1>

            <div className="border rounded-md p-4 space-y-2">
                <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email || "—"}</p>
                </div>

                <div>
                    <p className="text-sm text-gray-500">User ID</p>
                    <p className="font-mono text-sm">{user?.id || "—"}</p>
                </div>
            </div>
        </section>
    );
}
