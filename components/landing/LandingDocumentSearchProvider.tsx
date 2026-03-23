"use client";

import {
	type ReactNode,
	createContext,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react";

const SEARCH_DEBOUNCE_MS = 300;

export interface LandingDocumentSearchValue {
	query: string;
	/** Same as `query` after `SEARCH_DEBOUNCE_MS` of stability; empty clears immediately. */
	debouncedQuery: string;
	setQuery: (q: string) => void;
	clearQuery: () => void;
}

const LandingDocumentSearchContext = createContext<LandingDocumentSearchValue | null>(null);

export function LandingDocumentSearchProvider({ children }: { children: ReactNode }) {
	const [query, setQuery] = useState("");
	const [debouncedQuery, setDebouncedQuery] = useState("");

	useEffect(() => {
		if (query === "") {
			setDebouncedQuery("");
			return;
		}
		const id = window.setTimeout(() => {
			setDebouncedQuery(query);
		}, SEARCH_DEBOUNCE_MS);
		return () => window.clearTimeout(id);
	}, [query]);

	const clearQuery = useCallback(() => {
		setQuery("");
	}, []);
	const value = useMemo(
		() => ({
			query,
			debouncedQuery,
			setQuery,
			clearQuery,
		}),
		[query, debouncedQuery, clearQuery]
	);
	return (
		<LandingDocumentSearchContext.Provider value={value}>
			{children}
		</LandingDocumentSearchContext.Provider>
	);
}

export function useLandingDocumentSearch(): LandingDocumentSearchValue | null {
	return useContext(LandingDocumentSearchContext);
}
