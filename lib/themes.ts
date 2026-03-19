export const THEME_STORAGE_KEY = "docs-theme";

/**
 * Named palette on `<html>`. Do not use `data-theme` (common global, easy collisions).
 */
export const DOCS_PALETTE_ATTR = "data-docs-palette";

export interface ThemeOption {
	id: string;
	label: string;
	preview: {
		primary: string;
		background: string;
		foreground: string;
	};
}

export const THEMES = [
	{
		id: "light",
		label: "Light",
		preview: {
			primary: "oklch(0.6723 0.1606 244.9955)",
			background: "oklch(1 0 0)",
			foreground: "oklch(0.1884 0.0128 248.5103)",
		},
	},
	{
		id: "dark",
		label: "Dark",
		preview: {
			primary: "oklch(0.6692 0.1607 245.0110)",
			background: "oklch(0 0 0)",
			foreground: "oklch(0.9328 0.0025 228.7857)",
		},
	},
	{
		id: "amethys-haze",
		label: "Amethyst Haze",
		preview: {
			primary: "oklch(0.6104 0.0767 299.7335)",
			background: "oklch(0.9777 0.0041 301.4256)",
			foreground: "oklch(0.3651 0.0325 287.0807)",
		},
	},
	{
		id: "caffeine",
		label: "Caffeine",
		preview: {
			primary: "oklch(0.4341 0.0392 41.9938)",
			background: "oklch(0.9821 0 0)",
			foreground: "oklch(0.2435 0 0)",
		},
	},
	{
		id: "catpuuccin",
		label: "Catppuccin",
		preview: {
			primary: "oklch(0.5547 0.2503 297.0156)",
			background: "oklch(0.9578 0.0058 264.5321)",
			foreground: "oklch(0.4355 0.0430 279.3250)",
		},
	},
	{
		id: "clean-slate",
		label: "Clean Slate",
		preview: {
			primary: "oklch(0.5854 0.2041 277.1173)",
			background: "oklch(0.9842 0.0034 247.8575)",
			foreground: "oklch(0.2795 0.0368 260.0310)",
		},
	},
	{
		id: "dark-matter",
		label: "Dark Matter",
		preview: {
			primary: "oklch(0.6716 0.1368 48.5130)",
			background: "oklch(1.0000 0 0)",
			foreground: "oklch(0.2101 0.0318 264.6645)",
		},
	},
	{
		id: "shadcn",
		label: "Shadcn",
		preview: {
			primary: "oklch(0.2050 0 0)",
			background: "oklch(1 0 0)",
			foreground: "oklch(0.1450 0 0)",
		},
	},
	{
		id: "graphite",
		label: "Graphite",
		preview: {
			primary: "oklch(0.4891 0 0)",
			background: "oklch(0.9551 0 0)",
			foreground: "oklch(0.3211 0 0)",
		},
	},
	{
		id: "midnight-bloom",
		label: "Midnight Bloom",
		preview: {
			primary: "oklch(0.5676 0.2021 283.0838)",
			background: "oklch(0.9821 0 0)",
			foreground: "oklch(0.3211 0 0)",
		},
	},
	{
		id: "nature",
		label: "Nature",
		preview: {
			primary: "oklch(0.5234 0.1347 144.1672)",
			background: "oklch(0.9711 0.0074 80.7211)",
			foreground: "oklch(0.3000 0.0358 30.2042)",
		},
	},
	{
		id: "neobrutalism",
		label: "Neobrutalism",
		preview: {
			primary: "oklch(0.6489 0.2370 26.9728)",
			background: "oklch(1.0000 0 0)",
			foreground: "oklch(0 0 0)",
		},
	},
	{
		id: "northern-lights",
		label: "Northern Lights",
		preview: {
			primary: "oklch(0.6487 0.1538 150.3071)",
			background: "oklch(0.9824 0.0013 286.3757)",
			foreground: "oklch(0.3211 0 0)",
		},
	},
	{
		id: "retro-arcade",
		label: "Retro Arcade",
		preview: {
			primary: "oklch(0.5924 0.2025 355.8943)",
			background: "oklch(0.9735 0.0261 90.0953)",
			foreground: "oklch(0.3092 0.0518 219.6516)",
		},
	},
	{
		id: "soft-pop",
		label: "Soft Pop",
		preview: {
			primary: "oklch(0.5106 0.2301 276.9656)",
			background: "oklch(0.9789 0.0082 121.6272)",
			foreground: "oklch(0 0 0)",
		},
	},
	{
		id: "solar-dusk",
		label: "Solar Dusk",
		preview: {
			primary: "oklch(0.5553 0.1455 48.9975)",
			background: "oklch(0.9885 0.0057 84.5659)",
			foreground: "oklch(0.3660 0.0251 49.6085)",
		},
	},
	{
		id: "starry-sky",
		label: "Starry Sky",
		preview: {
			primary: "oklch(0.4815 0.1178 263.3758)",
			background: "oklch(0.9755 0.0045 258.3245)",
			foreground: "oklch(0.2558 0.0433 268.0662)",
		},
	},
	{
		id: "sunset-horizon",
		label: "Sunset Horizon",
		preview: {
			primary: "oklch(0.7357 0.1641 34.7091)",
			background: "oklch(0.9856 0.0084 56.3169)",
			foreground: "oklch(0.3353 0.0132 2.7676)",
		},
	},
] as const satisfies readonly ThemeOption[];

export type DocsThemeId = (typeof THEMES)[number]["id"];

export const THEME_IDS = new Set<string>(THEMES.map((t) => t.id));
