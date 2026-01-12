export default function Loading() {
    return (
        <div className="flex items-center justify-center">
            <section className="py-8 px-4 grid gap-8 md:grid-cols-2 animate-pulse w-full max-w-6xl">
                <div className="aspect-square bg-gray-200 rounded-lg" />

                <div className="space-y-4">
                    <div className="h-6 w-2/3 bg-gray-200 rounded" />
                    <div className="h-5 w-1/4 bg-gray-200 rounded" />
                    <div className="h-4 w-full bg-gray-200 rounded" />
                    <div className="h-4 w-5/6 bg-gray-200 rounded" />

                    <div className="flex gap-4 pt-4">
                        <div className="h-10 w-20 bg-gray-200 rounded" />
                        <div className="h-10 flex-1 bg-gray-200 rounded" />
                    </div>
                </div>
            </section>
        </div>
    );
}
