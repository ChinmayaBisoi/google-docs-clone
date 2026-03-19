"use client";

import {
	DOCS_PALETTE_ATTR,
	type DocsThemeId,
	THEME_IDS,
	THEME_STORAGE_KEY,
	THEMES,
} from "@/lib/themes";
import { useCallback, useLayoutEffect, useState } from "react";

function applyThemeToDocument(id: DocsThemeId) {
	const html = document.documentElement;
	html.classList.remove("dark");
	html.removeAttribute(DOCS_PALETTE_ATTR);
	html.removeAttribute("data-theme");

	if (id === "dark") {
		html.classList.add("dark");
	} else if (id !== "light") {
		html.setAttribute(DOCS_PALETTE_ATTR, id);
	}
}

function normalizeThemeId(raw: string | null): DocsThemeId {
	if (!raw || raw === "default") return "light";
	if (THEME_IDS.has(raw)) return raw as DocsThemeId;
	return "light";
}

/**
 * Hydration-safe: first render matches server (`light`), then useLayoutEffect
 * syncs from localStorage before paint (aligned with ThemeInitScript).
 */
export function useTheme() {
	const [themeId, setThemeIdState] = useState<DocsThemeId>("light");

	useLayoutEffect(() => {
		const stored = normalizeThemeId(localStorage.getItem(THEME_STORAGE_KEY));
		if (stored !== localStorage.getItem(THEME_STORAGE_KEY)) {
			localStorage.setItem(THEME_STORAGE_KEY, stored);
		}
		setThemeIdState(stored);
		applyThemeToDocument(stored);
	}, []);

	useLayoutEffect(() => {
		const onStorage = (e: StorageEvent) => {
			if (e.key !== THEME_STORAGE_KEY) return;
			const next = normalizeThemeId(e.newValue);
			setThemeIdState(next);
			applyThemeToDocument(next);
		};
		window.addEventListener("storage", onStorage);
		return () => window.removeEventListener("storage", onStorage);
	}, []);

	const setTheme = useCallback((id: string) => {
		const next = normalizeThemeId(id);
		localStorage.setItem(THEME_STORAGE_KEY, next);
		applyThemeToDocument(next);
		setThemeIdState(next);
	}, []);

	const currentTheme =
		THEMES.find((t) => t.id === themeId) ?? THEMES[0];

	return { themeId, setTheme, currentTheme, themes: THEMES };
}
