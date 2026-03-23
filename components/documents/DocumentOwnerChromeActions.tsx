"use client";

import type { DocumentOwnerChromeActionsProps } from "@/components/documents/document-owner-chrome-actions-types";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { PenLine, Star } from "lucide-react";
import { useEffect, useId, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

const renameSchema = z.string().trim().min(1, "Title is required").max(200);

export function DocumentOwnerChromeActions({
	documentId,
	title,
	pinned,
	variant = "header",
}: DocumentOwnerChromeActionsProps) {
	const trpc = useTRPC();
	const queryClient = useQueryClient();
	const fieldId = useId();
	const [renameOpen, setRenameOpen] = useState(false);
	const [draftTitle, setDraftTitle] = useState(title);

	const isList = variant === "list";
	const buttonSize = isList ? "icon-xs" : "icon-sm";
	const iconClass = isList ? "size-3.5" : "size-5";

	useEffect(() => {
		if (renameOpen) {
			setDraftTitle(title);
		}
	}, [renameOpen, title]);

	const invalidateDocumentQueries = () => {
		void queryClient.invalidateQueries(trpc.document.getById.queryFilter({ id: documentId }));
		void queryClient.invalidateQueries(trpc.document.list.queryFilter());
	};

	const updateTitle = useMutation(
		trpc.document.updateTitle.mutationOptions({
			onSuccess: () => {
				invalidateDocumentQueries();
				setRenameOpen(false);
			},
			onError: (err) => {
				toast.error(err.message ?? "Could not update title");
			},
		})
	);

	const updatePinned = useMutation(
		trpc.document.updatePinned.mutationOptions({
			onSuccess: () => {
				invalidateDocumentQueries();
			},
			onError: (err) => {
				toast.error(err.message ?? "Could not update star");
			},
		})
	);

	const onSaveRename = () => {
		const parsed = renameSchema.safeParse(draftTitle);
		if (!parsed.success) {
			const msg = parsed.error.flatten().formErrors[0] ?? "Invalid title";
			toast.error(msg);
			return;
		}
		updateTitle.mutate({ id: documentId, title: parsed.data });
	};

	return (
		<>
			<div className={cn("flex shrink-0 items-center gap-0.5", !isList && "sm:gap-1")}>
				<Button
					type="button"
					variant="ghost"
					size={buttonSize}
					className="shrink-0 text-[#5f6368] dark:text-muted-foreground"
					aria-label="Rename document"
					onClick={() => setRenameOpen(true)}
				>
					<PenLine className={iconClass} strokeWidth={2} aria-hidden />
				</Button>
				<Button
					type="button"
					variant="ghost"
					size={buttonSize}
					className={
						pinned
							? "shrink-0 text-amber-500 hover:text-amber-600 dark:text-amber-400"
							: "shrink-0 text-[#5f6368] dark:text-muted-foreground"
					}
					aria-label={pinned ? "Remove from starred" : "Add to starred"}
					aria-pressed={pinned}
					disabled={updatePinned.isPending}
					onClick={() => updatePinned.mutate({ id: documentId, pinned: !pinned })}
				>
					<Star
						className={iconClass}
						fill={pinned ? "currentColor" : "none"}
						strokeWidth={2}
						aria-hidden
					/>
				</Button>
			</div>

			<Dialog open={renameOpen} onOpenChange={setRenameOpen}>
				<DialogContent className="sm:max-w-md" showCloseButton>
					<DialogHeader>
						<DialogTitle>Rename document</DialogTitle>
						<DialogDescription>
							Choose a name for this document. Others will see the new name.
						</DialogDescription>
					</DialogHeader>
					<div className="grid gap-2 py-1">
						<label htmlFor={fieldId} className="text-sm font-medium text-foreground">
							Title
						</label>
						<input
							id={fieldId}
							type="text"
							value={draftTitle}
							onChange={(e) => setDraftTitle(e.target.value)}
							onKeyDown={(e) => {
								if (e.key === "Enter") {
									e.preventDefault();
									onSaveRename();
								}
							}}
							className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground shadow-xs outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
							autoComplete="off"
							maxLength={200}
						/>
					</div>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setRenameOpen(false)}>
							Cancel
						</Button>
						<Button type="button" disabled={updateTitle.isPending} onClick={onSaveRename}>
							Save
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
