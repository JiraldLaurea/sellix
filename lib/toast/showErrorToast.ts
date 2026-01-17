import { CustomToasterError } from "@/components/ui/CustomToaster";
import { toast, ToastOptions } from "react-toastify";

export function showErrorToast(
    title: string,
    description?: string,
    options?: ToastOptions,
) {
    toast.error(CustomToasterError(title, description), {
        closeButton: false,
        icon: false,
        ...options,
    });
}
