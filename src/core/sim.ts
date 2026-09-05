import { state } from "./state.ts";
import { advanceBuildings } from "./production.ts";
import { advanceTreasure } from "./treasure.ts";

// One fixed step drives everything: the live game, offline catch-up, and the headless
// simulator. Time that does not fill a whole step is left on the clock and picked up by
// a later call, so an hour played at the keyboard and an hour spent away produce the
// same result. Two code paths would mean two sets of bugs and no way to trust either.
export const STEP_MS = 1000;
const STEP_SEC = STEP_MS / 1000;

// Advances the world up to targetMs and returns how many steps ran. `budget` caps the
// work in one call so a very stale save cannot lock the page up mid boot.
export function advanceTo(targetMs: number, budget = Infinity): number {
	if (state.lastTick === null) {
		state.lastTick = targetMs;
		return 0;
	}
	if (targetMs < state.lastTick) {
		// Clock moved backwards (timezone change, manual clock edit). Resync, do no work.
		state.lastTick = targetMs;
		return 0;
	}
	let steps = 0;
	// Once production reports a fixed point it stays there for the rest of this call:
	// nothing outside the loop touches inventory, and treasure only pays gold.
	let productionLive = true;
	while (targetMs - state.lastTick >= STEP_MS && steps < budget) {
		state.lastTick += STEP_MS;
		advanceTreasure(state.lastTick);
		if (productionLive) productionLive = advanceBuildings(STEP_SEC);
		steps++;
	}
	return steps;
}

// Steps pending between lastTick and now. Useful for reporting and for tests.
export function pendingSteps(nowMs: number): number {
	if (state.lastTick === null) return 0;
	return Math.max(0, Math.floor((nowMs - state.lastTick) / STEP_MS));
}
