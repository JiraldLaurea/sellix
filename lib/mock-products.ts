export type Product = {
    id: string;
    name: string;
    price: number; // cents
    description: string;
    stock: number;
    images: string[]; // 👈 here
};

export const products: Product[] = [
    {
        id: "1",
        name: "Minimal Sneakers",
        price: 8900,
        description: "Clean, minimal sneakers designed for everyday wear.",
        stock: 12,
        images: [
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
        ],
    },

    {
        id: "2",
        name: "Classic Watch",
        price: 19900,
        description: "Timeless watch with a minimalist dial.",
        stock: 3,
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&auto=format&fit=crop",
        ],
    },

    {
        id: "3",
        name: "Minimal Sneakers",
        price: 8900,
        description: "Clean, minimal sneakers designed for everyday wear.",
        stock: 12,
        images: [
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
        ],
    },

    {
        id: "4",
        name: "Classic Watch",
        price: 19900,
        description: "Timeless watch with a minimalist dial.",
        stock: 0,
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&auto=format&fit=crop",
        ],
    },

    {
        id: "5",
        name: "Classic Watch",
        price: 19900,
        description: "Timeless watch with a minimalist dial.",
        stock: 0,
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&auto=format&fit=crop",
        ],
    },

    {
        id: "6",
        name: "Minimal Sneakers",
        price: 8900,
        description: "Clean, minimal sneakers designed for everyday wear.",
        stock: 12,
        images: [
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
        ],
    },

    {
        id: "7",
        name: "Classic Watch",
        price: 19900,
        description: "Timeless watch with a minimalist dial.",
        stock: 0,
        images: [
            "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503602642458-232111445657?w=800&auto=format&fit=crop",
        ],
    },

    {
        id: "8",
        name: "Minimal Sneakers",
        price: 8900,
        description: "Clean, minimal sneakers designed for everyday wear.",
        stock: 12,
        images: [
            "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop",
        ],
    },
];
