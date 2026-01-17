import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
import { CartProvider } from "@/lib/cart-context";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import { Providers } from "./providers";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
                        <Navbar />
                        <main>{children}</main>
                        <Footer />
                        <ToastContainer
                            position="bottom-right"
                            autoClose={2500}
                            className="w-[calc(100vw-32px)]! xs:w-80! xs:left-auto! left-4! xs:right-6! xs:bottom-2! bottom-4!"
                            toastClassName="xs:w-full! rounded-none!"
                            closeOnClick={true}
                        />
                    </CartProvider>
                </Providers>
            </body>
        </html>
    );
}
