export default function ProductCardSkeleton() {
    return (
        <div className="flex h-full flex-col overflow-hidden border animate-pulse">
            {/* Image */}
            <div className="aspect-square bg-gray-100 border-b" />

            {/* Info */}
            <div className="flex grow flex-col space-y-4 p-3 sm:p-4">
                <div className="space-y-2">
                    <div className="h-5 w-20 rounded bg-gray-200" />
                    <div className="h-5 w-full rounded bg-gray-200" />
                </div>

                <div className="mt-auto flex items-end justify-between">
                    <div className="h-7 w-20 rounded bg-gray-300" />
                    <div className="flex space-x-1">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded bg-gray-300" />
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded bg-gray-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}
