import { Client } from "pg";

const globalForDb = globalThis as unknown as {
	rawSqlClient: Client | undefined;
	rawSqlConnectPromise: Promise<void> | undefined;
};

function getDatabaseUrl(): string {
	const url = process.env.DATABASE_URL;
	if (!url) {
		throw new Error("DATABASE_URL must be set");
	}
	return url;
}

async function getRawSqlClient(): Promise<Client> {
	if (!globalForDb.rawSqlClient) {
		const client = new Client({ connectionString: getDatabaseUrl() });
		globalForDb.rawSqlClient = client;
		globalForDb.rawSqlConnectPromise = client.connect().then(() => {
			return;
		});
	}
	await globalForDb.rawSqlConnectPromise;
	return globalForDb.rawSqlClient;
}

function createSqlTag() {
	return async function sql<
		T extends Record<string, unknown> = Record<string, unknown>,
	>(strings: TemplateStringsArray, ...values: unknown[]): Promise<T[]> {
		const client = await getRawSqlClient();
		let text = strings[0] ?? "";
		const params: unknown[] = [];
		for (let i = 0; i < values.length; i++) {
			params.push(values[i]);
			text += `$${params.length}${strings[i + 1] ?? ""}`;
		}
		const result = await client.query<T>(text, params);
		return result.rows;
	};
}

let _sql: ReturnType<typeof createSqlTag> | null = null;

function getSql() {
	if (!_sql) {
		_sql = createSqlTag();
	}
	return _sql;
}

export { getSql };
