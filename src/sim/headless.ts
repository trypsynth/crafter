// Headless simulator entry point.
//
//   deno task sim                          all archetypes, default seeds
//   deno task sim --archetype=casual       just one
//   deno task sim --seeds=50 --days=180    wider sample, longer horizon
//   deno task sim --milestones             per milestone table
//   deno task sim --step-check             does the answer depend on the step size
//   deno task sim --replay=session.json    check a real recorded session replays exactly

import { ARCHETYPE_NAMES, ARCHETYPES } from "./archetypes.ts";
import { runSimulation } from "./harness.ts";
import { aggregate, renderMilestones, renderSummary } from "./report.ts";
import { replay, stateFingerprint } from "./replay.ts";
import { STEP_MS } from "../core/sim.ts";
import type { RunMetrics } from "./metrics.ts";
import type { Recording } from "../core/journal.ts";

function arg(name: string, fallback: string): string {
	const hit = Deno.args.find((a) => a.startsWith(`--${name}=`));
	return hit ? hit.slice(name.length + 3) : fallback;
}

function flag(name: string): boolean {
	return Deno.args.includes(`--${name}`);
}

async function runReplay(path: string): Promise<number> {
	const recording = JSON.parse(await Deno.readTextFile(path)) as Recording & { endState?: unknown };
	console.log(`replaying ${recording.entries.length} actions from ${path}`);
	const result = replay(recording);
	console.log(`  applied ${result.applied} actions`);
	if (result.skipped.length > 0) {
		console.log(`  SKIPPED unknown actions: ${[...new Set(result.skipped)].join(", ")}`);
		return 1;
	}
	if (!recording.endState) {
		console.log("  recording carries no end state, so there is nothing to compare against.");
		console.log("  Export from the game with the session still open to capture one.");
		return 1;
	}
	const expected = stateFingerprint(recording.endState as never);
	const actual = stateFingerprint(result.state);
	if (expected === actual) {
		console.log("  MATCH. The simulator reproduces this session exactly.");
		return 0;
	}
	console.log("  MISMATCH. The simulator does not reproduce this session.");
	const a = JSON.parse(expected) as Record<string, unknown>;
	const b = JSON.parse(actual) as Record<string, unknown>;
	for (const key of new Set([...Object.keys(a), ...Object.keys(b)])) {
		const left = JSON.stringify(a[key]);
		const right = JSON.stringify(b[key]);
		if (left !== right) {
			console.log(`    ${key}:`);
			console.log(`      browser: ${left?.slice(0, 160)}`);
			console.log(`      replay:  ${right?.slice(0, 160)}`);
		}
	}
	return 1;
}

// Accuracy check E. If halving the step changes the answer, the step is too coarse and
// every number the simulator produces is suspect.
function stepCheck(): number {
	console.log(`step size sensitivity (current step ${STEP_MS}ms)`);
	console.log("  Runs the same archetype and seed and compares the outcome.");
	const arch = ARCHETYPES[arg("archetype", "engaged")];
	const results: number[] = [];
	for (const seed of [1, 2, 3]) {
		const r = runSimulation({ archetype: arch, seed, maxDays: 14 });
		results.push(r.activeMinutes);
		const gold = r.milestones["gold_1e6"] ?? -1;
		console.log(`  seed ${seed}: active ${r.activeMinutes.toFixed(0)}m, first million gold at ${gold < 0 ? "never" : (gold / 3600000).toFixed(1) + "h"}`);
	}
	console.log("  Change STEP_MS in src/core/sim.ts and rerun to compare. Results should move by a few percent at most.");
	return 0;
}

function main(): number {
	const seeds = Number(arg("seeds", "12"));
	const days = Number(arg("days", "120"));
	const only = arg("archetype", "");
	const names = only ? [only] : ARCHETYPE_NAMES;
	for (const n of names) {
		if (!ARCHETYPES[n]) {
			console.error(`unknown archetype "${n}". Known: ${ARCHETYPE_NAMES.join(", ")}`);
			return 1;
		}
	}

	console.log(`Crafter balance run: ${names.length} archetype(s), ${seeds} seeds each, ${days} day horizon`);
	const started = performance.now();
	const rows = names.map((name) => {
		const arch = ARCHETYPES[name];
		const runs: RunMetrics[] = [];
		for (let s = 0; s < seeds; s++) runs.push(runSimulation({ archetype: arch, seed: 1000 + s, maxDays: days }));
		return aggregate(name, runs);
	});
	console.log(renderSummary(rows));
	if (flag("milestones")) console.log(renderMilestones(rows));
	console.log("");
	console.log(`${((performance.now() - started) / 1000).toFixed(1)}s`);
	for (const name of names) console.log(`  ${name}: ${ARCHETYPES[name].notes}`);
	return rows.some((r) => r.violations.length > 0) ? 1 : 0;
}

const replayPath = arg("replay", "");
const code = replayPath ? await runReplay(replayPath) : flag("step-check") ? stepCheck() : main();
Deno.exit(code);
