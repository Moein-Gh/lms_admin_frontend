import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // Silence Turbopack error when using Webpack-based plugins like next-pwa
  turbopack: {},
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

export default withPWA(nextConfig);
