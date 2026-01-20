import { useRouter } from "nextjs-toploader/app";
import { FaAngleLeft } from "react-icons/fa6";
import { IoIosArrowBack, IoIosArrowRoundBack } from "react-icons/io";
import { IoArrowBack, IoArrowBackOutline, IoChevronBack } from "react-icons/io5";
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
            className="flex items-center relative right-0.5 space-x-1 text-blue-500 transition-colors cursor-pointer hover:underline w-fit"
        >
            <IoArrowBack  size={20} />
            <p className="text-sm">{text}</p>
        </button>
    );
}
