import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import getStatusStyles from "@/lib/order/getStatusStyles";

export default async function OrdersPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const orders = await prisma.order.findMany({
        where: {
            userId: session.user.id,
        },
        include: {
            items: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });

    if (orders.length === 0) {
        return (
            <section className="pb-16 text-center flex flex-col items-center min-h-[calc(100vh-64px)] justify-center">
                <h1 className="text-2xl mb-4">No orders yet</h1>
                <Link
                    href="/"
                    className="inline-block rounded-md bg-accent text-white px-6 py-3 hover:bg-gray-800 transition"
                >
                    Start shopping
                </Link>
            </section>
        );
    }

    type Order = (typeof orders)[number];

    return (
        <section className="max-w-3xl mx-auto py-10">
            <h1 className="text-2xl font-semibold mb-6">Your Orders</h1>

            <div className="space-y-4">
                {orders.map((order: Order) => (
                    <Link
                        key={order.id}
                        href={`/orders/${order.orderNumber}`}
                        className="block border rounded-md p-4 hover:bg-gray-50 transition"
                    >
                        <div className="flex justify-between items-start mb-2">
                            <div>
                                <p className="font-medium">
                                    Order #{order.orderNumber}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </p>
                            </div>

                            <div className="text-right">
                                <p className="font-medium">
                                    ${(order.total / 100).toFixed(2)}
                                </p>
                                <span
                                    className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full border ${getStatusStyles(
                                        order.status
                                    )}`}
                                >
                                    {order.status}
                                </span>
                            </div>
                        </div>

                        <ul className="text-sm text-gray-600">
                            {order.items.map((item) => (
                                <li key={item.id}>
                                    {item.quantity} x {item.name}
                                </li>
                            ))}
                        </ul>
                    </Link>
                ))}
            </div>
        </section>
    );
}
