import { IoIosCheckmarkCircle, IoIosWarning } from "react-icons/io";

export const CustomToasterSuccess = (text: string, subtext?: string) => {
    return (
        <div className="cursor-pointer w-full border hover:bg-gray-100 transition-colors pb-1.25 font-inter space-x-1 px-3 h-18 flex items-center">
            <IoIosCheckmarkCircle size={30} className="text-black" />
            <div className="truncate">
                <p className={` text-black text-sm`}>{text}</p>
                {subtext && (
                    <p className="truncate text-neutral-500 text-xs">
                        {subtext}
                    </p>
                )}
            </div>
        </div>
    );
};

export const CustomToasterWarning = (text: string) => {
    return (
        <div className="w-full cursor-pointer hover:bg-amber-100 transition-colors font-inter px-3 h-18  border border-amber-100 bg-amber-50 space-x-1  pb-1.25 flex items-center text-sm">
            <IoIosWarning size={30} className="text-amber-500" />
            <div>
                <h3 className="text-amber-600">{text}</h3>
            </div>
        </div>
    );
};
