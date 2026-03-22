"use client";

import { Logo, LogoLong } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { copyPageUrlToClipboard } from "@/lib/copy-page-url";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useAuth } from "@clerk/nextjs";
import { useQuery } from "@tanstack/react-query";
import { Share2, Star } from "lucide-react";
import Link from "next/link";
import { forwardRef, useEffect } from "react";

import type { SimpleEditorChromeHeaderProps } from "@/components/documents/simple-editor-chrome-types";
import { usePersistedDocumentStar } from "@/components/documents/usePersistedDocumentStar";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { NavbarUserMenu } from "../auth/NavbarUserMenu";

export const SimpleEditorChromeHeader = forwardRef<HTMLDivElement, SimpleEditorChromeHeaderProps>(
	function SimpleEditorChromeHeader({ documentId }, ref) {
		const trpc = useTRPC();
		const { isSignedIn } = useAuth();
		const docQuery = useQuery({
			...trpc.document.getById.queryOptions({ id: documentId ?? "__disabled__" }),
			enabled: Boolean(documentId && isSignedIn),
		});

		const displayTitle = (() => {
			if (!documentId) return "Untitled document";
			if (docQuery.isError) return "Document";
			if (docQuery.data) return docQuery.data.title;
			return "Untitled document";
		})();

		const { starred, toggle } = usePersistedDocumentStar(documentId);

		useEffect(() => {
			document.title = `${displayTitle} - Google Docs Clone`;
		}, [displayTitle]);

		return (
			<div
				ref={ref}
				id="docs-chrome"
				className="sticky top-0 z-50 bg-background shrink-0 border-b border-[#dadce0] dark:border-border dark:bg-card"
			>
				<div id="docs-header-container" className="w-full">
					<div id="docs-header" className="flex min-h-16 items-stretch">
						<div
							id="docs-branding-container"
							className="flex shrink-0 ml-2 items-center justify-center border-r border-transparent px-1 sm:px-2 dark:border-transparent"
						>
							<Link href="/">
								<LogoLong />
							</Link>
						</div>
						<div className="w-0.5 h-8 my-auto bg-border" />
						<div className="flex min-w-0 flex-1 items-center px-2 py-1 sm:px-3">
							<div className="grid min-w-0 flex-1 grid-cols-[1fr_minmax(0,1fr)_1fr] items-center gap-2">
								<div
									id="docs-titlebar-container"
									className="flex min-w-0 max-w-full items-center gap-1 overflow-hidden"
								>
									<div
										id="docs-titlebar"
										className="min-w-0 truncate text-center text-base font-normal text-[#202124] dark:text-foreground"
										title={displayTitle}
									>
										{displayTitle}
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										className={cn(
											"shrink-0 text-[#5f6368] dark:text-muted-foreground",
											starred && "text-amber-500 hover:text-amber-600 dark:text-amber-400"
										)}
										aria-label={starred ? "Remove from starred" : "Add to starred"}
										aria-pressed={starred}
										onClick={toggle}
									>
										<Star
											className="size-5"
											fill={starred ? "currentColor" : "none"}
											strokeWidth={2}
											aria-hidden
										/>
									</Button>
								</div>
								<div className="min-w-0" aria-hidden />


								<div className="flex min-w-0 justify-end justify-self-end">
									<div className="flex shrink-0 items-center gap-2">
										<Button
											type="button"
											size="sm"
											className="rounded-full"
											aria-label="Copy link to this page"
											onClick={() => void copyPageUrlToClipboard()}
										>
											<Share2 className="size-4 sm:mr-1" aria-hidden />
											<span className="hidden sm:inline">Share</span>
										</Button>
										<div className="flex items-center gap-1">
											<ThemeSwitcher />
											<NavbarUserMenu />
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
);

SimpleEditorChromeHeader.displayName = "SimpleEditorChromeHeader";
