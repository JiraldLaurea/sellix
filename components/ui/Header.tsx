type HeaderProps = {
    text: string;
};

export function Header({ text }: HeaderProps) {
    return (
        <h1 className="mb-4 sm:mb-6 text-2xl sm:text-3xl font-semibold">
            {text}
        </h1>
    );
}
