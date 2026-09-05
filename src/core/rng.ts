// Single source of randomness. Treasure spawns, quest draws and any future market
// noise all draw from here.
//
// The generator is mulberry32: its whole state is one 32 bit integer, so it rides
// along in the save file. That makes a run reproducible, and it stops a reload from
// being a free reroll, because coming back lands on the same draw you already saw.

let cursor = (Math.random() * 2 ** 32) >>> 0;
let override: (() => number) | null = null;

export function random(): number {
	if (override) return override();
	cursor = (cursor + 0x6D2B79F5) | 0;
	let t = Math.imul(cursor ^ (cursor >>> 15), 1 | cursor);
	t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
	return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

// Replaces the generator outright. Tests and the simulator use this; the game does not.
export function setRng(fn: (() => number) | null): void {
	override = fn;
}

export function seedRng(seed: number): void {
	cursor = seed | 0;
	override = null;
}

export function rngState(): number {
	return cursor;
}

export function setRngState(n: number): void {
	cursor = n | 0;
}

export function randomSeed(): number {
	return (Math.random() * 2 ** 32) >>> 0;
}

// Comparator for the shuffle idiom used when drawing quests.
export function shuffle(): number {
	return random() - 0.5;
}
