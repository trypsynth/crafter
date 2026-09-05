import type { QuestChain, QuestDef, Reward } from "../core/types.ts";

// Generates the reward label string from a reward object.
export function rewardLabel(r: Reward): string {
	if (r.type === "starting_gold") return `+${r.amount.toLocaleString()} Starting Gold`;
	if (r.type === "slot_cost_pct") return `Slot Costs -${r.amount.toLocaleString()}%`;
	if (r.type === "unlock_cost_pct") return `Unlock Costs -${r.amount.toLocaleString()}%`;
	if (r.type === "build_cost_pct") return `Build Costs -${r.amount.toLocaleString()}%`;
	if (r.type === "sell_price_pct") return `Sale Prices +${r.amount.toLocaleString()}%`;
	if (r.type === "storage_tier") return `+${r.amount.toLocaleString()} Starting Storage Tier${r.amount > 1 ? "s" : ""}`;
	if (r.type === "cycle_speed_pct") return `Production Speed +${r.amount.toLocaleString()}%`;
	if (r.type === "treasure_gold_pct") return `Treasure Gold +${r.amount.toLocaleString()}%`;
	return "";
}

// Each chain has ordered tiers. Completing a tier unlocks the next one. The active quest pool is drawn from the current frontier of each chain.
// prereq: building key that must appear in prestige.seenBuildings before this chain is offered.
export const QUEST_CHAINS: QuestChain[] = [
	{
		id: "sell_logs",
		type: "sell",
		resource: "logs",
		tiers: [
			{ target: 400, label: "Sell 400 Logs", reward: { type: "slot_cost_pct", amount: 10 } },
			{ target: 1000, label: "Sell 1,000 Logs", reward: { type: "sell_price_pct", amount: 10 } },
			{ target: 3000, label: "Sell 3,000 Logs", reward: { type: "slot_cost_pct", amount: 15 } },
			{ target: 8000, label: "Sell 8,000 Logs", reward: { type: "slot_cost_pct", amount: 10 } },
		],
	},
	{
		id: "sell_timber",
		type: "sell",
		resource: "timber",
		tiers: [
			{ target: 200, label: "Sell 200 Timber", reward: { type: "sell_price_pct", amount: 10 } },
			{ target: 600, label: "Sell 600 Timber", reward: { type: "slot_cost_pct", amount: 10 } },
			{ target: 2000, label: "Sell 2,000 Timber", reward: { type: "unlock_cost_pct", amount: 15 } },
		],
	},
	{
		id: "sell_dowels",
		type: "sell",
		resource: "dowels",
		tiers: [
			{ target: 200, label: "Sell 200 Dowels", reward: { type: "unlock_cost_pct", amount: 10 } },
			{ target: 600, label: "Sell 600 Dowels", reward: { type: "sell_price_pct", amount: 10 } },
		],
	},
	{
		id: "sell_handles",
		type: "sell",
		resource: "handles",
		tiers: [
			{ target: 200, label: "Sell 200 Handles", reward: { type: "unlock_cost_pct", amount: 10 } },
			{ target: 600, label: "Sell 600 Handles", reward: { type: "sell_price_pct", amount: 10 } },
		],
	},
	{
		id: "sell_shafts",
		type: "sell",
		resource: "shafts",
		tiers: [
			{ target: 100, label: "Sell 100 Shafts", reward: { type: "sell_price_pct", amount: 15 } },
			{ target: 300, label: "Sell 300 Shafts", reward: { type: "sell_price_pct", amount: 15 } },
		],
	},
	{
		id: "sell_planks",
		type: "sell",
		resource: "planks",
		prereq: "sawmill",
		tiers: [
			{ target: 200, label: "Sell 200 Planks", reward: { type: "slot_cost_pct", amount: 10 } },
			{ target: 800, label: "Sell 800 Planks", reward: { type: "unlock_cost_pct", amount: 10 } },
			{ target: 2000, label: "Sell 2,000 Planks", reward: { type: "slot_cost_pct", amount: 15 } },
		],
	},
	{
		id: "sell_boards",
		type: "sell",
		resource: "boards",
		prereq: "sawmill",
		tiers: [
			{ target: 100, label: "Sell 100 Boards", reward: { type: "sell_price_pct", amount: 10 } },
			{ target: 400, label: "Sell 400 Boards", reward: { type: "slot_cost_pct", amount: 10 } },
			{ target: 1200, label: "Sell 1,200 Boards", reward: { type: "sell_price_pct", amount: 15 } },
		],
	},
	{
		id: "sell_beams",
		type: "sell",
		resource: "beams",
		prereq: "sawmill",
		tiers: [
			{ target: 100, label: "Sell 100 Beams", reward: { type: "sell_price_pct", amount: 15 } },
			{ target: 300, label: "Sell 300 Beams", reward: { type: "unlock_cost_pct", amount: 15 } },
			{ target: 800, label: "Sell 800 Beams", reward: { type: "slot_cost_pct", amount: 15 } },
		],
	},
	{
		id: "sell_crates",
		type: "sell",
		resource: "crates",
		prereq: "workshop",
		tiers: [
			{ target: 100, label: "Sell 100 Crates", reward: { type: "storage_tier", amount: 10 } },
			{ target: 400, label: "Sell 400 Crates", reward: { type: "slot_cost_pct", amount: 10 } },
			{ target: 1000, label: "Sell 1,000 Crates", reward: { type: "slot_cost_pct", amount: 15 } },
		],
	},
	{
		id: "sell_furniture",
		type: "sell",
		resource: "furniture",
		prereq: "workshop",
		tiers: [
			{ target: 60, label: "Sell 60 Furniture", reward: { type: "sell_price_pct", amount: 15 } },
			{ target: 200, label: "Sell 200 Furniture", reward: { type: "sell_price_pct", amount: 10 } },
			{ target: 500, label: "Sell 500 Furniture", reward: { type: "sell_price_pct", amount: 15 } },
		],
	},
	{
		id: "sell_coaches",
		type: "sell",
		resource: "coaches",
		prereq: "workshop",
		tiers: [
			{ target: 40, label: "Sell 40 Coaches", reward: { type: "build_cost_pct", amount: 15 } },
			{ target: 160, label: "Sell 160 Coaches", reward: { type: "build_cost_pct", amount: 15 } },
		],
	},
	{
		id: "sell_manors",
		type: "sell",
		resource: "manors",
		prereq: "workshop",
		tiers: [
			{ target: 20, label: "Sell 20 Manors", reward: { type: "cycle_speed_pct", amount: 15 } },
			{ target: 80, label: "Sell 80 Manors", reward: { type: "sell_price_pct", amount: 10 } },
		],
	},
	{
		id: "sell_iron_ore",
		type: "sell",
		resource: "iron_ore",
		prereq: "forge",
		tiers: [
			{ target: 500, label: "Sell 500 Iron Ore", reward: { type: "slot_cost_pct", amount: 10 } },
			{ target: 1600, label: "Sell 1,600 Iron Ore", reward: { type: "sell_price_pct", amount: 10 } },
			{ target: 4000, label: "Sell 4,000 Iron Ore", reward: { type: "slot_cost_pct", amount: 15 } },
		],
	},
	{
		id: "sell_iron_bars",
		type: "sell",
		resource: "iron_bars",
		prereq: "forge",
		tiers: [
			{ target: 100, label: "Sell 100 Iron Bars", reward: { type: "sell_price_pct", amount: 10 } },
			{ target: 500, label: "Sell 500 Iron Bars", reward: { type: "slot_cost_pct", amount: 10 } },
			{ target: 1200, label: "Sell 1,200 Iron Bars", reward: { type: "unlock_cost_pct", amount: 15 } },
		],
	},
	{
		id: "sell_nails",
		type: "sell",
		resource: "nails",
		prereq: "forge",
		tiers: [
			{ target: 200, label: "Sell 200 Nails", reward: { type: "slot_cost_pct", amount: 10 } },
			{ target: 600, label: "Sell 600 Nails", reward: { type: "slot_cost_pct", amount: 10 } },
		],
	},
	{
		id: "sell_fittings",
		type: "sell",
		resource: "iron_fittings",
		prereq: "forge",
		tiers: [
			{ target: 100, label: "Sell 100 Iron Fittings", reward: { type: "unlock_cost_pct", amount: 15 } },
			{ target: 300, label: "Sell 300 Iron Fittings", reward: { type: "sell_price_pct", amount: 15 } },
		],
	},
	{
		id: "sell_gears",
		type: "sell",
		resource: "gears",
		prereq: "foundry",
		tiers: [
			{ target: 60, label: "Sell 60 Gears", reward: { type: "build_cost_pct", amount: 15 } },
			{ target: 200, label: "Sell 200 Gears", reward: { type: "sell_price_pct", amount: 10 } },
		],
	},
	{
		id: "sell_springs",
		type: "sell",
		resource: "springs",
		prereq: "foundry",
		tiers: [
			{ target: 60, label: "Sell 60 Springs", reward: { type: "sell_price_pct", amount: 15 } },
			{ target: 160, label: "Sell 160 Springs", reward: { type: "sell_price_pct", amount: 15 } },
		],
	},
	{
		id: "sell_mechanisms",
		type: "sell",
		resource: "mechanisms",
		prereq: "foundry",
		tiers: [
			{ target: 40, label: "Sell 40 Mechanisms", reward: { type: "build_cost_pct", amount: 15 } },
			{ target: 120, label: "Sell 120 Mechanisms", reward: { type: "build_cost_pct", amount: 15 } },
		],
	},
	{
		id: "sell_clockwork",
		type: "sell",
		resource: "clockwork",
		prereq: "foundry",
		tiers: [
			{ target: 20, label: "Sell 20 Clockwork", reward: { type: "slot_cost_pct", amount: 15 } },
			{ target: 60, label: "Sell 60 Clockwork", reward: { type: "slot_cost_pct", amount: 25 } },
		],
	},
	{
		id: "sell_blades",
		type: "sell",
		resource: "blades",
		prereq: "armoury",
		tiers: [
			{ target: 60, label: "Sell 60 Blades", reward: { type: "sell_price_pct", amount: 15 } },
			{ target: 200, label: "Sell 200 Blades", reward: { type: "sell_price_pct", amount: 10 } },
		],
	},
	{
		id: "sell_crossbows",
		type: "sell",
		resource: "crossbows",
		prereq: "armoury",
		tiers: [
			{ target: 40, label: "Sell 40 Crossbows", reward: { type: "cycle_speed_pct", amount: 15 } },
			{ target: 100, label: "Sell 100 Crossbows", reward: { type: "sell_price_pct", amount: 15 } },
		],
	},
	{
		id: "sell_cannons",
		type: "sell",
		resource: "cannons",
		prereq: "armoury",
		tiers: [
			{ target: 20, label: "Sell 20 Cannon", reward: { type: "build_cost_pct", amount: 15 } },
			{ target: 60, label: "Sell 60 Cannons", reward: { type: "build_cost_pct", amount: 25 } },
		],
	},
	{
		id: "sell_artillery",
		type: "sell",
		resource: "artillery",
		prereq: "armoury",
		tiers: [
			{ target: 20, label: "Sell 20 Artillery", reward: { type: "cycle_speed_pct", amount: 10 } },
			{ target: 40, label: "Sell 40 Artillery", reward: { type: "cycle_speed_pct", amount: 15 } },
		],
	},
	{
		id: "sell_hulls",
		type: "sell",
		resource: "hulls",
		prereq: "shipyard",
		tiers: [
			{ target: 40, label: "Sell 40 Hulls", reward: { type: "sell_price_pct", amount: 15 } },
			{ target: 100, label: "Sell 100 Hulls", reward: { type: "sell_price_pct", amount: 15 } },
		],
	},
	{
		id: "sell_rigging",
		type: "sell",
		resource: "rigging",
		prereq: "shipyard",
		tiers: [
			{ target: 40, label: "Sell 40 Rigging", reward: { type: "cycle_speed_pct", amount: 15 } },
			{ target: 100, label: "Sell 100 Rigging", reward: { type: "sell_price_pct", amount: 10 } },
		],
	},
	{
		id: "sell_galleons",
		type: "sell",
		resource: "galleons",
		prereq: "shipyard",
		tiers: [
			{ target: 20, label: "Sell 20 Galleons", reward: { type: "cycle_speed_pct", amount: 10 } },
			{ target: 40, label: "Sell 40 Galleons", reward: { type: "sell_price_pct", amount: 25 } },
		],
	},
	{
		id: "sell_dreadnoughts",
		type: "sell",
		resource: "dreadnoughts",
		prereq: "shipyard",
		tiers: [
			{ target: 20, label: "Sell 20 Dreadnoughts", reward: { type: "cycle_speed_pct", amount: 25 } },
		],
	},
	{
		id: "slots_logs",
		type: "slots",
		bld: "lumber_yard",
		product: "logs",
		tiers: [
			{ target: 60, label: "Buy 60 Log Slots", reward: { type: "slot_cost_pct", amount: 15 } },
			{ target: 100, label: "Buy 100 Log Slots", reward: { type: "slot_cost_pct", amount: 15 } },
			{ target: 160, label: "Buy 160 Log Slots", reward: { type: "sell_price_pct", amount: 15 } },
		],
	},
	{
		id: "slots_iron_ore",
		type: "slots",
		bld: "forge",
		product: "iron_ore",
		prereq: "forge",
		tiers: [
			{ target: 60, label: "Buy 60 Iron Ore Slots", reward: { type: "slot_cost_pct", amount: 15 } },
			{ target: 100, label: "Buy 100 Iron Ore Slots", reward: { type: "slot_cost_pct", amount: 15 } },
			{ target: 160, label: "Buy 160 Iron Ore Slots", reward: { type: "sell_price_pct", amount: 15 } },
		],
	},
	{
		id: "slots_timber",
		type: "slots",
		bld: "lumber_yard",
		product: "timber",
		tiers: [
			{ target: 60, label: "Buy 60 Timber Slots", reward: { type: "slot_cost_pct", amount: 15 } },
			{ target: 100, label: "Buy 100 Timber Slots", reward: { type: "slot_cost_pct", amount: 15 } },
		],
	},
	{
		id: "total_slots",
		type: "total_slots",
		tiers: [
			{ target: 200, label: "Buy 200 Slots Total", reward: { type: "slot_cost_pct", amount: 15 } },
			{ target: 400, label: "Buy 400 Slots Total", reward: { type: "sell_price_pct", amount: 15 } },
			{ target: 700, label: "Buy 700 Slots Total", reward: { type: "slot_cost_pct", amount: 15 } },
			{ target: 1000, label: "Buy 1,000 Slots Total", reward: { type: "cycle_speed_pct", amount: 15 } },
		],
	},
	{ id: "build_sawmill", type: "build", bld: "sawmill", tiers: [{ target: 1, label: "Build the Sawmill", reward: { type: "build_cost_pct", amount: 15 } }] },
	{
		id: "build_workshop",
		type: "build",
		bld: "workshop",
		prereq: "sawmill",
		tiers: [{ target: 1, label: "Build the Workshop", reward: { type: "storage_tier", amount: 10 } }],
	},
	{
		id: "build_forge",
		type: "build",
		bld: "forge",
		prereq: "workshop",
		tiers: [{ target: 1, label: "Build the Forge", reward: { type: "storage_tier", amount: 10 } }],
	},
	{
		id: "build_foundry",
		type: "build",
		bld: "foundry",
		prereq: "forge",
		tiers: [{ target: 1, label: "Build the Foundry", reward: { type: "build_cost_pct", amount: 15 } }],
	},
	{
		id: "build_armoury",
		type: "build",
		bld: "armoury",
		prereq: "foundry",
		tiers: [{ target: 1, label: "Build the Armoury", reward: { type: "sell_price_pct", amount: 15 } }],
	},
	{
		id: "build_shipyard",
		type: "build",
		bld: "shipyard",
		prereq: "armoury",
		tiers: [{ target: 1, label: "Build the Shipyard", reward: { type: "cycle_speed_pct", amount: 15 } }],
	},
	{
		id: "unlock_boards",
		type: "unlock",
		bld: "sawmill",
		product: "boards",
		prereq: "sawmill",
		tiers: [{ target: 1, label: "Unlock Boards", reward: { type: "unlock_cost_pct", amount: 10 } }],
	},
	{
		id: "unlock_shafts",
		type: "unlock",
		bld: "lumber_yard",
		product: "shafts",
		tiers: [{ target: 1, label: "Unlock Shafts", reward: { type: "unlock_cost_pct", amount: 15 } }],
	},
	{
		id: "unlock_furniture",
		type: "unlock",
		bld: "workshop",
		product: "furniture",
		prereq: "workshop",
		tiers: [{ target: 1, label: "Unlock Furniture", reward: { type: "sell_price_pct", amount: 15 } }],
	},
	{
		id: "unlock_fittings",
		type: "unlock",
		bld: "forge",
		product: "iron_fittings",
		prereq: "forge",
		tiers: [{ target: 1, label: "Unlock Iron Fittings", reward: { type: "unlock_cost_pct", amount: 15 } }],
	},
	{
		id: "unlock_clockwork",
		type: "unlock",
		bld: "foundry",
		product: "clockwork",
		prereq: "foundry",
		tiers: [{ target: 1, label: "Unlock Clockwork", reward: { type: "build_cost_pct", amount: 25 } }],
	},
	{
		id: "unlock_artillery",
		type: "unlock",
		bld: "armoury",
		product: "artillery",
		prereq: "armoury",
		tiers: [{ target: 1, label: "Unlock Artillery", reward: { type: "sell_price_pct", amount: 25 } }],
	},
	{
		id: "unlock_dreadnoughts",
		type: "unlock",
		bld: "shipyard",
		product: "dreadnoughts",
		prereq: "shipyard",
		tiers: [{ target: 1, label: "Unlock Dreadnoughts", reward: { type: "cycle_speed_pct", amount: 25 } }],
	},
	{
		id: "storage_upgrades",
		type: "storage",
		tiers: [
			{ target: 60, label: "Upgrade Storage 60 Times", reward: { type: "storage_tier", amount: 10 } },
			{ target: 120, label: "Upgrade Storage 120 Times", reward: { type: "storage_tier", amount: 10 } },
			{ target: 200, label: "Upgrade Storage 200 Times", reward: { type: "storage_tier", amount: 10 } },
		],
	},
	{
		id: "earn_gold",
		type: "gold_earned",
		tiers: [
			{ target: 100000, label: "Earn 100,000 Gold", reward: { type: "sell_price_pct", amount: 10 } },
			{ target: 1000000, label: "Earn 1,000,000 Gold", reward: { type: "sell_price_pct", amount: 15 } },
			{ target: 10000000, label: "Earn 10,000,000 Gold", reward: { type: "sell_price_pct", amount: 15 } },
			{ target: 100000000, label: "Earn 100,000,000 Gold", reward: { type: "unlock_cost_pct", amount: 25 } },
			{ target: 1000000000, label: "Earn 1,000,000,000 Gold", reward: { type: "cycle_speed_pct", amount: 25 } },
		],
	},
	{
		id: "treasure_chests",
		type: "treasure",
		tiers: [
			{ target: 5, label: "Open 5 Treasure Chests", reward: { type: "treasure_gold_pct", amount: 50 } },
			{ target: 10, label: "Open 10 Treasure Chests", reward: { type: "treasure_gold_pct", amount: 50 } },
		],
	},
];

// Flat quest pool built from chains. Each entry gets id = `${chainId}_t${tierIndex}`.
export const QUEST_POOL: QuestDef[] = QUEST_CHAINS.flatMap((chain) =>
	chain.tiers.map((tier, i) => ({
		id: `${chain.id}_t${i}`,
		chainId: chain.id,
		tierIndex: i,
		label: tier.label,
		type: chain.type,
		resource: chain.resource,
		bld: chain.bld,
		product: chain.product,
		target: tier.target,
		reward: tier.reward,
		rewardLabel: rewardLabel(tier.reward),
	}))
);

// Quest types whose progress is measured against a baseline captured when the quest is drawn.
export const BASELINE_QUEST_TYPES = new Set(["sell", "slots", "total_slots", "gold_earned", "storage", "treasure"]);
