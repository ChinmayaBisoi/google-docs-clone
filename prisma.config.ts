import "dotenv/config";
import { defineConfig, env } from "prisma/config";

/** Neon: use non-pooler host for CLI; runtime app uses pooled DATABASE_URL via PrismaNeon. */
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
