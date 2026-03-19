import { Navbar } from "@/components/Navbar";
import { NewDocumentSection } from "@/components/NewDocumentSection";
import { RecentDocuments } from "@/components/RecentDocuments";

export default function Home() {
	return (
		<div className="flex min-h-screen flex-col bg-background">
			<Navbar />
			<NewDocumentSection />
			<RecentDocuments />
		</div>
	);
}
