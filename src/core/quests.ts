import { BASELINE_QUEST_TYPES, QUEST_CHAINS, QUEST_POOL } from "../content/quests.ts";
import { state } from "./state.ts";
import { QUEST_SLOTS, REROLL_BASE_COST, REROLL_COST_GROWTH } from "./constants.ts";
import { shuffle } from "./rng.ts";
import { announce, emit, requestRender } from "./events.ts";
import { save } from "./save.ts";
import type { QuestDef } from "./types.ts";

export interface QuestProgress {
	current: number;
	target: number;
}

export function questById(id: string): QuestDef | undefined {
	return QUEST_POOL.find((q) => q.id === id);
}

export function eligibleQuestPool(): QuestDef[] {
	const completed = new Set(state.prestige.completedQuestIds);
	const seen = new Set(["lumber_yard", ...state.prestige.seenBuildings]);
	const pool: QuestDef[] = [];
	for (const chain of QUEST_CHAINS) {
		if (chain.prereq && !seen.has(chain.prereq)) continue;
		for (let i = 0; i < chain.tiers.length; i++) {
			const questId = `${chain.id}_t${i}`;
			if (!completed.has(questId)) {
				const q = questById(questId);
				if (q) pool.push(q);
				break;
			}
		}
	}
	return pool;
}

export function isGameComplete(): boolean {
	const completed = new Set(state.prestige.completedQuestIds);
	return QUEST_POOL.every((q) => completed.has(q.id));
}

export function getQuestProgress(def: QuestDef, baseline = 0): QuestProgress {
	const acc = state.prestige.accumulatedStats;
	let raw: number;
	switch (def.type) {
		case "treasure":
			raw = (acc.treasureChestsOpened ?? 0) + (state.stats.treasureChestsOpened ?? 0);
			break;
		case "sell": {
			const key = def.resource!;
			raw = (acc.soldByResource[key] ?? 0) + (state.stats.soldByResource[key] ?? 0);
			break;
		}
		case "slots": {
			const current = state.buildings[def.bld!]?.products[def.product!]?.slots.length ?? 0;
			const key = `${def.bld}.${def.product}`;
			const totalPrev = acc.totalSlotsByProduct?.[key] ?? acc.maxSlotsByProduct?.[key] ?? 0;
			raw = totalPrev + current;
			break;
		}
		case "total_slots": {
			raw = acc.totalSlots;
			for (const bst of Object.values(state.buildings)) {
				for (const pst of Object.values(bst.products)) raw += pst.slots.length;
			}
			break;
		}
		case "build":
			raw = state.buildings[def.bld!]?.unlocked ? 1 : 0;
			break;
		case "unlock":
			raw = state.buildings[def.bld!]?.products[def.product!]?.unlocked ? 1 : 0;
			break;
		case "storage":
			raw = acc.storageUpgrades + state.storage.tier;
			break;
		case "gold_earned":
			raw = acc.goldEarned + state.stats.goldEarned;
			break;
		default:
			raw = 0;
	}
	return { current: Math.max(0, raw - baseline), target: def.target };
}

export function questBaseline(id: string, def: QuestDef): number {
	return BASELINE_QUEST_TYPES.has(def.type) ? (state.quests.baselines?.[id] ?? 0) : 0;
}

export function flushSatisfiedQuests(): void {
	const completed = new Set(state.prestige.completedQuestIds);
	const seen = new Set(["lumber_yard", ...state.prestige.seenBuildings]);
	let changed = false;
	for (const chain of QUEST_CHAINS) {
		if (chain.prereq && !seen.has(chain.prereq)) continue;
		for (let i = 0; i < chain.tiers.length; i++) {
			const questId = `${chain.id}_t${i}`;
			if (completed.has(questId)) continue;
			const q = questById(questId);
			if (!q) break;
			const { current, target } = getQuestProgress(q);
			if (current >= target) {
				state.prestige.completedQuestIds.push(questId);
				state.prestige.rewards.push(q.reward);
				completed.add(questId);
				changed = true;
			} else break;
		}
	}
	if (changed) save();
}

export function rerollCost(): number {
	return Math.round(REROLL_BASE_COST * Math.pow(REROLL_COST_GROWTH, state.quests.rerolls ?? 0));
}

export function rerollQuest(index: number): void {
	const cost = rerollCost();
	if (state.gold < cost) {
		announce(`Need ${cost.toLocaleString()} gold to reroll.`);
		return;
	}
	const pool = eligibleQuestPool();
	const keepIds = new Set(state.quests.active.filter((_, i) => i !== index));
	const available = pool.filter((q) => !keepIds.has(q.id) && q.id !== state.quests.active[index]).sort(shuffle);
	const newQuest = available[0];
	if (!newQuest) {
		announce("No other quests available to reroll into.");
		return;
	}
	state.gold -= cost;
	const oldId = state.quests.active[index];
	const newBaselines = { ...state.quests.baselines };
	delete newBaselines[oldId];
	newBaselines[newQuest.id] = BASELINE_QUEST_TYPES.has(newQuest.type) ? getQuestProgress(newQuest).current : 0;
	state.quests.active[index] = newQuest.id;
	state.quests.completed[index] = false;
	state.quests.baselines = newBaselines;
	state.quests.rerolls = (state.quests.rerolls ?? 0) + 1;
	emit("quests:invalidate");
	requestRender();
	announce(`Quest rerolled for ${cost.toLocaleString()} gold.`);
}

export function drawQuests(): void {
	flushSatisfiedQuests();
	const currentActive = state.quests.active || [];
	const currentCompleted = state.quests.completed || [];
	const currentBaselines = state.quests.baselines || {};
	const newActive: string[] = [];
	const newCompleted: boolean[] = [];
	const newBaselines: Record<string, number> = {};
	for (let i = 0; i < currentActive.length; i++) {
		if (!currentCompleted[i]) {
			const id = currentActive[i];
			newActive.push(id);
			newCompleted.push(false);
			if (currentBaselines[id] !== undefined) newBaselines[id] = currentBaselines[id];
		}
	}
	const pool = eligibleQuestPool();
	const existingIds = new Set(newActive);
	const available = pool.filter((q) => !existingIds.has(q.id)).sort(shuffle);
	while (newActive.length < QUEST_SLOTS && available.length > 0) {
		const q = available.shift()!;
		newActive.push(q.id);
		newCompleted.push(false);
		newBaselines[q.id] = BASELINE_QUEST_TYPES.has(q.type) ? getQuestProgress(q).current : 0;
	}
	state.quests.active = newActive;
	state.quests.completed = newCompleted;
	state.quests.baselines = newBaselines;
}

export function checkQuestCompletion(): void {
	if (!state.quests.active.length) return;
	for (let i = 0; i < state.quests.active.length; i++) {
		if (state.quests.completed[i]) continue;
		const id = state.quests.active[i];
		const def = questById(id);
		if (!def) continue;
		const { current, target } = getQuestProgress(def, questBaseline(id, def));
		if (current >= target) {
			state.quests.completed[i] = true;
			announce(`Quest complete: ${def.label}!`);
		}
	}
}
