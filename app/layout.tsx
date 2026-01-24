import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { CartProvider } from "@/lib/cart-context";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";
import { FavoritesProvider } from "@/lib/favorites-context";
import FavoritesHydrator from "@/components/favorites/FavoritesHydrator";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { FilterProvider } from "@/lib/filter-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    icons: {
        icon: "/favicon.ico",
    },
    title: "Sellix",
    description: "Quality in every order",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const session = await getServerSession(authOptions);

    const favorites = session?.user?.id
        ? await prisma.favorite.findMany({
              where: { userId: session.user.id },
              select: { productId: true },
          })
        : [];

    return (
        <html lang="en" className={inter.className}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
            </head>
            <body className={`min-h-screen`}>
                <NextTopLoader
                    color="black"
                    height={2}
                    crawl
                    showSpinner={false}
                />
                <Providers>
                    <CartProvider>
                        <FavoritesProvider>
                            <FilterProvider>
                                <Navbar />
                                <main>
                                    <FavoritesHydrator
                                        favoriteIds={favorites.map(
                                            (f) => f.productId,
                                        )}
                                    />
                                    {children}
                                </main>
                                <Footer />
                                <ToastContainer
                                    position="bottom-right"
                                    autoClose={2500}
                                    className="w-[calc(100vw-32px)]! xs:w-80! xs:left-auto! left-4! right-0! xs:right-8! xs:bottom-2! bottom-4!"
                                    toastClassName="xs:w-full! rounded-none!"
                                    closeOnClick={true}
                                />
                            </FilterProvider>
                        </FavoritesProvider>
                    </CartProvider>
                </Providers>
            </body>
        </html>
    );
}
