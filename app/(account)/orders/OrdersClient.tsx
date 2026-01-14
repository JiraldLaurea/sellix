"use client";

import { Order, OrderItem } from "@/app/types";
import { Container } from "@/components/ui/Container";
import PageContainer from "@/components/ui/PageContainer";
import { formatMoney } from "@/lib/formatMoney";
import getStatusStyles from "@/lib/order/getStatusStyles";
import Link from "next/link";
import { HiOutlineTrash } from "react-icons/hi2";

type Props = {
    orders: Order[];
    orderCount: number;
};

export default function OrdersClient({ orders }: Props) {
    if (orders.length === 0) {
        return (
            <PageContainer className="p-0! -my-8 flex flex-col items-center justify-center text-center space-y-6">
                <div className="p-6 bg-gray-100 rounded-lg">
                    <HiOutlineTrash size={40} className="text-gray-500" />
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
                    className="px-6 py-3 text-white transition rounded-md bg-accent hover:bg-neutral-700"
                >
                    Start shopping
                </Link>
            </PageContainer>
        );
    }

    return (
        <section className="flex-1">
            <h1 className="mb-6 text-3xl font-semibold">Orders</h1>

            <div className="space-y-4">
                {orders.map((order: Order) => (
                    <Link
                        key={order.id}
                        href={`/orders/${order.orderNumber}`}
                        className="block"
                    >
                        <Container className="w-full p-4 transition-colors border sm:p-6 hover:bg-gray-50 space-y-2">
                            <div className="flex items-center justify-between">
                                <div className="truncate sm:text-base text-sm">
                                    <p className="font-medium truncate">
                                        Order #{order.orderNumber}
                                    </p>
                                </div>

                                <div className="text-right text-sm sm:text-base">
                                    <p className="font-medium">
                                        {formatMoney(order.total)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <p className="text-xs sm:text-sm text-gray-500">
                                    {new Date(
                                        order.createdAt
                                    ).toLocaleDateString()}
                                </p>

                                <div>
                                    <p
                                        className={`rounded-full px-3 py-1 text-[10px] sm:text-xs ${getStatusStyles(
                                            order.status
                                        )}`}
                                    >
                                        {order.status.charAt(0).toUpperCase() +
                                            order.status.slice(1).toLowerCase()}
                                    </p>
                                </div>
                            </div>

                            <ul className="text-xs sm:text-sm text-gray-500">
                                {order.items.map((item: OrderItem) => (
                                    <li key={item.id}>
                                        {item.quantity} x {item.name}
                                    </li>
                                ))}
                            </ul>
                        </Container>
                    </Link>
                ))}
            </div>

            {/* <div className="space-y-4">
                {orders.map((order) => (
                    <Link
                        key={order.id}
                        href={`/orders/${order.orderNumber}`}
                        className="block rounded-lg border p-3 sm:p-5 transition-colors hover:bg-gray-100"
                    >
                        <div className="grid grid-cols-[1fr_80px_80px_100px] text-xs sm:text-sm items-center lg:gap-4">
                            <div className="truncate">
                                <p className="font-medium truncate text-sm sm:text-base">
                                    #{order.orderNumber}
                                </p>
                            </div>

                            <p className="text-gray-500 text-center">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </p>

                            <div className="flex justify-center">
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
            </div> */}
        </section>
    );
}
