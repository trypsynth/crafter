import { state } from "./state.ts";
import { now } from "./clock.ts";
import { random } from "./rng.ts";
import { advanceBuildings } from "./production.ts";
import { checkQuestCompletion } from "./quests.ts";
import { announce, emit } from "./events.ts";
import { TREASURE_DURATION_SPREAD_MS, TREASURE_GAP_SPREAD_MS, TREASURE_MIN_DURATION_MS, TREASURE_MIN_GAP_MS } from "./constants.ts";

function advanceTreasure(t: number): void {
	if (state.treasure.activeUntil && t > state.treasure.activeUntil) {
		state.treasure.activeUntil = 0;
		emit("treasure:change");
	}
	if (!state.treasure.activeUntil && t > state.treasure.nextSpawn) {
		const duration = TREASURE_MIN_DURATION_MS + random() * TREASURE_DURATION_SPREAD_MS;
		state.treasure.activeUntil = t + duration;
		state.treasure.nextSpawn = t + TREASURE_MIN_GAP_MS + random() * TREASURE_GAP_SPREAD_MS;
		announce(`Treasure chest spawned, active for ${Math.round(duration / 1000)} seconds!`);
		emit("treasure:change");
	}
}

export function tick(): void {
	const t = now();
	const delta = (t - (state.lastTick ?? t)) / 1000;
	state.lastTick = t;
	advanceTreasure(t);
	try {
		advanceBuildings(delta);
	} catch (e) {
		console.error("advanceBuildings:", e);
	}
	checkQuestCompletion();
	emit("tick");
}
