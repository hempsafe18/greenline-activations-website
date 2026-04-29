import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  eslint: {
    // Don't fail builds on lint warnings — admin UI ships fast.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
