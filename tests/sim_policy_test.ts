// Tests for the simulator itself. A balance tool that quietly drifts is worse than none,
// because its numbers still look like answers.
import { assert, assertEquals, assertGreater, assertLess } from "@std/assert";
import { ARCHETYPES } from "../src/sim/archetypes.ts";
import { runSimulation } from "../src/sim/harness.ts";
import { aggregate } from "../src/sim/report.ts";
import { percentile } from "../src/sim/metrics.ts";
import { knownActions, replay, stateFingerprint } from "../src/sim/replay.ts";
import { state } from "../src/core/state.ts";
import type { Recording } from "../src/core/journal.ts";

// Tests bound the work rather than the calendar: the optimizer acts thousands of times a
// day, so a day count alone is not a time limit.
const CAP = 20_000;

Deno.test("the same seed produces the same run twice", () => {
	const opts = { archetype: ARCHETYPES.casual, seed: 7, maxDays: 6, maxActions: CAP };
	const a = runSimulation(opts);
	const b = runSimulation(opts);
	assertEquals(JSON.stringify(a.milestones), JSON.stringify(b.milestones));
	assertEquals(a.activeMinutes, b.activeMinutes);
	assertEquals(JSON.stringify(a.actionCounts), JSON.stringify(b.actionCounts));
});

Deno.test("different seeds produce different runs", () => {
	const a = runSimulation({ archetype: ARCHETYPES.casual, seed: 1, maxDays: 8, maxActions: CAP });
	const b = runSimulation({ archetype: ARCHETYPES.casual, seed: 2, maxDays: 8, maxActions: CAP });
	assert(
		JSON.stringify(a.milestones) !== JSON.stringify(b.milestones) || a.activeMinutes !== b.activeMinutes,
		"seeds must actually change the run, or the generator is not being consulted",
	);
});

Deno.test("no archetype breaks an invariant", () => {
	for (const arch of Object.values(ARCHETYPES)) {
		const r = runSimulation({ archetype: arch, seed: 42, maxDays: 5, maxActions: CAP });
		assertEquals(r.violations, [], `${arch.name}: ${r.violations.join("; ")}`);
	}
});

Deno.test("every archetype keeps making progress rather than seizing up", () => {
	for (const arch of Object.values(ARCHETYPES)) {
		const r = runSimulation({ archetype: arch, seed: 11, maxDays: 10, maxActions: CAP });
		assertGreater(r.progressGaps.length, 0, `${arch.name} never progressed at all`);
		assert(r.milestones["build_sawmill"] !== undefined, `${arch.name} never reached the first new building`);
	}
});

Deno.test("the machine floor outruns every human archetype", () => {
	const days = 10;
	const bot = runSimulation({ archetype: ARCHETYPES.optimizer, seed: 5, maxDays: days, maxActions: CAP });
	const casual = runSimulation({ archetype: ARCHETYPES.casual, seed: 5, maxDays: days, maxActions: CAP });
	const botQuests = Object.keys(bot.milestones).length;
	const casualQuests = Object.keys(casual.milestones).length;
	assertGreater(botQuests, casualQuests, "an inhumanly attentive bot must outpace a three-visits-a-day player");
});

Deno.test("skill shows up as faster progress, not just noise", () => {
	const days = 12;
	const engaged = runSimulation({ archetype: ARCHETYPES.engaged, seed: 3, maxDays: days, maxActions: CAP });
	const lurker = runSimulation({ archetype: ARCHETYPES.lurker, seed: 3, maxDays: days, maxActions: CAP });
	const engagedGold = engaged.milestones["gold_1e6"] ?? Infinity;
	const lurkerGold = lurker.milestones["gold_1e6"] ?? Infinity;
	assertLess(engagedGold, lurkerGold, "the engaged player should reach a million gold first");
});

Deno.test("dead time is measured, not assumed away", () => {
	const r = runSimulation({ archetype: ARCHETYPES.lurker, seed: 9, maxDays: 10, maxActions: CAP });
	assert(r.deadMinutes >= 0 && r.deadMinutes <= r.activeMinutes, "dead time must be a share of active time");
});

Deno.test("percentiles behave at the edges", () => {
	assertEquals(percentile([], 50), 0);
	assertEquals(percentile([5], 50), 5);
	assertEquals(percentile([1, 2, 3, 4], 100), 4);
	assertEquals(percentile([1, 2, 3, 4], 1), 1);
});

Deno.test("aggregation survives runs that never finish", () => {
	const runs = [runSimulation({ archetype: ARCHETYPES.lurker, seed: 1, maxDays: 3, maxActions: CAP })];
	const agg = aggregate("lurker", runs);
	assertEquals(agg.daysToComplete, null);
	assertEquals(agg.completedPct, 0);
	assertEquals(agg.runs, 1);
});

Deno.test("every journalled action has a replay handler", () => {
	// If the game records an action the replay table does not know, a recorded session
	// replays wrong and silently. These two lists must not drift apart.
	const recorded = [
		"build",
		"unlock",
		"addSlot",
		"sellSlot",
		"manual",
		"storage",
		"sellAll",
		"sell",
		"toggle",
		"treasure",
		"fixBottleneck",
		"reroll",
		"prestige",
		"newGame",
	];
	const known = new Set(knownActions());
	for (const a of recorded) assert(known.has(a), `replay has no handler for recorded action "${a}"`);
});

Deno.test("a recorded session replays to the same state", () => {
	// Build a recording by hand rather than from the browser, so the round trip is
	// covered without needing a captured session on disk.
	runSimulation({ archetype: ARCHETYPES.casual, seed: 21, maxDays: 1, maxActions: CAP });
	const start = JSON.parse(JSON.stringify(state));
	const t0 = 1_700_000_000_000;
	const recording: Recording = {
		format: 1,
		startedAt: t0,
		seed: 4321,
		startState: start,
		entries: [
			{ t: t0 + 1000, a: "addSlot", p: ["lumber_yard", "logs"] },
			{ t: t0 + 60_000, a: "sellAll" },
			{ t: t0 + 120_000, a: "addSlot", p: ["lumber_yard", "logs"] },
			{ t: t0 + 300_000, a: "sellAll" },
		],
	};
	const first = replay(recording);
	const firstPrint = stateFingerprint(first.state);
	const second = replay(recording);
	assertEquals(second.applied, 4);
	assertEquals(second.skipped, []);
	assertEquals(stateFingerprint(second.state), firstPrint, "replaying twice must land in the same place");
});
