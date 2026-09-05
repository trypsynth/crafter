// Six ways of playing, described as parameters over one policy engine rather than six
// separate bots. A single engine is what makes the comparison meaningful: when the
// casual and the optimizer diverge, it is the parameters doing it, not two authors.

export interface PurchaseWeights {
	/** Revenue per second bought per gold spent. The obvious signal. */
	revenuePerGold: number;
	/** Bias toward whatever the chain is currently short of. */
	bottleneck: number;
	/** Bias toward deeper, higher value products over cheap early ones. */
	depth: number;
	/** Propensity to spend on storage rather than production. */
	storage: number;
	/** Propensity to open a new product line rather than widen an existing one. */
	breadth: number;
}

export const BASE_WEIGHTS: PurchaseWeights = {
	revenuePerGold: 1,
	bottleneck: 1,
	depth: 0.5,
	storage: 1,
	breadth: 1,
};

export interface Archetype {
	name: string;
	/** How the day is spent. `checkIns` is short visits; `continuous` is hours at a time. */
	pattern: "checkIns" | "continuous";
	checkInsPerDay: number;
	sessionMinutes: number;
	/** Sessions per week, for the player who only appears at weekends. */
	daysPlayedPerWeek: number;
	actionsPerMinute: number;
	usesRerolls: boolean;
	usesManualCraft: boolean;
	/**
	 * 0 dumps stock the moment there is any; 1 waits for a good moment. With fixed
	 * prices this barely matters, which is the point: once Phase 1 lands and prices
	 * move, this becomes the main axis separating a good player from a poor one.
	 */
	marketAwareness: number;
	/** 0 buys whatever is cheapest; 1 uses the full scoring model. */
	skill: number;
	prestigeWhen: "prompted" | "allComplete";
	weights: PurchaseWeights;
	notes: string;
}

function make(name: string, over: Partial<Archetype>): Archetype {
	return {
		name,
		pattern: "checkIns",
		checkInsPerDay: 3,
		sessionMinutes: 5,
		daysPlayedPerWeek: 7,
		actionsPerMinute: 12,
		usesRerolls: false,
		usesManualCraft: false,
		marketAwareness: 0,
		skill: 0.5,
		prestigeWhen: "prompted",
		weights: { ...BASE_WEIGHTS },
		notes: "",
		...over,
	};
}

export const ARCHETYPES: Record<string, Archetype> = {
	optimizer: make("optimizer", {
		pattern: "continuous",
		sessionMinutes: 12 * 60,
		checkInsPerDay: 1,
		actionsPerMinute: 30,
		usesRerolls: true,
		usesManualCraft: true,
		marketAwareness: 1,
		skill: 1,
		prestigeWhen: "prompted",
		notes: "Machine floor. Perfect attention no person has, and no strategy a good player would use.",
	}),
	engaged: make("engaged", {
		checkInsPerDay: 6,
		sessionMinutes: 15,
		actionsPerMinute: 20,
		usesRerolls: true,
		marketAwareness: 0.7,
		skill: 0.8,
		notes: "The experience the game is actually being tuned for.",
	}),
	casual: make("casual", {
		checkInsPerDay: 3,
		sessionMinutes: 5,
		actionsPerMinute: 12,
		marketAwareness: 0.2,
		skill: 0.45,
		notes: "The pacing target. Must never soft lock and must always have something to do.",
	}),
	weekend: make("weekend", {
		checkInsPerDay: 1,
		sessionMinutes: 90,
		daysPlayedPerWeek: 2,
		actionsPerMinute: 18,
		usesRerolls: true,
		marketAwareness: 0.6,
		skill: 0.75,
		notes: "Stresses offline catch-up and the away time caps.",
	}),
	lurker: make("lurker", {
		checkInsPerDay: 1,
		sessionMinutes: 2,
		actionsPerMinute: 8,
		marketAwareness: 0,
		skill: 0.2,
		notes: "Floor case. No completion target; it must simply never get stuck.",
	}),
	clicker: make("clicker", {
		pattern: "continuous",
		sessionMinutes: 3 * 60,
		checkInsPerDay: 1,
		actionsPerMinute: 60,
		usesManualCraft: true,
		marketAwareness: 0.1,
		skill: 0.3,
		notes: "Tests whether hand crafting outruns thinking. It should not.",
	}),
};

export const ARCHETYPE_NAMES = Object.keys(ARCHETYPES);
