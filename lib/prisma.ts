import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClient | undefined;
	pool: Pool | undefined;
};

function createPrismaClient(): PrismaClient {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL is not set");
	}
	if (!globalForPrisma.pool) {
		globalForPrisma.pool = new Pool({ connectionString });
	}
	const adapter = new PrismaPg(globalForPrisma.pool);
	return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
	globalForPrisma.prisma = prisma;
}
