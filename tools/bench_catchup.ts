// Measures the cost of replaying offline time through the real simulation step.
// The plan's budget is a 24 hour catch-up on a late game save in under 500ms.
import { BUILDINGS } from "../src/content/buildings.ts";
import { freshState, setState, state } from "../src/core/state.ts";
import { setClock } from "../src/core/clock.ts";
import { seedRng } from "../src/core/rng.ts";
import { setMuted } from "../src/core/events.ts";
import { advanceTo } from "../src/core/sim.ts";
import { storageMax, totalItems } from "../src/core/economy.ts";
import type { ResourceKey } from "../src/core/types.ts";

let virtualNow = 1_700_000_000_000;
setClock(() => virtualNow);
setMuted(true);

function buildLateGame(slotsPerProduct: number, storageTier: number): number {
	seedRng(99);
	setState(freshState());
	state.lastTick = virtualNow;
	state.storage.tier = storageTier;
	let total = 0;
	let id = 0;
	for (const [bk, cfg] of Object.entries(BUILDINGS)) {
		state.buildings[bk].unlocked = true;
		for (const pk of Object.keys(cfg.products)) {
			const pst = state.buildings[bk].products[pk];
			pst.unlocked = true;
			pst.enabled = true;
			pst.slots = Array.from({ length: slotsPerProduct }, (_, i) => ({ id: ++id, progress: (i * 0.37) % 1 }));
			total += slotsPerProduct;
		}
	}
	for (const k of Object.keys(state.inventory)) state.inventory[k as ResourceKey] = 20;
	return total;
}

const HOURS = 24;

function run(label: string, storageTier: number): void {
	console.log(`
${label}`);
	console.log("slots/product   total slots   wall time   items held   storage cap");
	for (const per of [5, 20, 50, 100]) {
		const totalSlots = buildLateGame(per, storageTier);
		const target = virtualNow + HOURS * 3600 * 1000;
		const t0 = performance.now();
		advanceTo(target);
		const elapsed = performance.now() - t0;
		console.log(
			`${String(per).padStart(11)}   ${String(totalSlots).padStart(11)}   ${elapsed.toFixed(0).padStart(7)}ms   ${
				totalItems().toLocaleString().padStart(10)
			}   ${storageMax().toLocaleString().padStart(11)}`,
		);
		virtualNow = target;
	}
}

console.log(`${HOURS}h catch-up, ${(HOURS * 3600).toLocaleString()} steps`);
run("realistic: storage fills, production reaches a fixed point", 40);
run("worst case: storage never fills, every step does full work", 4000);
