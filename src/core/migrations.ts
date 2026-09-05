// Save schema versioning.
//
// A save carries the version it was written with. On load it is walked forward one
// migration at a time until it matches SAVE_VERSION. Saves from a newer build are
// refused rather than merged, so a downgrade cannot quietly destroy progress.

import { randomSeed } from "./rng.ts";

export const SAVE_VERSION = 1;

type RawSave = Record<string, any>;
type Migration = (s: RawSave) => RawSave;

export const MIGRATIONS: Record<number, Migration> = {
	// v0 is every save written before versioning existed. The shape is unchanged; this
	// just fills in what load() used to patch up by hand on every boot.
	1: (s) => {
		for (const bst of Object.values(s.buildings ?? {}) as RawSave[]) {
			for (const pst of Object.values(bst.products ?? {}) as RawSave[]) {
				if (!pst.manual || typeof pst.manual !== "object") pst.manual = { active: false, progress: 0 };
				if (pst.manual.active === undefined) pst.manual.active = false;
				if (pst.manual.progress === undefined) pst.manual.progress = 0;
				if (pst.enabled === undefined) pst.enabled = true;
				if (!Array.isArray(pst.slots)) pst.slots = [];
			}
		}
		if (typeof s.rngState !== "number") s.rngState = randomSeed();
		return s;
	},
};

export class SaveTooNewError extends Error {
	constructor(public readonly found: number) {
		super(`Save was written by a newer build (version ${found}, this build reads ${SAVE_VERSION}).`);
		this.name = "SaveTooNewError";
	}
}

export function saveVersionOf(s: RawSave): number {
	return typeof s.version === "number" ? s.version : 0;
}

export function migrate(raw: RawSave): RawSave {
	let s = raw;
	let v = saveVersionOf(s);
	if (v > SAVE_VERSION) throw new SaveTooNewError(v);
	while (v < SAVE_VERSION) {
		v++;
		s = MIGRATIONS[v](s);
		s.version = v;
	}
	s.version = SAVE_VERSION;
	return s;
}
