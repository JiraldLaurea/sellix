"use client";

import { showSuccessToast } from "@/lib/toast/showSuccessToast";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { MdCameraAlt } from "react-icons/md";

export default function ProfilePage() {
    const { data, status } = useSession();
    const fileRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    if (status === "loading") {
        return <p className="py-16 text-center">Loading…</p>;
    }

    const user = data?.user;

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreview(url);

        showSuccessToast("Photo Changed Successfully");

        // TODO:
        // upload to server / S3 / Cloudinary
    }

    return (
        <section>
            <h1 className="mb-6 text-3xl font-semibold">Profile</h1>

            <div className="rounded-xl border bg-white p-6">
                <div className="flex sm:flex-row flex-col gap-4 items-center justify-between">
                    {/* Left: Profile info */}
                    <div className="flex sm:flex-row flex-col items-center gap-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-full border bg-gray-100">
                            {preview || user?.image ? (
                                <Image
                                    src={preview || user!.image!}
                                    alt="Profile image"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-xl font-semibold text-gray-400">
                                    {user?.email?.[0]?.toUpperCase()}
                                </div>
                            )}
                        </div>

                        <div className="text-center sm:text-left">
                            <p className="text-lg font-medium">
                                {user?.name || "Unnamed User"}
                            </p>
                            <p className="text-sm text-gray-500">
                                {user?.email}
                            </p>
                        </div>
                    </div>

                    {/* Right: Change photo button */}
                    <button
                        onClick={() => fileRef.current?.click()}
                        className="bg-linear-to-t font-medium from-blue-600  to-blue-500 flex sm:w-fit w-full justify-center items-center text-white gap-2 transition-colors rounded-lg border px-4 h-10 text-sm hover:from-blue-700 hover:to-blue-500"
                    >
                        <MdCameraAlt className="h-4 w-4" />
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
                        <span>{user?.id}</span>
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
