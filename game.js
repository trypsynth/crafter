"use strict";

const SAVE_KEY = "crafter";

let _questsRenderKey = "";

const PRESTIGE_KEY = "crafter_prestige";
let prestige = { runs: 0, rewards: [], completedQuestIds: [], seenBuildings: [] };

// Generates the reward label string from a reward object.
function rewardLabel(r) {
	if (r.type === "starting_gold")  return `+${r.amount.toLocaleString()} Starting Gold`;
	if (r.type === "slot_cost_pct")  return `Slot Costs -${r.amount}%`;
	if (r.type === "unlock_cost_pct")return `Unlock Costs -${r.amount}%`;
	if (r.type === "build_cost_pct") return `Build Costs -${r.amount}%`;
	if (r.type === "sell_price_pct") return `Sell Prices +${r.amount}%`;
	if (r.type === "storage_tier")   return `+${r.amount} Starting Storage Tier${r.amount > 1 ? "s" : ""}`;
	if (r.type === "cycle_speed_pct")return `Production Speed +${r.amount}%`;
	return "";
}

// Each chain has ordered tiers. Completing a tier unlocks the next one. The active quest pool is drawn from the current frontier of each chain.
// prereq: building key that must appear in prestige.seenBuildings before this chain is offered.
const QUEST_CHAINS = [
	{ id: "sell_logs", type: "sell", resource: "logs", tiers: [
		{ target: 400, label: "Sell 400 Logs", reward: { type: "slot_cost_pct", amount: 10 } },
		{ target: 1000, label: "Sell 1,000 Logs", reward: { type: "sell_price_pct", amount: 10 } },
		{ target: 3000, label: "Sell 3,000 Logs", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 8000, label: "Sell 8,000 Logs", reward: { type: "slot_cost_pct", amount: 10 } },
	]},
	{ id: "sell_timber", type: "sell", resource: "timber", tiers: [
		{ target: 200, label: "Sell 200 Timber", reward: { type: "sell_price_pct", amount: 10 } },
		{ target: 600, label: "Sell 600 Timber", reward: { type: "slot_cost_pct", amount: 10 } },
		{ target: 2000, label: "Sell 2,000 Timber", reward: { type: "unlock_cost_pct", amount: 15 } },
	]},
	{ id: "sell_dowels", type: "sell", resource: "dowels", tiers: [
		{ target: 200, label: "Sell 200 Dowels", reward: { type: "unlock_cost_pct", amount: 10 } },
		{ target: 600, label: "Sell 600 Dowels", reward: { type: "sell_price_pct", amount: 10 } },
	]},
	{ id: "sell_handles", type: "sell", resource: "handles", tiers: [
		{ target: 200, label: "Sell 200 Handles", reward: { type: "unlock_cost_pct", amount: 10 } },
		{ target: 600, label: "Sell 600 Handles", reward: { type: "sell_price_pct", amount: 10 } },
	]},
	{ id: "sell_shafts", type: "sell", resource: "shafts", tiers: [
		{ target: 100, label: "Sell 100 Shafts", reward: { type: "sell_price_pct", amount: 15 } },
		{ target: 300, label: "Sell 300 Shafts", reward: { type: "sell_price_pct", amount: 15 } },
	]},
	{ id: "sell_planks", type: "sell", resource: "planks", prereq: "sawmill", tiers: [
		{ target: 200, label: "Sell 200 Planks", reward: { type: "slot_cost_pct", amount: 10 } },
		{ target: 800, label: "Sell 800 Planks", reward: { type: "unlock_cost_pct", amount: 10 } },
		{ target: 2000, label: "Sell 2,000 Planks", reward: { type: "slot_cost_pct", amount: 15 } },
	]},
	{ id: "sell_boards", type: "sell", resource: "boards", prereq: "sawmill", tiers: [
		{ target: 100, label: "Sell 100 Boards", reward: { type: "sell_price_pct", amount: 10 } },
		{ target: 400, label: "Sell 400 Boards", reward: { type: "slot_cost_pct", amount: 10 } },
		{ target: 1200, label: "Sell 1,200 Boards", reward: { type: "sell_price_pct", amount: 15 } },
	]},
	{ id: "sell_beams", type: "sell", resource: "beams", prereq: "sawmill", tiers: [
		{ target: 100, label: "Sell 100 Beams", reward: { type: "sell_price_pct", amount: 15 } },
		{ target: 300, label: "Sell 300 Beams", reward: { type: "unlock_cost_pct", amount: 15 } },
		{ target: 800, label: "Sell 800 Beams", reward: { type: "slot_cost_pct", amount: 15 } },
	]},
	{ id: "sell_crates", type: "sell", resource: "crates", prereq: "workshop", tiers: [
		{ target: 100, label: "Sell 100 Crates", reward: { type: "storage_tier", amount: 10 } },
		{ target: 400, label: "Sell 400 Crates", reward: { type: "slot_cost_pct", amount: 10 } },
		{ target: 1000, label: "Sell 1,000 Crates", reward: { type: "slot_cost_pct", amount: 15 } },
	]},
	{ id: "sell_furniture", type: "sell", resource: "furniture", prereq: "workshop", tiers: [
		{ target: 60, label: "Sell 60 Furniture", reward: { type: "sell_price_pct", amount: 15 } },
		{ target: 200, label: "Sell 200 Furniture", reward: { type: "sell_price_pct", amount: 10 } },
		{ target: 500, label: "Sell 500 Furniture", reward: { type: "sell_price_pct", amount: 15 } },
	]},
	{ id: "sell_coaches", type: "sell", resource: "coaches", prereq: "workshop", tiers: [
		{ target: 40, label: "Sell 40 Coaches", reward: { type: "build_cost_pct", amount: 15 } },
		{ target: 160, label: "Sell 160 Coaches", reward: { type: "build_cost_pct", amount: 15 } },
	]},
	{ id: "sell_manors", type: "sell", resource: "manors", prereq: "workshop", tiers: [
		{ target: 20, label: "Sell 20 Manors", reward: { type: "cycle_speed_pct", amount: 15 } },
		{ target: 80, label: "Sell 80 Manors", reward: { type: "sell_price_pct", amount: 10 } },
	]},
	{ id: "sell_iron_ore", type: "sell", resource: "iron_ore", prereq: "forge", tiers: [
		{ target: 500, label: "Sell 500 Iron Ore", reward: { type: "slot_cost_pct", amount: 10 } },
		{ target: 1600, label: "Sell 1,600 Iron Ore", reward: { type: "sell_price_pct", amount: 10 } },
		{ target: 4000, label: "Sell 4,000 Iron Ore", reward: { type: "slot_cost_pct", amount: 15 } },
	]},
	{ id: "sell_iron_bars", type: "sell", resource: "iron_bars", prereq: "forge", tiers: [
		{ target: 100, label: "Sell 100 Iron Bars", reward: { type: "sell_price_pct", amount: 10 } },
		{ target: 500, label: "Sell 500 Iron Bars", reward: { type: "slot_cost_pct", amount: 10 } },
		{ target: 1200, label: "Sell 1,200 Iron Bars", reward: { type: "unlock_cost_pct", amount: 15 } },
	]},
	{ id: "sell_nails", type: "sell", resource: "nails", prereq: "forge", tiers: [
		{ target: 200, label: "Sell 200 Nails", reward: { type: "slot_cost_pct", amount: 10 } },
		{ target: 600, label: "Sell 600 Nails", reward: { type: "slot_cost_pct", amount: 10 } },
	]},
	{ id: "sell_fittings", type: "sell", resource: "iron_fittings", prereq: "forge", tiers: [
		{ target: 100, label: "Sell 100 Iron Fittings", reward: { type: "unlock_cost_pct", amount: 15 } },
		{ target: 300, label: "Sell 300 Iron Fittings", reward: { type: "sell_price_pct", amount: 15 } },
	]},
	{ id: "sell_gears", type: "sell", resource: "gears", prereq: "foundry", tiers: [
		{ target: 60, label: "Sell 60 Gears", reward: { type: "build_cost_pct", amount: 15 } },
		{ target: 200, label: "Sell 200 Gears", reward: { type: "sell_price_pct", amount: 10 } },
	]},
	{ id: "sell_springs", type: "sell", resource: "springs", prereq: "foundry", tiers: [
		{ target: 60, label: "Sell 60 Springs", reward: { type: "sell_price_pct", amount: 15 } },
		{ target: 160, label: "Sell 160 Springs", reward: { type: "sell_price_pct", amount: 15 } },
	]},
	{ id: "sell_mechanisms", type: "sell", resource: "mechanisms", prereq: "foundry", tiers: [
		{ target: 40, label: "Sell 40 Mechanisms", reward: { type: "build_cost_pct", amount: 15 } },
		{ target: 120, label: "Sell 120 Mechanisms", reward: { type: "build_cost_pct", amount: 15 } },
	]},
	{ id: "sell_clockwork", type: "sell", resource: "clockwork", prereq: "foundry", tiers: [
		{ target: 20, label: "Sell 20 Clockwork", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 60, label: "Sell 60 Clockwork", reward: { type: "slot_cost_pct", amount: 25 } },
	]},
	{ id: "sell_blades", type: "sell", resource: "blades", prereq: "armoury", tiers: [
		{ target: 60, label: "Sell 60 Blades", reward: { type: "sell_price_pct", amount: 15 } },
		{ target: 200, label: "Sell 200 Blades", reward: { type: "sell_price_pct", amount: 10 } },
	]},
	{ id: "sell_crossbows", type: "sell", resource: "crossbows", prereq: "armoury", tiers: [
		{ target: 40, label: "Sell 40 Crossbows", reward: { type: "cycle_speed_pct", amount: 15 } },
		{ target: 100, label: "Sell 100 Crossbows", reward: { type: "sell_price_pct", amount: 15 } },
	]},
	{ id: "sell_cannons", type: "sell", resource: "cannons", prereq: "armoury", tiers: [
		{ target: 20, label: "Sell 20 Cannon", reward: { type: "build_cost_pct", amount: 15 } },
		{ target: 60, label: "Sell 60 Cannons", reward: { type: "build_cost_pct", amount: 25 } },
	]},
	{ id: "sell_artillery", type: "sell", resource: "artillery", prereq: "armoury", tiers: [
		{ target: 20, label: "Sell 20 Artillery", reward: { type: "cycle_speed_pct", amount: 10 } },
		{ target: 40, label: "Sell 40 Artillery", reward: { type: "cycle_speed_pct", amount: 15 } },
	]},
	{ id: "sell_hulls", type: "sell", resource: "hulls", prereq: "shipyard", tiers: [
		{ target: 40, label: "Sell 40 Hulls", reward: { type: "sell_price_pct", amount: 15 } },
		{ target: 100, label: "Sell 100 Hulls", reward: { type: "sell_price_pct", amount: 15 } },
	]},
	{ id: "sell_rigging", type: "sell", resource: "rigging", prereq: "shipyard", tiers: [
		{ target: 40, label: "Sell 40 Rigging", reward: { type: "cycle_speed_pct", amount: 15 } },
		{ target: 100, label: "Sell 100 Rigging", reward: { type: "sell_price_pct", amount: 10 } },
	]},
	{ id: "sell_galleons", type: "sell", resource: "galleons", prereq: "shipyard", tiers: [
		{ target: 20, label: "Sell 20 Galleons", reward: { type: "cycle_speed_pct", amount: 10 } },
		{ target: 40, label: "Sell 40 Galleons", reward: { type: "sell_price_pct", amount: 25 } },
	]},
	{ id: "sell_dreadnoughts", type: "sell", resource: "dreadnoughts", prereq: "shipyard", tiers: [
		{ target: 20, label: "Sell 20 Dreadnoughts", reward: { type: "cycle_speed_pct", amount: 25 } },
	]},
	{ id: "slots_logs", type: "slots", bld: "lumber_yard", product: "logs", tiers: [
		{ target: 60, label: "Own 60 Log Slots", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 100, label: "Own 100 Log Slots", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 160, label: "Own 160 Log Slots", reward: { type: "sell_price_pct", amount: 15 } },
	]},
	{ id: "slots_iron_ore", type: "slots", bld: "forge", product: "iron_ore", prereq: "forge", tiers: [
		{ target: 60, label: "Own 60 Iron Ore Slots", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 100, label: "Own 100 Iron Ore Slots", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 160, label: "Own 160 Iron Ore Slots", reward: { type: "sell_price_pct", amount: 15 } },
	]},
	{ id: "slots_timber", type: "slots", bld: "lumber_yard", product: "timber", tiers: [
		{ target: 60, label: "Own 60 Timber Slots", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 100, label: "Own 100 Timber Slots", reward: { type: "slot_cost_pct", amount: 15 } },
	]},
	{ id: "total_slots", type: "total_slots", tiers: [
		{ target: 200, label: "Own 200 Slots Total", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 400, label: "Own 400 Slots Total", reward: { type: "sell_price_pct", amount: 15 } },
		{ target: 700, label: "Own 700 Slots Total", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 1000, label: "Own 1,000 Slots Total", reward: { type: "cycle_speed_pct", amount: 15 } },
	]},
	{ id: "build_sawmill", type: "build", bld: "sawmill", tiers: [{ target: 1, label: "Build the Sawmill", reward: { type: "build_cost_pct", amount: 15 } }]},
	{ id: "build_workshop", type: "build", bld: "workshop", tiers: [{ target: 1, label: "Build the Workshop", reward: { type: "storage_tier", amount: 10 } }]},
	{ id: "build_forge", type: "build", bld: "forge", tiers: [{ target: 1, label: "Build the Forge", reward: { type: "storage_tier", amount: 10 } }]},
	{ id: "build_foundry", type: "build", bld: "foundry", prereq: "forge", tiers: [{ target: 1, label: "Build the Foundry", reward: { type: "build_cost_pct", amount: 15 } }]},
	{ id: "build_armoury", type: "build", bld: "armoury", prereq: "foundry", tiers: [{ target: 1, label: "Build the Armoury", reward: { type: "sell_price_pct", amount: 15 } }]},
	{ id: "build_shipyard", type: "build", bld: "shipyard", prereq: "armoury", tiers: [{ target: 1, label: "Build the Shipyard", reward: { type: "cycle_speed_pct", amount: 15 } }]},
	{ id: "unlock_boards", type: "unlock", bld: "sawmill", product: "boards", prereq: "sawmill", tiers: [{ target: 1, label: "Unlock Boards", reward: { type: "unlock_cost_pct", amount: 10 } }]},
	{ id: "unlock_shafts", type: "unlock", bld: "lumber_yard", product: "shafts", tiers: [{ target: 1, label: "Unlock Shafts", reward: { type: "unlock_cost_pct", amount: 15 } }]},
	{ id: "unlock_furniture", type: "unlock", bld: "workshop", product: "furniture", prereq: "workshop", tiers: [{ target: 1, label: "Unlock Furniture", reward: { type: "sell_price_pct", amount: 15 } }]},
	{ id: "unlock_fittings", type: "unlock", bld: "forge", product: "iron_fittings", prereq: "forge", tiers: [{ target: 1, label: "Unlock Iron Fittings", reward: { type: "unlock_cost_pct", amount: 15 } }]},
	{ id: "unlock_clockwork", type: "unlock", bld: "foundry", product: "clockwork", prereq: "foundry", tiers: [{ target: 1, label: "Unlock Clockwork", reward: { type: "build_cost_pct", amount: 25 } }]},
	{ id: "unlock_artillery", type: "unlock", bld: "armoury", product: "artillery", prereq: "armoury", tiers: [{ target: 1, label: "Unlock Artillery", reward: { type: "sell_price_pct", amount: 25 } }]},
	{ id: "unlock_dreadnoughts", type: "unlock", bld: "shipyard", product: "dreadnoughts", prereq: "shipyard", tiers: [{ target: 1, label: "Unlock Dreadnoughts", reward: { type: "cycle_speed_pct", amount: 25 } }]},
	{ id: "storage_upgrades", type: "storage", tiers: [
		{ target: 60, label: "Upgrade Storage 60 Times", reward: { type: "storage_tier", amount: 10 } },
		{ target: 120, label: "Upgrade Storage 120 Times", reward: { type: "storage_tier", amount: 10 } },
		{ target: 200, label: "Upgrade Storage 200 Times", reward: { type: "storage_tier", amount: 10 } },
	]},
	{ id: "earn_gold", type: "gold_earned", tiers: [
		{ target: 100000, label: "Earn 100,000 Gold", reward: { type: "sell_price_pct", amount: 10 } },
		{ target: 1000000, label: "Earn 1,000,000 Gold", reward: { type: "sell_price_pct", amount: 15 } },
		{ target: 10000000, label: "Earn 10,000,000 Gold", reward: { type: "sell_price_pct", amount: 15 } },
		{ target: 100000000, label: "Earn 100,000,000 Gold", reward: { type: "unlock_cost_pct", amount: 25 } },
		{ target: 1000000000, label: "Earn 1,000,000,000 Gold", reward: { type: "cycle_speed_pct", amount: 25 } },
	]},
];

// Flat quest pool built from chains. Each entry gets id = `${chainId}_t${tierIndex}`.
const QUEST_POOL = QUEST_CHAINS.flatMap(chain => chain.tiers.map((tier, i) => ({
	id:          `${chain.id}_t${i}`,
	chainId:     chain.id,
	tierIndex:   i,
	label:       tier.label,
	type:        chain.type,
	resource:    chain.resource,
	bld:         chain.bld,
	product:     chain.product,
	target:      tier.target,
	reward:      tier.reward,
	rewardLabel: rewardLabel(tier.reward),
})));

const RESOURCES = {
	// Wood chain
	logs:          { label: "Logs",          singular: "Log",          price: 5 },
	timber:        { label: "Timber",        singular: "Timber",       price: 25 },
	dowels:        { label: "Dowels",        singular: "Dowel",        price: 75 },
	handles:       { label: "Handles",       singular: "Handle",       price: 120 },
	shafts:        { label: "Shafts",        singular: "Shaft",        price: 500 },
	planks:        { label: "Planks",        singular: "Plank",        price: 50 },
	boards:        { label: "Boards",        singular: "Board",        price: 200 },
	beams:         { label: "Beams",         singular: "Beam",         price: 750 },
	crates:        { label: "Crates",        singular: "Crate",        price: 2000 },
	furniture:     { label: "Furniture",     singular: "Furniture",    price: 10000 },
	coaches:       { label: "Coaches",       singular: "Coach",        price: 50000 },
	manors:        { label: "Manors",        singular: "Manor",        price: 500000 },
	// Iron chain
	iron_ore:      { label: "Iron Ore",      singular: "Iron Ore",     price: 250 },
	iron_bars:     { label: "Iron Bars",     singular: "Iron Bar",     price: 2500 },
	nails:         { label: "Nails",         singular: "Nail",         price: 5000 },
	iron_fittings: { label: "Iron Fittings", singular: "Iron Fitting", price: 15000 },
	// Foundry chain
	gears:         { label: "Gears",         singular: "Gear",         price: 100000 },
	springs:       { label: "Springs",       singular: "Spring",       price: 250000 },
	mechanisms:    { label: "Mechanisms",    singular: "Mechanism",    price: 1250000 },
	clockwork:     { label: "Clockwork",     singular: "Clockwork",    price: 7500000 },
	// Armoury chain
	blades:        { label: "Blades",        singular: "Blade",        price: 100000 },
	crossbows:     { label: "Crossbows",     singular: "Crossbow",     price: 750000 },
	cannons:       { label: "Cannons",       singular: "Cannon",       price: 7500000 },
	artillery:     { label: "Artillery",     singular: "Artillery",    price: 150000000 },
	// Shipyard chain
	hulls:         { label: "Hulls",         singular: "Hull",         price: 2500000 },
	rigging:       { label: "Rigging",       singular: "Rigging",      price: 1500000 },
	galleons:      { label: "Galleons",      singular: "Galleon",      price: 100000000 },
	dreadnoughts:  { label: "Dreadnoughts",  singular: "Dreadnought",  price: 1000000000 },
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
				outputAmt: 2,
				inputs: {},
				baseCycleMs: 2500,
				unlockCost: 0,
				baseSlotCost: 75,
				prereqProduct: null,
				startsUnlocked: true,
			},
			timber: {
				outputKey: "timber",
				outputAmt: 1,
				inputs: { logs: 2 },
				baseCycleMs: 4000,
				unlockCost: 150,
				baseSlotCost: 175,
				prereqProduct: "logs",
			},
			dowels: {
				outputKey: "dowels",
				outputAmt: 1,
				inputs: { timber: 1 },
				baseCycleMs: 6000,
				unlockCost: 750,
				baseSlotCost: 300,
				prereqProduct: "timber",
			},
			handles: {
				outputKey: "handles",
				outputAmt: 1,
				inputs: { timber: 1 },
				baseCycleMs: 8000,
				unlockCost: 1000,
				baseSlotCost: 600,
				prereqProduct: "timber",
			},
			shafts: {
				outputKey: "shafts",
				outputAmt: 1,
				inputs: { handles: 1, dowels: 1 },
				baseCycleMs: 15000,
				unlockCost: 1800,
				baseSlotCost: 1000,
				prereqProduct: "handles",
			},
		},
	},
	sawmill: {
		label: "Sawmill",
		desc: "Cuts raw logs into structural lumber for construction and trade.",
		buildCost: 25000,
		slotCostExponent: 1.35,
		prereq: () => state.buildings.lumber_yard?.unlocked,
		products: {
			planks: {
				outputKey: "planks",
				outputAmt: 1,
				inputs: { logs: 1 },
				baseCycleMs: 5000,
				unlockCost: 0,
				baseSlotCost: 150,
				prereqProduct: null,
				startsUnlocked: true,
			},
			boards: {
				outputKey: "boards",
				outputAmt: 1,
				inputs: { logs: 2 },
				baseCycleMs: 10000,
				unlockCost: 500,
				baseSlotCost: 350,
				prereqProduct: "planks",
			},
			beams: {
				outputKey: "beams",
				outputAmt: 1,
				inputs: { logs: 2 },
				baseCycleMs: 12000,
				unlockCost: 1200,
				baseSlotCost: 700,
				prereqProduct: "boards",
			},
		},
	},
	workshop: {
		label: "Workshop",
		desc: "Combines lumber and precision parts into finished goods for the empire.",
		buildCost: 500000,
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
				inputs: { beams: 2, boards: 2, shafts: 2 },
				baseCycleMs: 72000,
				unlockCost: 6000,
				baseSlotCost: 5500,
				prereqProduct: "coaches",
			},
		},
	},
	forge: {
		label: "Forge",
		desc: "Smelts raw iron ore into bars and precision metalwork.",
		buildCost: 10000000,
		slotCostExponent: 1.30,
		prereq: () => state.buildings.workshop?.unlocked,
		products: {
			iron_ore: {
				outputKey: "iron_ore",
				outputAmt: 1,
				inputs: {},
				baseCycleMs: 4000,
				unlockCost: 0,
				baseSlotCost: 200,
				prereqProduct: null,
				startsUnlocked: true,
			},
			iron_bars: {
				outputKey: "iron_bars",
				outputAmt: 2,
				inputs: { iron_ore: 2 },
				baseCycleMs: 9000,
				unlockCost: 500,
				baseSlotCost: 600,
				prereqProduct: "iron_ore",
			},
			nails: {
				outputKey: "nails",
				outputAmt: 1,
				inputs: { iron_bars: 1 },
				baseCycleMs: 8000,
				unlockCost: 1500,
				baseSlotCost: 1200,
				prereqProduct: "iron_bars",
			},
			iron_fittings: {
				outputKey: "iron_fittings",
				outputAmt: 1,
				inputs: { iron_bars: 2 },
				baseCycleMs: 8000,
				unlockCost: 4000,
				baseSlotCost: 2500,
				prereqProduct: "nails",
			},
		},
	},
	foundry: {
		label: "Foundry",
		desc: "Casts complex mechanisms and precision components from refined iron.",
		buildCost: 250000000,
		slotCostExponent: 1.35,
		prereq: () => state.buildings.forge?.unlocked && state.buildings.forge.products.iron_fittings.unlocked,
		products: {
			gears: {
				outputKey: "gears",
				outputAmt: 1,
				inputs: { iron_bars: 1, dowels: 1 },
				baseCycleMs: 30000,
				unlockCost: 0,
				baseSlotCost: 3500,
				prereqProduct: null,
				startsUnlocked: true,
			},
			springs: {
				outputKey: "springs",
				outputAmt: 1,
				inputs: { iron_fittings: 2 },
				baseCycleMs: 20000,
				unlockCost: 8000,
				baseSlotCost: 5000,
				prereqProduct: "gears",
			},
			mechanisms: {
				outputKey: "mechanisms",
				outputAmt: 1,
				inputs: { gears: 1, springs: 1 },
				baseCycleMs: 22000,
				unlockCost: 15000,
				baseSlotCost: 8000,
				prereqProduct: "springs",
			},
			clockwork: {
				outputKey: "clockwork",
				outputAmt: 1,
				inputs: { mechanisms: 1, iron_fittings: 1 },
				baseCycleMs: 90000,
				unlockCost: 25000,
				baseSlotCost: 12000,
				prereqProduct: "mechanisms",
			},
		},
	},
	armoury: {
		label: "Armoury",
		desc: "Forges weapons of war from iron, timber, and precision components.",
		buildCost: 5000000000,
		slotCostExponent: 1.30,
		prereq: () => state.buildings.foundry?.unlocked && state.buildings.foundry.products.mechanisms.unlocked,
		products: {
			blades: {
				outputKey: "blades",
				outputAmt: 1,
				inputs: { iron_bars: 2, timber: 1 },
				baseCycleMs: 20000,
				unlockCost: 0,
				baseSlotCost: 6000,
				prereqProduct: null,
				startsUnlocked: true,
			},
			crossbows: {
				outputKey: "crossbows",
				outputAmt: 1,
				inputs: { boards: 1, shafts: 1, iron_fittings: 1 },
				baseCycleMs: 35000,
				unlockCost: 20000,
				baseSlotCost: 10000,
				prereqProduct: "blades",
			},
			cannons: {
				outputKey: "cannons",
				outputAmt: 1,
				inputs: { beams: 2, iron_bars: 2, mechanisms: 1 },
				baseCycleMs: 90000,
				unlockCost: 50000,
				baseSlotCost: 18000,
				prereqProduct: "crossbows",
			},
			artillery: {
				outputKey: "artillery",
				outputAmt: 1,
				inputs: { beams: 3, mechanisms: 2, clockwork: 1 },
				baseCycleMs: 130000,
				unlockCost: 100000,
				baseSlotCost: 30000,
				prereqProduct: "cannons",
			},
		},
	},
	shipyard: {
		label: "Shipyard",
		desc: "Builds mighty vessels from timber, iron, and the finest components.",
		buildCost: 100000000000,
		slotCostExponent: 1.25,
		prereq: () => state.buildings.armoury?.unlocked && state.buildings.armoury.products.cannons.unlocked,
		products: {
			hulls: {
				outputKey: "hulls",
				outputAmt: 1,
				inputs: { beams: 3, boards: 2 },
				baseCycleMs: 60000,
				unlockCost: 0,
				baseSlotCost: 22000,
				prereqProduct: null,
				startsUnlocked: true,
			},
			rigging: {
				outputKey: "rigging",
				outputAmt: 1,
				inputs: { shafts: 2, iron_fittings: 2 },
				baseCycleMs: 45000,
				unlockCost: 60000,
				baseSlotCost: 20000,
				prereqProduct: "hulls",
			},
			galleons: {
				outputKey: "galleons",
				outputAmt: 1,
				inputs: { hulls: 1, rigging: 1, cannons: 2 },
				baseCycleMs: 180000,
				unlockCost: 150000,
				baseSlotCost: 45000,
				prereqProduct: "rigging",
			},
			dreadnoughts: {
				outputKey: "dreadnoughts",
				outputAmt: 1,
				inputs: { hulls: 2, rigging: 1, artillery: 2, clockwork: 2 },
				baseCycleMs: 360000,
				unlockCost: 350000,
				baseSlotCost: 90000,
				prereqProduct: "galleons",
			},
		},
	},
};

const STORAGE_BASE = 50;
const STORAGE_FIRST_UPGRADE = 100;
const STORAGE_INCREMENT = 100;
const STORAGE_BASE_COST = 150;
const STORAGE_COST_GROWTH = 1.5;

const DEFAULT_STATE = (() => ({
	gold: 0,
	lastTick: null,
	inventory: Object.fromEntries(Object.keys(RESOURCES).map(k => [k, 0])),
	storage: { tier: 0 },
	stats: { goldEarned: 0, soldByResource: {} },
	quests: { active: [], completed: [] },
	buildings: Object.fromEntries(
		Object.keys(BUILDING_CONFIG).map(bldKey => {
			const bcfg = BUILDING_CONFIG[bldKey];
			return [bldKey, {
				unlocked: bldKey === "lumber_yard",
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

const runtime = {
	nextSlotId: 0,
	stallAnnounced: {},
	announceTimers: { polite: null, assertive: null },
	selectedBuilding: null,
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
	const tier = state.storage.tier + getPrestigeBonus("storage_tier");
	if (tier <= 0) return STORAGE_BASE;
	return STORAGE_FIRST_UPGRADE + ((tier - 1) * STORAGE_INCREMENT);
}

function nextStorageMax() {
	const tier = state.storage.tier + getPrestigeBonus("storage_tier");
	if (tier <= 0) return STORAGE_FIRST_UPGRADE;
	return storageMax() + STORAGE_INCREMENT;
}

function storageUpgradeCost() {
	return Math.round(STORAGE_BASE_COST * Math.pow(STORAGE_COST_GROWTH, state.storage.tier));
}

function nextSlotCost(bldKey, productKey) {
	const n = state.buildings[bldKey].products[productKey].slots.length;
	const exp = BUILDING_CONFIG[bldKey].slotCostExponent ?? 1.5;
	const base = BUILDING_CONFIG[bldKey].products[productKey].baseSlotCost * Math.pow(exp, n);
	return Math.round(base * prestigeSlotCostMult());
}

function lastSlotCost(bldKey, productKey) {
	const n = state.buildings[bldKey].products[productKey].slots.length;
	if (n === 0) return 0;
	const exp = BUILDING_CONFIG[bldKey].slotCostExponent ?? 1.5;
	const base = BUILDING_CONFIG[bldKey].products[productKey].baseSlotCost * Math.pow(exp, n - 1);
	return Math.round(base * prestigeSlotCostMult());
}

function currentPrice(resourceKey) {
	return Math.round(RESOURCES[resourceKey].price * prestigeSellMult());
}

function formatRate(slots, outputAmt, baseCycleMs, label = "") {
	const perMin = slots * outputAmt * 60000 / baseCycleMs;
	const rounded = Math.round(perMin * 10) / 10;
	const num = rounded % 1 === 0 ? `${rounded}` : rounded.toFixed(1);
	return label ? `${num} ${label} per minute` : `${num} per minute`;
}

function formatProductOutput(slots, outputAmt, baseCycleMs, label = "", brief = false) {
	const total = slots * outputAmt;
	const cycleSpeedMult = prestigeSpeedMult();
	const actualCycleMs = baseCycleMs / cycleSpeedMult;
	const actualSecs = actualCycleMs / 1000;
	const perMin = total * 60 / actualSecs;
	const perMinFmt = perMin.toFixed(1).replace(/\.0$/, "");
	const durationNum = actualSecs.toFixed(1).replace(/\.0$/, "");
	const duration = `${durationNum} ${actualSecs === 1 ? "second" : "seconds"}`;
	const name = label ? (total === 1 ? RESOURCES[label].singular : RESOURCES[label].label) : "";
	if (brief) return `${total}${name ? " " + name : ""} every ${duration}`;
	return `${total}${name ? " " + name : ""} every ${duration} (${perMinFmt} per minute)`;
}

function formatDuration(seconds) {
	if (seconds < 60) return `${seconds} ${seconds === 1 ? "second" : "seconds"}`;
	const mins = Math.round(seconds / 60);
	if (mins < 60) return `${mins} ${mins === 1 ? "minute" : "minutes"}`;
	const hours = Math.round(mins / 60);
	return `${hours} ${hours === 1 ? "hour" : "hours"}`;
}

function formatNum(n) {
	if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
	if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
	return n.toLocaleString();
}

function loadPrestige() {
	try {
		const raw = localStorage.getItem(PRESTIGE_KEY);
		if (raw) {
			const p = JSON.parse(raw);
			if (typeof p.runs === "number") prestige.runs = p.runs;
			if (Array.isArray(p.rewards)) prestige.rewards = p.rewards;
			if (Array.isArray(p.completedQuestIds)) prestige.completedQuestIds = p.completedQuestIds;
			if (Array.isArray(p.seenBuildings)) prestige.seenBuildings = p.seenBuildings;
		}
	} catch (e) {}
}

function eligibleQuestPool() {
	const completed = new Set(prestige.completedQuestIds);
	const seen = new Set(["lumber_yard", ...prestige.seenBuildings]);
	const pool = [];
	for (const chain of QUEST_CHAINS) {
		if (chain.prereq && !seen.has(chain.prereq)) continue;
		for (let i = 0; i < chain.tiers.length; i++) {
			const questId = `${chain.id}_t${i}`;
			if (!completed.has(questId)) {
				const q = QUEST_POOL.find(e => e.id === questId);
				if (q) pool.push(q);
				break;
			}
		}
	}
	return pool;
}

function savePrestige() {
	try { localStorage.setItem(PRESTIGE_KEY, JSON.stringify(prestige)); } catch (e) {}
}

function getPrestigeBonus(type) {
	return prestige.rewards.filter(r => r.type === type).reduce((s, r) => s + r.amount, 0);
}

function prestigeSlotCostMult()   { return Math.max(0.1, 1 - getPrestigeBonus("slot_cost_pct")   / 100); }
function prestigeSellMult()        { return 1 + getPrestigeBonus("sell_price_pct")  / 100; }
function prestigeBuildCostMult()   { return Math.max(0.1, 1 - getPrestigeBonus("build_cost_pct")  / 100); }
function prestigeUnlockCostMult()  { return Math.max(0.1, 1 - getPrestigeBonus("unlock_cost_pct") / 100); }
function prestigeSpeedMult()       { return 1 + getPrestigeBonus("cycle_speed_pct") / 100; }

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
		const fresh = deepClone(DEFAULT_STATE);
		deepMerge(fresh, parsed);
		const lastTime = fresh.lastTick;
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

		// Offline Catch-up
		if (lastTime) {
			const now = Date.now();
			const diffMs = now - lastTime;
			const catchupMs = Math.min(diffMs, 24 * 60 * 60 * 1000); // 24h max
			if (catchupMs > 10000) {
				const catchupSec = catchupMs / 1000;
				const speedMult = prestigeSpeedMult();
				let currentTotal = Object.values(state.inventory).reduce((a, b) => a + b, 0);
				const max = storageMax();
				const producers = [];
				for (const [bk, bst] of Object.entries(state.buildings)) {
					if (!bst.unlocked) continue;
					for (const [pk, pst] of Object.entries(bst.products)) {
						if (pst.unlocked && pst.enabled && pst.slots.length > 0) {
							producers.push({ bk, pk, pst, pcfg: BUILDING_CONFIG[bk].products[pk] });
						}
					}
				}
				producers.sort((a, b) => a.pcfg.baseCycleMs - b.pcfg.baseCycleMs);
				let gained = 0;
				for (const p of producers) {
					const cycleSec = (p.pcfg.baseCycleMs / 1000) / speedMult;
					const potential = Math.floor(catchupSec / cycleSec) * p.pst.slots.length * p.pcfg.outputAmt;
					let actual = potential;
					for (const [inK, inA] of Object.entries(p.pcfg.inputs)) {
						const available = state.inventory[inK] || 0;
						actual = Math.min(actual, Math.floor(available / inA) * p.pcfg.outputAmt);
					}
					const space = max - currentTotal;
					const gain = Math.min(actual, space);
					if (gain > 0) {
						state.inventory[p.pk] += gain;
						for (const [inK, inA] of Object.entries(p.pcfg.inputs)) {
							state.inventory[inK] -= Math.ceil(gain / p.pcfg.outputAmt) * inA;
						}
						currentTotal += gain;
						gained += gain;
					}
				}
				if (gained > 0) {
					setTimeout(() => announce(`Welcome back! Your workers produced ${gained.toLocaleString()} items while you were away.`, "polite"), 500);
				}
			}
		}
	} catch (e) {
		console.error("Load failed:", e);
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
			if (runtime.selectedBuilding === bldKey)
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
				if (runtime.selectedBuilding === bldKey)
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
			const cycleSec = (pcfg.baseCycleMs / 1000) / prestigeSpeedMult();
			for (const slot of pst.slots) {
				slot.progress += deltaSec / cycleSec;
				while (slot.progress >= 1.0) {
					slot.progress -= 1.0;
					if (!tryProduceSlot(bldKey, productKey, slot)) break;
				}
			}
			if (pst.manual.active) {
				pst.manual.progress += deltaSec / cycleSec;
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
	const buildCost = Math.round(cfg.buildCost * prestigeBuildCostMult());
	if (state.gold < buildCost) {
		announce(`Need ${buildCost} gold to build ${cfg.label}.`, "assertive");
		return;
	}
	state.gold -= buildCost;
	bst.unlocked = true;
	for (const [pk, pcfg] of Object.entries(cfg.products)) {
		if (pcfg.unlockCost === 0 && !pcfg.prereqProduct) {
			bst.products[pk].unlocked = true;
		}
	}
	addBuildingOption(bldKey);
	runtime.selectedBuilding = bldKey;
	const sel = document.getElementById("building-select");
	if (sel) sel.value = bldKey;
	announce(`${cfg.label} built!`, "polite");
	document.getElementById("section-production")?.setAttribute("open", "");
	renderAll();
	document.getElementById("building-select")?.focus();
}

function unlockProduct(bldKey, productKey) {
	const pcfg = BUILDING_CONFIG[bldKey].products[productKey];
	const pst = state.buildings[bldKey].products[productKey];
	if (pst.unlocked) return;
	if (pcfg.prereqProduct && !state.buildings[bldKey].products[pcfg.prereqProduct].unlocked) return;
	const unlockCost = Math.round(pcfg.unlockCost * prestigeUnlockCostMult());
	if (state.gold < unlockCost) {
		announce(`Need ${unlockCost} gold to unlock ${RESOURCES[pcfg.outputKey].label} production.`, "assertive");
		return;
	}
	state.gold -= unlockCost;
	pst.unlocked = true;
	announce(`${RESOURCES[pcfg.outputKey].label} production unlocked!`, "polite");
	renderAll();
	const addBtn = document.querySelector(`[data-action="add-slot"][data-bld="${bldKey}"][data-product="${productKey}"]`);
	if (addBtn && !addBtn.disabled) addBtn.focus();
	else document.getElementById("building-select")?.focus();
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
		const qty = state.inventory[k];
		const earned = qty * currentPrice(k);
		totalEarned += earned;
		state.stats.soldByResource[k] = (state.stats.soldByResource[k] ?? 0) + qty;
		state.inventory[k] = 0;
	}
	state.stats.goldEarned += totalEarned;
	state.gold += totalEarned;
	announce(`Sold everything for ${totalEarned} gold.`, "polite");
	renderAll();
}

function sellProduct(resourceKey) {
	const inv = state.inventory[resourceKey];
	if (inv <= 0) return;
	const earned = inv * currentPrice(resourceKey);
	state.inventory[resourceKey] = 0;
	state.stats.soldByResource[resourceKey] = (state.stats.soldByResource[resourceKey] ?? 0) + inv;
	state.stats.goldEarned += earned;
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
	if (confirm("Clear all save data and start over? This will reset everything, including prestige rewards.")) {
		localStorage.removeItem(SAVE_KEY);
		localStorage.removeItem(PRESTIGE_KEY);
		state = deepClone(DEFAULT_STATE);
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
	function applyText(text) {
		try {
			const json = atob(text.trim());
			JSON.parse(json);
			localStorage.setItem(SAVE_KEY, json);
			announce("Save imported. Reloading...", "polite");
			setTimeout(() => location.reload(), 800);
		} catch {
			announce("Invalid save data.", "assertive");
		}
	}

	if (navigator.clipboard?.readText) {
		navigator.clipboard.readText().then(applyText, () => {
			const text = prompt("Paste your save data:");
			if (text) applyText(text);
		});
	} else {
		const text = prompt("Paste your save data:");
		if (text) applyText(text);
	}
}

function announce(msg, level = "polite") {
	const el = document.getElementById(`live-${level}`);
	if (!el) return;
	el.textContent = "";
	requestAnimationFrame(() => { el.textContent = msg; });
	if (runtime.announceTimers[level]) clearTimeout(runtime.announceTimers[level]);
	runtime.announceTimers[level] = setTimeout(() => { el.textContent = ""; }, 2000);
}

function addBuildingOption(bldKey) {
	const sel = document.getElementById("building-select");
	if (!sel || sel.querySelector(`option[value="${bldKey}"]`)) return;
	const opt = document.createElement("option");
	opt.value = bldKey;
	opt.textContent = BUILDING_CONFIG[bldKey].label;
	sel.appendChild(opt);
}

function renderAll() {
	renderHUD();
	renderBuildingSection();
	renderMarketSection();
	renderQuestsSection();
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
	return { productRows, hasChain, deficits, balances, efficiencyPct };
}

function renderChainOverview() {
	const { hasChain, balances } = getProductionOverview();
	if (!hasChain) return "";
	const shortages = balances.filter(b => b.net < -0.05).sort((a, b) => a.net - b.net);
	const surpluses = balances.filter(b => b.net > 0.05).sort((a, b) => b.net - a.net);
	let sentences = [];
	if (shortages.length > 0) {
		const list = shortages.map(b => `${RESOURCES[b.resourceKey].label} (need ${Math.abs(b.net).toFixed(1)} per minute more)`).join(", ");
		sentences.push(`<p class="chain-item-neg">Bottleneck: ${list}.</p>`);
	}
	if (surpluses.length > 0) {
		const list = surpluses.map(b => `${RESOURCES[b.resourceKey].label} (+${b.net.toFixed(1)} per minute)`).join(", ");
		sentences.push(`<p class="chain-item-pos">Surplus: ${list}.</p>`);
	}
	if (shortages.length === 0 && surpluses.length === 0) sentences.push(`<p>Your production chain is perfectly balanced.</p>`);
	return `
		<div class="chain-overview">
			<h3>Production Summary</h3>
			<div class="chain-prose">
				${sentences.join("")}
			</div>
		</div>
	`;
}

function renderBuildingSection() {
	const panel = document.getElementById("panel-production");
	if (!panel) return;
	const bldKey = runtime.selectedBuilding;
	
	const nextBldKey = Object.keys(BUILDING_CONFIG).find(k =>
		!state.buildings[k].unlocked && BUILDING_CONFIG[k].prereq()
	);
	let nextHtml = "";
	if (nextBldKey) {
		const ncfg = BUILDING_CONFIG[nextBldKey];
		const ncost = Math.round(ncfg.buildCost * prestigeBuildCostMult());
		nextHtml = `<div class="unlock-section" style="margin-top:0; margin-bottom:var(--space-md)">
			<button class="unlock-product-btn" data-action="build" data-bld="${nextBldKey}" ${state.gold >= ncost ? "" : "disabled"}>
				Build ${ncfg.label} (${ncost === 0 ? "Free" : ncost + " gold"})
			</button>
		</div>`;
	}

	if (!bldKey || !state.buildings[bldKey]?.unlocked) {
		panel.innerHTML = `${nextHtml}<p class="market-empty">No building selected.</p>`;
		return;
	}
	const cfg = BUILDING_CONFIG[bldKey];
	const bst = state.buildings[bldKey];
	const unlockedProducts = Object.entries(cfg.products).filter(([pk]) => bst.products[pk].unlocked);
	const unlockedHtml = unlockedProducts.map(([productKey, pcfg]) => {
		const pst = bst.products[productKey];
		const res = RESOURCES[pcfg.outputKey];
		const slotCost = nextSlotCost(bldKey, productKey);
		const n = pst.slots.length;
		const slotWord = n === 1 ? "slot" : "slots";
		const cycleFmt = formatProductOutput(1, pcfg.outputAmt, pcfg.baseCycleMs, pcfg.outputKey, true);
		const summaryText = n === 0 ? "No slots yet." : `${n} ${slotWord}, ${formatProductOutput(n, pcfg.outputAmt, pcfg.baseCycleMs, pcfg.outputKey)}`;
		const inputDesc = Object.keys(pcfg.inputs).length === 0 || n === 0
			? ""
			: `<p class="product-inputs">Requires: ${formatInputs(Object.fromEntries(Object.entries(pcfg.inputs).map(([k, v]) => [k, v * n])))} per cycle</p>`;
		const refund = Math.floor(lastSlotCost(bldKey, productKey) * 0.5);
		const statusClass = pst.enabled ? "health-ok" : "health-warn";
		return `<div class="product-section">
			<div class="product-header">
				<h4 class="product-title">${res.label}</h4>
				<span class="${statusClass}" style="font-size:var(--font-sm)">${pst.enabled ? "Active" : "Paused"}</span>
			</div>
			${inputDesc}
			<div class="manual-produce-row">
				<button class="manual-produce-btn" data-action="manual-produce"
				 data-bld="${bldKey}" data-product="${productKey}"
				 ${pst.enabled ? "" : "disabled"}>
					${pst.enabled ? `Produce ${res.singular}` : `${res.label} Paused`}
				</button>
				<button class="toggle-product-btn ${pst.enabled ? "" : "paused"}"
				 data-action="toggle-product"
				 data-bld="${bldKey}" data-product="${productKey}">
					${pst.enabled ? "Pause" : "Resume"}
				</button>
			</div>
			<p class="slot-summary">${summaryText}</p>
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
	const unlockHtml = unlockables.length === 0 ? "" : `<section class="unlock-group">
		<h3>Unlockable Products</h3>
		<div class="unlock-section">
			${unlockables.map(([pk, pcfg]) => {
				const res = RESOURCES[pcfg.outputKey];
				const unlockCost = Math.round(pcfg.unlockCost * prestigeUnlockCostMult());
				return `<button class="unlock-product-btn" data-action="unlock-product"
				 data-bld="${bldKey}" data-product="${pk}"
				 ${state.gold >= unlockCost ? "" : "disabled"}>
					Unlock ${res.label} for ${unlockCost} gold
				</button>`;
			}).join("")}
		</div>
	</section>`;

	const chainHtml = renderChainOverview();
	const productsSection = unlockedHtml ? `<section class="product-group"><h3>Products</h3>${unlockedHtml}</section>` : "";
	panel.innerHTML = `${nextHtml}${productsSection}${unlockHtml}${chainHtml}`;
}


function updateMarketProducts() {
	const panel = document.getElementById("panel-market");
	if (!panel) return;
	const container = panel.querySelector("#market-products");
	if (!container) return;

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

	const withStock = Object.keys(RESOURCES).filter(k => state.inventory[k] > 0);
	const hasStock = withStock.length > 0;
	const totalValue = withStock.reduce((sum, k) => sum + state.inventory[k] * currentPrice(k), 0);

	const sellAllBtn = panel.querySelector("[data-action='sell-all']");
	if (sellAllBtn) {
		sellAllBtn.hidden = !hasStock;
		if (hasStock) sellAllBtn.textContent = `Sell Everything for ${totalValue} gold`;
	}
	const emptyMsg = panel.querySelector(".market-empty");
	if (emptyMsg) emptyMsg.hidden = hasStock;

	for (const [resourceKey, res] of Object.entries(RESOURCES)) {
		const inv = state.inventory[resourceKey] || 0;
		const hasItem = inv > 0;
		const card = container.querySelector(`[data-market-resource="${resourceKey}"]`);
		if (!card) continue;
		card.hidden = !hasItem;
		const price = currentPrice(resourceKey);
		const earned = inv * price;
		const stockEl = card.querySelector(".market-product-stock");
		if (stockEl) stockEl.textContent = `${inv} in stock, ${price} gold each`;
		const sellBtn = card.querySelector(".sell-btn");
		if (sellBtn) {
			sellBtn.disabled = !hasItem;
			sellBtn.textContent = `Sell All ${res.label} for ${earned} gold`;
		}
	}
}


function renderMarketSection() {
	const panel = document.getElementById("panel-market");
	if (!panel) return;
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
	const hasStock = withStock.length > 0;
	const totalValue = withStock.reduce((sum, k) => sum + state.inventory[k] * currentPrice(k), 0);
	const productCards = Object.entries(RESOURCES).map(([resourceKey, res]) => {
		const inv = state.inventory[resourceKey] || 0;
		const hasItem = inv > 0;
		const price = currentPrice(resourceKey);
		const earned = inv * price;
		return `<div class="market-product" data-market-resource="${resourceKey}"${hasItem ? "" : " hidden"}>
			<div class="market-product-header">
				<h4 class="market-product-name">${res.label}</h4>
				<span class="market-product-stock">${inv} in stock, ${price} gold each</span>
			</div>
			<button class="sell-btn" data-action="sell" data-resource="${resourceKey}"${hasItem ? "" : " disabled"}>
				Sell All ${res.label} for ${earned} gold
			</button>
		</div>`;
	}).join("");
	panel.innerHTML = `<div class="storage-info">
		<div class="storage-bar-wrap" role="progressbar" aria-label="Storage used"
		 aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
			<div class="storage-bar-fill" style="width:${pct}%"></div>
		</div>
		<p class="storage-used-label">${storageLabel}</p>
		${upgHtml}
	</div>
	<div class="market-divider"></div>
	<button class="sell-all-btn" data-action="sell-all"${hasStock ? "" : " hidden"}>Sell Everything for ${totalValue} gold</button>
	<p class="market-empty"${hasStock ? " hidden" : ""}>Nothing to sell yet.</p>
	<section class="market-inventory-section">
		<h3>Inventory</h3>
		<div id="market-products">${productCards}</div>
	</section>`;
}

function renderSettingsSection() {
	const panel = document.getElementById("panel-settings");
	if (!panel) return;
	if (panel.firstChild) return;
	panel.innerHTML = `<section class="settings-section">
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
	try { advanceBuildings(delta); } catch (e) { console.error("advanceBuildings:", e); }
	checkQuestCompletion();
	renderHUD();
	updateMarketProducts();
	renderQuestsSection();
}

function handleClick(e) {
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
		case "prestige-reset": doPrestigeReset(); break;
		case "save-now": saveNow(); break;
		case "copy-save": copySaveToClipboard(); break;
		case "import-save": importSaveFromClipboard(); break;
		case "clear-save": clearSaveData(); break;
		case "settings-open":
			document.getElementById("app").classList.add("settings-open");
			renderSettingsSection();
			document.querySelector("#settings-back-row button")?.focus();
			break;
		case "settings-back":
			document.getElementById("app").classList.remove("settings-open");
			document.getElementById("settings-btn")?.focus();
			break;
	}
}

function drawQuests() {
	const currentActive = state.quests.active || [];
	const currentCompleted = state.quests.completed || [];
	
	const newActive = [];
	const newCompleted = [];

	for (let i = 0; i < currentActive.length; i++) {
		if (!currentCompleted[i]) {
			newActive.push(currentActive[i]);
			newCompleted.push(false);
		}
	}

	const pool = eligibleQuestPool();
	const existingIds = new Set(newActive);
	const available = pool.filter(q => !existingIds.has(q.id)).sort(() => Math.random() - 0.5);
	
	while (newActive.length < 5 && available.length > 0) {
		const q = available.shift();
		newActive.push(q.id);
		newCompleted.push(false);
	}

	state.quests.active = newActive;
	state.quests.completed = newCompleted;
}

function getQuestProgress(def) {
	switch (def.type) {
		case "sell":
			return { current: state.stats.soldByResource[def.resource] ?? 0, target: def.target };
		case "slots": {
			const slots = state.buildings[def.bld]?.products[def.product]?.slots.length ?? 0;
			return { current: slots, target: def.target };
		}
		case "total_slots": {
			let n = 0;
			for (const bst of Object.values(state.buildings))
				for (const pst of Object.values(bst.products)) n += pst.slots.length;
			return { current: n, target: def.target };
		}
		case "build":
			return { current: state.buildings[def.bld]?.unlocked ? 1 : 0, target: 20 };
		case "unlock":
			return { current: state.buildings[def.bld]?.products[def.product]?.unlocked ? 1 : 0, target: 20 };
		case "storage":
			return { current: state.storage.tier, target: def.target };
		case "gold_earned":
			return { current: state.stats.goldEarned, target: def.target };
		default:
			return { current: 0, target: 20 };
	}
}

function checkQuestCompletion() {
	if (!state.quests.active.length) return;
	for (let i = 0; i < state.quests.active.length; i++) {
		if (state.quests.completed[i]) continue;
		const def = QUEST_POOL.find(q => q.id === state.quests.active[i]);
		if (!def) continue;
		const { current, target } = getQuestProgress(def);
		if (current >= target) {
			state.quests.completed[i] = true;
			announce(`Quest complete: ${def.label}!`, "polite");
		}
	}
}

function doPrestigeReset() {
	const completedCount = state.quests.completed.filter(Boolean).length;
	if (completedCount === 0) return;
	const incomplete = 5 - completedCount;
	const msg = incomplete > 0 ? `Reset with ${completedCount}/5 quests complete?\n\nYou'll miss ${incomplete} reward${incomplete === 1 ? "" : "s"}. You can always keep playing to finish them.` : "All 5 quests complete! Reset and claim your rewards?";
	if (!confirm(msg)) return;
	for (const [bk, bst] of Object.entries(state.buildings)) {
		if (bst.unlocked && !prestige.seenBuildings.includes(bk)) prestige.seenBuildings.push(bk);
	}
	for (let i = 0; i < state.quests.active.length; i++) {
		if (!state.quests.completed[i]) continue;
		const qid = state.quests.active[i];
		const def = QUEST_POOL.find(q => q.id === qid);
		if (def) {
			prestige.rewards.push(def.reward);
			if (!prestige.completedQuestIds.includes(qid)) prestige.completedQuestIds.push(qid);
		}
	}
	prestige.runs++;
	savePrestige();
	state = deepClone(DEFAULT_STATE);
	state.gold = getPrestigeBonus("starting_gold");
	state.lastTick = Date.now();
	runtime.nextSlotId = 0;
	runtime.stallAnnounced = {};
	runtime.selectedBuilding = null;
	const sel = document.getElementById("building-select");
	if (sel) sel.innerHTML = "";
	const prodPanel = document.getElementById("panel-production");
	if (prodPanel) prodPanel.innerHTML = "";
	_questsRenderKey = "";
	drawQuests();
	save();
	renderAll();
	announce(`Run ${prestige.runs + 1} started! ${completedCount} reward${completedCount === 1 ? "" : "s"} earned.`, "polite");
}

function computePrestigeSummary() {
	const defs = [
		{ type: "starting_gold",  fmt: n => `+${n.toLocaleString()} Starting Gold`       },
		{ type: "slot_cost_pct",  fmt: n => `Slot Costs -${n}%`                          },
		{ type: "unlock_cost_pct",fmt: n => `Unlock Costs -${n}%`                        },
		{ type: "build_cost_pct", fmt: n => `Build Costs -${n}%`                         },
		{ type: "sell_price_pct", fmt: n => `Sell Prices +${n}%`                         },
		{ type: "storage_tier",   fmt: n => `+${n} Starting Storage Tier${n > 1 ? "s" : ""}` },
		{ type: "cycle_speed_pct",fmt: n => `Production Speed +${n}%`                    },
	];
	return defs.map(d => {
		const total = getPrestigeBonus(d.type);
		return total > 0 ? d.fmt(total) : null;
	}).filter(Boolean);
}

function renderQuestsSection() {
	const panel = document.getElementById("panel-quests");
	if (!panel) return;
	const summaryH2 = document.querySelector("#section-quests > summary h2");
	if (summaryH2) summaryH2.textContent = `Quests : Run ${prestige.runs + 1}`;
	const structKey = state.quests.active.join(",") + ":" + state.quests.completed.map(Number).join(",") + ":" + prestige.runs;
	if (structKey === _questsRenderKey && panel.firstChild) {
		_updateQuestBars(panel);
		return;
	}
	_questsRenderKey = structKey;
	const completedCount = state.quests.completed.filter(Boolean).length;
	const canReset = completedCount >= 1;
	const buildCard = (id, i) => {
		const def = QUEST_POOL.find(q => q.id === id);
		if (!def) return "";
		const { current, target } = getQuestProgress(def);
		const done = state.quests.completed[i];
		const isBoolean = def.type === "build" || def.type === "unlock";
		const pct = isBoolean ? (done ? 100 : 0) : Math.min(100, Math.floor(current / target * 100));
		const progressRow = done ? "" : isBoolean
			? `<div class="quest-progress-row"><span class="quest-prog-text">Not yet</span></div>`
			: `<div class="quest-progress-row">
				<div class="quest-bar-wrap" role="progressbar"
					data-quest-bar="${id}"
					aria-label="quest progress"
					aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
					<div class="quest-bar-fill" style="width:${pct}%"></div>
				</div>
				<span class="quest-prog-text" data-quest-text="${id}">${formatNum(current)} / ${formatNum(target)}</span>
			</div>`;
		return `<div class="quest-card${done ? " quest-done" : ""}">
			<h4 class="quest-title">${def.label}</h4>
			<p class="quest-reward-label">Reward: ${def.rewardLabel}</p>
			${progressRow}
		</div>`;
	};
	const inProgressHtml = state.quests.active.map((id, i) => state.quests.completed[i] ? "" : buildCard(id, i)).join("");
	const completedHtml = state.quests.active.map((id, i) => state.quests.completed[i] ? buildCard(id, i) : "").join("");
	const bonuses = computePrestigeSummary();
	const bonusesHtml = bonuses.length === 0 ? `<p class="quest-no-bonuses">No bonuses yet. Complete quests and reset to earn permanent upgrades.</p>` : `<ul class="prestige-bonus-list">${bonuses.map(b => `<li>${b}</li>`).join("")}</ul>`;
	const resetLabel = completedCount === state.quests.active.length ? "Reset & Collect All Rewards" : `Reset & Collect Rewards (${completedCount} / ${state.quests.active.length} complete)`;
	const warningHtml = canReset && completedCount < state.quests.active.length ? `<p class="reset-warning">${state.quests.active.length - completedCount} quest${state.quests.active.length - completedCount === 1 ? "" : "s"} still incomplete. You will miss those rewards.</p>` : "";
	panel.innerHTML = `
		${inProgressHtml ? `<section class="quest-group"><h3>In Progress</h3><div class="quest-grid">${inProgressHtml}</div></section>` : ""}
		${completedHtml  ? `<section class="quest-group"><h3>Completed</h3><div class="quest-grid">${completedHtml}</div></section>`   : ""}
		<section class="prestige-section">
			<h3>Permanent Rewards</h3>
			${bonusesHtml}
		</section>
		<div class="prestige-reset-row">
			${warningHtml}
			<button class="prestige-reset-btn" data-action="prestige-reset" ${canReset ? "" : "disabled"}>
				${resetLabel}
			</button>
		</div>`;
}

function _updateQuestBars(panel) {
	for (let i = 0; i < state.quests.active.length; i++) {
		if (state.quests.completed[i]) continue;
		const def = QUEST_POOL.find(q => q.id === state.quests.active[i]);
		if (!def || def.type === "build" || def.type === "unlock") continue;
		const { current, target } = getQuestProgress(def);
		const pct = Math.min(100, Math.floor(current / target * 100));
		const barEl = panel.querySelector(`[data-quest-bar="${def.id}"]`);
		const txtEl = panel.querySelector(`[data-quest-text="${def.id}"]`);
		if (barEl) {
			barEl.setAttribute("aria-valuenow", pct);
			const fill = barEl.querySelector(".quest-bar-fill");
			if (fill) fill.style.width = `${pct}%`;
		}
		if (txtEl) txtEl.textContent = `${formatNum(current)} / ${formatNum(target)}`;
	}
}

function init() {
	load();
	loadPrestige();
	const questPoolIds = new Set(QUEST_POOL.map(q => q.id));
	const hasStaleIds = state.quests.active.some(id => !questPoolIds.has(id));
	if (state.quests.active.length === 0 || hasStaleIds) drawQuests();
	state.lastTick = Date.now();
	for (const bldKey of Object.keys(BUILDING_CONFIG)) {
		if (state.buildings[bldKey].unlocked) addBuildingOption(bldKey);
	}
	const firstBuilt = Object.keys(BUILDING_CONFIG).find(k => state.buildings[k].unlocked);
	runtime.selectedBuilding = firstBuilt ?? null;
	const sel = document.getElementById("building-select");
	if (sel && firstBuilt) sel.value = firstBuilt;
	sel?.addEventListener("change", e => {
		runtime.selectedBuilding = e.target.value || null;
		renderBuildingSection();
	});
	renderAll();
	document.getElementById("app").addEventListener("click", handleClick);
	setInterval(tick, 100);
	setInterval(save, 5000);
}

if (typeof document !== "undefined") {
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", init);
	} else {
		init();
	}
}
if (typeof module !== "undefined") {
	module.exports = { RESOURCES, BUILDING_CONFIG, QUEST_CHAINS, STORAGE_BASE, STORAGE_FIRST_UPGRADE, STORAGE_INCREMENT, STORAGE_BASE_COST, STORAGE_COST_GROWTH };
}
