"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import PageContainer from "@/components/ui/PageContainer";
import { GitHubLogo, GoogleLogo } from "@/public/img/login/svgs";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { IoIosAlert, IoIosInformationCircle } from "react-icons/io";
import { useRouter } from "next/navigation";
import { Welcome } from "@/components/ui/Welcome";

type Provider = "google" | "github" | "credentials" | null;

export default function LoginClient() {
    const { status } = useSession();
    const [loadingProvider, setLoadingProvider] = useState<Provider>(null);
    const router = useRouter();

    const DEMO_EMAIL = "admin@email.com";
    const DEMO_PASSWORD = "Secret12";

    const [email, setEmail] = useState(DEMO_EMAIL);
    const [password, setPassword] = useState(DEMO_PASSWORD);
    const [showPassword, setShowPassword] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";
    const githubEnabled = process.env.NEXT_PUBLIC_GITHUB_ENABLED === "true";

    const sleep = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    return (
        <PageContainer className="py-0! max-w-full sm:px-0!">
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-[400px_1fr] lg:grid-cols-[550px_1fr]">
                {/* LEFT — WELCOME */}
                <Welcome />

                {/* RIGHT — LOGIN */}
                <div className="flex items-center w-full justify-center">
                    <Container className="w-full max-w-lg px-0 py-6 sm:p-6">
                        <Image
                            src="/img/brand_logo_light.png"
                            alt="Brand Logo"
                            width={120}
                            height={40}
                            preload
                            loading="eager"
                            className="object-contain mb-12 md:hidden"
                        />
                        <div className="mb-6 space-y-2">
                            <h1 className="text-3xl font-semibold">Sign in</h1>
                            <p className="text-gray-600">
                                Welcome back! Let's sign in to your account.
                            </p>
                        </div>

                        <div className="space-y-3">
                            {/* Google */}
                            <Button
                                variant="secondary"
                                disabled={
                                    !googleEnabled ||
                                    !!loadingProvider ||
                                    status === "loading"
                                }
                                onClick={() => {
                                    setLoadingProvider("google");
                                    signIn("google", { callbackUrl: "/" });
                                }}
                            >
                                <GoogleLogo />
                                <span>
                                    {loadingProvider === "google"
                                        ? "Redirecting…"
                                        : "Sign in with Google"}
                                </span>
                            </Button>

                            {/* GitHub */}
                            <Button
                                variant="secondary"
                                disabled={
                                    !githubEnabled ||
                                    !!loadingProvider ||
                                    status === "loading"
                                }
                                onClick={() => {
                                    setLoadingProvider("github");
                                    signIn("github", { callbackUrl: "/" });
                                }}
                            >
                                <GitHubLogo />
                                <span>
                                    {loadingProvider === "github"
                                        ? "Redirecting…"
                                        : "Sign in with GitHub"}
                                </span>
                            </Button>
                        </div>

                        <div className="relative flex items-center my-4">
                            <div className="grow border-t" />
                            <span className="mx-2 text-gray-500">or</span>
                            <div className="grow border-t" />
                        </div>

                        {/* User Credentials */}
                        <form
                            className="space-y-4"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (loadingProvider) return;

                                setAuthError(null);
                                setLoadingProvider("credentials");

                                // Force loading state to show
                                await sleep(600);

                                const result = await signIn("credentials", {
                                    email,
                                    password,
                                    redirect: false,
                                });

                                setLoadingProvider(null);

                                if (result?.error) {
                                    setAuthError("Invalid login credentials");
                                    return;
                                }

                                router.push("/");
                            }}
                        >
                            {/* Email */}
                            <div>
                                <p className="font-medium mb-1">
                                    Email address
                                </p>
                                <input
                                    disabled={
                                        !githubEnabled ||
                                        !!loadingProvider ||
                                        status === "loading"
                                    }
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="you@example.com"
                                    className="disabled:hover:bg-inherit disabled:opacity-50 w-full text-base text-black leading-10 rounded-lg border px-3 h-10 focus:outline-none transition-all focus:ring-2 focus:border-transparent focus:ring-blue-500"
                                />
                            </div>

                            {/* Password */}
                            <div>
                                <p className="font-medium mb-1">Password</p>
                                <div className="relative focus-within:ring-2 border focus-within:border-transparent focus-within:ring-blue-500 transition-all rounded-lg">
                                    <input
                                        disabled={
                                            !githubEnabled ||
                                            !!loadingProvider ||
                                            status === "loading"
                                        }
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                        className="disabled:hover:bg-inherit disabled:opacity-50 w-full text-base text-black px-3 h-10 leading-10 focus:outline-none"
                                    />
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setShowPassword((v) => !v)
                                        }
                                        className="absolute text-black -translate-y-1/2 top-1/2 right-3 "
                                    >
                                        {showPassword ? (
                                            <BsEye size={18} />
                                        ) : (
                                            <BsEyeSlash size={18} />
                                        )}
                                    </button>
                                </div>
                            </div>
                            {authError && (
                                <div className="px-4 py-3 bg-red-50 rounded-lg mt-4 flex items-center space-x-1">
                                    <IoIosAlert
                                        size={24}
                                        className="text-red-500"
                                    />
                                    <p className="text-red-500">{authError}</p>
                                </div>
                            )}

                            <Button
                                className="w-full"
                                disabled={
                                    !githubEnabled ||
                                    !!loadingProvider ||
                                    status === "loading"
                                }
                            >
                                {loadingProvider === "credentials"
                                    ? "Signing in…"
                                    : "Sign in"}
                            </Button>
                            <div className="flex">
                                <p>
                                    Don't have an account?{" "}
                                    <Link
                                        href="/signup"
                                        className="text-blue-500 hover:underline cursor-pointer"
                                    >
                                        Sign up
                                    </Link>
                                </p>
                                {/* <button className="text-blue-500 hover:underline text-right">
                                    Forgot password?
                                </button> */}
                            </div>
                        </form>

                        <div className="px-4 py-3 bg-blue-50 rounded-lg mt-4 flex items-center space-x-1">
                            <IoIosInformationCircle
                                size={24}
                                className="text-blue-500"
                            />
                            <p>
                                Use{" "}
                                <span className="font-semibold">
                                    admin@email.com
                                </span>{" "}
                                with password{" "}
                                <span className="font-semibold">Secret12</span>
                            </p>
                        </div>
                    </Container>
                </div>
            </div>
        </PageContainer>
    );
}
