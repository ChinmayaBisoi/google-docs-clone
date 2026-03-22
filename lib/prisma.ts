import { PrismaNeonHttp } from "@prisma/adapter-neon";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL is not set");
	}
	// Neon pooled URLs break node-pg; WebSocket Pool + `ws` is flaky on Vercel serverless.
	// HTTP driver uses fetch() only (works reliably on Vercel). Interactive $transaction(fn) is unsupported.
	const adapter = new PrismaNeonHttp(connectionString, {});
	return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

globalForPrisma.prisma = prisma;
