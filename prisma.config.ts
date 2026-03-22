import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/** Supabase (or any Postgres): direct / session URL for CLI; runtime uses `DATABASE_URL` (Prisma adapter manages the driver). */
function prismaCliDatabaseUrl(): string {
	const direct = process.env.DIRECT_URL;
	if (direct) return direct;
	return env("DATABASE_URL");
}

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	datasource: {
		url: prismaCliDatabaseUrl(),
	},
});
