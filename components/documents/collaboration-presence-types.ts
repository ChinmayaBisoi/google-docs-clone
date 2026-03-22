import type { HocuspocusProvider } from "@hocuspocus/provider";

export interface CollaborationPresencePeer {
	clientId: number;
	name: string;
	color: string;
	imageUrl?: string;
}

export interface CollaborationPresenceAvatarsProps {
	provider: HocuspocusProvider | null;
	className?: string;
}
