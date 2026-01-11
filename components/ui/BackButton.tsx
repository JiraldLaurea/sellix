import { useRouter } from "nextjs-toploader/app";
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
            className="flex items-center h-10 py-1 pl-2 pr-4 space-x-1 text-sm transition-colors border rounded-lg cursor-pointer w-fit hover:bg-gray-100"
        >
            <IoIosArrowBack size={18} />
            <p>{text}</p>
        </button>
    );
}
