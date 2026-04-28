"use strict";

const { Worker, isMainThread, parentPort, workerData } = require("worker_threads");
const {
	RESOURCES, BUILDING_CONFIG, QUEST_CHAINS,
	STORAGE_BASE, STORAGE_FIRST_UPGRADE, STORAGE_INCREMENT,
	STORAGE_BASE_COST, STORAGE_COST_GROWTH,
} = require("./game.js");

const PROFILES = [
	{
		name:            "Casual",
		desc:            "Checks the game 4 times a day for 10 minutes",
		sellThreshold:   0.80,
		saveMultiplier:  2.0,
		storageCritical: 0.90,
		storageWanted:   0.70,
		checkInInterval: 6 * 3600, // Every 6 hours
		checkInDuration: 10 * 60,  // For 10 minutes
	},
	{
		name:            "Dedicated",
		desc:            "Checks every 2 hours while awake (16h active day)",
		sellThreshold:   0.70,
		saveMultiplier:  1.5,
		storageCritical: 0.85,
		storageWanted:   0.60,
		checkInInterval: 2 * 3600,
		checkInDuration: 15 * 60,
	},
	{
		name:            "Addicted",
		desc:            "Checks every 30 mins, stays on for 10",
		sellThreshold:   0.50,
		saveMultiplier:  1.0,
		storageCritical: 0.80,
		storageWanted:   0.40,
		checkInInterval: 0.5 * 3600,
		checkInDuration: 10 * 60,
	},
];

const SIM_HOURS = parseFloat(process.argv[2] ?? "24");
const TICK_SEC  = 0.5;
const SIM_SECS  = SIM_HOURS * 3600;

const ALL_QUESTS = QUEST_CHAINS.flatMap(chain => chain.tiers.map((tier, i) => ({
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
})));

function makeState() {
	return {
		gold: 0,
		inventory:      Object.fromEntries(Object.keys(RESOURCES).map(k => [k, 0])),
		soldByResource: Object.fromEntries(Object.keys(RESOURCES).map(k => [k, 0])),
		storage: { tier: 0 },
		buildings: Object.fromEntries(Object.keys(BUILDING_CONFIG).map(bk => [bk, {
			unlocked: false,
			products: Object.fromEntries(Object.keys(BUILDING_CONFIG[bk].products).map(pk => [pk, {
				unlocked: BUILDING_CONFIG[bk].products[pk].startsUnlocked ?? false,
				enabled:  true,
				slots:    [],
				manualProgress: 0,
			}])),
		}])),
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

function advance(st, delta, stallSecs, isSleeping) {
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
					if (!tryProduce(st, bk, pk, slot, stallSecs)) {
						slot.progress = 0.999;
						break;
					}
					slot.progress -= 1.0;
				}
			}
			if (!isSleeping && pst.manualActive) {
				pst.manualProgress += delta / cycleSec;
				if (pst.manualProgress >= 1.0) {
					if (tryProduce(st, bk, pk, { progress: 0 }, stallSecs)) {
						pst.manualProgress = 0;
					} else {
						pst.manualProgress = 0.999;
					}
				}
			}
		}
	}
}

function snapshotChainRates(st) {
	const rates = {};
	for (const bk of Object.keys(BUILDING_CONFIG)) {
		if (!st.buildings[bk].unlocked) continue;
		for (const pk of Object.keys(BUILDING_CONFIG[bk].products)) {
			const pst = st.buildings[bk].products[pk];
			if (!pst.unlocked || !pst.enabled) continue;
			const pcfg = BUILDING_CONFIG[bk].products[pk];
			const perMin = (60 / (pcfg.baseCycleMs / 1000)) * (pst.slots.length + (pst.manualActive ? 1 : 0)) * pcfg.outputAmt;
			rates[pk] = (rates[pk] ?? 0) + perMin;
			for (const [ik, amt] of Object.entries(pcfg.inputs)) {
				const inPerMin = (60 / (pcfg.baseCycleMs / 1000)) * (pst.slots.length + (pst.manualActive ? 1 : 0)) * amt;
				rates[ik] = (rates[ik] ?? 0) - inPerMin;
			}
		}
	}
	return rates;
}

function inputAvailabilityMultiplier(rates, bk, pk) {
	const pcfg = BUILDING_CONFIG[bk].products[pk];
	let mult = 1.0;
	for (const ik of Object.keys(pcfg.inputs)) {
		const r = rates[ik] ?? 0;
		if (r < 0) mult *= 0.5;
		if (r < -10) mult *= 0.2;
	}
	return mult;
}

function slotGps(bk, pk) {
	const pcfg = BUILDING_CONFIG[bk].products[pk];
	const cycleSec = pcfg.baseCycleMs / 1000;
	const outVal = pcfg.outputAmt * RESOURCES[pcfg.outputKey].price;
	let inVal = 0;
	for (const [ik, amt] of Object.entries(pcfg.inputs)) inVal += amt * RESOURCES[ik].price;
	return (outVal - inVal) / cycleSec;
}

function buildingPrereq(st, bk) {
	const p = BUILDING_CONFIG[bk].prereq;
	if (typeof p === "function") {
		// Mock prestige functions for sim
		global.prestige = { seenBuildings: Object.keys(st.buildings).filter(k => st.buildings[k].unlocked) };
		global.state = st;
		return p();
	}
	return true;
}

function getCandidates(st, rates, profile) {
	const candidates = [];
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
	return candidates;
}

function doSellAll(st) {
	let earned = 0;
	for (const rk of Object.keys(RESOURCES)) {
		const inv = st.inventory[rk] || 0;
		if (inv > 0) {
			earned += inv * RESOURCES[rk].price;
			st.soldByResource[rk] += inv;
			st.inventory[rk] = 0;
		}
	}
	st.gold += earned;
	return earned;
}

function doAddSlot(st, bk, pk) {
	const cost = nextSlotCost(st, bk, pk);
	if (st.gold < cost) return false;
	st.gold -= cost;
	st.buildings[bk].products[pk].slots.push({ progress: 0 });
	return true;
}

function doUnlockProduct(st, bk, pk) {
	const cost = BUILDING_CONFIG[bk].products[pk].unlockCost;
	if (st.gold < cost) return false;
	st.gold -= cost;
	st.buildings[bk].products[pk].unlocked = true;
	return true;
}

function doUnlockBuilding(st, bk) {
	const cost = BUILDING_CONFIG[bk].buildCost;
	if (st.gold < cost) return false;
	st.gold -= cost;
	st.buildings[bk].unlocked = true;
	return true;
}

function doUpgradeStorage(st) {
	const cost = storageUpgradeCost(st);
	if (st.gold < cost) return false;
	st.gold -= cost;
	st.storage.tier++;
	return true;
}

function aiDecide(st, metrics, profile, candidates, bestAffordable, saving) {
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
					checkMilestone(metrics, `${best.bk}/${best.pk} slot 1`, st.buildings[best.bk].products[best.pk].slots.length === 1);
				}
			} else if (best.type === "unlock-product") {
				ok = doUnlockProduct(st, best.bk, best.pk);
				if (ok) {
					metrics.totalSpent     += best.cost;
					metrics.spentOnUnlocks += best.cost;
					checkMilestone(metrics, `${RESOURCES[BUILDING_CONFIG[best.bk].products[best.pk].outputKey].label} unlocked`, true);
				}
			} else if (best.type === "build") {
				ok = doUnlockBuilding(st, best.bk);
				if (ok) {
					metrics.totalSpent    += best.cost;
					metrics.spentOnBuilds += best.cost;
					checkMilestone(metrics, `${BUILDING_CONFIG[best.bk].label} built`, true);
				}
			}
			if (ok) { 
				anyAction = true; 
				madePurchase = true; 
				const rates = snapshotChainRates(st);
				candidates = getCandidates(st, rates, profile);
				bestAffordable = candidates.find(c => st.gold >= c.cost);
			}
		}
		if (!anyAction || madePurchase) {
			if ((storageCritical || storageWanted) && st.gold >= storageCost) {
				if (doUpgradeStorage(st)) {
					metrics.storageUpgrades++;
					metrics.totalSpent     += storageCost;
					metrics.spentOnStorage += storageCost;
					anyAction    = true;
					madePurchase = true;
				}
			}
		}
		if (!anyAction) {
			const hasAnySlot = Object.keys(BUILDING_CONFIG).some(bk => st.buildings[bk].unlocked && Object.values(st.buildings[bk].products).some(p => p.slots.length > 0));
			if (!hasAnySlot) {
				for (const bk of Object.keys(BUILDING_CONFIG)) {
					if (!st.buildings[bk].unlocked) continue;
					for (const [pk, pcfg] of Object.entries(BUILDING_CONFIG[bk].products)) {
						const pst = st.buildings[bk].products[pk];
						if (!pst.unlocked || !pst.enabled) continue;
						if (Object.keys(pcfg.inputs).length > 0) continue;
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
	for (const threshold of [1000, 10000, 100000, 1000000, 10000000, 100000000]) {
		if (metrics.totalEarned >= threshold)
			checkMilestone(metrics, `${formatGold(threshold)} total earned`, true);
	}
}

async function runSim(profile) {
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
		waitingFor:       {},
		_lastGoldLogTime:   0,
		_lastGoldLogAmount: 0,
	};
	doUnlockBuilding(st, "lumber_yard");
	checkMilestone(metrics, "Lumber Yard built", true);
	const steps = Math.ceil(SIM_SECS / TICK_SEC);
	
	for (let i = 0; i < steps; i++) {
		const t = i * TICK_SEC;
		metrics.currentTimeSec = t;
		
		const timeInInterval = t % profile.checkInInterval;
		const isCheckingIn = timeInInterval < profile.checkInDuration;
		
		// If it's night time (11pm to 7am), they don't check in even if the interval hits
		// (Assume t=0 is 8am)
		const hourOfDay = ((t / 3600) + 8) % 24;
		const isSleeping = hourOfDay >= 23 || hourOfDay < 7;
		const activeNow = isCheckingIn && !isSleeping;

		advance(st, TICK_SEC, stallSecs, !activeNow);
		
		if (activeNow) {
			const rates = snapshotChainRates(st);
			const candidates = getCandidates(st, rates, profile);
			const bestOverall = candidates[0];
			const bestAffordable = candidates.find(c => st.gold >= c.cost);
			const saving = bestOverall && bestAffordable && bestOverall !== bestAffordable && (bestOverall.type === "build" || bestOverall.type === "unlock-product") && profile.saveMultiplier > 1 && bestOverall.roi > bestAffordable.roi * profile.saveMultiplier;
			if (saving) {
				const targetKey = bestOverall.type === "build" ? `Build ${BUILDING_CONFIG[bestOverall.bk].label}` : `Unlock ${RESOURCES[BUILDING_CONFIG[bestOverall.bk].products[bestOverall.pk].outputKey].label}`;
				metrics.waitingFor[targetKey] = (metrics.waitingFor[targetKey] ?? 0) + TICK_SEC;
			}
			aiDecide(st, metrics, profile, candidates, bestAffordable, saving);
		}
		checkGoldMilestones(metrics);
		for (const quest of ALL_QUESTS) {
			if (metrics.questCompletions[quest.id] !== undefined) continue;
			if (questProgress(st, metrics, quest) >= quest.target) metrics.questCompletions[quest.id] = t;
		}
		if (t - metrics._lastGoldLogTime >= 600) {
			const gPerMin = (metrics.totalEarned - metrics._lastGoldLogAmount) / ((t - metrics._lastGoldLogTime) / 60);
			metrics.goldLog.push({ t, rate: gPerMin });
			if (gPerMin > metrics.peakGoldRate) metrics.peakGoldRate = gPerMin;
			metrics._lastGoldLogTime = t;
			metrics._lastGoldLogAmount = metrics.totalEarned;
		}
	}
	const supply = {}, demand = {};
	for (const bk of Object.keys(BUILDING_CONFIG)) {
		if (!st.buildings[bk].unlocked) continue;
		for (const [pk, pst] of Object.entries(st.buildings[bk].products)) {
			if (!pst.unlocked || !pst.enabled) continue;
			const pcfg = BUILDING_CONFIG[bk].products[pk];
			const n = pst.slots.length;
			const outPerMin = (60 / (pcfg.baseCycleMs / 1000)) * n * pcfg.outputAmt;
			supply[pk] = (supply[pk] ?? 0) + outPerMin;
			for (const [ik, amt] of Object.entries(pcfg.inputs)) demand[ik] = (demand[ik] ?? 0) + (60 / (pcfg.baseCycleMs / 1000)) * n * amt;
		}
	}
	return { profile, metrics, st, stallSecs, supply, demand };
}

function questProgress(st, metrics, q) {
	if (q.type === "sell") return st.soldByResource[q.resource] ?? 0;
	if (q.type === "gold_earned") return metrics.totalEarned;
	if (q.type === "slots") return st.buildings[q.bld].products[q.product].slots.length;
	if (q.type === "total_slots") return Object.values(st.buildings).reduce((s, b) => s + Object.values(b.products).reduce((ss, p) => ss + p.slots.length, 0), 0);
	if (q.type === "build") return st.buildings[q.bld].unlocked ? 1 : 0;
	if (q.type === "unlock") return st.buildings[q.bld].products[q.product].unlocked ? 1 : 0;
	if (q.type === "storage") return st.storage.tier;
	return 0;
}

function formatGold(n) {
	if (n >= 1e9) return (n / 1e9).toFixed(1) + "Bg";
	if (n >= 1e6) return (n / 1e6).toFixed(1) + "Mg";
	if (n >= 1e3) return (n / 1e3).toFixed(1) + "kg";
	return n + "g";
}
function fmtTime(s) {
	const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = Math.floor(s % 60);
	return `${h}:${m.toString().padStart(2, "0")}:${ss.toString().padStart(2, "0")}`;
}
function pad(s, n) { return s.padEnd(n); }
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

function printReport(res) {
	const { profile, metrics, st, stallSecs, supply, demand } = res;
	console.log(`\n\nPROFILE: ${profile.name.toUpperCase()} — ${profile.desc}`);
	console.log(`  Interval: every ${profile.checkInInterval/3600}h  Duration: ${profile.checkInDuration/60}m`);
	console.log(`\nMILESTONES`);
	for (const m of metrics.milestones) console.log(`  ${fmtTime(m.timeSec)}  ${m.label}`);
	console.log(`\nFINAL PRODUCTION STATE`);
	for (const [bk, bst] of Object.entries(st.buildings)) {
		if (!bst.unlocked) continue;
		console.log(`  ${BUILDING_CONFIG[bk].label}`);
		for (const [pk, pst] of Object.entries(bst.products)) {
			if (!pst.unlocked) continue;
			const pcfg = BUILDING_CONFIG[bk].products[pk];
			const n = pst.slots.length;
			const outPerMin = (60 / (pcfg.baseCycleMs / 1000)) * n * pcfg.outputAmt;
			let line = `    ${pad(RESOURCES[pk].label, 12)} ${n} slots  ${outPerMin.toFixed(1)}/min`;
			if (Object.keys(pcfg.inputs).length > 0) {
				const inDesc = Object.entries(pcfg.inputs).map(([ik, amt]) => `${(60 / (pcfg.baseCycleMs / 1000)) * n * amt} ${RESOURCES[ik].label}/min`).join(", ");
				line += `       <- needs ${inDesc}`;
			}
			console.log(line);
		}
	}
	const bottlenecks = Object.entries(stallSecs).map(([key, secs]) => ({ key, pct: secs / SIM_SECS * 100 })).filter(b => b.pct > 0.5).sort((a, b) => b.pct - a.pct);
	if (bottlenecks.length > 0) {
		console.log(`\nBOTTLENECKS  (>1% sim time stalled)`);
		for (const b of bottlenecks) console.log(`  ${pad(b.key, 28)} ${b.pct.toFixed(1)}%`);
	}
	console.log(`\nCHAIN EFFICIENCY  (supply / demand per minute)`);
	for (const rk of Object.keys(RESOURCES)) {
		const s = supply[rk] ?? 0, d = demand[rk] ?? 0;
		if (d > 0) {
			const ratio = s / d;
			const warn = ratio < 0.95 ? (ratio < 0.8 ? "!! DEFICIT" : "! ok") : "ok";
			console.log(`  ${pad(RESOURCES[rk].label, 12)} ${ratio.toFixed(2)}x  ${warn}  (${s.toFixed(1)} supply / ${d.toFixed(1)} demand)`);
		} else if (s > 0) {
			console.log(`  ${pad(RESOURCES[rk].label, 12)} ${s.toFixed(1)}/min  (no downstream demand)`);
		}
	}
	console.log(`\nGOLD ECONOMY`);
	console.log(`  Earned: ${formatGold(metrics.totalEarned)}  Spent: ${formatGold(metrics.totalSpent)}  Final: ${formatGold(st.gold)}`);
	console.log(`  Spent breakdown — slots: ${formatGold(metrics.spentOnSlots)}  unlocks: ${formatGold(metrics.spentOnUnlocks)}  buildings: ${formatGold(metrics.spentOnBuilds)}  storage: ${formatGold(metrics.spentOnStorage)}`);
	console.log(`  Peak rate: ${formatGold(metrics.peakGoldRate)}/min  End rate: ${formatGold((metrics.goldLog[metrics.goldLog.length - 1]?.rate ?? 0))}/min`);
	console.log(`  Idle gold time: ${fmtTime(metrics.idleGoldTime)} (${(metrics.idleGoldTime / SIM_SECS * 100).toFixed(1)}%)`);
	console.log(`  Sell triggers: ${metrics.sellEvents}  Storage tier: ${st.storage.tier} (${storageMax(st)} cap, upgraded ${metrics.storageUpgrades}×)`);
	const questsDone = ALL_QUESTS.filter(q => metrics.questCompletions[q.id] !== undefined);
	console.log(`\nQUESTS COMPLETED  (${questsDone.length}/${ALL_QUESTS.length})`);
	for (const q of questsDone.sort((a, b) => metrics.questCompletions[a.id] - metrics.questCompletions[b.id])) console.log(`  ${fmtTime(metrics.questCompletions[q.id])}  ${pad(q.label, 30)}`);
	const waitList = Object.entries(metrics.waitingFor).map(([key, secs]) => ({ key, pct: secs / SIM_SECS * 100 })).filter(w => w.pct > 0.5).sort((a, b) => b.pct - a.pct);
	if (waitList.length > 0) {
		console.log("\nWAITING ANALYSIS (saving for better ROI)");
		for (const w of waitList) console.log(`  ${pad(w.key, 28)} ${w.pct.toFixed(1)}%`);
	}
}

function printComparison(results) {
	console.log(`CRAFTER SIM — ${SIM_HOURS}h (Wall Clock)`);
	const header = "                          " + results.map(r => r.profile.name.padEnd(12)).join("");
	console.log(header);
	const row = (label, fn) => console.log(pad(label, 26) + results.map(r => pad(fn(r), 12)).join(""));
	row("Check-in Interval", r => `${r.profile.checkInInterval/3600}h`);
	row("Check-in Duration", r => `${r.profile.checkInDuration/60}m`);
	row("Total earned", r => formatGold(r.metrics.totalEarned));
	row("Final gold", r => formatGold(r.st.gold));
	row("Peak g/min", r => formatGold(r.metrics.peakGoldRate));
	row("End g/min", r => formatGold(r.metrics.goldLog[r.metrics.goldLog.length - 1]?.rate ?? 0));
	row("Sell triggers", r => r.metrics.sellEvents.toString());
	row("Storage tier", r => `${r.st.storage.tier} (${storageMax(r.st)} cap)`);
	row("Idle gold %", r => (r.metrics.idleGoldTime / SIM_SECS * 100).toFixed(1) + "%");
	row("Quests completable", r => `${Object.keys(r.metrics.questCompletions).length}/${ALL_QUESTS.length}`);
}

function rewardLabel(r) {
	if (r.type === "starting_gold")  return `+${r.amount.toLocaleString()} Starting Gold`;
	if (r.type === "slot_cost_pct")  return `Slot Costs -${r.amount}%`;
	if (r.type === "unlock_cost_pct")return `Unlock Costs -${r.amount}%`;
	if (r.type === "build_cost_pct") return `Build Costs -${r.amount}%`;
	if (r.type === "sell_price_pct") return `Sell Prices +${r.amount}%`;
	if (r.type === "storage_tier")   return `+${r.amount} Starting Storage Tier`;
	if (r.type === "cycle_speed_pct")return `Production Speed +${r.amount}%`;
	return "";
}

if (isMainThread) {
	const pending = PROFILES.map(profile => new Promise((resolve, reject) => {
		const w = new Worker(__filename, { workerData: profile });
		w.on("message", resolve);
		w.on("error", reject);
	}));
	Promise.all(pending).then(results => {
		printComparison(results);
		console.log("\n\nDETAILED REPORTS");
		for (const r of results) printReport(r);
		console.log();
	}).catch(err => {
		console.error("Simulation error:", err);
		process.exit(1);
	});
} else {
	runSim(workerData).then(res => parentPort.postMessage(res));
}
