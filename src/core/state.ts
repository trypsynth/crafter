import { RESOURCES } from "../content/resources.ts";
import { BUILDINGS } from "../content/buildings.ts";
import { now } from "./clock.ts";
import { random, randomSeed } from "./rng.ts";
import { TREASURE_GAP_SPREAD_MS, TREASURE_MIN_GAP_MS } from "./constants.ts";
import { SAVE_VERSION } from "./migrations.ts";
import { keys } from "./util.ts";
import type { BuildingState, GameState, ProductState, ResourceKey } from "./types.ts";

export function deepClone<T>(obj: T): T {
	return JSON.parse(JSON.stringify(obj)) as T;
}

export function deepMerge(dst: Record<string, any>, src: Record<string, any>): Record<string, any> {
	for (const key of Object.keys(src)) {
		if (src[key] !== null && typeof src[key] === "object" && !Array.isArray(src[key])) {
			if (typeof dst[key] !== "object" || dst[key] === null) dst[key] = {};
			deepMerge(dst[key], src[key]);
		} else {
			dst[key] = src[key];
		}
	}
	return dst;
}

function emptyInventory(): Record<ResourceKey, number> {
	return Object.fromEntries(keys(RESOURCES).map((k) => [k, 0])) as Record<ResourceKey, number>;
}

function freshBuildings(): Record<string, BuildingState> {
	return Object.fromEntries(
		Object.keys(BUILDINGS).map((bldKey) => {
			const products = Object.fromEntries(
				Object.entries(BUILDINGS[bldKey].products).map(([pk, pcfg]) => {
					const pst: ProductState = {
						unlocked: pcfg.startsUnlocked ?? false,
						enabled: true,
						slots: [],
						manual: { active: false, progress: 0 },
					};
					return [pk, pst];
				}),
			);
			return [bldKey, { unlocked: bldKey === "lumber_yard", products }];
		}),
	);
}

// Built on each call rather than cloned from a module level constant, so the treasure
// timer is seeded from the current clock and a seeded simulator run stays reproducible.
export function freshState(): GameState {
	return {
		version: SAVE_VERSION,
		rngState: randomSeed(),
		gold: 0,
		lastTick: null,
		inventory: emptyInventory(),
		storage: { tier: 0 },
		stats: { goldEarned: 0, soldByResource: {}, treasureChestsOpened: 0 },
		treasure: { nextSpawn: now() + TREASURE_MIN_GAP_MS + random() * TREASURE_GAP_SPREAD_MS, activeUntil: 0 },
		quests: { active: [], completed: [], baselines: {}, rerolls: 0 },
		prestige: {
			runs: 0,
			rewards: [],
			completedQuestIds: [],
			seenBuildings: [],
			accumulatedStats: {
				goldEarned: 0,
				soldByResource: {},
				storageUpgrades: 0,
				totalSlots: 0,
				maxSlotsByProduct: {},
				totalSlotsByProduct: {},
				treasureChestsOpened: 0,
			},
		},
		buildings: freshBuildings(),
	};
}

// Live binding. Modules that import this see reassignments made through setState.
export let state: GameState = freshState();

export function setState(next: GameState): void {
	state = next;
}

export interface Runtime {
	nextSlotId: number;
	stallAnnounced: Record<string, "pending" | true>;
	selectedBuilding: string | null;
}

// Session scoped bookkeeping that is never saved.
export const runtime: Runtime = {
	nextSlotId: 0,
	stallAnnounced: {},
	selectedBuilding: null,
};
