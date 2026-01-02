import Link from "next/link";

export default function OrderSuccessPage() {
    return (
        <section className="min-h-[calc(100vh-64px)] flex items-center justify-center">
            <div className="max-w-md text-center space-y-6">
                <div className="text-5xl">✅</div>

                <h1 className="text-2xl font-semibold">Order confirmed</h1>

                <p className="text-gray-600">
                    Thank you for your purchase. Your order has been placed
                    successfully.
                </p>

                <p className="text-sm text-gray-500">
                    A confirmation email will be sent to you shortly.
                </p>

                <div className="flex flex-col gap-3 pt-4">
                    <Link
                        href="/"
                        className="rounded-md bg-black py-3 text-white hover:bg-gray-800 transition"
                    >
                        Continue shopping
                    </Link>

                    <Link
                        href="/account/orders"
                        className="text-sm text-gray-600 hover:underline"
                    >
                        View your orders
                    </Link>
                </div>
            </div>
        </section>
    );
}
