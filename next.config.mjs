import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true
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
        // Admin routes: /api/admin/* -> YOUR_BACKEND_URL/admin/*
        source: "/api/admin/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/admin/:path*`
      },
      {
        // User routes: /api/user/* -> YOUR_BACKEND_URL/user/*
        source: "/api/user/:path*",
        destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/:path*`
      },
      {
        // Other routes (e.g., /api/auth/*) -> YOUR_BACKEND_URL/*
        source: "/api/:path*",
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
        hostname: "utfs.io"
      }
    ]
  }
};

export default withPWA(nextConfig);
