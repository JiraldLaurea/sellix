import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import OrderDetailsClient from "./OrderDetailsClient";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

export default async function OrderDetailPage({ params }: Props) {
    const session = await getServerSession(authOptions);
    const { id } = await params;
    const orderNumber = id;

    if (!session?.user?.id) {
        redirect("/login");
    }

    const order = await prisma.order.findFirst({
        where: {
            orderNumber: orderNumber,
            userId: session.user.id, // 🔐 security boundary
        },
        include: {
            items: true,
        },
    });

    if (!order) {
        redirect("/orders");
    }

    return <OrderDetailsClient order={order} />;
}
