import { IoIosCheckmarkCircle, IoIosWarning } from "react-icons/io";

export const CustomToasterSuccess = (text: string, productName?: string) => {
    return (
        <div className="cursor-pointer w-full hover:bg-gray-100 transition-colors font-inter rounded-lg h-full border  space-x-2 px-3 pb-4 pt-3 flex items-center text-sm">
            <IoIosCheckmarkCircle size={32} className="text-black" />
            <div className="truncate ">
                <h3 className={`text-black`}>{text}</h3>
                {productName && (
                    <p className="truncate text-gray-500">{productName}</p>
                )}
            </div>
        </div>
    );
};

export const CustomToasterWarning = (text: string) => {
    return (
        <div className="w-full cursor-pointer hover:bg-amber-100 transition-colors font-inter rounded-lg h-full border border-amber-100 bg-amber-50 space-x-2 px-3 pb-4 pt-3 flex items-center text-sm">
            <IoIosWarning size={32} className="text-amber-500" />
            <div>
                <h3 className="text-amber-600">{text}</h3>
            </div>
        </div>
    );
};
