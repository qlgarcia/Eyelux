import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Avoid blocking builds on ESLint for generated/vendor code
    ignoreDuringBuilds: true,
  },
  // Optimize for Vercel deployment
  serverExternalPackages: ['@prisma/client'],
  // Enable static optimization where possible
  output: 'standalone',
  // Optimize images
  images: {
  // allow external image hosts used by product images
  domains: ['res.cloudinary.com', 'images.ray-ban.com', 'www.oakley.com', 'oakley.com', 'www.warbyparker.com', 'warbyparker.com'],
    formats: ['image/webp', 'image/avif'],
  },
  // Environment variables for build time
  env: {
    DATABASE_URL: process.env.DATABASE_URL || "file:./dev.db",
  },
  // Ensure Turbopack uses the correct project root so it loads .env from this folder
  turbopack: {
    // Use the directory where this config lives (eyelux-next)
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
