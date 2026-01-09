"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatMoney } from "@/lib/formatMoney";
import { OrderBreakDownProps } from "@/app/types";

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
                    <span className="text-gray-600">Subtotal</span>
                    <span>{formatMoney(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>{formatMoney(shippingFee)}</span>
                </div>
                <div className="flex justify-between">
                    <span className="text-gray-600">Tax (7%)</span>
                    <span>{formatMoney(tax)}</span>
                </div>

                <hr className="my-4" />

                <div className="flex justify-between font-medium text-base">
                    <span>Total</span>
                    <span>{formatMoney(total)}</span>
                </div>
            </div>
        </>
    );
}
