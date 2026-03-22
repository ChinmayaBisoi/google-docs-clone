import { SignJWT, jwtVerify } from "jose";

function getSecret(): Uint8Array {
	const s = process.env.COLLAB_JWT_SECRET;
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
