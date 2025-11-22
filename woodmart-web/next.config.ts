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
};

export default nextConfig;