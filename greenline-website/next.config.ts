import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "greenlineactivations.com" }],
        destination: "https://www.greenlineactivations.com/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
