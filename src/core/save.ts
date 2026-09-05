import { BUILDINGS } from "../content/buildings.ts";
import { deepMerge, freshState, runtime, setState, state } from "./state.ts";
import { OFFLINE_CAP_MS, OFFLINE_MIN_MS, SAVE_KEY } from "./constants.ts";
import { prestigeSpeedMult, storageMax } from "./economy.ts";
import { now } from "./clock.ts";
import { announce } from "./events.ts";
import { entries } from "./util.ts";
import * as storage from "./storage.ts";
import type { GameState, ProductConfig, ProductState, ResourceKey } from "./types.ts";

export function save(): void {
	storage.setItem(SAVE_KEY, JSON.stringify(state));
}

export function rawSave(): string | null {
	return storage.getItem(SAVE_KEY);
}

export function writeRawSave(text: string): void {
	storage.setItem(SAVE_KEY, text);
}

export function clearSave(): void {
	storage.removeItem(SAVE_KEY);
}

export function load(): void {
	try {
		const raw = storage.getItem(SAVE_KEY);
		if (!raw) return;
		const parsed = JSON.parse(raw) as Partial<GameState>;
		const fresh = freshState();
		deepMerge(fresh as unknown as Record<string, unknown>, parsed as Record<string, unknown>);
		const lastTime = fresh.lastTick;
		setState(fresh);
		let maxId = 0;
		for (const bst of Object.values(state.buildings)) {
			for (const pst of Object.values(bst.products)) {
				for (const slot of pst.slots) {
					if (slot.id > maxId) maxId = slot.id;
				}
			}
		}
		runtime.nextSlotId = maxId;
		for (const bst of Object.values(state.buildings)) {
			for (const pst of Object.values(bst.products) as ProductState[]) {
				if (!pst.manual) pst.manual = { active: false, progress: 0 };
				if (pst.manual.active === undefined) pst.manual.active = false;
				if (pst.enabled === undefined) pst.enabled = true;
			}
		}
		if (lastTime) applyOfflineProgress(lastTime);
	} catch (e) {
		console.error("Load failed:", e);
		setState(freshState());
	}
}

interface Producer {
	bk: string;
	pk: string;
	pst: ProductState;
	pcfg: ProductConfig;
}

// Single pass approximation of time away. Phase 0.4 replaces this with the same
// fixed step the live game uses, so online and offline share one code path.
export function applyOfflineProgress(lastTime: number): number {
	const diffMs = now() - lastTime;
	const catchupMs = Math.min(diffMs, OFFLINE_CAP_MS);
	if (catchupMs <= OFFLINE_MIN_MS) return 0;
	const catchupSec = catchupMs / 1000;
	const speedMult = prestigeSpeedMult();
	let currentTotal = Object.values(state.inventory).reduce((a: number, b: number) => a + b, 0);
	const max = storageMax();
	const producers: Producer[] = [];
	for (const [bk, bst] of entries(state.buildings)) {
		if (!bst.unlocked) continue;
		for (const [pk, pst] of entries(bst.products)) {
			if (pst.unlocked && pst.enabled && pst.slots.length > 0) {
				producers.push({ bk, pk, pst, pcfg: BUILDINGS[bk].products[pk] });
			}
		}
	}
	producers.sort((a, b) => a.pcfg.baseCycleMs - b.pcfg.baseCycleMs);
	let gained = 0;
	for (const p of producers) {
		const inputs = p.pcfg.inputs as Record<ResourceKey, number>;
		const cycleSec = (p.pcfg.baseCycleMs / 1000) / speedMult;
		let cycles = Math.floor(catchupSec / cycleSec) * p.pst.slots.length;
		for (const [inK, inA] of entries(inputs)) {
			const available = state.inventory[inK] || 0;
			cycles = Math.min(cycles, Math.floor(available / inA));
		}
		// Only cap by storage for net-positive producers; net-neutral/negative producers
		// consume more inputs than they output, so they free up (or preserve) space.
		const inputSum = Object.values(inputs).reduce((s: number, n: number) => s + n, 0);
		const netPerCycle = p.pcfg.outputAmt - inputSum;
		if (netPerCycle > 0) {
			const space = max - currentTotal;
			cycles = Math.min(cycles, Math.floor(space / netPerCycle));
		}
		const gain = cycles * p.pcfg.outputAmt;
		if (gain > 0) {
			state.inventory[p.pcfg.outputKey] += gain;
			for (const [inK, inA] of entries(inputs)) {
				const consumed = cycles * inA;
				state.inventory[inK] -= consumed;
				currentTotal -= consumed;
			}
			currentTotal += gain;
			gained += gain;
		}
	}
	if (gained > 0) setTimeout(() => announce(`Welcome back! Your workers produced ${gained.toLocaleString()} items while you were away.`), 500);
	return gained;
}
