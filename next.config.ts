import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // allow accessing the dev server from this machine's LAN IP (phone testing)
  allowedDevOrigins: ["192.168.1.113"],
};

export default nextConfig;
