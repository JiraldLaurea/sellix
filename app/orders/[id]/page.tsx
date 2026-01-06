import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import PendingOrderActions from "@/components/order/PendingOrderActions";
import getStatusStyles from "@/lib/order/getStatusStyles";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

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

    type OrderItem = (typeof order.items)[number];

    return (
        <section className="max-w-3xl mx-auto py-10">
            <Link
                href="/orders"
                className="text-gray-600 hover:underline flex items-center w-fit"
            >
                <IoIosArrowBack size={24} />
                <p>Orders</p>
            </Link>
            <div className="my-6 flex justify-between items-start">
                <div>
                    <h1 className="text-2xl font-semibold">
                        Order #{order.orderNumber}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Placed on{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <span
                    className={`px-3 py-1 text-sm rounded-full border ${getStatusStyles(
                        order.status
                    )}`}
                >
                    {order.status}
                </span>
            </div>

            <div className="border rounded-md p-4 mb-6">
                <ul className="space-y-2">
                    {order.items.map((item: OrderItem) => (
                        <li
                            key={item.id}
                            className="flex justify-between text-sm"
                        >
                            <span>
                                {item.quantity} x {item.name}
                            </span>
                            <span>
                                $
                                {((item.price * item.quantity) / 100).toFixed(
                                    2
                                )}
                            </span>
                        </li>
                    ))}
                </ul>

                <div className="border-t mt-4 pt-4 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${(order.total / 100).toFixed(2)}</span>
                </div>
            </div>

            <div className="flex gap-4 justify-end items-center">
                {order.status === "PAID" && order.receiptUrl && (
                    <Link
                        href={order.receiptUrl}
                        target="_blank"
                        className="block rounded-md bg-black px-6 py-2 text-white hover:bg-gray-800 transition"
                    >
                        View Stripe Receipt
                    </Link>
                )}
                {order.status === "PENDING" && (
                    <PendingOrderActions orderNumber={order.orderNumber} />
                )}
            </div>
        </section>
    );
}
