import { useRouter } from "nextjs-toploader/app";
import { IoIosArrowBack } from "react-icons/io";

type Props = {
    text: string;
    href?: string;
};

export function BackButton({ text, href }: Props) {
    const router = useRouter();

    return (
        <button
            onClick={() => {
                if (href) router.push(`${href}`);
                else router.back();
            }}
            className="flex items-center relative right-1.5 space-x-1 text-blue-500 transition-colors cursor-pointer hover:underline w-fit"
        >
            <IoIosArrowBack size={20} />
            <p className="text-sm">{text}</p>
        </button>
    );
}
