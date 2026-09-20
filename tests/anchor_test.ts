// The human anchor, as a regression test.
//
// This is a real session played in a browser: 33 actions over 186 seconds, exported from
// the game's own journal. The headless core has to reproduce it exactly. Everything the
// balance work claims rests on this one comparison, so it runs on every commit rather than
// living in someone's memory of having checked it once.
//
// The fixture is imported rather than read, so the suite still needs no permissions.
import { assertEquals } from "@std/assert";
import fixture from "./fixtures/human_session.json" with { type: "json" };
import { replayTo, stateFingerprint } from "../src/sim/replay.ts";
import type { GameState } from "../src/core/types.ts";
import type { Recording } from "../src/core/journal.ts";

const recording = fixture as unknown as Recording & { endState: GameState; endedAt: number };

Deno.test("a recorded human session replays exactly", () => {
	// The snapshot is taken when Export is pressed, later than the last click, so the
	// replay is advanced to that same moment before comparing.
	const result = replayTo(recording, recording.endedAt);
	assertEquals(result.skipped, [], "every recorded action needs a replay handler");
	assertEquals(result.applied, recording.entries.length);
	assertEquals(stateFingerprint(result.state), stateFingerprint(recording.endState));
});

Deno.test("the anchor session is a real one, not a placeholder", () => {
	assertEquals(recording.format, 1);
	assertEquals(recording.entries.length, 33);
	assertEquals(recording.endState.stats.goldEarned, 7265);
	assertEquals(recording.endState.storage.tier, 10);
});
