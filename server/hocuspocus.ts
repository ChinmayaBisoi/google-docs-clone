import { PrismaClient } from "@/generated/prisma/client";
import { Server } from "@hocuspocus/server";
import { PrismaPg } from "@prisma/adapter-pg";
import * as Y from "yjs";

import { type CollabJwtPayload, ensureCollabJwtSecret, verifyCollabToken } from "@/lib/collab-jwt";

// Repo root `.env*` (via `ensureCollabJwtSecret` in collab-jwt). No separate `server/.env`.
// Docker/K8s: pass `-e DATABASE_URL` / `-e COLLAB_JWT_SECRET` (or use a mounted root `.env.production`).
ensureCollabJwtSecret();

if (!process.env.COLLAB_JWT_SECRET?.trim()) {
	throw new Error(
		"COLLAB_JWT_SECRET is not set. Use the same value as Next.js (repo root .env or container env)."
	);
}

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL is not set");
}
const prisma = new PrismaClient({
	adapter: new PrismaPg({ connectionString }),
});

const port = Number(process.env.HOCUSPOCUS_PORT ?? process.env.PORT ?? 1234);
const address = process.env.HOCUSPOCUS_ADDRESS ?? "0.0.0.0";

const collabDebugLogs = process.env.NODE_ENV !== "production";

const server = new Server({
	port,
	address,
	name: "google-docs-collab",
	async onRequest({ request, response }) {
		const pathname = new URL(request.url ?? "/", "http://localhost").pathname;
		if (pathname === "/health") {
			const body = JSON.stringify({ ok: true, service: "collab" });
			response.writeHead(200, {
				"Content-Type": "application/json; charset=utf-8",
				"Content-Length": Buffer.byteLength(body),
				"Cache-Control": "no-store",
			});
			response.end(body);
			// Hocuspocus: reject with empty error so the default HTTP body is not sent.
			throw null;
		}
	},
	async onUpgrade({ request }) {
		if (collabDebugLogs) {
			console.log("[collab] WebSocket upgrade", request.url ?? "");
		}
	},
	async onConnect({ documentName, socketId }) {
		if (collabDebugLogs) {
			console.log("[collab] client connected", { documentName, socketId });
		}
	},
	async onDisconnect({ documentName, socketId }) {
		if (collabDebugLogs) {
			console.log("[collab] client disconnected", { documentName, socketId });
		}
	},
	async onAuthenticate({ token, documentName }) {
		const trimmed = token?.trim();
		if (!trimmed) {
			throw new Error("Unauthorized");
		}
		let payload: CollabJwtPayload;
		try {
			payload = await verifyCollabToken(trimmed);
		} catch (err) {
			if (process.env.NODE_ENV !== "production" && err instanceof Error) {
				console.error(
					"[onAuthenticate] JWT verify failed:",
					err.message,
					err.cause instanceof Error ? err.cause.message : ""
				);
			}
			throw new Error("Unauthorized");
		}
		if (payload.documentId !== documentName) {
			throw new Error("Forbidden");
		}
		if (collabDebugLogs) {
			console.log("[collab] authenticated", { documentName, userId: payload.sub });
		}
		return {
			user: {
				id: payload.sub,
				name: payload.name ?? "Anonymous",
			},
		};
	},
	async onLoadDocument({ documentName }) {
		const row = await prisma.document.findUnique({ where: { id: documentName } });
		if (!row?.yjsState || row.yjsState.length === 0) {
			return null;
		}
		const ydoc = new Y.Doc();
		Y.applyUpdate(ydoc, new Uint8Array(row.yjsState));
		return ydoc;
	},
	async onStoreDocument({ document, documentName }) {
		const state = Y.encodeStateAsUpdate(document);
		await prisma.document.update({
			where: { id: documentName },
			data: { yjsState: Buffer.from(state) },
		});
	},
});

async function main() {
	await server.listen();
}

main().catch((e) => {
	console.error(e);
	process.exit(1);
});
