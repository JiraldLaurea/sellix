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
        name: "Leather Backpack",
        price: 14900,
        description: "Premium leather backpack for work and travel.",
        stock: 7,
        images: [
            "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1598970434795-0c54fe7c0648?auto=format&fit=crop&w=800&q=80",
        ],
    },
    {
        id: "4",
        name: "Wireless Headphones",
        price: 12900,
        description: "Noise-cancelling wireless headphones with deep bass.",
        stock: 15,
        images: [
            "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
        ],
    },
    {
        id: "5",
        name: "Ceramic Coffee Mug",
        price: 2900,
        description: "Handcrafted ceramic mug for your daily coffee ritual.",
        stock: 25,
        images: [
            "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517685352821-92cf88aee5a5?w=800&auto=format&fit=crop",
        ],
    },
    {
        id: "6",
        name: "Desk Lamp",
        price: 5900,
        description: "Modern desk lamp with adjustable brightness.",
        stock: 10,
        images: [
            "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?w=800&auto=format&fit=crop",
        ],
    },
    {
        id: "7",
        name: "Fitness Tracker",
        price: 9900,
        description: "Track your activity, sleep, and heart rate.",
        stock: 18,
        images: [
            "https://images.unsplash.com/photo-1576243345690-4e4b79b63288?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1557825835-70d97c4aa567?auto=format&fit=crop&w=800&q=80",
        ],
    },

    {
        id: "8",
        name: "Sunglasses",
        price: 7900,
        description: "UV-protected sunglasses with a sleek design.",
        stock: 20,
        images: [
            "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop",
        ],
    },
    {
        id: "9",
        name: "Notebook Journal",
        price: 1900,
        description: "Hardcover notebook for notes and ideas.",
        stock: 40,
        images: [
            "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=800&q=80",
        ],
    },

    {
        id: "10",
        name: "Reusable Water Bottle",
        price: 3900,
        description: "Insulated stainless steel water bottle.",
        stock: 30,
        images: [
            "https://images.unsplash.com/photo-1523362628745-0c100150b504?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?auto=format&fit=crop&w=800&q=80",
        ],
    },
];
