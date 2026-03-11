/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
      },
    ],
  },
  webpack: (config, { dev }) => {
    // Prevent stale chunk/module errors on Windows dev runs by disabling
    // persistent webpack filesystem cache in development.
    if (dev) {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
