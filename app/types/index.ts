import { IconType } from "react-icons/lib";

export type Product = {
    id: string;
    name: string;
    price: number;
    description: string | null; // ✅ FIX
    stock: number;
    images: string[];
    createdAt: Date;
    updatedAt: Date;
};

export type OrderItem = {
    name: string;
    id: string;
    productId: string;
    quantity: number;
    orderId: string;
    price: number;
};

export type OrderBreakDownProps = {
    subtotal: number;
    shippingFee: number;
    tax: number;
    total: number;
};

export type MenuItemProps = {
    Icon: IconType;
    href: string;
    text: string;
    extraClassName?: string;
    onClick?: () => void;
};
