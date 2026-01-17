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
        <PageContainer>
            <div className="flex md:gap-6">
                <div className="min-h-[calc(100vh-128px)]">
                    <AccountSideMenu
                        orderCount={orderCount}
                        favoritesCount={favoritesCount}
                    />
                </div>
                <main className="flex-1">{children}</main>
            </div>
        </PageContainer>
    );
}
