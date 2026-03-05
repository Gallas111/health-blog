import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  images: {
    unoptimized: true,
  },
  async redirects() {
    try {
      const redirects = require('./redirects.json');
      return redirects;
    } catch (error) {
      console.warn('⚠️ redirects.json not found, skipping redirects.');
      return [];
    }
  },
};

export default nextConfig;
