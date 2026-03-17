"use strict";

const SAVE_KEY = "crafter";

const RESOURCES = {
	logs: { label: "Logs", singular: "Log", price: 2 },
	timber: { label: "Timber", singular: "Timber", price: 9 },
	dowels: { label: "Dowels", singular: "Dowel", price: 16 },
	handles: { label: "Handles", singular: "Handle", price: 26 },
	shafts: { label: "Shafts", singular: "Shaft", price: 72 },
	planks: { label: "Planks", singular: "Plank", price: 10 },
	boards: { label: "Boards", singular: "Board", price: 22 },
	beams: { label: "Beams", singular: "Beam", price: 40 },
	crates: { label: "Crates", singular: "Crate", price: 130 },
	furniture: { label: "Furniture", singular: "Furniture", price: 225 },
	coaches: { label: "Coaches", singular: "Coach", price: 550 },
	manors: { label: "Manors", singular: "Manor", price: 750 },
};

const BUILDING_CONFIG = {
	lumber_yard: {
		label: "Lumber Yard",
		desc: "Fells trees and works raw logs into precision wood components.",
		buildCost: 0,
		slotCostExponent: 1.25,
		prereq: () => true,
		products: {
			logs: {
				outputKey: "logs",
				outputAmt: 1,
				inputs: {},
				baseCycleMs: 3000,
				unlockCost: 0,
				baseSlotCost: 75,
				prereqProduct: null,
				startsUnlocked: true,
			},
			timber: {
				outputKey: "timber",
				outputAmt: 1,
				inputs: { logs: 2 },
				baseCycleMs: 8000,
				unlockCost: 150,
				baseSlotCost: 175,
				prereqProduct: "logs",
			},
			dowels: {
				outputKey: "dowels",
				outputAmt: 1,
				inputs: { timber: 1 },
				baseCycleMs: 12000,
				unlockCost: 750,
				baseSlotCost: 300,
				prereqProduct: "timber",
			},
			handles: {
				outputKey: "handles",
				outputAmt: 1,
				inputs: { timber: 2 },
				baseCycleMs: 18000,
				unlockCost: 1000,
				baseSlotCost: 600,
				prereqProduct: "timber",
			},
			shafts: {
				outputKey: "shafts",
				outputAmt: 1,
				inputs: { handles: 1, dowels: 2 },
				baseCycleMs: 30000,
				unlockCost: 1800,
				baseSlotCost: 1000,
				prereqProduct: "handles",
			},
		},
	},
	sawmill: {
		label: "Sawmill",
		desc: "Cuts raw logs into structural lumber for construction and trade.",
		buildCost: 600,
		slotCostExponent: 1.35,
		prereq: () => state.buildings.lumber_yard?.unlocked,
		products: {
			planks: {
				outputKey: "planks",
				outputAmt: 1,
				inputs: { logs: 2 },
				baseCycleMs: 5000,
				unlockCost: 0,
				baseSlotCost: 150,
				prereqProduct: null,
				startsUnlocked: true,
			},
			boards: {
				outputKey: "boards",
				outputAmt: 1,
				inputs: { logs: 3 },
				baseCycleMs: 10000,
				unlockCost: 500,
				baseSlotCost: 350,
				prereqProduct: "planks",
			},
			beams: {
				outputKey: "beams",
				outputAmt: 1,
				inputs: { logs: 5 },
				baseCycleMs: 18000,
				unlockCost: 1200,
				baseSlotCost: 700,
				prereqProduct: "boards",
			},
		},
	},
	workshop: {
		label: "Workshop",
		desc: "Combines lumber and precision parts into finished goods for the empire.",
		buildCost: 3000,
		slotCostExponent: 1.25,
		prereq: () => state.buildings.sawmill?.unlocked && state.buildings.sawmill.products.boards.unlocked,
		products: {
			crates: {
				outputKey: "crates",
				outputAmt: 1,
				inputs: { planks: 2, dowels: 2 },
				baseCycleMs: 20000,
				unlockCost: 0,
				baseSlotCost: 1200,
				prereqProduct: null,
				startsUnlocked: true,
			},
			furniture: {
				outputKey: "furniture",
				outputAmt: 1,
				inputs: { boards: 2, handles: 2 },
				baseCycleMs: 32000,
				unlockCost: 2000,
				baseSlotCost: 2000,
				prereqProduct: "crates",
			},
			coaches: {
				outputKey: "coaches",
				outputAmt: 1,
				inputs: { beams: 2, shafts: 2 },
				baseCycleMs: 50000,
				unlockCost: 4500,
				baseSlotCost: 3500,
				prereqProduct: "furniture",
			},
			manors: {
				outputKey: "manors",
				outputAmt: 1,
				inputs: { beams: 3, boards: 2, shafts: 2 },
				baseCycleMs: 72000,
				unlockCost: 8000,
				baseSlotCost: 5500,
				prereqProduct: "coaches",
			},
		},
	},
};

const STORAGE_BASE = 50;
const STORAGE_FIRST_UPGRADE = 100;
const STORAGE_INCREMENT = 100;
const STORAGE_BASE_COST = 150;
const STORAGE_COST_GROWTH = 1.75;

const DEFAULT_STATE = (() => ({
	gold: 0,
	lastTick: null,
	inventory: Object.fromEntries(Object.keys(RESOURCES).map(k => [k, 0])),
	storage: { tier: 0 },
	buildings: Object.fromEntries(
		Object.keys(BUILDING_CONFIG).map(bldKey => {
			const bcfg = BUILDING_CONFIG[bldKey];
			return [bldKey, {
				unlocked: false,
				products: Object.fromEntries(
					Object.keys(bcfg.products).map(pk => {
						const pcfg = bcfg.products[pk];
						return [pk, {
							unlocked: pcfg.startsUnlocked ?? false,
							enabled: true,
							slots: [],
							manual: { active: false, progress: 0 },
						}];
					})
				),
			}];
		})
	),
}))();

let state = deepClone(DEFAULT_STATE);
let activeTab = "build";

const runtime = {
	nextSlotId: 0,
	stallAnnounced: {},
	announceTimers: { polite: null, assertive: null },
	rateDisplayMode: "minute",
};

function deepClone(obj) {
	return JSON.parse(JSON.stringify(obj));
}

function deepMerge(dst, src) {
	for (const key of Object.keys(src)) {
		if (src[key] !== null && typeof src[key] === "object" && !Array.isArray(src[key])) {
			if (typeof dst[key] !== "object" || dst[key] === null) dst[key] = {};
			deepMerge(dst[key], src[key]);
		} else {
			dst[key] = src[key];
		}
	}
	return dst;
}

function formatInputs(inputs) {
	return Object.entries(inputs)
		.map(([k, amt]) => `${amt} ${amt === 1 ? RESOURCES[k].singular : RESOURCES[k].label}`)
		.join(", ");
}

function formatResourceName(resourceKey, amount) {
	return amount === 1 ? RESOURCES[resourceKey].singular : RESOURCES[resourceKey].label;
}

function totalItems() {
	return Object.keys(RESOURCES).reduce((sum, k) => sum + (state.inventory[k] ?? 0), 0);
}

function storageMax() {
	if (state.storage.tier <= 0) return STORAGE_BASE;
	return STORAGE_FIRST_UPGRADE + ((state.storage.tier - 1) * STORAGE_INCREMENT);
}

function nextStorageMax() {
	if (state.storage.tier <= 0) return STORAGE_FIRST_UPGRADE;
	return storageMax() + STORAGE_INCREMENT;
}

function storageUpgradeCost() {
	return Math.round(STORAGE_BASE_COST * Math.pow(STORAGE_COST_GROWTH, state.storage.tier));
}

function nextSlotCost(bldKey, productKey) {
	const n = state.buildings[bldKey].products[productKey].slots.length;
	const exp = BUILDING_CONFIG[bldKey].slotCostExponent ?? 1.5;
	return Math.round(BUILDING_CONFIG[bldKey].products[productKey].baseSlotCost * Math.pow(exp, n));
}

function lastSlotCost(bldKey, productKey) {
	const n = state.buildings[bldKey].products[productKey].slots.length;
	if (n === 0) return 0;
	const exp = BUILDING_CONFIG[bldKey].slotCostExponent ?? 1.5;
	return Math.round(BUILDING_CONFIG[bldKey].products[productKey].baseSlotCost * Math.pow(exp, n - 1));
}

function currentPrice(resourceKey) {
	return RESOURCES[resourceKey].price;
}

function formatRate(slots, outputAmt, baseCycleMs, label = "") {
	const perMin = slots * outputAmt * 60000 / baseCycleMs;
	const rounded = Math.round(perMin * 10) / 10;
	const num = rounded % 1 === 0 ? `${rounded}` : rounded.toFixed(1);
	return label ? `${num} ${label} per minute` : `${num} per minute`;
}

function formatProductOutput(slots, outputAmt, baseCycleMs) {
	const total = slots * outputAmt;
	if (runtime.rateDisplayMode === "cycle") {
		return `${total} every ${formatDuration(Math.round(baseCycleMs / 1000))}`;
	}
	return formatRate(slots, outputAmt, baseCycleMs);
}

function formatDuration(seconds) {
	if (seconds < 60) return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
	const mins = Math.round(seconds / 60);
	if (mins < 60) return `${mins} ${mins === 1 ? "minute" : "minutes"}`;
	const hours = Math.round(mins / 60);
	return `${hours} ${hours === 1 ? "hour" : "hours"}`;
}

function save() {
	try {
		localStorage.setItem(SAVE_KEY, JSON.stringify(state));
	} catch (e) {}
}

function load() {
	try {
		const raw = localStorage.getItem(SAVE_KEY);
		if (!raw) return;
		const parsed = JSON.parse(raw);
		if (parsed.buildings?.workshop && !parsed.buildings.lumber_yard) {
			parsed.buildings.lumber_yard = parsed.buildings.workshop;
			delete parsed.buildings.workshop;
		}
		if (parsed.buildings?.joinery) {
			delete parsed.buildings.joinery;
		}
		for (const key of ["frames", "cabinets", "carts"]) {
			if (parsed.inventory) delete parsed.inventory[key];
		}
		const fresh = deepClone(DEFAULT_STATE);
		deepMerge(fresh, parsed);
		state = fresh;
		let maxId = 0;
		for (const bst of Object.values(state.buildings)) {
			for (const pst of Object.values(bst.products)) {
				for (const slot of pst.slots) {
					if (slot.id > maxId) maxId = slot.id;
				}
			}
		}
		runtime.nextSlotId = maxId;
		for (const bst of Object.values(state.buildings)) {
			for (const pst of Object.values(bst.products)) {
				if (!pst.manual) pst.manual = { active: false, progress: 0 };
				if (pst.manual.active === undefined) pst.manual.active = false;
				if (pst.enabled === undefined) pst.enabled = true;
			}
		}
	} catch (e) {
		state = deepClone(DEFAULT_STATE);
	}
}

function tryProduceSlot(bldKey, productKey, slot) {
	const pcfg = BUILDING_CONFIG[bldKey].products[productKey];
	const inputSum = Object.values(pcfg.inputs).reduce((s, n) => s + n, 0);
	const netChange = pcfg.outputAmt - inputSum;
	const stallKey = `${bldKey}-${productKey}`;
	if (netChange > 0 && totalItems() + netChange > storageMax()) {
		slot.progress = Math.min(slot.progress, 0.999);
		if (!runtime.stallAnnounced[stallKey]) {
			runtime.stallAnnounced[stallKey] = "pending";
		} else if (runtime.stallAnnounced[stallKey] === "pending") {
			runtime.stallAnnounced[stallKey] = true;
			if (activeTab === bldKey)
				announce(`${RESOURCES[pcfg.outputKey].label} stalled - storage full.`, "assertive");
		}
		return false;
	}
	for (const [inputKey, inputAmt] of Object.entries(pcfg.inputs)) {
		if (state.inventory[inputKey] < inputAmt) {
			slot.progress = Math.min(slot.progress, 0.999);
			if (!runtime.stallAnnounced[stallKey]) {
				runtime.stallAnnounced[stallKey] = "pending";
			} else if (runtime.stallAnnounced[stallKey] === "pending") {
				runtime.stallAnnounced[stallKey] = true;
				if (activeTab === bldKey)
					announce(`${RESOURCES[pcfg.outputKey].label} stalled - need ${formatInputs(pcfg.inputs)}.`, "assertive");
			}
			return false;
		}
	}
	for (const [inputKey, inputAmt] of Object.entries(pcfg.inputs)) {
		state.inventory[inputKey] -= inputAmt;
	}
	state.inventory[pcfg.outputKey] += pcfg.outputAmt;
	delete runtime.stallAnnounced[stallKey];
	return true;
}

function advanceBuildings(deltaSec) {
	for (const bldKey of Object.keys(BUILDING_CONFIG)) {
		const bst = state.buildings[bldKey];
		if (!bst.unlocked) continue;
		for (const [productKey, pst] of Object.entries(bst.products)) {
			if (!pst.unlocked) continue;
			if (!pst.enabled) {
				if (pst.manual.active) {
					pst.manual.active = false;
					pst.manual.progress = 0;
				}
				continue;
			}
			const pcfg = BUILDING_CONFIG[bldKey].products[productKey];
			for (const slot of pst.slots) {
				slot.progress += deltaSec / (pcfg.baseCycleMs / 1000);
				while (slot.progress >= 1.0) {
					slot.progress -= 1.0;
					if (!tryProduceSlot(bldKey, productKey, slot)) break;
				}
			}
			if (pst.manual.active) {
				pst.manual.progress += deltaSec / (pcfg.baseCycleMs / 1000);
				if (pst.manual.progress >= 1.0) {
					pst.manual.progress = 0;
					pst.manual.active = false;
					for (const [inputKey, inputAmt] of Object.entries(pcfg.inputs)) {
						state.inventory[inputKey] -= inputAmt;
					}
					state.inventory[pcfg.outputKey] += pcfg.outputAmt;
					announce(`${RESOURCES[pcfg.outputKey].singular} produced.`, "polite");
				}
			}
		}
	}
}

function unlockBuilding(bldKey) {
	const cfg = BUILDING_CONFIG[bldKey];
	const bst = state.buildings[bldKey];
	if (bst.unlocked) return;
	if (!cfg.prereq()) return;
	if (state.gold < cfg.buildCost) {
		announce(`Need ${cfg.buildCost} gold to build ${cfg.label}.`, "assertive");
		return;
	}
	state.gold -= cfg.buildCost;
	bst.unlocked = true;
	for (const [pk, pcfg] of Object.entries(cfg.products)) {
		if (pcfg.unlockCost === 0 && !pcfg.prereqProduct) {
			bst.products[pk].unlocked = true;
		}
	}
	addBuildingTab(bldKey);
	announce(`${cfg.label} built!`, "polite");
	switchTab(bldKey);
	document.getElementById(`tab-${bldKey}`)?.focus();
}

function unlockProduct(bldKey, productKey) {
	const pcfg = BUILDING_CONFIG[bldKey].products[productKey];
	const pst = state.buildings[bldKey].products[productKey];
	if (pst.unlocked) return;
	if (pcfg.prereqProduct && !state.buildings[bldKey].products[pcfg.prereqProduct].unlocked) return;
	if (state.gold < pcfg.unlockCost) {
		announce(`Need ${pcfg.unlockCost} gold to unlock ${RESOURCES[pcfg.outputKey].label} production.`, "assertive");
		return;
	}
	state.gold -= pcfg.unlockCost;
	pst.unlocked = true;
	announce(`${RESOURCES[pcfg.outputKey].label} production unlocked!`, "polite");
	renderAll();
	const addBtn = document.querySelector(`[data-action="add-slot"][data-bld="${bldKey}"][data-product="${productKey}"]`);
	if (addBtn && !addBtn.disabled) addBtn.focus();
	else document.getElementById(`tab-${bldKey}`)?.focus();
}

function addSlot(bldKey, productKey) {
	const pst = state.buildings[bldKey].products[productKey];
	if (!pst.unlocked) return;
	const cost = nextSlotCost(bldKey, productKey);
	if (state.gold < cost) {
		announce(`Need ${cost} gold to add a slot.`, "assertive");
		return;
	}
	state.gold -= cost;
	const newSlot = { id: ++runtime.nextSlotId, progress: 0.0 };
	pst.slots.push(newSlot);
	const label = RESOURCES[BUILDING_CONFIG[bldKey].products[productKey].outputKey].label;
	announce(`Slot added. ${label} now has ${pst.slots.length} slot${pst.slots.length === 1 ? "" : "s"}.`, "polite");
	renderAll();
	document.querySelector(`[data-action="add-slot"][data-bld="${bldKey}"][data-product="${productKey}"]`)?.focus();
}

function sellSlot(bldKey, productKey) {
	const pst = state.buildings[bldKey].products[productKey];
	if (pst.slots.length === 0) return;
	const refund = Math.floor(lastSlotCost(bldKey, productKey) * 0.5);
	pst.slots.pop();
	if (pst.slots.length === 0) delete runtime.stallAnnounced[`${bldKey}-${productKey}`];
	state.gold += refund;
	const label = RESOURCES[BUILDING_CONFIG[bldKey].products[productKey].outputKey].label;
	announce(`Slot sold for ${refund} gold. ${label} now has ${pst.slots.length} slot${pst.slots.length === 1 ? "" : "s"}.`, "polite");
	renderAll();
}

function manualProduce(bldKey, productKey) {
	const pcfg = BUILDING_CONFIG[bldKey].products[productKey];
	const pst = state.buildings[bldKey].products[productKey];
	if (!pst.enabled) {
		announce(`${RESOURCES[pcfg.outputKey].label} production is paused.`, "assertive");
		return;
	}
	if (pst.manual.active) {
		pst.manual.progress += 0.25;
		return;
	}
	const inputSum = Object.values(pcfg.inputs).reduce((s, n) => s + n, 0);
	const netChange = pcfg.outputAmt - inputSum;
	if (netChange > 0 && totalItems() + netChange > storageMax()) {
		announce("Storage is full.", "assertive");
		return;
	}
	for (const [inputKey, inputAmt] of Object.entries(pcfg.inputs)) {
		if (state.inventory[inputKey] < inputAmt) {
		announce(`Need ${formatInputs(pcfg.inputs)}.`, "assertive");
			return;
		}
	}
	pst.manual.active = true;
	pst.manual.progress = 0;
	announce("Crafting started.", "polite");
}

function upgradeStorage() {
	const cost = storageUpgradeCost();
	if (state.gold < cost) {
		announce(`Need ${cost} gold to expand storage.`, "assertive");
		return;
	}
	state.gold -= cost;
	state.storage.tier++;
	const newMax = storageMax();
	announce(`Storage expanded to ${newMax} items.`, "polite");
	renderAll();
}

function sellAll() {
	const resources = Object.keys(RESOURCES).filter(k => state.inventory[k] > 0);
	if (resources.length === 0) return;
	let totalEarned = 0;
	for (const k of resources) {
		totalEarned += state.inventory[k] * currentPrice(k);
		state.inventory[k] = 0;
	}
	state.gold += totalEarned;
	announce(`Sold everything for ${totalEarned} gold.`, "polite");
	renderAll();
}

function sellProduct(resourceKey) {
	const inv = state.inventory[resourceKey];
	if (inv <= 0) return;
	const earned = inv * currentPrice(resourceKey);
	state.inventory[resourceKey] = 0;
	state.gold += earned;
	announce(`Sold ${inv} ${formatResourceName(resourceKey, inv)} for ${earned} gold.`, "polite");
	renderAll();
}

function toggleProductEnabled(bldKey, productKey) {
	const pst = state.buildings[bldKey].products[productKey];
	if (!pst.unlocked) return;
	pst.enabled = !pst.enabled;
	if (!pst.enabled) {
		pst.manual.active = false;
		pst.manual.progress = 0;
	}
	const outputKey = BUILDING_CONFIG[bldKey].products[productKey].outputKey;
	announce(`${RESOURCES[outputKey].label} production ${pst.enabled ? "resumed" : "paused"}.`, "polite");
	renderAll();
}

function saveNow() {
	save();
	announce("Game saved.", "polite");
}

function clearSaveData() {
	if (confirm("Clear your save and start over?")) {
		localStorage.removeItem(SAVE_KEY);
		location.reload();
	}
}

function copySaveToClipboard() {
	const json = localStorage.getItem(SAVE_KEY) ?? JSON.stringify(DEFAULT_STATE);
	const base64 = btoa(json);
	navigator.clipboard.writeText(base64).then(
		() => announce("Save copied to clipboard.", "polite"),
		() => announce("Clipboard access denied.", "assertive"),
	);
}

function importSaveFromClipboard() {
	navigator.clipboard.readText().then(
		text => {
			try {
				const json = atob(text.trim());
				JSON.parse(json);
				localStorage.setItem(SAVE_KEY, json);
				announce("Save imported. Reloading...", "polite");
				setTimeout(() => location.reload(), 800);
			} catch {
				announce("Invalid save data in clipboard.", "assertive");
			}
		},
		() => announce("Clipboard access denied.", "assertive"),
	);
}

function announce(msg, level = "polite") {
	const el = document.getElementById(`live-${level}`);
	if (!el) return;
	el.textContent = "";
	requestAnimationFrame(() => { el.textContent = msg; });
	if (runtime.announceTimers[level]) clearTimeout(runtime.announceTimers[level]);
	runtime.announceTimers[level] = setTimeout(() => { el.textContent = ""; }, 2000);
}

function addBuildingTab(bldKey) {
	const btn = document.createElement("button");
	btn.id = `tab-${bldKey}`;
	btn.textContent = BUILDING_CONFIG[bldKey].label;
	document.getElementById("tab-bar").insertBefore(btn, document.getElementById("tab-settings"));
	const panel = document.createElement("div");
	panel.id = `panel-${bldKey}`;
	panel.className = "tab-panel building-panel";
	panel.hidden = true;
	document.getElementById("content").insertBefore(panel, document.getElementById("panel-settings"));
}

function switchTab(tabId) {
	activeTab = tabId;
	document.querySelectorAll(".tab-panel").forEach(p => { p.hidden = true; });
	document.querySelectorAll("#tab-bar button").forEach(b => b.classList.remove("active"));
	const panel = document.getElementById(`panel-${tabId}`);
	const btn = document.getElementById(`tab-${tabId}`);
	if (panel) panel.hidden = false;
	if (btn) btn.classList.add("active");
	renderAll();
}

function renderAll() {
	renderHUD();
	if (activeTab === "build") renderBuildTab();
	else if (activeTab === "market") renderMarketTab();
	else if (activeTab === "settings") renderSettingsTab();
	else if (activeTab in BUILDING_CONFIG) renderBuildingTab(activeTab);
}

function renderHUD() {
	const gold = Math.floor(state.gold);
	const used = totalItems();
	const max = storageMax();
	const goldText = `${gold} gold`;
	const storageText = `${used}/${max} items`;
	const goldEl = document.getElementById("hud-gold");
	const storageEl = document.getElementById("hud-storage");
	if (goldEl && goldEl.textContent !== goldText) goldEl.textContent = goldText;
	if (storageEl && storageEl.textContent !== storageText) storageEl.textContent = storageText;

	const inventoryEl = document.getElementById("hud-inventory");
	if (inventoryEl) {
		const invText = Object.entries(state.inventory)
			.filter(([, v]) => v > 0)
			.map(([k, v]) => `${v} ${formatResourceName(k, v)}`)
			.join(", ");
		if (inventoryEl.textContent !== invText) inventoryEl.textContent = invText;
	}

	const chainEl = document.getElementById("hud-chain");
	if (chainEl) {
		const { hasChain, deficits, efficiencyPct } = getProductionOverview();
		let chainText = "";
		let chainClass = "";
		if (hasChain) {
			if (deficits.length > 0) {
				const names = deficits.slice(0, 2).map(e => RESOURCES[e.resourceKey].label).join(", ");
				chainText = `Bottleneck: ${names}`;
				chainClass = "hud-warn";
			} else if (efficiencyPct !== null) {
				chainText = efficiencyPct === 100 ? "Chain: OK" : `Chain: ${efficiencyPct}%`;
				chainClass = efficiencyPct === 100 ? "hud-ok" : "";
			}
		}
		if (chainEl.textContent !== chainText) chainEl.textContent = chainText;
		if (chainEl.className !== chainClass) chainEl.className = chainClass;
	}
}

function getProductionOverview() {
	const productRows = [];
	const supplyRates = {};
	const demandRates = {};
	for (const [bldKey, cfg] of Object.entries(BUILDING_CONFIG)) {
		const bst = state.buildings[bldKey];
		if (!bst?.unlocked) continue;
		for (const [productKey, pcfg] of Object.entries(cfg.products)) {
			const pst = bst.products[productKey];
			if (!pst?.unlocked) continue;
			const n = pst.slots.length;
			productRows.push({
				resourceKey: pcfg.outputKey,
				enabled: pst.enabled,
				slots: n,
				outputAmt: pcfg.outputAmt,
				baseCycleMs: pcfg.baseCycleMs,
			});
			if (!pst.enabled || n === 0) continue;
			supplyRates[pcfg.outputKey] = (supplyRates[pcfg.outputKey] || 0) + n * pcfg.outputAmt * 60000 / pcfg.baseCycleMs;
			for (const [inputKey, inputAmt] of Object.entries(pcfg.inputs)) {
				demandRates[inputKey] = (demandRates[inputKey] || 0) + n * inputAmt * 60000 / pcfg.baseCycleMs;
			}
		}
	}
	const hasChain = Object.keys(demandRates).length > 0;
	const balances = Array.from(new Set([
		...Object.keys(supplyRates),
		...Object.keys(demandRates),
	]))
		.filter(resourceKey => RESOURCES[resourceKey])
		.map(resourceKey => ({
			resourceKey,
			supply: supplyRates[resourceKey] || 0,
			demand: demandRates[resourceKey] || 0,
			net: (supplyRates[resourceKey] || 0) - (demandRates[resourceKey] || 0),
		}));
	const deficits = balances
		.filter(entry => entry.demand > 0 && entry.net < -0.05)
		.sort((a, b) => a.net - b.net);
	const surpluses = balances
		.filter(entry => entry.net > 0.05)
		.sort((a, b) => b.net - a.net);
	const totalDemand = Object.values(demandRates).reduce((sum, value) => sum + value, 0);
	const fulfillment = totalDemand <= 0
		? 0
		: balances
			.filter(entry => entry.demand > 0)
			.reduce((sum, entry) => {
				const coverage = Math.min(entry.supply / entry.demand, 1);
				return sum + (entry.demand * coverage);
			}, 0);
	const efficiencyPct = totalDemand <= 0 ? null : Math.round((fulfillment / totalDemand) * 100);
	return { productRows, hasChain, deficits, surpluses, efficiencyPct };
}

function formatBalanceEntries(entries, sign, limit = 3) {
	return entries
		.slice(0, limit)
		.map(entry => {
			const amt = (Math.round(Math.abs(entry.net) * 10) / 10).toFixed(1);
			return `${RESOURCES[entry.resourceKey].label} ${sign}${amt} per minute`;
		})
		.join(", ");
}

function renderProductionPanel() {
	const { productRows, hasChain, deficits, surpluses, efficiencyPct } = getProductionOverview();
	if (productRows.length === 0) return "";
	const productItems = productRows
		.map(row => {
			const res = RESOURCES[row.resourceKey];
			const slotWord = row.slots === 1 ? "slot" : "slots";
			const rateText = !row.enabled
				? "paused"
				: row.slots === 0
				? "no slots"
				: `${row.slots} ${slotWord}, ${formatProductOutput(row.slots, row.outputAmt, row.baseCycleMs)}`;
			return `<li><strong>${res.label}:</strong> ${rateText}</li>`;
		})
		.join("");
	const chainRow = (() => {
		if (!hasChain || efficiencyPct === null) {
			return `<li><strong>Chain:</strong> n/a | <strong>Efficiency:</strong> n/a</li>`;
		}
		const chainLabel = deficits.length > 0
			? `Input bottleneck (${formatBalanceEntries(deficits, "-")})`
			: surpluses.length > 0
				? "Output surplus"
				: "OK";
		const stateClass = deficits.length === 0 ? "health-ok" : "health-warn";
		return `<li class="${stateClass}"><strong>Chain:</strong> ${chainLabel} | <strong>Efficiency:</strong> ${efficiencyPct}%</li>`;
	})();
	const surplusRow = !hasChain || surpluses.length === 0 || deficits.length > 0
		? ""
		: `<li class="health-warn"><strong>Surplus:</strong> ${formatBalanceEntries(surpluses, "+")}</li>`;
	return `<section class="prod-summary production-panel">
		<h3>Overview</h3>
		<ul>${productItems}<li class="health-sep" aria-hidden="true"></li>${chainRow}${surplusRow}</ul>
	</section>`;
}

function renderBuildTab() {
	const panel = document.getElementById("panel-build");
	const overviewHtml = renderProductionPanel() || "";
	const unlockedProducts = [];
	for (const [bldKey, cfg] of Object.entries(BUILDING_CONFIG)) {
		const bst = state.buildings[bldKey];
		if (!bst?.unlocked) continue;
		for (const [productKey, pcfg] of Object.entries(cfg.products)) {
			const pst = bst.products[productKey];
			if (!pst?.unlocked) continue;
			unlockedProducts.push({ bldKey, productKey, cfg, pcfg, pst });
		}
	}
	const cardsHtml = unlockedProducts.length === 0
		? ""
		: `<div class="production-toggle-grid">${unlockedProducts.map(({ bldKey, productKey, cfg, pcfg, pst }) => {
			const res = RESOURCES[pcfg.outputKey];
			const slots = pst.slots.length;
			const statusClass = pst.enabled ? "health-ok" : "health-warn";
			const statusLabel = pst.enabled ? "Active" : "Paused";
			const slotSummary = slots === 0
				? "0 slots"
				: `${slots} ${slots === 1 ? "slot" : "slots"}, ${formatProductOutput(slots, pcfg.outputAmt, pcfg.baseCycleMs)}`;
			return `<section class="product-section production-toggle-card">
				<div class="product-header">
					<h3>${res.label}</h3>
					<span class="production-building">${cfg.label}</span>
				</div>
				<p class="production-status ${statusClass}"><strong>Status:</strong> ${statusLabel}</p>
				<p class="slot-summary">${slotSummary}</p>
				${Object.keys(pcfg.inputs).length === 0 ? "" : `<p class="product-inputs">Requires: ${formatInputs(pcfg.inputs)} per cycle</p>`}
				<button class="toggle-product-btn ${pst.enabled ? "" : "paused"}"
				 data-action="toggle-product"
				 data-bld="${bldKey}" data-product="${productKey}">
					${pst.enabled ? "Pause" : "Resume"} ${res.label}
				</button>
			</section>`;
		}).join("")}</div>`;
	const unbuildKeys = Object.keys(BUILDING_CONFIG).filter(k => !state.buildings[k].unlocked);
	const constructHtml = unbuildKeys.length === 0
		? ""
		: unbuildKeys.map(bldKey => {
			const cfg = BUILDING_CONFIG[bldKey];
			const prereqMet = cfg.prereq();
			const canAfford = state.gold >= cfg.buildCost;
			const disabled = !prereqMet || !canAfford ? "disabled" : "";
			const costLabel = cfg.buildCost === 0 ? "Free" : `${cfg.buildCost} gold`;
			return `<div class="build-card">
				<h3>${cfg.label}</h3>
				<p>${cfg.desc}</p>
				<button data-action="build" data-bld="${bldKey}" ${disabled}>
					Build for ${costLabel}
				</button>
			</div>`;
		}).join("");
	const modeLabel = runtime.rateDisplayMode === "minute" ? "Per Minute" : "Per Cycle";
	const toggleHtml = overviewHtml || cardsHtml
		? `<div class="rate-mode-row"><button class="rate-mode-btn" data-action="toggle-rate-mode">${modeLabel}</button></div>`
		: "";
	const productionSection = overviewHtml || cardsHtml
		? `<section aria-label="Production"><h2>Production</h2>${toggleHtml}${overviewHtml}${cardsHtml}</section>`
		: "";
	const constructSection = constructHtml
		? `<section aria-label="Construction"><h2>Build</h2>${constructHtml}</section>`
		: "";
	if (!productionSection && !constructSection) {
		panel.innerHTML = `<p class="market-empty">Nothing to manage yet. Build something first.</p>`;
		return;
	}
	panel.innerHTML = `${productionSection}${constructSection}`;
}

function updateMarketProducts() {
	const panel = document.getElementById("panel-market");
	if (!panel) return;
	const container = panel.querySelector("#market-products");
	if (!container) return;
	const withStock = Object.keys(RESOURCES).filter(k => state.inventory[k] > 0);
	const existingCards = Array.from(container.querySelectorAll("[data-market-resource]"))
		.map(el => el.dataset.marketResource);
	const structureChanged =
		withStock.length !== existingCards.length ||
		withStock.some((k, i) => k !== existingCards[i]);
	if (structureChanged) {
		const focused = document.activeElement;
		const wasInPanel = panel.contains(focused);
		const focusedResource = focused?.closest("[data-market-resource]")?.dataset.marketResource;
		renderMarketTab();
		if (wasInPanel) {
			const sameBtn = focusedResource &&
				panel.querySelector(`[data-market-resource="${focusedResource}"] .sell-btn`);
			if (sameBtn) {
				sameBtn.focus();
				return;
			}
			const firstSell = panel.querySelector(".sell-btn");
			if (firstSell) {
				firstSell.focus();
				return;
			}
			const sellAllBtn = panel.querySelector("[data-action='sell-all']");
			if (sellAllBtn) {
				sellAllBtn.focus();
				return;
			}
			panel.querySelector("[data-action='storage-upgrade']")?.focus();
		}
		return;
	}
	const used = totalItems();
	const max = storageMax();
	const pct = Math.min(100, Math.floor(used / max * 100));
	const barFill = panel.querySelector(".storage-bar-fill");
	const barWrap = panel.querySelector(".storage-bar-wrap");
	const usedLabel = panel.querySelector(".storage-used-label");
	if (barFill) barFill.style.width = `${pct}%`;
	if (barWrap) barWrap.setAttribute("aria-valuenow", pct);
	if (usedLabel) {
		const label = `${used} / ${max} items (${pct}% full)`;
		if (usedLabel.textContent !== label) usedLabel.textContent = label;
	}
	if (withStock.length === 0) return;
	const sellAllBtn = panel.querySelector("[data-action='sell-all']");
	if (sellAllBtn) {
		const totalValue = withStock.reduce((sum, k) => sum + state.inventory[k] * currentPrice(k), 0);
		sellAllBtn.textContent = `Sell Everything for ${totalValue} gold`;
	}
	for (const resourceKey of withStock) {
		const inv = state.inventory[resourceKey];
		const price = currentPrice(resourceKey);
		const earned = inv * price;
		const card = container.querySelector(`[data-market-resource="${resourceKey}"]`);
		if (!card) continue;
		const stockEl = card.querySelector(".market-product-stock");
		if (stockEl) stockEl.textContent = `${inv} in stock, ${price} gold each`;
		const sellBtn = card.querySelector(".sell-btn");
		if (sellBtn) sellBtn.textContent = `Sell All ${RESOURCES[resourceKey].label} for ${earned} gold`;
	}
}

function renderBuildingTab(bldKey) {
	const panel = document.getElementById(`panel-${bldKey}`);
	if (!panel) return;
	const cfg = BUILDING_CONFIG[bldKey];
	const bst = state.buildings[bldKey];
	const unlockedProducts = Object.entries(cfg.products).filter(([pk]) => bst.products[pk].unlocked);
	const unlockedHtml = unlockedProducts
		.map(([productKey, pcfg]) => {
			const pst = bst.products[productKey];
			const res = RESOURCES[pcfg.outputKey];
			const slotCost = nextSlotCost(bldKey, productKey);
			const n = pst.slots.length;
			const slotWord = n === 1 ? "slot" : "slots";
			const cycleSecs = Math.round(pcfg.baseCycleMs / 1000);
			const cycleItem = pcfg.outputAmt === 1 ? res.singular : res.label;
			const cycleFmt = `${pcfg.outputAmt} ${cycleItem} every ${formatDuration(cycleSecs)}`;
			const totalAmt = n * pcfg.outputAmt;
			const totalItem = totalAmt === 1 ? res.singular : res.label;
			const summary = n === 0 ? "No slots yet." : `${n} ${slotWord}, ${totalAmt} ${totalItem} every ${formatDuration(cycleSecs)}`;
			const inputDesc = Object.keys(pcfg.inputs).length === 0
				? ""
				: `<p class="product-inputs">Requires: ${formatInputs(pcfg.inputs)} per cycle</p>`;
			const refund = Math.floor(lastSlotCost(bldKey, productKey) * 0.5);
			return `<div class="product-section">
				<div class="product-header"><h3>${res.label}</h3></div>
				${inputDesc}
				<div class="manual-produce-row">
					<button class="manual-produce-btn" data-action="manual-produce"
					 data-bld="${bldKey}" data-product="${productKey}"
					 ${pst.enabled ? "" : "disabled"}>
						${pst.enabled ? `Produce ${res.singular}` : `${res.label} Paused`}
					</button>
				</div>
				<p class="slot-summary">${summary}</p>
				<button class="add-slot-btn" data-action="add-slot"
				 data-bld="${bldKey}" data-product="${productKey}"
				 ${state.gold >= slotCost ? "" : "disabled"}>
					Add Slot for ${slotCost} gold (+${cycleFmt})
				</button>
				<button class="sell-slot-btn" data-action="sell-slot"
				 data-bld="${bldKey}" data-product="${productKey}"
				 ${n > 0 ? "" : "disabled"}>
					Sell Slot for ${refund} gold (-${cycleFmt})
				</button>
			</div>`;
		}).join("");
	const unlockables = Object.entries(cfg.products).filter(([pk, pcfg]) =>
		!bst.products[pk].unlocked &&
		(!pcfg.prereqProduct || bst.products[pcfg.prereqProduct].unlocked)
	);
	const unlockHtml = unlockables.length === 0 ? "" : `<div class="unlock-section">
		${unlockables.map(([pk, pcfg]) => {
			const res = RESOURCES[pcfg.outputKey];
			return `<button class="unlock-product-btn" data-action="unlock-product"
			 data-bld="${bldKey}" data-product="${pk}"
			 ${state.gold >= pcfg.unlockCost ? "" : "disabled"}>
				Unlock ${res.label} for ${pcfg.unlockCost} gold
			</button>`;
		}).join("")}
	</div>`;
	panel.innerHTML = `<h2>${cfg.label}</h2>${unlockedHtml}${unlockHtml}`;
}

function renderMarketTab() {
	const panel = document.getElementById("panel-market");
	const used = totalItems();
	const max = storageMax();
	const pct = Math.min(100, Math.floor(used / max * 100));
	const cost = storageUpgradeCost();
	const next = nextStorageMax();
	const storageLabel = `${used} / ${max} items (${pct}% full)`;
	const upgHtml = `<button data-action="storage-upgrade" ${state.gold >= cost ? "" : "disabled"}>
		Expand Storage: ${max} to ${next} items for ${cost} gold
	</button>`;
	const withStock = Object.keys(RESOURCES).filter(k => state.inventory[k] > 0);
	const totalValue = withStock.reduce((sum, k) => sum + state.inventory[k] * currentPrice(k), 0);
	const sellAllHtml = withStock.length === 0 ? "" :
		`<button class="sell-all-btn" data-action="sell-all">Sell Everything for ${totalValue} gold</button>`;
	const sellHtml = withStock.length === 0
		? `<p class="market-empty">Nothing to sell yet.</p>`
		: withStock.map(resourceKey => {
			const res = RESOURCES[resourceKey];
			const inv = state.inventory[resourceKey];
			const earned = inv * res.price;
			return `<div class="market-product" data-market-resource="${resourceKey}">
				<div class="market-product-header">
					<span class="market-product-name">${res.label}</span>
					<span class="market-product-stock">${inv} in stock, ${res.price} gold each</span>
				</div>
				<button class="sell-btn" data-action="sell" data-resource="${resourceKey}">
					Sell All ${res.label} for ${earned} gold
				</button>
			</div>`;
		}).join("");
	panel.innerHTML = `<h2>Market</h2>
		<div class="storage-info">
			<div class="storage-bar-wrap" role="progressbar" aria-label="Storage used"
			 aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
				<div class="storage-bar-fill" style="width:${pct}%"></div>
			</div>
			<p class="storage-used-label">${storageLabel}</p>
			${upgHtml}
		</div>
		<div class="market-divider"></div>
		${sellAllHtml}
		<div id="market-products">${sellHtml}</div>`;
}

function renderSettingsTab() {
	const panel = document.getElementById("panel-settings");
	if (!panel) return;
	panel.innerHTML = `<h2>Settings</h2>
		<section class="settings-section">
			<h3>Save</h3>
			<div class="settings-row">
				<button data-action="save-now">Save Now</button>
				<button data-action="copy-save">Copy Save</button>
				<button data-action="import-save">Import Save</button>
				<button data-action="clear-save">Clear Save</button>
			</div>
		</section>`;
}

function tick() {
	const now = Date.now();
	const delta = (now - state.lastTick) / 1000;
	state.lastTick = now;
	try {
		advanceBuildings(delta);
	} catch (e) {
		console.error("advanceBuildings:", e);
	}
	renderHUD();
	if (activeTab === "market") updateMarketProducts();
}

function handleClick(e) {
	const tab = e.target.closest("#tab-bar button");
	if (tab) {
		switchTab(tab.id.replace("tab-", ""));
		return;
	}
	const btn = e.target.closest("button[data-action]");
	if (!btn) return;
	const { action } = btn.dataset;
	const bld = btn.dataset.bld;
	const product = btn.dataset.product;
	switch (action) {
		case "build": unlockBuilding(bld); break;
		case "unlock-product": unlockProduct(bld, product); break;
		case "add-slot": addSlot(bld, product); break;
		case "sell-slot": sellSlot(bld, product); break;
		case "manual-produce": manualProduce(bld, product); break;
		case "storage-upgrade": upgradeStorage(); break;
		case "sell": sellProduct(btn.dataset.resource); break;
		case "sell-all": sellAll(); break;
		case "toggle-product": toggleProductEnabled(bld, product); break;
		case "save-now": saveNow(); break;
		case "copy-save": copySaveToClipboard(); break;
		case "import-save": importSaveFromClipboard(); break;
		case "clear-save": clearSaveData(); break;
		case "toggle-rate-mode":
			runtime.rateDisplayMode = runtime.rateDisplayMode === "minute" ? "cycle" : "minute";
			renderAll();
			break;
	}
}

function init() {
	load();
	state.lastTick = Date.now();
	for (const bldKey of Object.keys(BUILDING_CONFIG)) {
		if (state.buildings[bldKey].unlocked) addBuildingTab(bldKey);
	}
	renderAll();
	document.getElementById("app").addEventListener("click", handleClick);
	setInterval(tick, 100);
	setInterval(save, 5000);
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", init);
} else {
	init();
}
