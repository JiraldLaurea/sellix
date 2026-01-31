"use client";

import { OrderItem } from "@/app/types";
import OrderBreakdown from "@/components/order/OrderBreakdown";
import PendingOrderActions from "@/components/order/PendingOrderActions";
import { BackButton } from "@/components/ui/BackButton";
import { Container } from "@/components/ui/Container";
import PageContainer from "@/components/ui/PageContainer";
import { formatMoney } from "@/lib/formatMoney";
import getStatusStyles from "@/lib/order/getStatusStyles";
import { Check } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import { PiDotsThreeCircle } from "react-icons/pi";
import { PiDotsThreeCircleFill } from "react-icons/pi";

export default function OrderDetailsClient({ order }: any) {
    return (
        <PageContainer className=" p-0! mx-0!">
            <div className="space-y-6">
                <BackButton
                    text="Orders"
                    href={`/orders#${order.orderNumber}`}
                />
                <div>
                    <h1 className="font-semibold sm:text-lg mb-3 sm:mb-4">
                        Order Details
                    </h1>

                    <div className="sm:rounded-xl sm:border bg-white sm:divide-y text-sm space-y-2 sm:space-y-0">
                        <div className="grid grid-cols-2 sm:py-3 px-0 sm:px-6">
                            <p className="text-gray-500">Order Number</p>
                            <p className=" text-right">{order.orderNumber}</p>
                        </div>
                        <div className="grid grid-cols-2 sm:py-3 px-0 sm:px-6 items-center">
                            <p className="text-gray-500">Date</p>
                            <p className="text-sm text-right">
                                {new Date(order.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                        month: "long",
                                        day: "2-digit",
                                        year: "numeric",
                                    },
                                )}
                            </p>
                        </div>
                        <div className="grid grid-cols-2 sm:py-3 px-0 sm:px-6">
                            <p className=" text-gray-500">Status</p>
                            <span
                                className={`inline-flex justify-self-end w-fit border items-center rounded-full px-2 py-0 text-xs ${getStatusStyles(
                                    order.status,
                                )}`}
                            >
                                {order.status.charAt(0) +
                                    order.status.slice(1).toLowerCase()}
                            </span>
                        </div>
                    </div>
                </div>
                <h1 className="font-semibold sm:text-lg mb-3 sm:mb-4">
                    Checkout Summary
                </h1>
                <Container className="w-full sm:p-6 sm:border">
                    <ul className="space-y-2">
                        {order.items.map((item: OrderItem) => (
                            <li
                                key={item.id}
                                className="flex justify-between text-sm"
                            >
                                <Link
                                    href={`/product/${item.productId}`}
                                    className="hover:underline"
                                >
                                    {item.quantity} x {item.name}
                                </Link>
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
                            className="flex bg-linear-to-t font-medium from-blue-600  to-blue-500 items-center justify-center w-full px-6 h-10 space-x-2 text-sm text-white transition-colors rounded-lg sm:w-fit hover:from-blue-700 hover:to-blue-500"
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
