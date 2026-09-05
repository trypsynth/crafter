import { RESOURCES } from "../content/resources.ts";
import { BUILDINGS } from "../content/buildings.ts";
import { runtime, state } from "./state.ts";
import { MANUAL_CLICK_PROGRESS } from "./constants.ts";
import {
	buildCost,
	buildingPrereqMet,
	currentPrice,
	getProductionOverview,
	getTreasureBaseValue,
	nextSlotCost,
	prestigeTreasureMult,
	slotRefund,
	storageMax,
	storageUpgradeCost,
	totalItems,
	unlockCost,
} from "./economy.ts";
import { formatInputs, formatResourceName } from "./format.ts";
import { announce, emit, requestRender } from "./events.ts";
import { save } from "./save.ts";
import { now } from "./clock.ts";
import { entries, keys } from "./util.ts";
import { record } from "./journal.ts";
import type { ProductKey, ResourceKey } from "./types.ts";

export function unlockBuilding(bldKey: string): void {
	record("build", bldKey);
	const cfg = BUILDINGS[bldKey];
	const bst = state.buildings[bldKey];
	if (bst.unlocked) return;
	if (!buildingPrereqMet(bldKey)) return;
	const cost = buildCost(bldKey);
	if (state.gold < cost) {
		announce(`Need ${cost.toLocaleString()} gold to build ${cfg.label}.`);
		return;
	}
	state.gold -= cost;
	bst.unlocked = true;
	for (const [pk, pcfg] of entries(cfg.products)) {
		if (pcfg.unlockCost === 0 && !pcfg.prereqProduct) bst.products[pk].unlocked = true;
	}
	announce(`${cfg.label} built!`);
	emit("building:built", bldKey);
}

export function unlockProduct(bldKey: string, productKey: ProductKey): void {
	record("unlock", bldKey, productKey);
	const pcfg = BUILDINGS[bldKey].products[productKey];
	const pst = state.buildings[bldKey].products[productKey];
	if (pst.unlocked) return;
	if (pcfg.prereqProduct && !state.buildings[bldKey].products[pcfg.prereqProduct].unlocked) return;
	const cost = unlockCost(bldKey, productKey);
	if (state.gold < cost) {
		announce(`Need ${cost.toLocaleString()} gold to unlock ${RESOURCES[pcfg.outputKey].label} production.`);
		return;
	}
	state.gold -= cost;
	pst.unlocked = true;
	announce(`${RESOURCES[pcfg.outputKey].label} production unlocked!`);
	emit("product:unlocked", { bldKey, productKey });
}

export function addSlot(bldKey: string, productKey: ProductKey): void {
	record("addSlot", bldKey, productKey);
	const pst = state.buildings[bldKey].products[productKey];
	if (!pst.unlocked) return;
	const cost = nextSlotCost(bldKey, productKey);
	if (state.gold < cost) {
		announce(`Need ${cost.toLocaleString()} gold to add a slot.`);
		return;
	}
	state.gold -= cost;
	pst.slots.push({ id: ++runtime.nextSlotId, progress: 0.0 });
	const label = RESOURCES[BUILDINGS[bldKey].products[productKey].outputKey].label;
	announce(`Slot added. ${label} now has ${pst.slots.length.toLocaleString()} slot${pst.slots.length === 1 ? "" : "s"}.`);
	requestRender();
}

export function sellSlot(bldKey: string, productKey: ProductKey): void {
	record("sellSlot", bldKey, productKey);
	const pst = state.buildings[bldKey].products[productKey];
	if (pst.slots.length === 0) return;
	const refund = slotRefund(bldKey, productKey);
	pst.slots.pop();
	if (pst.slots.length === 0) delete runtime.stallAnnounced[`${bldKey}-${productKey}`];
	state.gold += refund;
	const label = RESOURCES[BUILDINGS[bldKey].products[productKey].outputKey].label;
	announce(`Slot sold for ${refund.toLocaleString()} gold. ${label} now has ${pst.slots.length.toLocaleString()} slot${pst.slots.length === 1 ? "" : "s"}.`);
	requestRender();
}

export function manualProduce(bldKey: string, productKey: ProductKey): void {
	record("manual", bldKey, productKey);
	const pcfg = BUILDINGS[bldKey].products[productKey];
	const pst = state.buildings[bldKey].products[productKey];
	if (pst.manual.active) {
		pst.manual.progress += MANUAL_CLICK_PROGRESS;
		return;
	}
	const inputs = pcfg.inputs as Record<ResourceKey, number>;
	const inputSum = Object.values(inputs).reduce((s: number, n: number) => s + n, 0);
	const netChange = pcfg.outputAmt - inputSum;
	if (netChange > 0 && totalItems() + netChange > storageMax()) {
		announce("Storage is full.");
		return;
	}
	for (const [inputKey, inputAmt] of entries(inputs)) {
		if (state.inventory[inputKey] < inputAmt) {
			announce(`Need ${formatInputs(pcfg.inputs)}.`);
			return;
		}
	}
	pst.manual.active = true;
	pst.manual.progress = 0;
	announce("Crafting started.");
}

export function upgradeStorage(): void {
	record("storage");
	const cost = storageUpgradeCost();
	if (state.gold < cost) {
		announce(`Need ${cost.toLocaleString()} gold to expand storage.`);
		return;
	}
	state.gold -= cost;
	state.storage.tier++;
	announce(`Storage expanded to ${storageMax().toLocaleString()} items.`);
	requestRender();
}

export function sellAll(): void {
	record("sellAll");
	const resources = keys(RESOURCES).filter((k) => state.inventory[k] > 0);
	if (resources.length === 0) return;
	let totalEarned = 0;
	for (const k of resources) {
		const qty = state.inventory[k];
		const earned = qty * currentPrice(k);
		totalEarned += earned;
		state.stats.soldByResource[k] = (state.stats.soldByResource[k] ?? 0) + qty;
		state.inventory[k] = 0;
	}
	state.stats.goldEarned += totalEarned;
	state.gold += totalEarned;
	announce(`Sold everything for ${totalEarned.toLocaleString()} gold.`);
	requestRender();
}

export function sellProduct(resourceKey: ResourceKey): void {
	record("sell", resourceKey);
	const inv = state.inventory[resourceKey];
	if (inv <= 0) return;
	const earned = inv * currentPrice(resourceKey);
	state.inventory[resourceKey] = 0;
	state.stats.soldByResource[resourceKey] = (state.stats.soldByResource[resourceKey] ?? 0) + inv;
	state.stats.goldEarned += earned;
	state.gold += earned;
	announce(`Sold ${inv.toLocaleString()} ${formatResourceName(resourceKey, inv)} for ${earned.toLocaleString()} gold.`);
	requestRender();
}

export function toggleProductEnabled(bldKey: string, productKey: ProductKey): void {
	record("toggle", bldKey, productKey);
	const pst = state.buildings[bldKey].products[productKey];
	if (!pst.unlocked) return;
	pst.enabled = !pst.enabled;
	if (!pst.enabled) {
		pst.manual.active = false;
		pst.manual.progress = 0;
	}
	const outputKey = BUILDINGS[bldKey].products[productKey].outputKey;
	announce(`${RESOURCES[outputKey].label} production ${pst.enabled ? "resumed" : "paused"}.`);
	requestRender();
}

export function openTreasure(): void {
	record("treasure");
	if (!state.treasure.activeUntil || now() > state.treasure.activeUntil) return;
	const amount = Math.round(getTreasureBaseValue() * prestigeTreasureMult());
	state.gold += amount;
	state.stats.goldEarned += amount;
	state.stats.treasureChestsOpened++;
	state.treasure.activeUntil = 0;
	announce(`Opened treasure chest for ${amount.toLocaleString()} gold!`);
	requestRender();
}

// Autoplay helper kept from the original build. Phase 1 removes it or moves it
// behind late game research, because it makes the purchase decision for the player.
export function doFixBottleneck(): void {
	record("fixBottleneck");
	let totalBought = 0;
	for (let i = 0; i < 500; i++) {
		const { deficits } = getProductionOverview();
		if (deficits.length === 0) break;
		let bought = false;
		for (const deficit of deficits) {
			let foundBld: string | null = null;
			let foundProd: ProductKey | null = null;
			outer: for (const [bk, bst] of entries(state.buildings)) {
				if (!bst.unlocked) continue;
				for (const [pk, pcfg] of entries(BUILDINGS[bk].products)) {
					if (bst.products[pk].unlocked && pcfg.outputKey === deficit.resourceKey) {
						foundBld = bk;
						foundProd = pk;
						break outer;
					}
				}
			}
			if (!foundBld || !foundProd) continue;
			const cost = nextSlotCost(foundBld, foundProd);
			if (state.gold < cost) continue;
			state.gold -= cost;
			state.buildings[foundBld].products[foundProd].slots.push({ id: ++runtime.nextSlotId, progress: 0.0 });
			totalBought++;
			bought = true;
			break;
		}
		if (!bought) break;
	}
	if (totalBought > 0) {
		save();
		requestRender();
		announce(`Bought ${totalBought} slot${totalBought === 1 ? "" : "s"} to fix production bottlenecks.`);
	} else announce("Not enough gold to fix any bottleneck.");
}
