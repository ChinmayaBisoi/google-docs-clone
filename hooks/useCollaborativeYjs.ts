"use client";

import { useTRPC } from "@/trpc/client";
import { HocuspocusProvider, WebSocketStatus } from "@hocuspocus/provider";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import * as Y from "yjs";

/** If IDB never emits `synced` (blocked storage, open failure), still allow WebSocket sync. */
const IDB_SYNC_FAILSAFE_MS = 5000;

function resolveCollabWsUrl(): string | undefined {
	const fromEnv = process.env.NEXT_PUBLIC_HOCUSPOCUS_URL?.trim();
	if (fromEnv) {
		return fromEnv;
	}
	// Dev fallback: NEXT_PUBLIC_* is baked at dev-server start; if unset, collab still won't work
	// unless we default here so localhost + `npm run collab` works without env mistakes.
	if (process.env.NODE_ENV === "development") {
		return "ws://127.0.0.1:1234";
	}
	return undefined;
}

export type CollaborativeYjsStatus =
	| { kind: "idle" }
	| { kind: "missing_ws_url" }
	| { kind: "loading" }
	| { kind: "token_error"; message: string }
	| { kind: "ready"; ydoc: Y.Doc; provider: HocuspocusProvider };

export function useCollaborativeYjs(documentId: string | undefined): CollaborativeYjsStatus {
	const trpc = useTRPC();
	const wsUrl = useMemo(() => resolveCollabWsUrl(), []);

	const collabTokenMutationOpts = useMemo(
		() => trpc.document.getCollabToken.mutationOptions(),
		[trpc]
	);
	const tokenMutation = useMutation(collabTokenMutationOpts);

	// biome-ignore lint/correctness/useExhaustiveDependencies: need a fresh Y.Doc when switching documents
	const ydoc = useMemo(() => new Y.Doc(), [documentId]);

	const [provider, setProvider] = useState<HocuspocusProvider | null>(null);
	const [idbReady, setIdbReady] = useState(false);
	const lastTokenDocumentIdRef = useRef<string | undefined>(undefined);

	const { mutate: fetchCollabToken, reset: resetTokenMutation } = tokenMutation;

	const collabToken = tokenMutation.data?.token;

	useEffect(() => {
		if (!documentId) return;
		let cancelled = false;
		setIdbReady(false);
		const idb = new IndexeddbPersistence(`gdc-doc-${documentId}`, ydoc);
		const failSafe = setTimeout(() => {
			if (!cancelled) {
				setIdbReady(true);
			}
		}, IDB_SYNC_FAILSAFE_MS);
		void idb.whenSynced.then(() => {
			if (!cancelled) {
				clearTimeout(failSafe);
				setIdbReady(true);
			}
		});
		return () => {
			cancelled = true;
			clearTimeout(failSafe);
			void idb.destroy();
			setIdbReady(false);
		};
	}, [documentId, ydoc]);

	useEffect(() => {
		if (!documentId || !wsUrl) {
			resetTokenMutation();
			setProvider(null);
			lastTokenDocumentIdRef.current = undefined;
			return;
		}
		if (lastTokenDocumentIdRef.current !== documentId) {
			resetTokenMutation();
			lastTokenDocumentIdRef.current = documentId;
		}
		fetchCollabToken({ documentId });
	}, [documentId, wsUrl, fetchCollabToken, resetTokenMutation]);

	useEffect(() => {
		if (!documentId || !wsUrl || !tokenMutation.isSuccess || !collabToken || !idbReady) {
			setProvider(null);
			return;
		}
		const hp = new HocuspocusProvider({
			url: wsUrl,
			name: documentId,
			document: ydoc,
			token: collabToken,
			onStatus: ({ status }) => {
				if (process.env.NODE_ENV !== "development") {
					return;
				}
				const label =
					status === WebSocketStatus.Connected
						? "connected"
						: status === WebSocketStatus.Connecting
							? "connecting"
							: status === WebSocketStatus.Disconnected
								? "disconnected"
								: String(status);
				console.log(`[collab] ${documentId.slice(0, 8)}… WebSocket ${label}`);
			},
			onAuthenticationFailed: ({ reason }) => {
				if (process.env.NODE_ENV === "development") {
					console.error("[collab] authentication failed:", reason);
				}
			},
		});
		setProvider(hp);
		return () => {
			hp.destroy();
			setProvider(null);
		};
	}, [documentId, wsUrl, tokenMutation.isSuccess, collabToken, idbReady, ydoc]);

	if (!documentId) {
		return { kind: "idle" };
	}

	if (!wsUrl) {
		return { kind: "missing_ws_url" };
	}

	if (tokenMutation.isPending) {
		return { kind: "loading" };
	}

	if (tokenMutation.isError) {
		return {
			kind: "token_error",
			message: tokenMutation.error.message ?? "Could not get collaboration token",
		};
	}

	if (!provider) {
		return { kind: "loading" };
	}

	return { kind: "ready", ydoc, provider };
}
