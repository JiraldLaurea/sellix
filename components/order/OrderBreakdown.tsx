"use client";

import { OrderBreakDownProps } from "@/app/types";
import { formatMoney } from "@/lib/formatMoney";

export default function OrderBreakdown({
    subtotal,
    shippingFee,
    tax,
    total,
    removeTopBorder,
}: OrderBreakDownProps) {
    return (
        <>
            {!removeTopBorder && <hr className="my-4" />}
            <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                    <span className="text-gray-500">Subtotal</span>
                    <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Shipping</span>
                    <span>{formatMoney(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-500">Tax (7%)</span>
                    <span>{formatMoney(tax)}</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between font-semibold">
                    <span>Grand Total</span>
                    <span>{formatMoney(total)}</span>
                </div>
            </div>
        </>
    );
}
