import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/service-offer/:path*',
        destination: 'https://myzproject.com/service-offer/:path*',
      },
      {
        source: '/posts/:path*',
        destination: 'https://myzproject.com/posts/:path*',
      }
    ];
  },
};

export default nextConfig;
