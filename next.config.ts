import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    // 本機 dev 不 redirect，方便編輯首頁；線上維持導向 /google-sheets-tutorial
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/",
        destination: "/google-sheets-tutorial",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
