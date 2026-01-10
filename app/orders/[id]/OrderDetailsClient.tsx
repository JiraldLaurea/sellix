"use client";

import { OrderItem } from "@/app/types";
import OrderBreakdown from "@/components/order/OrderBreakdown";
import PendingOrderActions from "@/components/order/PendingOrderActions";
import { BackButton } from "@/components/ui/BackButton";
import { Container } from "@/components/ui/Container";
import { formatMoney } from "@/lib/formatMoney";
import getStatusStyles from "@/lib/order/getStatusStyles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

export default function OrderDetailsClient({ order }: any) {
    const router = useRouter();

    return (
        <section className="max-w-3xl mx-auto py-10 min-h-[calc(100vh-64px)]">
            <BackButton text="Orders" href="/orders" hasHref />
            <div className="flex items-center justify-between mt-4 mb-6">
                <div>
                    <h1 className="text-lg font-semibold sm:text-2xl">
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

            <div className="flex items-center justify-end gap-4 mt-6">
                {order.status === "PAID" && order.receiptUrl && (
                    <Link
                        href={order.receiptUrl}
                        target="_blank"
                        className="flex items-center justify-center w-full px-6 py-3 space-x-2 text-sm text-white transition-colors bg-black rounded-md sm:w-fit hover:bg-gray-700"
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
