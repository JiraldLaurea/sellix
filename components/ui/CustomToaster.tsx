import {
    IoIosAlert,
    IoIosCheckmarkCircle,
    IoIosCloseCircle,
    IoIosInformationCircle,
    IoIosWarning,
} from "react-icons/io";
import { MdError } from "react-icons/md";

export const CustomToasterSuccess = (text: string, subtext?: string) => {
    return (
        <div className="cursor-pointer w-full border hover:bg-gray-100 transition-colors pb-1.25 font-inter space-x-1 px-3 h-18 flex items-center">
            <IoIosInformationCircle  size={30} className="text-blue-500" />
            <div className="truncate">
                <p className={`text-black text-sm`}>{text}</p>
                {subtext && (
                    <p className="text-xs truncate text-neutral-500">
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

export const CustomToasterError = (text: string, subtext?: string) => {
    return (
        <div className="w-full cursor-pointer hover:bg-red-100 transition-colors font-inter px-3 h-18  border border-red-100 bg-red-50 space-x-1  pb-1.25 flex items-center text-sm">
            <MdError  size={30} className="text-red-500" />
            <div className="truncate">
                <p className={` text-red-500 text-sm`}>{text}</p>
                {subtext && (
                    <p className="text-xs text-red-400 truncate">{subtext}</p>
                )}
            </div>
        </div>
    );
};
