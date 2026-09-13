import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel-optimized configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.firebasestorage.app',
      },
    ],
  },
  // Production optimizations
  swcMinify: true,
  compress: true,
  poweredByHeader: false,
  
  // TypeScript strict mode
  typescript: {
    tsconfigPath: "./tsconfig.json",
  },
};

export default nextConfig;
