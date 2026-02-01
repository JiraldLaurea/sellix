import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import PageContainer from "@/components/ui/PageContainer";
import OrdersClient from "./OrdersClient";

export default async function OrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) redirect("/login");

    const orders = await prisma.order.findMany({
        where: { userId: session.user.id },
        include: {
            items: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const orderCount = orders.length;

    return (
        <PageContainer className="p-0! min-h-[calc(100vh-112px)]">
            <OrdersClient orders={orders} orderCount={orderCount} />
        </PageContainer>
    );
}
