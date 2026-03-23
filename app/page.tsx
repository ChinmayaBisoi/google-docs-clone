import { Navbar } from "@/components/Navbar";
import { NewDocumentSection } from "@/components/NewDocumentSection";
import { RecentDocuments } from "@/components/RecentDocuments";
import { LandingDocumentSearchProvider } from "@/components/landing/LandingDocumentSearchProvider";

export default function Home() {
	return (
		<LandingDocumentSearchProvider>
			<div className="flex min-h-screen flex-col bg-background">
				<Navbar />
				<NewDocumentSection />
				<RecentDocuments />
			</div>
		</LandingDocumentSearchProvider>
	);
}
