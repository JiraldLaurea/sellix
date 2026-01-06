export default function getStatusStyles(status: string) {
    switch (status) {
        case "PAID":
            return "bg-green-100 text-green-600 border-green-500";
        case "PENDING":
            return "bg-amber-100 text-amber-600 border-amber-500";
        case "FAILED":
        case "CANCELLED":
            return "bg-red-100 text-red-600 border-red-500";
        default:
            return "bg-gray-100 text-gray-600";
    }
}
