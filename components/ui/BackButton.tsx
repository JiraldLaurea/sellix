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
            className="flex items-center transition-colors cursor-pointer border rounded-lg px-3 h-10 hover:bg-gray-100 w-fit"
        >
            <div className="relative right-0.75 flex items-center space-x-1">
                <IoIosArrowBack size={20} />
                <p className="text-sm">{text}</p>
            </div>
        </button>
    );
}
