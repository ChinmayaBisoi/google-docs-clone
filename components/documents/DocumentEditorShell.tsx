"use client";

import { Logo } from "@/components/Logo";
import { DocumentTitleOwnerControls } from "@/components/documents/DocumentTitleOwnerControls";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { DocumentEditorCanvas } from "./DocumentEditorCanvas";
import { DocumentEditorFormatToolbar } from "./DocumentEditorFormatToolbar";
import { DocumentEditorMenubar } from "./DocumentEditorMenubar";
import { DocumentEditorRulerLayout } from "./DocumentEditorRulerLayout";
import type { DocumentEditorShellProps } from "./document-types";

export function DocumentEditorShell({
	documentId,
	title,
	initialPlainText,
	isOwner,
	pinned,
}: DocumentEditorShellProps) {
	useEffect(() => {
		document.title = `${title} - Google Docs Clone`;
	}, [title]);

	return (
		<div
			dir="ltr"
			role="application"
			className="flex h-dvh min-h-0 flex-col overflow-hidden bg-[#F0F4F9] text-[#202124] dark:bg-background dark:text-foreground"
		>
			<header className="flex h-14 shrink-0 items-center gap-2 border-b border-[#dadce0] bg-white px-2 dark:border-border dark:bg-card">
				<Button
					variant="ghost"
					size="icon-sm"
					className="size-10 shrink-0"
					aria-label="Main menu"
					asChild
				>
					<Link href="/">
						<Logo />
					</Link>
				</Button>
				<div className="flex min-w-0 flex-1 flex-col justify-center gap-0.5">
					<div className="flex min-w-0 items-center gap-1">
						<div className="min-w-0 flex-1">
							<DocumentTitleOwnerControls
								documentId={documentId}
								title={title}
								pinned={pinned}
								isOwner={isOwner}
								documentTitleClassName="text-left text-lg"
							/>
						</div>
					</div>
					<div className="flex items-center gap-1 text-xs text-[#5f6368] dark:text-muted-foreground">
						<span className="truncate">In My Documents</span>
					</div>
				</div>
				<div className="flex shrink-0 items-center gap-2">
					<Button
						type="button"
						variant="outline"
						size="sm"
						className="hidden rounded-full border-[#dadce0] sm:inline-flex dark:border-border"
					>
						Try Gemini
					</Button>
					<Button
						type="button"
						size="sm"
						className="rounded-full bg-[#1a73e8] px-5 text-white hover:bg-[#1557b0] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
					>
						Share
					</Button>
					<UserButton />
				</div>
			</header>
			<DocumentEditorMenubar />
			<DocumentEditorFormatToolbar />
			<DocumentEditorRulerLayout>
				<DocumentEditorCanvas initialPlainText={initialPlainText} />
			</DocumentEditorRulerLayout>
		</div>
	);
}
