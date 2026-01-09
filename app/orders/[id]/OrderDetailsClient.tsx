"use client";

import { OrderItem } from "@/app/types";
import OrderBreakdown from "@/components/order/OrderBreakdown";
import PendingOrderActions from "@/components/order/PendingOrderActions";
import { Container } from "@/components/ui/Container";
import { formatMoney } from "@/lib/formatMoney";
import getStatusStyles from "@/lib/order/getStatusStyles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";

export default function OrderDetailsClient({ order }: any) {
    const router = useRouter();

    return (
        <section className="max-w-3xl mx-auto py-10 min-h-[calc(100vh-64px)]">
            <Link
                href="/orders"
                className="text-gray-600 hover:underline flex items-center w-fit"
            >
                <IoIosArrowBack size={24} />
                <p>Orders</p>
            </Link>
            <div className="my-6 flex justify-between items-center">
                <div>
                    <h1 className="text-lg sm:text-2xl font-semibold">
                        Order #{order.orderNumber}
                    </h1>
                    <p className="text-sm text-gray-500">
                        Ordered on:{" "}
                        {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <span
                    className={`px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-full border ${getStatusStyles(
                        order.status
                    )}`}
                >
                    {order.status}
                </span>
            </div>

            <Container className="w-full sm:p-8 sm:border">
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
                                {formatMoney(item.price * item.quantity)}
                            </span>
                        </li>
                    ))}
                </ul>

                {/* Breakdown */}
                <OrderBreakdown
                    subtotal={order.subtotal}
                    shippingFee={order.shipping}
                    tax={order.tax}
                    total={order.total}
                />
            </Container>

            <div className="flex gap-4 justify-end items-center mt-6">
                {order.status === "PAID" && order.receiptUrl && (
                    <Link
                        href={order.receiptUrl}
                        target="_blank"
                        className="flex w-full sm:w-fit justify-center items-center text-sm space-x-2 rounded-md bg-black px-6 py-3 text-white hover:bg-gray-700 transition-colors"
                    >
                        <p>View Stripe Receipt</p>
                        <FaArrowUpRightFromSquare />
                    </Link>
                )}
                {order.status === "PENDING" && (
                    <PendingOrderActions orderNumber={order.orderNumber} />
                )}
            </div>
        </section>
    );
}
