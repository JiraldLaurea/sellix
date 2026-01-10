import { Session } from "next-auth";
import Image from "next/image";

type AvatarProps = {
    session: Session | null;
    hasDefaultCursor?: boolean;
    width: number;
    height: number;
};

const Avatar = ({ session, hasDefaultCursor, width, height }: AvatarProps) => {
    return (
        <Image
            src={session?.user?.image ?? "/img/avatar_placeholder.jpg"}
            width={width}
            height={height}
            alt="Avatar"
            className={`rounded-full border  ${
                session?.user.image === undefined && "border"
            } ${hasDefaultCursor ? "cursor-default" : "cursor-pointer"}`}
        />
    );
};

export default Avatar;
