// Object.entries and Object.keys widen keys to string, which loses the resource and
// building key unions everywhere they are used. These keep them.

export function entries<K extends string, V>(obj: Record<K, V>): [K, V][] {
	return Object.entries(obj) as [K, V][];
}

export function keys<K extends string>(obj: Record<K, unknown>): K[] {
	return Object.keys(obj) as K[];
}

export function values<V>(obj: Record<string, V>): V[] {
	return Object.values(obj);
}

// Map.getOrInsertComputed is too new to rely on, so the components use this instead.
export function getOrInsert<K, V>(map: Map<K, V>, key: K, make: (key: K) => V): V {
	const existing = map.get(key);
	if (existing !== undefined) return existing;
	const created = make(key);
	map.set(key, created);
	return created;
}
