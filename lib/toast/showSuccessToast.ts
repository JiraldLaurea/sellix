import { CustomToasterSuccess } from "@/components/ui/CustomToaster";
import { toast, ToastOptions } from "react-toastify";

export function showSuccessToast(
    title: string,
    description?: string,
    options?: ToastOptions
) {
    toast.success(CustomToasterSuccess(title, description), {
        closeButton: false,
        icon: false,
        ...options,
    });
}
