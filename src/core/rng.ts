// Single source of randomness. Treasure spawns, quest draws and any future market
// noise all draw from here so a seeded run reproduces exactly.

let source: () => number = () => Math.random();

export function random(): number {
	return source();
}

export function setRng(fn: () => number): void {
	source = fn;
}

// Comparator for the shuffle idiom used when drawing quests.
export function shuffle(): number {
	return random() - 0.5;
}
