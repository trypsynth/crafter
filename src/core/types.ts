import type { RESOURCES } from "../content/resources.ts";
import type { BUILDING_CONFIG } from "../content/buildings.ts";

// Keys come from the content objects themselves, so adding a resource or a building
// updates every signature that touches one and a typo becomes a compile error.
export type ResourceKey = keyof typeof RESOURCES;
export type BuildingKey = keyof typeof BUILDING_CONFIG;
export type ProductKey = string;

export interface Resource {
	label: string;
	singular: string;
	price: number;
}

export interface ProductConfig {
	outputKey: ResourceKey;
	outputAmt: number;
	inputs: Partial<Record<ResourceKey, number>>;
	baseCycleMs: number;
	unlockCost: number;
	baseSlotCost: number;
	startsUnlocked?: boolean;
	prereqProduct?: ProductKey | null;
}

export interface BuildingPrereq {
	building: string;
	product?: ProductKey;
}

export interface BuildingConfig {
	label: string;
	desc: string;
	buildCost: number;
	slotCostExponent?: number;
	prereq: BuildingPrereq | null;
	products: Record<ProductKey, ProductConfig>;
}

export type RewardType =
	| "starting_gold"
	| "slot_cost_pct"
	| "unlock_cost_pct"
	| "build_cost_pct"
	| "sell_price_pct"
	| "storage_tier"
	| "cycle_speed_pct"
	| "treasure_gold_pct";

export interface Reward {
	type: RewardType;
	amount: number;
}

export type QuestType = "sell" | "slots" | "total_slots" | "build" | "unlock" | "storage" | "gold_earned" | "treasure";

export interface QuestTier {
	target: number;
	label: string;
	reward: Reward;
}

export interface QuestChain {
	id: string;
	type: QuestType;
	resource?: ResourceKey;
	bld?: string;
	product?: ProductKey;
	prereq?: string;
	tiers: QuestTier[];
}

export interface QuestDef {
	id: string;
	chainId: string;
	tierIndex: number;
	label: string;
	type: QuestType;
	resource?: ResourceKey;
	bld?: string;
	product?: ProductKey;
	target: number;
	reward: Reward;
	rewardLabel: string;
}

export interface Slot {
	id: number;
	progress: number;
}

export interface ManualCraft {
	active: boolean;
	progress: number;
}

export interface ProductState {
	unlocked: boolean;
	enabled: boolean;
	slots: Slot[];
	manual: ManualCraft;
}

export interface BuildingState {
	unlocked: boolean;
	products: Record<ProductKey, ProductState>;
}

export interface AccumulatedStats {
	goldEarned: number;
	soldByResource: Partial<Record<ResourceKey, number>>;
	storageUpgrades: number;
	totalSlots: number;
	maxSlotsByProduct: Record<string, number>;
	totalSlotsByProduct: Record<string, number>;
	treasureChestsOpened: number;
}

export interface PrestigeState {
	runs: number;
	rewards: Reward[];
	completedQuestIds: string[];
	seenBuildings: string[];
	accumulatedStats: AccumulatedStats;
	victoryShown?: boolean;
	victoryCount?: number;
}

export interface GameState {
	gold: number;
	lastTick: number | null;
	inventory: Record<ResourceKey, number>;
	storage: { tier: number };
	stats: {
		goldEarned: number;
		soldByResource: Partial<Record<ResourceKey, number>>;
		treasureChestsOpened: number;
	};
	treasure: { nextSpawn: number; activeUntil: number };
	quests: {
		active: string[];
		completed: boolean[];
		baselines: Record<string, number>;
		rerolls: number;
	};
	prestige: PrestigeState;
	buildings: Record<string, BuildingState>;
}

export interface ProductionBalance {
	resourceKey: ResourceKey;
	supply: number;
	demand: number;
	net: number;
}

export interface ProductionRow {
	resourceKey: ResourceKey;
	enabled: boolean;
	slots: number;
	outputAmt: number;
	baseCycleMs: number;
}

export interface ProductionOverview {
	productRows: ProductionRow[];
	hasChain: boolean;
	deficits: ProductionBalance[];
	balances: ProductionBalance[];
	efficiencyPct: number | null;
}

export interface PurchaseSuggestion {
	bldKey: string;
	productKey: ProductKey;
	cost: number;
	label: string;
	isDeficit: boolean;
}

export interface StorageBackend {
	getItem(key: string): string | null;
	setItem(key: string, value: string): void;
	removeItem(key: string): void;
}
