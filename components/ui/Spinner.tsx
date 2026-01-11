type BorderColor = "border-white" | "border-black";

type SpinnerProps = {
    borderColor?: BorderColor;
};

export function Spinner({ borderColor = "border-white" }: SpinnerProps) {
    return (
        <div
            className={`${borderColor} w-4 h-4 border-2 rounded-full animate-spin border-t-transparent`}
        />
    );
}
