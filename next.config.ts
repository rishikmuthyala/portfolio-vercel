import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Remove output: 'export' for Vercel deployment
  // Set the correct workspace root to avoid lockfile conflicts
  outputFileTracingRoot: path.join(__dirname),
  images: {
    domains: ['rishikmuthyala.xyz'], // Add your domain for image optimization
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors.
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
