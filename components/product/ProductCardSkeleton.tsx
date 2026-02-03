export default function ProductCardSkeleton() {
    return (
        <div className="flex h-full flex-col rounded-xl overflow-hidden border animate-pulse">
            {/* Image */}
            <div className="aspect-square bg-gray-100 border-b" />

            {/* Info */}
            <div className="flex flex-col p-3 space-y-6 sm:p-4 grow">
                <div className="space-y-2">
                    <div className="h-4 w-20 rounded bg-gray-200" />
                    <div className="h-4 w-full rounded bg-gray-200" />
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="h-6 w-20 rounded bg-gray-300" />
                    <div className="flex justify-end space-x-1">
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded bg-gray-300" />
                        <div className="h-9 w-9 sm:h-10 sm:w-10 rounded bg-gray-300" />
                    </div>
                </div>
            </div>
        </div>
    );
}
