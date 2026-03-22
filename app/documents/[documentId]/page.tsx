import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function DocumentPage({
	params,
}: {
	params: Promise<{ documentId: string }>;
}) {
	const { userId } = await auth();
	if (!userId) {
		redirect("/sign-in");
	}
	const { documentId } = await params;

	return <SimpleEditor />
}
