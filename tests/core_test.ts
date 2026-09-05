// Proves the core runs with no DOM. This is what the module split exists to make
// possible; the Phase 0.5 simulator builds on the same entry points.
import { assert, assertEquals, assertGreater } from "@std/assert";
import { RESOURCES } from "../src/content/resources.ts";
import { BUILDINGS } from "../src/content/buildings.ts";
import { QUEST_POOL } from "../src/content/quests.ts";
import { freshState, runtime, setState, state } from "../src/core/state.ts";
import { setBackend } from "../src/core/storage.ts";
import { setClock } from "../src/core/clock.ts";
import { setRng } from "../src/core/rng.ts";
import { clearHandlers, on } from "../src/core/events.ts";
import { tick } from "../src/core/tick.ts";
import { load, save } from "../src/core/save.ts";
import { checkQuestCompletion, drawQuests, isGameComplete } from "../src/core/quests.ts";
import { applyPrestigeReset, prestigeResetSummary } from "../src/core/prestige.ts";
import { addSlot, sellAll, unlockBuilding, upgradeStorage } from "../src/core/actions.ts";
import { buildingPrereqMet, nextBuildableBuilding, nextSlotCost, storageMax, totalItems } from "../src/core/economy.ts";
import type { StorageBackend } from "../src/core/types.ts";

let virtualNow = 1_700_000_000_000;
let seed = 12345;

function memoryBackend(): StorageBackend {
	const mem = new Map<string, string>();
	return {
		getItem: (k) => mem.get(k) ?? null,
		setItem: (k, v) => void mem.set(k, v),
		removeItem: (k) => void mem.delete(k),
	};
}

function resetWorld(): string[] {
	virtualNow = 1_700_000_000_000;
	seed = 12345;
	setClock(() => virtualNow);
	setRng(() => {
		seed = (seed * 1103515245 + 12345) & 0x7fffffff;
		return seed / 0x7fffffff;
	});
	setBackend(memoryBackend());
	clearHandlers();
	const announcements: string[] = [];
	on("announce", (m) => announcements.push(m as string));
	setState(freshState());
	runtime.nextSlotId = 0;
	runtime.stallAnnounced = {};
	runtime.selectedBuilding = "lumber_yard";
	state.lastTick = virtualNow;
	return announcements;
}

function advance(seconds: number): void {
	for (let i = 0; i < seconds; i++) {
		virtualNow += 1000;
		tick();
	}
}

Deno.test("content catalogue is internally consistent", () => {
	assertEquals(Object.keys(RESOURCES).length, 28);
	assertEquals(Object.keys(BUILDINGS).length, 7);
	assertEquals(QUEST_POOL.length, 100);
	for (const [bk, cfg] of Object.entries(BUILDINGS)) {
		for (const [pk, p] of Object.entries(cfg.products)) {
			assert(RESOURCES[p.outputKey], `${bk}.${pk} output ${p.outputKey} is not a resource`);
			assertEquals(pk, p.outputKey, `${bk}.${pk} key does not match its outputKey`);
			for (const inputKey of Object.keys(p.inputs)) {
				assert(RESOURCES[inputKey as keyof typeof RESOURCES], `${bk}.${pk} input ${inputKey} is not a resource`);
			}
			if (p.prereqProduct) assert(cfg.products[p.prereqProduct], `${bk}.${pk} prereq ${p.prereqProduct} is not in the same building`);
		}
		if (cfg.prereq) {
			assert(BUILDINGS[cfg.prereq.building], `${bk} prereq building ${cfg.prereq.building} does not exist`);
			if (cfg.prereq.product) assert(BUILDINGS[cfg.prereq.building].products[cfg.prereq.product], `${bk} prereq product does not exist`);
		}
	}
	for (const q of QUEST_POOL) {
		if (q.type === "sell") assert(RESOURCES[q.resource!], `quest ${q.id} sells unknown resource`);
		if (q.bld) assert(BUILDINGS[q.bld], `quest ${q.id} targets unknown building ${q.bld}`);
		if (q.bld && q.product) assert(BUILDINGS[q.bld].products[q.product], `quest ${q.id} targets unknown product`);
	}
});

Deno.test("a fresh run starts with the lumber yard and five quests", () => {
	resetWorld();
	drawQuests();
	assertEquals(state.quests.active.length, 5);
	assert(state.buildings.lumber_yard.unlocked);
	assertEquals(buildingPrereqMet("workshop"), false);
	assertEquals(nextBuildableBuilding(), "sawmill");
});

Deno.test("slots produce over time and respect the storage cap", () => {
	resetWorld();
	state.gold = 100_000;
	addSlot("lumber_yard", "logs");
	addSlot("lumber_yard", "logs");
	assertEquals(state.buildings.lumber_yard.products.logs.slots.length, 2);
	const goldBefore = state.gold;
	advance(600);
	assertGreater(state.inventory.logs, 0);
	assert(totalItems() <= storageMax(), `${totalItems()} exceeds ${storageMax()}`);
	assertEquals(state.gold, goldBefore, "ticking must not move gold");
});

Deno.test("selling clears inventory and records the sale", () => {
	resetWorld();
	state.gold = 100_000;
	addSlot("lumber_yard", "logs");
	advance(300);
	const held = state.inventory.logs;
	assertGreater(held, 0);
	const goldBefore = state.gold;
	sellAll();
	assertEquals(totalItems(), 0);
	assertGreater(state.gold, goldBefore);
	assertEquals(state.stats.soldByResource.logs, held);
});

Deno.test("storage upgrades and building unlocks apply", () => {
	resetWorld();
	state.gold = 1_000_000;
	upgradeStorage();
	assertEquals(state.storage.tier, 1);
	assertEquals(storageMax(), 100);
	unlockBuilding("sawmill");
	assert(state.buildings.sawmill.unlocked);
	assert(state.buildings.sawmill.products.planks.unlocked, "free products unlock with the building");
});

Deno.test("slot cost rises with each slot bought", () => {
	resetWorld();
	state.gold = 10_000_000;
	const first = nextSlotCost("lumber_yard", "logs");
	addSlot("lumber_yard", "logs");
	const second = nextSlotCost("lumber_yard", "logs");
	assertGreater(second, first);
	// A locked product cannot be bought into at all.
	const lockedBefore = state.buildings.lumber_yard.products.timber.slots.length;
	addSlot("lumber_yard", "timber");
	assertEquals(state.buildings.lumber_yard.products.timber.slots.length, lockedBefore);
});

Deno.test("a save round trips to an equal state", () => {
	resetWorld();
	state.gold = 50_000;
	addSlot("lumber_yard", "logs");
	advance(120);
	save();
	const before = JSON.stringify(state);
	load();
	assertEquals(JSON.stringify(state), before);
});

Deno.test("prestige banks rewards and resets the run", () => {
	resetWorld();
	state.gold = 1_000_000;
	drawQuests();
	unlockBuilding("sawmill");
	checkQuestCompletion();
	const summary = prestigeResetSummary();
	assertEquals(summary.totalActive, state.quests.active.length);
	state.quests.completed[0] = true;
	const runsBefore = state.prestige.runs;
	const rewardsBefore = state.prestige.rewards.length;
	applyPrestigeReset();
	assertEquals(state.prestige.runs, runsBefore + 1);
	assertGreater(state.prestige.rewards.length, rewardsBefore);
	assertEquals(state.buildings.sawmill.unlocked, false, "buildings reset");
	assert(state.prestige.seenBuildings.includes("sawmill"), "seen buildings persist");
	assertEquals(runtime.nextSlotId, 0);
	assertEquals(isGameComplete(), false);
});

Deno.test("the same seed produces the same run twice", () => {
	function runOnce(): string {
		resetWorld();
		state.gold = 200_000;
		drawQuests();
		addSlot("lumber_yard", "logs");
		addSlot("lumber_yard", "logs");
		advance(1800);
		sellAll();
		return JSON.stringify({
			gold: state.gold,
			inventory: state.inventory,
			quests: state.quests.active,
			treasure: state.treasure,
		});
	}
	assertEquals(runOnce(), runOnce());
});

Deno.test("no NaN leaks into gold or inventory over a long run", () => {
	resetWorld();
	state.gold = 5_000_000;
	unlockBuilding("sawmill");
	addSlot("lumber_yard", "logs");
	addSlot("sawmill", "planks");
	for (let i = 0; i < 10; i++) {
		advance(360);
		sellAll();
	}
	assert(Number.isFinite(state.gold), "gold is finite");
	for (const [k, v] of Object.entries(state.inventory)) {
		assert(Number.isFinite(v) && v >= 0, `${k} is ${v}`);
	}
});

Deno.test("announcements fire without a DOM", () => {
	const announcements = resetWorld();
	state.gold = 100_000;
	addSlot("lumber_yard", "logs");
	assertGreater(announcements.length, 0);
	assert(announcements.some((m) => m.includes("Slot added")));
});
