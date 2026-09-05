// Records what the player actually did, with timestamps.
//
// This is the ground truth the balance work rests on. A recorded session can be replayed
// through the headless core and the resulting state compared against what the browser
// really held. If they differ, the simulator is lying and every number it produces is
// worthless. Without this there is no way to find that out except by playing the game
// yourself and noticing the estimate was nowhere close.

import { now } from "./clock.ts";

export type JournalParam = string | number;

export interface JournalEntry {
	/** Wall clock time of the action. */
	t: number;
	/** Action name, matching a key in the replay table. */
	a: string;
	/** Positional arguments, if any. */
	p?: JournalParam[];
}

export interface Recording {
	format: 1;
	startedAt: number;
	seed: number;
	/** State at the moment recording began, as JSON. */
	startState: unknown;
	entries: JournalEntry[];
}

// A long session is thousands of clicks, not millions. The cap stops a runaway loop from
// eating memory, and losing the oldest entries is better than losing the tab.
const MAX_ENTRIES = 50_000;

let entries: JournalEntry[] = [];
let startState: unknown = null;
let startedAt = 0;
let seed = 0;
let recording = false;

export function startRecording(stateSnapshot: unknown, rngSeed: number): void {
	entries = [];
	startState = stateSnapshot;
	startedAt = now();
	seed = rngSeed;
	recording = true;
}

export function stopRecording(): void {
	recording = false;
}

export function isRecording(): boolean {
	return recording;
}

export function record(action: string, ...params: JournalParam[]): void {
	if (!recording) return;
	if (entries.length >= MAX_ENTRIES) entries.shift();
	entries.push(params.length > 0 ? { t: now(), a: action, p: params } : { t: now(), a: action });
}

export function getRecording(): Recording | null {
	if (startState === null) return null;
	return { format: 1, startedAt, seed, startState, entries: [...entries] };
}

export function entryCount(): number {
	return entries.length;
}

export function clearRecording(): void {
	entries = [];
	startState = null;
	recording = false;
}
