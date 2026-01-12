import { getProducts } from "@/lib/getProducts";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import ShopClient from "./ShopClient";

export default async function ShopPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login");
    }

    const products = await getProducts();

    return <ShopClient products={products} />;
}
