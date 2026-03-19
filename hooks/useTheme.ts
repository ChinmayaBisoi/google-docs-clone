"use client";

import {
	applyDocsThemeToDocument,
	normalizeDocsThemeId,
} from "@/lib/docs-theme-document";
import {
	type DocsThemeId,
	THEME_STORAGE_KEY,
	THEMES,
} from "@/lib/themes";
import { useCallback, useLayoutEffect, useState } from "react";

/**
 * Hydration-safe: first render matches server (`light`), then useLayoutEffect
 * syncs from localStorage before paint (aligned with ThemeInitScript).
 */
export function useTheme() {
	const [themeId, setThemeIdState] = useState<DocsThemeId>("light");

	useLayoutEffect(() => {
		const stored = normalizeDocsThemeId(localStorage.getItem(THEME_STORAGE_KEY));
		if (stored !== localStorage.getItem(THEME_STORAGE_KEY)) {
			localStorage.setItem(THEME_STORAGE_KEY, stored);
		}
		setThemeIdState(stored);
		applyDocsThemeToDocument(stored);
	}, []);

	useLayoutEffect(() => {
		const onStorage = (e: StorageEvent) => {
			if (e.key !== THEME_STORAGE_KEY) return;
			const next = normalizeDocsThemeId(e.newValue);
			setThemeIdState(next);
			applyDocsThemeToDocument(next);
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	const setTheme = useCallback((id: string) => {
		const next = normalizeDocsThemeId(id);
		localStorage.setItem(THEME_STORAGE_KEY, next);
		applyDocsThemeToDocument(next);
		setThemeIdState(next);
	}, []);

	const currentTheme =
		THEMES.find((t) => t.id === themeId) ?? THEMES[0];

	return { themeId, setTheme, currentTheme, themes: THEMES };
}
