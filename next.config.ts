import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: false },
  eslint: { ignoreDuringBuilds: false },
  // Argos no hotlinkea imágenes de LinkedIn (§15). Cuando exista el proxy de
  // fotos se agrega aquí su dominio propio, nunca el CDN de LinkedIn.
  images: { remotePatterns: [] },
};

export default nextConfig;
