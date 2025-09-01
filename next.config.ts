// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Mantener simple. Sin rewrites para evitar loops.
  reactStrictMode: true,
  // (opcional) activa lo que ya usa tu proyecto
  experimental: {
    typedRoutes: true,
  },
};

export default nextConfig;