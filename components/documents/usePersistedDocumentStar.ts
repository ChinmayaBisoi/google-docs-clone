"use client";

import { useCallback, useEffect, useState } from "react";

function storageKey(documentId: string | undefined) {
	return `gdc-doc-star:${documentId ?? "local-draft"}`;
}

export function usePersistedDocumentStar(documentId: string | undefined) {
	const [starred, setStarred] = useState(false);

	useEffect(() => {
		if (typeof window === "undefined") return;
		setStarred(localStorage.getItem(storageKey(documentId)) === "1");
	}, [documentId]);

	const toggle = useCallback(() => {
		setStarred((prev) => {
			const next = !prev;
			if (typeof window !== "undefined") {
				localStorage.setItem(storageKey(documentId), next ? "1" : "0");
			}
			return next;
		});
	}, [documentId]);

	return { starred, toggle };
}
