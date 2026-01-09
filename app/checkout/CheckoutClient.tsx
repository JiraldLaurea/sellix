"use client";

import OrderBreakdown from "@/components/order/OrderBreakdown";
import PaymentForm from "@/components/PaymentForm";
import StripeProvider from "@/components/StripeProvider";
import { Button } from "@/components/ui/Button";
import { useCart } from "@/lib/cart-context";
import { formatMoney } from "@/lib/formatMoney";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { IoIosWarning } from "react-icons/io";
import { toast } from "sonner";

export default function CheckoutClient() {
    const { state } = useCart();
    const router = useRouter();

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [orderNumber, setOrderNumber] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    type PendingOrderItem = {
        id: string;
        name: string;
        price: number;
        quantity: number;
    };

    const [pendingOrder, setPendingOrder] = useState<string | null>(null);
    const [pendingItems, setPendingItems] = useState<PendingOrderItem[]>([]);
    const [pendingSubtotal, setPendingSubtotal] = useState<number>(0);
    const [pendingShipping, setPendingShipping] = useState<number>(0);
    const [pendingTax, setPendingTax] = useState<number>(0);
    const [pendingTotal, setPendingTotal] = useState<number>(0);
    const [cancelling, setCancelling] = useState(false);

    /* ======================================================
       Pricing (DISPLAY ONLY — server is source of truth)
    ====================================================== */
    const SHIPPING_FEE = 1500; // $15.00
    const TAX_RATE = 0.07;

    const subtotal = state.items.reduce(
        (sum: number, item) => sum + item.product.price * item.quantity,
        0
    );

    const tax = Math.round(subtotal * TAX_RATE);
    const total = subtotal + SHIPPING_FEE + tax;

    /* ======================================================
       Cancel Order
    ====================================================== */

    async function handleCancelOrder() {
        setCancelling(true);
        await fetch(`/api/orders/${pendingOrder}/cancel`, {
            method: "POST",
        });
        setPendingOrder(null);
        setPendingItems([]);
        setPendingTotal(0);
        setCancelling(false);
        toast.success("Order Cancelled Successfully");
    }

    /* ======================================================
       Checkout
    ====================================================== */
    async function handleCheckout() {
        if (loading) return;

        setLoading(true);
        setError(null);

        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Checkout failed");
            }

            const data = await res.json();

            if (data.hasPendingOrder) {
                setPendingOrder(data.orderNumber);

                const res = await fetch(`/api/orders/${data.orderNumber}`);
                const order = await res.json();

                setPendingItems(order.items);
                setPendingSubtotal(order.subtotal);
                setPendingShipping(order.shipping);
                setPendingTax(order.tax);
                setPendingTotal(order.total);

                setLoading(false);
                return;
            }

            setClientSecret(data.clientSecret);
            setOrderNumber(data.orderNumber);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong. Please try again."
            );
            setLoading(false);
        }
    }

    /* ======================================================
       Redirect if cart empty
    ====================================================== */
    useEffect(() => {
        if (state.items.length === 0 && !clientSecret) {
            router.replace("/cart");
        }
    }, [state.items.length, clientSecret, router]);

    if (state.items.length === 0 && !clientSecret) {
        return null;
    }

    /* ======================================================
       Pending order UI (unchanged)
    ====================================================== */
    if (pendingOrder) {
        return (
            <div className="w-full text-sm max-w-xl bg-white border p-8 rounded-lg space-y-6 my-8">
                <div>
                    <h1 className="text-2xl font-semibold mb-4">
                        Pending payment detected
                    </h1>
                    <div className="text-sm text-amber-600 space-x-2 bg-amber-100 px-4 py-3 rounded-lg flex items-center">
                        <IoIosWarning size={45} />

                        <p>
                            You have an unfinished payment with the following
                            items. You can continue payment or cancel and start
                            a new checkout.
                        </p>
                    </div>
                </div>

                <div className="border rounded-lg p-6">
                    <ul className="space-y-2">
                        {pendingItems.map((item) => (
                            <li key={item.id} className="flex justify-between">
                                <span>
                                    {item.name} x {item.quantity}
                                </span>
                                <span>
                                    {formatMoney(item.price * item.quantity)}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* PENDING Breakdown */}
                    <OrderBreakdown
                        subtotal={pendingSubtotal}
                        shippingFee={pendingShipping}
                        tax={pendingTax}
                        total={pendingTotal}
                    />
                </div>

                <div className="space-y-3">
                    <Button
                        disabled={cancelling || loading}
                        onClick={() => {
                            setLoading(true);
                            router.push(`/orders/${pendingOrder}/pay`);
                        }}
                    >
                        {loading ? "Preparing payment…" : "Proceed to Payment"}
                    </Button>
                    <Button
                        variant="secondary"
                        disabled={cancelling || loading}
                        onClick={handleCancelOrder}
                    >
                        {cancelling ? "Cancelling…" : "Cancel and Start New"}
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => router.push("/orders")}
                        disabled={cancelling || loading}
                    >
                        View Orders
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => router.push("/cart")}
                        disabled={cancelling || loading}
                    >
                        View Cart
                    </Button>
                </div>
            </div>
        );
    }

    /* ======================================================
       Checkout UI
    ====================================================== */
    return (
        <div className="w-full max-w-xl text-sm bg-white border p-8 rounded-lg my-8">
            {!clientSecret && (
                <>
                    <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

                    <ul className="space-y-2">
                        {state.items.map((item) => (
                            <li
                                key={item.product.id}
                                className="flex justify-between"
                            >
                                <span>
                                    {item.product.name} x {item.quantity}
                                </span>
                                <span>
                                    {formatMoney(
                                        item.product.price * item.quantity
                                    )}
                                </span>
                            </li>
                        ))}
                    </ul>

                    {/* Breakdown */}
                    <OrderBreakdown
                        subtotal={subtotal}
                        shippingFee={SHIPPING_FEE}
                        tax={tax}
                        total={total}
                    />

                    {error && (
                        <p className="mt-4 text-sm text-red-500">{error}</p>
                    )}

                    <Button
                        className="mt-4"
                        onClick={handleCheckout}
                        disabled={loading}
                    >
                        {loading ? "Preparing payment…" : "Proceed to Payment"}
                    </Button>
                </>
            )}

            {clientSecret && orderNumber && (
                <>
                    <h1 className="text-2xl font-semibold mb-6">Payment</h1>

                    <StripeProvider clientSecret={clientSecret}>
                        <PaymentForm orderNumber={orderNumber} />
                    </StripeProvider>
                </>
            )}
        </div>
    );
}
