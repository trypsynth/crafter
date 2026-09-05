import type { StorageBackend } from "./types.ts";

// Persistence adapter. The browser passes localStorage. The simulator passes an
// in memory object, or nothing at all when a run should not persist.

let backend: StorageBackend | null = null;

export function setBackend(b: StorageBackend | null): void {
	backend = b;
}

export function getItem(key: string): string | null {
	if (!backend) return null;
	try {
		return backend.getItem(key);
	} catch {
		return null;
	}
}

export function setItem(key: string, value: string): void {
	if (!backend) return;
	try {
		backend.setItem(key, value);
	} catch {
		// A full or blocked store must not take the game down.
	}
}

export function removeItem(key: string): void {
	if (!backend) return;
	try {
		backend.removeItem(key);
	} catch {
		// See setItem.
	}
}
