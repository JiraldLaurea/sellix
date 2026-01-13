"use client";

import { OrderItem } from "@/app/types";
import OrderBreakdown from "@/components/order/OrderBreakdown";
import PendingOrderActions from "@/components/order/PendingOrderActions";
import { BackButton } from "@/components/ui/BackButton";
import { Container } from "@/components/ui/Container";
import PageContainer from "@/components/ui/PageContainer";
import { formatMoney } from "@/lib/formatMoney";
import getStatusStyles from "@/lib/order/getStatusStyles";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";

export default function OrderDetailsClient({ order }: any) {
    return (
        <PageContainer className=" p-0! mx-0!">
            <div className="space-y-6">
                <BackButton text="Orders" href="/orders" />
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className=" font-semibold sm:text-lg">
                            Order #{order.orderNumber}
                        </h1>{" "}
                        <p className="text-sm text-gray-500">
                            Placed on:{" "}
                            {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                    </div>

                    <span
                        className={`px-2 sm:px-3 py-1 text-sm rounded-full ${getStatusStyles(
                            order.status
                        )}`}
                    >
                        {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1).toLowerCase()}
                    </span>
                </div>
                <Container className="w-full sm:p-6 sm:border">
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
                <div className="flex items-center justify-end gap-4">
                    {order.status === "PAID" && order.receiptUrl && (
                        <Link
                            href={order.receiptUrl}
                            target="_blank"
                            className="flex items-center justify-center w-full px-6 h-12 space-x-2 text-sm text-white transition-colors bg-black rounded-md sm:w-fit hover:bg-neutral-700"
                        >
                            <p>View Stripe Receipt</p>
                            <FaArrowUpRightFromSquare />
                        </Link>
                    )}
                    {order.status === "PENDING" && (
                        <PendingOrderActions orderNumber={order.orderNumber} />
                    )}
                </div>
            </div>
        </PageContainer>
    );
}
