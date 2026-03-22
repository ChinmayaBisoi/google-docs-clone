"use client";

import type { CollaborationPresencePeer } from "@/components/documents/collaboration-presence-types";
import type { HocuspocusProvider } from "@hocuspocus/provider";
import { useEffect, useState } from "react";

type AwarenessUser = {
	name?: string;
	color?: string;
	imageUrl?: string;
};

function collectPeers(provider: HocuspocusProvider): CollaborationPresencePeer[] {
	const awareness = provider.awareness;
	if (!awareness) {
		return [];
	}
	const out: CollaborationPresencePeer[] = [];
	for (const [clientId, state] of awareness.getStates()) {
		const raw = state as { user?: AwarenessUser };
		const u = raw.user;
		if (!u?.name) {
			continue;
		}
		out.push({
			clientId,
			name: u.name,
			color: typeof u.color === "string" ? u.color : "#64748b",
			imageUrl: typeof u.imageUrl === "string" ? u.imageUrl : undefined,
		});
	}
	out.sort((a, b) => a.name.localeCompare(b.name));
	return out;
}

export function useCollaborationPresence(
	provider: HocuspocusProvider | null
): CollaborationPresencePeer[] {
	const [peers, setPeers] = useState<CollaborationPresencePeer[]>([]);

	useEffect(() => {
		if (!provider) {
			setPeers([]);
			return;
		}
		const awareness = provider.awareness;
		if (!awareness) {
			setPeers([]);
			return;
		}
		const sync = () => {
			setPeers(collectPeers(provider));
		};
		sync();
		awareness.on("update", sync);
		return () => {
			awareness.off("update", sync);
		};
	}, [provider]);

	return peers;
}
