import { Product } from "@/lib/mock-products";

type CartItem = {
    product: Product;
    quantity: number;
};

export function getRemainingStock(product: Product, items: CartItem[]) {
    const inCart =
        items.find((item) => item.product.id === product.id)?.quantity ?? 0;

    return Math.max(0, product.stock - inCart);
}
