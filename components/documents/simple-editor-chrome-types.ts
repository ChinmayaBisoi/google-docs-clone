import type { HocuspocusProvider } from "@hocuspocus/provider";

export interface SimpleEditorChromeHeaderProps {
	documentId?: string;
	/** When set, shows awareness avatars for connected editors. */
	collabProvider?: HocuspocusProvider | null;
}
