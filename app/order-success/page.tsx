import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "../api/auth/[...nextauth]/route";

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

    console.log("ORDER PARAM:", orderNumber);

    if (!orderNumber) {
        redirect("/account/orders");
    }

    const order = await prisma.order.findFirst({
        where: {
            orderNumber,
            userId: session.user.id,
        },
        include: {
            items: true,
        },
    });

    if (!order) {
        redirect("/account/orders");
    }

    return (
        <section className="min-h-[calc(100vh-64px)] flex items-center justify-center py-6">
            <div className="max-w-md w-full space-y-6 text-center">
                <div className="text-5xl">✅</div>

                <h1 className="text-2xl font-semibold">Order confirmed</h1>

                <div className="space-y-1">
                    <p className="text-sm text-gray-500">Order number</p>
                    <p className="text-lg">{order?.orderNumber}</p>
                </div>

                <div className="border rounded-md p-4 text-left space-y-2">
                    {order?.items.map((item) => (
                        <div
                            key={item.id}
                            className="flex justify-between text-sm"
                        >
                            <span>
                                {item.name} x {item.quantity}
                            </span>
                            <span>
                                $
                                {((item.price * item.quantity) / 100).toFixed(
                                    2
                                )}
                            </span>
                        </div>
                    ))}

                    <div className="border-t pt-2 flex justify-between font-medium">
                        <span>Total</span>
                        <span>${(order.total / 100).toFixed(2)}</span>
                    </div>
                </div>

                <div className="space-y-2">
                    <Link
                        href="/account/orders"
                        className="block rounded-md border py-3 hover:bg-gray-50 transition"
                    >
                        View orders
                    </Link>

                    <Link
                        href="/"
                        className="block rounded-md bg-black py-3 text-white hover:bg-gray-800 transition"
                    >
                        Continue shopping
                    </Link>
                </div>
            </div>
        </section>
    );
}
