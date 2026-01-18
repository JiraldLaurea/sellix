import { useRouter } from "nextjs-toploader/app";
import { FaAngleLeft } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { IoArrowBack, IoChevronBack } from "react-icons/io5";
import {
    MdOutlineArrowBackIos,
    MdOutlineArrowBackIosNew,
} from "react-icons/md";

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
            className="flex items-center h-10 pr-4 relative right-1.5 space-x-1 text-blue-500 transition-colors cursor-pointer hover:underline w-fit"
        >
            <IoChevronBack size={20} className="" />
            <p>{text}</p>
        </button>
    );
}
