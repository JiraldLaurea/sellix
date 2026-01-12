import { CustomToasterWarning } from "@/components/ui/CustomToaster";
import { toast, ToastOptions } from "react-toastify";

export function showWarningToast(message: string, options?: ToastOptions) {
    toast.warning(CustomToasterWarning(message), {
        closeButton: false,
        icon: false,
        ...options,
    });
}
