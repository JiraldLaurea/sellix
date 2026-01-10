import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

type Props = {
    text: string;
    hasHref?: boolean;
    href?: string;
};

export function BackButton({ text, hasHref, href }: Props) {
    const router = useRouter();

    return (
        <button
            onClick={() => {
                if (hasHref) router.push(`${href}`);
                else router.back();
            }}
            className="flex items-center h-10 py-1 pr-1 space-x-1 text-blue-500 rounded-lg cursor-pointer w-fit hover:underline"
        >
            <IoIosArrowBack size={20} />
            <p>{text}</p>
        </button>
    );
}
