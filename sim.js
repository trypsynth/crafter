"use strict";

const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
const {
	RESOURCES, BUILDING_CONFIG, QUEST_CHAINS,
	STORAGE_BASE, STORAGE_FIRST_UPGRADE, STORAGE_INCREMENT,
	STORAGE_BASE_COST, STORAGE_COST_GROWTH,
} = require("./game.js");

const PROFILES = [
	{
		name:            "Greedy",
		desc:            "Buys first affordable thing, sells early, never saves",
		sellThreshold:   0.55,
		saveMultiplier:  1.0,   // never waits — always buys best affordable
		storageCritical: 0.92,
		storageWanted:   0.72,
	},
	{
		name:            "Balanced",
		desc:            "Default behaviour — moderate saving, mid sell threshold",
		sellThreshold:   0.75,
		saveMultiplier:  2.0,
		storageCritical: 0.88,
		storageWanted:   0.65,
	},
	{
		name:            "Patient",
		desc:            "Saves aggressively for high-ROI investments",
		sellThreshold:   0.75,
		saveMultiplier:  4.0,
		storageCritical: 0.88,
		storageWanted:   0.65,
	},
	{
		name:            "Miser",
		desc:            "Sells late, saves hard, upgrades storage heavily",
		sellThreshold:   0.85,
		saveMultiplier:  5.0,
		storageCritical: 0.70,
		storageWanted:   0.50,
	},
];

const SIM_HOURS = parseFloat(process.argv[2] ?? "2");
const TICK_SEC  = 0.5;
const SIM_SECS  = SIM_HOURS * 3600;

const ALL_QUESTS = QUEST_CHAINS.flatMap(chain =>
	chain.tiers.map((tier, i) => ({
		id:        `${chain.id}_t${i}`,
		chainId:   chain.id,
		tierIndex: i,
		type:      chain.type,
		resource:  chain.resource,
		bld:       chain.bld,
		product:   chain.product,
		prereq:    chain.prereq,
		target:    tier.target,
		label:     tier.label,
		reward:    tier.reward,
	}))
);

function makeState() {
	return {
		gold: 0,
		inventory:      Object.fromEntries(Object.keys(RESOURCES).map(k => [k, 0])),
		soldByResource: Object.fromEntries(Object.keys(RESOURCES).map(k => [k, 0])),
		storage: { tier: 0 },
		buildings: Object.fromEntries(
			Object.keys(BUILDING_CONFIG).map(bk => [bk, {
				unlocked: false,
				products: Object.fromEntries(
					Object.keys(BUILDING_CONFIG[bk].products).map(pk => [pk, {
						unlocked: BUILDING_CONFIG[bk].products[pk].startsUnlocked ?? false,
						enabled:  true,
						slots:    [],
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
		const qty = st.inventory[k] ?? 0;
		earned += qty * RESOURCES[k].price;
		st.soldByResource[k] += qty;
		st.inventory[k] = 0;
	}
	st.gold += earned;
	return earned;
}

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

function snapshotChainRates(st) {
	const supply = {}, demand = {};
	for (const bk of Object.keys(BUILDING_CONFIG)) {
		const bst = st.buildings[bk];
		if (!bst.unlocked) continue;
		for (const [pk, pcfg] of Object.entries(BUILDING_CONFIG[bk].products)) {
			const pst = bst.products[pk];
			if (!pst.unlocked || pst.slots.length === 0) continue;
			const n = pst.slots.length, cycleSec = pcfg.baseCycleMs / 1000;
			supply[pcfg.outputKey] = (supply[pcfg.outputKey] ?? 0) + n * pcfg.outputAmt / cycleSec;
			for (const [ik, amt] of Object.entries(pcfg.inputs))
				demand[ik] = (demand[ik] ?? 0) + n * amt / cycleSec;
		}
	}
	return { supply, demand };
}

// Uses a continuous ratio (supply/demand) rather than a binary has-any-production check,
// so partial input deficits get appropriately penalised instead of ignored.
function inputAvailabilityMultiplier(rates, bk, pk) {
	const pcfg = BUILDING_CONFIG[bk].products[pk];
	if (Object.keys(pcfg.inputs).length === 0) return 1;
	let multiplier = 1;
	for (const [ik] of Object.entries(pcfg.inputs)) {
		const s = rates.supply[ik] ?? 0;
		const d = rates.demand[ik] ?? 0;
		if (s === 0) { multiplier *= 0.05; continue; }  // input chain doesn't exist yet
		if (d === 0) continue;                           // no competing demand, no penalty
		multiplier *= Math.min(1.0, s / d);
	}
	return multiplier;
}

function questProgress(st, metrics, quest) {
	switch (quest.type) {
		case "sell":
			return st.soldByResource[quest.resource] ?? 0;
		case "slots":
			return st.buildings[quest.bld]?.products[quest.product]?.slots.length ?? 0;
		case "total_slots": {
			let n = 0;
			for (const bst of Object.values(st.buildings))
				for (const pst of Object.values(bst.products)) n += pst.slots.length;
			return n;
		}
		case "build":
			return st.buildings[quest.bld]?.unlocked ? 1 : 0;
		case "unlock":
			return st.buildings[quest.bld]?.products[quest.product]?.unlocked ? 1 : 0;
		case "storage":
			return st.storage.tier;
		case "gold_earned":
			return metrics.totalEarned;
		default:
			return 0;
	}
}

function aiDecide(st, metrics, profile) {
	let anyAction    = true;
	let madePurchase = false;

	while (anyAction) {
		anyAction = false;

		if (totalItems(st) / storageMax(st) >= profile.sellThreshold) {
			const earned = doSellAll(st);
			if (earned > 0) {
				metrics.totalEarned += earned;
				metrics.sellEvents++;
				anyAction = true;
				continue;
			}
		}

		const candidates = [];
		const rates = snapshotChainRates(st);

		for (const bk of Object.keys(BUILDING_CONFIG)) {
			if (!st.buildings[bk].unlocked) continue;
			for (const pk of Object.keys(BUILDING_CONFIG[bk].products)) {
				if (!st.buildings[bk].products[pk].unlocked) continue;
				const cost = nextSlotCost(st, bk, pk);
				const gps  = slotGps(bk, pk);
				if (gps <= 0) continue;
				const roi = (gps / cost) * inputAvailabilityMultiplier(rates, bk, pk);
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
				const roi = (gps / combinedCost) * 3 * inputAvailabilityMultiplier(rates, bk, pk);
				candidates.push({ type: "unlock-product", bk, pk, cost: pcfg.unlockCost, roi });
			}
		}

		for (const bk of Object.keys(BUILDING_CONFIG)) {
			if (st.buildings[bk].unlocked) continue;
			if (!buildingPrereq(st, bk)) continue;
			const cfg    = BUILDING_CONFIG[bk];
			const maxGps = Object.keys(cfg.products).reduce((m, pk) => Math.max(m, slotGps(bk, pk)), 0);
			const roi    = (maxGps / Math.max(cfg.buildCost, 1)) * 12;
			candidates.push({ type: "build", bk, cost: cfg.buildCost, roi });
		}

		candidates.sort((a, b) => b.roi - a.roi);
		const bestOverall    = candidates[0];
		const bestAffordable = candidates.find(c => st.gold >= c.cost);
		const saving = bestOverall && bestAffordable
			&& bestOverall !== bestAffordable
			&& (bestOverall.type === "build" || bestOverall.type === "unlock-product")
			&& profile.saveMultiplier > 1
			&& bestOverall.roi > bestAffordable.roi * profile.saveMultiplier;
		const best = saving ? null : bestAffordable;

		const storageFill     = storageMax(st) > 0 ? totalItems(st) / storageMax(st) : 1;
		const storageCost     = storageUpgradeCost(st);
		const storageCritical = storageFill > profile.storageCritical || st.storage.tier < 2;
		const storageWanted   = storageFill > profile.storageWanted && !saving;

		if (best) {
			let ok = false;
			if (best.type === "slot") {
				ok = doAddSlot(st, best.bk, best.pk);
				if (ok) {
					const key = `${best.bk}/${best.pk}`;
					metrics.slotsBought[key] = (metrics.slotsBought[key] ?? 0) + 1;
					metrics.totalSpent   += best.cost;
					metrics.spentOnSlots += best.cost;
					checkMilestone(metrics, `${best.bk}/${best.pk} slot 1`,
						st.buildings[best.bk].products[best.pk].slots.length === 1);
				}
			} else if (best.type === "unlock-product") {
				ok = doUnlockProduct(st, best.bk, best.pk);
				if (ok) {
					metrics.totalSpent      += best.cost;
					metrics.spentOnUnlocks  += best.cost;
					checkMilestone(metrics,
						`${RESOURCES[BUILDING_CONFIG[best.bk].products[best.pk].outputKey].label} unlocked`, true);
				}
			} else if (best.type === "build") {
				ok = doUnlockBuilding(st, best.bk);
				if (ok) {
					metrics.totalSpent    += best.cost;
					metrics.spentOnBuilds += best.cost;
					checkMilestone(metrics, `${BUILDING_CONFIG[best.bk].label} built`, true);
				}
			}
			if (ok) { anyAction = true; madePurchase = true; }
		}

		if (!anyAction || madePurchase) {
			if ((storageCritical || storageWanted) && st.gold >= storageCost) {
				if (doUpgradeStorage(st)) {
					metrics.storageUpgrades++;
					metrics.totalSpent      += storageCost;
					metrics.spentOnStorage  += storageCost;
					anyAction    = true;
					madePurchase = true;
				}
			}
		}

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

function checkGoldMilestones(metrics) {
	for (const threshold of [1000, 10000, 100000, 1000000]) {
		if (metrics.totalEarned >= threshold)
			checkMilestone(metrics, `${formatGold(threshold)} total earned`, true);
	}
}

function runSim(profile) {
	const st        = makeState();
	const stallSecs = {};
	const metrics   = {
		currentTimeSec:   0,
		milestones:       [],
		goldLog:          [],
		idleGoldTime:     0,
		totalEarned:      0,
		totalSpent:       0,
		spentOnSlots:     0,
		spentOnUnlocks:   0,
		spentOnBuilds:    0,
		spentOnStorage:   0,
		sellEvents:       0,
		slotsBought:      {},
		storageUpgrades:  0,
		peakGoldRate:     0,
		questCompletions: {},
		_lastGoldLogTime:   0,
		_lastGoldLogAmount: 0,
	};

	doUnlockBuilding(st, "lumber_yard");
	checkMilestone(metrics, "Lumber Yard built", true);

	const steps = Math.ceil(SIM_SECS / TICK_SEC);

	for (let i = 0; i < steps; i++) {
		const t = i * TICK_SEC;
		metrics.currentTimeSec = t;

		advance(st, TICK_SEC, stallSecs);
		const madePurchase = aiDecide(st, metrics, profile);
		checkGoldMilestones(metrics);

		for (const quest of ALL_QUESTS) {
			if (metrics.questCompletions[quest.id] !== undefined) continue;
			if (questProgress(st, metrics, quest) >= quest.target)
				metrics.questCompletions[quest.id] = t;
		}

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
	return { profile, st, metrics, stallSecs };
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
	if (n >= 1000000) return `${(n/1000000).toFixed(1)}M`;
	if (n >= 1000)    return `${(n/1000).toFixed(0)}k`;
	return `${String(n)}`;
}

function pad(str, len, right = false) {
	const s = String(str);
	return right ? s.padStart(len) : s.padEnd(len);
}

function rewardLabel(r) {
	if (r.type === "starting_gold")  return `+${r.amount.toLocaleString()}g start`;
	if (r.type === "slot_cost_pct")  return `slot cost -${r.amount}%`;
	if (r.type === "unlock_cost_pct")return `unlock cost -${r.amount}%`;
	if (r.type === "build_cost_pct") return `build cost -${r.amount}%`;
	if (r.type === "sell_price_pct") return `sell price +${r.amount}%`;
	if (r.type === "storage_tier")   return `+${r.amount} storage tier`;
	if (r.type === "cycle_speed_pct")return `speed +${r.amount}%`;
	return r.type;
}

function chainRates(st) {
	const supply = {}, demand = {};
	for (const bk of Object.keys(BUILDING_CONFIG)) {
		const bst = st.buildings[bk];
		if (!bst.unlocked) continue;
		for (const [pk, pcfg] of Object.entries(BUILDING_CONFIG[bk].products)) {
			const pst = bst.products[pk];
			if (!pst.unlocked || pst.slots.length === 0) continue;
			const n = pst.slots.length, cycleSec = pcfg.baseCycleMs / 1000;
			supply[pcfg.outputKey] = (supply[pcfg.outputKey] ?? 0) + n * pcfg.outputAmt / cycleSec * 60;
			for (const [ik, amt] of Object.entries(pcfg.inputs))
				demand[ik] = (demand[ik] ?? 0) + n * amt / cycleSec * 60;
		}
	}
	return { supply, demand };
}

function printComparison(results) {
	const COL = 12;
	const LBL = 26;

	console.log(`\nCRAFTER SIM — ${SIM_HOURS}h`);

	process.stdout.write(pad("", LBL));
	for (const r of results) process.stdout.write(pad(r.profile.name, COL));
	console.log();

	function row(label, fn) {
		process.stdout.write(pad(label, LBL));
		for (const r of results) process.stdout.write(pad(fn(r), COL));
		console.log();
	}

	const endRate = r => r.metrics.goldLog.length
		? r.metrics.goldLog[r.metrics.goldLog.length - 1].rate
		: 0;

	row("Total earned",      r => `${formatGold(r.metrics.totalEarned)}g`);
	row("Final gold",        r => `${formatGold(Math.floor(r.st.gold))}g`);
	row("Peak g/min",        r => `${Math.round(r.metrics.peakGoldRate).toLocaleString()}`);
	row("End g/min",         r => `${Math.round(endRate(r)).toLocaleString()}`);
	row("Sell triggers",     r => `${r.metrics.sellEvents}`);
	row("Storage tier",      r => `${r.st.storage.tier} (${storageMax(r.st)} cap)`);
	row("Idle gold %",       r => `${(r.metrics.idleGoldTime / SIM_SECS * 100).toFixed(1)}%`);
	row("Quests completable",r => {
		const n = Object.keys(r.metrics.questCompletions).length;
		return `${n}/${ALL_QUESTS.length}`;
	});

	console.log();
	for (const frac of [0.25, 0.5, 0.75]) {
		const label = `g/min at ${Math.round(frac * SIM_HOURS * 60)}m`;
		row(label, r => {
			const target = SIM_SECS * frac;
			const entry  = r.metrics.goldLog.reduce((best, e) =>
				Math.abs(e.timeSec - target) < Math.abs(best.timeSec - target) ? e : best,
				r.metrics.goldLog[0] ?? { timeSec: 0, rate: 0 }
			);
			return entry ? Math.round(entry.rate).toLocaleString() : "-";
		});
	}

	const milestoneLabels = [
		...Object.values(BUILDING_CONFIG).map(c => `${c.label} built`),
		"10k total earned",
		"100k total earned",
		"1.0M total earned",
	];
	console.log();
	console.log(pad("MILESTONES", LBL + COL * results.length));
	for (const label of milestoneLabels) {
		const anyHit = results.some(r => r.metrics.milestones.find(m => m.label === label));
		if (!anyHit) continue;
		process.stdout.write(pad(label, LBL));
		for (const r of results) {
			const m = r.metrics.milestones.find(m => m.label === label);
			process.stdout.write(pad(m ? fmtTime(m.timeSec) : "—", COL));
		}
		console.log();
	}

	const allStallKeys = new Set(results.flatMap(r => Object.keys(r.stallSecs)));
	const significantStalls = [...allStallKeys].filter(key =>
		results.some(r => (r.stallSecs[key] ?? 0) / SIM_SECS * 100 > 1)
	);
	if (significantStalls.length > 0) {
		console.log();
		console.log(pad("BOTTLENECKS (% stall)", LBL + COL * results.length));
		for (const key of significantStalls.sort()) {
			process.stdout.write(pad(key, LBL));
			for (const r of results) {
				const pct = (r.stallSecs[key] ?? 0) / SIM_SECS * 100;
				process.stdout.write(pad(pct < 0.5 ? "-" : `${pct.toFixed(1)}%`, COL));
			}
			console.log();
		}
	}

	console.log();
	console.log(pad("CHAIN DEFICITS (supply/demand per min)", LBL + COL * results.length));
	let anyDeficit = false;
	for (const rk of Object.keys(RESOURCES)) {
		const cols = results.map(r => {
			const { supply, demand } = chainRates(r.st);
			const s = supply[rk] ?? 0, d = demand[rk] ?? 0;
			if (d === 0) return null;
			return s / d;
		});
		if (!cols.some(v => v !== null && v < 1.0)) continue;
		anyDeficit = true;
		process.stdout.write(pad(RESOURCES[rk].label, LBL));
		for (const ratio of cols) {
			if (ratio === null) { process.stdout.write(pad("-", COL)); continue; }
			const tag = ratio < 0.9 ? `${ratio.toFixed(2)}x !!` : ratio < 1.0 ? `${ratio.toFixed(2)}x !` : `${ratio.toFixed(2)}x`;
			process.stdout.write(pad(tag, COL));
		}
		console.log();
	}
	if (!anyDeficit) console.log(pad("  none detected", LBL));

	console.log();
	console.log("VERDICT");
	for (const r of results) {
		const notes = [];
		const idlePct = r.metrics.idleGoldTime / SIM_SECS * 100;
		if (idlePct > 15) notes.push(`held-gold ${idlePct.toFixed(0)}%`);
		if (r.metrics.sellEvents / SIM_HOURS > 200) notes.push(`overselling (${r.metrics.sellEvents}×)`);
		const { supply, demand } = chainRates(r.st);
		for (const rk of Object.keys(RESOURCES)) {
			const s = supply[rk] ?? 0, d = demand[rk] ?? 0;
			if (d > 0 && s / d < 0.9) notes.push(`${RESOURCES[rk].label} deficit`);
		}
		const worstStall = Object.entries(r.stallSecs)
			.map(([k, secs]) => ({ k, pct: secs / SIM_SECS * 100 }))
			.sort((a, b) => b.pct - a.pct)[0];
		if (worstStall && worstStall.pct > 10) notes.push(`stall: ${worstStall.k} ${worstStall.pct.toFixed(0)}%`);
		console.log(`  ${pad(r.profile.name + ":", 11)}${notes.length === 0 ? "ok" : notes.join(", ")}`);
	}
}

function printQuestReport(results) {
	const QCOL = 11;
	const QLBL = 32;
	const RCOL = 22;

	const completable = ALL_QUESTS
		.map(q => ({
			quest: q,
			times: results.map(r => r.metrics.questCompletions[q.id] ?? Infinity),
		}))
		.filter(({ times }) => times.some(t => t < Infinity))
		.sort((a, b) => Math.min(...a.times) - Math.min(...b.times));

	const unreachable = ALL_QUESTS.filter(q =>
		results.every(r => r.metrics.questCompletions[q.id] === undefined)
	);

	console.log(`\nQUEST SPEEDRUN — completable in ${SIM_HOURS}h`);
	process.stdout.write(pad("Quest", QLBL));
	for (const r of results) process.stdout.write(pad(r.profile.name, QCOL));
	process.stdout.write(pad("Reward", RCOL));
	console.log();

	let lastPrereq = null;
	for (const { quest, times } of completable) {
		const prereqKey = quest.prereq ?? "none";
		if (prereqKey !== lastPrereq) {
			const bldLabel = quest.prereq
				? `[requires ${BUILDING_CONFIG[quest.prereq]?.label ?? quest.prereq}]`
				: "[Lumber Yard]";
			console.log(bldLabel);
			lastPrereq = prereqKey;
		}
		process.stdout.write(pad(quest.label, QLBL));
		for (const t of times)
			process.stdout.write(pad(t < Infinity ? fmtTime(t) : "—", QCOL));
		process.stdout.write(rewardLabel(quest.reward));
		console.log();
	}

	if (unreachable.length > 0) {
		console.log();
		console.log(`NOT REACHABLE IN ${SIM_HOURS}h (${unreachable.length} quests):`);
		const byPrereq = {};
		for (const q of unreachable) {
			const k = q.prereq ?? "none";
			(byPrereq[k] = byPrereq[k] ?? []).push(q.label);
		}
		for (const [k, labels] of Object.entries(byPrereq)) {
			const bld = k === "none" ? "Lumber Yard" : BUILDING_CONFIG[k]?.label ?? k;
			console.log(`  [${bld}] ${labels.join(", ")}`);
		}
	}

	// Estimate gold-equivalent value per 1 unit of each reward type, using Balanced data.
	// These are single-run approximations; % rewards compound across runs while starting_gold stays flat.
	const ref = results.find(r => r.profile.name === "Balanced") ?? results[0];
	const m   = ref.metrics;

	const rewardValues = [
		{ type: "sell_price_pct",  unit: "1%",  value: m.totalEarned / 100,   note: "scales with future earnings" },
		{ type: "cycle_speed_pct", unit: "1%",  value: m.totalEarned / 100,   note: "scales with future earnings" },
		{ type: "slot_cost_pct",   unit: "1%",  value: m.spentOnSlots / 100,  note: "" },
		{ type: "unlock_cost_pct", unit: "1%",  value: m.spentOnUnlocks / 100,note: "" },
		{ type: "build_cost_pct",  unit: "1%",  value: m.spentOnBuilds / 100, note: "" },
		{ type: "storage_tier",    unit: "+1",   value: m.spentOnStorage / Math.max(1, m.storageUpgrades), note: "avg upgrade cost saved" },
		{ type: "starting_gold",   unit: "+1g",  value: 1,                    note: "fixed, does not scale" },
	];

	console.log(`\nREWARD VALUE — gold-equivalent per unit (${ref.profile.name} ${SIM_HOURS}h baseline)`);
	for (const rv of rewardValues) {
		const val = Math.round(rv.value);
		const note = rv.note ? `  (${rv.note})` : "";
		console.log(`  ${pad(`${rv.type}:${rv.unit}`, 24)} ≈ ${formatGold(val)}g${note}`);
	}

	// Flag starting_gold quest rewards that are weak relative to sell_price_pct equivalents.
	const sellPctPer1 = m.totalEarned / 100;
	const startGoldQuests = completable.filter(({ quest }) => quest.reward.type === "starting_gold");
	if (startGoldQuests.length > 0) {
		console.log(`\nSTARTING GOLD QUESTS  (vs ${ref.profile.name} sell_price_pct:1% ≈ ${formatGold(Math.round(sellPctPer1))}g)`);
		for (const { quest, times } of startGoldQuests) {
			const g   = quest.reward.amount;
			const pct = g / sellPctPer1;
			const tag = pct < 0.05 ? " !! very weak" : pct < 0.25 ? " !  weak" : pct < 0.75 ? "    ok" : "    good";
			const minTime = fmtTime(Math.min(...times));
			console.log(`  ${pad(quest.label, QLBL)} +${pad(g.toLocaleString() + "g", 9)} ≈ ${pad(pct.toFixed(2) + "% sell pct", 18)}${tag}  (done by ${minTime})`);
		}
	}
}

function printReport(result) {
	const { profile, st, metrics, stallSecs } = result;

	console.log(`\nPROFILE: ${profile.name.toUpperCase()} — ${profile.desc}`);
	console.log(`  sell@${(profile.sellThreshold*100).toFixed(0)}%  save×${profile.saveMultiplier}  storage-critical@${(profile.storageCritical*100).toFixed(0)}%`);

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
			const outStr = n === 0 ? "(no slots)" : `${ratePerMin.toFixed(1)}/min`;
			const inStr  = inputDesc ? `  <- needs ${inputDesc}` : "";
			console.log(`    ${pad(RESOURCES[pcfg.outputKey].label, 12)} ${pad(`${n} slot${n===1?"":"s"}`, 9)} ${pad(outStr, 14)}${inStr}`);
		}
	}

	const bottlenecks = Object.entries(stallSecs)
		.map(([key, secs]) => ({ key, pct: secs / SIM_SECS * 100 }))
		.filter(b => b.pct > 1)
		.sort((a, b) => b.pct - a.pct);

	console.log("\nBOTTLENECKS  (>1% sim time stalled)");
	if (bottlenecks.length === 0) {
		console.log("  none");
	} else {
		for (const b of bottlenecks)
			console.log(`  ${pad(b.key, 28)} ${b.pct.toFixed(1)}%`);
	}

	const { supply, demand } = chainRates(st);
	console.log("\nCHAIN EFFICIENCY  (supply / demand per minute)");
	const allResources = new Set([...Object.keys(supply), ...Object.keys(demand)]);
	for (const rk of Object.keys(RESOURCES)) {
		if (!allResources.has(rk)) continue;
		const s = supply[rk] ?? 0, d = demand[rk] ?? 0;
		if (d === 0) {
			console.log(`  ${pad(RESOURCES[rk].label, 12)} ${s.toFixed(1)}/min  (no downstream demand)`);
		} else {
			const ratio = s / d;
			const tag   = ratio < 0.9 ? "DEFICIT" : "ok";
			console.log(`  ${pad(RESOURCES[rk].label, 12)} ${ratio.toFixed(2)}x  ${tag}  (${s.toFixed(1)} supply / ${d.toFixed(1)} demand)`);
		}
	}

	const endRate = metrics.goldLog.length ? metrics.goldLog[metrics.goldLog.length - 1].rate : 0;
	const idlePct = (metrics.idleGoldTime / SIM_SECS * 100).toFixed(1);
	console.log("\nGOLD ECONOMY");
	console.log(`  Earned: ${Math.round(metrics.totalEarned).toLocaleString()}g  Spent: ${Math.round(metrics.totalSpent).toLocaleString()}g  Final: ${Math.floor(st.gold).toLocaleString()}g`);
	console.log(`  Spent breakdown — slots: ${formatGold(metrics.spentOnSlots)}g  unlocks: ${formatGold(metrics.spentOnUnlocks)}g  buildings: ${formatGold(metrics.spentOnBuilds)}g  storage: ${formatGold(metrics.spentOnStorage)}g`);
	console.log(`  Peak rate: ${Math.round(metrics.peakGoldRate).toLocaleString()} g/min  End rate: ${Math.round(endRate).toLocaleString()} g/min`);
	console.log(`  Idle gold time: ${fmtDur(metrics.idleGoldTime)} (${idlePct}%)`);
	console.log(`  Sell triggers: ${metrics.sellEvents}  Storage tier: ${st.storage.tier} (${storageMax(st)} cap, upgraded ${metrics.storageUpgrades}×)`);

	console.log("\nSLOTS BOUGHT");
	for (const [key, count] of Object.entries(metrics.slotsBought).sort((a, b) => b[1] - a[1]))
		console.log(`  ${pad(key, 28)} ${count}`);

	const questsDone = ALL_QUESTS.filter(q => metrics.questCompletions[q.id] !== undefined);
	console.log(`\nQUESTS COMPLETED  (${questsDone.length}/${ALL_QUESTS.length})`);
	for (const q of questsDone.sort((a, b) => metrics.questCompletions[a.id] - metrics.questCompletions[b.id]))
		console.log(`  ${fmtTime(metrics.questCompletions[q.id])}  ${pad(q.label, 30)} ${rewardLabel(q.reward)}`);

	const notes = [];
	for (const b of bottlenecks)
		if (b.pct > 5) notes.push(`! ${b.key} stalls ${b.pct.toFixed(1)}% — check input supply`);
	for (const rk of Object.keys(RESOURCES)) {
		const s = supply[rk] ?? 0, d = demand[rk] ?? 0;
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
}

if (!isMainThread) {
	const result = runSim(workerData.profile);
	// Strip slot progress objects before postMessage to keep the payload small.
	for (const bk of Object.keys(result.st.buildings))
		for (const pk of Object.keys(result.st.buildings[bk].products))
			result.st.buildings[bk].products[pk].slots = result.st.buildings[bk].products[pk].slots.map(() => ({}));
	parentPort.postMessage(result);
} else {
	const pending = PROFILES.map(profile => new Promise((resolve, reject) => {
		const w = new Worker(__filename, { workerData: { profile } });
		w.on("message", resolve);
		w.on("error", reject);
	}));

	Promise.all(pending).then(results => {
		printComparison(results);
		printQuestReport(results);
		console.log("\n\nDETAILED REPORTS");
		for (const r of results) printReport(r);
		console.log();
	}).catch(err => {
		console.error("Simulation error:", err);
		process.exit(1);
	});
}
