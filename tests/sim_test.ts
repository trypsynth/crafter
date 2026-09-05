// Phase 0.4: the live game and offline catch-up must be the same code, producing the
// same numbers. These tests are what makes that claim checkable rather than hopeful.
import { assert, assertAlmostEquals, assertEquals, assertGreater } from "@std/assert";
import { freshState, runtime, setState, state } from "../src/core/state.ts";
import { setBackend } from "../src/core/storage.ts";
import { setClock } from "../src/core/clock.ts";
import { seedRng, setRng } from "../src/core/rng.ts";
import { clearHandlers, setMuted } from "../src/core/events.ts";
import { advanceTo, STEP_MS } from "../src/core/sim.ts";
import { applyOfflineProgress } from "../src/core/save.ts";
import { sellAll } from "../src/core/actions.ts";
import { storageMax, totalItems } from "../src/core/economy.ts";
import type { StorageBackend } from "../src/core/types.ts";

const T0 = 1_700_000_000_000;
let virtualNow = T0;

function memoryBackend(): StorageBackend {
	const mem = new Map<string, string>();
	return {
		getItem: (k) => mem.get(k) ?? null,
		setItem: (k, v) => void mem.set(k, v),
		removeItem: (k) => void mem.delete(k),
	};
}

// A small chained setup: logs feed timber, so the result depends on stages feeding each
// other over time. The old one pass offline estimate got exactly this case wrong.
function scenario(storageTier = 6): void {
	setClock(() => virtualNow);
	setRng(null);
	seedRng(4242);
	setBackend(memoryBackend());
	clearHandlers();
	setMuted(true);
	setState(freshState());
	runtime.nextSlotId = 0;
	runtime.stallAnnounced = {};
	runtime.selectedBuilding = "lumber_yard";
	virtualNow = T0;
	state.lastTick = T0;
	state.storage.tier = storageTier;
	const logs = state.buildings.lumber_yard.products.logs;
	const timber = state.buildings.lumber_yard.products.timber;
	logs.unlocked = true;
	timber.unlocked = true;
	logs.slots = [{ id: 1, progress: 0 }, { id: 2, progress: 0 }, { id: 3, progress: 0 }];
	timber.slots = [{ id: 4, progress: 0 }, { id: 5, progress: 0 }];
}

function snapshot(): string {
	return JSON.stringify({
		inventory: state.inventory,
		lastTick: state.lastTick,
		slots: Object.entries(state.buildings).map((
			[bk, bst],
		) => [bk, Object.entries(bst.products).map(([pk, p]) => [pk, p.slots.map((s) => s.progress.toFixed(9))])]),
	});
}

Deno.test("playing an hour and being away an hour give the same result", () => {
	const HOUR_MS = 3600 * 1000;

	scenario();
	// Live: the page ticks about ten times a second.
	for (let i = 0; i < 3600 * 10; i++) {
		virtualNow += 100;
		advanceTo(virtualNow);
	}
	const live = snapshot();

	scenario();
	// Away: one call covering the whole hour.
	virtualNow = T0 + HOUR_MS;
	advanceTo(virtualNow);
	const offline = snapshot();

	assertEquals(offline, live);
});

Deno.test("a chain feeds itself across the catch-up", () => {
	scenario(20);
	virtualNow = T0 + 30 * 60 * 1000;
	advanceTo(virtualNow);
	assertGreater(state.inventory.timber, 0, "timber needs logs made earlier in the same catch-up");
	assertGreater(state.inventory.logs, 0);
});

Deno.test("leftover time under one step is carried, not dropped", () => {
	scenario();
	// Twenty calls of 900ms each is 18 seconds. Nothing may be lost to rounding.
	for (let i = 0; i < 20; i++) {
		virtualNow += 900;
		advanceTo(virtualNow);
	}
	const stepped = snapshot();

	scenario();
	virtualNow = T0 + 20 * 900;
	advanceTo(virtualNow);
	assertEquals(snapshot(), stepped);
});

Deno.test("a blocked slot holds at the brink instead of losing its cycle", () => {
	scenario(0);
	// Only logs run, so nothing can free space once the store is full.
	state.buildings.lumber_yard.products.timber.slots = [];
	state.inventory.logs = storageMax();
	virtualNow = T0 + 60 * 1000;
	advanceTo(virtualNow);
	assertEquals(totalItems(), storageMax(), "nothing can be added to a full store");
	for (const slot of state.buildings.lumber_yard.products.logs.slots) {
		assertAlmostEquals(slot.progress, 0.999, 1e-9, "a blocked slot waits at a finished bar");
	}
	// Freeing space lets the held cycles land on the very next step.
	sellAll();
	virtualNow += STEP_MS;
	advanceTo(virtualNow);
	assertEquals(state.inventory.logs, 6, "all three held cycles pay out at once");
});

Deno.test("production settles and a 24h catch-up stays inside the time budget", () => {
	scenario(0);
	virtualNow = T0 + 24 * 3600 * 1000;
	const t0 = performance.now();
	advanceTo(virtualNow);
	const elapsed = performance.now() - t0;
	assert(totalItems() <= storageMax(), `${totalItems()} exceeds the ${storageMax()} cap`);
	assert(elapsed < 500, `24h catch-up took ${elapsed.toFixed(0)}ms, budget is 500ms`);
	// Settled means settled: another day away changes nothing.
	const settled = snapshot();
	virtualNow += 24 * 3600 * 1000;
	advanceTo(virtualNow);
	assertEquals(
		JSON.parse(snapshot()).inventory,
		JSON.parse(settled).inventory,
		"a full store is a fixed point",
	);
});

Deno.test("offline progress respects the 24 hour cap", () => {
	scenario(40);
	virtualNow = T0 + 3 * 24 * 3600 * 1000;
	applyOfflineProgress();
	assertEquals(state.lastTick, virtualNow, "the clock resyncs to now even when capped");
	const cappedTotal = totalItems();

	scenario(40);
	virtualNow = T0 + 24 * 3600 * 1000;
	applyOfflineProgress();
	assertEquals(totalItems(), cappedTotal, "three days away pays exactly one day of work");
});

Deno.test("a clock that jumps backwards does not run production", () => {
	scenario();
	virtualNow = T0 + 600 * 1000;
	advanceTo(virtualNow);
	const held = totalItems();
	virtualNow = T0 - 5000;
	const steps = advanceTo(virtualNow);
	assertEquals(steps, 0);
	assertEquals(totalItems(), held);
	assertEquals(state.lastTick, virtualNow, "the clock resyncs rather than sitting in the future");
});

Deno.test("the step budget caps work in a single call", () => {
	scenario(40);
	virtualNow = T0 + 3600 * 1000;
	const steps = advanceTo(virtualNow, 100);
	assertEquals(steps, 100);
	assertEquals(state.lastTick, T0 + 100 * STEP_MS, "the clock only moves as far as the work done");
});
