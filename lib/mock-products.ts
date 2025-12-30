export type Product = {
    id: string;
    name: string;
    price: number; // cents
    imageUrl: string;
};

export const products: Product[] = [
    {
        id: "1",
        name: "Minimal Sneakers",
        price: 8900,
        imageUrl:
            "https://images.unsplash.com/photo-1528701800489-20be3c1ea2b4",
    },
    {
        id: "2",
        name: "Leather Backpack",
        price: 12900,
        imageUrl: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa",
    },
    {
        id: "3",
        name: "Classic Watch",
        price: 19900,
        imageUrl:
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    },
];
