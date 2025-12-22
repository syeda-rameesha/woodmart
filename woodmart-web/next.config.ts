// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow all remote image hosts you use in the app
    remotePatterns: [
      { protocol: "https", hostname: "files.catbox.moe" },     // product images
      { protocol: "https", hostname: "images.unsplash.com" },  // hero/category images
      { protocol: "https", hostname: "cdn11.bigcommerce.com" },// chair image you used
    ],
    // (optional) if you prefer the older style:
    // domains: ["files.catbox.moe", "images.unsplash.com", "cdn11.bigcommerce.com"],
  },

  // Rewrites: proxy any /api/* request to your backend server in dev
  // (Frontend code keeps calling /api/... and avoids cross-origin).
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "")}/:path*`
          : "woodmart-production.up.railway.app",
      },
    ];
  },
};

export default nextConfig;