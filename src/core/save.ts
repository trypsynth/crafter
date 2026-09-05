import { deepMerge, freshState, runtime, setState, state } from "./state.ts";
import { OFFLINE_CAP_MS, SAVE_KEY } from "./constants.ts";
import { migrate, SaveTooNewError } from "./migrations.ts";
import { rngState, setRngState } from "./rng.ts";
import { advanceTo, STEP_MS } from "./sim.ts";
import { now } from "./clock.ts";
import { announce, setMuted } from "./events.ts";
import { totalItems } from "./economy.ts";
import * as storage from "./storage.ts";
import type { GameState } from "./types.ts";

// Set when a save from a newer build is found. Writing would overwrite progress this
// build cannot read, so the session runs read only instead.
let saveBlocked = false;

export function isSaveBlocked(): boolean {
	return saveBlocked;
}

export function save(): void {
	if (saveBlocked) return;
	state.rngState = rngState();
	storage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function rawSave(): string | null {
	return storage.getItem(SAVE_KEY);
}

export function writeRawSave(text: string): void {
	storage.setItem(SAVE_KEY, text);
}

export function clearSave(): void {
	saveBlocked = false;
	storage.removeItem(SAVE_KEY);
}

export function load(): void {
	const raw = storage.getItem(SAVE_KEY);
	if (!raw) return;
	let parsed: Record<string, any>;
	try {
		parsed = JSON.parse(raw);
	} catch (e) {
		console.error("Save is not valid JSON, starting fresh:", e);
		setState(freshState());
		return;
	}
	let migrated: Record<string, any>;
	try {
		migrated = migrate(parsed);
	} catch (e) {
		if (e instanceof SaveTooNewError) {
			saveBlocked = true;
			console.error(e.message);
			setState(freshState());
			announce("This save was made by a newer version of Crafter. Saving is off so it is not overwritten.");
			return;
		}
		throw e;
	}
	const fresh = freshState();
	deepMerge(fresh as unknown as Record<string, unknown>, migrated);
	const lastTime = fresh.lastTick;
	setState(fresh as GameState);
	setRngState(state.rngState);
	runtime.nextSlotId = highestSlotId();
	if (lastTime !== null) applyOfflineProgress();
}

function highestSlotId(): number {
	let maxId = 0;
	for (const bst of Object.values(state.buildings)) {
		for (const pst of Object.values(bst.products)) {
			for (const slot of pst.slots) {
				if (slot.id > maxId) maxId = slot.id;
			}
		}
	}
	return maxId;
}

// Replays the time away through the same step the live game uses. The old build ran a
// separate one pass estimate here, which under counted anything that fed a later stage
// of a chain, because a stage could only consume what was already in storage when the
// pass reached it.
export function applyOfflineProgress(): number {
	if (state.lastTick === null) return 0;
	const target = now();
	const away = target - state.lastTick;
	if (away < STEP_MS) return 0;
	if (away > OFFLINE_CAP_MS) state.lastTick = target - OFFLINE_CAP_MS;
	const before = totalItems();
	setMuted(true);
	try {
		advanceTo(target);
	} finally {
		setMuted(false);
	}
	state.lastTick = target;
	const gained = totalItems() - before;
	if (gained > 0) announce(`Welcome back! Your workers produced ${gained.toLocaleString()} items while you were away.`);
	return gained;
}
