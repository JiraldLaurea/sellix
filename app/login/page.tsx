"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <section className="min-h-[calc(100vh-64px)] flex items-center justify-center">
            <div className="border rounded-md p-6 space-y-4 text-center">
                <h1 className="text-xl font-semibold">Sign in</h1>

                <button
                    onClick={() =>
                        signIn("credentials", {
                            email: "test@example.com",
                            callbackUrl: "/account/orders",
                        })
                    }
                    className="w-full bg-black text-white py-2 rounded-md"
                >
                    Sign in (demo)
                </button>
            </div>
        </section>
    );
}
