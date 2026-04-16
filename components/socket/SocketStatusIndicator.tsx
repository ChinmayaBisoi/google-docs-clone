"use client";

import { useEffect, useRef, useState } from "react";
import { trpc } from "@/trpc/client";
import {
	recordWarmTimestamp,
	shouldWarmSocket,
} from "@/lib/socket/warm-cache";

type Status = "unknown" | "online" | "offline" | "not-configured";

const POLL_MS = 45_000;

export function SocketStatusIndicator() {
	const [status, setStatus] = useState<Status>("unknown");
	const [latencyMs, setLatencyMs] = useState<number | null>(null);
	const mounted = useRef(true);
	const collabHealthMutation = trpc.collabHealth.useMutation();

	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	useEffect(() => {
		let cancelled = false;

		async function tick(isInitial: boolean) {
			const wantWarm = isInitial && shouldWarmSocket();

			try {
				const result = await collabHealthMutation.mutateAsync();

				if (cancelled || !mounted.current) return;

				if (!result.configured) {
					setStatus("not-configured");
					setLatencyMs(null);
					return;
				}

				const ok = result.ok;
				setStatus(ok ? "online" : "offline");
				setLatencyMs("latencyMs" in result ? result.latencyMs : null);

				if (wantWarm && ok) {
					recordWarmTimestamp();
				}
			} catch {
				if (cancelled || !mounted.current) return;
				setStatus("offline");
				setLatencyMs(null);
			}
		}

		void tick(true);
		const id = setInterval(() => {
			void tick(false);
		}, POLL_MS);
		return () => {
			cancelled = true;
			clearInterval(id);
		};
	}, [collabHealthMutation]);

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
