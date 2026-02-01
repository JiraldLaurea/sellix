import { prisma } from "@/lib/prisma";
import CategorySection from "./components/CategorySection";
import HeroCarousel from "./components/HeroCarousel";
import SpecialOfferSection from "./components/SpecialOfferSection";
import CategoryPreviewSection from "./components/CategoryPreviewSection";

const FEATURED_PRODUCTS = [
    "Apple Airpods",
    "Gucci Bloom Eau de",
    "New DELL XPS 13 9300 Laptop",
    "Rolex Submariner Watch",
];

const SPECIAL_OFFER_PRODUCTS = [
    "iPad Mini 2021 Starlight",
    "Samsung Galaxy S8",
    "Nike Air Jordan 1 Red And Black",
];

const CATEGORY_DESCRIPTIONS: Record<string, string> = {
    "Mobile Accessories": "Mobile accessories",
    Smartphones: "Smartphones",
};

export default async function LandingPage() {
    const heroProducts = await prisma.product.findMany({
        where: {
            name: { in: FEATURED_PRODUCTS, mode: "insensitive" },
        },
        orderBy: { name: "asc" },
        take: 4,
        select: {
            id: true,
            name: true,
            description: true,
            images: true,
        },
    });

    const categories = await prisma.category.findMany({
        select: {
            id: true,
            name: true,
            image: true,

            _count: { select: { products: true } },
        },
    });

    const specialOffers = await prisma.product.findMany({
        where: {
            name: { in: SPECIAL_OFFER_PRODUCTS, mode: "insensitive" },
        },
        select: {
            id: true,
            name: true,
            price: true,
            images: true,
        },
        take: 3,
    });

    const mobileAccessories = await prisma.product.findMany({
        where: { category: { name: "Mobile Accessories" } },
        select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            images: true,
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        take: 4,
    });

    const smartphones = await prisma.product.findMany({
        where: { category: { name: "Smartphones" } },
        select: {
            id: true,
            name: true,
            price: true,
            stock: true,
            images: true,
            category: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
        take: 4,
    });

    const getCategoryId = (name: string) =>
        categories.find((c) => c.name === name)?.id;

    return (
        <>
            <HeroCarousel products={heroProducts} />;
            <CategorySection
                categories={categories.map((c) => ({
                    id: c.id,
                    name: c.name,
                    image: c.image,
                    itemCount: c._count.products,
                }))}
            />
            <SpecialOfferSection products={specialOffers} />
            {getCategoryId("Mobile Accessories") && (
                <CategoryPreviewSection
                    title={CATEGORY_DESCRIPTIONS["Mobile Accessories"]}
                    categoryId={getCategoryId("Mobile Accessories")!}
                    products={mobileAccessories}
                />
            )}
            {getCategoryId("Smartphones") && (
                <CategoryPreviewSection
                    title={CATEGORY_DESCRIPTIONS["Smartphones"]}
                    categoryId={getCategoryId("Smartphones")!}
                    products={smartphones}
                />
            )}
        </>
    );
}
