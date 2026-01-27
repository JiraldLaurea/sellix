import { getServerSession } from "next-auth";
import { authOptions } from "../../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import SignUpClient from "./SignupClient";

export default async function SignupPage() {
    const session = await getServerSession(authOptions);

    // 🔁 Redirect authenticated users
    if (session) {
        redirect("/");
    }

    return <SignUpClient />;
}
