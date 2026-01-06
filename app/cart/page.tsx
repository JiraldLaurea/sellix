import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import CartClient from "./CartClient";
import { cookies } from "next/headers";

export default async function CartPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        redirect("/login");
    }

    const cookieHeader = (await cookies())
        .getAll()
        .map((c) => `${c.name}=${c.value}`)
        .join("; ");

    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/cart`, {
        cache: "no-store",
        headers: {
            cookie: cookieHeader,
        },
    });

    const cart = await res.json();

    return <CartClient cart={cart} />;
}
