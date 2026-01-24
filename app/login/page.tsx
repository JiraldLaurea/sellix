import { getServerSession } from "next-auth";
import LoginClient from "./LoginClient";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function LoginPage() {
    const session = await getServerSession(authOptions);

    // 🔁 Redirect authenticated users
    if (session) {
        redirect("/");
    }

    return <LoginClient />;
}
