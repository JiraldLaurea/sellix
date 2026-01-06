import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";

type Props = {
    params: Promise<{
        id: string;
    }>;
};

function getStatusStyles(status: string) {
    switch (status) {
        case "PAID":
            return "bg-green-100 text-green-700";
        case "PENDING":
            return "bg-amber-100 text-amber-700";
        case "FAILED":
        case "CANCELED":
            return "bg-red-100 text-red-700";
        default:
            return "bg-gray-100 text-gray-700";
    }
}

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

    return (
        <section className="max-w-3xl mx-auto py-10">
            <div className="mb-6 flex justify-between items-start">
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
                    className={`px-3 py-1 text-sm rounded-full ${getStatusStyles(
                        order.status
                    )}`}
                >
                    {order.status}
                </span>
            </div>

            <div className="border rounded-md p-4 mb-6">
                <ul className="space-y-2">
                    {order.items.map((item) => (
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

            <div className="flex gap-4 justify-between items-center">
                <Link
                    href="/account/orders"
                    className="text-sm text-gray-600 hover:underline"
                >
                    ← Back to orders
                </Link>

                {order.status === "PAID" && order.receiptUrl && (
                    <Link
                        href={order.receiptUrl}
                        target="_blank"
                        className="block rounded-md bg-black px-6 py-2 text-white hover:bg-gray-800 transition"
                    >
                        View Stripe receipt
                    </Link>
                )}
                {order.status === "PENDING" && (
                    <Link
                        href={`/account/orders/${order.orderNumber}/pay`}
                        className="mt-4 rounded-md bg-black px-6 py-3 text-white hover:bg-gray-800"
                    >
                        Complete payment
                    </Link>
                )}
            </div>
        </section>
    );
}
