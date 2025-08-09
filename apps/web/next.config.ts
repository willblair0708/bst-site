import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  // Disable ESLint during build to work around compatibility issues
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    // Force dynamic rendering - disabled for Turbopack compatibility
    // forceSwcTransforms: true,
  },
  async rewrites() {
    const apiBase = process.env.NEXT_PUBLIC_API_URL;
    // Avoid rewriting to self in local dev or when unset
    if (!apiBase || /localhost:3000$/i.test(apiBase)) {
      return [];
    }
    // Only proxy explicitly prefixed external API paths to avoid clobbering Next.js App Routes
    return [
      {
        source: '/external-api/:path*',
        destination: `${apiBase}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
