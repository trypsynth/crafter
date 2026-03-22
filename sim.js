"use strict";

const {
	RESOURCES, BUILDING_CONFIG,
	STORAGE_BASE, STORAGE_FIRST_UPGRADE, STORAGE_INCREMENT,
	STORAGE_BASE_COST, STORAGE_COST_GROWTH,
} = require("./game.js");

// ─── CLI args ───────────────────────────────────────────────────────────────
const SIM_HOURS      = parseFloat(process.argv[2] ?? "2");
const TICK_SEC       = 0.5;   // virtual seconds per sim step (keep ≤ 2.0)
const SELL_THRESHOLD = 0.75;  // sell inventory when storage is this full
const SIM_SECS       = SIM_HOURS * 3600;

// ─── State factory ──────────────────────────────────────────────────────────
function makeState() {
	return {
		gold: 0,
		inventory: Object.fromEntries(Object.keys(RESOURCES).map(k => [k, 0])),
		storage: { tier: 0 },
		buildings: Object.fromEntries(
			Object.keys(BUILDING_CONFIG).map(bk => [bk, {
				unlocked: false,
				products: Object.fromEntries(
					Object.keys(BUILDING_CONFIG[bk].products).map(pk => [pk, {
						unlocked: BUILDING_CONFIG[bk].products[pk].startsUnlocked ?? false,
						enabled: true,
						slots: [],
						manualProgress: 0,  // simulates player clicking the manual produce button
					}])
				),
			}])
		),
	};
}

// ─── Engine (ported from game.js, DOM-free) ─────────────────────────────────
function totalItems(st) {
	return Object.keys(RESOURCES).reduce((s, k) => s + (st.inventory[k] ?? 0), 0);
}

function storageMax(st) {
	if (st.storage.tier <= 0) return STORAGE_BASE;
	return STORAGE_FIRST_UPGRADE + ((st.storage.tier - 1) * STORAGE_INCREMENT);
}

function storageUpgradeCost(st) {
	return Math.round(STORAGE_BASE_COST * Math.pow(STORAGE_COST_GROWTH, st.storage.tier));
}

function nextSlotCost(st, bk, pk) {
	const n   = st.buildings[bk].products[pk].slots.length;
	const exp = BUILDING_CONFIG[bk].slotCostExponent ?? 1.5;
	return Math.round(BUILDING_CONFIG[bk].products[pk].baseSlotCost * Math.pow(exp, n));
}

function tryProduce(st, bk, pk, slot, stallSecs) {
	const pcfg     = BUILDING_CONFIG[bk].products[pk];
	const inputSum = Object.values(pcfg.inputs).reduce((s, n) => s + n, 0);
	const netChange = pcfg.outputAmt - inputSum;
	const key = `${bk}/${pk}`;
	if (netChange > 0 && totalItems(st) + netChange > storageMax(st)) {
		slot.progress = Math.min(slot.progress, 0.999);
		stallSecs[key] = (stallSecs[key] ?? 0) + TICK_SEC;
		return false;
	}
	for (const [ik, amt] of Object.entries(pcfg.inputs)) {
		if (st.inventory[ik] < amt) {
			slot.progress = Math.min(slot.progress, 0.999);
			stallSecs[key] = (stallSecs[key] ?? 0) + TICK_SEC;
			return false;
		}
	}
	for (const [ik, amt] of Object.entries(pcfg.inputs)) st.inventory[ik] -= amt;
	st.inventory[pcfg.outputKey] += pcfg.outputAmt;
	return true;
}

function advance(st, delta, stallSecs) {
	for (const bk of Object.keys(BUILDING_CONFIG)) {
		const bst = st.buildings[bk];
		if (!bst.unlocked) continue;
		for (const [pk, pst] of Object.entries(bst.products)) {
			if (!pst.unlocked || !pst.enabled) continue;
			const pcfg = BUILDING_CONFIG[bk].products[pk];
			const cycleSec = pcfg.baseCycleMs / 1000;
			for (const slot of pst.slots) {
				slot.progress += delta / cycleSec;
				while (slot.progress >= 1.0) {
					slot.progress -= 1.0;
					if (!tryProduce(st, bk, pk, slot, stallSecs)) break;
				}
			}
			// Manual production: simulates player clicking the button.
			// Active when there are no slots yet (bootstrap phase).
			// Also active for any unlocked product that the AI wants to use manually.
			if (pst.manualActive) {
				pst.manualProgress += delta / cycleSec;
				if (pst.manualProgress >= 1.0) {
					pst.manualProgress = 0;
					pst.manualActive = false;
					// Produce (manual ignores storage since it's one item and always net-zero or positive)
					const inputSum = Object.values(pcfg.inputs).reduce((s, n) => s + n, 0);
					const netChange = pcfg.outputAmt - inputSum;
					if (netChange <= 0 || totalItems(st) + netChange <= storageMax(st)) {
						let canProduce = true;
						for (const [ik, amt] of Object.entries(pcfg.inputs)) {
							if (st.inventory[ik] < amt) { canProduce = false; break; }
						}
						if (canProduce) {
							for (const [ik, amt] of Object.entries(pcfg.inputs)) st.inventory[ik] -= amt;
							st.inventory[pcfg.outputKey] += pcfg.outputAmt;
						}
					}
				}
			}
		}
	}
}

function doUnlockBuilding(st, bk) {
	const cfg = BUILDING_CONFIG[bk];
	const bst = st.buildings[bk];
	if (bst.unlocked || st.gold < cfg.buildCost) return false;
	st.gold -= cfg.buildCost;
	bst.unlocked = true;
	for (const [pk, pcfg] of Object.entries(cfg.products)) {
		if (pcfg.unlockCost === 0 && !pcfg.prereqProduct) bst.products[pk].unlocked = true;
	}
	return true;
}

function doUnlockProduct(st, bk, pk) {
	const pcfg = BUILDING_CONFIG[bk].products[pk];
	const pst  = st.buildings[bk].products[pk];
	if (pst.unlocked) return false;
	if (pcfg.prereqProduct && !st.buildings[bk].products[pcfg.prereqProduct].unlocked) return false;
	if (st.gold < pcfg.unlockCost) return false;
	st.gold -= pcfg.unlockCost;
	pst.unlocked = true;
	return true;
}

function doAddSlot(st, bk, pk) {
	const cost = nextSlotCost(st, bk, pk);
	if (st.gold < cost) return false;
	st.gold -= cost;
	st.buildings[bk].products[pk].slots.push({ progress: 0 });
	return true;
}

function doUpgradeStorage(st) {
	const cost = storageUpgradeCost(st);
	if (st.gold < cost) return false;
	st.gold -= cost;
	st.storage.tier++;
	return true;
}

function doSellAll(st) {
	let earned = 0;
	for (const k of Object.keys(RESOURCES)) {
		earned += (st.inventory[k] ?? 0) * RESOURCES[k].price;
		st.inventory[k] = 0;
	}
	st.gold += earned;
	return earned;
}

// ─── Building prereq (inline — avoids closure issues with exported config) ──
// Add a new line here whenever a new building is added to BUILDING_CONFIG.
function buildingPrereq(st, bk) {
	if (bk === "lumber_yard") return true;
	if (bk === "sawmill")     return st.buildings.lumber_yard?.unlocked;
	if (bk === "workshop")    return st.buildings.sawmill?.unlocked
	                              && st.buildings.sawmill.products.boards.unlocked;
	// Unknown building — fail loudly so it's not silently skipped
	throw new Error(`buildingPrereq: unknown building "${bk}". Update sim.js.`);
}

// ─── ROI scoring ─────────────────────────────────────────────────────────────
function slotGps(bk, pk) {
	const pcfg    = BUILDING_CONFIG[bk].products[pk];
	const cycleSec = pcfg.baseCycleMs / 1000;
	const outGps  = (pcfg.outputAmt / cycleSec) * RESOURCES[pcfg.outputKey].price;
	const inGps   = Object.entries(pcfg.inputs)
		.reduce((s, [ik, amt]) => s + (amt / cycleSec) * RESOURCES[ik].price, 0);
	return outGps - inGps;
}

// ─── AI player ───────────────────────────────────────────────────────────────
function aiDecide(st, metrics) {
	let anyAction = true;
	let madePurchase = false;

	while (anyAction) {
		anyAction = false;

		// Sell if storage getting full
		if (totalItems(st) / storageMax(st) >= SELL_THRESHOLD) {
			const earned = doSellAll(st);
			if (earned > 0) {
				metrics.totalEarned += earned;
				metrics.sellEvents++;
				anyAction = true;
				continue;
			}
		}

		// Build candidates: score by ROI
		const candidates = [];

		// Unlocked slots
		for (const bk of Object.keys(BUILDING_CONFIG)) {
			if (!st.buildings[bk].unlocked) continue;
			for (const pk of Object.keys(BUILDING_CONFIG[bk].products)) {
				if (!st.buildings[bk].products[pk].unlocked) continue;
				const cost = nextSlotCost(st, bk, pk);
				const gps  = slotGps(bk, pk);
				if (gps <= 0) continue;
				candidates.push({ type: "slot", bk, pk, cost, roi: gps / cost });
			}
		}

		// Storage upgrade — score by how often it avoids forced sells
		// High urgency when near/at capacity, always worth buying early tiers quickly
		const storageFill = storageMax(st) > 0 ? totalItems(st) / storageMax(st) : 1;
		const storageCost = storageUpgradeCost(st);
		if (storageFill > 0.5 || st.storage.tier < 2) {
			// Score increases sharply as storage fills; tier 0→1 always has decent ROI
			const urgency = Math.max(storageFill, st.storage.tier < 2 ? 0.6 : 0);
			candidates.push({ type: "storage", cost: storageCost, roi: urgency / storageCost * 1000 });
		}

		// Unlockable products (prereq met, affordable)
		for (const bk of Object.keys(BUILDING_CONFIG)) {
			if (!st.buildings[bk].unlocked) continue;
			for (const [pk, pcfg] of Object.entries(BUILDING_CONFIG[bk].products)) {
				const pst = st.buildings[bk].products[pk];
				if (pst.unlocked) continue;
				if (pcfg.prereqProduct && !st.buildings[bk].products[pcfg.prereqProduct].unlocked) continue;
				if (pcfg.unlockCost === 0) continue; // auto-unlocked on build
				const gps  = slotGps(bk, pk);
				if (gps <= 0) continue;
				// Combined cost: unlock + first slot
				const combinedCost = pcfg.unlockCost + pcfg.baseSlotCost;
				candidates.push({ type: "unlock-product", bk, pk, cost: pcfg.unlockCost, roi: gps / combinedCost * 0.9 });
			}
		}

		// Buildable buildings (prereq met, not yet built)
		for (const bk of Object.keys(BUILDING_CONFIG)) {
			if (st.buildings[bk].unlocked) continue;
			if (!buildingPrereq(st, bk)) continue;
			const cfg = BUILDING_CONFIG[bk];
			// Estimate ROI as avg slot gps of all products / buildCost (with 1.5x bonus for future unlock potential)
			const products = Object.keys(cfg.products);
			const avgGps = products.reduce((s, pk) => s + slotGps(bk, pk), 0) / products.length;
			const roi = (avgGps / Math.max(cfg.buildCost, 1)) * 1.5;
			candidates.push({ type: "build", bk, cost: cfg.buildCost, roi });
		}

		// Sort by ROI descending; pick best affordable
		candidates.sort((a, b) => b.roi - a.roi);
		const best = candidates.find(c => st.gold >= c.cost);

		if (best) {
			let ok = false;
			if (best.type === "storage") {
				ok = doUpgradeStorage(st);
				if (ok) { metrics.storageUpgrades++; metrics.totalSpent += storageCost; }
			} else if (best.type === "slot") {
				ok = doAddSlot(st, best.bk, best.pk);
				if (ok) {
					const key = `${best.bk}/${best.pk}`;
					metrics.slotsBought[key] = (metrics.slotsBought[key] ?? 0) + 1;
					metrics.totalSpent += best.cost;
					checkMilestone(metrics, `${best.bk}/${best.pk} slot 1`,
						st.buildings[best.bk].products[best.pk].slots.length === 1);
				}
			} else if (best.type === "unlock-product") {
				ok = doUnlockProduct(st, best.bk, best.pk);
				if (ok) {
					metrics.totalSpent += best.cost;
					checkMilestone(metrics, `${RESOURCES[BUILDING_CONFIG[best.bk].products[best.pk].outputKey].label} unlocked`, true);
				}
			} else if (best.type === "build") {
				ok = doUnlockBuilding(st, best.bk);
				if (ok) {
					metrics.totalSpent += best.cost;
					checkMilestone(metrics, `${BUILDING_CONFIG[best.bk].label} built`, true);
				}
			}
			if (ok) { anyAction = true; madePurchase = true; }
		}

		// Emergency: all slots stalled AND not already handled above — force storage upgrade
		if (!anyAction) {
			const allStalled = Object.keys(BUILDING_CONFIG).every(bk => {
				if (!st.buildings[bk].unlocked) return true;
				return Object.keys(BUILDING_CONFIG[bk].products).every(pk => {
					const pst = st.buildings[bk].products[pk];
					if (!pst.unlocked || pst.slots.length === 0) return true;
					return pst.slots.every(s => s.progress >= 0.999);
				});
			});
			if (allStalled && st.gold >= storageUpgradeCost(st)) {
				if (doUpgradeStorage(st)) {
					metrics.storageUpgrades++;
					anyAction = true;
					madePurchase = true;
				}
			}
		}

		// Bootstrap: activate manual production for input-free products when we can't afford any slot.
		// Only during early game — stop as soon as any production slot has been purchased.
		// This simulates the player clicking the manual produce button during early game.
		if (!anyAction) {
			const hasAnySlot = Object.keys(BUILDING_CONFIG).some(bk =>
				st.buildings[bk].unlocked &&
				Object.values(st.buildings[bk].products).some(p => p.slots.length > 0)
			);
			if (!hasAnySlot) {
				for (const bk of Object.keys(BUILDING_CONFIG)) {
					if (!st.buildings[bk].unlocked) continue;
					for (const [pk, pcfg] of Object.entries(BUILDING_CONFIG[bk].products)) {
						const pst = st.buildings[bk].products[pk];
						if (!pst.unlocked || !pst.enabled) continue;
						if (Object.keys(pcfg.inputs).length > 0) continue; // only input-free items
						if (pst.manualActive) continue;
						pst.manualActive = true;
						pst.manualProgress = 0;
					}
				}
				if (totalItems(st) > 0) {
					const earned = doSellAll(st);
					if (earned > 0) {
						metrics.totalEarned += earned;
						metrics.sellEvents++;
						anyAction = true; // re-check if we can now afford a slot
					}
				}
			}
		}
	}

	return madePurchase;
}

// ─── Milestones ──────────────────────────────────────────────────────────────
function checkMilestone(metrics, label, condition) {
	if (!condition) return;
	if (metrics.milestones.find(m => m.label === label)) return;
	metrics.milestones.push({ label, timeSec: metrics.currentTimeSec });
}

function checkGoldMilestones(metrics, totalEarned) {
	for (const threshold of [1000, 10000, 100000, 1000000]) {
		if (totalEarned >= threshold) {
			checkMilestone(metrics, `${formatGold(threshold)} total earned`, true);
		}
	}
}

// ─── Formatting helpers ──────────────────────────────────────────────────────
function fmtTime(sec) {
	const h = Math.floor(sec / 3600);
	const m = Math.floor((sec % 3600) / 60);
	const s = Math.floor(sec % 60);
	return `${String(h).padStart(1,"0")}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function fmtDur(sec) {
	if (sec < 60) return `${Math.round(sec)}s`;
	if (sec < 3600) return `${Math.floor(sec/60)}m ${Math.round(sec%60)}s`;
	return `${Math.floor(sec/3600)}h ${Math.floor((sec%3600)/60)}m`;
}

function formatGold(n) {
	if (n >= 1000000) return `${(n/1000000).toFixed(1)}M gold`;
	if (n >= 1000)    return `${(n/1000).toFixed(0)}k gold`;
	return `${n} gold`;
}

function pad(str, len) { return String(str).padEnd(len); }
function lpad(str, len) { return String(str).padStart(len); }

// ─── Main simulation ─────────────────────────────────────────────────────────
function run() {
	const st = makeState();
	const stallSecs = {};
	const metrics = {
		currentTimeSec: 0,
		milestones: [],
		goldLog: [],
		stalls: stallSecs,
		idleGoldTime: 0,
		totalEarned: 0,
		totalSpent: 0,
		sellEvents: 0,
		slotsBought: {},
		storageUpgrades: 0,
		peakGoldRate: 0,
		_lastGoldLogTime: 0,
		_lastGoldLogAmount: 0,
	};

	// Start: lumber yard is free and always available
	doUnlockBuilding(st, "lumber_yard");
	checkMilestone(metrics, "Lumber Yard built", true);

	const steps = Math.ceil(SIM_SECS / TICK_SEC);

	for (let i = 0; i < steps; i++) {
		const t = i * TICK_SEC;
		metrics.currentTimeSec = t;

		advance(st, TICK_SEC, stallSecs);

		const madePurchase = aiDecide(st, metrics);
		checkGoldMilestones(metrics, metrics.totalEarned);

		// Idle gold tracking: count time where gold is high enough to buy something
		// but the AI chose not to (or couldn't). Use cheapest available slot cost as threshold.
		if (!madePurchase) {
			let cheapest = Infinity;
			for (const bk of Object.keys(BUILDING_CONFIG)) {
				if (!st.buildings[bk].unlocked) continue;
				for (const pk of Object.keys(BUILDING_CONFIG[bk].products)) {
					if (!st.buildings[bk].products[pk].unlocked) continue;
					cheapest = Math.min(cheapest, nextSlotCost(st, bk, pk));
				}
			}
			if (st.gold >= cheapest && cheapest < Infinity) metrics.idleGoldTime += TICK_SEC;
		}

		// Gold rate sampling every 60s
		if (t - metrics._lastGoldLogTime >= 60) {
			const elapsed = t - metrics._lastGoldLogTime;
			const rate = elapsed > 0
				? (metrics.totalEarned - metrics._lastGoldLogAmount) / elapsed * 60
				: 0;
			metrics.goldLog.push({ timeSec: t, gold: st.gold, rate });
			if (rate > metrics.peakGoldRate) metrics.peakGoldRate = rate;
			metrics._lastGoldLogTime = t;
			metrics._lastGoldLogAmount = metrics.totalEarned;
		}
	}

	metrics.currentTimeSec = SIM_SECS;
	printReport(st, metrics, stallSecs);
}

// ─── Report printer ──────────────────────────────────────────────────────────
function printReport(st, metrics, stallSecs) {
	const totalSec = SIM_SECS;
	const line = "─".repeat(60);

	console.log(`\n${"═".repeat(60)}`);
	console.log(`  CRAFTER BALANCE REPORT — ${SIM_HOURS}h sim, ${TICK_SEC}s tick`);
	console.log(`  Simulated: ${fmtDur(totalSec)}  |  Steps: ${Math.ceil(totalSec/TICK_SEC)}`);
	console.log(`${"═".repeat(60)}\n`);

	// ── Milestones ──
	console.log("MILESTONES");
	console.log(line);
	for (const m of metrics.milestones) {
		console.log(`  ${fmtTime(m.timeSec)}  ${m.label}`);
	}
	console.log();

	// ── Final production state ──
	console.log("FINAL PRODUCTION STATE");
	console.log(line);
	for (const bk of Object.keys(BUILDING_CONFIG)) {
		const bst = st.buildings[bk];
		if (!bst.unlocked) { console.log(`  ${BUILDING_CONFIG[bk].label} — not built`); continue; }
		console.log(`  ${BUILDING_CONFIG[bk].label}`);
		for (const [pk, pcfg] of Object.entries(BUILDING_CONFIG[bk].products)) {
			const pst = bst.products[pk];
			if (!pst.unlocked) continue;
			const n = pst.slots.length;
			const cycleSec = pcfg.baseCycleMs / 1000;
			const ratePerMin = n === 0 ? 0 : (n * pcfg.outputAmt / cycleSec * 60);
			const inputDesc = Object.entries(pcfg.inputs)
				.map(([ik, amt]) => `${amt * n} ${RESOURCES[ik].label}/min`).join(", ");
			const slotStr = `${n} slot${n === 1 ? "" : "s"}`;
			const outStr  = n === 0 ? "(no slots)" : `→ ${ratePerMin.toFixed(1)}/min`;
			const inStr   = inputDesc ? `  ←  needs ${inputDesc}` : "";
			console.log(`    ${pad(RESOURCES[pcfg.outputKey].label, 12)}  ${pad(slotStr, 10)}  ${pad(outStr, 16)}${inStr}`);
		}
	}
	console.log();

	// ── Bottlenecks ──
	const bottlenecks = Object.entries(stallSecs)
		.map(([key, secs]) => ({ key, pct: secs / totalSec * 100 }))
		.filter(b => b.pct > 1)
		.sort((a, b) => b.pct - a.pct);

	console.log("BOTTLENECKS  (% sim time stalled, only >1%)");
	console.log(line);
	if (bottlenecks.length === 0) {
		console.log("  None — all products ran smoothly.");
	} else {
		for (const b of bottlenecks) {
			console.log(`  ${pad(b.key, 28)}  ${b.pct.toFixed(1)}% stalled`);
		}
	}
	console.log();

	// ── Chain efficiency ──
	// Compute supply/demand ratios for the final slot configuration
	console.log("CHAIN EFFICIENCY  (final supply ÷ demand per minute)");
	console.log(line);
	const supply = {};   // resource → units/min produced
	const demand = {};   // resource → units/min consumed
	for (const bk of Object.keys(BUILDING_CONFIG)) {
		const bst = st.buildings[bk];
		if (!bst.unlocked) continue;
		for (const [pk, pcfg] of Object.entries(BUILDING_CONFIG[bk].products)) {
			const pst = bst.products[pk];
			if (!pst.unlocked || pst.slots.length === 0) continue;
			const n = pst.slots.length;
			const cycleSec = pcfg.baseCycleMs / 1000;
			const ratePerMin = n * pcfg.outputAmt / cycleSec * 60;
			supply[pcfg.outputKey] = (supply[pcfg.outputKey] ?? 0) + ratePerMin;
			for (const [ik, amt] of Object.entries(pcfg.inputs)) {
				demand[ik] = (demand[ik] ?? 0) + (n * amt / cycleSec * 60);
			}
		}
	}
	const allResources = new Set([...Object.keys(supply), ...Object.keys(demand)]);
	for (const rk of Object.keys(RESOURCES)) {
		if (!allResources.has(rk)) continue;
		const s = supply[rk] ?? 0;
		const d = demand[rk] ?? 0;
		if (d === 0) {
			console.log(`  ${pad(RESOURCES[rk].label, 12)}  supply ${s.toFixed(1)}/min, no downstream demand  (sell for profit)`);
		} else {
			const ratio = s / d;
			const tag = ratio >= 1.05 ? "surplus" : ratio >= 0.95 ? "balanced" : "DEFICIT";
			console.log(`  ${pad(RESOURCES[rk].label, 12)}  ${ratio.toFixed(2)}×  ${tag}  (supply ${s.toFixed(1)}/min, demand ${d.toFixed(1)}/min)`);
		}
	}
	console.log();

	// ── Gold economy ──
	const endRate = metrics.goldLog.length >= 1 ? metrics.goldLog[metrics.goldLog.length - 1].rate : 0;
	const idlePct = (metrics.idleGoldTime / totalSec * 100).toFixed(1);
	console.log("GOLD ECONOMY");
	console.log(line);
	console.log(`  Total earned:   ${Math.round(metrics.totalEarned).toLocaleString()}g`);
	console.log(`  Total spent:    ${Math.round(metrics.totalSpent).toLocaleString()}g`);
	console.log(`  Final gold:     ${Math.floor(st.gold).toLocaleString()}g`);
	console.log(`  Peak rate:      ${Math.round(metrics.peakGoldRate).toLocaleString()} g/min`);
	console.log(`  End rate:       ${Math.round(endRate).toLocaleString()} g/min`);
	console.log(`  Idle gold time: ${fmtDur(metrics.idleGoldTime)} (${idlePct}%)`);
	console.log(`  Sell triggers:  ${metrics.sellEvents}`);
	console.log(`  Storage tier:   ${st.storage.tier} (capacity: ${storageMax(st)} items, upgraded ${metrics.storageUpgrades}×)`);
	console.log();

	// ── Slots bought ──
	console.log("SLOTS BOUGHT");
	console.log(line);
	const slotEntries = Object.entries(metrics.slotsBought).sort((a, b) => b[1] - a[1]);
	for (const [key, count] of slotEntries) {
		console.log(`  ${pad(key, 28)}  ${count} slot${count === 1 ? "" : "s"}`);
	}
	console.log();

	// ── Balance notes ──
	console.log("BALANCE NOTES");
	console.log(line);
	const notes = [];

	for (const b of bottlenecks) {
		if (b.pct > 5) {
			notes.push(`⚠  ${b.key} stalls ${b.pct.toFixed(1)}% of sim time — check input supply chain`);
		}
	}

	for (const rk of Object.keys(RESOURCES)) {
		const s = supply[rk] ?? 0;
		const d = demand[rk] ?? 0;
		if (d > 0 && s / d < 0.9) {
			notes.push(`⚠  ${RESOURCES[rk].label} is a supply deficit (${(s/d).toFixed(2)}×) — upstream production may need more slots`);
		}
	}

	const idlePctNum = parseFloat(idlePct);
	if (idlePctNum > 10) {
		notes.push(`⚠  Idle gold time is ${idlePct}% — gold accumulates faster than spending opportunities. Consider adding more unlock tiers or reducing costs.`);
	}

	const sellsPerHour = metrics.sellEvents / SIM_HOURS;
	if (sellsPerHour > 120) {
		notes.push(`⚠  Sell-all triggered ${metrics.sellEvents} times (${Math.round(sellsPerHour)}/hr) — storage is chronically tight. Consider lowering storage upgrade costs or base capacity.`);
	}

	if (!metrics.milestones.find(m => m.label.includes("Workshop"))) {
		notes.push(`⚠  Workshop was never built in ${SIM_HOURS}h — game may be too slow to reach mid-game.`);
	}

	if (idlePctNum <= 5)  notes.push(`✓  Idle gold time low (${idlePct}%) — spending pace is good.`);
	if (bottlenecks.length === 0) notes.push(`✓  No significant bottlenecks — production chains are balanced.`);
	if (metrics.storageUpgrades <= 1) notes.push(`✓  Storage was rarely a constraint (${metrics.storageUpgrades} upgrades).`);

	if (notes.length === 0) notes.push("No issues detected.");
	for (const n of notes) console.log(`  ${n}`);

	console.log(`\n${"═".repeat(60)}\n`);
}

run();
