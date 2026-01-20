"use client";

import { Order } from "@/app/types";
import { Container } from "@/components/ui/Container";
import { Header } from "@/components/ui/Header";
import PageContainer from "@/components/ui/PageContainer";
import { formatMoney } from "@/lib/formatMoney";
import getStatusStyles from "@/lib/order/getStatusStyles";
import Link from "next/link";
import { useState } from "react";
import { LuPackage } from "react-icons/lu";

type Props = {
    orders: Order[];
    orderCount: number;
};

export default function OrdersClient({ orders }: Props) {
    const [activeStatus, setActiveStatus] = useState<"ALL" | string>("ALL");

    const statuses = [
        { key: "ALL", label: "All" },
        { key: "PAID", label: "Paid" },
        { key: "PENDING", label: "Pending" },
        { key: "CANCELLED", label: "Cancelled" },
    ];

    if (orders.length === 0) {
        return (
            <PageContainer className="p-0! -my-8 flex flex-col items-center justify-center text-center space-y-6">
                <div className="p-6 bg-gray-100 rounded-xl">
                    <LuPackage size={40} className="text-gray-500" />
                </div>

                <div>
                    <h1 className="mb-1 text-2xl font-semibold">
                        No orders yet
                    </h1>
                    <p className="text-gray-600">
                        You haven't processed an order yet
                    </p>
                </div>

                <Link
                    href="/"
                    className="flex items-center justify-center h-12 px-6 text-sm font-medium text-white transition rounded-lg bg-linear-to-t from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-500"
                >
                    Start shopping
                </Link>
            </PageContainer>
        );
    }

    const filteredOrders =
        activeStatus === "ALL"
            ? orders
            : orders.filter((o) => o.status === activeStatus);

    return (
        <section className="flex-1">
            <Header text="Orders" />

            <div className="space-y-0 overflow-hidden border divide-y rounded-xl">
                <div className="border-b">
                    <div className="grid grid-cols-4 text-xs divide-x sm:text-sm">
                        {statuses.map((s) => {
                            const count =
                                s.key === "ALL"
                                    ? orders.length
                                    : orders.filter((o) => o.status === s.key)
                                          .length;

                            const isActive = activeStatus === s.key;

                            return (
                                <button
                                    key={s.key}
                                    onClick={() => setActiveStatus(s.key)}
                                    className={`relative hover:bg-gray-50 transition-colors justify-center flex items-center gap-2 py-3 ${
                                        isActive
                                            ? "text-blue-500"
                                            : "text-gray-500 hover:text-gray-900"
                                    }`}
                                >
                                    <span>{s.label}</span>

                                    <span className="items-center justify-center hidden w-5 h-5 text-xs text-gray-700 border rounded-full md:flex">
                                        {count}
                                    </span>

                                    <span
                                        className={`absolute bottom-0 left-0 h-0.5 w-full bg-blue-500 transition-all ${
                                            isActive
                                                ? "opacity-100"
                                                : "opacity-0"
                                        }`}
                                    />
                                </button>
                            );
                        })}
                    </div>
                </div>

                {filteredOrders.length === 0 && activeStatus !== "ALL" ? (
                    <div className="h-23.25 flex items-center justify-center text-sm text-gray-500">
                        No {activeStatus.toLowerCase()} orders
                    </div>
                ) : (
                    filteredOrders.map((order) => (
                        <Link
                            key={order.id}
                            href={`/orders/${order.orderNumber}`}
                            className="block"
                        >
                            <Container className="w-full rounded-none! transition-colors px-3 sm:px-6 py-4 hover:bg-gray-50 flex items-center justify-between space-x-2 sm:space-x-4">
                                {/* LEFT */}
                                <div className="flex flex-col items-center px-3 py-2 text-gray-500 bg-gray-100 border rounded-xl">
                                    <span className="text-xs">
                                        {new Date(
                                            order.createdAt,
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                        })}
                                    </span>
                                    <span className="text-lg">
                                        {new Date(
                                            order.createdAt,
                                        ).toLocaleDateString("en-US", {
                                            day: "2-digit",
                                        })}
                                    </span>
                                </div>

                                {/* CENTER */}
                                <div className="text-sm grow">
                                    <p className="truncate">
                                        ORDER-{order.orderNumber}
                                    </p>
                                    <p className="text-gray-500">
                                        {order.items.length}{" "}
                                        {order.items.length === 1
                                            ? "Item"
                                            : "Items"}{" "}
                                        • {formatMoney(order.total)}
                                    </p>
                                </div>

                                {/* RIGHT */}
                                <div>
                                    <p
                                        className={`rounded-full px-3 border py-1 text-xs ${getStatusStyles(
                                            order.status,
                                        )}`}
                                    >
                                        {order.status.charAt(0).toUpperCase() +
                                            order.status.slice(1).toLowerCase()}
                                    </p>
                                </div>
                            </Container>
                        </Link>
                    ))
                )}
            </div>
        </section>
    );
}
