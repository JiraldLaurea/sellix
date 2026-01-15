"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import PageContainer from "@/components/ui/PageContainer";
import { Spinner } from "@/components/ui/Spinner";
import { GitHubLogo, GoogleLogo } from "@/public/img/login/svgs";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Provider = "google" | "github" | "credentials" | null;

export default function LoginPage() {
    const router = useRouter();
    const { status } = useSession();
    const [loadingProvider, setLoadingProvider] = useState<Provider>(null);

    const googleEnabled = process.env.NEXT_PUBLIC_GOOGLE_ENABLED === "true";
    const githubEnabled = process.env.NEXT_PUBLIC_GITHUB_ENABLED === "true";

    // 🔁 Redirect authenticated users
    useEffect(() => {
        if (status === "authenticated") {
            router.replace("/");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center space-y-2 min-h-screen">
                <Spinner className="w-6 h-6" borderColor="border-black" />
                <p className="text-sm text-gray-500">Checking session…</p>
            </div>
        );
    }

    return (
        <PageContainer className="py-0! max-w-full sm:px-0!">
            <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[500px_1fr]">
                {/* LEFT — SIDE CONTENT */}
                <div className="hidden lg:flex flex-col justify-center bg-gray-50 px-8 border-r w-full">
                    <h1 className="mb-4 text-4xl font-semibold">
                        Welcome to Sellix
                    </h1>

                    <p className="mb-10 max-w-md text-gray-500 leading-relaxed">
                        A modern e-commerce platform built to help you manage
                        orders and payments in one place. Fast, secure, and
                        designed to scale with your business.
                    </p>

                    <div className="flex gap-8 text-gray-400 font-medium">
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
                            priority
                            className="mb-12 object-contain"
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
                                disabled={!googleEnabled || !!loadingProvider}
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
                                disabled={!githubEnabled || !!loadingProvider}
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
