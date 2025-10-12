// next.config.ts
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: { ignoreDuringBuilds: true }, // ✅ never fail the build on ESLint
};

export default nextConfig;
