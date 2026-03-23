"use client";

import { DocumentOwnerChromeActions } from "@/components/documents/DocumentOwnerChromeActions";
import type { DocumentTitleOwnerControlsProps } from "@/components/documents/document-title-owner-controls-types";
import { cn } from "@/lib/utils";

export function DocumentTitleOwnerControls({
	documentId,
	title,
	pinned,
	isOwner,
	documentTitleClassName,
}: DocumentTitleOwnerControlsProps) {
	return (
		<div
			id="docs-titlebar-container"
			className="flex min-w-0 max-w-full items-center gap-0.5 overflow-hidden sm:gap-1"
		>
			<div
				id="docs-titlebar"
				className={cn(
					"min-w-0 truncate text-center text-base font-normal text-[#202124] dark:text-foreground",
					documentTitleClassName
				)}
				title={title}
			>
				{title}
			</div>
			{isOwner ? (
				<DocumentOwnerChromeActions
					documentId={documentId}
					title={title}
					pinned={pinned}
					variant="header"
				/>
			) : null}
		</div>
	);
}
