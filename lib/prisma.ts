import { PrismaNeon } from "@prisma/adapter-neon";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaClient } from "@/generated/prisma/client";
import ws from "ws";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

// PrismaNeon uses the Neon Pool over WebSockets. Node 20 and earlier have no global WebSocket
// (Vercel often defaults to Node 20), so the driver cannot connect without this. See @prisma/adapter-neon README.
neonConfig.webSocketConstructor = ws;

function createPrismaClient(): PrismaClient {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL is not set");
	}
	// Neon pooled URLs (PgBouncer transaction mode) break node-pg prepared statements.
	// Neon's serverless driver + this adapter is the supported path for serverless / Vercel.
	const adapter = new PrismaNeon({ connectionString });
	return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
