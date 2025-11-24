import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image configuration for Cloudinary
  images: {
    domains: ['res.cloudinary.com'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
  
  // Environment variables exposed to client
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    APP_NAME: process.env.APP_NAME || 'FinMan',
  },
};

export default nextConfig;
