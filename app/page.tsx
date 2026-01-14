import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import HeroCarousel from "./(marketing)/components/HeroCarousel";
import ShopPage from "./(shop)/shop/page";
import { getAllCategories } from "@/lib/getAllCategories";
import CategoriesPage from "./(marketing)/page";

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
