import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import AccountSideMenu from "@/components/account/AccountSideMenu";
import PageContainer from "@/components/ui/PageContainer";

export default async function AccountLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) redirect("/login");

    const [orderCount, favoritesCount] = await Promise.all([
        prisma.order.count({
            where: { userId: session.user.id },
        }),
        prisma.favorite.count({
            where: { userId: session.user.id },
        }),
    ]);

    return (
        <PageContainer className="p-0!">
            <div className="flex">
                <div className="hidden md:block min-h-[calc(100vh-64px)] border-r">
                    <AccountSideMenu
                        orderCount={orderCount}
                        favoritesCount={favoritesCount}
                    />
                </div>
                <main className="flex-1 px-4 py-6 sm:p-6">{children}</main>
            </div>
        </PageContainer>
    );
}
