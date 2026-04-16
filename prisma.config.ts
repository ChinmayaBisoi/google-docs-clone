import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/** Neon (or any Postgres): non-pooled URL for Prisma CLI when set; else `DATABASE_URL`. Runtime app uses `DATABASE_URL` in `lib/prisma.ts`. */
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
