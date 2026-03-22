import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { loadEnvConfig } from "@next/env";
import { parse } from "dotenv";
import { SignJWT, jwtVerify } from "jose";

let collabEnvEnsured = false;

/**
 * Loads repo-root env the same way Next does, then falls back to reading
 * `.env.local` / `.env` from disk if `COLLAB_JWT_SECRET` is missing or blank.
 *
 * `@next/env` merges so the first file wins per key; an empty value in
 * `.env.development` can block a real secret in `.env`. The standalone collab
 * process must resolve the same secret as the Next server or JWT verify fails.
 */
export function ensureCollabJwtSecret(): void {
	if (collabEnvEnsured) {
		return;
	}
	collabEnvEnsured = true;

	loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

	if (process.env.COLLAB_JWT_SECRET?.trim()) {
		return;
	}

	for (const name of [".env.local", ".env"] as const) {
		const envPath = join(process.cwd(), name);
		if (!existsSync(envPath)) {
			continue;
		}
		const parsed = parse(readFileSync(envPath, "utf8"));
		const s = parsed.COLLAB_JWT_SECRET;
		if (typeof s === "string" && s.trim()) {
			process.env.COLLAB_JWT_SECRET = s;
			return;
		}
	}
}

function getSecret(): Uint8Array {
	ensureCollabJwtSecret();
	const s = process.env.COLLAB_JWT_SECRET?.trim();
	if (!s) {
		throw new Error("COLLAB_JWT_SECRET is not set");
	}
	return new TextEncoder().encode(s);
}

export async function signCollabToken(payload: {
	sub: string;
	documentId: string;
	name: string | null;
}): Promise<string> {
	return new SignJWT({
		documentId: payload.documentId,
		name: payload.name,
	})
		.setProtectedHeader({ alg: "HS256" })
		.setSubject(payload.sub)
		.setIssuedAt()
		.setExpirationTime("8h")
		.sign(getSecret());
}

export type CollabJwtPayload = {
	documentId: string;
	sub: string;
	name: string | null;
};

export async function verifyCollabToken(token: string): Promise<CollabJwtPayload> {
	const { payload } = await jwtVerify(token, getSecret(), {
		algorithms: ["HS256"],
	});
	const documentId = payload.documentId;
	const sub = payload.sub;
	if (typeof documentId !== "string" || typeof sub !== "string") {
		throw new Error("Invalid collab token");
	}
	const name = payload.name;
	return {
		documentId,
		sub,
		name: typeof name === "string" ? name : null,
	};
}
