import { RESOURCES } from "../content/resources.ts";
import { BUILDINGS } from "../content/buildings.ts";
import { state } from "./state.ts";
import { entries, keys } from "./util.ts";
import { SLOT_REFUND_PCT, STORAGE_BASE, STORAGE_BASE_COST, STORAGE_COST_GROWTH, STORAGE_FIRST_UPGRADE, STORAGE_INCREMENT } from "./constants.ts";
import type { ProductionBalance, ProductionOverview, ProductionRow, ProductKey, PurchaseSuggestion, ResourceKey, RewardType } from "./types.ts";

export function totalItems(): number {
	return keys(RESOURCES).reduce((sum, k) => sum + (state.inventory[k] ?? 0), 0);
}

export function storageMax(): number {
	const tier = state.storage.tier + getPrestigeBonus("storage_tier");
	if (tier <= 0) return STORAGE_BASE;
	return STORAGE_FIRST_UPGRADE + ((tier - 1) * STORAGE_INCREMENT);
}

export function nextStorageMax(): number {
	const tier = state.storage.tier + getPrestigeBonus("storage_tier");
	if (tier <= 0) return STORAGE_FIRST_UPGRADE;
	return storageMax() + STORAGE_INCREMENT;
}

export function storageUpgradeCost(): number {
	return Math.round(STORAGE_BASE_COST * Math.pow(STORAGE_COST_GROWTH, state.storage.tier));
}

export function nextSlotCost(bldKey: string, productKey: ProductKey): number {
	const n = state.buildings[bldKey].products[productKey].slots.length;
	const exp = BUILDINGS[bldKey].slotCostExponent ?? 1.5;
	const base = BUILDINGS[bldKey].products[productKey].baseSlotCost * Math.pow(exp, n);
	return Math.round(base * prestigeSlotCostMult());
}

export function lastSlotCost(bldKey: string, productKey: ProductKey): number {
	const n = state.buildings[bldKey].products[productKey].slots.length;
	if (n === 0) return 0;
	const exp = BUILDINGS[bldKey].slotCostExponent ?? 1.5;
	const base = BUILDINGS[bldKey].products[productKey].baseSlotCost * Math.pow(exp, n - 1);
	return Math.round(base * prestigeSlotCostMult());
}

export function slotRefund(bldKey: string, productKey: ProductKey): number {
	return Math.floor(lastSlotCost(bldKey, productKey) * SLOT_REFUND_PCT);
}

export function currentPrice(resourceKey: ResourceKey): number {
	return Math.round(RESOURCES[resourceKey].price * prestigeSellMult());
}

export function buildCost(bldKey: string): number {
	return Math.round(BUILDINGS[bldKey].buildCost * prestigeBuildCostMult());
}

export function unlockCost(bldKey: string, productKey: ProductKey): number {
	return Math.round(BUILDINGS[bldKey].products[productKey].unlockCost * prestigeUnlockCostMult());
}

// Replaces the closures the building config used to carry, so content stays data only.
export function buildingPrereqMet(bldKey: string): boolean {
	const p = BUILDINGS[bldKey].prereq;
	if (!p) return true;
	const bst = state.buildings[p.building];
	if (!bst?.unlocked) return false;
	if (p.product && !bst.products[p.product]?.unlocked) return false;
	return true;
}

export function getPrestigeBonus(type: RewardType): number {
	return state.prestige.rewards.filter((r) => r.type === type).reduce((s, r) => s + r.amount, 0);
}

export function getPrestigeMult(type: RewardType): number {
	const rewards = state.prestige.rewards.filter((r) => r.type === type);
	if (type === "sell_price_pct" || type === "cycle_speed_pct" || type === "treasure_gold_pct") return rewards.reduce((m, r) => m * (1 + r.amount / 100), 1);
	return rewards.reduce((m, r) => m * (1 - r.amount / 100), 1);
}

export const prestigeSlotCostMult = (): number => getPrestigeMult("slot_cost_pct");
export const prestigeSellMult = (): number => getPrestigeMult("sell_price_pct");
export const prestigeBuildCostMult = (): number => getPrestigeMult("build_cost_pct");
export const prestigeUnlockCostMult = (): number => getPrestigeMult("unlock_cost_pct");
export const prestigeSpeedMult = (): number => getPrestigeMult("cycle_speed_pct");
export const prestigeTreasureMult = (): number => getPrestigeMult("treasure_gold_pct");

export function getTreasureBaseValue(): number {
	let maxPrice = 5;
	for (const bldKey of Object.keys(BUILDINGS)) {
		const bst = state.buildings[bldKey];
		if (!bst?.unlocked) continue;
		for (const prodKey of Object.keys(BUILDINGS[bldKey].products)) {
			const pst = bst.products[prodKey];
			if (!pst?.unlocked) continue;
			const price = RESOURCES[BUILDINGS[bldKey].products[prodKey].outputKey].price;
			if (price > maxPrice) maxPrice = price;
		}
	}
	return maxPrice * 100 * (1 + (state.prestige?.runs ?? 0));
}

export function getProductionOverview(): ProductionOverview {
	const productRows: ProductionRow[] = [];
	const supplyRates: Partial<Record<ResourceKey, number>> = {};
	const demandRates: Partial<Record<ResourceKey, number>> = {};
	const cycleSpeedMult = prestigeSpeedMult();
	for (const [bldKey, cfg] of entries(BUILDINGS)) {
		const bst = state.buildings[bldKey];
		if (!bst?.unlocked) continue;
		for (const [productKey, pcfg] of entries(cfg.products)) {
			const pst = bst.products[productKey];
			if (!pst?.unlocked) continue;
			const n = pst.slots.length;
			productRows.push({
				resourceKey: pcfg.outputKey,
				enabled: pst.enabled,
				slots: n,
				outputAmt: pcfg.outputAmt,
				baseCycleMs: pcfg.baseCycleMs,
			});
			if (!pst.enabled || n === 0) continue;
			const actualCycleMs = pcfg.baseCycleMs / cycleSpeedMult;
			supplyRates[pcfg.outputKey] = (supplyRates[pcfg.outputKey] ?? 0) + n * pcfg.outputAmt * 60000 / actualCycleMs;
			for (const [inputKey, inputAmt] of entries(pcfg.inputs as Record<ResourceKey, number>)) {
				demandRates[inputKey] = (demandRates[inputKey] ?? 0) + n * inputAmt * 60000 / actualCycleMs;
			}
		}
	}
	const hasChain = Object.keys(demandRates).length > 0;
	const allKeys = Array.from(
		new Set([
			...keys(supplyRates as Record<ResourceKey, number>),
			...keys(demandRates as Record<ResourceKey, number>),
		]),
	);
	const balances: ProductionBalance[] = allKeys.filter((resourceKey) => RESOURCES[resourceKey]).map((resourceKey) => ({
		resourceKey,
		supply: supplyRates[resourceKey] ?? 0,
		demand: demandRates[resourceKey] ?? 0,
		net: (supplyRates[resourceKey] ?? 0) - (demandRates[resourceKey] ?? 0),
	}));
	const deficits = balances.filter((entry) => entry.demand > 0 && entry.net < -0.05).sort((a, b) => a.net - b.net);
	const totalDemand = Object.values(demandRates).reduce((sum: number, value) => sum + (value ?? 0), 0);
	const fulfillment = totalDemand <= 0 ? 0 : balances.filter((entry) => entry.demand > 0).reduce((sum, entry) => {
		const coverage = Math.min(entry.supply / entry.demand, 1);
		return sum + (entry.demand * coverage);
	}, 0);
	const efficiencyPct = totalDemand <= 0 ? null : Math.round((fulfillment / totalDemand) * 100);
	return { productRows, hasChain, deficits, balances, efficiencyPct };
}

export function bestNextPurchase(): PurchaseSuggestion | null {
	const { deficits } = getProductionOverview();
	const deficitMap: Partial<Record<ResourceKey, number>> = {};
	for (const d of deficits) deficitMap[d.resourceKey] = d.net;
	let best: PurchaseSuggestion | null = null;
	let bestScore = -Infinity;
	for (const [bk, bst] of entries(state.buildings)) {
		if (!bst.unlocked) continue;
		for (const [pk, pcfg] of entries(BUILDINGS[bk].products)) {
			if (!bst.products[pk].unlocked) continue;
			const cost = nextSlotCost(bk, pk);
			if (cost <= 0) continue;
			const outputRate = pcfg.outputAmt * 60000 / pcfg.baseCycleMs;
			let score = (outputRate * currentPrice(pcfg.outputKey)) / cost;
			const deficit = deficitMap[pcfg.outputKey];
			if (deficit !== undefined) score *= 1 + Math.abs(deficit);
			if (score > bestScore) {
				bestScore = score;
				best = {
					bldKey: bk,
					productKey: pk,
					cost,
					label: RESOURCES[pcfg.outputKey].label,
					isDeficit: deficit !== undefined,
				};
			}
		}
	}
	return best;
}

export function nextBuildableBuilding(): string | undefined {
	return Object.keys(BUILDINGS).find((k) => !state.buildings[k].unlocked && buildingPrereqMet(k));
}
