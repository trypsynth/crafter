// One decision function, parameterised by archetype. Skill mostly changes how a player
// ranks the same options, not which options exist, so a poor player and a good one make
// the same kinds of move at different quality rather than playing different games.
//
// A turn is split into reflexes and a decision. Grabbing a chest and clearing a full store
// are reflexes: they cost a click but no thought, and a player does them on the way to
// doing something else. Only the spending choice is the decision. Treating them as equals
// is what made an earlier version of this spend 98% of its turns pressing sell, buy almost
// nothing, and report a game that could not be finished.

import { BUILDINGS } from "../content/buildings.ts";
import { RESOURCES } from "../content/resources.ts";
import { state } from "../core/state.ts";
import {
	buildCost,
	getProductionOverview,
	nextBuildableBuilding,
	nextSlotCost,
	prestigeSpeedMult,
	storageMax,
	storageUpgradeCost,
	totalItems,
	unlockCost,
} from "../core/economy.ts";
import { addSlot, manualProduce, openTreasure, sellAll, unlockBuilding, unlockProduct, upgradeStorage } from "../core/actions.ts";
import { applyPrestigeReset, prestigeResetSummary } from "../core/prestige.ts";
import { getQuestProgress, questBaseline, questById, rerollQuest } from "../core/quests.ts";
import { now } from "../core/clock.ts";
import type { Archetype } from "./archetypes.ts";
import type { ResourceKey } from "../core/types.ts";

export type ActionKind = "sell" | "prestige" | "build" | "unlock" | "storage" | "slot" | "manual" | "reroll" | "idle";

/** Carried across a run so the policy can react to a pattern, not just to this instant. */
export interface PolicyState {
	/** Turns spent against a nearly full store since the last expansion. */
	jam: number;
	/** Rerolls bought this run. The fee doubles each time, so this cannot run away. */
	rerolls: number;
	/** Turns since a quest last completed, used to notice a run that has stopped moving. */
	sinceProgress: number;
	/** Quests banked at the last check, for spotting that completion. */
	lastBanked: number;
}

export function newPolicyState(): PolicyState {
	return { jam: 0, rerolls: 0, sinceProgress: 0, lastBanked: -1 };
}

interface Candidate {
	bldKey: string;
	productKey: string;
	cost: number;
	score: number;
}

function sellThreshold(arch: Archetype): number {
	// A sharp player clears stock well before the store jams; a careless one waits until
	// production has already stopped.
	return 0.95 - 0.35 * arch.skill;
}

// How many crowded turns a player tolerates before deciding the store is the problem.
// An instantaneous "is it full right now" test never survives a sell, so the pressure has
// to be remembered across turns.
function jamTolerance(arch: Archetype): number {
	return Math.max(1, Math.round(8 - 6 * arch.skill));
}

function slotCandidates(arch: Archetype): Candidate[] {
	const { deficits } = getProductionOverview();
	const deficitOf = new Map<ResourceKey, number>();
	for (const d of deficits) deficitOf.set(d.resourceKey, Math.abs(d.net));
	const speed = prestigeSpeedMult();
	const out: Candidate[] = [];
	for (const [bk, bst] of Object.entries(state.buildings)) {
		if (!bst.unlocked) continue;
		for (const [pk, pcfg] of Object.entries(BUILDINGS[bk].products)) {
			if (!bst.products[pk].unlocked) continue;
			const cost = nextSlotCost(bk, pk);
			if (cost <= 0 || cost > state.gold) continue;
			const perSec = pcfg.outputAmt * speed / (pcfg.baseCycleMs / 1000);
			const revenue = perSec * RESOURCES[pcfg.outputKey].price;
			const w = arch.weights;
			let score = w.revenuePerGold * (revenue / cost);
			const deficit = deficitOf.get(pcfg.outputKey);
			if (deficit !== undefined) score *= 1 + w.bottleneck * Math.min(4, deficit);
			score *= 1 + w.depth * Math.log10(1 + RESOURCES[pcfg.outputKey].price) / 10;
			out.push({ bldKey: bk, productKey: pk, cost, score });
		}
	}
	return out;
}

function pickSlot(arch: Archetype): Candidate | null {
	const candidates = slotCandidates(arch);
	if (candidates.length === 0) return null;
	if (arch.skill >= 0.6) return candidates.reduce((best, c) => (c.score > best.score ? c : best));
	// A less careful player buys whatever is cheapest and available.
	return candidates.reduce((best, c) => (c.cost < best.cost ? c : best));
}

function nextUnlockable(): { bldKey: string; productKey: string; cost: number } | null {
	let best: { bldKey: string; productKey: string; cost: number } | null = null;
	for (const [bk, bst] of Object.entries(state.buildings)) {
		if (!bst.unlocked) continue;
		for (const [pk, pcfg] of Object.entries(BUILDINGS[bk].products)) {
			if (bst.products[pk].unlocked) continue;
			if (pcfg.prereqProduct && !bst.products[pcfg.prereqProduct].unlocked) continue;
			const cost = unlockCost(bk, pk);
			if (cost > state.gold) continue;
			if (!best || cost < best.cost) best = { bldKey: bk, productKey: pk, cost };
		}
	}
	return best;
}

// How long a player watches a run go nowhere before cutting it short. A sharp one gives
// up quickly; a casual one keeps poking at it far longer.
function patience(arch: Archetype): number {
	return Math.round(arch.actionsPerMinute * (30 + 120 * (1 - arch.skill)));
}

function wantsPrestige(arch: Archetype, ps: PolicyState): boolean {
	const { totalActive, completedCount } = prestigeResetSummary();
	if (totalActive === 0 || completedCount === 0) return false;
	if (completedCount >= totalActive) return true;
	// Unfinished quests carry into the next run, so resetting never destroys one. Once a
	// run has clearly stopped moving, banking what is done and starting again beats
	// waiting on a target that is out of reach this time round.
	return ps.sinceProgress > patience(arch);
}

// The one quest holding up a reset, if it looks hopeless enough to pay to replace. The fee
// doubles every time, so this is a handful of decisions per run rather than a habit.
const REROLL_LIMIT = 6;
const REROLL_STUCK_FRACTION = 0.25;

function rerollTarget(arch: Archetype, ps: PolicyState): number {
	if (!arch.usesRerolls || ps.rerolls >= REROLL_LIMIT) return -1;
	const { totalActive, completedCount } = prestigeResetSummary();
	if (totalActive === 0 || completedCount < totalActive - 1) return -1;
	for (let i = 0; i < state.quests.active.length; i++) {
		if (state.quests.completed[i]) continue;
		const id = state.quests.active[i];
		const def = questById(id);
		if (!def) continue;
		const { current, target } = getQuestProgress(def, questBaseline(id, def));
		if (target > 0 && current / target < REROLL_STUCK_FRACTION && rerollCostAffordable()) return i;
	}
	return -1;
}

function rerollCostAffordable(): boolean {
	return Math.round(250 * Math.pow(2, state.quests.rerolls ?? 0)) <= state.gold;
}

// Hand crafting only matters while a single item is still worth a real share of what you
// have. Nobody clicks out logs one at a time on a fortune, so past this point the option
// is simply not on the table.
const MANUAL_RELEVANCE_GOLD = 25_000;

function manualTarget(): { bldKey: string; productKey: string } | null {
	if (state.gold > MANUAL_RELEVANCE_GOLD) return null;
	for (const [bk, bst] of Object.entries(state.buildings)) {
		if (!bst.unlocked) continue;
		for (const [pk, pcfg] of Object.entries(BUILDINGS[bk].products)) {
			const pst = bst.products[pk];
			if (!pst.unlocked || !pst.enabled || pst.manual.active) continue;
			if (Object.keys(pcfg.inputs).length === 0) return { bldKey: bk, productKey: pk };
		}
	}
	return null;
}

/** Takes one turn: any reflexes, then at most one spending decision. */
export function act(arch: Archetype, ps: PolicyState): ActionKind {
	const cap = storageMax();
	const held = totalItems();
	if (held >= 0.9 * cap) ps.jam++;
	const banked = state.prestige.completedQuestIds.length + state.quests.completed.filter(Boolean).length;
	if (banked > ps.lastBanked) {
		ps.sinceProgress = 0;
		ps.lastBanked = banked;
	} else ps.sinceProgress++;

	// Reflexes: a click, but not a choice.
	if (state.treasure.activeUntil > now()) openTreasure();
	let sold = false;
	if (held >= sellThreshold(arch) * cap) {
		sellAll();
		sold = true;
	}

	// The decision.
	if (ps.jam >= jamTolerance(arch) && storageUpgradeCost() <= state.gold) {
		upgradeStorage();
		ps.jam = 0;
		return "storage";
	}
	if (wantsPrestige(arch, ps)) {
		applyPrestigeReset();
		ps.jam = 0;
		ps.rerolls = 0;
		ps.sinceProgress = 0;
		ps.lastBanked = state.prestige.completedQuestIds.length;
		return "prestige";
	}
	const nextBld = nextBuildableBuilding();
	if (nextBld && buildCost(nextBld) <= state.gold) {
		unlockBuilding(nextBld);
		return "build";
	}
	const unlockable = nextUnlockable();
	if (unlockable) {
		unlockProduct(unlockable.bldKey, unlockable.productKey);
		return "unlock";
	}
	const slot = pickSlot(arch);
	if (slot) {
		addSlot(slot.bldKey, slot.productKey);
		return "slot";
	}
	const stuck = rerollTarget(arch, ps);
	if (stuck >= 0) {
		rerollQuest(stuck);
		ps.rerolls++;
		return "reroll";
	}
	if (arch.usesManualCraft) {
		const target = manualTarget();
		if (target) {
			manualProduce(target.bldKey, target.productKey);
			return "manual";
		}
	}
	if (!sold && totalItems() > 0) {
		sellAll();
		return "sell";
	}
	return sold ? "sell" : "idle";
}
