// What a run is judged on.
//
// Time to finish is the obvious number and it is not the important one. A game can take
// the right number of weeks and still be miserable, if those weeks are mostly waiting
// with nothing to decide. So the run also records how long the player goes between
// moments that feel like getting somewhere, and how long they spend with nothing they
// can afford and nothing worth doing. Those gaps are measured in minutes of active play,
// not wall clock, because time spent away is not time spent bored.

import { state } from "../core/state.ts";
import { storageMax, totalItems } from "../core/economy.ts";
import { BUILDINGS } from "../content/buildings.ts";

export interface RunMetrics {
	/** Sim ms at which each milestone was first reached. */
	milestones: Record<string, number>;
	/** Minutes of active play between successive progress moments. */
	progressGaps: number[];
	/** Minutes of active play between successive purchases of any kind. */
	purchaseGaps: number[];
	/** Minutes of active play spent unable to afford anything worth buying. */
	deadMinutes: number;
	/** Minutes of active play with production stalled on a full store. */
	stalledMinutes: number;
	activeMinutes: number;
	wallMs: number;
	completed: boolean;
	violations: string[];
}

export const MILESTONES = [
	"build_sawmill",
	"build_workshop",
	"build_forge",
	"build_foundry",
	"build_armoury",
	"build_shipyard",
	"gold_1e6",
	"gold_1e9",
	"gold_1e12",
	"prestige_1",
	"prestige_3",
	"prestige_10",
	"era_complete",
] as const;

interface Counters {
	buildings: number;
	products: number;
	quests: number;
	prestige: number;
	slots: number;
	storageTier: number;
}

function counters(): Counters {
	let buildings = 0;
	let products = 0;
	let slots = 0;
	for (const bst of Object.values(state.buildings)) {
		if (bst.unlocked) buildings++;
		for (const pst of Object.values(bst.products)) {
			if (pst.unlocked) products++;
			slots += pst.slots.length;
		}
	}
	return {
		buildings,
		products,
		slots,
		storageTier: state.storage.tier,
		quests: state.prestige.completedQuestIds.length + state.quests.completed.filter(Boolean).length,
		prestige: state.prestige.runs,
	};
}

export class MetricsRecorder {
	#milestones: Record<string, number> = {};
	#prev: Counters;
	#lastProgressAt: number;
	#lastPurchaseAt: number;
	#progressGaps: number[] = [];
	#purchaseGaps: number[] = [];
	#deadMinutes = 0;
	#stalledMinutes = 0;
	#activeMinutes = 0;
	#violations: string[] = [];
	#startedAt: number;
	/** Active minutes elapsed so far, used as the clock for gap measurements. */
	#activeClock = 0;

	constructor(startedAt: number) {
		this.#startedAt = startedAt;
		this.#prev = counters();
		this.#lastProgressAt = 0;
		this.#lastPurchaseAt = 0;
	}

	/** Called after each slice of active play. `minutes` is how much play just happened. */
	observe(atMs: number, minutes: number, opts: { couldAct: boolean; stalled: boolean }): void {
		this.#activeMinutes += minutes;
		this.#activeClock += minutes;
		if (!opts.couldAct) this.#deadMinutes += minutes;
		if (opts.stalled) this.#stalledMinutes += minutes;

		const now = counters();
		const progressed = now.buildings > this.#prev.buildings ||
			now.products > this.#prev.products ||
			now.quests > this.#prev.quests ||
			now.prestige > this.#prev.prestige;
		if (progressed) {
			this.#progressGaps.push(this.#activeClock - this.#lastProgressAt);
			this.#lastProgressAt = this.#activeClock;
		}
		if (now.slots > this.#prev.slots || now.storageTier > this.#prev.storageTier || progressed) {
			this.#purchaseGaps.push(this.#activeClock - this.#lastPurchaseAt);
			this.#lastPurchaseAt = this.#activeClock;
		}

		this.#checkMilestones(atMs, now);
		this.#checkInvariants(atMs);
		this.#prev = now;
	}

	#mark(name: string, atMs: number): void {
		if (this.#milestones[name] === undefined) this.#milestones[name] = atMs - this.#startedAt;
	}

	#checkMilestones(atMs: number, now: Counters): void {
		for (const bldKey of Object.keys(BUILDINGS)) {
			if (bldKey === "lumber_yard") continue;
			if (state.buildings[bldKey].unlocked) this.#mark(`build_${bldKey}`, atMs);
		}
		const lifetimeGold = state.prestige.accumulatedStats.goldEarned + state.stats.goldEarned;
		if (lifetimeGold >= 1e6) this.#mark("gold_1e6", atMs);
		if (lifetimeGold >= 1e9) this.#mark("gold_1e9", atMs);
		if (lifetimeGold >= 1e12) this.#mark("gold_1e12", atMs);
		if (now.prestige >= 1) this.#mark("prestige_1", atMs);
		if (now.prestige >= 3) this.#mark("prestige_3", atMs);
		if (now.prestige >= 10) this.#mark("prestige_10", atMs);
	}

	#checkInvariants(atMs: number): void {
		if (this.#violations.length > 20) return;
		if (!Number.isFinite(state.gold)) this.#violations.push(`gold is ${state.gold} at ${atMs}`);
		if (state.gold < 0) this.#violations.push(`gold went negative (${state.gold}) at ${atMs}`);
		const held = totalItems();
		const cap = storageMax();
		if (held > cap) this.#violations.push(`storage ${held} over cap ${cap} at ${atMs}`);
		for (const [k, v] of Object.entries(state.inventory)) {
			if (!Number.isFinite(v) || v < 0) {
				this.#violations.push(`inventory ${k} is ${v} at ${atMs}`);
				break;
			}
		}
	}

	markEraComplete(atMs: number): void {
		this.#mark("era_complete", atMs);
	}

	finish(endedAt: number, completed: boolean): RunMetrics {
		return {
			milestones: this.#milestones,
			progressGaps: this.#progressGaps,
			purchaseGaps: this.#purchaseGaps,
			deadMinutes: this.#deadMinutes,
			stalledMinutes: this.#stalledMinutes,
			activeMinutes: this.#activeMinutes,
			wallMs: endedAt - this.#startedAt,
			completed,
			violations: this.#violations,
		};
	}
}

export function percentile(values: number[], p: number): number {
	if (values.length === 0) return 0;
	const sorted = [...values].sort((a, b) => a - b);
	const idx = Math.min(sorted.length - 1, Math.max(0, Math.ceil((p / 100) * sorted.length) - 1));
	return sorted[idx];
}
