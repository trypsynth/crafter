import { RESOURCES } from "../content/resources.ts";
import { BUILDINGS } from "../content/buildings.ts";
import { runtime, state } from "./state.ts";
import { prestigeSpeedMult, storageMax, totalItems } from "./economy.ts";
import { formatInputs } from "./format.ts";
import { announce } from "./events.ts";
import type { ProductKey, ResourceKey } from "./types.ts";

// Offline catch-up replays a day of game time one second at a time, which is tens of
// millions of slot updates. Everything that does not change between steps is worked out
// once, here, at module load: the input lists, the net storage change, the stall
// messages. The step loop below then does arithmetic and nothing else.
interface CompiledProduct {
	bldKey: string;
	productKey: ProductKey;
	outputKey: ResourceKey;
	outputAmt: number;
	baseCycleSec: number;
	inputKeys: ResourceKey[];
	inputAmts: number[];
	netChange: number;
	stallKey: string;
	storageStallMsg: string;
	inputStallMsg: string;
}

const COMPILED: CompiledProduct[] = Object.entries(BUILDINGS).flatMap(([bldKey, cfg]) =>
	Object.entries(cfg.products).map(([productKey, pcfg]) => {
		const inputs = pcfg.inputs as Record<ResourceKey, number>;
		const inputKeys = Object.keys(inputs) as ResourceKey[];
		const inputAmts = inputKeys.map((k) => inputs[k]);
		const inputSum = inputAmts.reduce((s, n) => s + n, 0);
		const label = RESOURCES[pcfg.outputKey].label;
		return {
			bldKey,
			productKey,
			outputKey: pcfg.outputKey,
			outputAmt: pcfg.outputAmt,
			baseCycleSec: pcfg.baseCycleMs / 1000,
			inputKeys,
			inputAmts,
			netChange: pcfg.outputAmt - inputSum,
			stallKey: `${bldKey}-${productKey}`,
			storageStallMsg: `${label} stalled - storage full.`,
			inputStallMsg: `${label} stalled - need ${formatInputs(pcfg.inputs)}.`,
		};
	})
);

// Where a blocked slot parks: bar full, waiting for room or for inputs.
const STALLED_PROGRESS = 0.999;

function markStalled(c: CompiledProduct, message: string): void {
	const seen = runtime.stallAnnounced[c.stallKey];
	if (!seen) {
		runtime.stallAnnounced[c.stallKey] = "pending";
	} else if (seen === "pending") {
		runtime.stallAnnounced[c.stallKey] = true;
		if (runtime.selectedBuilding === c.bldKey) announce(message);
	}
}

// Returns false when the production system has reached a fixed point: nothing was made
// and every running slot is already pinned against a full store or a missing input. From
// there the state cannot change on its own, so a caller replaying a long absence can stop
// asking. That is the normal shape of being away, since storage fills and then everything
// waits, and it turns the rest of a 24 hour catch-up into no work at all.
export function advanceBuildings(deltaSec: number): boolean {
	const speedMult = prestigeSpeedMult();
	const max = storageMax();
	const inv = state.inventory;
	// Running count of everything held. Only production moves it during a step, so it
	// can be carried instead of resummed on every single completion.
	let total = totalItems();
	let live = false;
	for (const c of COMPILED) {
		const bst = state.buildings[c.bldKey];
		if (!bst.unlocked) continue;
		const pst = bst.products[c.productKey];
		if (!pst.unlocked) continue;
		if (!pst.enabled) {
			if (pst.manual.active) {
				pst.manual.active = false;
				pst.manual.progress = 0;
			}
			continue;
		}
		const cycleSec = c.baseCycleSec / speedMult;
		const advance = deltaSec / cycleSec;
		const { inputKeys, inputAmts, outputKey, outputAmt, netChange } = c;
		const inputCount = inputKeys.length;
		for (const slot of pst.slots) {
			const before = slot.progress;
			slot.progress += advance;
			while (slot.progress >= 1.0) {
				// The cycle is only spent once the output can actually be placed. The old build
				// subtracted it first, so a slot waiting on a full store threw away a whole cycle
				// every tick instead of holding at the brink.
				if (netChange > 0 && total + netChange > max) {
					slot.progress = STALLED_PROGRESS;
					markStalled(c, c.storageStallMsg);
					break;
				}
				let starved = false;
				for (let i = 0; i < inputCount; i++) {
					if (inv[inputKeys[i]] < inputAmts[i]) {
						starved = true;
						break;
					}
				}
				if (starved) {
					slot.progress = STALLED_PROGRESS;
					markStalled(c, c.inputStallMsg);
					break;
				}
				slot.progress -= 1.0;
				for (let i = 0; i < inputCount; i++) inv[inputKeys[i]] -= inputAmts[i];
				inv[outputKey] += outputAmt;
				total += netChange;
				if (runtime.stallAnnounced[c.stallKey] !== undefined) delete runtime.stallAnnounced[c.stallKey];
				live = true;
			}
			if (slot.progress !== before) live = true;
		}
		if (pst.manual.active) {
			live = true;
			pst.manual.progress += advance;
			if (pst.manual.progress >= 1.0) {
				pst.manual.progress = 0;
				pst.manual.active = false;
				for (let i = 0; i < inputCount; i++) inv[inputKeys[i]] -= inputAmts[i];
				inv[outputKey] += outputAmt;
				total += netChange;
				announce(`${RESOURCES[outputKey].singular} produced.`);
			}
		}
	}
	return live;
}
