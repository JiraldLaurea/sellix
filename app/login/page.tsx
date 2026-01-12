"use client";

import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import PageContainer from "@/components/ui/PageContainer";
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
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-sm text-gray-500">Checking session…</p>
            </div>
        );
    }

    return (
        <PageContainer className="py-0!">
            <section className="flex flex-col items-center justify-center min-h-screen space-y-6">
                <Image
                    src={"/img/brand_logo_light.png"}
                    alt={"Brand Logo"}
                    width={0}
                    height={0}
                    preload
                    loading="eager"
                    sizes="100vw"
                    style={{ width: "250px", height: "auto" }}
                    className="object-contain"
                />
                <Container className="px-0 sm:p-8 max-w-lg sm:border ">
                    <div className="mb-6 space-y-2 text-left">
                        <h1 className="text-3xl font-semibold">Sign in</h1>
                        <p className="text-gray-600">
                            Welcome! Let's sign in to your account.
                        </p>
                    </div>

                    <div className="space-y-3">
                        {/* Google */}
                        <Button
                            variant="secondary"
                            disabled={!googleEnabled || !!loadingProvider}
                            onClick={() => {
                                setLoadingProvider("google");
                                signIn("google", {
                                    callbackUrl: "/",
                                });
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
                            disabled={!githubEnabled || !!loadingProvider}
                            onClick={() => {
                                setLoadingProvider("github");
                                signIn("github", {
                                    callbackUrl: "/",
                                });
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
                </Container>
            </section>
        </PageContainer>
    );
}

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

function GitHubLogo() {
    return (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
        >
            <path d="M12 .5C5.73.5.5 5.74.5 12.02c0 5.1 3.29 9.42 7.86 10.95.58.11.79-.25.79-.56v-2.02c-3.2.7-3.87-1.54-3.87-1.54-.53-1.35-1.29-1.71-1.29-1.71-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.2 1.77 1.2 1.04 1.78 2.73 1.27 3.4.97.11-.76.41-1.27.75-1.56-2.56-.29-5.25-1.28-5.25-5.7 0-1.26.45-2.29 1.19-3.1-.12-.29-.52-1.47.11-3.06 0 0 .97-.31 3.18 1.18a11.1 11.1 0 015.8 0c2.2-1.49 3.18-1.18 3.18-1.18.63 1.59.23 2.77.11 3.06.74.81 1.19 1.84 1.19 3.1 0 4.43-2.7 5.41-5.27 5.69.42.36.8 1.08.8 2.18v3.24c0 .31.21.68.8.56a11.52 11.52 0 007.86-10.95C23.5 5.74 18.27.5 12 .5z" />
        </svg>
    );
}
