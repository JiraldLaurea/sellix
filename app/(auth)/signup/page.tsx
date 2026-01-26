"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import PageContainer from "@/components/ui/PageContainer";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const passwordValid =
        password.length == 0 ||
        (password.length >= 8 &&
            /[A-Z]/.test(password) &&
            /[0-9]/.test(password));

    const passwordsMatch = password === confirmPassword;

    return (
        <PageContainer className="py-0! max-w-full sm:px-0!">
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-[400px_1fr] lg:grid-cols-[550px_1fr]">
                {/* LEFT */}
                <div className="hidden md:flex flex-col items-center justify-center px-8 space-y-10 text-center text-white border-r bg-accent">
                    <Image
                        src="/img/brand_logo_dark.png"
                        alt="Brand Logo"
                        width={180}
                        height={40}
                        className="object-contain"
                    />
                    <div className="space-y-2">
                        <h1 className="text-4xl font-semibold">
                            Create your Sellix account
                        </h1>
                        <p className="max-w-md text-gray-400">
                            Get started in minutes. Manage products, orders, and
                            payments with ease.
                        </p>
                    </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center justify-center w-full">
                    <Container className="w-full max-w-lg px-0 py-6 sm:p-6">
                        <Image
                            src="/img/brand_logo_light.png"
                            alt="Brand Logo"
                            width={120}
                            height={40}
                            className="object-contain mb-12 md:hidden"
                        />

                        <div className="mb-6 space-y-2">
                            <h1 className="text-3xl font-semibold">Sign up</h1>
                            <p className="text-gray-600">
                                Create an account to get started.
                            </p>
                        </div>

                        <div className="space-y-4">
                            {/* Email */}
                            <div>
                                <p className="text-sm font-medium mb-1">Name</p>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="text-base w-full h-10 leading-10 px-3 rounded-lg focus:border-transparent border focus:outline-none focus:ring-2 transition focus:ring-blue-500"
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <p className="text-sm font-medium mb-1">
                                    Email address
                                </p>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="text-base w-full h-10 leading-10 px-3 rounded-lg focus:border-transparent border focus:outline-none focus:ring-2 transition focus:ring-blue-500"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <p className="text-sm font-medium mb-1">
                                    Password
                                </p>
                                <div className="relative border focus-within:border-transparent transition rounded-lg focus-within:ring-2 focus-within:ring-blue-500">
                                    <input
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="text-base w-full h-10 leading-10 px-3 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                        className="absolute right-3 top-1/2 -translate-y-1/2"
                                    >
                                        {showPassword ? (
                                            <BsEye size={18} />
                                        ) : (
                                            <BsEyeSlash size={18} />
                                        )}
                                    </button>
                                </div>
                                {!passwordValid && (
                                    <p className="text-xs mt-1 text-amber-500">
                                        Password must be 8+ chars, include a
                                        number & uppercase letter
                                    </p>
                                )}
                            </div>

                            {/* Confirm password */}
                            <div>
                                <p className="text-sm font-medium mb-1">
                                    Confirm password
                                </p>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                        setConfirmPassword(e.target.value)
                                    }
                                    className={`text-base w-full h-10 leading-10 px-3 transition focus:border-transparent rounded-lg border focus:outline-none focus:ring-2 
                                        ${password && confirmPassword && !passwordsMatch ? "focus:ring-red-500" : "focus:ring-blue-500"}`}
                                />
                                {password &&
                                    confirmPassword &&
                                    !passwordsMatch && (
                                        <p className="text-xs mt-1 text-red-500">
                                            Passwords do not match
                                        </p>
                                    )}
                            </div>

                            <Button
                                className="w-full"
                                disabled={
                                    !passwordValid ||
                                    !passwordsMatch ||
                                    password.length == 0
                                }
                                onClick={async () => {
                                    const res = await fetch(
                                        "/api/auth/register",
                                        {
                                            method: "POST",
                                            headers: {
                                                "Content-Type":
                                                    "application/json",
                                            },
                                            body: JSON.stringify({
                                                name,
                                                email,
                                                password,
                                            }),
                                        },
                                    );

                                    if (!res.ok) return;

                                    await signIn("credentials", {
                                        email,
                                        password,
                                        callbackUrl: "/",
                                    });
                                }}
                            >
                                Create account
                            </Button>

                            <p>
                                Already have an account?{" "}
                                <Link
                                    href="/login"
                                    className="text-blue-500 hover:underline"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </Container>
                </div>
            </div>
        </PageContainer>
    );
}
