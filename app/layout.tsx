import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { CartProvider } from "@/lib/cart-context";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "./globals.css";

import { Providers } from "./providers";

export const metadata: Metadata = {
    icons: {
        icon: "/favicon.ico",
    },
    title: "Sellix",
    description: "Quality in every order",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Inter+Tight:ital,wght@0,100..900;1,100..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
                    rel="stylesheet"
                />
            </head>
            <body className={`min-h-screen font-inter!`}>
                <NextTopLoader
                    color="black"
                    height={2}
                    crawl
                    shadow="none"
                    showSpinner={false}
                />
                <Providers>
                    <CartProvider>
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                        <ToastContainer
                            position="bottom-right"
                            autoClose={3000}
                        />
                    </CartProvider>
                </Providers>
            </body>
        </html>
    );
}
