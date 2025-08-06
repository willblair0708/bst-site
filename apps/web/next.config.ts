import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Disable ESLint during build to work around compatibility issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Force dynamic rendering
    forceSwcTransforms: true,
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
