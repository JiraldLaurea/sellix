import { useSession } from "next-auth/react";
import ProfileClient from "./ProfileClient";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    const user = session?.user;

    return <ProfileClient user={user} />;
}
