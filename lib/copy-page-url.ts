import { toast } from "sonner";

export async function copyPageUrlToClipboard(): Promise<void> {
	try {
		await navigator.clipboard.writeText(window.location.href);
		toast.success("Link copied to clipboard");
	} catch {
		toast.error("Could not copy link");
	}
}

export async function copyDocumentUrlToClipboard(documentId: string): Promise<void> {
	const url = `${window.location.origin}/documents/${documentId}`;
	try {
		await navigator.clipboard.writeText(url);
		toast.success("Link copied to clipboard");
	} catch {
		toast.error("Could not copy link");
	}
}
