import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  transpilePackages: ['three'],
  experimental: {
    optimizePackageImports: ['@react-three/drei', 'gsap', 'lucide-react'],
  },
};

export default nextConfig;
