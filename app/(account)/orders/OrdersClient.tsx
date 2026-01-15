"use client";

import { Order, OrderItem } from "@/app/types";
import { Container } from "@/components/ui/Container";
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
                        You haven't processed an order yet.
                    </p>
                </div>

                <Link
                    href="/"
                    className="px-6 text-sm h-12 flex items-center justify-center bg-linear-to-t font-medium from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-500 text-white transition rounded-lg"
                >
                    Start shopping
                </Link>
            </PageContainer>
        );
    }

    return (
        <section className="flex-1">
            <h1 className="mb-6 text-3xl font-semibold">Orders</h1>

            <div className="space-y-0 border rounded-xl divide-y overflow-hidden">
                <div className="border-b">
                    <div className="grid grid-cols-4 text-xs sm:text-sm divide-x">
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
                                    className={`relative hover:bg-gray-50 transition-colors justify-center flex items-center gap-2 py-4 ${
                                        isActive
                                            ? "text-blue-500"
                                            : "text-gray-500 hover:text-gray-900"
                                    }`}
                                >
                                    <span> {s.label}</span>
                                    <span
                                        className={`hidden sm:flex justify-center rounded-full w-5 items-center h-5 text-xs border text-gray-700
                                    `}
                                    >
                                        {count}
                                    </span>

                                    <span
                                        className={`absolute transition-all bottom-0 left-0 h-0.5 w-full bg-blue-500
                                        ${
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

                {orders
                    .filter((order) =>
                        activeStatus === "ALL"
                            ? true
                            : order.status === activeStatus
                    )
                    .map((order: Order) => (
                        <Link
                            key={order.id}
                            href={`/orders/${order.orderNumber}`}
                            className="block"
                        >
                            <Container className="w-full rounded-none! transition-colors px-3 sm:px-6 py-4 hover:bg-gray-50 flex items-center justify-between space-x-2 sm:space-x-4">
                                {/* LEFT */}
                                <div className="flex flex-col border items-center bg-gray-100 text-gray-500 px-3 py-2 rounded-xl">
                                    <span className="text-xs">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("en-US", {
                                            month: "short",
                                        })}
                                    </span>
                                    <span className="text-lg">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString("en-US", {
                                            day: "2-digit",
                                        })}
                                    </span>
                                </div>

                                {/* CENTER */}
                                <div className="grow text-sm">
                                    <div className="truncate">
                                        <p>ORDER-{order.orderNumber}</p>
                                    </div>
                                    <p className="text-gray-500">
                                        {order.items.length}{" "}
                                        {order.items.length === 1
                                            ? "Item"
                                            : "Items"}
                                        {" • "}
                                        {formatMoney(order.total)}
                                    </p>
                                </div>

                                {/* RIGHT */}
                                <div className="">
                                    <p
                                        className={`rounded-full px-3 border py-1 text-xs ${getStatusStyles(
                                            order.status
                                        )}`}
                                    >
                                        {order.status.charAt(0).toUpperCase() +
                                            order.status.slice(1).toLowerCase()}
                                    </p>
                                </div>
                            </Container>
                        </Link>
                    ))}
            </div>
        </section>
    );
}
