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
