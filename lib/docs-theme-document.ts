import { DOCS_PALETTE_ATTR, type DocsThemeId, THEME_IDS } from "@/lib/themes";

export function normalizeDocsThemeId(raw: string | null): DocsThemeId {
	if (!raw || raw === "default") return "light";
	if (THEME_IDS.has(raw)) return raw as DocsThemeId;
	return "light";
}

export function applyDocsThemeToDocument(id: DocsThemeId): void {
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
