"use client";

import { showSuccessToast } from "@/lib/toast/showSuccessToast";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { MdCameraAlt } from "react-icons/md";

export default function ProfileClient({ user }: { user: any }) {
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreview(url);

        showSuccessToast("Photo Changed Successfully");
    }

    return (
        <section>
            <h1 className="mb-6 text-3xl font-semibold">Profile</h1>

            <div className="p-6 bg-white border rounded-xl">
                <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                    {/* Left: Profile info */}
                    <div className="flex flex-col items-center gap-4 sm:flex-row">
                        <div className="relative w-20 h-20 overflow-hidden bg-gray-100 border rounded-full">
                            {preview || user?.image ? (
                                <Image
                                    src={preview || user!.image!}
                                    alt="Profile image"
                                    fill
                                    sizes="(max-width: 768px) 100vw, 100vw"
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-xl font-semibold text-gray-400">
                                    {user.email?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">
                                {user.name || "Unnamed User"}
                            </p>
                            <p className="text-sm text-gray-500">
                                {user.email}
                            </p>
                        </div>
                    </div>

                    {/* Right: Change photo button */}
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="flex items-center justify-center w-full h-10 gap-2 px-4 text-sm font-medium text-white transition-colors border rounded-lg bg-linear-to-t from-blue-600 to-blue-500 sm:w-fit hover:from-blue-700 hover:to-blue-500"
                    >
                        <MdCameraAlt className="w-4 h-4" />
                        Change photo
                    </button>

                    <input
                        ref={fileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                </div>

                <hr className="my-6" />

                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-500">User ID</span>
                        <span>{user.id}</span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500">Account Type</span>
                        <span>Customer</span>
                    </div>
                </div>
            </div>
        </section>
    );
}
