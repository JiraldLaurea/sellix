import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PageContainer from "@/components/ui/PageContainer";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import FavoritesClient from "./FavoritesClient";

export default async function FavoritesPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return (
            <PageContainer className="p-0! -my-8 flex flex-col items-center justify-center text-center space-y-6">
                <p>You must be logged in to view favorites.</p>
            </PageContainer>
        );
    }

    const favorites = await prisma.favorite.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
            product: {
                include: { category: true },
            },
        },
    });

    return (
        <PageContainer className="p-0! min-h-auto">
            <FavoritesClient
                products={favorites.map((f) => f.product)}
                favoriteIds={favorites.map((f) => f.productId)}
            />
        </PageContainer>
    );
}
