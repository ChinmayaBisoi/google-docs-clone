export function filterDocumentsBySearchQuery<T extends { title: string }>(
	items: T[],
	rawQuery: string
): T[] {
	const q = rawQuery.trim().toLowerCase();
	if (!q) {
		return items;
	}
	return items.filter((d) => d.title.toLowerCase().includes(q));
}
