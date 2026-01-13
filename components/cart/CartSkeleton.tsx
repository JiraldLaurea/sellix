export default function CartSkeleton() {
    return (
        <div className="animate-pulse">
            {/* Back button */}
            <div className="h-10 w-20 bg-gray-200 rounded-lg" />

            <div className="flex flex-col gap-6 mt-4 lg:flex-row">
                {/* LEFT: ITEMS */}
                <div className="grow">
                    {/* Header row */}
                    <div className="flex items-center justify-between mb-2">
                        {/* Cart title */}
                        <div className="h-8 w-36 bg-gray-200 rounded" />
                        {/* Clear cart */}
                        <div className="h-12 w-32 bg-gray-200 rounded-lg" />
                    </div>

                    {/* Items */}
                    <div className="divide-y">
                        {[1, 2].map((i) => (
                            <div
                                key={i}
                                className="grid grid-cols-[120px_1fr] sm:grid-cols-[160px_1fr] gap-y-2 gap-x-4 py-6 items-center"
                            >
                                {/* Image + Qty */}
                                <div className="space-y-4">
                                    <div className="bg-gray-200 sm:w-40 sm:h-40 w-30 h-30" />
                                    <div className="flex justify-center">
                                        <div className="h-10 w-28 bg-gray-200 rounded-full" />
                                    </div>
                                </div>

                                {/* Product info */}
                                <div className="flex flex-col justify-start h-full pt-2 space-y-4 sm:flex-row sm:space-x-4">
                                    {/* Name + price */}
                                    <div className="space-y-2 grow">
                                        <div className="h-5 w-64 bg-gray-200 rounded" />
                                        <div className="h-4 w-24 bg-gray-200 rounded" />
                                    </div>

                                    {/* Subtotal + remove (matches real placement) */}
                                    <div className="flex flex-row items-end justify-between sm:flex-col sm:items-end grow">
                                        {/* Subtotal */}
                                        <div className="h-6 w-24 bg-gray-200 rounded sm:mb-2" />
                                        {/* Trash */}
                                        <div className="h-10 w-10 bg-gray-200 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT: SUMMARY */}
                <div className="p-4 border rounded-lg lg:max-w-sm sm:p-6 h-fit w-full">
                    <div className="h-7 w-28 bg-gray-200 rounded mb-4" />

                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between">
                                <div className="h-4 w-20 bg-gray-200 rounded" />
                                <div className="h-4 w-16 bg-gray-200 rounded" />
                            </div>
                        ))}
                    </div>

                    <hr className="my-6" />

                    <div className="flex justify-between">
                        <div className="h-4 w-8 bg-gray-200 rounded" />
                        <div className="h-4 w-14 bg-gray-200 rounded" />
                    </div>

                    <div className="h-11 w-full bg-gray-200 rounded-lg mt-4" />
                </div>
            </div>
        </div>
    );
}
