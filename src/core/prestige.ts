import { drawQuests, isGameComplete, questById } from "./quests.ts";
import { freshState, runtime, setState, state } from "./state.ts";
import { getPrestigeBonus, getPrestigeMult } from "./economy.ts";
import { announce, emit, requestRender } from "./events.ts";
import { save } from "./save.ts";
import { record } from "./journal.ts";
import { now } from "./clock.ts";
import { entries } from "./util.ts";
import type { ResourceKey, RewardType } from "./types.ts";

export interface PrestigeSummary {
	totalActive: number;
	completedCount: number;
	incomplete: number;
}

export function prestigeResetSummary(): PrestigeSummary {
	const totalActive = state.quests.active.length;
	const completedCount = state.quests.completed.filter(Boolean).length;
	return { totalActive, completedCount, incomplete: totalActive - completedCount };
}

export function applyPrestigeReset(): void {
	record("prestige");
	const { completedCount } = prestigeResetSummary();
	if (completedCount === 0) return;
	for (const [bk, bst] of entries(state.buildings)) {
		if (bst.unlocked && !state.prestige.seenBuildings.includes(bk)) state.prestige.seenBuildings.push(bk);
	}
	for (let i = 0; i < state.quests.active.length; i++) {
		if (!state.quests.completed[i]) continue;
		const qid = state.quests.active[i];
		const def = questById(qid);
		if (def) {
			state.prestige.rewards.push(def.reward);
			if (!state.prestige.completedQuestIds.includes(qid)) state.prestige.completedQuestIds.push(qid);
		}
	}
	const acc = state.prestige.accumulatedStats;
	state.prestige.runs++;
	acc.goldEarned += state.stats.goldEarned;
	acc.storageUpgrades += state.storage.tier;
	acc.treasureChestsOpened += state.stats.treasureChestsOpened ?? 0;
	for (const [bk, bst] of entries(state.buildings)) {
		for (const [pk, pst] of entries(bst.products)) {
			acc.totalSlots += pst.slots.length;
			const key = `${bk}.${pk}`;
			acc.maxSlotsByProduct[key] = Math.max(acc.maxSlotsByProduct[key] ?? 0, pst.slots.length);
			acc.totalSlotsByProduct[key] = (acc.totalSlotsByProduct[key] ?? 0) + pst.slots.length;
		}
	}
	for (const [k, v] of entries(state.stats.soldByResource as Record<ResourceKey, number>)) {
		acc.soldByResource[k] = (acc.soldByResource[k] ?? 0) + v;
	}
	const incompleteActive = state.quests.active.filter((_, i) => !state.quests.completed[i]);
	const incompleteBaselines: Record<string, number> = {};
	for (const id of incompleteActive) {
		if (state.quests.baselines?.[id] !== undefined) incompleteBaselines[id] = state.quests.baselines[id];
	}
	const preservedPrestige = state.prestige;
	setState(freshState());
	state.prestige = preservedPrestige;
	state.quests.active = incompleteActive;
	state.quests.completed = new Array(incompleteActive.length).fill(false);
	state.quests.baselines = incompleteBaselines;
	state.gold = getPrestigeBonus("starting_gold");
	state.lastTick = now();
	resetRuntime();
	emit("prestige:reset");
	drawQuests();
	save();
	requestRender();
	announce(`Run ${(state.prestige.runs + 1).toLocaleString()} started! ${completedCount.toLocaleString()} reward${completedCount === 1 ? "" : "s"} earned.`);
	if (isGameComplete() && !state.prestige.victoryShown) emit("victory");
}

export function victoryNewGame(): void {
	record("newGame");
	const victoryCount = (state.prestige.victoryCount ?? 0) + 1;
	setState(freshState());
	state.prestige.victoryCount = victoryCount;
	resetRuntime();
	emit("victory:newgame");
	drawQuests();
	save();
	requestRender();
	announce("New legacy begun!");
}

export function dismissVictory(): void {
	state.prestige.victoryShown = true;
	save();
}

function resetRuntime(): void {
	runtime.nextSlotId = 0;
	runtime.stallAnnounced = {};
	runtime.selectedBuilding = "lumber_yard";
}

interface SummaryDef {
	type: RewardType;
	isMult?: boolean;
	isDiscount?: boolean;
	fmt: (n: number) => string;
}

export function computePrestigeSummary(): string[] {
	const defs: SummaryDef[] = [
		{ type: "starting_gold", fmt: (n) => `+${n.toLocaleString()} Starting Gold` },
		{ type: "slot_cost_pct", isMult: true, isDiscount: true, fmt: (n) => `Slot Costs -${n.toLocaleString()}%` },
		{ type: "unlock_cost_pct", isMult: true, isDiscount: true, fmt: (n) => `Unlock Costs -${n.toLocaleString()}%` },
		{ type: "build_cost_pct", isMult: true, isDiscount: true, fmt: (n) => `Build Costs -${n.toLocaleString()}%` },
		{ type: "sell_price_pct", isMult: true, isDiscount: false, fmt: (n) => `Sale Prices +${n.toLocaleString()}%` },
		{ type: "storage_tier", fmt: (n) => `+${n.toLocaleString()} Starting Storage Tier${n > 1 ? "s" : ""}` },
		{ type: "cycle_speed_pct", isMult: true, isDiscount: false, fmt: (n) => `Production Speed +${n.toLocaleString()}%` },
		{ type: "treasure_gold_pct", isMult: true, isDiscount: false, fmt: (n) => `Treasure Gold +${n.toLocaleString()}%` },
	];
	return defs.map((d) => {
		if (d.isMult) {
			const mult = getPrestigeMult(d.type);
			const val = d.isDiscount ? Math.round((1 - mult) * 100) : Math.round((mult - 1) * 100);
			return val > 0 ? d.fmt(val) : null;
		}
		const total = getPrestigeBonus(d.type);
		return total > 0 ? d.fmt(total) : null;
	}).filter((s): s is string => s !== null);
}
