/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
  async rewrites() {
    return [
      {
        // 1. When the frontend requests /api/auth/login...
        source: "/api/:path*",
        // 2. Next.js forwards it to YOUR_BACKEND_URL/auth/login
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`
      }
    ];
  },
  async redirects() {
    return [];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
      },
    ],
  },
};

export default nextConfig;
