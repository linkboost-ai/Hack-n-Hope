import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  devIndicators: {
    buildActivity: false,
    buildActivityPosition: "bottom-right"
  },
  onError: () => {
    // This prevents the error overlay from appearing
  }
};

export default nextConfig;
