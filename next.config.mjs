import { PHASE_DEVELOPMENT_SERVER } from "next/constants.js";

const baseConfig = {
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

export default function nextConfig(phase) {
  return {
    ...baseConfig,
    // Keep dev output separate from production builds so a local `next build`
    // cannot invalidate the currently running dev asset manifest.
    distDir: phase === PHASE_DEVELOPMENT_SERVER ? ".next-dev" : ".next",
  };
}
