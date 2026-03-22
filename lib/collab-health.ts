/**
 * Collab client uses a WebSocket URL; HTTP checks (health, probes) need http(s) on the same host.
 */
export function collabHttpOriginFromWsUrl(wsUrl: string): string | null {
	const trimmed = wsUrl.trim();
	if (!trimmed) {
		return null;
	}
	try {
		const u = new URL(trimmed);
		if (u.protocol !== "ws:" && u.protocol !== "wss:") {
			return null;
		}
		u.protocol = u.protocol === "wss:" ? "https:" : "http:";
		return u.origin;
	} catch {
		return null;
	}
}
