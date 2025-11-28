/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
  async redirects() {
    // No custom redirects needed here — avoid self-redirect loops
    return [];
  }
};

export default nextConfig;
