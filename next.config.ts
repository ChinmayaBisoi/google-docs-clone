import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Native WebSocket impl used by Neon’s serverless driver (via `ws` in lib/prisma.ts)
	serverExternalPackages: ["ws"],
};

export default nextConfig;
