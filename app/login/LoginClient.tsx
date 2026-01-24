"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import PageContainer from "@/components/ui/PageContainer";
import { Spinner } from "@/components/ui/Spinner";
import { GitHubLogo, GoogleLogo } from "@/public/img/login/svgs";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";

type Provider = "google" | "github" | "credentials" | null;

export default function LoginClient() {
    const { status } = useSession();
    const [loadingProvider, setLoadingProvider] = useState<Provider>(null);

    const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";
    const githubEnabled = process.env.NEXT_PUBLIC_GITHUB_ENABLED === "true";

    // if (status === "loading") {
    //     return (
    //         <div className="flex flex-col items-center justify-center min-h-screen space-y-2">
    //             <Spinner className="w-6 h-6" borderColor="border-black" />
    //             <p className="text-sm text-gray-500">Checking session…</p>
    //         </div>
    //     );
    // }

    return (
        <PageContainer className="py-0! max-w-full sm:px-0!">
            <div className="grid min-h-screen grid-cols-1 md:grid-cols-2">
                {/* LEFT — SIDE CONTENT */}
                <div className="flex-col items-center justify-center hidden w-full px-8 space-y-10 text-center text-white border-r md:flex bg-accent">
                    <Image
                        src="/img/brand_logo_dark.png"
                        alt="Brand Logo"
                        width={180}
                        height={40}
                        preload
                        loading="eager"
                        className="object-contain"
                    />
                    <div className="space-y-2">
                        <h1 className="text-4xl font-semibold">
                            Welcome to Sellix
                        </h1>

                        <p className="max-w-md leading-relaxed text-gray-400">
                            A modern e-commerce platform built to help you
                            manage orders and payments in one place. Fast,
                            secure, and designed to scale with your business.
                        </p>
                    </div>

                    <div className="flex gap-8 font-medium text-gray-500">
                        <span>Next.js</span>
                        <span>Stripe</span>
                        <span>Prisma</span>
                        <span>Postgresql</span>
                    </div>
                </div>

                {/* RIGHT — LOGIN */}
                <div className="flex items-center justify-center">
                    <Container className="w-full max-w-lg px-0 sm:p-8">
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
                                className="h-12"
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
                                className="h-12"
                            >
                                <GitHubLogo />
                                <span>
                                    {loadingProvider === "github"
                                        ? "Redirecting…"
                                        : "Sign in with GitHub"}
                                </span>
                            </Button>
                        </div>
                    </Container>
                </div>
            </div>
        </PageContainer>
    );
}
