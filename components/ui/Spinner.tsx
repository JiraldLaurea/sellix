type BorderColor = "border-white" | "border-black";

type SpinnerProps = {
    borderColor?: BorderColor;
    className?: string;
};

export function Spinner({
    borderColor = "border-white",
    className,
}: SpinnerProps) {
    return (
        <div
            className={`${borderColor} ${className} w-4 h-4 border-2 rounded-full animate-spin border-t-transparent`}
        />
    );
}
