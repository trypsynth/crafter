// Runs one archetype through the real game core on a virtual clock.
//
// The player is modelled as sessions on a calendar, not as a stream of moves, because
// when someone plays decides as much as how well they play. Between sessions the clock
// jumps and the same offline catch-up the browser uses fills the gap.

import { freshState, runtime, setState, state } from "../core/state.ts";
import { setClock } from "../core/clock.ts";
import { seedRng, setRng } from "../core/rng.ts";
import { clearHandlers, setMuted } from "../core/events.ts";
import { setBackend } from "../core/storage.ts";
import { advanceTo } from "../core/sim.ts";
import { checkQuestCompletion, drawQuests, isGameComplete } from "../core/quests.ts";
import { clearRecording } from "../core/journal.ts";
import { storageMax, totalItems } from "../core/economy.ts";
import { MetricsRecorder, type RunMetrics } from "./metrics.ts";
import { act, newPolicyState } from "./policy.ts";
import type { ActionKind } from "./policy.ts";
import type { Archetype } from "./archetypes.ts";

const T0 = 1_700_000_000_000;
const DAY_MS = 24 * 3600 * 1000;
const AWAKE_START_H = 8;
const AWAKE_HOURS = 16;

export interface RunOptions {
	archetype: Archetype;
	seed: number;
	maxDays: number;
	/** Safety valve so a pathological policy cannot spin forever. */
	maxActions?: number;
}

export interface RunResult extends RunMetrics {
	archetype: string;
	seed: number;
	days: number;
	actionCounts: Record<string, number>;
}

function resetWorld(seed: number): void {
	setRng(null);
	seedRng(seed);
	setBackend(null);
	clearHandlers();
	setMuted(true);
	clearRecording();
	setState(freshState());
	runtime.nextSlotId = 0;
	runtime.stallAnnounced = {};
	runtime.selectedBuilding = "lumber_yard";
	state.lastTick = T0;
	drawQuests();
}

/** Start times, in ms from midnight, for one day of play. */
function sessionStarts(arch: Archetype): number[] {
	const window = AWAKE_HOURS * 3600 * 1000;
	const start = AWAKE_START_H * 3600 * 1000;
	if (arch.pattern === "continuous") return [start];
	const gap = window / arch.checkInsPerDay;
	return Array.from({ length: arch.checkInsPerDay }, (_, i) => start + Math.round(i * gap));
}

export function runSimulation(opts: RunOptions): RunResult {
	const { archetype: arch, seed, maxDays } = opts;
	const maxActions = opts.maxActions ?? 5_000_000;
	let clock = T0;
	setClock(() => clock);
	resetWorld(seed);

	const metrics = new MetricsRecorder(T0);
	const policy = newPolicyState();
	const secondsPerAction = 60 / arch.actionsPerMinute;
	// With nothing affordable a player waits rather than clicking. Skipping ahead keeps
	// the wait in the numbers as dead time while costing almost nothing to simulate.
	const IDLE_SECONDS = 30;
	let actions = 0;
	let completed = false;
	const actionCounts: Record<string, number> = {};

	outer: for (let day = 0; day < maxDays; day++) {
		const playsToday = arch.daysPlayedPerWeek >= 7 || day % 7 < arch.daysPlayedPerWeek;
		if (playsToday) {
			for (const startOfSession of sessionStarts(arch)) {
				const sessionStart = T0 + day * DAY_MS + startOfSession;
				if (sessionStart > clock) clock = sessionStart;
				advanceTo(clock);
				const sessionEnd = clock + arch.sessionMinutes * 60_000;
				let idle = false;
				while (clock < sessionEnd) {
					const stepSeconds = idle ? IDLE_SECONDS : secondsPerAction;
					clock += stepSeconds * 1000;
					advanceTo(clock);
					checkQuestCompletion();
					const stalled = totalItems() >= storageMax();
					const kind: ActionKind = act(arch, policy);
					actionCounts[kind] = (actionCounts[kind] ?? 0) + 1;
					idle = kind === "idle";
					metrics.observe(clock, stepSeconds / 60, { couldAct: !idle, stalled });
					if (++actions >= maxActions) break outer;
					if (isGameComplete()) {
						metrics.markEraComplete(clock);
						completed = true;
						break outer;
					}
				}
			}
		}
		// Sleep, or the rest of a day not played at all.
		const nextDayStart = T0 + (day + 1) * DAY_MS + AWAKE_START_H * 3600 * 1000;
		if (nextDayStart > clock) {
			clock = nextDayStart;
			advanceTo(clock);
		}
	}

	return {
		...metrics.finish(clock, completed),
		archetype: arch.name,
		seed,
		days: (clock - T0) / DAY_MS,
		actionCounts,
	};
}
