"use client";

import type {
	CollaborationPresenceAvatarsProps,
	CollaborationPresencePeer,
} from "@/components/documents/collaboration-presence-types";
import { useCollaborationPresence } from "@/hooks/useCollaborationPresence";
import { getPresenceInitials } from "@/lib/presence-initials";
import { cn } from "@/lib/utils";

const MAX_VISIBLE = 8;

export function CollaborationPresenceAvatars({
	provider,
	className,
}: CollaborationPresenceAvatarsProps) {
	const peers = useCollaborationPresence(provider);

	if (peers.length === 0) {
		return null;
	}

	const extra = peers.length > MAX_VISIBLE ? peers.length - MAX_VISIBLE : 0;
	const visible: CollaborationPresencePeer[] = extra > 0 ? peers.slice(0, MAX_VISIBLE) : peers;

	return (
		<ul
			className={cn(
				"flex min-w-0 max-w-full list-none flex-row items-center justify-center pl-0",
				className
			)}
			aria-label="People in this document"
		>
			{visible.map((peer, index) => (
				<li
					key={peer.clientId}
					className={cn("relative shrink-0", index > 0 && "-ml-2")}
					style={{ zIndex: index + 1 }}
				>
					<PresenceAvatar peer={peer} />
				</li>
			))}
			{extra > 0 ? (
				<li className="relative z-10 -ml-2 flex size-8 shrink-0 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground">
					<span title={`${extra} more`}>+{extra}</span>
				</li>
			) : null}
		</ul>
	);
}

function PresenceAvatar({ peer }: { peer: CollaborationPresencePeer }) {
	const label = peer.name;
	const initials = getPresenceInitials(peer.name);

	return (
		<div
			className="relative size-8 overflow-hidden rounded-full border-2 border-background shadow-sm"
			title={label}
			role="img"
			aria-label={label}
		>
			{peer.imageUrl ? (
				<img
					src={peer.imageUrl}
					alt=""
					className="size-full object-cover"
					referrerPolicy="no-referrer"
				/>
			) : (
				<div
					className="flex size-full items-center justify-center text-[10px] font-semibold text-white"
					style={{ backgroundColor: peer.color }}
					aria-hidden
				>
					{initials}
				</div>
			)}
		</div>
	);
}
