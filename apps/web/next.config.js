/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/trpc/:path*",
        destination: "http://localhost:5001/trpc/:path*",
      },
      {
        source: "/openapi.json",
        destination: "http://localhost:5001/openapi.json",
      },
    ];
  },
};

export default nextConfig;
