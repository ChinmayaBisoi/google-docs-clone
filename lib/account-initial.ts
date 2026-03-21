export function accountInitialFromUser(user: {
	firstName?: string | null;
	primaryEmailAddress?: { emailAddress: string } | null;
	username?: string | null;
}): string {
	const first =
		user.firstName?.[0] ?? user.primaryEmailAddress?.emailAddress[0] ?? user.username?.[0];
	return first?.toUpperCase() ?? "?";
}
