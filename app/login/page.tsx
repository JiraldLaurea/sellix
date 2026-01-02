"use client";

import { signIn } from "next-auth/react";

export default function LoginPage() {
    return (
        <section className="min-h-[calc(100vh-64px)] pb-16 flex items-center justify-center">
            <div className="border rounded-md p-6 space-y-4 text-center w-full max-w-md">
                <h1 className="text-xl font-semibold">Sign in</h1>

                {/* Demo credentials login */}
                <button
                    onClick={() =>
                        signIn("credentials", {
                            email: "test@example.com",
                            callbackUrl: "/account/orders",
                        })
                    }
                    className="w-full bg-accent hover:bg-gray-800 transition text-white py-2 rounded-md"
                >
                    Sign in (demo)
                </button>

                <div className="relative flex items-center">
                    <div className="grow border-t" />
                    <span className="mx-2 text-sm text-gray-500">or</span>
                    <div className="grow border-t" />
                </div>

                {/* Google OAuth login */}
                <button
                    onClick={() =>
                        signIn("google", {
                            callbackUrl: "/account/orders",
                        })
                    }
                    className="w-full flex items-center justify-center gap-3 border rounded-md py-2 hover:bg-gray-50 transition"
                >
                    <GoogleLogo />
                    <span>Sign in with Google</span>
                </button>
            </div>
        </section>
    );
}

/* Inline SVG = no network request, always crisp */
function GoogleLogo() {
    return (
        <svg width="20" height="20" viewBox="0 0 48 48">
            <path
                fill="#EA4335"
                d="M24 9.5c3.54 0 6.68 1.23 9.17 3.25l6.83-6.83C35.88 2.3 30.33 0 24 0 14.62 0 6.6 5.38 2.67 13.22l7.95 6.18C12.56 13.26 17.85 9.5 24 9.5z"
            />
            <path
                fill="#4285F4"
                d="M46.1 24.55c0-1.64-.15-3.22-.43-4.75H24v9h12.4c-.54 2.9-2.2 5.36-4.66 7.04l7.2 5.6C43.9 37.6 46.1 31.6 46.1 24.55z"
            />
            <path
                fill="#FBBC05"
                d="M10.62 28.4a14.5 14.5 0 010-8.8l-7.95-6.18a24 24 0 000 21.36l7.95-6.18z"
            />
            <path
                fill="#34A853"
                d="M24 48c6.33 0 11.65-2.08 15.53-5.66l-7.2-5.6c-2 1.35-4.56 2.16-8.33 2.16-6.15 0-11.44-3.76-13.38-8.9l-7.95 6.18C6.6 42.62 14.62 48 24 48z"
            />
        </svg>
    );
}
