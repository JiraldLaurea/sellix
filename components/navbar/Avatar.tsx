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
        <>
            {session?.user?.image ? (
                <Image
                    src={session?.user?.image ?? "/img/avatar_placeholder.jpg"}
                    width={width}
                    height={height}
                    alt="Avatar"
                    className={`rounded-full ${
                        session?.user.image === undefined && "border"
                    } ${hasDefaultCursor ? "cursor-default" : "cursor-pointer"}`}
                />
            ) : (
                <div className="flex items-center justify-center text-xl w-10 h-10 bg-gray-100 border rounded-full font-semibold text-gray-400">
                    {session?.user?.email?.[0]?.toUpperCase()}
                </div>
            )}
        </>
    );
};

export default Avatar;
