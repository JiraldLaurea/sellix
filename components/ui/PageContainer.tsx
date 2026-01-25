export default function PageContainer({
    children,
    className = "",
}: {
    children: React.ReactNode;
    className?: string;
}) {
    return (
        // flex flex-col items-center justify-center text-center space-y-6
        <div
            className={`container max-w-7xl px-4 sm:px-6 mx-auto min-h-[calc(100vh-64px)] py-6 ${className}`}
        >
            {children}
        </div>
    );
}
