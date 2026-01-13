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

    const orderCount = await prisma.order.count({
        where: { userId: session.user.id },
    });

    return (
        <PageContainer>
            <div className="flex gap-6">
                <AccountSideMenu orderCount={orderCount} />
                <main className="flex-1">{children}</main>
            </div>
        </PageContainer>
    );
}
