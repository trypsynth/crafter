"use strict";

const {
	RESOURCES, BUILDING_CONFIG,
	STORAGE_BASE, STORAGE_FIRST_UPGRADE, STORAGE_INCREMENT,
	STORAGE_BASE_COST, STORAGE_COST_GROWTH,
} = require("./game.js");

const SIM_HOURS      = parseFloat(process.argv[2] ?? "2");
const TICK_SEC       = 0.5;
const SELL_THRESHOLD = 0.75;
const SIM_SECS       = SIM_HOURS * 3600;

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
						manualProgress: 0,
					}])
				),
			}])
		),
	};
}

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
	const pcfg      = BUILDING_CONFIG[bk].products[pk];
	const inputSum  = Object.values(pcfg.inputs).reduce((s, n) => s + n, 0);
	const netChange = pcfg.outputAmt - inputSum;
	const key       = `${bk}/${pk}`;
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
			const pcfg     = BUILDING_CONFIG[bk].products[pk];
			const cycleSec = pcfg.baseCycleMs / 1000;
			for (const slot of pst.slots) {
				slot.progress += delta / cycleSec;
				while (slot.progress >= 1.0) {
					slot.progress -= 1.0;
					if (!tryProduce(st, bk, pk, slot, stallSecs)) break;
				}
			}
			if (pst.manualActive) {
				pst.manualProgress += delta / cycleSec;
				if (pst.manualProgress >= 1.0) {
					pst.manualProgress = 0;
					pst.manualActive   = false;
					const inputSum  = Object.values(pcfg.inputs).reduce((s, n) => s + n, 0);
					const netChange = pcfg.outputAmt - inputSum;
					if (netChange <= 0 || totalItems(st) + netChange <= storageMax(st)) {
						let ok = true;
						for (const [ik, amt] of Object.entries(pcfg.inputs)) {
							if (st.inventory[ik] < amt) { ok = false; break; }
						}
						if (ok) {
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

// Add a line here for each new building added to BUILDING_CONFIG.
function buildingPrereq(st, bk) {
	if (bk === "lumber_yard") return true;
	if (bk === "sawmill")     return st.buildings.lumber_yard?.unlocked;
	if (bk === "workshop")    return st.buildings.sawmill?.unlocked
	                              && st.buildings.sawmill.products.boards.unlocked;
	if (bk === "forge")       return st.buildings.workshop?.unlocked;
	if (bk === "foundry")     return st.buildings.forge?.unlocked
	                              && st.buildings.forge.products.iron_fittings.unlocked;
	if (bk === "armoury")     return st.buildings.foundry?.unlocked
	                              && st.buildings.foundry.products.mechanisms.unlocked;
	if (bk === "shipyard")    return st.buildings.armoury?.unlocked
	                              && st.buildings.armoury.products.cannons.unlocked;
	throw new Error(`buildingPrereq: unknown building "${bk}" — update sim.js`);
}

function slotGps(bk, pk) {
	const pcfg     = BUILDING_CONFIG[bk].products[pk];
	const cycleSec = pcfg.baseCycleMs / 1000;
	const outGps   = (pcfg.outputAmt / cycleSec) * RESOURCES[pcfg.outputKey].price;
	const inGps    = Object.entries(pcfg.inputs)
		.reduce((s, [ik, amt]) => s + (amt / cycleSec) * RESOURCES[ik].price, 0);
	return outGps - inGps;
}

// How many units/sec of a resource are currently being produced across all buildings.
function productionRate(st, resourceKey) {
	let rate = 0;
	for (const bk of Object.keys(BUILDING_CONFIG)) {
		if (!st.buildings[bk].unlocked) continue;
		for (const [pk, pcfg] of Object.entries(BUILDING_CONFIG[bk].products)) {
			if (pcfg.outputKey !== resourceKey) continue;
			const pst = st.buildings[bk].products[pk];
			if (!pst.unlocked || pst.slots.length === 0) continue;
			rate += pst.slots.length * pcfg.outputAmt / (pcfg.baseCycleMs / 1000);
		}
	}
	return rate;
}

// Multiplier applied to ROI when inputs aren't being produced yet.
// Prevents the AI from buying high-value slots whose entire input chain doesn't exist.
function inputAvailabilityMultiplier(st, bk, pk) {
	const pcfg = BUILDING_CONFIG[bk].products[pk];
	let multiplier = 1;
	for (const ik of Object.keys(pcfg.inputs)) {
		if (productionRate(st, ik) === 0) multiplier *= 0.05;
	}
	return multiplier;
}

function aiDecide(st, metrics) {
	let anyAction    = true;
	let madePurchase = false;

	while (anyAction) {
		anyAction = false;

		if (totalItems(st) / storageMax(st) >= SELL_THRESHOLD) {
			const earned = doSellAll(st);
			if (earned > 0) {
				metrics.totalEarned += earned;
				metrics.sellEvents++;
				anyAction = true;
				continue;
			}
		}

		const candidates = [];

		for (const bk of Object.keys(BUILDING_CONFIG)) {
			if (!st.buildings[bk].unlocked) continue;
			for (const pk of Object.keys(BUILDING_CONFIG[bk].products)) {
				if (!st.buildings[bk].products[pk].unlocked) continue;
				const cost = nextSlotCost(st, bk, pk);
				const gps  = slotGps(bk, pk);
				if (gps <= 0) continue;
				const roi = (gps / cost) * inputAvailabilityMultiplier(st, bk, pk);
				candidates.push({ type: "slot", bk, pk, cost, roi });
			}
		}

		for (const bk of Object.keys(BUILDING_CONFIG)) {
			if (!st.buildings[bk].unlocked) continue;
			for (const [pk, pcfg] of Object.entries(BUILDING_CONFIG[bk].products)) {
				const pst = st.buildings[bk].products[pk];
				if (pst.unlocked) continue;
				if (pcfg.prereqProduct && !st.buildings[bk].products[pcfg.prereqProduct].unlocked) continue;
				if (pcfg.unlockCost === 0) continue;
				const gps = slotGps(bk, pk);
				if (gps <= 0) continue;
				const combinedCost = pcfg.unlockCost + pcfg.baseSlotCost;
				const roi = (gps / combinedCost) * 3 * inputAvailabilityMultiplier(st, bk, pk);
				candidates.push({ type: "unlock-product", bk, pk, cost: pcfg.unlockCost, roi });
			}
		}

		for (const bk of Object.keys(BUILDING_CONFIG)) {
			if (st.buildings[bk].unlocked) continue;
			if (!buildingPrereq(st, bk)) continue;
			const cfg      = BUILDING_CONFIG[bk];
			const products = Object.keys(cfg.products);
			// Use best (max) product gps rather than average — buildings unlock high-value chains.
			// Large multiplier ensures buildings are prioritized over marginal extra slots.
			const maxGps = products.reduce((m, pk) => Math.max(m, slotGps(bk, pk)), 0);
			const roi    = (maxGps / Math.max(cfg.buildCost, 1)) * 12;
			candidates.push({ type: "build", bk, cost: cfg.buildCost, roi });
		}

		candidates.sort((a, b) => b.roi - a.roi);
		const bestOverall    = candidates[0];
		const bestAffordable = candidates.find(c => st.gold >= c.cost);
		// Save mode: if a building has much higher ROI than anything currently affordable,
		// hold off on slot/unlock purchases to accumulate gold for it.
		const saving = bestOverall && bestAffordable
			&& bestOverall !== bestAffordable
			&& (bestOverall.type === "build" || bestOverall.type === "unlock-product")
			&& bestOverall.roi > bestAffordable.roi * 2;
		const best = saving ? null : bestAffordable;

		// Storage is handled separately — never competes with buildings in ROI scoring.
		// Buy when fill is high and not blocking a save for a building.
		const storageFill     = storageMax(st) > 0 ? totalItems(st) / storageMax(st) : 1;
		const storageCost     = storageUpgradeCost(st);
		const storageCritical = storageFill > 0.88 || st.storage.tier < 2;
		const storageWanted   = storageFill > 0.65 && !saving;

		if (best) {
			let ok = false;
			if (best.type === "slot") {
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
					checkMilestone(metrics,
						`${RESOURCES[BUILDING_CONFIG[best.bk].products[best.pk].outputKey].label} unlocked`, true);
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

		// Storage upgrade: buy when desired (independent of main purchase decision).
		if (!anyAction || madePurchase) {
			if ((storageCritical || storageWanted) && st.gold >= storageCost) {
				if (doUpgradeStorage(st)) {
					metrics.storageUpgrades++;
					metrics.totalSpent += storageCost;
					anyAction    = true;
					madePurchase = true;
				}
			}
		}

		// Bootstrap phase: manually produce input-free items until first slot is purchased.
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
						if (Object.keys(pcfg.inputs).length > 0) continue;
						if (pst.manualActive) continue;
						pst.manualActive   = true;
						pst.manualProgress = 0;
					}
				}
				if (totalItems(st) > 0) {
					const earned = doSellAll(st);
					if (earned > 0) {
						metrics.totalEarned += earned;
						metrics.sellEvents++;
						anyAction = true;
					}
				}
			}
		}
	}

	return madePurchase;
}

function checkMilestone(metrics, label, condition) {
	if (!condition) return;
	if (metrics.milestones.find(m => m.label === label)) return;
	metrics.milestones.push({ label, timeSec: metrics.currentTimeSec });
}

function checkGoldMilestones(metrics, totalEarned) {
	for (const threshold of [1000, 10000, 100000, 1000000]) {
		if (totalEarned >= threshold)
			checkMilestone(metrics, `${formatGold(threshold)} total earned`, true);
	}
}

function fmtTime(sec) {
	const h = Math.floor(sec / 3600);
	const m = Math.floor((sec % 3600) / 60);
	const s = Math.floor(sec % 60);
	return `${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`;
}

function fmtDur(sec) {
	if (sec < 60)   return `${Math.round(sec)}s`;
	if (sec < 3600) return `${Math.floor(sec/60)}m ${Math.round(sec%60)}s`;
	return `${Math.floor(sec/3600)}h ${Math.floor((sec%3600)/60)}m`;
}

function formatGold(n) {
	if (n >= 1000000) return `${(n/1000000).toFixed(1)}M gold`;
	if (n >= 1000)    return `${(n/1000).toFixed(0)}k gold`;
	return `${n} gold`;
}

function pad(str, len) { return String(str).padEnd(len); }

function run() {
	const st        = makeState();
	const stallSecs = {};
	const metrics   = {
		currentTimeSec:      0,
		milestones:          [],
		goldLog:             [],
		idleGoldTime:        0,
		totalEarned:         0,
		totalSpent:          0,
		sellEvents:          0,
		slotsBought:         {},
		storageUpgrades:     0,
		peakGoldRate:        0,
		_lastGoldLogTime:    0,
		_lastGoldLogAmount:  0,
	};

	doUnlockBuilding(st, "lumber_yard");
	checkMilestone(metrics, "Lumber Yard built", true);

	const steps = Math.ceil(SIM_SECS / TICK_SEC);

	for (let i = 0; i < steps; i++) {
		const t = i * TICK_SEC;
		metrics.currentTimeSec = t;

		advance(st, TICK_SEC, stallSecs);

		const madePurchase = aiDecide(st, metrics);
		checkGoldMilestones(metrics, metrics.totalEarned);

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

		if (t - metrics._lastGoldLogTime >= 60) {
			const elapsed = t - metrics._lastGoldLogTime;
			const rate    = elapsed > 0
				? (metrics.totalEarned - metrics._lastGoldLogAmount) / elapsed * 60
				: 0;
			metrics.goldLog.push({ timeSec: t, gold: st.gold, rate });
			if (rate > metrics.peakGoldRate) metrics.peakGoldRate = rate;
			metrics._lastGoldLogTime   = t;
			metrics._lastGoldLogAmount = metrics.totalEarned;
		}
	}

	metrics.currentTimeSec = SIM_SECS;
	printReport(st, metrics, stallSecs);
}

function printReport(st, metrics, stallSecs) {
	const totalSec = SIM_SECS;
	const sep      = "-".repeat(56);

	console.log(`\nCRAFTER BALANCE REPORT — ${SIM_HOURS}h sim`);
	console.log(sep);

	console.log("\nMILESTONES");
	for (const m of metrics.milestones)
		console.log(`  ${fmtTime(m.timeSec)}  ${m.label}`);

	console.log("\nFINAL PRODUCTION STATE");
	for (const bk of Object.keys(BUILDING_CONFIG)) {
		const bst = st.buildings[bk];
		if (!bst.unlocked) { console.log(`  ${BUILDING_CONFIG[bk].label} — not built`); continue; }
		console.log(`  ${BUILDING_CONFIG[bk].label}`);
		for (const [pk, pcfg] of Object.entries(BUILDING_CONFIG[bk].products)) {
			const pst = bst.products[pk];
			if (!pst.unlocked) continue;
			const n          = pst.slots.length;
			const cycleSec   = pcfg.baseCycleMs / 1000;
			const ratePerMin = n === 0 ? 0 : (n * pcfg.outputAmt / cycleSec * 60);
			const inputDesc  = Object.entries(pcfg.inputs)
				.map(([ik, amt]) => `${amt * n} ${RESOURCES[ik].label}/min`).join(", ");
			const slotStr = `${n} slot${n === 1 ? "" : "s"}`;
			const outStr  = n === 0 ? "(no slots)" : `${ratePerMin.toFixed(1)}/min`;
			const inStr   = inputDesc ? `  <- needs ${inputDesc}` : "";
			console.log(`    ${pad(RESOURCES[pcfg.outputKey].label, 12)} ${pad(slotStr, 9)} ${pad(outStr, 14)}${inStr}`);
		}
	}

	const bottlenecks = Object.entries(stallSecs)
		.map(([key, secs]) => ({ key, pct: secs / totalSec * 100 }))
		.filter(b => b.pct > 1)
		.sort((a, b) => b.pct - a.pct);

	console.log("\nBOTTLENECKS  (>1% sim time stalled)");
	if (bottlenecks.length === 0) {
		console.log("  none");
	} else {
		for (const b of bottlenecks)
			console.log(`  ${pad(b.key, 28)} ${b.pct.toFixed(1)}%`);
	}

	const supply = {};
	const demand = {};
	for (const bk of Object.keys(BUILDING_CONFIG)) {
		const bst = st.buildings[bk];
		if (!bst.unlocked) continue;
		for (const [pk, pcfg] of Object.entries(BUILDING_CONFIG[bk].products)) {
			const pst = bst.products[pk];
			if (!pst.unlocked || pst.slots.length === 0) continue;
			const n          = pst.slots.length;
			const cycleSec   = pcfg.baseCycleMs / 1000;
			const ratePerMin = n * pcfg.outputAmt / cycleSec * 60;
			supply[pcfg.outputKey] = (supply[pcfg.outputKey] ?? 0) + ratePerMin;
			for (const [ik, amt] of Object.entries(pcfg.inputs))
				demand[ik] = (demand[ik] ?? 0) + (n * amt / cycleSec * 60);
		}
	}

	console.log("\nCHAIN EFFICIENCY  (supply / demand per minute)");
	const allResources = new Set([...Object.keys(supply), ...Object.keys(demand)]);
	for (const rk of Object.keys(RESOURCES)) {
		if (!allResources.has(rk)) continue;
		const s = supply[rk] ?? 0;
		const d = demand[rk] ?? 0;
		if (d === 0) {
			console.log(`  ${pad(RESOURCES[rk].label, 12)} ${s.toFixed(1)}/min  (no downstream demand)`);
		} else {
			const ratio = s / d;
			const tag   = ratio >= 1.05 ? "ok" : ratio >= 0.95 ? "ok" : "DEFICIT";
			console.log(`  ${pad(RESOURCES[rk].label, 12)} ${ratio.toFixed(2)}x  ${tag}  (${s.toFixed(1)} supply / ${d.toFixed(1)} demand)`);
		}
	}

	const endRate  = metrics.goldLog.length >= 1 ? metrics.goldLog[metrics.goldLog.length - 1].rate : 0;
	const idlePct  = (metrics.idleGoldTime / totalSec * 100).toFixed(1);
	console.log("\nGOLD ECONOMY");
	console.log(`  Earned: ${Math.round(metrics.totalEarned).toLocaleString()}g  Spent: ${Math.round(metrics.totalSpent).toLocaleString()}g  Final: ${Math.floor(st.gold).toLocaleString()}g`);
	console.log(`  Peak rate: ${Math.round(metrics.peakGoldRate).toLocaleString()} g/min  End rate: ${Math.round(endRate).toLocaleString()} g/min`);
	console.log(`  Idle gold time: ${fmtDur(metrics.idleGoldTime)} (${idlePct}%)`);
	console.log(`  Sell triggers: ${metrics.sellEvents}  Storage tier: ${st.storage.tier} (${storageMax(st)} cap, upgraded ${metrics.storageUpgrades}x)`);

	console.log("\nSLOTS BOUGHT");
	for (const [key, count] of Object.entries(metrics.slotsBought).sort((a, b) => b[1] - a[1]))
		console.log(`  ${pad(key, 28)} ${count}`);

	const notes = [];
	for (const b of bottlenecks)
		if (b.pct > 5) notes.push(`! ${b.key} stalls ${b.pct.toFixed(1)}% — check input supply`);
	for (const rk of Object.keys(RESOURCES)) {
		const s = supply[rk] ?? 0;
		const d = demand[rk] ?? 0;
		if (d > 0 && s / d < 0.9) notes.push(`! ${RESOURCES[rk].label} deficit (${(s/d).toFixed(2)}x)`);
	}
	if (parseFloat(idlePct) > 10) notes.push(`! Idle gold ${idlePct}% — not enough to spend on`);
	if (metrics.sellEvents / SIM_HOURS > 120) notes.push(`! ${metrics.sellEvents} sell triggers — storage too tight`);
	if (!metrics.milestones.find(m => m.label.includes("Workshop")))
		notes.push(`! Workshop never built in ${SIM_HOURS}h`);
	if (parseFloat(idlePct) <= 5) notes.push(`ok  Idle gold low (${idlePct}%)`);
	if (bottlenecks.length === 0) notes.push("ok  No significant bottlenecks");

	console.log("\nBALANCE NOTES");
	for (const n of notes) console.log(`  ${n}`);
	console.log();
}

run();
