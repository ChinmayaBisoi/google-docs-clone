"use client";

import { useTRPC } from "@/trpc/client";
import { HocuspocusProvider } from "@hocuspocus/provider";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { IndexeddbPersistence } from "y-indexeddb";
import * as Y from "yjs";

export type CollaborativeYjsStatus =
	| { kind: "idle" }
	| { kind: "missing_ws_url" }
	| { kind: "loading" }
	| { kind: "token_error"; message: string }
	| { kind: "ready"; ydoc: Y.Doc; provider: HocuspocusProvider };

export function useCollaborativeYjs(documentId: string | undefined): CollaborativeYjsStatus {
	const trpc = useTRPC();
	const wsUrl = process.env.NEXT_PUBLIC_HOCUSPOCUS_URL;

	// biome-ignore lint/correctness/useExhaustiveDependencies: need a fresh Y.Doc when switching documents
	const ydoc = useMemo(() => new Y.Doc(), [documentId]);

	const [provider, setProvider] = useState<HocuspocusProvider | null>(null);

	const tokenMutation = useMutation(trpc.document.getCollabToken.mutationOptions());
	const { mutate: fetchCollabToken, reset: resetTokenMutation } = tokenMutation;

	useEffect(() => {
		if (!documentId) return;
		const idb = new IndexeddbPersistence(`gdc-doc-${documentId}`, ydoc);
		return () => {
			idb.destroy();
		};
	}, [documentId, ydoc]);

	useEffect(() => {
		if (!documentId || !wsUrl) {
			resetTokenMutation();
			setProvider(null);
			return;
		}
		resetTokenMutation();
		fetchCollabToken({ documentId });
	}, [documentId, wsUrl, fetchCollabToken, resetTokenMutation]);

	useEffect(() => {
		if (!documentId || !wsUrl || !tokenMutation.isSuccess || !tokenMutation.data?.token) {
			setProvider(null);
			return;
		}
		const hp = new HocuspocusProvider({
			url: wsUrl,
			name: documentId,
			document: ydoc,
			token: tokenMutation.data.token,
		});
		setProvider(hp);
		return () => {
			hp.destroy();
			setProvider(null);
		};
	}, [documentId, wsUrl, tokenMutation.isSuccess, tokenMutation.data?.token, ydoc]);

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
