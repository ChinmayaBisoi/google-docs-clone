/** Two-letter initials for avatar fallback (first token + last token when possible). */
export function getPresenceInitials(displayName: string): string {
	const parts = displayName.trim().split(/\s+/).filter(Boolean);
	if (parts.length === 0) return "?";
	if (parts.length === 1) {
		const w = parts[0];
		if (w.length <= 2) return w.toUpperCase();
		return w.slice(0, 2).toUpperCase();
	}
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
