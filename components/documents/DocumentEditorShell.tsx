"use client";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect } from "react";
import { DocumentEditorCanvas } from "./DocumentEditorCanvas";
import { DocumentEditorFormatToolbar } from "./DocumentEditorFormatToolbar";
import { DocumentEditorMenubar } from "./DocumentEditorMenubar";
import { DocumentEditorRulerLayout } from "./DocumentEditorRulerLayout";
import type { DocumentEditorShellProps } from "./document-types";

export function DocumentEditorShell({ title, initialPlainText }: DocumentEditorShellProps) {
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
					<div className="flex min-w-0 items-center gap-2">
						<h1 className="truncate text-lg font-normal text-[#202124] dark:text-foreground">
							{title}
						</h1>
						<button
							type="button"
							className="shrink-0 rounded p-1 text-[#5f6368] hover:bg-black/6 dark:text-muted-foreground dark:hover:bg-white/10"
							aria-label="Star"
						>
							<svg
								className="size-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								aria-hidden
							>
								<title>Star</title>
								<path
									strokeWidth="2"
									d="M12 3l2.09 6.26L21 9.27l-5 4.87L17.18 21 12 17.77 6.82 21 8 14.14l-5-4.87 6.91-1.01L12 3z"
								/>
							</svg>
						</button>
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
