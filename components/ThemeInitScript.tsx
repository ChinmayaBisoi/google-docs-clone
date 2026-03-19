import {
	DOCS_PALETTE_ATTR,
	THEME_STORAGE_KEY,
	THEMES,
} from "@/lib/themes";

const VALID_IDS = THEMES.map((t) => t.id);

/**
 * Synchronous script in `<head>` so palette / `.dark` match stored theme before paint.
 * `next/script` beforeInteractive is queued; this avoids a frame of wrong tokens.
 */
export function ThemeInitScript() {
	const payload = JSON.stringify({
		a: DOCS_PALETTE_ATTR,
		k: THEME_STORAGE_KEY,
		v: VALID_IDS,
	});
	const __html = `(function(p){try{var t=localStorage.getItem(p.k);if(t==="default")t="light";if(!t||p.v.indexOf(t)<0)t="light";var h=document.documentElement;h.classList.remove("dark");h.removeAttribute(p.a);h.removeAttribute("data-theme");if(t==="dark")h.classList.add("dark");else if(t!=="light")h.setAttribute(p.a,t)}catch(e){}})(${payload})`;

	return (
		<script
			// biome-ignore lint/security/noDangerouslySetInnerHtml: theme FOUC prevention; payload is JSON from server
			dangerouslySetInnerHTML={{ __html }}
		/>
	);
}
