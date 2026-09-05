import { state } from "./state.ts";
import { random } from "./rng.ts";
import { announce, emit } from "./events.ts";
import { TREASURE_DURATION_SPREAD_MS, TREASURE_GAP_SPREAD_MS, TREASURE_MIN_DURATION_MS, TREASURE_MIN_GAP_MS } from "./constants.ts";

// Runs inside the simulation step, so chests spawn and expire on their own schedule
// whether or not anyone is watching. One that came and went while you were away is
// simply gone, which is what the timestamps always implied.
export function advanceTreasure(atMs: number): void {
	if (state.treasure.activeUntil && atMs > state.treasure.activeUntil) {
		state.treasure.activeUntil = 0;
		emit("treasure:change");
	}
	if (!state.treasure.activeUntil && atMs > state.treasure.nextSpawn) {
		const duration = TREASURE_MIN_DURATION_MS + random() * TREASURE_DURATION_SPREAD_MS;
		state.treasure.activeUntil = atMs + duration;
		state.treasure.nextSpawn = atMs + TREASURE_MIN_GAP_MS + random() * TREASURE_GAP_SPREAD_MS;
		announce(`Treasure chest spawned, active for ${Math.round(duration / 1000)} seconds!`);
		emit("treasure:change");
	}
}
