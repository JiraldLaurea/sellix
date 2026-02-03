import { prisma } from "@/lib/prisma";
import CategorySection from "./components/CategorySection";
import HeroCarousel from "./components/HeroCarousel";
import SpecialOfferSection from "./components/SpecialOfferSection";
import CategoryPreviewSection from "./components/CategoryPreviewSection";
import CategoryBannerSection from "./components/CategoryBannerSection";

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

const CATEGORY_TITLE: Record<string, string> = {
    "Mobile Accessories": "Mobile Accessories",
    Smartphones: "Smartphones",
    "Mens Shirts": "Mens Shirts",
    "Womens Dresses": "Womens Dresses",
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

    const mensShirts = await prisma.product.findMany({
        where: { category: { name: "Mens Shirts" } },
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

    const womensDresses = await prisma.product.findMany({
        where: { category: { name: "Womens Dresses" } },
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

    const bannerCategories = await prisma.category.findMany({
        where: {
            name: {
                in: ["Groceries", "Sports Accessories"],
            },
        },
        select: {
            name: true,
            products: {
                take: 1,
                orderBy: { createdAt: "desc" },
                select: {
                    images: true,
                },
            },
        },
    });

    const getBannerImage = (categoryName: string) =>
        bannerCategories.find((c) => c.name === categoryName)?.products[0]
            ?.images[0] ?? "/images/placeholder.jpg";

    return (
        <>
            <HeroCarousel products={heroProducts} />
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
                    title={CATEGORY_TITLE["Mobile Accessories"]}
                    categoryId={getCategoryId("Mobile Accessories")!}
                    products={mobileAccessories}
                />
            )}
            {getCategoryId("Smartphones") && (
                <CategoryPreviewSection
                    title={CATEGORY_TITLE["Smartphones"]}
                    categoryId={getCategoryId("Smartphones")!}
                    products={smartphones}
                />
            )}
            <CategoryBannerSection
                items={[
                    {
                        title: "Grocery Essentials",
                        description:
                            "Fresh food, daily essentials, and household items",
                        image: getBannerImage("Groceries"),
                        href: "/search?category=groceries",
                        className: "bg-teal-400",
                    },
                    {
                        title: "Sports Collections",
                        description:
                            "Gear up with premium sports accessories and equipment",
                        image: getBannerImage("Sports Accessories"),
                        href: "/search?category=sports-accessories",
                        className: "bg-cyan-400",
                    },
                ]}
            />
            {getCategoryId("Mobile Accessories") && (
                <CategoryPreviewSection
                    title={CATEGORY_TITLE["Mens Shirts"]}
                    categoryId={getCategoryId("Mens Shirts")!}
                    products={mensShirts}
                />
            )}
            {getCategoryId("Mobile Accessories") && (
                <CategoryPreviewSection
                    title={CATEGORY_TITLE["Womens Dresses"]}
                    categoryId={getCategoryId("Mobile Accessories")!}
                    products={womensDresses}
                />
            )}
        </>
    );
}
