import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

type Props = {
    text: string;
};

export function BackButton({ text }: Props) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            className="flex items-center h-10 pl-3.5 pr-5 space-x-1 text-sm transition-colors mb-6 border rounded-lg cursor-pointer hover:bg-gray-100 w-fit"
        >
            <IoIosArrowBack size={18} />
            <p>{text}</p>
        </button>
    );
}
