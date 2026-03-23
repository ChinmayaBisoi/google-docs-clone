export interface DocumentTitleOwnerControlsProps {
	documentId: string;
	title: string;
	pinned: boolean;
	isOwner: boolean;
	/** Merged onto the title element (e.g. text-lg text-left for legacy shell). */
	documentTitleClassName?: string;
}
