// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Rewrites eliminados para evitar 508 INFINITE_LOOP:
  // El destino apuntaba al mismo dominio (myzproject.com) y entraba en bucle.
};

export default nextConfig;
