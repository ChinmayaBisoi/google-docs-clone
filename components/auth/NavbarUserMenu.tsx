"use client";

import { SignInModal } from "@/components/auth/SignInModal";
import { SignOutModal } from "@/components/auth/SignOutModal";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { accountInitialFromUser } from "@/lib/account-initial";
import { useUser } from "@clerk/nextjs";
import { useState } from "react";

/** Fixed width matches the signed-out control so search bar does not resize on auth change. */
const AUTH_SLOT = "flex h-9 w-18 shrink-0 items-center justify-center";

export function NavbarUserMenu() {
	const { isLoaded, isSignedIn, user } = useUser();
	const [signOutOpen, setSignOutOpen] = useState(false);

	return (
		<div className={AUTH_SLOT}>
			{!isLoaded ? (
				<div className="size-9 shrink-0 animate-pulse rounded-full bg-muted" aria-hidden />
			) : !isSignedIn ? (
				<SignInModal>
					<Button variant="outline" size="default" className="h-9 shrink-0 px-3">
						Sign in
					</Button>
				</SignInModal>
			) : (
				<>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button
								variant="ghost"
								size="icon"
								className="size-9 shrink-0 rounded-full p-0"
								aria-label="Account menu"
							>
								{user.imageUrl ? (
									<img src={user.imageUrl} alt="" className="size-full rounded-full object-cover" />
								) : (
									<span className="flex size-full items-center justify-center rounded-full bg-muted text-sm font-medium text-muted-foreground">
										{accountInitialFromUser(user)}
									</span>
								)}
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" className="min-w-48">
							<DropdownMenuItem disabled className="truncate opacity-100 focus:bg-transparent">
								{user.primaryEmailAddress?.emailAddress ?? user.username}
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onSelect={() => setSignOutOpen(true)}>Sign out</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<SignOutModal open={signOutOpen} onOpenChange={setSignOutOpen} />
				</>
			)}
		</div>
	);
}
