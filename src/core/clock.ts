// Single source of wall clock time. Every time read in the game goes through now().
// The headless simulator replaces the source with a virtual clock so a run can be
// advanced faster than real time and replayed deterministically.

let source: () => number = () => Date.now();

export function now(): number {
	return source();
}

export function setClock(fn: () => number): void {
	source = fn;
}
