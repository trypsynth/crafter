"use strict";

const SAVE_KEY = "crafter";

let _questsRenderKey = "";

// Generates the reward label string from a reward object.
function rewardLabel(r) {
	if (r.type === "starting_gold")  return `+${r.amount.toLocaleString()} Starting Gold`;
	if (r.type === "slot_cost_pct")  return `Slot Costs -${r.amount.toLocaleString()}%`;
	if (r.type === "unlock_cost_pct")return `Unlock Costs -${r.amount.toLocaleString()}%`;
	if (r.type === "build_cost_pct") return `Build Costs -${r.amount.toLocaleString()}%`;
	if (r.type === "sell_price_pct") return `Sale Prices +${r.amount.toLocaleString()}%`;
	if (r.type === "storage_tier")   return `+${r.amount.toLocaleString()} Starting Storage Tier${r.amount > 1 ? "s" : ""}`;
	if (r.type === "cycle_speed_pct")return `Production Speed +${r.amount.toLocaleString()}%`;
	if (r.type === "treasure_gold_pct")return `Treasure Gold +${r.amount.toLocaleString()}%`;
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
		{ target: 60, label: "Buy 60 Log Slots", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 100, label: "Buy 100 Log Slots", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 160, label: "Buy 160 Log Slots", reward: { type: "sell_price_pct", amount: 15 } },
	]},
	{ id: "slots_iron_ore", type: "slots", bld: "forge", product: "iron_ore", prereq: "forge", tiers: [
		{ target: 60, label: "Buy 60 Iron Ore Slots", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 100, label: "Buy 100 Iron Ore Slots", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 160, label: "Buy 160 Iron Ore Slots", reward: { type: "sell_price_pct", amount: 15 } },
	]},
	{ id: "slots_timber", type: "slots", bld: "lumber_yard", product: "timber", tiers: [
		{ target: 60, label: "Buy 60 Timber Slots", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 100, label: "Buy 100 Timber Slots", reward: { type: "slot_cost_pct", amount: 15 } },
	]},
	{ id: "total_slots", type: "total_slots", tiers: [
		{ target: 200, label: "Buy 200 Slots Total", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 400, label: "Buy 400 Slots Total", reward: { type: "sell_price_pct", amount: 15 } },
		{ target: 700, label: "Buy 700 Slots Total", reward: { type: "slot_cost_pct", amount: 15 } },
		{ target: 1000, label: "Buy 1,000 Slots Total", reward: { type: "cycle_speed_pct", amount: 15 } },
	]},
	{ id: "build_sawmill", type: "build", bld: "sawmill", tiers: [{ target: 1, label: "Build the Sawmill", reward: { type: "build_cost_pct", amount: 15 } }]},
	{ id: "build_workshop", type: "build", bld: "workshop", prereq: "sawmill", tiers: [{ target: 1, label: "Build the Workshop", reward: { type: "storage_tier", amount: 10 } }]},
	{ id: "build_forge", type: "build", bld: "forge", prereq: "workshop", tiers: [{ target: 1, label: "Build the Forge", reward: { type: "storage_tier", amount: 10 } }]},
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
	{ id: "treasure_chests", type: "treasure", tiers: [
		{ target: 5, label: "Open 5 Treasure Chests", reward: { type: "treasure_gold_pct", amount: 50 } },
		{ target: 10, label: "Open 10 Treasure Chests", reward: { type: "treasure_gold_pct", amount: 50 } },
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
				outputAmt: 3,
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
const STORAGE_COST_GROWTH = 1.1;

const DEFAULT_STATE = (() => ({
	gold: 0,
	lastTick: null,
	inventory: Object.fromEntries(Object.keys(RESOURCES).map(k => [k, 0])),
	storage: { tier: 0 },
	stats: { goldEarned: 0, soldByResource: {}, treasureChestsOpened: 0 },
	treasure: { nextSpawn: Date.now() + 300000 + Math.random() * 600000, activeUntil: 0 },
	quests: { active: [], completed: [], baselines: {}, rerolls: 0 },
	prestige: { 
		runs: 0, 
		rewards: [], 
		completedQuestIds: [], 
		seenBuildings: [],
		accumulatedStats: { goldEarned: 0, soldByResource: {}, storageUpgrades: 0, totalSlots: 0, maxSlotsByProduct: {}, totalSlotsByProduct: {}, treasureChestsOpened: 0 }
	},
	buildings: Object.fromEntries(Object.keys(BUILDING_CONFIG).map(bldKey => {
		const bcfg = BUILDING_CONFIG[bldKey];
		return [bldKey, {
			unlocked: bldKey === "lumber_yard",
			products: Object.fromEntries(Object.keys(bcfg.products).map(pk => {
				const pcfg = bcfg.products[pk];
				return [pk, {
					unlocked: pcfg.startsUnlocked ?? false,
					enabled: true,
					slots: [],
					manual: { active: false, progress: 0 },
				}];
			})),
		}];
	})),
}))();

let state = deepClone(DEFAULT_STATE);

const runtime = {
	nextSlotId: 0,
	stallAnnounced: {},
	selectedBuilding: null,
};

const guiState = {
	hud: {
		gold: null,
		storage: null,
		chain: null,
		inventory: null,
	},
	production: {
		panel: null,
		buildings: {},
	},
	market: {},
	quests: {},
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
	return Object.entries(inputs).map(([k, amt]) => `${amt.toLocaleString()} ${amt === 1 ? RESOURCES[k].singular : RESOURCES[k].label}`).join(", ");
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
	const num = rounded % 1 === 0 ? `${rounded.toLocaleString()}` : rounded.toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 });
	return label ? `${num} ${label} per minute` : `${num} per minute`;
}

function formatProductOutput(slots, outputAmt, baseCycleMs, label = "", brief = false) {
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

function formatDuration(seconds) {
	if (seconds < 60) return `${seconds.toLocaleString()} ${seconds === 1 ? "second" : "seconds"}`;
	const mins = Math.round(seconds / 60);
	if (mins < 60) return `${mins.toLocaleString()} ${mins === 1 ? "minute" : "minutes"}`;
	const hours = Math.round(mins / 60);
	return `${hours.toLocaleString()} ${hours === 1 ? "hour" : "hours"}`;
}

function formatNum(n) {
	return n.toLocaleString();
}

function eligibleQuestPool() {
	const completed = new Set(state.prestige.completedQuestIds);
	const seen = new Set(["lumber_yard", ...state.prestige.seenBuildings]);
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

function isGameComplete() {
	const completed = new Set(state.prestige.completedQuestIds);
	return QUEST_POOL.every(q => completed.has(q.id));
}

function getPrestigeBonus(type) {
	return state.prestige.rewards.filter(r => r.type === type).reduce((s, r) => s + r.amount, 0);
}

function getPrestigeMult(type) {
	const rewards = state.prestige.rewards.filter(r => r.type === type);
	if (type === "sell_price_pct" || type === "cycle_speed_pct" || type === "treasure_gold_pct") return rewards.reduce((m, r) => m * (1 + r.amount / 100), 1);
	return rewards.reduce((m, r) => m * (1 - r.amount / 100), 1);
}

function prestigeSlotCostMult()   {
	return getPrestigeMult("slot_cost_pct");
}

function prestigeSellMult()        {
	return getPrestigeMult("sell_price_pct");
}

function prestigeBuildCostMult()   {
	return getPrestigeMult("build_cost_pct");
}

function prestigeUnlockCostMult()  {
	return getPrestigeMult("unlock_cost_pct");
}

function prestigeSpeedMult()       {
	return getPrestigeMult("cycle_speed_pct");
}

function prestigeTreasureMult()    {
	return getPrestigeMult("treasure_gold_pct");
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
					let cycles = Math.floor(catchupSec / cycleSec) * p.pst.slots.length;
					for (const [inK, inA] of Object.entries(p.pcfg.inputs)) {
						const available = state.inventory[inK] || 0;
						cycles = Math.min(cycles, Math.floor(available / inA));
					}
					// Only cap by storage for net-positive producers; net-neutral/negative producers consume more inputs than they output, so they free up (or preserve) space.
					const inputSum = Object.values(p.pcfg.inputs).reduce((s, n) => s + n, 0);
					const netPerCycle = p.pcfg.outputAmt - inputSum;
					if (netPerCycle > 0) {
						const space = max - currentTotal;
						cycles = Math.min(cycles, Math.floor(space / netPerCycle));
					}
					const gain = cycles * p.pcfg.outputAmt;
					if (gain > 0) {
						state.inventory[p.pk] += gain;
						for (const [inK, inA] of Object.entries(p.pcfg.inputs)) {
							const consumed = cycles * inA;
							state.inventory[inK] -= consumed;
							currentTotal -= consumed;
						}
						currentTotal += gain;
						gained += gain;
					}
				}
				if (gained > 0) setTimeout(() => announce(`Welcome back! Your workers produced ${gained.toLocaleString()} items while you were away.`), 500);
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
			if (runtime.selectedBuilding === bldKey) announce(`${RESOURCES[pcfg.outputKey].label} stalled - storage full.`);
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
				if (runtime.selectedBuilding === bldKey) announce(`${RESOURCES[pcfg.outputKey].label} stalled - need ${formatInputs(pcfg.inputs)}.`);
			}
			return false;
		}
	}
	for (const [inputKey, inputAmt] of Object.entries(pcfg.inputs)) state.inventory[inputKey] -= inputAmt;
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
					for (const [inputKey, inputAmt] of Object.entries(pcfg.inputs)) state.inventory[inputKey] -= inputAmt;
					state.inventory[pcfg.outputKey] += pcfg.outputAmt;
					announce(`${RESOURCES[pcfg.outputKey].singular} produced.`);
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
		announce(`Need ${buildCost.toLocaleString()} gold to build ${cfg.label}.`);
		return;
	}
	state.gold -= buildCost;
	bst.unlocked = true;
	for (const [pk, pcfg] of Object.entries(cfg.products)) {
		if (pcfg.unlockCost === 0 && !pcfg.prereqProduct) bst.products[pk].unlocked = true;
	}
	addBuildingOption(bldKey);
	runtime.selectedBuilding = bldKey;
	const sel = document.getElementById("building-select");
	if (sel) sel.value = bldKey;
	announce(`${cfg.label} built!`);
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
		announce(`Need ${unlockCost.toLocaleString()} gold to unlock ${RESOURCES[pcfg.outputKey].label} production.`);
		return;
	}
	state.gold -= unlockCost;
	pst.unlocked = true;
	announce(`${RESOURCES[pcfg.outputKey].label} production unlocked!`);
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
		announce(`Need ${cost.toLocaleString()} gold to add a slot.`);
		return;
	}
	state.gold -= cost;
	const newSlot = { id: ++runtime.nextSlotId, progress: 0.0 };
	pst.slots.push(newSlot);
	const label = RESOURCES[BUILDING_CONFIG[bldKey].products[productKey].outputKey].label;
	announce(`Slot added. ${label} now has ${pst.slots.length.toLocaleString()} slot${pst.slots.length === 1 ? "" : "s"}.`);
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
	announce(`Slot sold for ${refund.toLocaleString()} gold. ${label} now has ${pst.slots.length.toLocaleString()} slot${pst.slots.length === 1 ? "" : "s"}.`);
	renderAll();
}

function manualProduce(bldKey, productKey) {
	const pcfg = BUILDING_CONFIG[bldKey].products[productKey];
	const pst = state.buildings[bldKey].products[productKey];
	if (pst.manual.active) {
		pst.manual.progress += 0.25;
		return;
	}
	const inputSum = Object.values(pcfg.inputs).reduce((s, n) => s + n, 0);
	const netChange = pcfg.outputAmt - inputSum;
	if (netChange > 0 && totalItems() + netChange > storageMax()) {
		announce("Storage is full.");
		return;
	}
	for (const [inputKey, inputAmt] of Object.entries(pcfg.inputs)) {
		if (state.inventory[inputKey] < inputAmt) {
			announce(`Need ${formatInputs(pcfg.inputs)}.`);
			return;
		}
	}
	pst.manual.active = true;
	pst.manual.progress = 0;
	announce("Crafting started.");
}

function upgradeStorage() {
	const cost = storageUpgradeCost();
	if (state.gold < cost) {
		announce(`Need ${cost.toLocaleString()} gold to expand storage.`);
		return;
	}
	state.gold -= cost;
	state.storage.tier++;
	const newMax = storageMax();
	announce(`Storage expanded to ${newMax.toLocaleString()} items.`);
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
	announce(`Sold everything for ${totalEarned.toLocaleString()} gold.`);
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
	announce(`Sold ${inv.toLocaleString()} ${formatResourceName(resourceKey, inv)} for ${earned.toLocaleString()} gold.`);
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
	announce(`${RESOURCES[outputKey].label} production ${pst.enabled ? "resumed" : "paused"}.`);
	renderAll();
}

function saveNow() {
	save();
	announce("Game saved.");
}

function clearSaveData() {
	if (confirm("Clear all save data and start over? This will reset everything, including prestige rewards.")) {
		localStorage.removeItem(SAVE_KEY);
		state = deepClone(DEFAULT_STATE);
		location.reload();
	}
}

function importSaveFromText() {
	const text = document.getElementById("save-textarea")?.value?.trim();
	if (!text) {
		announce("Nothing to import.");
		return;
	}
	try {
		const json = atob(text);
		const parsed = JSON.parse(json);
		if (parsed && parsed.state && parsed.prestige) {
			const merged = { ...parsed.state, prestige: parsed.prestige };
			localStorage.setItem(SAVE_KEY, JSON.stringify(merged));
		} else {
			localStorage.setItem(SAVE_KEY, json);
		}
		announce("Save imported. Reloading...");
		setTimeout(() => location.reload(), 800);
	} catch (e) {
		announce("Invalid save data.");
	}
}

function announce(msg) {
	const el = document.getElementById("live-announcer");
	if (!el) return;
	el.textContent = msg;
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
	renderTreasure();
	renderHUD();
	renderBuildingSection();
	renderMarketSection();
	renderQuestsSection();
}

function renderHUD() {
	const hud = guiState.hud ??= {};
	const goldText = `${Math.floor(state.gold).toLocaleString()} gold`;
	const goldEl = hud.gold ??= document.getElementById("hud-gold");
	if (goldEl && goldEl.textContent !== goldText) goldEl.textContent = goldText;
	const storageText = `${totalItems().toLocaleString()}/${storageMax().toLocaleString()} items`;
	const storageEl = hud.storage ??= document.getElementById("hud-storage");
	if (storageEl && storageEl.textContent !== storageText) storageEl.textContent = storageText;
	const inventoryEl = hud.inventory ??= document.getElementById("hud-inventory");
	if (inventoryEl) {
		const invText = Object.entries(state.inventory).filter(([, v]) => v > 0).map(([k, v]) => `${v.toLocaleString()} ${formatResourceName(k, v)}`).join(", ");
		if (inventoryEl.textContent !== invText) inventoryEl.textContent = invText;
	}
	const chainEl = hud.chain ??= document.getElementById("hud-chain");
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
	const cycleSpeedMult = prestigeSpeedMult();
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
			const actualCycleMs = pcfg.baseCycleMs / cycleSpeedMult;
			supplyRates[pcfg.outputKey] = (supplyRates[pcfg.outputKey] || 0) + n * pcfg.outputAmt * 60000 / actualCycleMs;
			for (const [inputKey, inputAmt] of Object.entries(pcfg.inputs)) demandRates[inputKey] = (demandRates[inputKey] || 0) + n * inputAmt * 60000 / actualCycleMs;
		}
	}
	const hasChain = Object.keys(demandRates).length > 0;
	const balances = Array.from(new Set([...Object.keys(supplyRates), ...Object.keys(demandRates)])).filter(resourceKey => RESOURCES[resourceKey]).map(resourceKey => ({
		resourceKey,
		supply: supplyRates[resourceKey] || 0,
		demand: demandRates[resourceKey] || 0,
		net: (supplyRates[resourceKey] || 0) - (demandRates[resourceKey] || 0),
	}));
	const deficits = balances.filter(entry => entry.demand > 0 && entry.net < -0.05).sort((a, b) => a.net - b.net);
	const totalDemand = Object.values(demandRates).reduce((sum, value) => sum + value, 0);
	const fulfillment = totalDemand <= 0 ? 0 : balances.filter(entry => entry.demand > 0).reduce((sum, entry) => {
		const coverage = Math.min(entry.supply / entry.demand, 1);
		return sum + (entry.demand * coverage);
	}, 0);
	const efficiencyPct = totalDemand <= 0 ? null : Math.round((fulfillment / totalDemand) * 100);
	return { productRows, hasChain, deficits, balances, efficiencyPct };
}

function bestNextPurchase() {
	const { deficits } = getProductionOverview();
	const deficitMap = {};
	for (const d of deficits) deficitMap[d.resourceKey] = d.net;
	let best = null;
	let bestScore = -Infinity;
	for (const [bk, bst] of Object.entries(state.buildings)) {
		if (!bst.unlocked) continue;
		for (const [pk, pcfg] of Object.entries(BUILDING_CONFIG[bk].products)) {
			if (!bst.products[pk].unlocked) continue;
			const cost = nextSlotCost(bk, pk);
			if (cost <= 0) continue;
			const outputRate = pcfg.outputAmt * 60000 / pcfg.baseCycleMs;
			let score = (outputRate * currentPrice(pcfg.outputKey)) / cost;
			if (deficitMap[pcfg.outputKey] !== undefined) score *= 1 + Math.abs(deficitMap[pcfg.outputKey]);
			if (score > bestScore) {
				bestScore = score;
				best = {
					bldKey: bk, productKey: pk, cost,
					label: RESOURCES[pcfg.outputKey].label,
					isDeficit: deficitMap[pcfg.outputKey] !== undefined,
				};
			}
		}
	}
	return best;
}

function doFixBottleneck() {
	let totalBought = 0;
	for (let i = 0; i < 500; i++) {
		const { deficits } = getProductionOverview();
		if (deficits.length === 0) break;
		let bought = false;
		for (const deficit of deficits) {
			let foundBld = null, foundProd = null;
			outer: for (const [bk, bst] of Object.entries(state.buildings)) {
				if (!bst.unlocked) continue;
				for (const [pk, pcfg] of Object.entries(BUILDING_CONFIG[bk].products)) {
					if (bst.products[pk].unlocked && pcfg.outputKey === deficit.resourceKey) {
						foundBld = bk;
						foundProd = pk;
						break outer;
					}
				}
			}
			if (!foundBld) continue;
			const cost = nextSlotCost(foundBld, foundProd);
			if (state.gold < cost) continue;
			state.gold -= cost;
			state.buildings[foundBld].products[foundProd].slots.push({ id: ++runtime.nextSlotId, progress: 0.0 });
			totalBought++;
			bought = true;
			break;
		}
		if (!bought) break;
	}
	if (totalBought > 0) {
		save();
		renderAll();
		announce(`Bought ${totalBought} slot${totalBought === 1 ? "" : "s"} to fix production bottlenecks.`);
	} else announce("Not enough gold to fix any bottleneck.");
}

function renderChainOverview() {
	const { hasChain, balances } = getProductionOverview();
	if (!hasChain) return "";
	const shortages = balances.filter(b => b.net < -0.05).sort((a, b) => a.net - b.net);
	const surpluses = balances.filter(b => b.net > 0.05).sort((a, b) => b.net - a.net);
	let sentences = [];
	if (shortages.length > 0) {
		const items = shortages.map(b => `<li>${RESOURCES[b.resourceKey].label} (need ${Math.abs(b.net).toFixed(1)}/min more)</li>`).join("");
		sentences.push(`<p class="chain-item-neg">Bottleneck:</p><ul class="chain-item-neg">${items}</ul>`);
	}
	if (surpluses.length > 0) {
		const items = surpluses.map(b => `<li>${RESOURCES[b.resourceKey].label} (+${b.net.toFixed(1)}/min)</li>`).join("");
		sentences.push(`<p class="chain-item-pos">Surplus:</p><ul class="chain-item-pos">${items}</ul>`);
	}
	if (shortages.length === 0 && surpluses.length === 0) sentences.push(`<p>Your production chain is perfectly balanced.</p>`);
	const fixBtn = shortages.length > 0 ? `<button class="chain-fix-btn" data-action="fix-bottleneck">Buy slots to fix bottleneck</button>` : "";
	const suggestion = bestNextPurchase();
	const suggestionHtml = suggestion ? `<p class="chain-suggestion ${suggestion.isDeficit ? "chain-item-neg" : "chain-item-muted"}">${suggestion.isDeficit ? "Suggested fix" : "Best value"}: add a ${suggestion.label} slot (${suggestion.cost.toLocaleString()} gold)</p>` : "";
	return `
		<div class="chain-overview">
			<h3>Production Summary</h3>
			<div class="chain-prose">
				${sentences.join("")}
				${suggestionHtml}
			</div>
			${fixBtn}
		</div>
	`;
}

function renderBuildingSection() {
	const panel = guiState.production.panel ??= document.getElementById("panel-production");
	if (!panel) return;
	const bldKey = runtime.selectedBuilding;
	const nextBldKey = Object.keys(BUILDING_CONFIG).find(k => !state.buildings[k].unlocked && BUILDING_CONFIG[k].prereq());
	let nextHtml = "";
	if (nextBldKey) {
		const ncfg = BUILDING_CONFIG[nextBldKey];
		const ncost = Math.round(ncfg.buildCost * prestigeBuildCostMult());
		nextHtml = `<div class="unlock-section" style="margin-top:0; margin-bottom:var(--space-md)">
			<button class="unlock-product-btn" data-action="build" data-bld="${nextBldKey}" ${state.gold >= ncost ? "" : "disabled"}>
				Build ${ncfg.label} (${ncost === 0 ? "Free" : ncost.toLocaleString() + " gold"})
			</button>
		</div>`;
	}
	const cfg = BUILDING_CONFIG[bldKey];
	const bst = state.buildings[bldKey];
	const unlockedProducts = Object.entries(cfg.products).filter(([pk]) => bst.products[pk].unlocked);
	const unlockedCards = unlockedProducts.map(([productKey, pcfg]) => {
		const card = new BuildingProductCard();
		card.bld = bldKey;
		card.product = productKey;
		const pst = bst.products[productKey];
		card.paused = !pst.enabled;
		const res = RESOURCES[pcfg.outputKey];
		card.label = res.label;
		card.singular = res.singular;
		const slotCost = nextSlotCost(bldKey, productKey);
		card.slotCost = slotCost;
		card.addSlotDisabled = state.gold < slotCost;
		const n = pst.slots.length;
		card.toggleProductionHidden = n === 0;
		card.sellSlotDisabled = n === 0;
		card.cycleFmt = formatProductOutput(1, pcfg.outputAmt, pcfg.baseCycleMs, pcfg.outputKey, true);
		card.summary = n === 0 ? "No slots yet." : `${n.toLocaleString()} ${n === 1 ? "slot" : "slots"}, ${formatProductOutput(n, pcfg.outputAmt, pcfg.baseCycleMs, pcfg.outputKey)}`;
		card.inputs = formatInputs(Object.fromEntries(Object.entries(pcfg.inputs).map(([k, v]) => [k, v * Math.max(1, n)])));
		card.saleAmt = Math.floor(lastSlotCost(bldKey, productKey) * 0.5);
		return card;
	});
	const unlockables = Object.entries(cfg.products).filter(([pk, pcfg]) => !bst.products[pk].unlocked && (!pcfg.prereqProduct || bst.products[pcfg.prereqProduct].unlocked));
	const unlockHtml = unlockables.length === 0 ? "" : `<section class="unlock-group">
		<h3>Unlockable Products</h3>
		<div class="unlock-section">
			${unlockables.map(([pk, pcfg]) => {
				const res = RESOURCES[pcfg.outputKey];
				const unlockCost = Math.round(pcfg.unlockCost * prestigeUnlockCostMult());
				return `<button class="unlock-product-btn" data-action="unlock-product" data-bld="${bldKey}" data-product="${pk}" ${state.gold >= unlockCost ? "" : "disabled"}>
					Unlock ${res.label} for ${unlockCost.toLocaleString()} gold
				</button>`;
			}).join("")}
		</div>
	</section>`;
	const chainHtml = renderChainOverview();
	const productsSection = document.createElement("section");
	productsSection.className = "product-group";
	const h3 = document.createElement("h3");
	h3.textContent = "Products";
	productsSection.append(h3, ...unlockedCards);
	panel.innerHTML = `${nextHtml}${productsSection.outerHTML}${unlockHtml}${chainHtml}`;
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
		const label = `${used.toLocaleString()} / ${max.toLocaleString()} items (${pct}% full)`;
		if (usedLabel.textContent !== label) usedLabel.textContent = label;
	}
	const withStock = Object.keys(RESOURCES).filter(k => state.inventory[k] > 0);
	const hasStock = withStock.length > 0;
	const totalValue = withStock.reduce((sum, k) => sum + state.inventory[k] * currentPrice(k), 0);
	const sellAllBtn = panel.querySelector("[data-action='sell-all']");
	if (sellAllBtn) {
		sellAllBtn.hidden = !hasStock;
		if (hasStock) sellAllBtn.textContent = `Sell Everything for ${totalValue.toLocaleString()} gold`;
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
		if (stockEl) stockEl.textContent = `${inv.toLocaleString()} in stock, ${price.toLocaleString()} gold each`;
		const sellBtn = card.querySelector(".sell-btn");
		if (sellBtn) {
			sellBtn.disabled = !hasItem;
			sellBtn.textContent = `Sell All ${res.label} for ${earned.toLocaleString()} gold`;
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
	const upgHtml = `<button data-action="storage-upgrade" ${state.gold >= cost ? "" : "disabled"}>Expand Storage: ${max} to ${next} items for ${cost} gold</button>`;
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
			<button class="sell-btn" data-action="sell" data-resource="${resourceKey}"${hasItem ? "" : " disabled"}>Sell All ${res.label} for ${earned} gold</button>
		</div>`;
	}).join("");
	panel.innerHTML = `<div class="storage-info">
		<div class="storage-bar-wrap" role="progressbar" aria-label="Storage used" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
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
	const saveText = btoa(JSON.stringify(state));
	if (panel.firstChild) {
		const ta = panel.querySelector("#save-textarea");
		if (ta && document.activeElement !== ta) ta.value = saveText;
		return;
	}
	panel.innerHTML = `<section class="settings-section">
		<h3>Save</h3>
		<button data-action="save-now" style="margin-bottom:var(--space-sm)">Save Now</button>
		<textarea id="save-textarea" class="save-textarea" rows="5" spellcheck="false" autocomplete="off" aria-label="Save data">${saveText}</textarea>
		<div class="settings-row" style="margin-top:var(--space-sm)">
			<button data-action="import-save-text">Import</button>
			<button data-action="clear-save">Clear Save</button>
		</div>
	</section>`;
}

function getTreasureBaseValue() {
	let maxPrice = 5;
	for (const bldKey in BUILDING_CONFIG) {
		const bst = state.buildings[bldKey];
		if (!bst?.unlocked) continue;
		for (const prodKey in BUILDING_CONFIG[bldKey].products) {
			const pst = bst.products[prodKey];
			if (!pst?.unlocked) continue;
			const price = RESOURCES[BUILDING_CONFIG[bldKey].products[prodKey].outputKey].price;
			if (price > maxPrice) maxPrice = price;
		}
	}
	return maxPrice * 100 * (1 + (state.prestige?.runs ?? 0));
}

function handleOpenTreasure() {
	if (!state.treasure.activeUntil || Date.now() > state.treasure.activeUntil) return;
	const base = getTreasureBaseValue();
	const bonus = prestigeTreasureMult();
	const amount = Math.round(base * bonus);
	state.gold += amount;
	state.stats.goldEarned += amount;
	state.stats.treasureChestsOpened++;
	state.treasure.activeUntil = 0;
	announce(`Opened treasure chest for ${amount.toLocaleString()} gold!`);
	renderAll();
}

function renderTreasure() {
	const container = document.getElementById("treasure-container");
	if (!container) return;
	const now = Date.now();
	if (state.treasure.activeUntil > now) {
		if (!container.querySelector("button")) {
			const btn = document.createElement("button");
			btn.className = "treasure-btn";
			btn.dataset.action = "open-treasure";
			btn.textContent = "Open Treasure Chest!";
			container.appendChild(btn);
		}
	} else container.innerHTML = "";
}

function tick() {
	const now = Date.now();
	const delta = (now - state.lastTick) / 1000;
	state.lastTick = now;
	if (state.treasure.activeUntil && now > state.treasure.activeUntil) {
		state.treasure.activeUntil = 0;
		renderTreasure();
	}
	if (!state.treasure.activeUntil && now > state.treasure.nextSpawn) {
		const duration = 10000 + Math.random() * 20000;
		state.treasure.activeUntil = now + duration;
		state.treasure.nextSpawn = now + 300000 + Math.random() * 600000;
		announce(`Treasure chest spawned, active for ${Math.round(duration/1000)} seconds!`);
		renderTreasure();
	}
	try {
		advanceBuildings(delta);
	} catch (e) {
		console.error("advanceBuildings:", e);
	}
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
		case "open-treasure":
			handleOpenTreasure();
			break;
		case "build":
			unlockBuilding(bld);
			break;
		case "unlock-product":
			unlockProduct(bld, product);
			break;
		case "add-slot":
			addSlot(bld, product);
			break;
		case "sell-slot":
			sellSlot(bld, product);
			break;
		case "manual-produce":
			manualProduce(bld, product);
			break;
		case "storage-upgrade":
			upgradeStorage();
			break;
		case "sell":
			sellProduct(btn.dataset.resource);
			break;
		case "sell-all":
			sellAll();
			break;
		case "toggle-product":
			toggleProductEnabled(bld, product);
			break;
		case "fix-bottleneck":
			doFixBottleneck();
			break;
		case "reroll-quest":
			rerollQuest(+btn.dataset.index);
			break;
		case "prestige-reset":
			doPrestigeReset();
			break;
		case "save-now":
			saveNow();
			break;
		case "import-save-text":
			importSaveFromText();
			break;
		case "clear-save":
			clearSaveData();
			break;
		case "victory-keep-playing":
			state.prestige.victoryShown = true;
			save();
			document.getElementById("victory-overlay").hidden = true;
			break;
		case "victory-new-game":
			doVictoryNewGame();
			break;
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

function flushSatisfiedQuests() {
	const completed = new Set(state.prestige.completedQuestIds);
	const seen = new Set(["lumber_yard", ...state.prestige.seenBuildings]);
	let changed = false;
	for (const chain of QUEST_CHAINS) {
		if (chain.prereq && !seen.has(chain.prereq)) continue;
		for (let i = 0; i < chain.tiers.length; i++) {
			const questId = `${chain.id}_t${i}`;
			if (completed.has(questId)) continue;
			const q = QUEST_POOL.find(e => e.id === questId);
			if (!q) break;
			const { current, target } = getQuestProgress(q);
			if (current >= target) {
				state.prestige.completedQuestIds.push(questId);
				state.prestige.rewards.push(q.reward);
				completed.add(questId);
				changed = true;
			} else break;
		}
	}
	if (changed) save();
}

const BASELINE_QUEST_TYPES = new Set(["sell", "slots", "total_slots", "gold_earned", "storage", "treasure"]);

function rerollCost() {
	return Math.round(250 * Math.pow(2, state.quests.rerolls ?? 0));
}

function rerollQuest(index) {
	const cost = rerollCost();
	if (state.gold < cost) {
		announce(`Need ${cost.toLocaleString()} gold to reroll.`);
		return;
	}
	const pool = eligibleQuestPool();
	const keepIds = new Set(state.quests.active.filter((_, i) => i !== index));
	const available = pool.filter(q => !keepIds.has(q.id) && q.id !== state.quests.active[index]).sort(() => Math.random() - 0.5);
	if (available.length === 0) {
		announce("No other quests available to reroll into.");
		return;
	}
	state.gold -= cost;
	const oldId = state.quests.active[index];
	const newQuest = available[0];
	const newBaselines = { ...state.quests.baselines };
	delete newBaselines[oldId];
	newBaselines[newQuest.id] = BASELINE_QUEST_TYPES.has(newQuest.type) ? getQuestProgress(newQuest).current : 0;
	state.quests.active[index] = newQuest.id;
	state.quests.completed[index] = false;
	state.quests.baselines = newBaselines;
	state.quests.rerolls = (state.quests.rerolls ?? 0) + 1;
	_questsRenderKey = "";
	renderAll();
	announce(`Quest rerolled for ${cost.toLocaleString()} gold.`);
}

function drawQuests() {
	flushSatisfiedQuests();
	const currentActive = state.quests.active || [];
	const currentCompleted = state.quests.completed || [];
	const currentBaselines = state.quests.baselines || {};
	const newActive = [];
	const newCompleted = [];
	const newBaselines = {};
	for (let i = 0; i < currentActive.length; i++) {
		if (!currentCompleted[i]) {
			const id = currentActive[i];
			newActive.push(id);
			newCompleted.push(false);
			if (currentBaselines[id] !== undefined) newBaselines[id] = currentBaselines[id];
		}
	}
	const pool = eligibleQuestPool();
	const existingIds = new Set(newActive);
	const available = pool.filter(q => !existingIds.has(q.id)).sort(() => Math.random() - 0.5);
	while (newActive.length < 5 && available.length > 0) {
		const q = available.shift();
		newActive.push(q.id);
		newCompleted.push(false);
		newBaselines[q.id] = BASELINE_QUEST_TYPES.has(q.type) ? getQuestProgress(q).current : 0;
	}
	state.quests.active = newActive;
	state.quests.completed = newCompleted;
	state.quests.baselines = newBaselines;
}

function getQuestProgress(def, baseline = 0) {
	let raw;
	switch (def.type) {
		case "treasure":
			raw = (state.prestige.accumulatedStats.treasureChestsOpened ?? 0) + (state.stats.treasureChestsOpened ?? 0);
			break;
		case "sell": {
			const current = state.stats.soldByResource[def.resource] ?? 0;
			raw = (state.prestige.accumulatedStats.soldByResource[def.resource] ?? 0) + current;
			break;
		}
		case "slots": {
			const current = state.buildings[def.bld]?.products[def.product]?.slots.length ?? 0;
			const key = `${def.bld}.${def.product}`;
			const totalPrev = (state.prestige.accumulatedStats.totalSlotsByProduct?.[key] ?? state.prestige.accumulatedStats.maxSlotsByProduct?.[key] ?? 0);
			raw = totalPrev + current;
			break;
		}
		case "total_slots": {
			raw = state.prestige.accumulatedStats.totalSlots;
			for (const bst of Object.values(state.buildings))
				for (const pst of Object.values(bst.products)) raw += pst.slots.length;
			break;
		}
		case "build":
			raw = state.buildings[def.bld]?.unlocked ? 1 : 0;
			break;
		case "unlock":
			raw = state.buildings[def.bld]?.products[def.product]?.unlocked ? 1 : 0;
			break;
		case "storage":
			raw = state.prestige.accumulatedStats.storageUpgrades + state.storage.tier;
			break;
		case "gold_earned":
			raw = state.prestige.accumulatedStats.goldEarned + state.stats.goldEarned;
			break;
		default:
			raw = 0;
	}
	return { current: Math.max(0, raw - baseline), target: def.target };
}

function checkQuestCompletion() {
	if (!state.quests.active.length) return;
	for (let i = 0; i < state.quests.active.length; i++) {
		if (state.quests.completed[i]) continue;
		const id = state.quests.active[i];
		const def = QUEST_POOL.find(q => q.id === id);
		if (!def) continue;
		const baseline = BASELINE_QUEST_TYPES.has(def.type) ? (state.quests.baselines?.[id] ?? 0) : 0;
		const { current, target } = getQuestProgress(def, baseline);
		if (current >= target) {
			state.quests.completed[i] = true;
			announce(`Quest complete: ${def.label}!`);
		}
	}
}

function doPrestigeReset() {
	const totalActive = state.quests.active.length;
	const completedCount = state.quests.completed.filter(Boolean).length;
	if (completedCount === 0) return;
	const incomplete = totalActive - completedCount;
	const msg = incomplete > 0 ? `Reset with ${completedCount}/${totalActive} quests complete?\n\nYou'll miss ${incomplete} reward${incomplete === 1 ? "" : "s"}. You can always keep playing to finish them.` : "All quests complete! Reset and claim your rewards?";
	if (!confirm(msg)) return;
	for (const [bk, bst] of Object.entries(state.buildings)) if (bst.unlocked && !state.prestige.seenBuildings.includes(bk)) state.prestige.seenBuildings.push(bk);
	for (let i = 0; i < state.quests.active.length; i++) {
		if (!state.quests.completed[i]) continue;
		const qid = state.quests.active[i];
		const def = QUEST_POOL.find(q => q.id === qid);
		if (def) {
			state.prestige.rewards.push(def.reward);
			if (!state.prestige.completedQuestIds.includes(qid)) state.prestige.completedQuestIds.push(qid);
		}
	}
	state.prestige.runs++;
	state.prestige.accumulatedStats.goldEarned += state.stats.goldEarned;
	state.prestige.accumulatedStats.storageUpgrades += state.storage.tier;
	state.prestige.accumulatedStats.treasureChestsOpened += (state.stats.treasureChestsOpened ?? 0);
	for (const [bk, bst] of Object.entries(state.buildings)) {
		for (const [pk, pst] of Object.entries(bst.products)) {
			state.prestige.accumulatedStats.totalSlots += pst.slots.length;
			const key = `${bk}.${pk}`;
			state.prestige.accumulatedStats.maxSlotsByProduct[key] = Math.max(state.prestige.accumulatedStats.maxSlotsByProduct[key] ?? 0, pst.slots.length);
			state.prestige.accumulatedStats.totalSlotsByProduct[key] = (state.prestige.accumulatedStats.totalSlotsByProduct[key] ?? 0) + pst.slots.length;
		}
	}
	for (const [k, v] of Object.entries(state.stats.soldByResource)) state.prestige.accumulatedStats.soldByResource[k] = (state.prestige.accumulatedStats.soldByResource[k] ?? 0) + v;
	const incompleteActive = state.quests.active.filter((_, i) => !state.quests.completed[i]);
	const incompleteBaselines = {};
	for (const id of incompleteActive) if (state.quests.baselines?.[id] !== undefined) incompleteBaselines[id] = state.quests.baselines[id];
	const preservedPrestige = state.prestige;
	state = deepClone(DEFAULT_STATE);
	state.prestige = preservedPrestige;
	state.quests.active = incompleteActive;
	state.quests.completed = new Array(incompleteActive.length).fill(false);
	state.quests.baselines = incompleteBaselines;
	state.gold = getPrestigeBonus("starting_gold");
	state.lastTick = Date.now();
	runtime.nextSlotId = 0;
	runtime.stallAnnounced = {};
	runtime.selectedBuilding = "lumber_yard";
	const sel = document.getElementById("building-select");
	if (sel) {
		sel.innerHTML = "";
		addBuildingOption("lumber_yard");
		sel.value = "lumber_yard";
	}
	const prodPanel = document.getElementById("panel-production");
	if (prodPanel) prodPanel.innerHTML = "";
	_questsRenderKey = "";
	drawQuests();
	save();
	renderAll();
	announce(`Run ${(state.prestige.runs + 1).toLocaleString()} started! ${completedCount.toLocaleString()} reward${completedCount === 1 ? "" : "s"} earned.`);
	if (isGameComplete() && !state.prestige.victoryShown) showVictoryScreen();
}

function computePrestigeSummary() {
	const defs = [
		{ type: "starting_gold",  fmt: n => `+${n.toLocaleString()} Starting Gold`       },
		{ type: "slot_cost_pct",  isMult: true, isDiscount: true, fmt: n => `Slot Costs -${n.toLocaleString()}%`                          },
		{ type: "unlock_cost_pct",isMult: true, isDiscount: true, fmt: n => `Unlock Costs -${n.toLocaleString()}%`                        },
		{ type: "build_cost_pct", isMult: true, isDiscount: true, fmt: n => `Build Costs -${n.toLocaleString()}%`                         },
		{ type: "sell_price_pct", isMult: true, isDiscount: false, fmt: n => `Sale Prices +${n.toLocaleString()}%`                         },
		{ type: "storage_tier",   fmt: n => `+${n.toLocaleString()} Starting Storage Tier${n > 1 ? "s" : ""}` },
		{ type: "cycle_speed_pct",isMult: true, isDiscount: false, fmt: n => `Production Speed +${n.toLocaleString()}%`                    },
		{ type: "treasure_gold_pct",isMult: true, isDiscount: false, fmt: n => `Treasure Gold +${n.toLocaleString()}%`                    },
	];
	return defs.map(d => {
		if (d.isMult) {
			const mult = getPrestigeMult(d.type);
			const val = d.isDiscount ? Math.round((1 - mult) * 100) : Math.round((mult - 1) * 100);
			return val > 0 ? d.fmt(val) : null;
		} else {
			const total = getPrestigeBonus(d.type);
			return total > 0 ? d.fmt(total) : null;
		}
	}).filter(Boolean);
}

function showVictoryScreen() {
	const el = document.getElementById("victory-overlay");
	if (!el) return;
	const runs = state.prestige.runs;
	const totalGold = Math.floor(state.prestige.accumulatedStats.goldEarned + state.stats.goldEarned);
	const victories = state.prestige.victoryCount ?? 0;
	const bonuses = computePrestigeSummary();
	const statsLines = [
		`Prestige Runs: ${runs.toLocaleString()}`,
		`Total Gold Earned: ${totalGold.toLocaleString()}`,
		victories > 0 ? `Times Conquered: ${victories.toLocaleString()}` : null,
	].filter(Boolean);
	const bonusesHtml = bonuses.length > 0
		? `<div>
			<p class="victory-bonuses-title">Permanent Bonuses Earned</p>
			<ul class="victory-bonus-list">${bonuses.map(b => `<li>${b}</li>`).join("")}</ul>
		</div>`
		: "";
	el.innerHTML = `
		<div id="victory-content">
			<h2 id="victory-title">Empire Complete!</h2>
			<p class="victory-subtitle">From humble logs to mighty dreadnoughts, you have forged an industrial legacy that spans the ages. The world bows to your craft.</p>
			<div class="victory-stats">${statsLines.map(s => `<p>${s}</p>`).join("")}</div>
			${bonusesHtml}
			<div class="victory-actions">
				<button class="victory-keep-btn" data-action="victory-keep-playing">Keep Playing</button>
				<button class="victory-new-game-btn" data-action="victory-new-game">New Legacy</button>
			</div>
		</div>
	`;
	el.hidden = false;
	el.querySelector("[data-action='victory-new-game']")?.focus();
	announce("Victory! You have conquered all challenges and built the mightiest empire!");
}

function doVictoryNewGame() {
	if (!confirm("Start a brand new game? All progress and prestige rewards will be reset.")) return;
	const victoryCount = (state.prestige.victoryCount ?? 0) + 1;
	state = deepClone(DEFAULT_STATE);
	state.prestige.victoryCount = victoryCount;
	runtime.nextSlotId = 0;
	runtime.stallAnnounced = {};
	runtime.selectedBuilding = "lumber_yard";
	const sel = document.getElementById("building-select");
	if (sel) {
		sel.innerHTML = "";
		addBuildingOption("lumber_yard");
		sel.value = "lumber_yard";
	}
	document.getElementById("victory-overlay").hidden = true;
	document.getElementById("panel-production").innerHTML = "";
	_questsRenderKey = "";
	drawQuests();
	save();
	renderAll();
	announce("New legacy begun!");
}

function renderQuestsSection() {
	const panel = document.getElementById("panel-quests");
	if (!panel) return;
	const summaryH2 = document.querySelector("#section-quests > summary h2");
	if (summaryH2) summaryH2.textContent = `Quests : Run ${(state.prestige.runs + 1).toLocaleString()}`;
	const structKey = state.quests.active.join(",") + ":" + state.quests.completed.map(Number).join(",") + ":" + state.prestige.runs;
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
		const baseline = BASELINE_QUEST_TYPES.has(def.type) ? (state.quests.baselines?.[id] ?? 0) : 0;
		const { current, target } = getQuestProgress(def, baseline);
		const done = state.quests.completed[i];
		const isBoolean = def.type === "build" || def.type === "unlock";
		const pct = isBoolean ? (done ? 100 : 0) : Math.min(100, Math.floor(current / target * 100));
		const progressRow = done ? "" : isBoolean
			? `<div class="quest-progress-row"><span class="quest-prog-text">Not yet</span></div>`
			: `<div class="quest-progress-row">
				<div class="quest-bar-wrap" role="progressbar" data-quest-bar="${id}" aria-label="quest progress" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}">
					<div class="quest-bar-fill" style="width:${pct}%"></div>
				</div>
				<span class="quest-prog-text" data-quest-text="${id}">${formatNum(current)} / ${formatNum(target)}</span>
			</div>`;
		const rerollBtn = done ? "" : (() => {
			const cost = rerollCost();
			return `<button class="reroll-quest-btn" data-action="reroll-quest" data-index="${i}" ${state.gold >= cost ? "" : "disabled"}>Reroll (${cost.toLocaleString()} gold)</button>`;
		})();
		return `<div class="quest-card${done ? " quest-done" : ""}">
			<h4 class="quest-title">${def.label}</h4>
			<p class="quest-reward-label">Reward: ${def.rewardLabel}</p>
			${progressRow}
			${rerollBtn}
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
		const id = state.quests.active[i];
		const def = QUEST_POOL.find(q => q.id === id);
		if (!def || def.type === "build" || def.type === "unlock") continue;
		const baseline = BASELINE_QUEST_TYPES.has(def.type) ? (state.quests.baselines?.[id] ?? 0) : 0;
		const { current, target } = getQuestProgress(def, baseline);
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
	const cost = rerollCost();
	const canAfford = state.gold >= cost;
	for (const btn of panel.querySelectorAll(".reroll-quest-btn")) btn.disabled = !canAfford;
}

function init() {
	window.customElements.define("building-product-card", BuildingProductCard);
	load();
	const questPoolIds = new Set(QUEST_POOL.map(q => q.id));
	const hasStaleIds = state.quests.active.some(id => !questPoolIds.has(id));
	if (state.quests.active.length === 0 || hasStaleIds) drawQuests();
	state.lastTick = Date.now();
	for (const bldKey of Object.keys(BUILDING_CONFIG)) if (state.buildings[bldKey].unlocked) addBuildingOption(bldKey);
	const firstBuilt = Object.keys(BUILDING_CONFIG).find(k => state.buildings[k].unlocked);
	runtime.selectedBuilding = firstBuilt ?? null;
	const sel = document.getElementById("building-select");
	if (sel && firstBuilt) sel.value = firstBuilt;
	sel?.addEventListener("change", e => {
		runtime.selectedBuilding = e.target.value || null;
		renderBuildingSection();
	});
	renderAll();
	document.addEventListener("click", handleClick);
	setInterval(tick, 100);
	setInterval(save, 5000);
	if (isGameComplete() && !state.prestige.victoryShown) showVictoryScreen();
}

if (typeof document !== "undefined") {
	if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
	else init();
}

class BuildingProductCard extends HTMLElement{
	#label;
	#status;
	#inputs;
	#singular;
	#toggleProduction;
	#summary;
	#slotCost;
	#addSlot;
	#saleAmt;
	#sellSlot;
	#wantsBldAndProduct = new Set();
	#wantsCycleFmt = new Set();
	
	constructor() {
		super();
	}
	
	connectedCallback() {
		this.className = "product-section";
		const header = document.createElement("div");
		header.className = "product-header";
		const title = document.createElement("h4");
		this.#label = title;
		title.className = "product-title";
		title.textContent = this.getAttribute("label") ?? "Product";
		const status = document.createElement("span");
		this.#status = status;
		status.style.fontSize = "var(--font-sm)";
		header.append(title, status)
		const inputDesc = document.createElement("p");
		inputDesc.className = "product-inputs";
		const inputs = document.createTextNode("");
		this.#inputs = inputs;
		inputDesc.append("Requires ", inputs, " per cycle");
		const manualProduceRow = document.createElement("div");
		manualProduceRow.className = "manual-produce-row";
		const manualProduce = document.createElement("button");
		this.#wantsBldAndProduct.add(manualProduce);
		manualProduce.className = "manual-produce-btn";
		manualProduce.dataset.action = "manual-produce";
		const singular = document.createTextNode(this.getAttribute("singular") ?? "Product");
		this.#singular = singular;
		manualProduce.append("Produce ", singular);
		const toggleProduction = document.createElement("button");
		this.#wantsBldAndProduct.add(toggleProduction);
		this.#toggleProduction = toggleProduction;
		toggleProduction.className = "toggle-product-btn";
		toggleProduction.dataset.action = "toggle-product";
		toggleProduction.hidden = this.getAttribute("toggle-production-hidden") !== null;
		manualProduceRow.append(manualProduce, toggleProduction);
		const summary = document.createElement("p");
		this.#summary = summary;
		summary.className = "slot-summary";
		summary.textContent = this.getAttribute("summary") ?? "Summary";
		const addSlot = document.createElement("button");
		this.#addSlot = addSlot;
		this.#wantsBldAndProduct.add(addSlot);
		addSlot.className = "add-slot-btn";
		addSlot.dataset.action = "add-slot";
		addSlot.disabled = this.getAttribute("add-slot-disabled") !== null;
		const slotCost = document.createTextNode(this.getAttribute("slot-cost") ?? "∞");
		this.#slotCost = slotCost;
		let cycleFmt = document.createTextNode(this.getAttribute("cycle-fmt") ?? "?");
		this.#wantsCycleFmt.add(cycleFmt);
		addSlot.append("Add Slot for ", slotCost, " gold (+", cycleFmt, ")");
		const sellSlot = document.createElement("button");
		this.#sellSlot = sellSlot;
		this.#wantsBldAndProduct.add(sellSlot);
		sellSlot.className = "sell-slot-btn";
		sellSlot.dataset.action = "sell-slot";
		sellSlot.disabled = this.getAttribute("sell-slot-disabled") !== null;
		const saleAmt = document.createTextNode(this.getAttribute("sale-amt") ?? "0");
		this.#saleAmt = saleAmt;
		cycleFmt = cycleFmt.cloneNode(true);
		this.#wantsCycleFmt.add(cycleFmt);
		sellSlot.append("Sell Slot for ", saleAmt, " gold (-", cycleFmt, ")");
		const bld = this.getAttribute("bld");
		if (bld !== null) this.#setBldKey(bld);
		const product = this.getAttribute("product");
		if (product !== null) this.#setProductKey(product);
		this.#setStatus(this.getAttribute("paused"));
		this.#setInputs(this.getAttribute("inputs"));
		this.replaceChildren(header, inputDesc, manualProduceRow, summary, addSlot, sellSlot);
	}
	
	static get observedAttributes() {
		return ["label", "singular", "bld", "product", "slot-cost", "sale-amt", "cycle-fmt", "paused", "summary", "inputs", "toggle-production-hidden", "add-slot-disabled", "sell-slot-disabled"];
	}
	
	attributeChangedCallback(name, oldValue, newValue) {
		if (oldValue === newValue) return;
		switch(name) {
			case "label":
				if (this.#label) this.#label.textContent = newValue;
				break;
			case "singular":
				if (this.#singular) this.#singular.textContent = newValue;
				break;
			case "bld":
				this.#setBldKey(newValue);
				break;
			case "product":
				this.#setProductKey(newValue);
				break;
			case "slot-cost":
				if (this.#slotCost) this.#slotCost.textContent = newValue;
				break;
			case "sale-amt":
				if (this.#saleAmt) this.#saleAmt.textContent = newValue;
				break;
			case "cycle-fmt":
				this.#setCycleFmt(newValue);
				break;
			case "paused":
				this.#setStatus(newValue);
				break;
			case "summary":
				if (this.#summary) this.#summary.textContent = newValue;
				break;
			case "inputs":
				this.#setInputs(newValue);
				break;
			case "toggle-production-hidden":
				if (this.#toggleProduction) this.#toggleProduction.hidden = newValue !== null;
				break;
			case "add-slot-disabled":
				if (this.#addSlot) this.#addSlot.disabled = newValue !== null;
				break;
			case "sell-slot-disabled":
				if (this.#sellSlot) this.#sellSlot.disabled = newValue !== null;
				break;
		}
	}
	
	set label(value) { this.setAttribute("label", value); }
	set singular(value) { this.setAttribute("singular", value); }
	set bld(value) { this.setAttribute("bld", value); }
	set product(value) { this.setAttribute("product", value); }
	set slotCost(value) { this.setAttribute("slot-cost", value); }
	set saleAmt(value) { this.setAttribute("sale-amt", value); }
	set cycleFmt(value) { this.setAttribute("cycle-fmt", value); }
	set summary(value) { this.setAttribute("summary", value); }
	set paused(value) { this.#setBooleanAttribute("paused", value); }
	set toggleProductionHidden(value) { this.#setBooleanAttribute("toggle-production-hidden", value); }
	set addSlotDisabled(value) { this.#setBooleanAttribute("add-slot-disabled", value); }
	set sellSlotDisabled(value) { this.#setBooleanAttribute("sell-slot-disabled", value); }
	set inputs(value) {
		if (value) this.setAttribute("inputs", value);
		else this.removeAttribute("inputs");
	}
	
	#setBooleanAttribute(attribute, value) {
		if (value) this.setAttribute(attribute, "");
		else this.removeAttribute(attribute);
	}
	
	#setDatasetMany(els, key, value) {
		for (const el of els) {
			el.dataset[key] = value;
		}
	}
	#setBldKey(value) { this.#setDatasetMany(this.#wantsBldAndProduct, "bld", value); }
	#setProductKey(value) { this.#setDatasetMany(this.#wantsBldAndProduct, "product", value); }
	
	#setCycleFmt(value) {
		for (const el of this.#wantsCycleFmt) {
			el.textContent = value;
		}
	}
	
	#setStatus(value) {
		if (!this.#status || !this.#toggleProduction) return;
		let statusClass, statusText, toggleText, force;
		if (value === null) {
			statusClass = "health-ok";
			statusText = "Active";
			toggleText = "Pause";
			force = false;
		} else {
			statusClass =  "health-warn";
			statusText = "Paused";
			toggleText = "Resume";
			force = true;
		}
		this.#status.textContent = statusText;
		this.#status.className = statusClass;
		this.#toggleProduction.textContent = toggleText;
		this.#toggleProduction.classList.toggle("paused", force);
	}
	
	#setInputs(value) {
		if (!this.#inputs || !this.#inputs.parentElement) return;
		if (value === null) {
			this.#inputs.parentElement.hidden = true
			this.#inputs.textContent = "";
		} else {
			this.#inputs.textContent = value;
			this.#inputs.parentElement.hidden = false;
		}
	}
}
