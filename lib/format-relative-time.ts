/** Client-safe relative labels for document activity (e.g. list "last opened"). */
export function formatRelativeTime(iso: string | Date): string {
	const d = typeof iso === "string" ? new Date(iso) : iso;
	const diffMs = Date.now() - d.getTime();
	const diffSec = Math.floor(diffMs / 1000);
	if (diffSec < 60) return "Just now";
	const diffMin = Math.floor(diffSec / 60);
	if (diffMin < 60) return `${diffMin}m ago`;
	const diffHr = Math.floor(diffMin / 60);
	if (diffHr < 24) return `${diffHr}h ago`;
	const diffDay = Math.floor(diffHr / 24);
	if (diffDay < 7) return `${diffDay}d ago`;
	return d.toLocaleDateString();
}
