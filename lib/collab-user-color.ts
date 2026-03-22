/** Deterministic HSL color from a string (e.g. Clerk user id) for collaboration cursors. */
export function collabUserColor(seed: string): string {
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = seed.charCodeAt(i) + ((hash << 5) - hash);
	}
	const hue = Math.abs(hash) % 360;
	return `hsl(${hue} 65% 45%)`;
}
