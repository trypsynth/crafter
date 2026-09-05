import { now } from "./clock.ts";
import { advanceTo } from "./sim.ts";
import { checkQuestCompletion } from "./quests.ts";
import { emit } from "./events.ts";

export function tick(): void {
	try {
		advanceTo(now());
	} catch (e) {
		console.error("advanceTo:", e);
	}
	checkQuestCompletion();
	emit("tick");
}
