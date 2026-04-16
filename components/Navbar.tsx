"use client";

import { LogoLong } from "@/components/Logo";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { NavbarUserMenu } from "@/components/auth/NavbarUserMenu";
import { DbStatusIndicator } from "@/components/db/DbStatusIndicator";
import { SocketStatusIndicator } from "@/components/socket/SocketStatusIndicator";
import { useLandingDocumentSearch } from "@/components/landing/LandingDocumentSearchProvider";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";

export function Navbar() {
	return (
		<header className="sticky top-0 z-50 flex h-16 items-center gap-2 bg-background px-2 md:px-4">
			<LogoLong />

			<div className="flex flex-1 items-center">
				<SearchBar />
			</div>

			<div className="flex items-center gap-1">
				<DbStatusIndicator />
				<SocketStatusIndicator />
				<ThemeSwitcher />
				<NavbarUserMenu />
			</div>
		</header>
	);
}

function SearchBar() {
	const search = useLandingDocumentSearch();

	if (!search) {
		return (
			<div className="group mx-auto flex h-12 max-w-[720px] flex-1 items-center justify-center gap-3 rounded-full bg-accent/50 px-4 text-muted-foreground transition-shadow focus-within:bg-background focus-within:text-foreground focus-within:shadow-md focus-within:ring-1 focus-within:ring-border">
				<Search className="size-5 shrink-0 text-current" aria-hidden />
				<input
					type="text"
					placeholder="Search"
					readOnly
					aria-label="Search"
					className="h-full flex-1 cursor-default bg-transparent text-base outline-none placeholder:text-muted-foreground"
				/>
			</div>
		);
	}

	const { query, setQuery, clearQuery } = search;
	const hasQuery = query.length > 0;

	return (
		<div className="group mx-auto flex h-12 max-w-[720px] flex-1 items-center justify-center gap-2 rounded-full bg-accent/50 px-3 text-muted-foreground transition-shadow focus-within:bg-background focus-within:text-foreground focus-within:shadow-md focus-within:ring-1 focus-within:ring-border sm:gap-3 sm:px-4">
			<Search className="size-5 shrink-0 text-current" aria-hidden />
			<input
				type="text"
				inputMode="search"
				value={query}
				onChange={(e) => setQuery(e.target.value)}
				placeholder="Search documents"
				aria-label="Search documents by title"
				autoComplete="off"
				className="h-full min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground"
			/>
			{hasQuery ? (
				<Button
					type="button"
					variant="ghost"
					size="icon-xs"
					className="shrink-0 text-muted-foreground hover:text-foreground"
					aria-label="Clear search"
					onClick={clearQuery}
				>
					<X className="size-4" aria-hidden />
				</Button>
			) : null}
		</div>
	);
}
