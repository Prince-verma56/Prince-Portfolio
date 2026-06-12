import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker: produces a self-contained server in .next/standalone
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "https",
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
      },
    ],
  },
  allowedDevOrigins: ['192.168.1.11', 'localhost:3000', 'localhost:3001'],
  experimental: {
    // Tree-shake heavy libs — drastically reduces bundle size
    optimizePackageImports: ["gsap", "framer-motion", "lucide-react", "sonner"],
  },
};

export default nextConfig;
