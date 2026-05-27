/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/trpc/:path*",
        destination: "http://localhost:5001/trpc/:path*",
      },
      {
        source: "/docs",
        destination: "http://localhost:5001/docs",
      },
      {
        source: "/docs/:path*",
        destination: "http://localhost:5001/docs/:path*",
      },
      {
        source: "/openapi.json",
        destination: "http://localhost:5001/openapi.json",
      },
    ];
  },
};

export default nextConfig;
