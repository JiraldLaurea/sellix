import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import HeroCarousel from "./(marketing)/components/HeroCarousel";
import CategoriesPage from "./(marketing)/page";
import ShopPage from "./(shop)/shop/page";

export default async function Home() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    return (
        <>
            <HeroCarousel />
            <CategoriesPage />
            <ShopPage />
        </>
    );
}
