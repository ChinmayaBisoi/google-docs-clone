export type DocumentOwnerChromeActionsVariant = "header" | "list";

export interface DocumentOwnerChromeActionsProps {
	documentId: string;
	title: string;
	pinned: boolean;
	variant?: DocumentOwnerChromeActionsVariant;
}
