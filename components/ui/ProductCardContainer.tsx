export default function ProductCardContainer({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        <div
            className={`${className} grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3 lg:grid-cols-4`}
        >
            {children}
        </div>
    );
}
