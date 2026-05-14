import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
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
