// Accuracy tool B: replay a recorded browser session through the headless core and
// check the result matches what the browser actually held.
//
// The simulator and the game share one core, but "share one core" is a claim, not a
// fact, until something checks it. This is that check. Every balance number downstream
// is only as trustworthy as this comparison.

import {
	addSlot,
	doFixBottleneck,
	manualProduce,
	openTreasure,
	sellAll,
	sellProduct,
	sellSlot,
	toggleProductEnabled,
	unlockBuilding,
	unlockProduct,
	upgradeStorage,
} from "../core/actions.ts";
import { rerollQuest } from "../core/quests.ts";
import { applyPrestigeReset, victoryNewGame } from "../core/prestige.ts";
import { runtime, setState, state } from "../core/state.ts";
import { setClock } from "../core/clock.ts";
import { setRng, setRngState } from "../core/rng.ts";
import { clearHandlers, setMuted } from "../core/events.ts";
import { setBackend } from "../core/storage.ts";
import { advanceTo } from "../core/sim.ts";
import type { JournalParam, Recording } from "../core/journal.ts";
import type { GameState, ProductKey, ResourceKey } from "../core/types.ts";

type Applier = (p: JournalParam[]) => void;

const ACTIONS: Record<string, Applier> = {
	build: ([b]) => unlockBuilding(b as string),
	unlock: ([b, p]) => unlockProduct(b as string, p as ProductKey),
	addSlot: ([b, p]) => addSlot(b as string, p as ProductKey),
	sellSlot: ([b, p]) => sellSlot(b as string, p as ProductKey),
	manual: ([b, p]) => manualProduce(b as string, p as ProductKey),
	storage: () => upgradeStorage(),
	sellAll: () => sellAll(),
	sell: ([r]) => sellProduct(r as ResourceKey),
	toggle: ([b, p]) => toggleProductEnabled(b as string, p as ProductKey),
	treasure: () => openTreasure(),
	fixBottleneck: () => doFixBottleneck(),
	reroll: ([i]) => rerollQuest(Number(i)),
	prestige: () => applyPrestigeReset(),
	newGame: () => victoryNewGame(),
};

export interface ReplayResult {
	applied: number;
	skipped: string[];
	endedAt: number;
	state: GameState;
}

// Fields that legitimately differ between a browser session and a replay, so comparing
// them would produce false alarms rather than real ones.
const VOLATILE = new Set(["lastTick", "rngState"]);

export function stateFingerprint(s: GameState): string {
	return JSON.stringify(s, (key, value) => (VOLATILE.has(key) ? undefined : value));
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

export function replay(recording: Recording): ReplayResult {
	let clock = recording.startedAt;
	setClock(() => clock);
	setRng(null);
	setRngState(recording.seed);
	setBackend(null);
	clearHandlers();
	setMuted(true);
	setState(JSON.parse(JSON.stringify(recording.startState)) as GameState);
	state.lastTick = recording.startedAt;
	// Session bookkeeping lives outside the save, so it has to be rebuilt from the start
	// state. Leaving it from a previous replay makes slot ids drift and every comparison
	// fail for a reason that has nothing to do with the game.
	runtime.stallAnnounced = {};
	runtime.selectedBuilding = null;
	runtime.nextSlotId = highestSlotId();

	const skipped: string[] = [];
	let applied = 0;
	for (const entry of recording.entries) {
		clock = entry.t;
		advanceTo(clock);
		const fn = ACTIONS[entry.a];
		if (!fn) {
			skipped.push(entry.a);
			continue;
		}
		fn(entry.p ?? []);
		applied++;
	}
	return { applied, skipped, endedAt: clock, state };
}

// Replays, then advances to the moment the browser snapshot was taken, so the two are
// compared at the same point in time.
export function replayTo(recording: Recording, endTimeMs: number): ReplayResult {
	const result = replay(recording);
	let clock = result.endedAt;
	setClock(() => clock);
	clock = endTimeMs;
	advanceTo(clock);
	return { ...result, endedAt: clock, state };
}

export function knownActions(): string[] {
	return Object.keys(ACTIONS);
}
