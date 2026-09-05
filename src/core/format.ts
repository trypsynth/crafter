import { RESOURCES } from "../content/resources.ts";
import { prestigeSpeedMult } from "./economy.ts";
import { entries } from "./util.ts";
import type { ResourceKey } from "./types.ts";

export function formatInputs(inputs: Partial<Record<ResourceKey, number>>): string {
	return entries(inputs as Record<ResourceKey, number>)
		.map(([k, amt]) => `${amt.toLocaleString()} ${amt === 1 ? RESOURCES[k].singular : RESOURCES[k].label}`)
		.join(", ");
}

export function formatResourceName(resourceKey: ResourceKey, amount: number): string {
	return amount === 1 ? RESOURCES[resourceKey].singular : RESOURCES[resourceKey].label;
}

export function formatRate(slots: number, outputAmt: number, baseCycleMs: number, label = ""): string {
	const perMin = slots * outputAmt * 60000 / baseCycleMs;
	const rounded = Math.round(perMin * 10) / 10;
	const num = rounded % 1 === 0 ? `${rounded.toLocaleString()}` : rounded.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
	return label ? `${num} ${label} per minute` : `${num} per minute`;
}

export function formatProductOutput(slots: number, outputAmt: number, baseCycleMs: number, label: ResourceKey | "" = "", brief = false): string {
	const total = slots * outputAmt;
	const cycleSpeedMult = prestigeSpeedMult();
	const actualCycleMs = baseCycleMs / cycleSpeedMult;
	const actualSecs = actualCycleMs / 1000;
	const perMin = total * 60 / actualSecs;
	const perMinFmt = perMin.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).replace(/\.0$/, "");
	const durationNum = actualSecs.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).replace(/\.0$/, "");
	const duration = `${durationNum} ${actualSecs === 1 ? "second" : "seconds"}`;
	const name = label ? (total === 1 ? RESOURCES[label].singular : RESOURCES[label].label) : "";
	if (brief) return `${total.toLocaleString()}${name ? " " + name : ""} every ${duration}`;
	return `${total.toLocaleString()}${name ? " " + name : ""} every ${duration} (${perMinFmt} per minute)`;
}

export function formatDuration(seconds: number): string {
	if (seconds < 60) return `${seconds.toLocaleString()} ${seconds === 1 ? "second" : "seconds"}`;
	const mins = Math.round(seconds / 60);
	if (mins < 60) return `${mins.toLocaleString()} ${mins === 1 ? "minute" : "minutes"}`;
	const hours = Math.round(mins / 60);
	return `${hours.toLocaleString()} ${hours === 1 ? "hour" : "hours"}`;
}

export function formatNum(n: number): string {
	return n.toLocaleString();
}
