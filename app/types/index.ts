import { IconType } from "react-icons/lib";

export type Product = {
    id: string;
    name: string;
    price: number;
    description: string | null;
    stock: number;
    images: string[];
    categoryId: string; // ✅ foreign key
    category: Category; // ✅ relation
    createdAt: Date;
    updatedAt: Date;
};

export type Category = {
    id: string;
    name: string;
    image: string | null;
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
    removeTopBorder?: boolean;
};

export type MenuItemProps = {
    Icon: IconType;
    href: string;
    text: string;
    extraClassName?: string;
    onClick?: () => void;
};

export type CartItem = {
    id: string;
    quantity: number;
    product: {
        id: string;
        name: string;
        price: number;
        stock: number;
        images: string[];
    };
};

export type CartState = {
    items: CartItem[];
};

export type AddToCartResult = {
    success: boolean;
    reason?: "unauthorized" | "max_stock" | "unknown";
};
