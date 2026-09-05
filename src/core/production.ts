import { RESOURCES } from "../content/resources.ts";
import { BUILDINGS } from "../content/buildings.ts";
import { runtime, state } from "./state.ts";
import { prestigeSpeedMult, storageMax, totalItems } from "./economy.ts";
import { formatInputs } from "./format.ts";
import { announce } from "./events.ts";
import { entries } from "./util.ts";
import type { ProductKey, ResourceKey, Slot } from "./types.ts";

function markStalled(bldKey: string, stallKey: string, message: string): void {
	if (!runtime.stallAnnounced[stallKey]) {
		runtime.stallAnnounced[stallKey] = "pending";
	} else if (runtime.stallAnnounced[stallKey] === "pending") {
		runtime.stallAnnounced[stallKey] = true;
		if (runtime.selectedBuilding === bldKey) announce(message);
	}
}

export function tryProduceSlot(bldKey: string, productKey: ProductKey, slot: Slot): boolean {
	const pcfg = BUILDINGS[bldKey].products[productKey];
	const inputs = pcfg.inputs as Record<ResourceKey, number>;
	const inputSum = Object.values(inputs).reduce((s: number, n: number) => s + n, 0);
	const netChange = pcfg.outputAmt - inputSum;
	const stallKey = `${bldKey}-${productKey}`;
	if (netChange > 0 && totalItems() + netChange > storageMax()) {
		slot.progress = Math.min(slot.progress, 0.999);
		markStalled(bldKey, stallKey, `${RESOURCES[pcfg.outputKey].label} stalled - storage full.`);
		return false;
	}
	for (const [inputKey, inputAmt] of entries(inputs)) {
		if (state.inventory[inputKey] < inputAmt) {
			slot.progress = Math.min(slot.progress, 0.999);
			markStalled(bldKey, stallKey, `${RESOURCES[pcfg.outputKey].label} stalled - need ${formatInputs(pcfg.inputs)}.`);
			return false;
		}
	}
	for (const [inputKey, inputAmt] of entries(inputs)) state.inventory[inputKey] -= inputAmt;
	state.inventory[pcfg.outputKey] += pcfg.outputAmt;
	delete runtime.stallAnnounced[stallKey];
	return true;
}

export function advanceBuildings(deltaSec: number): void {
	for (const bldKey of Object.keys(BUILDINGS)) {
		const bst = state.buildings[bldKey];
		if (!bst.unlocked) continue;
		for (const [productKey, pst] of entries(bst.products)) {
			if (!pst.unlocked) continue;
			if (!pst.enabled) {
				if (pst.manual.active) {
					pst.manual.active = false;
					pst.manual.progress = 0;
				}
				continue;
			}
			const pcfg = BUILDINGS[bldKey].products[productKey];
			const cycleSec = (pcfg.baseCycleMs / 1000) / prestigeSpeedMult();
			for (const slot of pst.slots) {
				slot.progress += deltaSec / cycleSec;
				while (slot.progress >= 1.0) {
					slot.progress -= 1.0;
					if (!tryProduceSlot(bldKey, productKey, slot)) break;
				}
			}
			if (pst.manual.active) {
				pst.manual.progress += deltaSec / cycleSec;
				if (pst.manual.progress >= 1.0) {
					pst.manual.progress = 0;
					pst.manual.active = false;
					for (const [inputKey, inputAmt] of entries(pcfg.inputs as Record<ResourceKey, number>)) state.inventory[inputKey] -= inputAmt;
					state.inventory[pcfg.outputKey] += pcfg.outputAmt;
					announce(`${RESOURCES[pcfg.outputKey].singular} produced.`);
				}
			}
		}
	}
}
