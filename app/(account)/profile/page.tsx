"use client";

import { useSession } from "next-auth/react";

export default function ProfilePage() {
    const { data, status } = useSession();

    if (status === "loading") {
        return <p className="py-16 text-center">Loading…</p>;
    }

    return (
        <section>
            <h1 className="mb-6 text-3xl font-semibold">Profile</h1>

            <div className="space-y-2 rounded-md border p-4">
                <p>Email: {data?.user?.email}</p>
                <p>User ID: {data?.user?.id}</p>
            </div>
        </section>
    );
}
