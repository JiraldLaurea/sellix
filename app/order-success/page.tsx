import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SuccessClient from "./success-client";

type Props = {
    searchParams: Promise<{
        order?: string;
    }>;
};

export default async function OrderSuccessPage({ searchParams }: Props) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    // ✅ MUST await in Next 15+
    const sp = await searchParams;
    const orderNumber = sp.order;

    if (!orderNumber) {
        redirect("/account/orders");
    }

    const order = await prisma.order.findUnique({
        where: {
            orderNumber,
            userId: session.user.id,
        },
        select: {
            status: true,
        },
    });

    if (!order) {
        redirect("/account/orders");
    }

    return <SuccessClient orderNumber={orderNumber} />;
}
