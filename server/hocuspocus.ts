import "dotenv/config";

import { Server } from "@hocuspocus/server";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as Y from "yjs";

import { type CollabJwtPayload, verifyCollabToken } from "@/lib/collab-jwt";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
	throw new Error("DATABASE_URL is not set");
}
const hocuspocusPool = new Pool({ connectionString });
const prisma = new PrismaClient({ adapter: new PrismaPg(hocuspocusPool) });

const port = Number(process.env.HOCUSPOCUS_PORT ?? 1234);
const address = process.env.HOCUSPOCUS_ADDRESS ?? "0.0.0.0";

const server = new Server({
	port,
	address,
	name: "google-docs-collab",
	async onAuthenticate({ token, documentName }) {
		if (!token) {
			throw new Error("Unauthorized");
		}
		let payload: CollabJwtPayload;
		try {
			payload = await verifyCollabToken(token);
		} catch {
			throw new Error("Unauthorized");
		}
		if (payload.documentId !== documentName) {
			throw new Error("Forbidden");
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
