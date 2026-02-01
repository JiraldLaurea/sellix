import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
    const session = await getServerSession(authOptions);

    const user = session?.user;

    return <ProfileClient user={user} />;
}
