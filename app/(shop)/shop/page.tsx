import { getProducts } from "@/lib/getProducts";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
    const { items, nextCursor } = await getProducts();

    return <ShopClient initialProducts={items} initialCursor={nextCursor} />;
}
