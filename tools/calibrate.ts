// Compares a recorded human session against each archetype playing the same opening.
//
// Replay proves the engine is faithful. It says nothing about whether the simulated
// players behave like people, and that is what every pacing number depends on. So: take
// the state the human started from, give a policy the same stretch of unbroken attention,
// and see who got further.
//
//   deno run --allow-read tools/calibrate.ts tests/fixtures/human_session.json

import { ARCHETYPES } from "../src/sim/archetypes.ts";
import { act, newPolicyState } from "../src/sim/policy.ts";
import { runtime, setState } from "../src/core/state.ts";
import { setClock } from "../src/core/clock.ts";
import { setRng, setRngState } from "../src/core/rng.ts";
import { clearHandlers, setMuted } from "../src/core/events.ts";
import { setBackend } from "../src/core/storage.ts";
import { advanceTo } from "../src/core/sim.ts";
import { checkQuestCompletion } from "../src/core/quests.ts";
import { state } from "../src/core/state.ts";
import type { GameState } from "../src/core/types.ts";
import type { Recording } from "../src/core/journal.ts";

type Captured = Recording & { endState: GameState; endedAt: number };

const path = Deno.args.find((a) => !a.startsWith("--")) ?? "tests/fixtures/human_session.json";
const recording = JSON.parse(await Deno.readTextFile(path)) as Captured;
const spanMs = recording.endedAt - recording.startedAt;
const spanMin = spanMs / 60000;

function earned(s: GameState): number {
	return s.stats.goldEarned - (recording.startState as GameState).stats.goldEarned;
}

function slots(s: GameState): number {
	let n = 0;
	for (const bst of Object.values(s.buildings)) {
		for (const pst of Object.values(bst.products)) n += pst.slots.length;
	}
	return n;
}

interface Row {
	who: string;
	actions: number;
	earned: number;
	slots: number;
	tier: number;
	unlocked: number;
}

function unlockedProducts(s: GameState): number {
	let n = 0;
	for (const bst of Object.values(s.buildings)) {
		for (const pst of Object.values(bst.products)) if (pst.unlocked) n++;
	}
	return n;
}

const rows: Row[] = [{
	who: "HUMAN",
	actions: recording.entries.length,
	earned: earned(recording.endState),
	slots: slots(recording.endState),
	tier: recording.endState.storage.tier,
	unlocked: unlockedProducts(recording.endState),
}];

for (const arch of Object.values(ARCHETYPES)) {
	let clock = recording.startedAt;
	setClock(() => clock);
	setRng(null);
	setRngState(recording.seed);
	setBackend(null);
	clearHandlers();
	setMuted(true);
	setState(JSON.parse(JSON.stringify(recording.startState)) as GameState);
	state.lastTick = recording.startedAt;
	runtime.stallAnnounced = {};
	runtime.selectedBuilding = "lumber_yard";
	runtime.nextSlotId = slots(recording.startState as GameState) * 100;

	const policy = newPolicyState();
	const secondsPerAction = 60 / arch.actionsPerMinute;
	let actions = 0;
	// Unbroken attention for the same stretch the human played, so the only difference is
	// the decisions and how fast they are made.
	while (clock < recording.endedAt) {
		clock += secondsPerAction * 1000;
		advanceTo(clock);
		checkQuestCompletion();
		act(arch, policy);
		actions++;
	}
	rows.push({
		who: arch.name,
		actions,
		earned: earned(state),
		slots: slots(state),
		tier: state.storage.tier,
		unlocked: unlockedProducts(state),
	});
}

const pad = (s: string, n: number) => (s.length >= n ? s : s + " ".repeat(n - s.length));
const padL = (s: string, n: number) => (s.length >= n ? s : " ".repeat(n - s.length) + s);

console.log(`Same opening, same ${spanMin.toFixed(1)} minutes of unbroken play.\n`);
console.log(pad("who", 12) + padL("actions", 9) + padL("gold made", 12) + padL("per min", 10) + padL("slots", 8) + padL("storage", 9) + padL("products", 10));
const human = rows[0];
for (const r of rows) {
	console.log(
		pad(r.who, 12) +
			padL(r.actions.toLocaleString(), 9) +
			padL(Math.round(r.earned).toLocaleString(), 12) +
			padL(Math.round(r.earned / spanMin).toLocaleString(), 10) +
			padL(String(r.slots), 8) +
			padL(String(r.tier), 9) +
			padL(String(r.unlocked), 10),
	);
}

console.log("");
for (const r of rows.slice(1)) {
	const ratio = r.earned / (human.earned || 1);
	const verdict = ratio > 1.25 ? "faster than the human" : ratio < 0.8 ? "SLOWER than the human" : "about right";
	console.log(`  ${pad(r.who, 12)} ${(ratio * 100).toFixed(0).padStart(4)}% of human earnings  ${verdict}`);
}
console.log("\n  An archetype meant to model a person should land near 100%. Well under means the");
console.log("  policy is a worse player than a real one, and every pacing number it produced is");
console.log("  too pessimistic.");
