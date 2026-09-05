// Resource catalogue. Data only.
import type { Resource } from "../core/types.ts";

export const RESOURCES = {
	// Wood chain
	logs: { label: "Logs", singular: "Log", price: 5 },
	timber: { label: "Timber", singular: "Timber", price: 25 },
	dowels: { label: "Dowels", singular: "Dowel", price: 75 },
	handles: { label: "Handles", singular: "Handle", price: 120 },
	shafts: { label: "Shafts", singular: "Shaft", price: 500 },
	planks: { label: "Planks", singular: "Plank", price: 50 },
	boards: { label: "Boards", singular: "Board", price: 200 },
	beams: { label: "Beams", singular: "Beam", price: 750 },
	crates: { label: "Crates", singular: "Crate", price: 2000 },
	furniture: { label: "Furniture", singular: "Furniture", price: 10000 },
	coaches: { label: "Coaches", singular: "Coach", price: 50000 },
	manors: { label: "Manors", singular: "Manor", price: 500000 },
	// Iron chain
	iron_ore: { label: "Iron Ore", singular: "Iron Ore", price: 250 },
	iron_bars: { label: "Iron Bars", singular: "Iron Bar", price: 2500 },
	nails: { label: "Nails", singular: "Nail", price: 5000 },
	iron_fittings: { label: "Iron Fittings", singular: "Iron Fitting", price: 15000 },
	// Foundry chain
	gears: { label: "Gears", singular: "Gear", price: 100000 },
	springs: { label: "Springs", singular: "Spring", price: 250000 },
	mechanisms: { label: "Mechanisms", singular: "Mechanism", price: 1250000 },
	clockwork: { label: "Clockwork", singular: "Clockwork", price: 7500000 },
	// Armoury chain
	blades: { label: "Blades", singular: "Blade", price: 100000 },
	crossbows: { label: "Crossbows", singular: "Crossbow", price: 750000 },
	cannons: { label: "Cannons", singular: "Cannon", price: 7500000 },
	artillery: { label: "Artillery", singular: "Artillery", price: 150000000 },
	// Shipyard chain
	hulls: { label: "Hulls", singular: "Hull", price: 2500000 },
	rigging: { label: "Rigging", singular: "Rigging", price: 1500000 },
	galleons: { label: "Galleons", singular: "Galleon", price: 100000000 },
	dreadnoughts: { label: "Dreadnoughts", singular: "Dreadnought", price: 1000000000 },
} satisfies Record<string, Resource>;
