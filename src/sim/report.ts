// Results are reported as distributions across seeds, never as one number. A single
// figure hides the variance that decides whether a change is real or noise, and a single
// figure is exactly the shape of answer that is easy to believe and wrong.

import { MILESTONES, percentile, type RunMetrics } from "./metrics.ts";

export interface Aggregate {
	archetype: string;
	runs: number;
	completedPct: number;
	daysToComplete: { p10: number; p50: number; p90: number } | null;
	activeHours: number;
	progressGapP50: number;
	progressGapP90: number;
	progressGapMax: number;
	purchaseGapP90: number;
	deadPct: number;
	stalledPct: number;
	milestoneDays: Record<string, number | null>;
	violations: string[];
}

const DAY_MS = 24 * 3600 * 1000;

export function aggregate(archetype: string, runs: RunMetrics[]): Aggregate {
	const finished = runs.filter((r) => r.completed);
	const completionDays = finished
		.map((r) => r.milestones["era_complete"])
		.filter((v): v is number => v !== undefined)
		.map((ms) => ms / DAY_MS);
	const progressGaps = runs.flatMap((r) => r.progressGaps);
	const purchaseGaps = runs.flatMap((r) => r.purchaseGaps);
	const activeMinutes = runs.reduce((s, r) => s + r.activeMinutes, 0) / runs.length;
	const dead = runs.reduce((s, r) => s + r.deadMinutes, 0);
	const stalled = runs.reduce((s, r) => s + r.stalledMinutes, 0);
	const totalActive = runs.reduce((s, r) => s + r.activeMinutes, 0) || 1;

	const milestoneDays: Record<string, number | null> = {};
	for (const m of MILESTONES) {
		const hits = runs.map((r) => r.milestones[m]).filter((v): v is number => v !== undefined);
		milestoneDays[m] = hits.length === 0 ? null : percentile(hits, 50) / DAY_MS;
	}

	return {
		archetype,
		runs: runs.length,
		completedPct: (finished.length / runs.length) * 100,
		daysToComplete: completionDays.length === 0 ? null : {
			p10: percentile(completionDays, 10),
			p50: percentile(completionDays, 50),
			p90: percentile(completionDays, 90),
		},
		activeHours: activeMinutes / 60,
		progressGapP50: percentile(progressGaps, 50),
		progressGapP90: percentile(progressGaps, 90),
		progressGapMax: progressGaps.length ? Math.max(...progressGaps) : 0,
		purchaseGapP90: percentile(purchaseGaps, 90),
		deadPct: (dead / totalActive) * 100,
		stalledPct: (stalled / totalActive) * 100,
		milestoneDays,
		violations: runs.flatMap((r) => r.violations).slice(0, 10),
	};
}

function pad(s: string, n: number): string {
	return s.length >= n ? s : s + " ".repeat(n - s.length);
}

function padL(s: string, n: number): string {
	return s.length >= n ? s : " ".repeat(n - s.length) + s;
}

function days(n: number | null): string {
	if (n === null) return "-";
	if (n < 1) return `${(n * 24).toFixed(1)}h`;
	return `${n.toFixed(1)}d`;
}

function mins(n: number): string {
	if (n >= 60) return `${(n / 60).toFixed(1)}h`;
	return `${n.toFixed(1)}m`;
}

export function renderSummary(rows: Aggregate[]): string {
	const out: string[] = [];
	out.push("");
	out.push("TIME TO CLEAR AN ERA");
	out.push(pad("archetype", 12) + padL("done", 6) + padL("p10", 8) + padL("p50", 8) + padL("p90", 8) + padL("active", 9));
	for (const r of rows) {
		out.push(
			pad(r.archetype, 12) +
				padL(`${r.completedPct.toFixed(0)}%`, 6) +
				padL(days(r.daysToComplete?.p10 ?? null), 8) +
				padL(days(r.daysToComplete?.p50 ?? null), 8) +
				padL(days(r.daysToComplete?.p90 ?? null), 8) +
				padL(`${r.activeHours.toFixed(1)}h`, 9),
		);
	}

	out.push("");
	out.push("HOW OFTEN SOMETHING HAPPENS  (active play between progress moments)");
	out.push(pad("archetype", 12) + padL("typical", 10) + padL("slow 10%", 10) + padL("worst", 10) + padL("nothing", 10) + padL("jammed", 9));
	for (const r of rows) {
		out.push(
			pad(r.archetype, 12) +
				padL(mins(r.progressGapP50), 10) +
				padL(mins(r.progressGapP90), 10) +
				padL(mins(r.progressGapMax), 10) +
				padL(`${r.deadPct.toFixed(0)}%`, 10) +
				padL(`${r.stalledPct.toFixed(0)}%`, 9),
		);
	}
	out.push("");
	out.push("  typical/slow/worst: minutes of active play between a quest, unlock, building or prestige.");
	out.push("  nothing: share of active play with nothing affordable. jammed: share with the store full.");
	out.push("");
	out.push("  READ THE OPTIMIZER AS A MACHINE FLOOR, NOT A HUMAN ONE.");
	out.push("  It acts every two seconds for twelve hours a day and never loses focus, which no");
	out.push("  person does. It is also a greedy bot with no plan, so a sharp player beats it on");
	out.push("  strategy while losing to it on stamina. Its time is a lower bound on the clock, not");
	out.push("  a target to balance against. Only a recorded human session settles the real number.");

	const violations = rows.flatMap((r) => r.violations);
	if (violations.length > 0) {
		out.push("");
		out.push("INVARIANT VIOLATIONS");
		for (const v of violations.slice(0, 10)) out.push(`  ${v}`);
	}
	return out.join("\n");
}

export function renderMilestones(rows: Aggregate[]): string {
	const out: string[] = [];
	out.push("");
	out.push("MEDIAN TIME TO EACH MILESTONE");
	out.push(pad("milestone", 18) + rows.map((r) => padL(r.archetype.slice(0, 9), 10)).join(""));
	for (const m of MILESTONES) {
		const cells = rows.map((r) => padL(days(r.milestoneDays[m]), 10)).join("");
		out.push(pad(m, 18) + cells);
	}
	return out.join("\n");
}
