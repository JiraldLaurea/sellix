import Image from "next/image";

export function Welcome({}) {
    return (
        <>
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
                        A modern e-commerce platform built to help you manage
                        orders and payments in one place. Fast, secure, and
                        designed to scale with your business.
                    </p>
                </div>

                <div className="flex gap-8 font-medium text-gray-500">
                    <span>Next.js</span>
                    <span>Stripe</span>
                    <span>Prisma</span>
                    <span>Postgresql</span>
                </div>
            </div>
        </>
    );
}
