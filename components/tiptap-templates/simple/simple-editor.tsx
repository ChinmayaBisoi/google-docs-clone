"use client";

import { SimpleEditorChromeHeader } from "@/components/documents/SimpleEditorChromeHeader";
import { SimpleEditorCollaborativePane } from "@/components/tiptap-templates/simple/SimpleEditorCollaborativePane";
import type { SimpleEditorProps } from "@/components/tiptap-templates/simple/simple-editor-types";
import { useCollaborativeYjs } from "@/hooks/useCollaborativeYjs";
import { collabUserColor } from "@/lib/collab-user-color";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import type { CSSProperties } from "react";
import { useLayoutEffect, useRef, useState } from "react";

export function SimpleEditor({ documentId }: SimpleEditorProps) {
	const chromeRef = useRef<HTMLDivElement>(null);
	const toolbarRef = useRef<HTMLDivElement>(null);
	const [chromeHeightPx, setChromeHeightPx] = useState(64);

	const collab = useCollaborativeYjs(documentId);
	const { user } = useUser();

	useLayoutEffect(() => {
		const el = chromeRef.current;
		if (!el) return;
		const sync = () => setChromeHeightPx(el.offsetHeight);
		sync();
		const ro = new ResizeObserver(sync);
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	const cursorName = user?.fullName?.trim() || user?.primaryEmailAddress?.emailAddress || "User";
	const cursorColor = user?.id ? collabUserColor(user.id) : "#1a73e8";

	if (!documentId) {
		return null;
	}

	if (collab.kind === "missing_ws_url") {
		return (
			<div className="flex h-dvh items-center justify-center px-4 text-center text-sm text-muted-foreground">
				Set NEXT_PUBLIC_HOCUSPOCUS_URL and run the collab server (npm run collab).
			</div>
		);
	}

	if (collab.kind === "token_error") {
		return (
			<div className="flex h-dvh flex-col items-center justify-center gap-2 px-4 text-center">
				<p className="text-sm text-muted-foreground">{collab.message}</p>
			</div>
		);
	}

	if (collab.kind === "loading" || collab.kind === "idle") {
		return (
			<div className="flex h-dvh items-center justify-center">
				<Loader2 className="size-10 animate-spin text-primary" aria-label="Loading editor" />
			</div>
		);
	}

	return (
		<div
			className="simple-editor-wrapper"
			style={
				{
					"--simple-editor-chrome-height": `${chromeHeightPx}px`,
				} as CSSProperties
			}
		>
			<SimpleEditorChromeHeader ref={chromeRef} documentId={documentId} />
			<SimpleEditorCollaborativePane
				ydoc={collab.ydoc}
				provider={collab.provider}
				cursorName={cursorName}
				cursorColor={cursorColor}
				chromeRef={chromeRef}
				toolbarRef={toolbarRef}
			/>
		</div>
	);
}
