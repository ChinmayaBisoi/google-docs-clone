"use client";

import { useEffect, useRef, useState } from "react";
import { useTRPC } from "@/trpc/client";
import {
	recordWarmTimestamp,
	shouldWarmSocket,
} from "@/lib/socket/warm-cache";
import { useQuery } from "@tanstack/react-query";

type Status = "unknown" | "online" | "offline" | "not-configured";

const POLL_MS = 45_000;

export function SocketStatusIndicator() {
	const [status, setStatus] = useState<Status>("unknown");
	const [latencyMs, setLatencyMs] = useState<number | null>(null);
	const didWarmRef = useRef(false);
	const trpc = useTRPC();

	const healthQuery = useQuery({
		...trpc.collabHealth.queryOptions(),
		refetchInterval: POLL_MS,
	});

	useEffect(() => {
		if (healthQuery.isError) {
			setStatus("offline");
			setLatencyMs(null);
			return;
		}

		const result = healthQuery.data;
		if (!result) return;

		if (!result.configured) {
			setStatus("not-configured");
			setLatencyMs(null);
			return;
		}

		const ok = result.ok;
		setStatus(ok ? "online" : "offline");
		setLatencyMs("latencyMs" in result ? result.latencyMs : null);

		if (!didWarmRef.current && shouldWarmSocket() && ok) {
			didWarmRef.current = true;
			recordWarmTimestamp();
		}
	}, [healthQuery.isError, healthQuery.data]);

	if (status === "not-configured") {
		return null;
	}

	const title =
		status === "unknown"
			? "Socket status"
			: status === "online"
				? latencyMs != null
					? `Socket online (${latencyMs} ms)`
					: "Socket online"
				: "Socket unreachable";

	return (
		<div
			className="flex items-center gap-1.5 text-xs text-muted-foreground"
			title={title}
		>
			<span className="sr-only">{title}</span>
			<span
				className={
					status === "unknown"
						? "size-2 rounded-full bg-muted-foreground/50"
						: status === "online"
							? "size-2 rounded-full bg-emerald-500"
							: "size-2 rounded-full bg-destructive"
				}
				aria-hidden
			/>
			<span className="hidden sm:inline">WS</span>
		</div>
	);
}
