"use client";

import { formatMoney } from "@/lib/formatMoney";
import getStatusStyles from "@/lib/order/getStatusStyles";
import Link from "next/link";

type Order = {
    id: string;
    orderNumber: string;
    status: string;
    total: number;
    createdAt: Date;
};

type Props = {
    orders: Order[];
    orderCount: number;
};

export default function OrdersClient({ orders, orderCount }: Props) {
    return (
        <section className="flex-1">
            <h1 className="mb-6 text-3xl font-semibold">My Orders</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <Link
                        key={order.id}
                        href={`/orders/${order.orderNumber}`}
                        className="block rounded-lg border p-3 sm:p-5 transition-colors hover:bg-gray-100"
                    >
                        <div className="grid grid-cols-[1fr_70px] sm:grid-cols-[1fr_100px_100px_100px] text-xs sm:text-sm items-center lg:gap-4">
                            <div className="truncate space-y-1">
                                <p className="font-medium truncate text-sm sm:text-base">
                                    #{order.orderNumber}
                                </p>
                                <div className="grid-cols-[60px_60px] gap-2 items-center grid">
                                    <p className="text-gray-500 text-left sm:hidden">
                                        {new Date(
                                            order.createdAt
                                        ).toLocaleDateString()}
                                    </p>
                                    <div className="flex justify-center">
                                        <p
                                            className={`sm:hidden rounded-full px-2 py-0.5 text-[10px] sm:text-xs ${getStatusStyles(
                                                order.status
                                            )}`}
                                        >
                                            {order.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                order.status
                                                    .slice(1)
                                                    .toLowerCase()}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <p className="text-gray-500 text-center hidden sm:block">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>

                            <div className="hidden sm:flex justify-center">
                                <p
                                    className={`rounded-full px-3 py-1 text-[10px] sm:text-xs ${getStatusStyles(
                                        order.status
                                    )}`}
                                >
                                    {order.status.charAt(0).toUpperCase() +
                                        order.status.slice(1).toLowerCase()}
                                </p>
                            </div>

                            <p className="font-medium text-right">
                                {formatMoney(order.total)}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}
