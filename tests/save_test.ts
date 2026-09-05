// Phase 0.2: every save carries the version it was written with, and old saves are
// walked forward one migration at a time. The state shape changes on every phase from
// here, so this is the safety net that keeps a real player's progress readable.
import { assert, assertEquals, assertGreater, assertThrows } from "@std/assert";
import { freshState, runtime, setState, state } from "../src/core/state.ts";
import { setBackend } from "../src/core/storage.ts";
import { setClock } from "../src/core/clock.ts";
import { rngState, seedRng, setRng, setRngState } from "../src/core/rng.ts";
import { clearHandlers, on, setMuted } from "../src/core/events.ts";
import { clearSave, isSaveBlocked, load, rawSave, save } from "../src/core/save.ts";
import { migrate, SAVE_VERSION, SaveTooNewError, saveVersionOf } from "../src/core/migrations.ts";
import { addSlot } from "../src/core/actions.ts";
import { drawQuests, rerollQuest } from "../src/core/quests.ts";
import { advanceTo } from "../src/core/sim.ts";
import type { StorageBackend } from "../src/core/types.ts";

const T0 = 1_700_000_000_000;
let virtualNow = T0;
let mem = new Map<string, string>();

function backend(): StorageBackend {
	return {
		getItem: (k) => mem.get(k) ?? null,
		setItem: (k, v) => void mem.set(k, v),
		removeItem: (k) => void mem.delete(k),
	};
}

function reset(): string[] {
	virtualNow = T0;
	setClock(() => virtualNow);
	setRng(null);
	seedRng(777);
	mem = new Map();
	setBackend(backend());
	clearHandlers();
	setMuted(false);
	const said: string[] = [];
	on("announce", (m) => said.push(m as string));
	setState(freshState());
	runtime.nextSlotId = 0;
	runtime.stallAnnounced = {};
	state.lastTick = T0;
	clearSave();
	return said;
}

// What a save written by the pre-versioning build looked like: no version field, and
// products missing the fields load() used to patch in by hand every boot.
function legacySave(): Record<string, any> {
	const s = JSON.parse(JSON.stringify(freshState())) as Record<string, any>;
	delete s.version;
	delete s.rngState;
	s.gold = 12345;
	s.lastTick = T0;
	const logs = s.buildings.lumber_yard.products.logs;
	logs.slots = [{ id: 7, progress: 0.5 }];
	delete logs.manual;
	delete logs.enabled;
	const timber = s.buildings.lumber_yard.products.timber;
	delete timber.slots;
	return s;
}

Deno.test("an unversioned save reads as version 0", () => {
	assertEquals(saveVersionOf(legacySave()), 0);
	assertEquals(saveVersionOf({ version: 3 }), 3);
});

Deno.test("migrating a v0 save fills in the fields the old loader patched by hand", () => {
	reset();
	const migrated = migrate(legacySave());
	assertEquals(migrated.version, SAVE_VERSION);
	const logs = migrated.buildings.lumber_yard.products.logs;
	assertEquals(logs.enabled, true);
	assertEquals(logs.manual, { active: false, progress: 0 });
	assertEquals(migrated.buildings.lumber_yard.products.timber.slots, []);
	assertEquals(typeof migrated.rngState, "number");
});

Deno.test("a real v0 save loads and keeps its progress", () => {
	reset();
	mem.set("crafter", JSON.stringify(legacySave()));
	load();
	assertEquals(state.gold, 12345);
	assertEquals(state.version, SAVE_VERSION);
	assertEquals(state.buildings.lumber_yard.products.logs.slots.length, 1);
	assertEquals(state.buildings.lumber_yard.products.logs.enabled, true);
	assertEquals(runtime.nextSlotId, 7, "slot ids resume above the highest one saved");
	assertEquals(isSaveBlocked(), false);
});

Deno.test("a save from a newer build is refused rather than overwritten", () => {
	const said = reset();
	const future = JSON.parse(JSON.stringify(freshState()));
	future.version = SAVE_VERSION + 5;
	future.gold = 999999;
	const rawFuture = JSON.stringify(future);
	mem.set("crafter", rawFuture);
	load();
	assertEquals(isSaveBlocked(), true);
	assert(said.some((m) => m.includes("newer version")), "the player is told why");
	state.gold = 1;
	save();
	assertEquals(rawSave(), rawFuture, "the newer save is left untouched on disk");
	clearSave();
	assertEquals(isSaveBlocked(), false, "clearing the save lifts the block");
});

Deno.test("migrate refuses a newer version outright", () => {
	assertThrows(() => migrate({ version: SAVE_VERSION + 1 }), SaveTooNewError);
});

Deno.test("the random generator survives a save and reload", () => {
	reset();
	seedRng(1234);
	// Burn some draws so the cursor is not sitting on its seed.
	virtualNow += 60_000;
	advanceTo(virtualNow);
	save();
	const cursorAtSave = rngState();
	setRngState(0);
	load();
	assertEquals(rngState(), cursorAtSave, "reloading resumes the same sequence");
});

Deno.test("a reload is not a free reroll", () => {
	reset();
	seedRng(2468);
	drawQuests();
	state.gold = 1_000_000;
	save();

	rerollQuest(0);
	const firstAttempt = state.quests.active[0];

	// Reload and try the same reroll again. Because the generator cursor rides along in
	// the save, the draw repeats, so reloading to fish for a better quest gains nothing.
	load();
	state.gold = 1_000_000;
	rerollQuest(0);
	assertEquals(state.quests.active[0], firstAttempt);
});

Deno.test("a save round trips through a full play sequence", () => {
	reset();
	state.gold = 100_000;
	addSlot("lumber_yard", "logs");
	virtualNow += 120_000;
	advanceTo(virtualNow);
	save();
	const before = JSON.stringify(state);
	setState(freshState());
	load();
	assertEquals(JSON.stringify(state), before);
	assertGreater(state.inventory.logs, 0);
});
