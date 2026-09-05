// Minimal emitter. Core signals what happened; the UI decides what that looks like.
// Keeping this here is what lets core stay free of the DOM and run under Deno.

type Handler = (payload?: any) => void;

const handlers = new Map<string, Set<Handler>>();

export function on(name: string, fn: Handler): () => void {
	let set = handlers.get(name);
	if (!set) {
		set = new Set();
		handlers.set(name, set);
	}
	set.add(fn);
	return () => {
		handlers.get(name)?.delete(fn);
	};
}

export function emit(name: string, payload?: unknown): void {
	const set = handlers.get(name);
	if (!set) return;
	for (const fn of set) fn(payload);
}

let muted = false;

// Offline catch-up replays hours of game time. Nobody wants that backlog read out.
export function setMuted(value: boolean): void {
	muted = value;
}

export function announce(msg: string): void {
	if (muted) return;
	emit("announce", msg);
}

export function requestRender(): void {
	emit("render");
}

// Used by tests and the simulator between runs.
export function clearHandlers(): void {
	handlers.clear();
}
