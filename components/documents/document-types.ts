export interface DocumentEditorShellProps {
	documentId: string;
	title: string;
	initialPlainText: string;
	isOwner: boolean;
	pinned: boolean;
}

export interface DocumentEditorRouteProps {
	documentId: string;
}
