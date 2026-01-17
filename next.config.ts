import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        formats: ["image/webp"], // remove AVIF
        minimumCacheTTL: 2678400, // 31 days
        qualities: [25, 50, 75, 100],
        remotePatterns: [
            {
                protocol: "https",
                hostname: "lh3.googleusercontent.com",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
            },
            {
                protocol: "https",
                hostname: "cdn.dummyjson.com",
            },
        ],
    },
};

export default nextConfig;
