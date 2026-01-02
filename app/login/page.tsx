"use client";

import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();

    const login = () => {
        localStorage.setItem(
            "user",
            JSON.stringify({
                id: "user_1",
                email: "test@example.com",
            })
        );

        router.replace("/account/orders");
    };

    return (
        <section className="min-h-[calc(100vh-64px)] flex items-center justify-center">
            <div className="border rounded-md p-6 space-y-4 text-center">
                <h1 className="text-xl font-semibold">Sign in</h1>

                <button
                    onClick={login}
                    className="w-full bg-black text-white py-2 rounded-md"
                >
                    Sign in (mock)
                </button>
            </div>
        </section>
    );
}
