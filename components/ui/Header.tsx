type HeaderProps = {
    text: string;
    className?: string;
};

export function Header({ text, className }: HeaderProps) {
    return (
        <h1
            className={`mb-4 sm:mb-6 text-xl sm:text-3xl font-semibold ${className}`}
        >
            {text}
        </h1>
    );
}
