import { Session } from "next-auth";
import Image from "next/image";

type Props = {
    session: Session | null;
    hasDefaultCursor?: boolean;
};

const Avatar = ({ session, hasDefaultCursor }: Props) => {
    return (
        <Image
            src={session?.user?.image ?? "/img/avatar_placeholder.jpg"}
            width={40}
            height={40}
            alt="Avatar"
            className={`rounded-full  ${
                session?.user.image === undefined && "border"
            } ${hasDefaultCursor ? "cursor-default" : "cursor-pointer"}`}
        />
    );
};

export default Avatar;
