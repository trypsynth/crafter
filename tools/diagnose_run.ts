// Prints what a policy is actually looking at when it gets stuck. The summary table can
// only say a run stalled; this says which quest it stalled on and how far off it was.
import { ARCHETYPES } from "../src/sim/archetypes.ts";
import { runSimulation } from "../src/sim/harness.ts";
import { state } from "../src/core/state.ts";
import { getQuestProgress, questBaseline, questById } from "../src/core/quests.ts";
import { QUEST_CHAINS, QUEST_POOL } from "../src/content/quests.ts";
import { eligibleQuestPool, isGameComplete } from "../src/core/quests.ts";
import { storageMax, totalItems } from "../src/core/economy.ts";

const name = Deno.args.find((a) => !a.startsWith("--")) ?? "optimizer";
const days = Number(Deno.args.find((a) => a.startsWith("--days="))?.slice(7) ?? 10);

const result = runSimulation({ archetype: ARCHETYPES[name], seed: 1000, maxDays: days });

console.log(`${name}, ${days} days, ${result.activeMinutes.toFixed(0)} active minutes\n`);
console.log(`gold ............ ${Math.floor(state.gold).toLocaleString()}`);
console.log(`lifetime gold ... ${Math.floor(state.prestige.accumulatedStats.goldEarned + state.stats.goldEarned).toLocaleString()}`);
console.log(`storage ......... ${totalItems()} / ${storageMax()} (tier ${state.storage.tier})`);
console.log(`prestige runs ... ${state.prestige.runs}`);
console.log(`quests banked ... ${state.prestige.completedQuestIds.length} of ${QUEST_POOL.length}`);

let slots = 0;
for (const bst of Object.values(state.buildings)) {
	for (const pst of Object.values(bst.products)) slots += pst.slots.length;
}
console.log(`slots ........... ${slots}`);
console.log(`active quests ... ${state.quests.active.length}`);
console.log(`eligible pool ... ${eligibleQuestPool().length}`);
console.log(`game complete ... ${isGameComplete()}`);
console.log(`seen buildings .. ${state.prestige.seenBuildings.join(", ") || "(none)"}`);
const banked = new Set(state.prestige.completedQuestIds);
const blocked = QUEST_CHAINS.filter((c) => c.prereq && !new Set(["lumber_yard", ...state.prestige.seenBuildings]).has(c.prereq));
const unfinished = QUEST_CHAINS.filter((c) => c.tiers.some((_, i) => !banked.has(`${c.id}_t${i}`)));
console.log(`chains unfinished ${unfinished.length}, of which gated by an unseen building: ${unfinished.filter((c) => blocked.includes(c)).length}`);
if (blocked.length) console.log(`  gated chains: ${blocked.map((c) => c.id + " needs " + c.prereq).slice(0, 8).join(", ")}`);
console.log(`buildings ....... ${Object.entries(state.buildings).filter(([, b]) => b.unlocked).map(([k]) => k).join(", ")}`);

console.log("\nACTIONS TAKEN");
for (const [kind, n] of Object.entries(result.actionCounts).sort((a, b) => b[1] - a[1])) {
	console.log(`  ${kind.padEnd(12)} ${n.toLocaleString().padStart(10)}`);
}

console.log("\nACTIVE QUESTS");
for (let i = 0; i < state.quests.active.length; i++) {
	const id = state.quests.active[i];
	const def = questById(id);
	if (!def) continue;
	const { current, target } = getQuestProgress(def, questBaseline(id, def));
	const done = state.quests.completed[i];
	const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
	console.log(
		`  ${done ? "done" : "    "} ${def.label.padEnd(34)} ${current.toLocaleString().padStart(12)} / ${target.toLocaleString().padStart(12)}  ${
			pct.toFixed(0).padStart(3)
		}%`,
	);
}

console.log("\nPRODUCTION");
for (const [bk, bst] of Object.entries(state.buildings)) {
	if (!bst.unlocked) continue;
	const line = Object.entries(bst.products)
		.filter(([, p]) => p.unlocked)
		.map(([pk, p]) => `${pk}:${p.slots.length}`)
		.join(" ");
	if (line) console.log(`  ${bk.padEnd(14)} ${line}`);
}
