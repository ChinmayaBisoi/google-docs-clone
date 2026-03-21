import { neon } from "@neondatabase/serverless";

let _sql: ReturnType<typeof neon> | null = null;

function getDatabaseUrl(): string {
	const isDev = process.env.NODE_ENV === "development";
	const url = isDev
		? process.env.LOCAL_DATABASE_URL ?? process.env.DATABASE_URL
		: process.env.DATABASE_URL;
	if (!url) {
		throw new Error(
			isDev
				? "LOCAL_DATABASE_URL or DATABASE_URL must be set in development"
				: "DATABASE_URL must be set",
		);
	}
	console.log("url", url);
	return url;
}

function getSql() {
	if (!_sql) {
		_sql = neon(getDatabaseUrl());
	}
	return _sql;
}

export { getSql };
