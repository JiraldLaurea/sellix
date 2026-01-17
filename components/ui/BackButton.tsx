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
            className="flex items-center h-10 pr-4 space-x-1 text-blue-500 transition-colors cursor-pointer hover:underline w-fit"
        >
            <IoIosArrowBack size={20} />
            <p>{text}</p>
        </button>
        // <button
        //     onClick={() => {
        //         if (href) router.push(`${href}`);
        //         else router.back();
        //     }}
        //     className="flex items-center h-10 pl-2 pr-4 space-x-1 text-sm transition-colors border rounded-lg cursor-pointer w-fit hover:bg-gray-100"
        // >
        //     <IoIosArrowBack size={18} />
        //     <p>{text}</p>
        // </button>
    );
}
