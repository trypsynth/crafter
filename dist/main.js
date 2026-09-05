// src/content/buildings.ts
var BUILDING_CONFIG = {
  lumber_yard: {
    label: "Lumber Yard",
    desc: "Fells trees and works raw logs into precision wood components.",
    buildCost: 0,
    slotCostExponent: 1.25,
    prereq: null,
    products: {
      logs: {
        outputKey: "logs",
        outputAmt: 2,
        inputs: {},
        baseCycleMs: 2500,
        unlockCost: 0,
        baseSlotCost: 75,
        prereqProduct: null,
        startsUnlocked: true
      },
      timber: {
        outputKey: "timber",
        outputAmt: 1,
        inputs: {
          logs: 2
        },
        baseCycleMs: 4e3,
        unlockCost: 150,
        baseSlotCost: 175,
        prereqProduct: "logs"
      },
      dowels: {
        outputKey: "dowels",
        outputAmt: 1,
        inputs: {
          timber: 1
        },
        baseCycleMs: 6e3,
        unlockCost: 750,
        baseSlotCost: 300,
        prereqProduct: "timber"
      },
      handles: {
        outputKey: "handles",
        outputAmt: 1,
        inputs: {
          timber: 1
        },
        baseCycleMs: 8e3,
        unlockCost: 1e3,
        baseSlotCost: 600,
        prereqProduct: "timber"
      },
      shafts: {
        outputKey: "shafts",
        outputAmt: 1,
        inputs: {
          handles: 1,
          dowels: 1
        },
        baseCycleMs: 15e3,
        unlockCost: 1800,
        baseSlotCost: 1e3,
        prereqProduct: "handles"
      }
    }
  },
  sawmill: {
    label: "Sawmill",
    desc: "Cuts raw logs into structural lumber for construction and trade.",
    buildCost: 25e3,
    slotCostExponent: 1.35,
    prereq: {
      building: "lumber_yard"
    },
    products: {
      planks: {
        outputKey: "planks",
        outputAmt: 1,
        inputs: {
          logs: 1
        },
        baseCycleMs: 5e3,
        unlockCost: 0,
        baseSlotCost: 150,
        prereqProduct: null,
        startsUnlocked: true
      },
      boards: {
        outputKey: "boards",
        outputAmt: 1,
        inputs: {
          logs: 2
        },
        baseCycleMs: 1e4,
        unlockCost: 500,
        baseSlotCost: 350,
        prereqProduct: "planks"
      },
      beams: {
        outputKey: "beams",
        outputAmt: 1,
        inputs: {
          logs: 2
        },
        baseCycleMs: 12e3,
        unlockCost: 1200,
        baseSlotCost: 700,
        prereqProduct: "boards"
      }
    }
  },
  workshop: {
    label: "Workshop",
    desc: "Combines lumber and precision parts into finished goods for the empire.",
    buildCost: 5e5,
    slotCostExponent: 1.25,
    prereq: {
      building: "sawmill",
      product: "boards"
    },
    products: {
      crates: {
        outputKey: "crates",
        outputAmt: 1,
        inputs: {
          planks: 2,
          dowels: 2
        },
        baseCycleMs: 2e4,
        unlockCost: 0,
        baseSlotCost: 1200,
        prereqProduct: null,
        startsUnlocked: true
      },
      furniture: {
        outputKey: "furniture",
        outputAmt: 1,
        inputs: {
          boards: 2,
          handles: 2
        },
        baseCycleMs: 32e3,
        unlockCost: 2e3,
        baseSlotCost: 2e3,
        prereqProduct: "crates"
      },
      coaches: {
        outputKey: "coaches",
        outputAmt: 1,
        inputs: {
          beams: 2,
          shafts: 2
        },
        baseCycleMs: 5e4,
        unlockCost: 4500,
        baseSlotCost: 3500,
        prereqProduct: "furniture"
      },
      manors: {
        outputKey: "manors",
        outputAmt: 1,
        inputs: {
          beams: 2,
          boards: 2,
          shafts: 2
        },
        baseCycleMs: 72e3,
        unlockCost: 6e3,
        baseSlotCost: 5500,
        prereqProduct: "coaches"
      }
    }
  },
  forge: {
    label: "Forge",
    desc: "Smelts raw iron ore into bars and precision metalwork.",
    buildCost: 1e7,
    slotCostExponent: 1.3,
    prereq: {
      building: "workshop"
    },
    products: {
      iron_ore: {
        outputKey: "iron_ore",
        outputAmt: 1,
        inputs: {},
        baseCycleMs: 4e3,
        unlockCost: 0,
        baseSlotCost: 200,
        prereqProduct: null,
        startsUnlocked: true
      },
      iron_bars: {
        outputKey: "iron_bars",
        outputAmt: 3,
        inputs: {
          iron_ore: 2
        },
        baseCycleMs: 9e3,
        unlockCost: 500,
        baseSlotCost: 600,
        prereqProduct: "iron_ore"
      },
      nails: {
        outputKey: "nails",
        outputAmt: 1,
        inputs: {
          iron_bars: 1
        },
        baseCycleMs: 8e3,
        unlockCost: 1500,
        baseSlotCost: 1200,
        prereqProduct: "iron_bars"
      },
      iron_fittings: {
        outputKey: "iron_fittings",
        outputAmt: 1,
        inputs: {
          iron_bars: 2
        },
        baseCycleMs: 8e3,
        unlockCost: 4e3,
        baseSlotCost: 2500,
        prereqProduct: "nails"
      }
    }
  },
  foundry: {
    label: "Foundry",
    desc: "Casts complex mechanisms and precision components from refined iron.",
    buildCost: 25e7,
    slotCostExponent: 1.35,
    prereq: {
      building: "forge",
      product: "iron_fittings"
    },
    products: {
      gears: {
        outputKey: "gears",
        outputAmt: 1,
        inputs: {
          iron_bars: 1,
          dowels: 1
        },
        baseCycleMs: 3e4,
        unlockCost: 0,
        baseSlotCost: 3500,
        prereqProduct: null,
        startsUnlocked: true
      },
      springs: {
        outputKey: "springs",
        outputAmt: 1,
        inputs: {
          iron_fittings: 2
        },
        baseCycleMs: 2e4,
        unlockCost: 8e3,
        baseSlotCost: 5e3,
        prereqProduct: "gears"
      },
      mechanisms: {
        outputKey: "mechanisms",
        outputAmt: 1,
        inputs: {
          gears: 1,
          springs: 1
        },
        baseCycleMs: 22e3,
        unlockCost: 15e3,
        baseSlotCost: 8e3,
        prereqProduct: "springs"
      },
      clockwork: {
        outputKey: "clockwork",
        outputAmt: 1,
        inputs: {
          mechanisms: 1,
          iron_fittings: 1
        },
        baseCycleMs: 9e4,
        unlockCost: 25e3,
        baseSlotCost: 12e3,
        prereqProduct: "mechanisms"
      }
    }
  },
  armoury: {
    label: "Armoury",
    desc: "Forges weapons of war from iron, timber, and precision components.",
    buildCost: 5e9,
    slotCostExponent: 1.3,
    prereq: {
      building: "foundry",
      product: "mechanisms"
    },
    products: {
      blades: {
        outputKey: "blades",
        outputAmt: 1,
        inputs: {
          iron_bars: 2,
          timber: 1
        },
        baseCycleMs: 2e4,
        unlockCost: 0,
        baseSlotCost: 6e3,
        prereqProduct: null,
        startsUnlocked: true
      },
      crossbows: {
        outputKey: "crossbows",
        outputAmt: 1,
        inputs: {
          boards: 1,
          shafts: 1,
          iron_fittings: 1
        },
        baseCycleMs: 35e3,
        unlockCost: 2e4,
        baseSlotCost: 1e4,
        prereqProduct: "blades"
      },
      cannons: {
        outputKey: "cannons",
        outputAmt: 1,
        inputs: {
          beams: 2,
          iron_bars: 2,
          mechanisms: 1
        },
        baseCycleMs: 9e4,
        unlockCost: 5e4,
        baseSlotCost: 18e3,
        prereqProduct: "crossbows"
      },
      artillery: {
        outputKey: "artillery",
        outputAmt: 1,
        inputs: {
          beams: 3,
          mechanisms: 2,
          clockwork: 1
        },
        baseCycleMs: 13e4,
        unlockCost: 1e5,
        baseSlotCost: 3e4,
        prereqProduct: "cannons"
      }
    }
  },
  shipyard: {
    label: "Shipyard",
    desc: "Builds mighty vessels from timber, iron, and the finest components.",
    buildCost: 1e11,
    slotCostExponent: 1.25,
    prereq: {
      building: "armoury",
      product: "cannons"
    },
    products: {
      hulls: {
        outputKey: "hulls",
        outputAmt: 1,
        inputs: {
          beams: 3,
          boards: 2
        },
        baseCycleMs: 6e4,
        unlockCost: 0,
        baseSlotCost: 22e3,
        prereqProduct: null,
        startsUnlocked: true
      },
      rigging: {
        outputKey: "rigging",
        outputAmt: 1,
        inputs: {
          shafts: 2,
          iron_fittings: 2
        },
        baseCycleMs: 45e3,
        unlockCost: 6e4,
        baseSlotCost: 2e4,
        prereqProduct: "hulls"
      },
      galleons: {
        outputKey: "galleons",
        outputAmt: 1,
        inputs: {
          hulls: 1,
          rigging: 1,
          cannons: 2
        },
        baseCycleMs: 18e4,
        unlockCost: 15e4,
        baseSlotCost: 45e3,
        prereqProduct: "rigging"
      },
      dreadnoughts: {
        outputKey: "dreadnoughts",
        outputAmt: 1,
        inputs: {
          hulls: 2,
          rigging: 1,
          artillery: 2,
          clockwork: 2
        },
        baseCycleMs: 36e4,
        unlockCost: 35e4,
        baseSlotCost: 9e4,
        prereqProduct: "galleons"
      }
    }
  }
};
var BUILDINGS = BUILDING_CONFIG;

// src/content/quests.ts
function rewardLabel(r) {
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
var QUEST_CHAINS = [
  {
    id: "sell_logs",
    type: "sell",
    resource: "logs",
    tiers: [
      {
        target: 400,
        label: "Sell 400 Logs",
        reward: {
          type: "slot_cost_pct",
          amount: 10
        }
      },
      {
        target: 1e3,
        label: "Sell 1,000 Logs",
        reward: {
          type: "sell_price_pct",
          amount: 10
        }
      },
      {
        target: 3e3,
        label: "Sell 3,000 Logs",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      },
      {
        target: 8e3,
        label: "Sell 8,000 Logs",
        reward: {
          type: "slot_cost_pct",
          amount: 10
        }
      }
    ]
  },
  {
    id: "sell_timber",
    type: "sell",
    resource: "timber",
    tiers: [
      {
        target: 200,
        label: "Sell 200 Timber",
        reward: {
          type: "sell_price_pct",
          amount: 10
        }
      },
      {
        target: 600,
        label: "Sell 600 Timber",
        reward: {
          type: "slot_cost_pct",
          amount: 10
        }
      },
      {
        target: 2e3,
        label: "Sell 2,000 Timber",
        reward: {
          type: "unlock_cost_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_dowels",
    type: "sell",
    resource: "dowels",
    tiers: [
      {
        target: 200,
        label: "Sell 200 Dowels",
        reward: {
          type: "unlock_cost_pct",
          amount: 10
        }
      },
      {
        target: 600,
        label: "Sell 600 Dowels",
        reward: {
          type: "sell_price_pct",
          amount: 10
        }
      }
    ]
  },
  {
    id: "sell_handles",
    type: "sell",
    resource: "handles",
    tiers: [
      {
        target: 200,
        label: "Sell 200 Handles",
        reward: {
          type: "unlock_cost_pct",
          amount: 10
        }
      },
      {
        target: 600,
        label: "Sell 600 Handles",
        reward: {
          type: "sell_price_pct",
          amount: 10
        }
      }
    ]
  },
  {
    id: "sell_shafts",
    type: "sell",
    resource: "shafts",
    tiers: [
      {
        target: 100,
        label: "Sell 100 Shafts",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      },
      {
        target: 300,
        label: "Sell 300 Shafts",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_planks",
    type: "sell",
    resource: "planks",
    prereq: "sawmill",
    tiers: [
      {
        target: 200,
        label: "Sell 200 Planks",
        reward: {
          type: "slot_cost_pct",
          amount: 10
        }
      },
      {
        target: 800,
        label: "Sell 800 Planks",
        reward: {
          type: "unlock_cost_pct",
          amount: 10
        }
      },
      {
        target: 2e3,
        label: "Sell 2,000 Planks",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_boards",
    type: "sell",
    resource: "boards",
    prereq: "sawmill",
    tiers: [
      {
        target: 100,
        label: "Sell 100 Boards",
        reward: {
          type: "sell_price_pct",
          amount: 10
        }
      },
      {
        target: 400,
        label: "Sell 400 Boards",
        reward: {
          type: "slot_cost_pct",
          amount: 10
        }
      },
      {
        target: 1200,
        label: "Sell 1,200 Boards",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_beams",
    type: "sell",
    resource: "beams",
    prereq: "sawmill",
    tiers: [
      {
        target: 100,
        label: "Sell 100 Beams",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      },
      {
        target: 300,
        label: "Sell 300 Beams",
        reward: {
          type: "unlock_cost_pct",
          amount: 15
        }
      },
      {
        target: 800,
        label: "Sell 800 Beams",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_crates",
    type: "sell",
    resource: "crates",
    prereq: "workshop",
    tiers: [
      {
        target: 100,
        label: "Sell 100 Crates",
        reward: {
          type: "storage_tier",
          amount: 10
        }
      },
      {
        target: 400,
        label: "Sell 400 Crates",
        reward: {
          type: "slot_cost_pct",
          amount: 10
        }
      },
      {
        target: 1e3,
        label: "Sell 1,000 Crates",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_furniture",
    type: "sell",
    resource: "furniture",
    prereq: "workshop",
    tiers: [
      {
        target: 60,
        label: "Sell 60 Furniture",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      },
      {
        target: 200,
        label: "Sell 200 Furniture",
        reward: {
          type: "sell_price_pct",
          amount: 10
        }
      },
      {
        target: 500,
        label: "Sell 500 Furniture",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_coaches",
    type: "sell",
    resource: "coaches",
    prereq: "workshop",
    tiers: [
      {
        target: 40,
        label: "Sell 40 Coaches",
        reward: {
          type: "build_cost_pct",
          amount: 15
        }
      },
      {
        target: 160,
        label: "Sell 160 Coaches",
        reward: {
          type: "build_cost_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_manors",
    type: "sell",
    resource: "manors",
    prereq: "workshop",
    tiers: [
      {
        target: 20,
        label: "Sell 20 Manors",
        reward: {
          type: "cycle_speed_pct",
          amount: 15
        }
      },
      {
        target: 80,
        label: "Sell 80 Manors",
        reward: {
          type: "sell_price_pct",
          amount: 10
        }
      }
    ]
  },
  {
    id: "sell_iron_ore",
    type: "sell",
    resource: "iron_ore",
    prereq: "forge",
    tiers: [
      {
        target: 500,
        label: "Sell 500 Iron Ore",
        reward: {
          type: "slot_cost_pct",
          amount: 10
        }
      },
      {
        target: 1600,
        label: "Sell 1,600 Iron Ore",
        reward: {
          type: "sell_price_pct",
          amount: 10
        }
      },
      {
        target: 4e3,
        label: "Sell 4,000 Iron Ore",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_iron_bars",
    type: "sell",
    resource: "iron_bars",
    prereq: "forge",
    tiers: [
      {
        target: 100,
        label: "Sell 100 Iron Bars",
        reward: {
          type: "sell_price_pct",
          amount: 10
        }
      },
      {
        target: 500,
        label: "Sell 500 Iron Bars",
        reward: {
          type: "slot_cost_pct",
          amount: 10
        }
      },
      {
        target: 1200,
        label: "Sell 1,200 Iron Bars",
        reward: {
          type: "unlock_cost_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_nails",
    type: "sell",
    resource: "nails",
    prereq: "forge",
    tiers: [
      {
        target: 200,
        label: "Sell 200 Nails",
        reward: {
          type: "slot_cost_pct",
          amount: 10
        }
      },
      {
        target: 600,
        label: "Sell 600 Nails",
        reward: {
          type: "slot_cost_pct",
          amount: 10
        }
      }
    ]
  },
  {
    id: "sell_fittings",
    type: "sell",
    resource: "iron_fittings",
    prereq: "forge",
    tiers: [
      {
        target: 100,
        label: "Sell 100 Iron Fittings",
        reward: {
          type: "unlock_cost_pct",
          amount: 15
        }
      },
      {
        target: 300,
        label: "Sell 300 Iron Fittings",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_gears",
    type: "sell",
    resource: "gears",
    prereq: "foundry",
    tiers: [
      {
        target: 60,
        label: "Sell 60 Gears",
        reward: {
          type: "build_cost_pct",
          amount: 15
        }
      },
      {
        target: 200,
        label: "Sell 200 Gears",
        reward: {
          type: "sell_price_pct",
          amount: 10
        }
      }
    ]
  },
  {
    id: "sell_springs",
    type: "sell",
    resource: "springs",
    prereq: "foundry",
    tiers: [
      {
        target: 60,
        label: "Sell 60 Springs",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      },
      {
        target: 160,
        label: "Sell 160 Springs",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_mechanisms",
    type: "sell",
    resource: "mechanisms",
    prereq: "foundry",
    tiers: [
      {
        target: 40,
        label: "Sell 40 Mechanisms",
        reward: {
          type: "build_cost_pct",
          amount: 15
        }
      },
      {
        target: 120,
        label: "Sell 120 Mechanisms",
        reward: {
          type: "build_cost_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_clockwork",
    type: "sell",
    resource: "clockwork",
    prereq: "foundry",
    tiers: [
      {
        target: 20,
        label: "Sell 20 Clockwork",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      },
      {
        target: 60,
        label: "Sell 60 Clockwork",
        reward: {
          type: "slot_cost_pct",
          amount: 25
        }
      }
    ]
  },
  {
    id: "sell_blades",
    type: "sell",
    resource: "blades",
    prereq: "armoury",
    tiers: [
      {
        target: 60,
        label: "Sell 60 Blades",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      },
      {
        target: 200,
        label: "Sell 200 Blades",
        reward: {
          type: "sell_price_pct",
          amount: 10
        }
      }
    ]
  },
  {
    id: "sell_crossbows",
    type: "sell",
    resource: "crossbows",
    prereq: "armoury",
    tiers: [
      {
        target: 40,
        label: "Sell 40 Crossbows",
        reward: {
          type: "cycle_speed_pct",
          amount: 15
        }
      },
      {
        target: 100,
        label: "Sell 100 Crossbows",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_cannons",
    type: "sell",
    resource: "cannons",
    prereq: "armoury",
    tiers: [
      {
        target: 20,
        label: "Sell 20 Cannon",
        reward: {
          type: "build_cost_pct",
          amount: 15
        }
      },
      {
        target: 60,
        label: "Sell 60 Cannons",
        reward: {
          type: "build_cost_pct",
          amount: 25
        }
      }
    ]
  },
  {
    id: "sell_artillery",
    type: "sell",
    resource: "artillery",
    prereq: "armoury",
    tiers: [
      {
        target: 20,
        label: "Sell 20 Artillery",
        reward: {
          type: "cycle_speed_pct",
          amount: 10
        }
      },
      {
        target: 40,
        label: "Sell 40 Artillery",
        reward: {
          type: "cycle_speed_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_hulls",
    type: "sell",
    resource: "hulls",
    prereq: "shipyard",
    tiers: [
      {
        target: 40,
        label: "Sell 40 Hulls",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      },
      {
        target: 100,
        label: "Sell 100 Hulls",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "sell_rigging",
    type: "sell",
    resource: "rigging",
    prereq: "shipyard",
    tiers: [
      {
        target: 40,
        label: "Sell 40 Rigging",
        reward: {
          type: "cycle_speed_pct",
          amount: 15
        }
      },
      {
        target: 100,
        label: "Sell 100 Rigging",
        reward: {
          type: "sell_price_pct",
          amount: 10
        }
      }
    ]
  },
  {
    id: "sell_galleons",
    type: "sell",
    resource: "galleons",
    prereq: "shipyard",
    tiers: [
      {
        target: 20,
        label: "Sell 20 Galleons",
        reward: {
          type: "cycle_speed_pct",
          amount: 10
        }
      },
      {
        target: 40,
        label: "Sell 40 Galleons",
        reward: {
          type: "sell_price_pct",
          amount: 25
        }
      }
    ]
  },
  {
    id: "sell_dreadnoughts",
    type: "sell",
    resource: "dreadnoughts",
    prereq: "shipyard",
    tiers: [
      {
        target: 20,
        label: "Sell 20 Dreadnoughts",
        reward: {
          type: "cycle_speed_pct",
          amount: 25
        }
      }
    ]
  },
  {
    id: "slots_logs",
    type: "slots",
    bld: "lumber_yard",
    product: "logs",
    tiers: [
      {
        target: 60,
        label: "Buy 60 Log Slots",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      },
      {
        target: 100,
        label: "Buy 100 Log Slots",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      },
      {
        target: 160,
        label: "Buy 160 Log Slots",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "slots_iron_ore",
    type: "slots",
    bld: "forge",
    product: "iron_ore",
    prereq: "forge",
    tiers: [
      {
        target: 60,
        label: "Buy 60 Iron Ore Slots",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      },
      {
        target: 100,
        label: "Buy 100 Iron Ore Slots",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      },
      {
        target: 160,
        label: "Buy 160 Iron Ore Slots",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "slots_timber",
    type: "slots",
    bld: "lumber_yard",
    product: "timber",
    tiers: [
      {
        target: 60,
        label: "Buy 60 Timber Slots",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      },
      {
        target: 100,
        label: "Buy 100 Timber Slots",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "total_slots",
    type: "total_slots",
    tiers: [
      {
        target: 200,
        label: "Buy 200 Slots Total",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      },
      {
        target: 400,
        label: "Buy 400 Slots Total",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      },
      {
        target: 700,
        label: "Buy 700 Slots Total",
        reward: {
          type: "slot_cost_pct",
          amount: 15
        }
      },
      {
        target: 1e3,
        label: "Buy 1,000 Slots Total",
        reward: {
          type: "cycle_speed_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "build_sawmill",
    type: "build",
    bld: "sawmill",
    tiers: [
      {
        target: 1,
        label: "Build the Sawmill",
        reward: {
          type: "build_cost_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "build_workshop",
    type: "build",
    bld: "workshop",
    prereq: "sawmill",
    tiers: [
      {
        target: 1,
        label: "Build the Workshop",
        reward: {
          type: "storage_tier",
          amount: 10
        }
      }
    ]
  },
  {
    id: "build_forge",
    type: "build",
    bld: "forge",
    prereq: "workshop",
    tiers: [
      {
        target: 1,
        label: "Build the Forge",
        reward: {
          type: "storage_tier",
          amount: 10
        }
      }
    ]
  },
  {
    id: "build_foundry",
    type: "build",
    bld: "foundry",
    prereq: "forge",
    tiers: [
      {
        target: 1,
        label: "Build the Foundry",
        reward: {
          type: "build_cost_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "build_armoury",
    type: "build",
    bld: "armoury",
    prereq: "foundry",
    tiers: [
      {
        target: 1,
        label: "Build the Armoury",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "build_shipyard",
    type: "build",
    bld: "shipyard",
    prereq: "armoury",
    tiers: [
      {
        target: 1,
        label: "Build the Shipyard",
        reward: {
          type: "cycle_speed_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "unlock_boards",
    type: "unlock",
    bld: "sawmill",
    product: "boards",
    prereq: "sawmill",
    tiers: [
      {
        target: 1,
        label: "Unlock Boards",
        reward: {
          type: "unlock_cost_pct",
          amount: 10
        }
      }
    ]
  },
  {
    id: "unlock_shafts",
    type: "unlock",
    bld: "lumber_yard",
    product: "shafts",
    tiers: [
      {
        target: 1,
        label: "Unlock Shafts",
        reward: {
          type: "unlock_cost_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "unlock_furniture",
    type: "unlock",
    bld: "workshop",
    product: "furniture",
    prereq: "workshop",
    tiers: [
      {
        target: 1,
        label: "Unlock Furniture",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "unlock_fittings",
    type: "unlock",
    bld: "forge",
    product: "iron_fittings",
    prereq: "forge",
    tiers: [
      {
        target: 1,
        label: "Unlock Iron Fittings",
        reward: {
          type: "unlock_cost_pct",
          amount: 15
        }
      }
    ]
  },
  {
    id: "unlock_clockwork",
    type: "unlock",
    bld: "foundry",
    product: "clockwork",
    prereq: "foundry",
    tiers: [
      {
        target: 1,
        label: "Unlock Clockwork",
        reward: {
          type: "build_cost_pct",
          amount: 25
        }
      }
    ]
  },
  {
    id: "unlock_artillery",
    type: "unlock",
    bld: "armoury",
    product: "artillery",
    prereq: "armoury",
    tiers: [
      {
        target: 1,
        label: "Unlock Artillery",
        reward: {
          type: "sell_price_pct",
          amount: 25
        }
      }
    ]
  },
  {
    id: "unlock_dreadnoughts",
    type: "unlock",
    bld: "shipyard",
    product: "dreadnoughts",
    prereq: "shipyard",
    tiers: [
      {
        target: 1,
        label: "Unlock Dreadnoughts",
        reward: {
          type: "cycle_speed_pct",
          amount: 25
        }
      }
    ]
  },
  {
    id: "storage_upgrades",
    type: "storage",
    tiers: [
      {
        target: 60,
        label: "Upgrade Storage 60 Times",
        reward: {
          type: "storage_tier",
          amount: 10
        }
      },
      {
        target: 120,
        label: "Upgrade Storage 120 Times",
        reward: {
          type: "storage_tier",
          amount: 10
        }
      },
      {
        target: 200,
        label: "Upgrade Storage 200 Times",
        reward: {
          type: "storage_tier",
          amount: 10
        }
      }
    ]
  },
  {
    id: "earn_gold",
    type: "gold_earned",
    tiers: [
      {
        target: 1e5,
        label: "Earn 100,000 Gold",
        reward: {
          type: "sell_price_pct",
          amount: 10
        }
      },
      {
        target: 1e6,
        label: "Earn 1,000,000 Gold",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      },
      {
        target: 1e7,
        label: "Earn 10,000,000 Gold",
        reward: {
          type: "sell_price_pct",
          amount: 15
        }
      },
      {
        target: 1e8,
        label: "Earn 100,000,000 Gold",
        reward: {
          type: "unlock_cost_pct",
          amount: 25
        }
      },
      {
        target: 1e9,
        label: "Earn 1,000,000,000 Gold",
        reward: {
          type: "cycle_speed_pct",
          amount: 25
        }
      }
    ]
  },
  {
    id: "treasure_chests",
    type: "treasure",
    tiers: [
      {
        target: 5,
        label: "Open 5 Treasure Chests",
        reward: {
          type: "treasure_gold_pct",
          amount: 50
        }
      },
      {
        target: 10,
        label: "Open 10 Treasure Chests",
        reward: {
          type: "treasure_gold_pct",
          amount: 50
        }
      }
    ]
  }
];
var QUEST_POOL = QUEST_CHAINS.flatMap((chain) => chain.tiers.map((tier, i) => ({
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
  rewardLabel: rewardLabel(tier.reward)
})));
var BASELINE_QUEST_TYPES = /* @__PURE__ */ new Set([
  "sell",
  "slots",
  "total_slots",
  "gold_earned",
  "storage",
  "treasure"
]);

// src/content/resources.ts
var RESOURCES = {
  // Wood chain
  logs: {
    label: "Logs",
    singular: "Log",
    price: 5
  },
  timber: {
    label: "Timber",
    singular: "Timber",
    price: 25
  },
  dowels: {
    label: "Dowels",
    singular: "Dowel",
    price: 75
  },
  handles: {
    label: "Handles",
    singular: "Handle",
    price: 120
  },
  shafts: {
    label: "Shafts",
    singular: "Shaft",
    price: 500
  },
  planks: {
    label: "Planks",
    singular: "Plank",
    price: 50
  },
  boards: {
    label: "Boards",
    singular: "Board",
    price: 200
  },
  beams: {
    label: "Beams",
    singular: "Beam",
    price: 750
  },
  crates: {
    label: "Crates",
    singular: "Crate",
    price: 2e3
  },
  furniture: {
    label: "Furniture",
    singular: "Furniture",
    price: 1e4
  },
  coaches: {
    label: "Coaches",
    singular: "Coach",
    price: 5e4
  },
  manors: {
    label: "Manors",
    singular: "Manor",
    price: 5e5
  },
  // Iron chain
  iron_ore: {
    label: "Iron Ore",
    singular: "Iron Ore",
    price: 250
  },
  iron_bars: {
    label: "Iron Bars",
    singular: "Iron Bar",
    price: 2500
  },
  nails: {
    label: "Nails",
    singular: "Nail",
    price: 5e3
  },
  iron_fittings: {
    label: "Iron Fittings",
    singular: "Iron Fitting",
    price: 15e3
  },
  // Foundry chain
  gears: {
    label: "Gears",
    singular: "Gear",
    price: 1e5
  },
  springs: {
    label: "Springs",
    singular: "Spring",
    price: 25e4
  },
  mechanisms: {
    label: "Mechanisms",
    singular: "Mechanism",
    price: 125e4
  },
  clockwork: {
    label: "Clockwork",
    singular: "Clockwork",
    price: 75e5
  },
  // Armoury chain
  blades: {
    label: "Blades",
    singular: "Blade",
    price: 1e5
  },
  crossbows: {
    label: "Crossbows",
    singular: "Crossbow",
    price: 75e4
  },
  cannons: {
    label: "Cannons",
    singular: "Cannon",
    price: 75e5
  },
  artillery: {
    label: "Artillery",
    singular: "Artillery",
    price: 15e7
  },
  // Shipyard chain
  hulls: {
    label: "Hulls",
    singular: "Hull",
    price: 25e5
  },
  rigging: {
    label: "Rigging",
    singular: "Rigging",
    price: 15e5
  },
  galleons: {
    label: "Galleons",
    singular: "Galleon",
    price: 1e8
  },
  dreadnoughts: {
    label: "Dreadnoughts",
    singular: "Dreadnought",
    price: 1e9
  }
};

// src/core/clock.ts
var source = () => Date.now();
function now() {
  return source();
}

// src/core/rng.ts
var cursor = Math.random() * 2 ** 32 >>> 0;
var override = null;
function random() {
  if (override) return override();
  cursor = cursor + 1831565813 | 0;
  let t = Math.imul(cursor ^ cursor >>> 15, 1 | cursor);
  t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
  return ((t ^ t >>> 14) >>> 0) / 4294967296;
}
function rngState() {
  return cursor;
}
function setRngState(n) {
  cursor = n | 0;
}
function randomSeed() {
  return Math.random() * 2 ** 32 >>> 0;
}
function shuffle() {
  return random() - 0.5;
}

// src/core/constants.ts
var SAVE_KEY = "crafter";
var STORAGE_BASE = 50;
var STORAGE_FIRST_UPGRADE = 100;
var STORAGE_INCREMENT = 100;
var STORAGE_BASE_COST = 150;
var STORAGE_COST_GROWTH = 1.1;
var QUEST_SLOTS = 5;
var REROLL_BASE_COST = 250;
var REROLL_COST_GROWTH = 2;
var TREASURE_MIN_GAP_MS = 3e5;
var TREASURE_GAP_SPREAD_MS = 6e5;
var TREASURE_MIN_DURATION_MS = 1e4;
var TREASURE_DURATION_SPREAD_MS = 2e4;
var OFFLINE_CAP_MS = 24 * 60 * 60 * 1e3;
var SLOT_REFUND_PCT = 0.5;
var MANUAL_CLICK_PROGRESS = 0.25;

// src/core/migrations.ts
var SAVE_VERSION = 1;
var MIGRATIONS = {
  // v0 is every save written before versioning existed. The shape is unchanged; this
  // just fills in what load() used to patch up by hand on every boot.
  1: (s) => {
    for (const bst of Object.values(s.buildings ?? {})) {
      for (const pst of Object.values(bst.products ?? {})) {
        if (!pst.manual || typeof pst.manual !== "object") pst.manual = {
          active: false,
          progress: 0
        };
        if (pst.manual.active === void 0) pst.manual.active = false;
        if (pst.manual.progress === void 0) pst.manual.progress = 0;
        if (pst.enabled === void 0) pst.enabled = true;
        if (!Array.isArray(pst.slots)) pst.slots = [];
      }
    }
    if (typeof s.rngState !== "number") s.rngState = randomSeed();
    return s;
  }
};
var SaveTooNewError = class extends Error {
  found;
  constructor(found) {
    super(`Save was written by a newer build (version ${found}, this build reads ${SAVE_VERSION}).`), this.found = found;
    this.name = "SaveTooNewError";
  }
};
function saveVersionOf(s) {
  return typeof s.version === "number" ? s.version : 0;
}
function migrate(raw) {
  let s = raw;
  let v = saveVersionOf(s);
  if (v > SAVE_VERSION) throw new SaveTooNewError(v);
  while (v < SAVE_VERSION) {
    v++;
    s = MIGRATIONS[v](s);
    s.version = v;
  }
  s.version = SAVE_VERSION;
  return s;
}

// src/core/util.ts
function entries(obj) {
  return Object.entries(obj);
}
function keys(obj) {
  return Object.keys(obj);
}
function getOrInsert(map, key, make) {
  const existing = map.get(key);
  if (existing !== void 0) return existing;
  const created = make(key);
  map.set(key, created);
  return created;
}

// src/core/state.ts
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
function emptyInventory() {
  return Object.fromEntries(keys(RESOURCES).map((k) => [
    k,
    0
  ]));
}
function freshBuildings() {
  return Object.fromEntries(Object.keys(BUILDINGS).map((bldKey) => {
    const products = Object.fromEntries(Object.entries(BUILDINGS[bldKey].products).map(([pk, pcfg]) => {
      const pst = {
        unlocked: pcfg.startsUnlocked ?? false,
        enabled: true,
        slots: [],
        manual: {
          active: false,
          progress: 0
        }
      };
      return [
        pk,
        pst
      ];
    }));
    return [
      bldKey,
      {
        unlocked: bldKey === "lumber_yard",
        products
      }
    ];
  }));
}
function freshState() {
  return {
    version: SAVE_VERSION,
    rngState: randomSeed(),
    gold: 0,
    lastTick: null,
    inventory: emptyInventory(),
    storage: {
      tier: 0
    },
    stats: {
      goldEarned: 0,
      soldByResource: {},
      treasureChestsOpened: 0
    },
    treasure: {
      nextSpawn: now() + TREASURE_MIN_GAP_MS + random() * TREASURE_GAP_SPREAD_MS,
      activeUntil: 0
    },
    quests: {
      active: [],
      completed: [],
      baselines: {},
      rerolls: 0
    },
    prestige: {
      runs: 0,
      rewards: [],
      completedQuestIds: [],
      seenBuildings: [],
      accumulatedStats: {
        goldEarned: 0,
        soldByResource: {},
        storageUpgrades: 0,
        totalSlots: 0,
        maxSlotsByProduct: {},
        totalSlotsByProduct: {},
        treasureChestsOpened: 0
      }
    },
    buildings: freshBuildings()
  };
}
var state = freshState();
function setState(next) {
  state = next;
}
var runtime = {
  nextSlotId: 0,
  stallAnnounced: {},
  selectedBuilding: null
};

// src/core/events.ts
var handlers = /* @__PURE__ */ new Map();
function on(name, fn) {
  let set = handlers.get(name);
  if (!set) {
    set = /* @__PURE__ */ new Set();
    handlers.set(name, set);
  }
  set.add(fn);
  return () => {
    handlers.get(name)?.delete(fn);
  };
}
function emit(name, payload) {
  const set = handlers.get(name);
  if (!set) return;
  for (const fn of set) fn(payload);
}
var muted = false;
function setMuted(value) {
  muted = value;
}
function announce(msg) {
  if (muted) return;
  emit("announce", msg);
}
function requestRender() {
  emit("render");
}

// src/core/storage.ts
var backend = null;
function setBackend(b) {
  backend = b;
}
function getItem(key) {
  if (!backend) return null;
  try {
    return backend.getItem(key);
  } catch {
    return null;
  }
}
function setItem(key, value) {
  if (!backend) return;
  try {
    backend.setItem(key, value);
  } catch {
  }
}
function removeItem(key) {
  if (!backend) return;
  try {
    backend.removeItem(key);
  } catch {
  }
}

// src/core/economy.ts
function totalItems() {
  return keys(RESOURCES).reduce((sum, k) => sum + (state.inventory[k] ?? 0), 0);
}
function storageMax() {
  const tier = state.storage.tier + getPrestigeBonus("storage_tier");
  if (tier <= 0) return STORAGE_BASE;
  return STORAGE_FIRST_UPGRADE + (tier - 1) * STORAGE_INCREMENT;
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
  const exp = BUILDINGS[bldKey].slotCostExponent ?? 1.5;
  const base = BUILDINGS[bldKey].products[productKey].baseSlotCost * Math.pow(exp, n);
  return Math.round(base * prestigeSlotCostMult());
}
function lastSlotCost(bldKey, productKey) {
  const n = state.buildings[bldKey].products[productKey].slots.length;
  if (n === 0) return 0;
  const exp = BUILDINGS[bldKey].slotCostExponent ?? 1.5;
  const base = BUILDINGS[bldKey].products[productKey].baseSlotCost * Math.pow(exp, n - 1);
  return Math.round(base * prestigeSlotCostMult());
}
function slotRefund(bldKey, productKey) {
  return Math.floor(lastSlotCost(bldKey, productKey) * SLOT_REFUND_PCT);
}
function currentPrice(resourceKey) {
  return Math.round(RESOURCES[resourceKey].price * prestigeSellMult());
}
function buildCost(bldKey) {
  return Math.round(BUILDINGS[bldKey].buildCost * prestigeBuildCostMult());
}
function unlockCost(bldKey, productKey) {
  return Math.round(BUILDINGS[bldKey].products[productKey].unlockCost * prestigeUnlockCostMult());
}
function buildingPrereqMet(bldKey) {
  const p = BUILDINGS[bldKey].prereq;
  if (!p) return true;
  const bst = state.buildings[p.building];
  if (!bst?.unlocked) return false;
  if (p.product && !bst.products[p.product]?.unlocked) return false;
  return true;
}
function getPrestigeBonus(type) {
  return state.prestige.rewards.filter((r) => r.type === type).reduce((s, r) => s + r.amount, 0);
}
function getPrestigeMult(type) {
  const rewards = state.prestige.rewards.filter((r) => r.type === type);
  if (type === "sell_price_pct" || type === "cycle_speed_pct" || type === "treasure_gold_pct") return rewards.reduce((m, r) => m * (1 + r.amount / 100), 1);
  return rewards.reduce((m, r) => m * (1 - r.amount / 100), 1);
}
var prestigeSlotCostMult = () => getPrestigeMult("slot_cost_pct");
var prestigeSellMult = () => getPrestigeMult("sell_price_pct");
var prestigeBuildCostMult = () => getPrestigeMult("build_cost_pct");
var prestigeUnlockCostMult = () => getPrestigeMult("unlock_cost_pct");
var prestigeSpeedMult = () => getPrestigeMult("cycle_speed_pct");
var prestigeTreasureMult = () => getPrestigeMult("treasure_gold_pct");
function getTreasureBaseValue() {
  let maxPrice = 5;
  for (const bldKey of Object.keys(BUILDINGS)) {
    const bst = state.buildings[bldKey];
    if (!bst?.unlocked) continue;
    for (const prodKey of Object.keys(BUILDINGS[bldKey].products)) {
      const pst = bst.products[prodKey];
      if (!pst?.unlocked) continue;
      const price = RESOURCES[BUILDINGS[bldKey].products[prodKey].outputKey].price;
      if (price > maxPrice) maxPrice = price;
    }
  }
  return maxPrice * 100 * (1 + (state.prestige?.runs ?? 0));
}
function getProductionOverview() {
  const productRows = [];
  const supplyRates = {};
  const demandRates = {};
  const cycleSpeedMult = prestigeSpeedMult();
  for (const [bldKey, cfg] of entries(BUILDINGS)) {
    const bst = state.buildings[bldKey];
    if (!bst?.unlocked) continue;
    for (const [productKey, pcfg] of entries(cfg.products)) {
      const pst = bst.products[productKey];
      if (!pst?.unlocked) continue;
      const n = pst.slots.length;
      productRows.push({
        resourceKey: pcfg.outputKey,
        enabled: pst.enabled,
        slots: n,
        outputAmt: pcfg.outputAmt,
        baseCycleMs: pcfg.baseCycleMs
      });
      if (!pst.enabled || n === 0) continue;
      const actualCycleMs = pcfg.baseCycleMs / cycleSpeedMult;
      supplyRates[pcfg.outputKey] = (supplyRates[pcfg.outputKey] ?? 0) + n * pcfg.outputAmt * 6e4 / actualCycleMs;
      for (const [inputKey, inputAmt] of entries(pcfg.inputs)) {
        demandRates[inputKey] = (demandRates[inputKey] ?? 0) + n * inputAmt * 6e4 / actualCycleMs;
      }
    }
  }
  const hasChain = Object.keys(demandRates).length > 0;
  const allKeys = Array.from(/* @__PURE__ */ new Set([
    ...keys(supplyRates),
    ...keys(demandRates)
  ]));
  const balances = allKeys.filter((resourceKey) => RESOURCES[resourceKey]).map((resourceKey) => ({
    resourceKey,
    supply: supplyRates[resourceKey] ?? 0,
    demand: demandRates[resourceKey] ?? 0,
    net: (supplyRates[resourceKey] ?? 0) - (demandRates[resourceKey] ?? 0)
  }));
  const deficits = balances.filter((entry) => entry.demand > 0 && entry.net < -0.05).sort((a, b) => a.net - b.net);
  const totalDemand = Object.values(demandRates).reduce((sum, value) => sum + (value ?? 0), 0);
  const fulfillment = totalDemand <= 0 ? 0 : balances.filter((entry) => entry.demand > 0).reduce((sum, entry) => {
    const coverage = Math.min(entry.supply / entry.demand, 1);
    return sum + entry.demand * coverage;
  }, 0);
  const efficiencyPct = totalDemand <= 0 ? null : Math.round(fulfillment / totalDemand * 100);
  return {
    productRows,
    hasChain,
    deficits,
    balances,
    efficiencyPct
  };
}
function bestNextPurchase() {
  const { deficits } = getProductionOverview();
  const deficitMap = {};
  for (const d of deficits) deficitMap[d.resourceKey] = d.net;
  let best = null;
  let bestScore = -Infinity;
  for (const [bk, bst] of entries(state.buildings)) {
    if (!bst.unlocked) continue;
    for (const [pk, pcfg] of entries(BUILDINGS[bk].products)) {
      if (!bst.products[pk].unlocked) continue;
      const cost = nextSlotCost(bk, pk);
      if (cost <= 0) continue;
      const outputRate = pcfg.outputAmt * 6e4 / pcfg.baseCycleMs;
      let score = outputRate * currentPrice(pcfg.outputKey) / cost;
      const deficit = deficitMap[pcfg.outputKey];
      if (deficit !== void 0) score *= 1 + Math.abs(deficit);
      if (score > bestScore) {
        bestScore = score;
        best = {
          bldKey: bk,
          productKey: pk,
          cost,
          label: RESOURCES[pcfg.outputKey].label,
          isDeficit: deficit !== void 0
        };
      }
    }
  }
  return best;
}
function nextBuildableBuilding() {
  return Object.keys(BUILDINGS).find((k) => !state.buildings[k].unlocked && buildingPrereqMet(k));
}

// src/core/format.ts
function formatInputs(inputs) {
  return entries(inputs).map(([k, amt]) => `${amt.toLocaleString()} ${amt === 1 ? RESOURCES[k].singular : RESOURCES[k].label}`).join(", ");
}
function formatResourceName(resourceKey, amount) {
  return amount === 1 ? RESOURCES[resourceKey].singular : RESOURCES[resourceKey].label;
}
function formatProductOutput(slots, outputAmt, baseCycleMs, label = "", brief = false) {
  const total = slots * outputAmt;
  const cycleSpeedMult = prestigeSpeedMult();
  const actualCycleMs = baseCycleMs / cycleSpeedMult;
  const actualSecs = actualCycleMs / 1e3;
  const perMin = total * 60 / actualSecs;
  const perMinFmt = perMin.toLocaleString(void 0, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).replace(/\.0$/, "");
  const durationNum = actualSecs.toLocaleString(void 0, {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).replace(/\.0$/, "");
  const duration = `${durationNum} ${actualSecs === 1 ? "second" : "seconds"}`;
  const name = label ? total === 1 ? RESOURCES[label].singular : RESOURCES[label].label : "";
  if (brief) return `${total.toLocaleString()}${name ? " " + name : ""} every ${duration}`;
  return `${total.toLocaleString()}${name ? " " + name : ""} every ${duration} (${perMinFmt} per minute)`;
}
function formatNum(n) {
  return n.toLocaleString();
}

// src/core/production.ts
var COMPILED = Object.entries(BUILDINGS).flatMap(([bldKey, cfg]) => Object.entries(cfg.products).map(([productKey, pcfg]) => {
  const inputs = pcfg.inputs;
  const inputKeys = Object.keys(inputs);
  const inputAmts = inputKeys.map((k) => inputs[k]);
  const inputSum = inputAmts.reduce((s, n) => s + n, 0);
  const label = RESOURCES[pcfg.outputKey].label;
  return {
    bldKey,
    productKey,
    outputKey: pcfg.outputKey,
    outputAmt: pcfg.outputAmt,
    baseCycleSec: pcfg.baseCycleMs / 1e3,
    inputKeys,
    inputAmts,
    netChange: pcfg.outputAmt - inputSum,
    stallKey: `${bldKey}-${productKey}`,
    storageStallMsg: `${label} stalled - storage full.`,
    inputStallMsg: `${label} stalled - need ${formatInputs(pcfg.inputs)}.`
  };
}));
var STALLED_PROGRESS = 0.999;
function markStalled(c, message) {
  const seen = runtime.stallAnnounced[c.stallKey];
  if (!seen) {
    runtime.stallAnnounced[c.stallKey] = "pending";
  } else if (seen === "pending") {
    runtime.stallAnnounced[c.stallKey] = true;
    if (runtime.selectedBuilding === c.bldKey) announce(message);
  }
}
function advanceBuildings(deltaSec) {
  const speedMult = prestigeSpeedMult();
  const max = storageMax();
  const inv = state.inventory;
  let total = totalItems();
  let live = false;
  for (const c of COMPILED) {
    const bst = state.buildings[c.bldKey];
    if (!bst.unlocked) continue;
    const pst = bst.products[c.productKey];
    if (!pst.unlocked) continue;
    if (!pst.enabled) {
      if (pst.manual.active) {
        pst.manual.active = false;
        pst.manual.progress = 0;
      }
      continue;
    }
    const cycleSec = c.baseCycleSec / speedMult;
    const advance = deltaSec / cycleSec;
    const { inputKeys, inputAmts, outputKey, outputAmt, netChange } = c;
    const inputCount = inputKeys.length;
    for (const slot of pst.slots) {
      const before = slot.progress;
      slot.progress += advance;
      while (slot.progress >= 1) {
        if (netChange > 0 && total + netChange > max) {
          slot.progress = STALLED_PROGRESS;
          markStalled(c, c.storageStallMsg);
          break;
        }
        let starved = false;
        for (let i = 0; i < inputCount; i++) {
          if (inv[inputKeys[i]] < inputAmts[i]) {
            starved = true;
            break;
          }
        }
        if (starved) {
          slot.progress = STALLED_PROGRESS;
          markStalled(c, c.inputStallMsg);
          break;
        }
        slot.progress -= 1;
        for (let i = 0; i < inputCount; i++) inv[inputKeys[i]] -= inputAmts[i];
        inv[outputKey] += outputAmt;
        total += netChange;
        if (runtime.stallAnnounced[c.stallKey] !== void 0) delete runtime.stallAnnounced[c.stallKey];
        live = true;
      }
      if (slot.progress !== before) live = true;
    }
    if (pst.manual.active) {
      live = true;
      pst.manual.progress += advance;
      if (pst.manual.progress >= 1) {
        pst.manual.progress = 0;
        pst.manual.active = false;
        for (let i = 0; i < inputCount; i++) inv[inputKeys[i]] -= inputAmts[i];
        inv[outputKey] += outputAmt;
        total += netChange;
        announce(`${RESOURCES[outputKey].singular} produced.`);
      }
    }
  }
  return live;
}

// src/core/treasure.ts
function advanceTreasure(atMs) {
  if (state.treasure.activeUntil && atMs > state.treasure.activeUntil) {
    state.treasure.activeUntil = 0;
    emit("treasure:change");
  }
  if (!state.treasure.activeUntil && atMs > state.treasure.nextSpawn) {
    const duration = TREASURE_MIN_DURATION_MS + random() * TREASURE_DURATION_SPREAD_MS;
    state.treasure.activeUntil = atMs + duration;
    state.treasure.nextSpawn = atMs + TREASURE_MIN_GAP_MS + random() * TREASURE_GAP_SPREAD_MS;
    announce(`Treasure chest spawned, active for ${Math.round(duration / 1e3)} seconds!`);
    emit("treasure:change");
  }
}

// src/core/sim.ts
var STEP_MS = 1e3;
var STEP_SEC = STEP_MS / 1e3;
function advanceTo(targetMs, budget = Infinity) {
  if (state.lastTick === null) {
    state.lastTick = targetMs;
    return 0;
  }
  if (targetMs < state.lastTick) {
    state.lastTick = targetMs;
    return 0;
  }
  let steps = 0;
  let productionLive = true;
  while (targetMs - state.lastTick >= STEP_MS && steps < budget) {
    state.lastTick += STEP_MS;
    advanceTreasure(state.lastTick);
    if (productionLive) productionLive = advanceBuildings(STEP_SEC);
    steps++;
  }
  return steps;
}

// src/core/save.ts
var saveBlocked = false;
function save() {
  if (saveBlocked) return;
  state.rngState = rngState();
  setItem(SAVE_KEY, JSON.stringify(state));
}
function writeRawSave(text) {
  setItem(SAVE_KEY, text);
}
function clearSave() {
  saveBlocked = false;
  removeItem(SAVE_KEY);
}
function load() {
  const raw = getItem(SAVE_KEY);
  if (!raw) return;
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    console.error("Save is not valid JSON, starting fresh:", e);
    setState(freshState());
    return;
  }
  let migrated;
  try {
    migrated = migrate(parsed);
  } catch (e) {
    if (e instanceof SaveTooNewError) {
      saveBlocked = true;
      console.error(e.message);
      setState(freshState());
      announce("This save was made by a newer version of Crafter. Saving is off so it is not overwritten.");
      return;
    }
    throw e;
  }
  const fresh = freshState();
  deepMerge(fresh, migrated);
  const lastTime = fresh.lastTick;
  setState(fresh);
  setRngState(state.rngState);
  runtime.nextSlotId = highestSlotId();
  if (lastTime !== null) applyOfflineProgress();
}
function highestSlotId() {
  let maxId = 0;
  for (const bst of Object.values(state.buildings)) {
    for (const pst of Object.values(bst.products)) {
      for (const slot of pst.slots) {
        if (slot.id > maxId) maxId = slot.id;
      }
    }
  }
  return maxId;
}
function applyOfflineProgress() {
  if (state.lastTick === null) return 0;
  const target = now();
  const away = target - state.lastTick;
  if (away < STEP_MS) return 0;
  if (away > OFFLINE_CAP_MS) state.lastTick = target - OFFLINE_CAP_MS;
  const before = totalItems();
  setMuted(true);
  try {
    advanceTo(target);
  } finally {
    setMuted(false);
  }
  state.lastTick = target;
  const gained = totalItems() - before;
  if (gained > 0) announce(`Welcome back! Your workers produced ${gained.toLocaleString()} items while you were away.`);
  return gained;
}

// src/core/journal.ts
var MAX_ENTRIES = 5e4;
var entries2 = [];
var startState = null;
var startedAt = 0;
var seed = 0;
var recording = false;
function startRecording(stateSnapshot, rngSeed) {
  entries2 = [];
  startState = stateSnapshot;
  startedAt = now();
  seed = rngSeed;
  recording = true;
}
function record(action, ...params) {
  if (!recording) return;
  if (entries2.length >= MAX_ENTRIES) entries2.shift();
  entries2.push(params.length > 0 ? {
    t: now(),
    a: action,
    p: params
  } : {
    t: now(),
    a: action
  });
}
function getRecording() {
  if (startState === null) return null;
  return {
    format: 1,
    startedAt,
    seed,
    startState,
    entries: [
      ...entries2
    ]
  };
}
function entryCount() {
  return entries2.length;
}

// src/core/quests.ts
function questById(id) {
  return QUEST_POOL.find((q) => q.id === id);
}
function eligibleQuestPool() {
  const completed = new Set(state.prestige.completedQuestIds);
  const seen = /* @__PURE__ */ new Set([
    "lumber_yard",
    ...state.prestige.seenBuildings
  ]);
  const pool = [];
  for (const chain of QUEST_CHAINS) {
    if (chain.prereq && !seen.has(chain.prereq)) continue;
    for (let i = 0; i < chain.tiers.length; i++) {
      const questId = `${chain.id}_t${i}`;
      if (!completed.has(questId)) {
        const q = questById(questId);
        if (q) pool.push(q);
        break;
      }
    }
  }
  return pool;
}
function isGameComplete() {
  const completed = new Set(state.prestige.completedQuestIds);
  return QUEST_POOL.every((q) => completed.has(q.id));
}
function getQuestProgress(def, baseline = 0) {
  const acc = state.prestige.accumulatedStats;
  let raw;
  switch (def.type) {
    case "treasure":
      raw = (acc.treasureChestsOpened ?? 0) + (state.stats.treasureChestsOpened ?? 0);
      break;
    case "sell": {
      const key = def.resource;
      raw = (acc.soldByResource[key] ?? 0) + (state.stats.soldByResource[key] ?? 0);
      break;
    }
    case "slots": {
      const current = state.buildings[def.bld]?.products[def.product]?.slots.length ?? 0;
      const key = `${def.bld}.${def.product}`;
      const totalPrev = acc.totalSlotsByProduct?.[key] ?? acc.maxSlotsByProduct?.[key] ?? 0;
      raw = totalPrev + current;
      break;
    }
    case "total_slots": {
      raw = acc.totalSlots;
      for (const bst of Object.values(state.buildings)) {
        for (const pst of Object.values(bst.products)) raw += pst.slots.length;
      }
      break;
    }
    case "build":
      raw = state.buildings[def.bld]?.unlocked ? 1 : 0;
      break;
    case "unlock":
      raw = state.buildings[def.bld]?.products[def.product]?.unlocked ? 1 : 0;
      break;
    case "storage":
      raw = acc.storageUpgrades + state.storage.tier;
      break;
    case "gold_earned":
      raw = acc.goldEarned + state.stats.goldEarned;
      break;
    default:
      raw = 0;
  }
  return {
    current: Math.max(0, raw - baseline),
    target: def.target
  };
}
function questBaseline(id, def) {
  return BASELINE_QUEST_TYPES.has(def.type) ? state.quests.baselines?.[id] ?? 0 : 0;
}
function flushSatisfiedQuests() {
  const completed = new Set(state.prestige.completedQuestIds);
  const seen = /* @__PURE__ */ new Set([
    "lumber_yard",
    ...state.prestige.seenBuildings
  ]);
  let changed = false;
  for (const chain of QUEST_CHAINS) {
    if (chain.prereq && !seen.has(chain.prereq)) continue;
    for (let i = 0; i < chain.tiers.length; i++) {
      const questId = `${chain.id}_t${i}`;
      if (completed.has(questId)) continue;
      const q = questById(questId);
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
function rerollCost() {
  return Math.round(REROLL_BASE_COST * Math.pow(REROLL_COST_GROWTH, state.quests.rerolls ?? 0));
}
function rerollQuest(index) {
  record("reroll", index);
  const cost = rerollCost();
  if (state.gold < cost) {
    announce(`Need ${cost.toLocaleString()} gold to reroll.`);
    return;
  }
  const pool = eligibleQuestPool();
  const keepIds = new Set(state.quests.active.filter((_, i) => i !== index));
  const available = pool.filter((q) => !keepIds.has(q.id) && q.id !== state.quests.active[index]).sort(shuffle);
  const newQuest = available[0];
  if (!newQuest) {
    announce("No other quests available to reroll into.");
    return;
  }
  state.gold -= cost;
  const oldId = state.quests.active[index];
  const newBaselines = {
    ...state.quests.baselines
  };
  delete newBaselines[oldId];
  newBaselines[newQuest.id] = BASELINE_QUEST_TYPES.has(newQuest.type) ? getQuestProgress(newQuest).current : 0;
  state.quests.active[index] = newQuest.id;
  state.quests.completed[index] = false;
  state.quests.baselines = newBaselines;
  state.quests.rerolls = (state.quests.rerolls ?? 0) + 1;
  emit("quests:invalidate");
  requestRender();
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
      if (currentBaselines[id] !== void 0) newBaselines[id] = currentBaselines[id];
    }
  }
  const pool = eligibleQuestPool();
  const existingIds = new Set(newActive);
  const available = pool.filter((q) => !existingIds.has(q.id)).sort(shuffle);
  while (newActive.length < QUEST_SLOTS && available.length > 0) {
    const q = available.shift();
    newActive.push(q.id);
    newCompleted.push(false);
    newBaselines[q.id] = BASELINE_QUEST_TYPES.has(q.type) ? getQuestProgress(q).current : 0;
  }
  state.quests.active = newActive;
  state.quests.completed = newCompleted;
  state.quests.baselines = newBaselines;
}
function checkQuestCompletion() {
  if (!state.quests.active.length) return;
  for (let i = 0; i < state.quests.active.length; i++) {
    if (state.quests.completed[i]) continue;
    const id = state.quests.active[i];
    const def = questById(id);
    if (!def) continue;
    const { current, target } = getQuestProgress(def, questBaseline(id, def));
    if (current >= target) {
      state.quests.completed[i] = true;
      announce(`Quest complete: ${def.label}!`);
    }
  }
}

// src/core/tick.ts
function tick() {
  try {
    advanceTo(now());
  } catch (e) {
    console.error("advanceTo:", e);
  }
  checkQuestCompletion();
  emit("tick");
}

// src/ui/components.ts
function setDatasetMany(els, key, value) {
  for (const el of els) el.dataset[key] = value;
}
function claimAttribute(current, next) {
  if (current === null) return "adopt";
  if (current !== next) return "revert";
  return "ignore";
}
var BuildingProductCard = class extends HTMLElement {
  #bld = null;
  #product = null;
  #label;
  #status;
  #inputDesc;
  #inputs;
  #singular;
  #toggleProduction;
  #summary;
  #slotCost;
  #addSlot;
  #saleAmt;
  #sellSlot;
  #wantsBldAndProduct = /* @__PURE__ */ new Set();
  #wantsCycleFmt = /* @__PURE__ */ new Set();
  #paused;
  connectedCallback() {
    this.className = "product-section";
    const header = document.createElement("div");
    header.className = "product-header";
    const title = document.createElement("h4");
    this.#label = title;
    title.className = "product-title";
    const status = document.createElement("span");
    this.#status = status;
    status.style.fontSize = "var(--font-sm)";
    header.append(title, status);
    const inputDesc = document.createElement("p");
    this.#inputDesc = inputDesc;
    inputDesc.className = "product-inputs";
    const inputs = document.createTextNode("");
    this.#inputs = inputs;
    inputDesc.append("Requires ", inputs, " per cycle");
    const manualProduceRow = document.createElement("div");
    manualProduceRow.className = "manual-produce-row";
    const manualProduce2 = document.createElement("button");
    this.#wantsBldAndProduct.add(manualProduce2);
    manualProduce2.className = "manual-produce-btn";
    manualProduce2.dataset.action = "manual-produce";
    const singular = document.createTextNode("");
    this.#singular = singular;
    manualProduce2.append("Produce ", singular);
    const toggleProduction = document.createElement("button");
    this.#wantsBldAndProduct.add(toggleProduction);
    this.#toggleProduction = toggleProduction;
    toggleProduction.className = "toggle-product-btn";
    toggleProduction.dataset.action = "toggle-product";
    manualProduceRow.append(manualProduce2, toggleProduction);
    const summary = document.createElement("p");
    this.#summary = summary;
    summary.className = "slot-summary";
    const addSlot2 = document.createElement("button");
    this.#addSlot = addSlot2;
    this.#wantsBldAndProduct.add(addSlot2);
    addSlot2.className = "add-slot-btn";
    addSlot2.dataset.action = "add-slot";
    const slotCost = document.createTextNode("");
    this.#slotCost = slotCost;
    let cycleFmt = document.createTextNode("");
    this.#wantsCycleFmt.add(cycleFmt);
    addSlot2.append("Add Slot for ", slotCost, " gold (+", cycleFmt, ")");
    const sellSlot2 = document.createElement("button");
    this.#sellSlot = sellSlot2;
    this.#wantsBldAndProduct.add(sellSlot2);
    sellSlot2.className = "sell-slot-btn";
    sellSlot2.dataset.action = "sell-slot";
    const saleAmt = document.createTextNode("");
    this.#saleAmt = saleAmt;
    cycleFmt = cycleFmt.cloneNode();
    this.#wantsCycleFmt.add(cycleFmt);
    sellSlot2.append("Sell Slot for ", saleAmt, " gold (-", cycleFmt, ")");
    if (this.#bld !== null) setDatasetMany(this.#wantsBldAndProduct, "bld", this.#bld);
    if (this.#product !== null) setDatasetMany(this.#wantsBldAndProduct, "product", this.#product);
    this.#init();
    this.replaceChildren(header, inputDesc, manualProduceRow, summary, addSlot2, sellSlot2);
  }
  static get observedAttributes() {
    return [
      "bld",
      "product"
    ];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name === "bld") {
      const verdict = claimAttribute(this.#bld, newValue);
      if (verdict === "revert") return this.setAttribute("bld", this.#bld);
      if (verdict === "ignore") return;
      this.#bld = newValue;
    } else if (name === "product") {
      const verdict = claimAttribute(this.#product, newValue);
      if (verdict === "revert") return this.setAttribute("product", this.#product);
      if (verdict === "ignore") return;
      this.#product = newValue;
    } else return;
    if (newValue !== null) setDatasetMany(this.#wantsBldAndProduct, name, newValue);
    this.#init();
  }
  set bld(value) {
    this.setAttribute("bld", value);
  }
  set product(value) {
    this.setAttribute("product", value);
  }
  #init() {
    if (this.#bld === null || this.#product === null || !this.#label || !this.#singular) return;
    const res = RESOURCES[BUILDINGS[this.#bld]?.products[this.#product]?.outputKey];
    if (res === void 0) return;
    this.#label.textContent = res.label;
    this.#singular.textContent = res.singular;
  }
  refresh() {
    const bld = this.#bld;
    const product = this.#product;
    if (bld === null || product === null || !this.#status || !this.#addSlot) return;
    const pst = state.buildings[bld]?.products[product];
    const pcfg = BUILDINGS[bld]?.products[product];
    if (pcfg === void 0 || pst === void 0) return;
    const paused = !pst.enabled;
    if (this.#paused !== paused) {
      this.#paused = paused;
      this.#status.textContent = paused ? "Paused" : "Active";
      this.#status.className = paused ? "health-warn" : "health-ok";
      this.#toggleProduction.textContent = paused ? "Resume" : "Pause";
      this.#toggleProduction.classList.toggle("paused", paused);
    }
    const slotCost = nextSlotCost(bld, product);
    this.#slotCost.textContent = String(slotCost);
    this.#addSlot.disabled = state.gold < slotCost;
    const n = pst.slots.length;
    this.#toggleProduction.hidden = n === 0;
    this.#sellSlot.disabled = n === 0;
    const scaled = Object.fromEntries(entries(pcfg.inputs).map(([k, v]) => [
      k,
      v * Math.max(1, n)
    ]));
    const inputs = formatInputs(scaled);
    if (inputs === "") {
      this.#inputDesc.hidden = true;
    } else {
      this.#inputs.textContent = inputs;
      this.#inputDesc.hidden = false;
    }
    const cycleFmt = formatProductOutput(1, pcfg.outputAmt, pcfg.baseCycleMs, pcfg.outputKey, true);
    for (const el of this.#wantsCycleFmt) el.textContent = cycleFmt;
    this.#summary.textContent = n === 0 ? "No slots yet." : `${n.toLocaleString()} ${n === 1 ? "slot" : "slots"}, ${formatProductOutput(n, pcfg.outputAmt, pcfg.baseCycleMs, pcfg.outputKey)}`;
    this.#saleAmt.textContent = String(slotRefund(bld, product));
  }
};
var UnlockProductButton = class extends HTMLElement {
  #bld = null;
  #product = null;
  #button;
  #label;
  #cost;
  connectedCallback() {
    const button = document.createElement("button");
    this.#button = button;
    button.className = "unlock-product-btn";
    button.dataset.action = "unlock-product";
    if (this.#bld !== null) button.dataset.bld = this.#bld;
    if (this.#product !== null) button.dataset.product = this.#product;
    const name = document.createTextNode(this.#getLabelText());
    this.#label = name;
    const cost = document.createTextNode("");
    this.#cost = cost;
    button.append("Unlock ", name, " for ", cost, " gold");
    this.replaceChildren(button);
  }
  static get observedAttributes() {
    return [
      "bld",
      "product"
    ];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return;
    if (name === "bld") {
      const verdict = claimAttribute(this.#bld, newValue);
      if (verdict === "revert") return this.setAttribute("bld", this.#bld);
      if (verdict === "ignore") return;
      this.#bld = newValue;
    } else if (name === "product") {
      const verdict = claimAttribute(this.#product, newValue);
      if (verdict === "revert") return this.setAttribute("product", this.#product);
      if (verdict === "ignore") return;
      this.#product = newValue;
    } else return;
    if (this.#button !== void 0 && newValue !== null) this.#button.dataset[name] = newValue;
    if (this.#bld !== null && this.#product !== null && this.#label !== void 0) this.#label.textContent = this.#getLabelText();
    this.refresh();
  }
  set bld(value) {
    this.setAttribute("bld", value);
  }
  set product(value) {
    this.setAttribute("product", value);
  }
  #getLabelText() {
    if (this.#bld === null || this.#product === null) return "[product]";
    return RESOURCES[BUILDINGS[this.#bld]?.products[this.#product]?.outputKey]?.label ?? "[product]";
  }
  refresh() {
    const bld = this.#bld;
    const product = this.#product;
    if (bld === null || product === null || !this.#button || !this.#cost) return;
    const cost = unlockCost(bld, product);
    this.#button.disabled = state.gold < cost;
    const costText = cost.toLocaleString();
    if (this.#cost.textContent !== costText) this.#cost.textContent = costText;
  }
};
var BuildingSection = class extends HTMLElement {
  #productCards = /* @__PURE__ */ new Map();
  #unlockButtons = /* @__PURE__ */ new Map();
  #productSection;
  #unlockGroup;
  #unlockSection;
  connectedCallback() {
    const productGroup = document.createElement("section");
    productGroup.className = "product-group";
    const productsH3 = document.createElement("h3");
    productsH3.textContent = "Products";
    const productSection = document.createElement("div");
    this.#productSection = productSection;
    productSection.className = "product-section";
    productGroup.append(productsH3, productSection);
    const unlockGroup = document.createElement("section");
    this.#unlockGroup = unlockGroup;
    unlockGroup.className = "unlock-group";
    unlockGroup.hidden = true;
    const unlockH3 = document.createElement("h3");
    unlockH3.textContent = "Unlockable Products";
    const unlockSection = document.createElement("div");
    this.#unlockSection = unlockSection;
    unlockSection.className = "unlock-section";
    unlockGroup.append(unlockH3, unlockSection);
    this.replaceChildren(productGroup, unlockGroup);
  }
  static get observedAttributes() {
    return [
      "bld"
    ];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return;
    if (name === "bld") {
      this.#productCards.clear();
      this.#unlockButtons.clear();
      this.#productSection?.replaceChildren();
      this.#unlockSection?.replaceChildren();
    }
  }
  set bld(value) {
    this.setAttribute("bld", value);
  }
  get bld() {
    return this.getAttribute("bld");
  }
  refresh() {
    const bldKey = this.bld;
    const productSection = this.#productSection;
    const unlockSection = this.#unlockSection;
    const unlockGroup = this.#unlockGroup;
    if (!bldKey || !productSection || !unlockSection || !unlockGroup) return;
    const cfg = BUILDINGS[bldKey];
    const bst = state.buildings[bldKey];
    if (!cfg || !bst) return;
    for (const [pk, pcfg] of entries(cfg.products)) {
      let unlocked = false;
      let unlockable = false;
      if (bst.products[pk].unlocked) {
        unlocked = true;
        const card = getOrInsert(this.#productCards, pk, (key) => {
          const card2 = new BuildingProductCard();
          card2.product = key;
          card2.bld = bldKey;
          return card2;
        });
        if (!productSection.contains(card)) productSection.appendChild(card);
        card.refresh();
      } else if (!pcfg.prereqProduct || bst.products[pcfg.prereqProduct].unlocked) {
        unlockable = true;
        const button = getOrInsert(this.#unlockButtons, pk, (key) => {
          const button2 = new UnlockProductButton();
          button2.product = key;
          button2.bld = bldKey;
          return button2;
        });
        if (!unlockSection.contains(button)) unlockSection.append(button);
        button.refresh();
      }
      if (!unlockable && this.#unlockButtons.has(pk)) {
        unlockSection.removeChild(this.#unlockButtons.get(pk));
        this.#unlockButtons.delete(pk);
      }
      if (!unlocked && this.#productCards.has(pk)) {
        productSection.removeChild(this.#productCards.get(pk));
        this.#productCards.delete(pk);
      }
    }
    unlockGroup.hidden = this.#unlockButtons.size === 0;
  }
};
var MarketProductCard = class extends HTMLElement {
  #invCount;
  #unitValue;
  #totalValue;
  #sell;
  #wantsLabel = /* @__PURE__ */ new Set();
  #resource = null;
  connectedCallback() {
    this.className = "market-product";
    const header = document.createElement("div");
    header.className = "market-product-header";
    const name = document.createElement("h4");
    this.#wantsLabel.add(name);
    name.className = "market-product-name";
    const stock = document.createElement("span");
    stock.className = "market-product-stock";
    const invCount = document.createTextNode("");
    this.#invCount = invCount;
    const unitValue = document.createTextNode("");
    this.#unitValue = unitValue;
    stock.append(invCount, " in stock, ", unitValue, " gold each");
    header.append(name, stock);
    const sell = document.createElement("button");
    this.#sell = sell;
    sell.className = "sell-btn";
    sell.dataset.action = "sell";
    if (this.#resource !== null) sell.dataset.resource = this.#resource;
    const label = document.createTextNode("");
    this.#wantsLabel.add(label);
    const totalValue = document.createTextNode("");
    this.#totalValue = totalValue;
    sell.append("Sell All ", label, " for ", totalValue, " gold");
    this.replaceChildren(header, sell);
    this.#init();
  }
  static get observedAttributes() {
    return [
      "resource"
    ];
  }
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue === newValue) return;
    if (name !== "resource") return;
    if (this.#resource === null) {
      this.#resource = newValue;
      if (this.#sell !== void 0 && newValue !== null) this.#sell.dataset.resource = newValue;
      this.#init();
    } else if (this.#resource !== newValue) return this.setAttribute("resource", this.#resource);
  }
  set resource(value) {
    this.setAttribute("resource", value);
  }
  #init() {
    if (this.#resource === null || this.#wantsLabel.size === 0) return;
    const label = RESOURCES[this.#resource]?.label;
    if (label === void 0) return;
    for (const el of this.#wantsLabel) el.textContent = label;
  }
  refresh() {
    const resource = this.#resource;
    if (resource === null || !this.#invCount || !this.#sell) return;
    const inv = state.inventory[resource] || 0;
    const hasStock = inv > 0;
    const price = currentPrice(resource);
    this.#invCount.textContent = inv.toLocaleString();
    this.hidden = !hasStock;
    this.#sell.disabled = !hasStock;
    this.#unitValue.textContent = price.toLocaleString();
    this.#totalValue.textContent = (inv * price).toLocaleString();
  }
};
var MarketSection = class extends HTMLElement {
  #progressBar;
  #progressFill;
  #used;
  #pct;
  #upgrade;
  #next;
  #cost;
  #sellAll;
  #totalValue;
  #emptyText;
  #productGroup;
  #productCards = /* @__PURE__ */ new Map();
  #wantsMax = /* @__PURE__ */ new Set();
  connectedCallback() {
    const info = document.createElement("div");
    info.className = "storage-info";
    const progressBar = document.createElement("div");
    this.#progressBar = progressBar;
    progressBar.className = "storage-bar-wrap";
    progressBar.role = "progressbar";
    progressBar.ariaLabel = "Storage used";
    progressBar.ariaValueMin = "0";
    progressBar.ariaValueMax = "100";
    const progressFill = document.createElement("div");
    this.#progressFill = progressFill;
    progressFill.className = "storage-bar-fill";
    progressBar.appendChild(progressFill);
    const label = document.createElement("p");
    label.className = "storage-used-label";
    this.#used = document.createTextNode("");
    let max = document.createTextNode("");
    this.#wantsMax.add(max);
    this.#pct = document.createTextNode("");
    label.append(this.#used, " / ", max, " items (", this.#pct, "% full)");
    const upgrade = document.createElement("button");
    this.#upgrade = upgrade;
    upgrade.dataset.action = "storage-upgrade";
    max = max.cloneNode();
    this.#wantsMax.add(max);
    this.#next = document.createTextNode("");
    this.#cost = document.createTextNode("");
    upgrade.append("Expand Storage: ", max, " to ", this.#next, " items for ", this.#cost, " gold");
    info.append(progressBar, label, upgrade);
    const divider = document.createElement("div");
    divider.className = "market-divider";
    const sellAll2 = document.createElement("button");
    this.#sellAll = sellAll2;
    sellAll2.className = "sell-all-btn";
    sellAll2.dataset.action = "sell-all";
    this.#totalValue = document.createTextNode("");
    sellAll2.append("Sell Everything for ", this.#totalValue, " gold");
    const emptyText = document.createElement("p");
    this.#emptyText = emptyText;
    emptyText.className = "market-empty";
    emptyText.textContent = "Nothing to sell yet.";
    const inventorySection = document.createElement("section");
    inventorySection.className = "market-inventory-section";
    const heading = document.createElement("h3");
    heading.textContent = "Inventory";
    const productGroup = document.createElement("div");
    this.#productGroup = productGroup;
    productGroup.id = "market-products";
    inventorySection.append(heading, productGroup);
    this.replaceChildren(info, divider, sellAll2, emptyText, inventorySection);
  }
  refresh() {
    if (!this.#used || !this.#progressBar || !this.#sellAll) return;
    const used = totalItems();
    const max = storageMax();
    const pct = Math.min(100, Math.floor(used / max * 100));
    const cost = storageUpgradeCost();
    const withStock = keys(RESOURCES).filter((k) => state.inventory[k] > 0);
    const hasStock = withStock.length > 0;
    const totalValue = withStock.reduce((sum, k) => sum + state.inventory[k] * currentPrice(k), 0);
    this.#used.textContent = used.toLocaleString();
    for (const el of this.#wantsMax) el.textContent = max.toLocaleString();
    this.#pct.textContent = pct.toLocaleString();
    this.#progressBar.ariaValueNow = String(pct);
    this.#progressFill.style.width = `${pct}%`;
    this.#cost.textContent = cost.toLocaleString();
    this.#upgrade.disabled = state.gold < cost;
    this.#next.textContent = nextStorageMax().toLocaleString();
    this.#sellAll.hidden = !hasStock;
    this.#emptyText.hidden = hasStock;
    this.#totalValue.textContent = totalValue.toLocaleString();
    for (const rk of keys(RESOURCES)) {
      const card = getOrInsert(this.#productCards, rk, (key) => {
        const card2 = new MarketProductCard();
        card2.resource = key;
        this.#productGroup.appendChild(card2);
        return card2;
      });
      card.refresh();
    }
  }
};

// src/core/prestige.ts
function prestigeResetSummary() {
  const totalActive = state.quests.active.length;
  const completedCount = state.quests.completed.filter(Boolean).length;
  return {
    totalActive,
    completedCount,
    incomplete: totalActive - completedCount
  };
}
function applyPrestigeReset() {
  record("prestige");
  const { completedCount } = prestigeResetSummary();
  if (completedCount === 0) return;
  for (const [bk, bst] of entries(state.buildings)) {
    if (bst.unlocked && !state.prestige.seenBuildings.includes(bk)) state.prestige.seenBuildings.push(bk);
  }
  for (let i = 0; i < state.quests.active.length; i++) {
    if (!state.quests.completed[i]) continue;
    const qid = state.quests.active[i];
    const def = questById(qid);
    if (def) {
      state.prestige.rewards.push(def.reward);
      if (!state.prestige.completedQuestIds.includes(qid)) state.prestige.completedQuestIds.push(qid);
    }
  }
  const acc = state.prestige.accumulatedStats;
  state.prestige.runs++;
  acc.goldEarned += state.stats.goldEarned;
  acc.storageUpgrades += state.storage.tier;
  acc.treasureChestsOpened += state.stats.treasureChestsOpened ?? 0;
  for (const [bk, bst] of entries(state.buildings)) {
    for (const [pk, pst] of entries(bst.products)) {
      acc.totalSlots += pst.slots.length;
      const key = `${bk}.${pk}`;
      acc.maxSlotsByProduct[key] = Math.max(acc.maxSlotsByProduct[key] ?? 0, pst.slots.length);
      acc.totalSlotsByProduct[key] = (acc.totalSlotsByProduct[key] ?? 0) + pst.slots.length;
    }
  }
  for (const [k, v] of entries(state.stats.soldByResource)) {
    acc.soldByResource[k] = (acc.soldByResource[k] ?? 0) + v;
  }
  const incompleteActive = state.quests.active.filter((_, i) => !state.quests.completed[i]);
  const incompleteBaselines = {};
  for (const id of incompleteActive) {
    if (state.quests.baselines?.[id] !== void 0) incompleteBaselines[id] = state.quests.baselines[id];
  }
  const preservedPrestige = state.prestige;
  setState(freshState());
  state.prestige = preservedPrestige;
  state.quests.active = incompleteActive;
  state.quests.completed = new Array(incompleteActive.length).fill(false);
  state.quests.baselines = incompleteBaselines;
  state.gold = getPrestigeBonus("starting_gold");
  state.lastTick = now();
  resetRuntime();
  emit("prestige:reset");
  drawQuests();
  save();
  requestRender();
  announce(`Run ${(state.prestige.runs + 1).toLocaleString()} started! ${completedCount.toLocaleString()} reward${completedCount === 1 ? "" : "s"} earned.`);
  if (isGameComplete() && !state.prestige.victoryShown) emit("victory");
}
function victoryNewGame() {
  record("newGame");
  const victoryCount = (state.prestige.victoryCount ?? 0) + 1;
  setState(freshState());
  state.prestige.victoryCount = victoryCount;
  resetRuntime();
  emit("victory:newgame");
  drawQuests();
  save();
  requestRender();
  announce("New legacy begun!");
}
function dismissVictory() {
  state.prestige.victoryShown = true;
  save();
}
function resetRuntime() {
  runtime.nextSlotId = 0;
  runtime.stallAnnounced = {};
  runtime.selectedBuilding = "lumber_yard";
}
function computePrestigeSummary() {
  const defs = [
    {
      type: "starting_gold",
      fmt: (n) => `+${n.toLocaleString()} Starting Gold`
    },
    {
      type: "slot_cost_pct",
      isMult: true,
      isDiscount: true,
      fmt: (n) => `Slot Costs -${n.toLocaleString()}%`
    },
    {
      type: "unlock_cost_pct",
      isMult: true,
      isDiscount: true,
      fmt: (n) => `Unlock Costs -${n.toLocaleString()}%`
    },
    {
      type: "build_cost_pct",
      isMult: true,
      isDiscount: true,
      fmt: (n) => `Build Costs -${n.toLocaleString()}%`
    },
    {
      type: "sell_price_pct",
      isMult: true,
      isDiscount: false,
      fmt: (n) => `Sale Prices +${n.toLocaleString()}%`
    },
    {
      type: "storage_tier",
      fmt: (n) => `+${n.toLocaleString()} Starting Storage Tier${n > 1 ? "s" : ""}`
    },
    {
      type: "cycle_speed_pct",
      isMult: true,
      isDiscount: false,
      fmt: (n) => `Production Speed +${n.toLocaleString()}%`
    },
    {
      type: "treasure_gold_pct",
      isMult: true,
      isDiscount: false,
      fmt: (n) => `Treasure Gold +${n.toLocaleString()}%`
    }
  ];
  return defs.map((d) => {
    if (d.isMult) {
      const mult = getPrestigeMult(d.type);
      const val = d.isDiscount ? Math.round((1 - mult) * 100) : Math.round((mult - 1) * 100);
      return val > 0 ? d.fmt(val) : null;
    }
    const total = getPrestigeBonus(d.type);
    return total > 0 ? d.fmt(total) : null;
  }).filter((s) => s !== null);
}

// src/ui/quests-panel.ts
var renderKey = "";
function invalidateQuestsPanel() {
  renderKey = "";
}
function renderQuestsSection() {
  const panel = document.getElementById("panel-quests");
  if (!panel) return;
  const summaryH2 = document.querySelector("#section-quests > summary h2");
  if (summaryH2) summaryH2.textContent = `Quests : Run ${(state.prestige.runs + 1).toLocaleString()}`;
  const structKey = state.quests.active.join(",") + ":" + state.quests.completed.map(Number).join(",") + ":" + state.prestige.runs;
  if (structKey === renderKey && panel.firstChild) {
    updateQuestBars(panel);
    return;
  }
  renderKey = structKey;
  const completedCount = state.quests.completed.filter(Boolean).length;
  const canReset = completedCount >= 1;
  const buildCard = (id, i) => {
    const def = questById(id);
    if (!def) return "";
    const { current, target } = getQuestProgress(def, questBaseline(id, def));
    const done = state.quests.completed[i];
    const isBoolean = def.type === "build" || def.type === "unlock";
    const pct = isBoolean ? done ? 100 : 0 : Math.min(100, Math.floor(current / target * 100));
    const progressRow = done ? "" : isBoolean ? `<div class="quest-progress-row"><span class="quest-prog-text">Not yet</span></div>` : `<div class="quest-progress-row">
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
  const bonusesHtml = bonuses.length === 0 ? `<p class="quest-no-bonuses">No bonuses yet. Complete quests and reset to earn permanent upgrades.</p>` : `<ul class="prestige-bonus-list">${bonuses.map((b) => `<li>${b}</li>`).join("")}</ul>`;
  const resetLabel = completedCount === state.quests.active.length ? "Reset & Collect All Rewards" : `Reset & Collect Rewards (${completedCount} / ${state.quests.active.length} complete)`;
  const warningHtml = canReset && completedCount < state.quests.active.length ? `<p class="reset-warning">${state.quests.active.length - completedCount} quest${state.quests.active.length - completedCount === 1 ? "" : "s"} still incomplete. You will miss those rewards.</p>` : "";
  panel.innerHTML = `
		${inProgressHtml ? `<section class="quest-group"><h3>In Progress</h3><div class="quest-grid">${inProgressHtml}</div></section>` : ""}
		${completedHtml ? `<section class="quest-group"><h3>Completed</h3><div class="quest-grid">${completedHtml}</div></section>` : ""}
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
function updateQuestBars(panel) {
  for (let i = 0; i < state.quests.active.length; i++) {
    if (state.quests.completed[i]) continue;
    const id = state.quests.active[i];
    const def = questById(id);
    if (!def || def.type === "build" || def.type === "unlock") continue;
    const { current, target } = getQuestProgress(def, questBaseline(id, def));
    const pct = Math.min(100, Math.floor(current / target * 100));
    const barEl = panel.querySelector(`[data-quest-bar="${def.id}"]`);
    const txtEl = panel.querySelector(`[data-quest-text="${def.id}"]`);
    if (barEl) {
      barEl.setAttribute("aria-valuenow", String(pct));
      const fill = barEl.querySelector(".quest-bar-fill");
      if (fill) fill.style.width = `${pct}%`;
    }
    if (txtEl) txtEl.textContent = `${formatNum(current)} / ${formatNum(target)}`;
  }
  const cost = rerollCost();
  const canAfford = state.gold >= cost;
  for (const btn of panel.querySelectorAll(".reroll-quest-btn")) btn.disabled = !canAfford;
}

// src/ui/render.ts
var guiState = {
  hud: {
    gold: null,
    storage: null,
    chain: null,
    inventory: null
  },
  production: {
    panel: null,
    unlockSection: null,
    productSection: null,
    chainSection: null
  },
  market: {
    panel: null,
    marketSection: null
  }
};
function announceToDom(msg) {
  const el = document.getElementById("live-announcer");
  if (!el) return;
  el.textContent = msg;
}
function addBuildingOption(bldKey) {
  const sel = document.getElementById("building-select");
  if (!sel || sel.querySelector(`option[value="${bldKey}"]`)) return;
  const opt = document.createElement("option");
  opt.value = bldKey;
  opt.textContent = BUILDINGS[bldKey].label;
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
  const hud = guiState.hud;
  const goldText = `${Math.floor(state.gold).toLocaleString()} gold`;
  const goldEl = hud.gold ??= document.getElementById("hud-gold");
  if (goldEl && goldEl.textContent !== goldText) goldEl.textContent = goldText;
  const storageText = `${totalItems().toLocaleString()}/${storageMax().toLocaleString()} items`;
  const storageEl = hud.storage ??= document.getElementById("hud-storage");
  if (storageEl && storageEl.textContent !== storageText) storageEl.textContent = storageText;
  const inventoryEl = hud.inventory ??= document.getElementById("hud-inventory");
  if (inventoryEl) {
    const invText = entries(state.inventory).filter(([, v]) => v > 0).map(([k, v]) => `${v.toLocaleString()} ${formatResourceName(k, v)}`).join(", ");
    if (inventoryEl.textContent !== invText) inventoryEl.textContent = invText;
  }
  const chainEl = hud.chain ??= document.getElementById("hud-chain");
  if (chainEl) {
    const { hasChain, deficits, efficiencyPct } = getProductionOverview();
    let chainText = "";
    let chainClass = "";
    if (hasChain) {
      if (deficits.length > 0) {
        const names = deficits.slice(0, 2).map((e) => RESOURCES[e.resourceKey].label).join(", ");
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
function renderChainOverview() {
  const { hasChain, balances } = getProductionOverview();
  if (!hasChain) return "";
  const shortages = balances.filter((b) => b.net < -0.05).sort((a, b) => a.net - b.net);
  const surpluses = balances.filter((b) => b.net > 0.05).sort((a, b) => b.net - a.net);
  const sentences = [];
  if (shortages.length > 0) {
    const items = shortages.map((b) => `<li>${RESOURCES[b.resourceKey].label} (need ${Math.abs(b.net).toFixed(1)}/min more)</li>`).join("");
    sentences.push(`<p class="chain-item-neg">Bottleneck:</p><ul class="chain-item-neg">${items}</ul>`);
  }
  if (surpluses.length > 0) {
    const items = surpluses.map((b) => `<li>${RESOURCES[b.resourceKey].label} (+${b.net.toFixed(1)}/min)</li>`).join("");
    sentences.push(`<p class="chain-item-pos">Surplus:</p><ul class="chain-item-pos">${items}</ul>`);
  }
  if (shortages.length === 0 && surpluses.length === 0) sentences.push(`<p>Your production chain is perfectly balanced.</p>`);
  const fixBtn = shortages.length > 0 ? `<button class="chain-fix-btn" data-action="fix-bottleneck">Buy slots to fix bottleneck</button>` : "";
  const suggestion = bestNextPurchase();
  const suggestionHtml = suggestion ? `<p class="chain-suggestion ${suggestion.isDeficit ? "chain-item-neg" : "chain-item-muted"}">${suggestion.isDeficit ? "Suggested fix" : "Best value"}: add a ${suggestion.label} slot (${suggestion.cost.toLocaleString()} gold)</p>` : "";
  return `
		<h3>Production Summary</h3>
		<div class="chain-prose">
			${sentences.join("")}
			${suggestionHtml}
		</div>
		${fixBtn}
	`;
}
function renderBuildingSection() {
  const production = guiState.production;
  const panel = production.panel ??= document.getElementById("panel-production");
  if (!panel) return;
  const bldKey = runtime.selectedBuilding;
  const nextBldKey = nextBuildableBuilding();
  const unlockSection = production.unlockSection ??= (() => {
    const el = document.createElement("div");
    el.className = "unlock-section";
    el.style.marginTop = "0";
    el.style.marginBottom = "var(--space-md)";
    panel.appendChild(el);
    return el;
  })();
  let nextHtml = "No next building";
  if (nextBldKey) {
    const ncfg = BUILDINGS[nextBldKey];
    const ncost = buildCost(nextBldKey);
    nextHtml = `<button class="unlock-product-btn" data-action="build" data-bld="${nextBldKey}" ${state.gold >= ncost ? "" : "disabled"}>
			Build ${ncfg.label} (${ncost === 0 ? "Free" : ncost.toLocaleString() + " gold"})
		</button>`;
  }
  unlockSection.innerHTML = nextHtml;
  const productSection = production.productSection ??= (() => {
    const el = document.createElement("building-section");
    panel.appendChild(el);
    return el;
  })();
  if (bldKey !== null && productSection.getAttribute("bld") !== bldKey) productSection.bld = bldKey;
  productSection.refresh();
  const chainSection = production.chainSection ??= (() => {
    const el = document.createElement("div");
    el.className = "chain-overview";
    panel.appendChild(el);
    return el;
  })();
  chainSection.innerHTML = renderChainOverview();
}
function renderMarketSection() {
  const market = guiState.market;
  const marketSection = market.marketSection ??= (() => {
    const panel = market.panel ??= document.getElementById("panel-market");
    if (!panel) return null;
    const section = new MarketSection();
    panel.replaceChildren(section);
    return section;
  })();
  if (!marketSection) return;
  marketSection.refresh();
}
function renderTreasure() {
  const container = document.getElementById("treasure-container");
  if (!container) return;
  if (state.treasure.activeUntil > now()) {
    if (!container.querySelector("button")) {
      const btn = document.createElement("button");
      btn.className = "treasure-btn";
      btn.dataset.action = "open-treasure";
      btn.textContent = "Open Treasure Chest!";
      container.appendChild(btn);
    }
  } else container.innerHTML = "";
}
function resetProductionPanel() {
  const sel = document.getElementById("building-select");
  if (sel) {
    sel.innerHTML = "";
    addBuildingOption("lumber_yard");
    sel.value = "lumber_yard";
  }
  const panel = guiState.production.panel ?? document.getElementById("panel-production");
  if (panel) panel.innerHTML = "";
  guiState.production = {
    panel: null,
    unlockSection: null,
    productSection: null,
    chainSection: null
  };
}

// src/ui/victory.ts
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
    victories > 0 ? `Times Conquered: ${victories.toLocaleString()}` : null
  ].filter(Boolean);
  const bonusesHtml = bonuses.length > 0 ? `<div>
			<p class="victory-bonuses-title">Permanent Bonuses Earned</p>
			<ul class="victory-bonus-list">${bonuses.map((b) => `<li>${b}</li>`).join("")}</ul>
		</div>` : "";
  el.innerHTML = `
		<div id="victory-content">
			<h2 id="victory-title">Empire Complete!</h2>
			<p class="victory-subtitle">From humble logs to mighty dreadnoughts, you have forged an industrial legacy that spans the ages. The world bows to your craft.</p>
			<div class="victory-stats">${statsLines.map((s) => `<p>${s}</p>`).join("")}</div>
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
function hideVictoryScreen() {
  const el = document.getElementById("victory-overlay");
  if (el) el.hidden = true;
}

// src/core/actions.ts
function unlockBuilding(bldKey) {
  record("build", bldKey);
  const cfg = BUILDINGS[bldKey];
  const bst = state.buildings[bldKey];
  if (bst.unlocked) return;
  if (!buildingPrereqMet(bldKey)) return;
  const cost = buildCost(bldKey);
  if (state.gold < cost) {
    announce(`Need ${cost.toLocaleString()} gold to build ${cfg.label}.`);
    return;
  }
  state.gold -= cost;
  bst.unlocked = true;
  for (const [pk, pcfg] of entries(cfg.products)) {
    if (pcfg.unlockCost === 0 && !pcfg.prereqProduct) bst.products[pk].unlocked = true;
  }
  announce(`${cfg.label} built!`);
  emit("building:built", bldKey);
}
function unlockProduct(bldKey, productKey) {
  record("unlock", bldKey, productKey);
  const pcfg = BUILDINGS[bldKey].products[productKey];
  const pst = state.buildings[bldKey].products[productKey];
  if (pst.unlocked) return;
  if (pcfg.prereqProduct && !state.buildings[bldKey].products[pcfg.prereqProduct].unlocked) return;
  const cost = unlockCost(bldKey, productKey);
  if (state.gold < cost) {
    announce(`Need ${cost.toLocaleString()} gold to unlock ${RESOURCES[pcfg.outputKey].label} production.`);
    return;
  }
  state.gold -= cost;
  pst.unlocked = true;
  announce(`${RESOURCES[pcfg.outputKey].label} production unlocked!`);
  emit("product:unlocked", {
    bldKey,
    productKey
  });
}
function addSlot(bldKey, productKey) {
  record("addSlot", bldKey, productKey);
  const pst = state.buildings[bldKey].products[productKey];
  if (!pst.unlocked) return;
  const cost = nextSlotCost(bldKey, productKey);
  if (state.gold < cost) {
    announce(`Need ${cost.toLocaleString()} gold to add a slot.`);
    return;
  }
  state.gold -= cost;
  pst.slots.push({
    id: ++runtime.nextSlotId,
    progress: 0
  });
  const label = RESOURCES[BUILDINGS[bldKey].products[productKey].outputKey].label;
  announce(`Slot added. ${label} now has ${pst.slots.length.toLocaleString()} slot${pst.slots.length === 1 ? "" : "s"}.`);
  requestRender();
}
function sellSlot(bldKey, productKey) {
  record("sellSlot", bldKey, productKey);
  const pst = state.buildings[bldKey].products[productKey];
  if (pst.slots.length === 0) return;
  const refund = slotRefund(bldKey, productKey);
  pst.slots.pop();
  if (pst.slots.length === 0) delete runtime.stallAnnounced[`${bldKey}-${productKey}`];
  state.gold += refund;
  const label = RESOURCES[BUILDINGS[bldKey].products[productKey].outputKey].label;
  announce(`Slot sold for ${refund.toLocaleString()} gold. ${label} now has ${pst.slots.length.toLocaleString()} slot${pst.slots.length === 1 ? "" : "s"}.`);
  requestRender();
}
function manualProduce(bldKey, productKey) {
  record("manual", bldKey, productKey);
  const pcfg = BUILDINGS[bldKey].products[productKey];
  const pst = state.buildings[bldKey].products[productKey];
  if (pst.manual.active) {
    pst.manual.progress += MANUAL_CLICK_PROGRESS;
    return;
  }
  const inputs = pcfg.inputs;
  const inputSum = Object.values(inputs).reduce((s, n) => s + n, 0);
  const netChange = pcfg.outputAmt - inputSum;
  if (netChange > 0 && totalItems() + netChange > storageMax()) {
    announce("Storage is full.");
    return;
  }
  for (const [inputKey, inputAmt] of entries(inputs)) {
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
  record("storage");
  const cost = storageUpgradeCost();
  if (state.gold < cost) {
    announce(`Need ${cost.toLocaleString()} gold to expand storage.`);
    return;
  }
  state.gold -= cost;
  state.storage.tier++;
  announce(`Storage expanded to ${storageMax().toLocaleString()} items.`);
  requestRender();
}
function sellAll() {
  record("sellAll");
  const resources = keys(RESOURCES).filter((k) => state.inventory[k] > 0);
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
  requestRender();
}
function sellProduct(resourceKey) {
  record("sell", resourceKey);
  const inv = state.inventory[resourceKey];
  if (inv <= 0) return;
  const earned = inv * currentPrice(resourceKey);
  state.inventory[resourceKey] = 0;
  state.stats.soldByResource[resourceKey] = (state.stats.soldByResource[resourceKey] ?? 0) + inv;
  state.stats.goldEarned += earned;
  state.gold += earned;
  announce(`Sold ${inv.toLocaleString()} ${formatResourceName(resourceKey, inv)} for ${earned.toLocaleString()} gold.`);
  requestRender();
}
function toggleProductEnabled(bldKey, productKey) {
  record("toggle", bldKey, productKey);
  const pst = state.buildings[bldKey].products[productKey];
  if (!pst.unlocked) return;
  pst.enabled = !pst.enabled;
  if (!pst.enabled) {
    pst.manual.active = false;
    pst.manual.progress = 0;
  }
  const outputKey = BUILDINGS[bldKey].products[productKey].outputKey;
  announce(`${RESOURCES[outputKey].label} production ${pst.enabled ? "resumed" : "paused"}.`);
  requestRender();
}
function openTreasure() {
  record("treasure");
  if (!state.treasure.activeUntil || now() > state.treasure.activeUntil) return;
  const amount = Math.round(getTreasureBaseValue() * prestigeTreasureMult());
  state.gold += amount;
  state.stats.goldEarned += amount;
  state.stats.treasureChestsOpened++;
  state.treasure.activeUntil = 0;
  announce(`Opened treasure chest for ${amount.toLocaleString()} gold!`);
  requestRender();
}
function doFixBottleneck() {
  record("fixBottleneck");
  let totalBought = 0;
  for (let i = 0; i < 500; i++) {
    const { deficits } = getProductionOverview();
    if (deficits.length === 0) break;
    let bought = false;
    for (const deficit of deficits) {
      let foundBld = null;
      let foundProd = null;
      outer: for (const [bk, bst] of entries(state.buildings)) {
        if (!bst.unlocked) continue;
        for (const [pk, pcfg] of entries(BUILDINGS[bk].products)) {
          if (bst.products[pk].unlocked && pcfg.outputKey === deficit.resourceKey) {
            foundBld = bk;
            foundProd = pk;
            break outer;
          }
        }
      }
      if (!foundBld || !foundProd) continue;
      const cost = nextSlotCost(foundBld, foundProd);
      if (state.gold < cost) continue;
      state.gold -= cost;
      state.buildings[foundBld].products[foundProd].slots.push({
        id: ++runtime.nextSlotId,
        progress: 0
      });
      totalBought++;
      bought = true;
      break;
    }
    if (!bought) break;
  }
  if (totalBought > 0) {
    save();
    requestRender();
    announce(`Bought ${totalBought} slot${totalBought === 1 ? "" : "s"} to fix production bottlenecks.`);
  } else announce("Not enough gold to fix any bottleneck.");
}

// src/ui/settings.ts
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
	</section>
	<section class="settings-section">
		<h3>Session Recording</h3>
		<p class="settings-hint">Every action this session is journalled. Export it to check the balance simulator against a real playthrough.</p>
		<button data-action="export-recording">Export Recording</button>
	</section>`;
}
function saveNow() {
  save();
  announce("Game saved.");
}
function clearSaveData() {
  if (!confirm("Clear all save data and start over? This will reset everything, including prestige rewards.")) return;
  clearSave();
  setState(freshState());
  location.reload();
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
      const merged = {
        ...parsed.state,
        prestige: parsed.prestige
      };
      writeRawSave(JSON.stringify(merged));
    } else {
      writeRawSave(json);
    }
    announce("Save imported. Reloading...");
    setTimeout(() => location.reload(), 800);
  } catch {
    announce("Invalid save data.");
  }
}
function exportRecording() {
  const recording2 = getRecording();
  const box = document.getElementById("save-textarea");
  if (!recording2 || !box) {
    announce("Nothing recorded yet.");
    return;
  }
  box.value = JSON.stringify({
    ...recording2,
    endState: state,
    endedAt: Date.now()
  });
  box.select();
  announce(`Recording of ${entryCount().toLocaleString()} actions ready to copy.`);
}

// src/ui/handlers.ts
function confirmPrestigeReset() {
  const { totalActive, completedCount, incomplete } = prestigeResetSummary();
  if (completedCount === 0) return false;
  const msg = incomplete > 0 ? `Reset with ${completedCount}/${totalActive} quests complete?

You'll miss ${incomplete} reward${incomplete === 1 ? "" : "s"}. You can always keep playing to finish them.` : "All quests complete! Reset and claim your rewards?";
  return confirm(msg);
}
function handleClick(e) {
  const btn = e.target?.closest("button[data-action]");
  if (!btn) return;
  const { action } = btn.dataset;
  const bld = btn.dataset.bld;
  const product = btn.dataset.product;
  switch (action) {
    case "open-treasure":
      openTreasure();
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
      rerollQuest(Number(btn.dataset.index));
      break;
    case "prestige-reset":
      if (confirmPrestigeReset()) applyPrestigeReset();
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
    case "export-recording":
      exportRecording();
      break;
    case "victory-keep-playing":
      dismissVictory();
      hideVictoryScreen();
      break;
    case "victory-new-game":
      if (confirm("Start a brand new game? All progress and prestige rewards will be reset.")) victoryNewGame();
      break;
    case "settings-open":
      document.getElementById("app")?.classList.add("settings-open");
      renderSettingsSection();
      document.querySelector("#settings-back-row button")?.focus();
      break;
    case "settings-back":
      document.getElementById("app")?.classList.remove("settings-open");
      document.getElementById("settings-btn")?.focus();
      break;
  }
}

// src/main.ts
var TICK_MS = 100;
var AUTOSAVE_MS = 5e3;
function wireEvents() {
  on("announce", announceToDom);
  on("render", renderAll);
  on("treasure:change", renderTreasure);
  on("tick", () => {
    renderHUD();
    renderMarketSection();
    renderQuestsSection();
  });
  on("quests:invalidate", invalidateQuestsPanel);
  on("victory", showVictoryScreen);
  on("building:built", (bldKey) => {
    addBuildingOption(bldKey);
    runtime.selectedBuilding = bldKey;
    const sel = document.getElementById("building-select");
    if (sel) sel.value = bldKey;
    document.getElementById("section-production")?.setAttribute("open", "");
    renderAll();
    document.getElementById("building-select")?.focus();
  });
  on("product:unlocked", ({ bldKey, productKey }) => {
    renderAll();
    const addBtn = document.querySelector(`[data-action="add-slot"][data-bld="${bldKey}"][data-product="${productKey}"]`);
    if (addBtn && !addBtn.disabled) addBtn.focus();
    else document.getElementById("building-select")?.focus();
  });
  on("prestige:reset", () => {
    resetProductionPanel();
    invalidateQuestsPanel();
  });
  on("victory:newgame", () => {
    resetProductionPanel();
    hideVictoryScreen();
    invalidateQuestsPanel();
  });
}
function defineComponents() {
  customElements.define("building-product-card", BuildingProductCard);
  customElements.define("building-section", BuildingSection);
  customElements.define("unlock-product-button", UnlockProductButton);
  customElements.define("market-product-card", MarketProductCard);
  customElements.define("market-section", MarketSection);
}
function init() {
  defineComponents();
  wireEvents();
  setBackend(localStorage);
  load();
  const questPoolIds = new Set(QUEST_POOL.map((q) => q.id));
  const hasStaleIds = state.quests.active.some((id) => !questPoolIds.has(id));
  if (state.quests.active.length === 0 || hasStaleIds) drawQuests();
  state.lastTick = now();
  save();
  startRecording(JSON.parse(JSON.stringify(state)), rngState());
  for (const bldKey of Object.keys(BUILDINGS)) if (state.buildings[bldKey].unlocked) addBuildingOption(bldKey);
  const firstBuilt = Object.keys(BUILDINGS).find((k) => state.buildings[k].unlocked);
  runtime.selectedBuilding = firstBuilt ?? null;
  const sel = document.getElementById("building-select");
  if (sel && firstBuilt) sel.value = firstBuilt;
  sel?.addEventListener("change", () => {
    runtime.selectedBuilding = sel.value || null;
    renderBuildingSection();
  });
  renderAll();
  document.addEventListener("click", handleClick);
  setInterval(tick, TICK_MS);
  setInterval(save, AUTOSAVE_MS);
  if (isGameComplete() && !state.prestige.victoryShown) showVictoryScreen();
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
else init();
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vc3JjL2NvbnRlbnQvYnVpbGRpbmdzLnRzIiwgIi4uL3NyYy9jb250ZW50L3F1ZXN0cy50cyIsICIuLi9zcmMvY29udGVudC9yZXNvdXJjZXMudHMiLCAiLi4vc3JjL2NvcmUvY2xvY2sudHMiLCAiLi4vc3JjL2NvcmUvcm5nLnRzIiwgIi4uL3NyYy9jb3JlL2NvbnN0YW50cy50cyIsICIuLi9zcmMvY29yZS9taWdyYXRpb25zLnRzIiwgIi4uL3NyYy9jb3JlL3V0aWwudHMiLCAiLi4vc3JjL2NvcmUvc3RhdGUudHMiLCAiLi4vc3JjL2NvcmUvZXZlbnRzLnRzIiwgIi4uL3NyYy9jb3JlL3N0b3JhZ2UudHMiLCAiLi4vc3JjL2NvcmUvZWNvbm9teS50cyIsICIuLi9zcmMvY29yZS9mb3JtYXQudHMiLCAiLi4vc3JjL2NvcmUvcHJvZHVjdGlvbi50cyIsICIuLi9zcmMvY29yZS90cmVhc3VyZS50cyIsICIuLi9zcmMvY29yZS9zaW0udHMiLCAiLi4vc3JjL2NvcmUvc2F2ZS50cyIsICIuLi9zcmMvY29yZS9qb3VybmFsLnRzIiwgIi4uL3NyYy9jb3JlL3F1ZXN0cy50cyIsICIuLi9zcmMvY29yZS90aWNrLnRzIiwgIi4uL3NyYy91aS9jb21wb25lbnRzLnRzIiwgIi4uL3NyYy9jb3JlL3ByZXN0aWdlLnRzIiwgIi4uL3NyYy91aS9xdWVzdHMtcGFuZWwudHMiLCAiLi4vc3JjL3VpL3JlbmRlci50cyIsICIuLi9zcmMvdWkvdmljdG9yeS50cyIsICIuLi9zcmMvY29yZS9hY3Rpb25zLnRzIiwgIi4uL3NyYy91aS9zZXR0aW5ncy50cyIsICIuLi9zcmMvdWkvaGFuZGxlcnMudHMiLCAiLi4vc3JjL21haW4udHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbIi8vIEJ1aWxkaW5nIGFuZCBwcm9kdWN0IGNhdGFsb2d1ZS4gRGF0YSBvbmx5LlxuaW1wb3J0IHR5cGUgeyBCdWlsZGluZ0NvbmZpZyB9IGZyb20gXCIuLi9jb3JlL3R5cGVzLnRzXCI7XG4vLyBwcmVyZXE6IG51bGwsIG9yIHsgYnVpbGRpbmcsIHByb2R1Y3Q/IH0gdGhhdCBtdXN0IGJlIHVubG9ja2VkIGJlZm9yZSB0aGlzIGJ1aWxkaW5nIGNhbiBiZSBidWlsdC5cblxuZXhwb3J0IGNvbnN0IEJVSUxESU5HX0NPTkZJRyA9IHtcblx0bHVtYmVyX3lhcmQ6IHtcblx0XHRsYWJlbDogXCJMdW1iZXIgWWFyZFwiLFxuXHRcdGRlc2M6IFwiRmVsbHMgdHJlZXMgYW5kIHdvcmtzIHJhdyBsb2dzIGludG8gcHJlY2lzaW9uIHdvb2QgY29tcG9uZW50cy5cIixcblx0XHRidWlsZENvc3Q6IDAsXG5cdFx0c2xvdENvc3RFeHBvbmVudDogMS4yNSxcblx0XHRwcmVyZXE6IG51bGwsXG5cdFx0cHJvZHVjdHM6IHtcblx0XHRcdGxvZ3M6IHtcblx0XHRcdFx0b3V0cHV0S2V5OiBcImxvZ3NcIixcblx0XHRcdFx0b3V0cHV0QW10OiAyLFxuXHRcdFx0XHRpbnB1dHM6IHt9LFxuXHRcdFx0XHRiYXNlQ3ljbGVNczogMjUwMCxcblx0XHRcdFx0dW5sb2NrQ29zdDogMCxcblx0XHRcdFx0YmFzZVNsb3RDb3N0OiA3NSxcblx0XHRcdFx0cHJlcmVxUHJvZHVjdDogbnVsbCxcblx0XHRcdFx0c3RhcnRzVW5sb2NrZWQ6IHRydWUsXG5cdFx0XHR9LFxuXHRcdFx0dGltYmVyOiB7XG5cdFx0XHRcdG91dHB1dEtleTogXCJ0aW1iZXJcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgbG9nczogMiB9LFxuXHRcdFx0XHRiYXNlQ3ljbGVNczogNDAwMCxcblx0XHRcdFx0dW5sb2NrQ29zdDogMTUwLFxuXHRcdFx0XHRiYXNlU2xvdENvc3Q6IDE3NSxcblx0XHRcdFx0cHJlcmVxUHJvZHVjdDogXCJsb2dzXCIsXG5cdFx0XHR9LFxuXHRcdFx0ZG93ZWxzOiB7XG5cdFx0XHRcdG91dHB1dEtleTogXCJkb3dlbHNcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgdGltYmVyOiAxIH0sXG5cdFx0XHRcdGJhc2VDeWNsZU1zOiA2MDAwLFxuXHRcdFx0XHR1bmxvY2tDb3N0OiA3NTAsXG5cdFx0XHRcdGJhc2VTbG90Q29zdDogMzAwLFxuXHRcdFx0XHRwcmVyZXFQcm9kdWN0OiBcInRpbWJlclwiLFxuXHRcdFx0fSxcblx0XHRcdGhhbmRsZXM6IHtcblx0XHRcdFx0b3V0cHV0S2V5OiBcImhhbmRsZXNcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgdGltYmVyOiAxIH0sXG5cdFx0XHRcdGJhc2VDeWNsZU1zOiA4MDAwLFxuXHRcdFx0XHR1bmxvY2tDb3N0OiAxMDAwLFxuXHRcdFx0XHRiYXNlU2xvdENvc3Q6IDYwMCxcblx0XHRcdFx0cHJlcmVxUHJvZHVjdDogXCJ0aW1iZXJcIixcblx0XHRcdH0sXG5cdFx0XHRzaGFmdHM6IHtcblx0XHRcdFx0b3V0cHV0S2V5OiBcInNoYWZ0c1wiLFxuXHRcdFx0XHRvdXRwdXRBbXQ6IDEsXG5cdFx0XHRcdGlucHV0czogeyBoYW5kbGVzOiAxLCBkb3dlbHM6IDEgfSxcblx0XHRcdFx0YmFzZUN5Y2xlTXM6IDE1MDAwLFxuXHRcdFx0XHR1bmxvY2tDb3N0OiAxODAwLFxuXHRcdFx0XHRiYXNlU2xvdENvc3Q6IDEwMDAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IFwiaGFuZGxlc1wiLFxuXHRcdFx0fSxcblx0XHR9LFxuXHR9LFxuXHRzYXdtaWxsOiB7XG5cdFx0bGFiZWw6IFwiU2F3bWlsbFwiLFxuXHRcdGRlc2M6IFwiQ3V0cyByYXcgbG9ncyBpbnRvIHN0cnVjdHVyYWwgbHVtYmVyIGZvciBjb25zdHJ1Y3Rpb24gYW5kIHRyYWRlLlwiLFxuXHRcdGJ1aWxkQ29zdDogMjUwMDAsXG5cdFx0c2xvdENvc3RFeHBvbmVudDogMS4zNSxcblx0XHRwcmVyZXE6IHsgYnVpbGRpbmc6IFwibHVtYmVyX3lhcmRcIiB9LFxuXHRcdHByb2R1Y3RzOiB7XG5cdFx0XHRwbGFua3M6IHtcblx0XHRcdFx0b3V0cHV0S2V5OiBcInBsYW5rc1wiLFxuXHRcdFx0XHRvdXRwdXRBbXQ6IDEsXG5cdFx0XHRcdGlucHV0czogeyBsb2dzOiAxIH0sXG5cdFx0XHRcdGJhc2VDeWNsZU1zOiA1MDAwLFxuXHRcdFx0XHR1bmxvY2tDb3N0OiAwLFxuXHRcdFx0XHRiYXNlU2xvdENvc3Q6IDE1MCxcblx0XHRcdFx0cHJlcmVxUHJvZHVjdDogbnVsbCxcblx0XHRcdFx0c3RhcnRzVW5sb2NrZWQ6IHRydWUsXG5cdFx0XHR9LFxuXHRcdFx0Ym9hcmRzOiB7XG5cdFx0XHRcdG91dHB1dEtleTogXCJib2FyZHNcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgbG9nczogMiB9LFxuXHRcdFx0XHRiYXNlQ3ljbGVNczogMTAwMDAsXG5cdFx0XHRcdHVubG9ja0Nvc3Q6IDUwMCxcblx0XHRcdFx0YmFzZVNsb3RDb3N0OiAzNTAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IFwicGxhbmtzXCIsXG5cdFx0XHR9LFxuXHRcdFx0YmVhbXM6IHtcblx0XHRcdFx0b3V0cHV0S2V5OiBcImJlYW1zXCIsXG5cdFx0XHRcdG91dHB1dEFtdDogMSxcblx0XHRcdFx0aW5wdXRzOiB7IGxvZ3M6IDIgfSxcblx0XHRcdFx0YmFzZUN5Y2xlTXM6IDEyMDAwLFxuXHRcdFx0XHR1bmxvY2tDb3N0OiAxMjAwLFxuXHRcdFx0XHRiYXNlU2xvdENvc3Q6IDcwMCxcblx0XHRcdFx0cHJlcmVxUHJvZHVjdDogXCJib2FyZHNcIixcblx0XHRcdH0sXG5cdFx0fSxcblx0fSxcblx0d29ya3Nob3A6IHtcblx0XHRsYWJlbDogXCJXb3Jrc2hvcFwiLFxuXHRcdGRlc2M6IFwiQ29tYmluZXMgbHVtYmVyIGFuZCBwcmVjaXNpb24gcGFydHMgaW50byBmaW5pc2hlZCBnb29kcyBmb3IgdGhlIGVtcGlyZS5cIixcblx0XHRidWlsZENvc3Q6IDUwMDAwMCxcblx0XHRzbG90Q29zdEV4cG9uZW50OiAxLjI1LFxuXHRcdHByZXJlcTogeyBidWlsZGluZzogXCJzYXdtaWxsXCIsIHByb2R1Y3Q6IFwiYm9hcmRzXCIgfSxcblx0XHRwcm9kdWN0czoge1xuXHRcdFx0Y3JhdGVzOiB7XG5cdFx0XHRcdG91dHB1dEtleTogXCJjcmF0ZXNcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgcGxhbmtzOiAyLCBkb3dlbHM6IDIgfSxcblx0XHRcdFx0YmFzZUN5Y2xlTXM6IDIwMDAwLFxuXHRcdFx0XHR1bmxvY2tDb3N0OiAwLFxuXHRcdFx0XHRiYXNlU2xvdENvc3Q6IDEyMDAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IG51bGwsXG5cdFx0XHRcdHN0YXJ0c1VubG9ja2VkOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdGZ1cm5pdHVyZToge1xuXHRcdFx0XHRvdXRwdXRLZXk6IFwiZnVybml0dXJlXCIsXG5cdFx0XHRcdG91dHB1dEFtdDogMSxcblx0XHRcdFx0aW5wdXRzOiB7IGJvYXJkczogMiwgaGFuZGxlczogMiB9LFxuXHRcdFx0XHRiYXNlQ3ljbGVNczogMzIwMDAsXG5cdFx0XHRcdHVubG9ja0Nvc3Q6IDIwMDAsXG5cdFx0XHRcdGJhc2VTbG90Q29zdDogMjAwMCxcblx0XHRcdFx0cHJlcmVxUHJvZHVjdDogXCJjcmF0ZXNcIixcblx0XHRcdH0sXG5cdFx0XHRjb2FjaGVzOiB7XG5cdFx0XHRcdG91dHB1dEtleTogXCJjb2FjaGVzXCIsXG5cdFx0XHRcdG91dHB1dEFtdDogMSxcblx0XHRcdFx0aW5wdXRzOiB7IGJlYW1zOiAyLCBzaGFmdHM6IDIgfSxcblx0XHRcdFx0YmFzZUN5Y2xlTXM6IDUwMDAwLFxuXHRcdFx0XHR1bmxvY2tDb3N0OiA0NTAwLFxuXHRcdFx0XHRiYXNlU2xvdENvc3Q6IDM1MDAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IFwiZnVybml0dXJlXCIsXG5cdFx0XHR9LFxuXHRcdFx0bWFub3JzOiB7XG5cdFx0XHRcdG91dHB1dEtleTogXCJtYW5vcnNcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgYmVhbXM6IDIsIGJvYXJkczogMiwgc2hhZnRzOiAyIH0sXG5cdFx0XHRcdGJhc2VDeWNsZU1zOiA3MjAwMCxcblx0XHRcdFx0dW5sb2NrQ29zdDogNjAwMCxcblx0XHRcdFx0YmFzZVNsb3RDb3N0OiA1NTAwLFxuXHRcdFx0XHRwcmVyZXFQcm9kdWN0OiBcImNvYWNoZXNcIixcblx0XHRcdH0sXG5cdFx0fSxcblx0fSxcblx0Zm9yZ2U6IHtcblx0XHRsYWJlbDogXCJGb3JnZVwiLFxuXHRcdGRlc2M6IFwiU21lbHRzIHJhdyBpcm9uIG9yZSBpbnRvIGJhcnMgYW5kIHByZWNpc2lvbiBtZXRhbHdvcmsuXCIsXG5cdFx0YnVpbGRDb3N0OiAxMDAwMDAwMCxcblx0XHRzbG90Q29zdEV4cG9uZW50OiAxLjMwLFxuXHRcdHByZXJlcTogeyBidWlsZGluZzogXCJ3b3Jrc2hvcFwiIH0sXG5cdFx0cHJvZHVjdHM6IHtcblx0XHRcdGlyb25fb3JlOiB7XG5cdFx0XHRcdG91dHB1dEtleTogXCJpcm9uX29yZVwiLFxuXHRcdFx0XHRvdXRwdXRBbXQ6IDEsXG5cdFx0XHRcdGlucHV0czoge30sXG5cdFx0XHRcdGJhc2VDeWNsZU1zOiA0MDAwLFxuXHRcdFx0XHR1bmxvY2tDb3N0OiAwLFxuXHRcdFx0XHRiYXNlU2xvdENvc3Q6IDIwMCxcblx0XHRcdFx0cHJlcmVxUHJvZHVjdDogbnVsbCxcblx0XHRcdFx0c3RhcnRzVW5sb2NrZWQ6IHRydWUsXG5cdFx0XHR9LFxuXHRcdFx0aXJvbl9iYXJzOiB7XG5cdFx0XHRcdG91dHB1dEtleTogXCJpcm9uX2JhcnNcIixcblx0XHRcdFx0b3V0cHV0QW10OiAzLFxuXHRcdFx0XHRpbnB1dHM6IHsgaXJvbl9vcmU6IDIgfSxcblx0XHRcdFx0YmFzZUN5Y2xlTXM6IDkwMDAsXG5cdFx0XHRcdHVubG9ja0Nvc3Q6IDUwMCxcblx0XHRcdFx0YmFzZVNsb3RDb3N0OiA2MDAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IFwiaXJvbl9vcmVcIixcblx0XHRcdH0sXG5cdFx0XHRuYWlsczoge1xuXHRcdFx0XHRvdXRwdXRLZXk6IFwibmFpbHNcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgaXJvbl9iYXJzOiAxIH0sXG5cdFx0XHRcdGJhc2VDeWNsZU1zOiA4MDAwLFxuXHRcdFx0XHR1bmxvY2tDb3N0OiAxNTAwLFxuXHRcdFx0XHRiYXNlU2xvdENvc3Q6IDEyMDAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IFwiaXJvbl9iYXJzXCIsXG5cdFx0XHR9LFxuXHRcdFx0aXJvbl9maXR0aW5nczoge1xuXHRcdFx0XHRvdXRwdXRLZXk6IFwiaXJvbl9maXR0aW5nc1wiLFxuXHRcdFx0XHRvdXRwdXRBbXQ6IDEsXG5cdFx0XHRcdGlucHV0czogeyBpcm9uX2JhcnM6IDIgfSxcblx0XHRcdFx0YmFzZUN5Y2xlTXM6IDgwMDAsXG5cdFx0XHRcdHVubG9ja0Nvc3Q6IDQwMDAsXG5cdFx0XHRcdGJhc2VTbG90Q29zdDogMjUwMCxcblx0XHRcdFx0cHJlcmVxUHJvZHVjdDogXCJuYWlsc1wiLFxuXHRcdFx0fSxcblx0XHR9LFxuXHR9LFxuXHRmb3VuZHJ5OiB7XG5cdFx0bGFiZWw6IFwiRm91bmRyeVwiLFxuXHRcdGRlc2M6IFwiQ2FzdHMgY29tcGxleCBtZWNoYW5pc21zIGFuZCBwcmVjaXNpb24gY29tcG9uZW50cyBmcm9tIHJlZmluZWQgaXJvbi5cIixcblx0XHRidWlsZENvc3Q6IDI1MDAwMDAwMCxcblx0XHRzbG90Q29zdEV4cG9uZW50OiAxLjM1LFxuXHRcdHByZXJlcTogeyBidWlsZGluZzogXCJmb3JnZVwiLCBwcm9kdWN0OiBcImlyb25fZml0dGluZ3NcIiB9LFxuXHRcdHByb2R1Y3RzOiB7XG5cdFx0XHRnZWFyczoge1xuXHRcdFx0XHRvdXRwdXRLZXk6IFwiZ2VhcnNcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgaXJvbl9iYXJzOiAxLCBkb3dlbHM6IDEgfSxcblx0XHRcdFx0YmFzZUN5Y2xlTXM6IDMwMDAwLFxuXHRcdFx0XHR1bmxvY2tDb3N0OiAwLFxuXHRcdFx0XHRiYXNlU2xvdENvc3Q6IDM1MDAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IG51bGwsXG5cdFx0XHRcdHN0YXJ0c1VubG9ja2VkOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdHNwcmluZ3M6IHtcblx0XHRcdFx0b3V0cHV0S2V5OiBcInNwcmluZ3NcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgaXJvbl9maXR0aW5nczogMiB9LFxuXHRcdFx0XHRiYXNlQ3ljbGVNczogMjAwMDAsXG5cdFx0XHRcdHVubG9ja0Nvc3Q6IDgwMDAsXG5cdFx0XHRcdGJhc2VTbG90Q29zdDogNTAwMCxcblx0XHRcdFx0cHJlcmVxUHJvZHVjdDogXCJnZWFyc1wiLFxuXHRcdFx0fSxcblx0XHRcdG1lY2hhbmlzbXM6IHtcblx0XHRcdFx0b3V0cHV0S2V5OiBcIm1lY2hhbmlzbXNcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgZ2VhcnM6IDEsIHNwcmluZ3M6IDEgfSxcblx0XHRcdFx0YmFzZUN5Y2xlTXM6IDIyMDAwLFxuXHRcdFx0XHR1bmxvY2tDb3N0OiAxNTAwMCxcblx0XHRcdFx0YmFzZVNsb3RDb3N0OiA4MDAwLFxuXHRcdFx0XHRwcmVyZXFQcm9kdWN0OiBcInNwcmluZ3NcIixcblx0XHRcdH0sXG5cdFx0XHRjbG9ja3dvcms6IHtcblx0XHRcdFx0b3V0cHV0S2V5OiBcImNsb2Nrd29ya1wiLFxuXHRcdFx0XHRvdXRwdXRBbXQ6IDEsXG5cdFx0XHRcdGlucHV0czogeyBtZWNoYW5pc21zOiAxLCBpcm9uX2ZpdHRpbmdzOiAxIH0sXG5cdFx0XHRcdGJhc2VDeWNsZU1zOiA5MDAwMCxcblx0XHRcdFx0dW5sb2NrQ29zdDogMjUwMDAsXG5cdFx0XHRcdGJhc2VTbG90Q29zdDogMTIwMDAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IFwibWVjaGFuaXNtc1wiLFxuXHRcdFx0fSxcblx0XHR9LFxuXHR9LFxuXHRhcm1vdXJ5OiB7XG5cdFx0bGFiZWw6IFwiQXJtb3VyeVwiLFxuXHRcdGRlc2M6IFwiRm9yZ2VzIHdlYXBvbnMgb2Ygd2FyIGZyb20gaXJvbiwgdGltYmVyLCBhbmQgcHJlY2lzaW9uIGNvbXBvbmVudHMuXCIsXG5cdFx0YnVpbGRDb3N0OiA1MDAwMDAwMDAwLFxuXHRcdHNsb3RDb3N0RXhwb25lbnQ6IDEuMzAsXG5cdFx0cHJlcmVxOiB7IGJ1aWxkaW5nOiBcImZvdW5kcnlcIiwgcHJvZHVjdDogXCJtZWNoYW5pc21zXCIgfSxcblx0XHRwcm9kdWN0czoge1xuXHRcdFx0YmxhZGVzOiB7XG5cdFx0XHRcdG91dHB1dEtleTogXCJibGFkZXNcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgaXJvbl9iYXJzOiAyLCB0aW1iZXI6IDEgfSxcblx0XHRcdFx0YmFzZUN5Y2xlTXM6IDIwMDAwLFxuXHRcdFx0XHR1bmxvY2tDb3N0OiAwLFxuXHRcdFx0XHRiYXNlU2xvdENvc3Q6IDYwMDAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IG51bGwsXG5cdFx0XHRcdHN0YXJ0c1VubG9ja2VkOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdGNyb3NzYm93czoge1xuXHRcdFx0XHRvdXRwdXRLZXk6IFwiY3Jvc3Nib3dzXCIsXG5cdFx0XHRcdG91dHB1dEFtdDogMSxcblx0XHRcdFx0aW5wdXRzOiB7IGJvYXJkczogMSwgc2hhZnRzOiAxLCBpcm9uX2ZpdHRpbmdzOiAxIH0sXG5cdFx0XHRcdGJhc2VDeWNsZU1zOiAzNTAwMCxcblx0XHRcdFx0dW5sb2NrQ29zdDogMjAwMDAsXG5cdFx0XHRcdGJhc2VTbG90Q29zdDogMTAwMDAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IFwiYmxhZGVzXCIsXG5cdFx0XHR9LFxuXHRcdFx0Y2Fubm9uczoge1xuXHRcdFx0XHRvdXRwdXRLZXk6IFwiY2Fubm9uc1wiLFxuXHRcdFx0XHRvdXRwdXRBbXQ6IDEsXG5cdFx0XHRcdGlucHV0czogeyBiZWFtczogMiwgaXJvbl9iYXJzOiAyLCBtZWNoYW5pc21zOiAxIH0sXG5cdFx0XHRcdGJhc2VDeWNsZU1zOiA5MDAwMCxcblx0XHRcdFx0dW5sb2NrQ29zdDogNTAwMDAsXG5cdFx0XHRcdGJhc2VTbG90Q29zdDogMTgwMDAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IFwiY3Jvc3Nib3dzXCIsXG5cdFx0XHR9LFxuXHRcdFx0YXJ0aWxsZXJ5OiB7XG5cdFx0XHRcdG91dHB1dEtleTogXCJhcnRpbGxlcnlcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgYmVhbXM6IDMsIG1lY2hhbmlzbXM6IDIsIGNsb2Nrd29yazogMSB9LFxuXHRcdFx0XHRiYXNlQ3ljbGVNczogMTMwMDAwLFxuXHRcdFx0XHR1bmxvY2tDb3N0OiAxMDAwMDAsXG5cdFx0XHRcdGJhc2VTbG90Q29zdDogMzAwMDAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IFwiY2Fubm9uc1wiLFxuXHRcdFx0fSxcblx0XHR9LFxuXHR9LFxuXHRzaGlweWFyZDoge1xuXHRcdGxhYmVsOiBcIlNoaXB5YXJkXCIsXG5cdFx0ZGVzYzogXCJCdWlsZHMgbWlnaHR5IHZlc3NlbHMgZnJvbSB0aW1iZXIsIGlyb24sIGFuZCB0aGUgZmluZXN0IGNvbXBvbmVudHMuXCIsXG5cdFx0YnVpbGRDb3N0OiAxMDAwMDAwMDAwMDAsXG5cdFx0c2xvdENvc3RFeHBvbmVudDogMS4yNSxcblx0XHRwcmVyZXE6IHsgYnVpbGRpbmc6IFwiYXJtb3VyeVwiLCBwcm9kdWN0OiBcImNhbm5vbnNcIiB9LFxuXHRcdHByb2R1Y3RzOiB7XG5cdFx0XHRodWxsczoge1xuXHRcdFx0XHRvdXRwdXRLZXk6IFwiaHVsbHNcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgYmVhbXM6IDMsIGJvYXJkczogMiB9LFxuXHRcdFx0XHRiYXNlQ3ljbGVNczogNjAwMDAsXG5cdFx0XHRcdHVubG9ja0Nvc3Q6IDAsXG5cdFx0XHRcdGJhc2VTbG90Q29zdDogMjIwMDAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IG51bGwsXG5cdFx0XHRcdHN0YXJ0c1VubG9ja2VkOiB0cnVlLFxuXHRcdFx0fSxcblx0XHRcdHJpZ2dpbmc6IHtcblx0XHRcdFx0b3V0cHV0S2V5OiBcInJpZ2dpbmdcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgc2hhZnRzOiAyLCBpcm9uX2ZpdHRpbmdzOiAyIH0sXG5cdFx0XHRcdGJhc2VDeWNsZU1zOiA0NTAwMCxcblx0XHRcdFx0dW5sb2NrQ29zdDogNjAwMDAsXG5cdFx0XHRcdGJhc2VTbG90Q29zdDogMjAwMDAsXG5cdFx0XHRcdHByZXJlcVByb2R1Y3Q6IFwiaHVsbHNcIixcblx0XHRcdH0sXG5cdFx0XHRnYWxsZW9uczoge1xuXHRcdFx0XHRvdXRwdXRLZXk6IFwiZ2FsbGVvbnNcIixcblx0XHRcdFx0b3V0cHV0QW10OiAxLFxuXHRcdFx0XHRpbnB1dHM6IHsgaHVsbHM6IDEsIHJpZ2dpbmc6IDEsIGNhbm5vbnM6IDIgfSxcblx0XHRcdFx0YmFzZUN5Y2xlTXM6IDE4MDAwMCxcblx0XHRcdFx0dW5sb2NrQ29zdDogMTUwMDAwLFxuXHRcdFx0XHRiYXNlU2xvdENvc3Q6IDQ1MDAwLFxuXHRcdFx0XHRwcmVyZXFQcm9kdWN0OiBcInJpZ2dpbmdcIixcblx0XHRcdH0sXG5cdFx0XHRkcmVhZG5vdWdodHM6IHtcblx0XHRcdFx0b3V0cHV0S2V5OiBcImRyZWFkbm91Z2h0c1wiLFxuXHRcdFx0XHRvdXRwdXRBbXQ6IDEsXG5cdFx0XHRcdGlucHV0czogeyBodWxsczogMiwgcmlnZ2luZzogMSwgYXJ0aWxsZXJ5OiAyLCBjbG9ja3dvcms6IDIgfSxcblx0XHRcdFx0YmFzZUN5Y2xlTXM6IDM2MDAwMCxcblx0XHRcdFx0dW5sb2NrQ29zdDogMzUwMDAwLFxuXHRcdFx0XHRiYXNlU2xvdENvc3Q6IDkwMDAwLFxuXHRcdFx0XHRwcmVyZXFQcm9kdWN0OiBcImdhbGxlb25zXCIsXG5cdFx0XHR9LFxuXHRcdH0sXG5cdH0sXG59IHNhdGlzZmllcyBSZWNvcmQ8c3RyaW5nLCBCdWlsZGluZ0NvbmZpZz47XG5cbi8vIFdpZGVuZWQgdmlldyBmb3IgY29kZSB0aGF0IGl0ZXJhdGVzIGJ5IHN0cmluZyBrZXkuIEJVSUxESU5HX0NPTkZJRyBrZWVwcyBpdHMgbGl0ZXJhbFxuLy8gdHlwZXMgc28gQnVpbGRpbmdLZXkgc3RheXMgYSB1bmlvbiBvZiB0aGUgc2V2ZW4gYnVpbGRpbmcgbmFtZXMuXG5leHBvcnQgY29uc3QgQlVJTERJTkdTOiBSZWNvcmQ8c3RyaW5nLCBCdWlsZGluZ0NvbmZpZz4gPSBCVUlMRElOR19DT05GSUc7XG4iLCAiaW1wb3J0IHR5cGUgeyBRdWVzdENoYWluLCBRdWVzdERlZiwgUmV3YXJkIH0gZnJvbSBcIi4uL2NvcmUvdHlwZXMudHNcIjtcblxuLy8gR2VuZXJhdGVzIHRoZSByZXdhcmQgbGFiZWwgc3RyaW5nIGZyb20gYSByZXdhcmQgb2JqZWN0LlxuZXhwb3J0IGZ1bmN0aW9uIHJld2FyZExhYmVsKHI6IFJld2FyZCk6IHN0cmluZyB7XG5cdGlmIChyLnR5cGUgPT09IFwic3RhcnRpbmdfZ29sZFwiKSByZXR1cm4gYCske3IuYW1vdW50LnRvTG9jYWxlU3RyaW5nKCl9IFN0YXJ0aW5nIEdvbGRgO1xuXHRpZiAoci50eXBlID09PSBcInNsb3RfY29zdF9wY3RcIikgcmV0dXJuIGBTbG90IENvc3RzIC0ke3IuYW1vdW50LnRvTG9jYWxlU3RyaW5nKCl9JWA7XG5cdGlmIChyLnR5cGUgPT09IFwidW5sb2NrX2Nvc3RfcGN0XCIpIHJldHVybiBgVW5sb2NrIENvc3RzIC0ke3IuYW1vdW50LnRvTG9jYWxlU3RyaW5nKCl9JWA7XG5cdGlmIChyLnR5cGUgPT09IFwiYnVpbGRfY29zdF9wY3RcIikgcmV0dXJuIGBCdWlsZCBDb3N0cyAtJHtyLmFtb3VudC50b0xvY2FsZVN0cmluZygpfSVgO1xuXHRpZiAoci50eXBlID09PSBcInNlbGxfcHJpY2VfcGN0XCIpIHJldHVybiBgU2FsZSBQcmljZXMgKyR7ci5hbW91bnQudG9Mb2NhbGVTdHJpbmcoKX0lYDtcblx0aWYgKHIudHlwZSA9PT0gXCJzdG9yYWdlX3RpZXJcIikgcmV0dXJuIGArJHtyLmFtb3VudC50b0xvY2FsZVN0cmluZygpfSBTdGFydGluZyBTdG9yYWdlIFRpZXIke3IuYW1vdW50ID4gMSA/IFwic1wiIDogXCJcIn1gO1xuXHRpZiAoci50eXBlID09PSBcImN5Y2xlX3NwZWVkX3BjdFwiKSByZXR1cm4gYFByb2R1Y3Rpb24gU3BlZWQgKyR7ci5hbW91bnQudG9Mb2NhbGVTdHJpbmcoKX0lYDtcblx0aWYgKHIudHlwZSA9PT0gXCJ0cmVhc3VyZV9nb2xkX3BjdFwiKSByZXR1cm4gYFRyZWFzdXJlIEdvbGQgKyR7ci5hbW91bnQudG9Mb2NhbGVTdHJpbmcoKX0lYDtcblx0cmV0dXJuIFwiXCI7XG59XG5cbi8vIEVhY2ggY2hhaW4gaGFzIG9yZGVyZWQgdGllcnMuIENvbXBsZXRpbmcgYSB0aWVyIHVubG9ja3MgdGhlIG5leHQgb25lLiBUaGUgYWN0aXZlIHF1ZXN0IHBvb2wgaXMgZHJhd24gZnJvbSB0aGUgY3VycmVudCBmcm9udGllciBvZiBlYWNoIGNoYWluLlxuLy8gcHJlcmVxOiBidWlsZGluZyBrZXkgdGhhdCBtdXN0IGFwcGVhciBpbiBwcmVzdGlnZS5zZWVuQnVpbGRpbmdzIGJlZm9yZSB0aGlzIGNoYWluIGlzIG9mZmVyZWQuXG5leHBvcnQgY29uc3QgUVVFU1RfQ0hBSU5TOiBRdWVzdENoYWluW10gPSBbXG5cdHtcblx0XHRpZDogXCJzZWxsX2xvZ3NcIixcblx0XHR0eXBlOiBcInNlbGxcIixcblx0XHRyZXNvdXJjZTogXCJsb2dzXCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiA0MDAsIGxhYmVsOiBcIlNlbGwgNDAwIExvZ3NcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2xvdF9jb3N0X3BjdFwiLCBhbW91bnQ6IDEwIH0gfSxcblx0XHRcdHsgdGFyZ2V0OiAxMDAwLCBsYWJlbDogXCJTZWxsIDEsMDAwIExvZ3NcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2VsbF9wcmljZV9wY3RcIiwgYW1vdW50OiAxMCB9IH0sXG5cdFx0XHR7IHRhcmdldDogMzAwMCwgbGFiZWw6IFwiU2VsbCAzLDAwMCBMb2dzXCIsIHJld2FyZDogeyB0eXBlOiBcInNsb3RfY29zdF9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XHR7IHRhcmdldDogODAwMCwgbGFiZWw6IFwiU2VsbCA4LDAwMCBMb2dzXCIsIHJld2FyZDogeyB0eXBlOiBcInNsb3RfY29zdF9wY3RcIiwgYW1vdW50OiAxMCB9IH0sXG5cdFx0XSxcblx0fSxcblx0e1xuXHRcdGlkOiBcInNlbGxfdGltYmVyXCIsXG5cdFx0dHlwZTogXCJzZWxsXCIsXG5cdFx0cmVzb3VyY2U6IFwidGltYmVyXCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiAyMDAsIGxhYmVsOiBcIlNlbGwgMjAwIFRpbWJlclwiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDEwIH0gfSxcblx0XHRcdHsgdGFyZ2V0OiA2MDAsIGxhYmVsOiBcIlNlbGwgNjAwIFRpbWJlclwiLCByZXdhcmQ6IHsgdHlwZTogXCJzbG90X2Nvc3RfcGN0XCIsIGFtb3VudDogMTAgfSB9LFxuXHRcdFx0eyB0YXJnZXQ6IDIwMDAsIGxhYmVsOiBcIlNlbGwgMiwwMDAgVGltYmVyXCIsIHJld2FyZDogeyB0eXBlOiBcInVubG9ja19jb3N0X3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRdLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwic2VsbF9kb3dlbHNcIixcblx0XHR0eXBlOiBcInNlbGxcIixcblx0XHRyZXNvdXJjZTogXCJkb3dlbHNcIixcblx0XHR0aWVyczogW1xuXHRcdFx0eyB0YXJnZXQ6IDIwMCwgbGFiZWw6IFwiU2VsbCAyMDAgRG93ZWxzXCIsIHJld2FyZDogeyB0eXBlOiBcInVubG9ja19jb3N0X3BjdFwiLCBhbW91bnQ6IDEwIH0gfSxcblx0XHRcdHsgdGFyZ2V0OiA2MDAsIGxhYmVsOiBcIlNlbGwgNjAwIERvd2Vsc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDEwIH0gfSxcblx0XHRdLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwic2VsbF9oYW5kbGVzXCIsXG5cdFx0dHlwZTogXCJzZWxsXCIsXG5cdFx0cmVzb3VyY2U6IFwiaGFuZGxlc1wiLFxuXHRcdHRpZXJzOiBbXG5cdFx0XHR7IHRhcmdldDogMjAwLCBsYWJlbDogXCJTZWxsIDIwMCBIYW5kbGVzXCIsIHJld2FyZDogeyB0eXBlOiBcInVubG9ja19jb3N0X3BjdFwiLCBhbW91bnQ6IDEwIH0gfSxcblx0XHRcdHsgdGFyZ2V0OiA2MDAsIGxhYmVsOiBcIlNlbGwgNjAwIEhhbmRsZXNcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2VsbF9wcmljZV9wY3RcIiwgYW1vdW50OiAxMCB9IH0sXG5cdFx0XSxcblx0fSxcblx0e1xuXHRcdGlkOiBcInNlbGxfc2hhZnRzXCIsXG5cdFx0dHlwZTogXCJzZWxsXCIsXG5cdFx0cmVzb3VyY2U6IFwic2hhZnRzXCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiAxMDAsIGxhYmVsOiBcIlNlbGwgMTAwIFNoYWZ0c1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRcdHsgdGFyZ2V0OiAzMDAsIGxhYmVsOiBcIlNlbGwgMzAwIFNoYWZ0c1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRdLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwic2VsbF9wbGFua3NcIixcblx0XHR0eXBlOiBcInNlbGxcIixcblx0XHRyZXNvdXJjZTogXCJwbGFua3NcIixcblx0XHRwcmVyZXE6IFwic2F3bWlsbFwiLFxuXHRcdHRpZXJzOiBbXG5cdFx0XHR7IHRhcmdldDogMjAwLCBsYWJlbDogXCJTZWxsIDIwMCBQbGFua3NcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2xvdF9jb3N0X3BjdFwiLCBhbW91bnQ6IDEwIH0gfSxcblx0XHRcdHsgdGFyZ2V0OiA4MDAsIGxhYmVsOiBcIlNlbGwgODAwIFBsYW5rc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJ1bmxvY2tfY29zdF9wY3RcIiwgYW1vdW50OiAxMCB9IH0sXG5cdFx0XHR7IHRhcmdldDogMjAwMCwgbGFiZWw6IFwiU2VsbCAyLDAwMCBQbGFua3NcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2xvdF9jb3N0X3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRdLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwic2VsbF9ib2FyZHNcIixcblx0XHR0eXBlOiBcInNlbGxcIixcblx0XHRyZXNvdXJjZTogXCJib2FyZHNcIixcblx0XHRwcmVyZXE6IFwic2F3bWlsbFwiLFxuXHRcdHRpZXJzOiBbXG5cdFx0XHR7IHRhcmdldDogMTAwLCBsYWJlbDogXCJTZWxsIDEwMCBCb2FyZHNcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2VsbF9wcmljZV9wY3RcIiwgYW1vdW50OiAxMCB9IH0sXG5cdFx0XHR7IHRhcmdldDogNDAwLCBsYWJlbDogXCJTZWxsIDQwMCBCb2FyZHNcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2xvdF9jb3N0X3BjdFwiLCBhbW91bnQ6IDEwIH0gfSxcblx0XHRcdHsgdGFyZ2V0OiAxMjAwLCBsYWJlbDogXCJTZWxsIDEsMjAwIEJvYXJkc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRdLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwic2VsbF9iZWFtc1wiLFxuXHRcdHR5cGU6IFwic2VsbFwiLFxuXHRcdHJlc291cmNlOiBcImJlYW1zXCIsXG5cdFx0cHJlcmVxOiBcInNhd21pbGxcIixcblx0XHR0aWVyczogW1xuXHRcdFx0eyB0YXJnZXQ6IDEwMCwgbGFiZWw6IFwiU2VsbCAxMDAgQmVhbXNcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2VsbF9wcmljZV9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XHR7IHRhcmdldDogMzAwLCBsYWJlbDogXCJTZWxsIDMwMCBCZWFtc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJ1bmxvY2tfY29zdF9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XHR7IHRhcmdldDogODAwLCBsYWJlbDogXCJTZWxsIDgwMCBCZWFtc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzbG90X2Nvc3RfcGN0XCIsIGFtb3VudDogMTUgfSB9LFxuXHRcdF0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJzZWxsX2NyYXRlc1wiLFxuXHRcdHR5cGU6IFwic2VsbFwiLFxuXHRcdHJlc291cmNlOiBcImNyYXRlc1wiLFxuXHRcdHByZXJlcTogXCJ3b3Jrc2hvcFwiLFxuXHRcdHRpZXJzOiBbXG5cdFx0XHR7IHRhcmdldDogMTAwLCBsYWJlbDogXCJTZWxsIDEwMCBDcmF0ZXNcIiwgcmV3YXJkOiB7IHR5cGU6IFwic3RvcmFnZV90aWVyXCIsIGFtb3VudDogMTAgfSB9LFxuXHRcdFx0eyB0YXJnZXQ6IDQwMCwgbGFiZWw6IFwiU2VsbCA0MDAgQ3JhdGVzXCIsIHJld2FyZDogeyB0eXBlOiBcInNsb3RfY29zdF9wY3RcIiwgYW1vdW50OiAxMCB9IH0sXG5cdFx0XHR7IHRhcmdldDogMTAwMCwgbGFiZWw6IFwiU2VsbCAxLDAwMCBDcmF0ZXNcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2xvdF9jb3N0X3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRdLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwic2VsbF9mdXJuaXR1cmVcIixcblx0XHR0eXBlOiBcInNlbGxcIixcblx0XHRyZXNvdXJjZTogXCJmdXJuaXR1cmVcIixcblx0XHRwcmVyZXE6IFwid29ya3Nob3BcIixcblx0XHR0aWVyczogW1xuXHRcdFx0eyB0YXJnZXQ6IDYwLCBsYWJlbDogXCJTZWxsIDYwIEZ1cm5pdHVyZVwiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRcdHsgdGFyZ2V0OiAyMDAsIGxhYmVsOiBcIlNlbGwgMjAwIEZ1cm5pdHVyZVwiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDEwIH0gfSxcblx0XHRcdHsgdGFyZ2V0OiA1MDAsIGxhYmVsOiBcIlNlbGwgNTAwIEZ1cm5pdHVyZVwiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRdLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwic2VsbF9jb2FjaGVzXCIsXG5cdFx0dHlwZTogXCJzZWxsXCIsXG5cdFx0cmVzb3VyY2U6IFwiY29hY2hlc1wiLFxuXHRcdHByZXJlcTogXCJ3b3Jrc2hvcFwiLFxuXHRcdHRpZXJzOiBbXG5cdFx0XHR7IHRhcmdldDogNDAsIGxhYmVsOiBcIlNlbGwgNDAgQ29hY2hlc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJidWlsZF9jb3N0X3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRcdHsgdGFyZ2V0OiAxNjAsIGxhYmVsOiBcIlNlbGwgMTYwIENvYWNoZXNcIiwgcmV3YXJkOiB7IHR5cGU6IFwiYnVpbGRfY29zdF9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XSxcblx0fSxcblx0e1xuXHRcdGlkOiBcInNlbGxfbWFub3JzXCIsXG5cdFx0dHlwZTogXCJzZWxsXCIsXG5cdFx0cmVzb3VyY2U6IFwibWFub3JzXCIsXG5cdFx0cHJlcmVxOiBcIndvcmtzaG9wXCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiAyMCwgbGFiZWw6IFwiU2VsbCAyMCBNYW5vcnNcIiwgcmV3YXJkOiB7IHR5cGU6IFwiY3ljbGVfc3BlZWRfcGN0XCIsIGFtb3VudDogMTUgfSB9LFxuXHRcdFx0eyB0YXJnZXQ6IDgwLCBsYWJlbDogXCJTZWxsIDgwIE1hbm9yc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDEwIH0gfSxcblx0XHRdLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwic2VsbF9pcm9uX29yZVwiLFxuXHRcdHR5cGU6IFwic2VsbFwiLFxuXHRcdHJlc291cmNlOiBcImlyb25fb3JlXCIsXG5cdFx0cHJlcmVxOiBcImZvcmdlXCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiA1MDAsIGxhYmVsOiBcIlNlbGwgNTAwIElyb24gT3JlXCIsIHJld2FyZDogeyB0eXBlOiBcInNsb3RfY29zdF9wY3RcIiwgYW1vdW50OiAxMCB9IH0sXG5cdFx0XHR7IHRhcmdldDogMTYwMCwgbGFiZWw6IFwiU2VsbCAxLDYwMCBJcm9uIE9yZVwiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDEwIH0gfSxcblx0XHRcdHsgdGFyZ2V0OiA0MDAwLCBsYWJlbDogXCJTZWxsIDQsMDAwIElyb24gT3JlXCIsIHJld2FyZDogeyB0eXBlOiBcInNsb3RfY29zdF9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XSxcblx0fSxcblx0e1xuXHRcdGlkOiBcInNlbGxfaXJvbl9iYXJzXCIsXG5cdFx0dHlwZTogXCJzZWxsXCIsXG5cdFx0cmVzb3VyY2U6IFwiaXJvbl9iYXJzXCIsXG5cdFx0cHJlcmVxOiBcImZvcmdlXCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiAxMDAsIGxhYmVsOiBcIlNlbGwgMTAwIElyb24gQmFyc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDEwIH0gfSxcblx0XHRcdHsgdGFyZ2V0OiA1MDAsIGxhYmVsOiBcIlNlbGwgNTAwIElyb24gQmFyc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzbG90X2Nvc3RfcGN0XCIsIGFtb3VudDogMTAgfSB9LFxuXHRcdFx0eyB0YXJnZXQ6IDEyMDAsIGxhYmVsOiBcIlNlbGwgMSwyMDAgSXJvbiBCYXJzXCIsIHJld2FyZDogeyB0eXBlOiBcInVubG9ja19jb3N0X3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRdLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwic2VsbF9uYWlsc1wiLFxuXHRcdHR5cGU6IFwic2VsbFwiLFxuXHRcdHJlc291cmNlOiBcIm5haWxzXCIsXG5cdFx0cHJlcmVxOiBcImZvcmdlXCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiAyMDAsIGxhYmVsOiBcIlNlbGwgMjAwIE5haWxzXCIsIHJld2FyZDogeyB0eXBlOiBcInNsb3RfY29zdF9wY3RcIiwgYW1vdW50OiAxMCB9IH0sXG5cdFx0XHR7IHRhcmdldDogNjAwLCBsYWJlbDogXCJTZWxsIDYwMCBOYWlsc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzbG90X2Nvc3RfcGN0XCIsIGFtb3VudDogMTAgfSB9LFxuXHRcdF0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJzZWxsX2ZpdHRpbmdzXCIsXG5cdFx0dHlwZTogXCJzZWxsXCIsXG5cdFx0cmVzb3VyY2U6IFwiaXJvbl9maXR0aW5nc1wiLFxuXHRcdHByZXJlcTogXCJmb3JnZVwiLFxuXHRcdHRpZXJzOiBbXG5cdFx0XHR7IHRhcmdldDogMTAwLCBsYWJlbDogXCJTZWxsIDEwMCBJcm9uIEZpdHRpbmdzXCIsIHJld2FyZDogeyB0eXBlOiBcInVubG9ja19jb3N0X3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRcdHsgdGFyZ2V0OiAzMDAsIGxhYmVsOiBcIlNlbGwgMzAwIElyb24gRml0dGluZ3NcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2VsbF9wcmljZV9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XSxcblx0fSxcblx0e1xuXHRcdGlkOiBcInNlbGxfZ2VhcnNcIixcblx0XHR0eXBlOiBcInNlbGxcIixcblx0XHRyZXNvdXJjZTogXCJnZWFyc1wiLFxuXHRcdHByZXJlcTogXCJmb3VuZHJ5XCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiA2MCwgbGFiZWw6IFwiU2VsbCA2MCBHZWFyc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJidWlsZF9jb3N0X3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRcdHsgdGFyZ2V0OiAyMDAsIGxhYmVsOiBcIlNlbGwgMjAwIEdlYXJzXCIsIHJld2FyZDogeyB0eXBlOiBcInNlbGxfcHJpY2VfcGN0XCIsIGFtb3VudDogMTAgfSB9LFxuXHRcdF0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJzZWxsX3NwcmluZ3NcIixcblx0XHR0eXBlOiBcInNlbGxcIixcblx0XHRyZXNvdXJjZTogXCJzcHJpbmdzXCIsXG5cdFx0cHJlcmVxOiBcImZvdW5kcnlcIixcblx0XHR0aWVyczogW1xuXHRcdFx0eyB0YXJnZXQ6IDYwLCBsYWJlbDogXCJTZWxsIDYwIFNwcmluZ3NcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2VsbF9wcmljZV9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XHR7IHRhcmdldDogMTYwLCBsYWJlbDogXCJTZWxsIDE2MCBTcHJpbmdzXCIsIHJld2FyZDogeyB0eXBlOiBcInNlbGxfcHJpY2VfcGN0XCIsIGFtb3VudDogMTUgfSB9LFxuXHRcdF0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJzZWxsX21lY2hhbmlzbXNcIixcblx0XHR0eXBlOiBcInNlbGxcIixcblx0XHRyZXNvdXJjZTogXCJtZWNoYW5pc21zXCIsXG5cdFx0cHJlcmVxOiBcImZvdW5kcnlcIixcblx0XHR0aWVyczogW1xuXHRcdFx0eyB0YXJnZXQ6IDQwLCBsYWJlbDogXCJTZWxsIDQwIE1lY2hhbmlzbXNcIiwgcmV3YXJkOiB7IHR5cGU6IFwiYnVpbGRfY29zdF9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XHR7IHRhcmdldDogMTIwLCBsYWJlbDogXCJTZWxsIDEyMCBNZWNoYW5pc21zXCIsIHJld2FyZDogeyB0eXBlOiBcImJ1aWxkX2Nvc3RfcGN0XCIsIGFtb3VudDogMTUgfSB9LFxuXHRcdF0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJzZWxsX2Nsb2Nrd29ya1wiLFxuXHRcdHR5cGU6IFwic2VsbFwiLFxuXHRcdHJlc291cmNlOiBcImNsb2Nrd29ya1wiLFxuXHRcdHByZXJlcTogXCJmb3VuZHJ5XCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiAyMCwgbGFiZWw6IFwiU2VsbCAyMCBDbG9ja3dvcmtcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2xvdF9jb3N0X3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRcdHsgdGFyZ2V0OiA2MCwgbGFiZWw6IFwiU2VsbCA2MCBDbG9ja3dvcmtcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2xvdF9jb3N0X3BjdFwiLCBhbW91bnQ6IDI1IH0gfSxcblx0XHRdLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwic2VsbF9ibGFkZXNcIixcblx0XHR0eXBlOiBcInNlbGxcIixcblx0XHRyZXNvdXJjZTogXCJibGFkZXNcIixcblx0XHRwcmVyZXE6IFwiYXJtb3VyeVwiLFxuXHRcdHRpZXJzOiBbXG5cdFx0XHR7IHRhcmdldDogNjAsIGxhYmVsOiBcIlNlbGwgNjAgQmxhZGVzXCIsIHJld2FyZDogeyB0eXBlOiBcInNlbGxfcHJpY2VfcGN0XCIsIGFtb3VudDogMTUgfSB9LFxuXHRcdFx0eyB0YXJnZXQ6IDIwMCwgbGFiZWw6IFwiU2VsbCAyMDAgQmxhZGVzXCIsIHJld2FyZDogeyB0eXBlOiBcInNlbGxfcHJpY2VfcGN0XCIsIGFtb3VudDogMTAgfSB9LFxuXHRcdF0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJzZWxsX2Nyb3NzYm93c1wiLFxuXHRcdHR5cGU6IFwic2VsbFwiLFxuXHRcdHJlc291cmNlOiBcImNyb3NzYm93c1wiLFxuXHRcdHByZXJlcTogXCJhcm1vdXJ5XCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiA0MCwgbGFiZWw6IFwiU2VsbCA0MCBDcm9zc2Jvd3NcIiwgcmV3YXJkOiB7IHR5cGU6IFwiY3ljbGVfc3BlZWRfcGN0XCIsIGFtb3VudDogMTUgfSB9LFxuXHRcdFx0eyB0YXJnZXQ6IDEwMCwgbGFiZWw6IFwiU2VsbCAxMDAgQ3Jvc3Nib3dzXCIsIHJld2FyZDogeyB0eXBlOiBcInNlbGxfcHJpY2VfcGN0XCIsIGFtb3VudDogMTUgfSB9LFxuXHRcdF0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJzZWxsX2Nhbm5vbnNcIixcblx0XHR0eXBlOiBcInNlbGxcIixcblx0XHRyZXNvdXJjZTogXCJjYW5ub25zXCIsXG5cdFx0cHJlcmVxOiBcImFybW91cnlcIixcblx0XHR0aWVyczogW1xuXHRcdFx0eyB0YXJnZXQ6IDIwLCBsYWJlbDogXCJTZWxsIDIwIENhbm5vblwiLCByZXdhcmQ6IHsgdHlwZTogXCJidWlsZF9jb3N0X3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRcdHsgdGFyZ2V0OiA2MCwgbGFiZWw6IFwiU2VsbCA2MCBDYW5ub25zXCIsIHJld2FyZDogeyB0eXBlOiBcImJ1aWxkX2Nvc3RfcGN0XCIsIGFtb3VudDogMjUgfSB9LFxuXHRcdF0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJzZWxsX2FydGlsbGVyeVwiLFxuXHRcdHR5cGU6IFwic2VsbFwiLFxuXHRcdHJlc291cmNlOiBcImFydGlsbGVyeVwiLFxuXHRcdHByZXJlcTogXCJhcm1vdXJ5XCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiAyMCwgbGFiZWw6IFwiU2VsbCAyMCBBcnRpbGxlcnlcIiwgcmV3YXJkOiB7IHR5cGU6IFwiY3ljbGVfc3BlZWRfcGN0XCIsIGFtb3VudDogMTAgfSB9LFxuXHRcdFx0eyB0YXJnZXQ6IDQwLCBsYWJlbDogXCJTZWxsIDQwIEFydGlsbGVyeVwiLCByZXdhcmQ6IHsgdHlwZTogXCJjeWNsZV9zcGVlZF9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XSxcblx0fSxcblx0e1xuXHRcdGlkOiBcInNlbGxfaHVsbHNcIixcblx0XHR0eXBlOiBcInNlbGxcIixcblx0XHRyZXNvdXJjZTogXCJodWxsc1wiLFxuXHRcdHByZXJlcTogXCJzaGlweWFyZFwiLFxuXHRcdHRpZXJzOiBbXG5cdFx0XHR7IHRhcmdldDogNDAsIGxhYmVsOiBcIlNlbGwgNDAgSHVsbHNcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2VsbF9wcmljZV9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XHR7IHRhcmdldDogMTAwLCBsYWJlbDogXCJTZWxsIDEwMCBIdWxsc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRdLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwic2VsbF9yaWdnaW5nXCIsXG5cdFx0dHlwZTogXCJzZWxsXCIsXG5cdFx0cmVzb3VyY2U6IFwicmlnZ2luZ1wiLFxuXHRcdHByZXJlcTogXCJzaGlweWFyZFwiLFxuXHRcdHRpZXJzOiBbXG5cdFx0XHR7IHRhcmdldDogNDAsIGxhYmVsOiBcIlNlbGwgNDAgUmlnZ2luZ1wiLCByZXdhcmQ6IHsgdHlwZTogXCJjeWNsZV9zcGVlZF9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XHR7IHRhcmdldDogMTAwLCBsYWJlbDogXCJTZWxsIDEwMCBSaWdnaW5nXCIsIHJld2FyZDogeyB0eXBlOiBcInNlbGxfcHJpY2VfcGN0XCIsIGFtb3VudDogMTAgfSB9LFxuXHRcdF0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJzZWxsX2dhbGxlb25zXCIsXG5cdFx0dHlwZTogXCJzZWxsXCIsXG5cdFx0cmVzb3VyY2U6IFwiZ2FsbGVvbnNcIixcblx0XHRwcmVyZXE6IFwic2hpcHlhcmRcIixcblx0XHR0aWVyczogW1xuXHRcdFx0eyB0YXJnZXQ6IDIwLCBsYWJlbDogXCJTZWxsIDIwIEdhbGxlb25zXCIsIHJld2FyZDogeyB0eXBlOiBcImN5Y2xlX3NwZWVkX3BjdFwiLCBhbW91bnQ6IDEwIH0gfSxcblx0XHRcdHsgdGFyZ2V0OiA0MCwgbGFiZWw6IFwiU2VsbCA0MCBHYWxsZW9uc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDI1IH0gfSxcblx0XHRdLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwic2VsbF9kcmVhZG5vdWdodHNcIixcblx0XHR0eXBlOiBcInNlbGxcIixcblx0XHRyZXNvdXJjZTogXCJkcmVhZG5vdWdodHNcIixcblx0XHRwcmVyZXE6IFwic2hpcHlhcmRcIixcblx0XHR0aWVyczogW1xuXHRcdFx0eyB0YXJnZXQ6IDIwLCBsYWJlbDogXCJTZWxsIDIwIERyZWFkbm91Z2h0c1wiLCByZXdhcmQ6IHsgdHlwZTogXCJjeWNsZV9zcGVlZF9wY3RcIiwgYW1vdW50OiAyNSB9IH0sXG5cdFx0XSxcblx0fSxcblx0e1xuXHRcdGlkOiBcInNsb3RzX2xvZ3NcIixcblx0XHR0eXBlOiBcInNsb3RzXCIsXG5cdFx0YmxkOiBcImx1bWJlcl95YXJkXCIsXG5cdFx0cHJvZHVjdDogXCJsb2dzXCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiA2MCwgbGFiZWw6IFwiQnV5IDYwIExvZyBTbG90c1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzbG90X2Nvc3RfcGN0XCIsIGFtb3VudDogMTUgfSB9LFxuXHRcdFx0eyB0YXJnZXQ6IDEwMCwgbGFiZWw6IFwiQnV5IDEwMCBMb2cgU2xvdHNcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2xvdF9jb3N0X3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRcdHsgdGFyZ2V0OiAxNjAsIGxhYmVsOiBcIkJ1eSAxNjAgTG9nIFNsb3RzXCIsIHJld2FyZDogeyB0eXBlOiBcInNlbGxfcHJpY2VfcGN0XCIsIGFtb3VudDogMTUgfSB9LFxuXHRcdF0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJzbG90c19pcm9uX29yZVwiLFxuXHRcdHR5cGU6IFwic2xvdHNcIixcblx0XHRibGQ6IFwiZm9yZ2VcIixcblx0XHRwcm9kdWN0OiBcImlyb25fb3JlXCIsXG5cdFx0cHJlcmVxOiBcImZvcmdlXCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiA2MCwgbGFiZWw6IFwiQnV5IDYwIElyb24gT3JlIFNsb3RzXCIsIHJld2FyZDogeyB0eXBlOiBcInNsb3RfY29zdF9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XHR7IHRhcmdldDogMTAwLCBsYWJlbDogXCJCdXkgMTAwIElyb24gT3JlIFNsb3RzXCIsIHJld2FyZDogeyB0eXBlOiBcInNsb3RfY29zdF9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XHR7IHRhcmdldDogMTYwLCBsYWJlbDogXCJCdXkgMTYwIElyb24gT3JlIFNsb3RzXCIsIHJld2FyZDogeyB0eXBlOiBcInNlbGxfcHJpY2VfcGN0XCIsIGFtb3VudDogMTUgfSB9LFxuXHRcdF0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJzbG90c190aW1iZXJcIixcblx0XHR0eXBlOiBcInNsb3RzXCIsXG5cdFx0YmxkOiBcImx1bWJlcl95YXJkXCIsXG5cdFx0cHJvZHVjdDogXCJ0aW1iZXJcIixcblx0XHR0aWVyczogW1xuXHRcdFx0eyB0YXJnZXQ6IDYwLCBsYWJlbDogXCJCdXkgNjAgVGltYmVyIFNsb3RzXCIsIHJld2FyZDogeyB0eXBlOiBcInNsb3RfY29zdF9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XHR7IHRhcmdldDogMTAwLCBsYWJlbDogXCJCdXkgMTAwIFRpbWJlciBTbG90c1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzbG90X2Nvc3RfcGN0XCIsIGFtb3VudDogMTUgfSB9LFxuXHRcdF0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJ0b3RhbF9zbG90c1wiLFxuXHRcdHR5cGU6IFwidG90YWxfc2xvdHNcIixcblx0XHR0aWVyczogW1xuXHRcdFx0eyB0YXJnZXQ6IDIwMCwgbGFiZWw6IFwiQnV5IDIwMCBTbG90cyBUb3RhbFwiLCByZXdhcmQ6IHsgdHlwZTogXCJzbG90X2Nvc3RfcGN0XCIsIGFtb3VudDogMTUgfSB9LFxuXHRcdFx0eyB0YXJnZXQ6IDQwMCwgbGFiZWw6IFwiQnV5IDQwMCBTbG90cyBUb3RhbFwiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRcdHsgdGFyZ2V0OiA3MDAsIGxhYmVsOiBcIkJ1eSA3MDAgU2xvdHMgVG90YWxcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2xvdF9jb3N0X3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRcdHsgdGFyZ2V0OiAxMDAwLCBsYWJlbDogXCJCdXkgMSwwMDAgU2xvdHMgVG90YWxcIiwgcmV3YXJkOiB7IHR5cGU6IFwiY3ljbGVfc3BlZWRfcGN0XCIsIGFtb3VudDogMTUgfSB9LFxuXHRcdF0sXG5cdH0sXG5cdHsgaWQ6IFwiYnVpbGRfc2F3bWlsbFwiLCB0eXBlOiBcImJ1aWxkXCIsIGJsZDogXCJzYXdtaWxsXCIsIHRpZXJzOiBbeyB0YXJnZXQ6IDEsIGxhYmVsOiBcIkJ1aWxkIHRoZSBTYXdtaWxsXCIsIHJld2FyZDogeyB0eXBlOiBcImJ1aWxkX2Nvc3RfcGN0XCIsIGFtb3VudDogMTUgfSB9XSB9LFxuXHR7XG5cdFx0aWQ6IFwiYnVpbGRfd29ya3Nob3BcIixcblx0XHR0eXBlOiBcImJ1aWxkXCIsXG5cdFx0YmxkOiBcIndvcmtzaG9wXCIsXG5cdFx0cHJlcmVxOiBcInNhd21pbGxcIixcblx0XHR0aWVyczogW3sgdGFyZ2V0OiAxLCBsYWJlbDogXCJCdWlsZCB0aGUgV29ya3Nob3BcIiwgcmV3YXJkOiB7IHR5cGU6IFwic3RvcmFnZV90aWVyXCIsIGFtb3VudDogMTAgfSB9XSxcblx0fSxcblx0e1xuXHRcdGlkOiBcImJ1aWxkX2ZvcmdlXCIsXG5cdFx0dHlwZTogXCJidWlsZFwiLFxuXHRcdGJsZDogXCJmb3JnZVwiLFxuXHRcdHByZXJlcTogXCJ3b3Jrc2hvcFwiLFxuXHRcdHRpZXJzOiBbeyB0YXJnZXQ6IDEsIGxhYmVsOiBcIkJ1aWxkIHRoZSBGb3JnZVwiLCByZXdhcmQ6IHsgdHlwZTogXCJzdG9yYWdlX3RpZXJcIiwgYW1vdW50OiAxMCB9IH1dLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwiYnVpbGRfZm91bmRyeVwiLFxuXHRcdHR5cGU6IFwiYnVpbGRcIixcblx0XHRibGQ6IFwiZm91bmRyeVwiLFxuXHRcdHByZXJlcTogXCJmb3JnZVwiLFxuXHRcdHRpZXJzOiBbeyB0YXJnZXQ6IDEsIGxhYmVsOiBcIkJ1aWxkIHRoZSBGb3VuZHJ5XCIsIHJld2FyZDogeyB0eXBlOiBcImJ1aWxkX2Nvc3RfcGN0XCIsIGFtb3VudDogMTUgfSB9XSxcblx0fSxcblx0e1xuXHRcdGlkOiBcImJ1aWxkX2FybW91cnlcIixcblx0XHR0eXBlOiBcImJ1aWxkXCIsXG5cdFx0YmxkOiBcImFybW91cnlcIixcblx0XHRwcmVyZXE6IFwiZm91bmRyeVwiLFxuXHRcdHRpZXJzOiBbeyB0YXJnZXQ6IDEsIGxhYmVsOiBcIkJ1aWxkIHRoZSBBcm1vdXJ5XCIsIHJld2FyZDogeyB0eXBlOiBcInNlbGxfcHJpY2VfcGN0XCIsIGFtb3VudDogMTUgfSB9XSxcblx0fSxcblx0e1xuXHRcdGlkOiBcImJ1aWxkX3NoaXB5YXJkXCIsXG5cdFx0dHlwZTogXCJidWlsZFwiLFxuXHRcdGJsZDogXCJzaGlweWFyZFwiLFxuXHRcdHByZXJlcTogXCJhcm1vdXJ5XCIsXG5cdFx0dGllcnM6IFt7IHRhcmdldDogMSwgbGFiZWw6IFwiQnVpbGQgdGhlIFNoaXB5YXJkXCIsIHJld2FyZDogeyB0eXBlOiBcImN5Y2xlX3NwZWVkX3BjdFwiLCBhbW91bnQ6IDE1IH0gfV0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJ1bmxvY2tfYm9hcmRzXCIsXG5cdFx0dHlwZTogXCJ1bmxvY2tcIixcblx0XHRibGQ6IFwic2F3bWlsbFwiLFxuXHRcdHByb2R1Y3Q6IFwiYm9hcmRzXCIsXG5cdFx0cHJlcmVxOiBcInNhd21pbGxcIixcblx0XHR0aWVyczogW3sgdGFyZ2V0OiAxLCBsYWJlbDogXCJVbmxvY2sgQm9hcmRzXCIsIHJld2FyZDogeyB0eXBlOiBcInVubG9ja19jb3N0X3BjdFwiLCBhbW91bnQ6IDEwIH0gfV0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJ1bmxvY2tfc2hhZnRzXCIsXG5cdFx0dHlwZTogXCJ1bmxvY2tcIixcblx0XHRibGQ6IFwibHVtYmVyX3lhcmRcIixcblx0XHRwcm9kdWN0OiBcInNoYWZ0c1wiLFxuXHRcdHRpZXJzOiBbeyB0YXJnZXQ6IDEsIGxhYmVsOiBcIlVubG9jayBTaGFmdHNcIiwgcmV3YXJkOiB7IHR5cGU6IFwidW5sb2NrX2Nvc3RfcGN0XCIsIGFtb3VudDogMTUgfSB9XSxcblx0fSxcblx0e1xuXHRcdGlkOiBcInVubG9ja19mdXJuaXR1cmVcIixcblx0XHR0eXBlOiBcInVubG9ja1wiLFxuXHRcdGJsZDogXCJ3b3Jrc2hvcFwiLFxuXHRcdHByb2R1Y3Q6IFwiZnVybml0dXJlXCIsXG5cdFx0cHJlcmVxOiBcIndvcmtzaG9wXCIsXG5cdFx0dGllcnM6IFt7IHRhcmdldDogMSwgbGFiZWw6IFwiVW5sb2NrIEZ1cm5pdHVyZVwiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDE1IH0gfV0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJ1bmxvY2tfZml0dGluZ3NcIixcblx0XHR0eXBlOiBcInVubG9ja1wiLFxuXHRcdGJsZDogXCJmb3JnZVwiLFxuXHRcdHByb2R1Y3Q6IFwiaXJvbl9maXR0aW5nc1wiLFxuXHRcdHByZXJlcTogXCJmb3JnZVwiLFxuXHRcdHRpZXJzOiBbeyB0YXJnZXQ6IDEsIGxhYmVsOiBcIlVubG9jayBJcm9uIEZpdHRpbmdzXCIsIHJld2FyZDogeyB0eXBlOiBcInVubG9ja19jb3N0X3BjdFwiLCBhbW91bnQ6IDE1IH0gfV0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJ1bmxvY2tfY2xvY2t3b3JrXCIsXG5cdFx0dHlwZTogXCJ1bmxvY2tcIixcblx0XHRibGQ6IFwiZm91bmRyeVwiLFxuXHRcdHByb2R1Y3Q6IFwiY2xvY2t3b3JrXCIsXG5cdFx0cHJlcmVxOiBcImZvdW5kcnlcIixcblx0XHR0aWVyczogW3sgdGFyZ2V0OiAxLCBsYWJlbDogXCJVbmxvY2sgQ2xvY2t3b3JrXCIsIHJld2FyZDogeyB0eXBlOiBcImJ1aWxkX2Nvc3RfcGN0XCIsIGFtb3VudDogMjUgfSB9XSxcblx0fSxcblx0e1xuXHRcdGlkOiBcInVubG9ja19hcnRpbGxlcnlcIixcblx0XHR0eXBlOiBcInVubG9ja1wiLFxuXHRcdGJsZDogXCJhcm1vdXJ5XCIsXG5cdFx0cHJvZHVjdDogXCJhcnRpbGxlcnlcIixcblx0XHRwcmVyZXE6IFwiYXJtb3VyeVwiLFxuXHRcdHRpZXJzOiBbeyB0YXJnZXQ6IDEsIGxhYmVsOiBcIlVubG9jayBBcnRpbGxlcnlcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2VsbF9wcmljZV9wY3RcIiwgYW1vdW50OiAyNSB9IH1dLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwidW5sb2NrX2RyZWFkbm91Z2h0c1wiLFxuXHRcdHR5cGU6IFwidW5sb2NrXCIsXG5cdFx0YmxkOiBcInNoaXB5YXJkXCIsXG5cdFx0cHJvZHVjdDogXCJkcmVhZG5vdWdodHNcIixcblx0XHRwcmVyZXE6IFwic2hpcHlhcmRcIixcblx0XHR0aWVyczogW3sgdGFyZ2V0OiAxLCBsYWJlbDogXCJVbmxvY2sgRHJlYWRub3VnaHRzXCIsIHJld2FyZDogeyB0eXBlOiBcImN5Y2xlX3NwZWVkX3BjdFwiLCBhbW91bnQ6IDI1IH0gfV0sXG5cdH0sXG5cdHtcblx0XHRpZDogXCJzdG9yYWdlX3VwZ3JhZGVzXCIsXG5cdFx0dHlwZTogXCJzdG9yYWdlXCIsXG5cdFx0dGllcnM6IFtcblx0XHRcdHsgdGFyZ2V0OiA2MCwgbGFiZWw6IFwiVXBncmFkZSBTdG9yYWdlIDYwIFRpbWVzXCIsIHJld2FyZDogeyB0eXBlOiBcInN0b3JhZ2VfdGllclwiLCBhbW91bnQ6IDEwIH0gfSxcblx0XHRcdHsgdGFyZ2V0OiAxMjAsIGxhYmVsOiBcIlVwZ3JhZGUgU3RvcmFnZSAxMjAgVGltZXNcIiwgcmV3YXJkOiB7IHR5cGU6IFwic3RvcmFnZV90aWVyXCIsIGFtb3VudDogMTAgfSB9LFxuXHRcdFx0eyB0YXJnZXQ6IDIwMCwgbGFiZWw6IFwiVXBncmFkZSBTdG9yYWdlIDIwMCBUaW1lc1wiLCByZXdhcmQ6IHsgdHlwZTogXCJzdG9yYWdlX3RpZXJcIiwgYW1vdW50OiAxMCB9IH0sXG5cdFx0XSxcblx0fSxcblx0e1xuXHRcdGlkOiBcImVhcm5fZ29sZFwiLFxuXHRcdHR5cGU6IFwiZ29sZF9lYXJuZWRcIixcblx0XHR0aWVyczogW1xuXHRcdFx0eyB0YXJnZXQ6IDEwMDAwMCwgbGFiZWw6IFwiRWFybiAxMDAsMDAwIEdvbGRcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2VsbF9wcmljZV9wY3RcIiwgYW1vdW50OiAxMCB9IH0sXG5cdFx0XHR7IHRhcmdldDogMTAwMDAwMCwgbGFiZWw6IFwiRWFybiAxLDAwMCwwMDAgR29sZFwiLCByZXdhcmQ6IHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBhbW91bnQ6IDE1IH0gfSxcblx0XHRcdHsgdGFyZ2V0OiAxMDAwMDAwMCwgbGFiZWw6IFwiRWFybiAxMCwwMDAsMDAwIEdvbGRcIiwgcmV3YXJkOiB7IHR5cGU6IFwic2VsbF9wcmljZV9wY3RcIiwgYW1vdW50OiAxNSB9IH0sXG5cdFx0XHR7IHRhcmdldDogMTAwMDAwMDAwLCBsYWJlbDogXCJFYXJuIDEwMCwwMDAsMDAwIEdvbGRcIiwgcmV3YXJkOiB7IHR5cGU6IFwidW5sb2NrX2Nvc3RfcGN0XCIsIGFtb3VudDogMjUgfSB9LFxuXHRcdFx0eyB0YXJnZXQ6IDEwMDAwMDAwMDAsIGxhYmVsOiBcIkVhcm4gMSwwMDAsMDAwLDAwMCBHb2xkXCIsIHJld2FyZDogeyB0eXBlOiBcImN5Y2xlX3NwZWVkX3BjdFwiLCBhbW91bnQ6IDI1IH0gfSxcblx0XHRdLFxuXHR9LFxuXHR7XG5cdFx0aWQ6IFwidHJlYXN1cmVfY2hlc3RzXCIsXG5cdFx0dHlwZTogXCJ0cmVhc3VyZVwiLFxuXHRcdHRpZXJzOiBbXG5cdFx0XHR7IHRhcmdldDogNSwgbGFiZWw6IFwiT3BlbiA1IFRyZWFzdXJlIENoZXN0c1wiLCByZXdhcmQ6IHsgdHlwZTogXCJ0cmVhc3VyZV9nb2xkX3BjdFwiLCBhbW91bnQ6IDUwIH0gfSxcblx0XHRcdHsgdGFyZ2V0OiAxMCwgbGFiZWw6IFwiT3BlbiAxMCBUcmVhc3VyZSBDaGVzdHNcIiwgcmV3YXJkOiB7IHR5cGU6IFwidHJlYXN1cmVfZ29sZF9wY3RcIiwgYW1vdW50OiA1MCB9IH0sXG5cdFx0XSxcblx0fSxcbl07XG5cbi8vIEZsYXQgcXVlc3QgcG9vbCBidWlsdCBmcm9tIGNoYWlucy4gRWFjaCBlbnRyeSBnZXRzIGlkID0gYCR7Y2hhaW5JZH1fdCR7dGllckluZGV4fWAuXG5leHBvcnQgY29uc3QgUVVFU1RfUE9PTDogUXVlc3REZWZbXSA9IFFVRVNUX0NIQUlOUy5mbGF0TWFwKChjaGFpbikgPT5cblx0Y2hhaW4udGllcnMubWFwKCh0aWVyLCBpKSA9PiAoe1xuXHRcdGlkOiBgJHtjaGFpbi5pZH1fdCR7aX1gLFxuXHRcdGNoYWluSWQ6IGNoYWluLmlkLFxuXHRcdHRpZXJJbmRleDogaSxcblx0XHRsYWJlbDogdGllci5sYWJlbCxcblx0XHR0eXBlOiBjaGFpbi50eXBlLFxuXHRcdHJlc291cmNlOiBjaGFpbi5yZXNvdXJjZSxcblx0XHRibGQ6IGNoYWluLmJsZCxcblx0XHRwcm9kdWN0OiBjaGFpbi5wcm9kdWN0LFxuXHRcdHRhcmdldDogdGllci50YXJnZXQsXG5cdFx0cmV3YXJkOiB0aWVyLnJld2FyZCxcblx0XHRyZXdhcmRMYWJlbDogcmV3YXJkTGFiZWwodGllci5yZXdhcmQpLFxuXHR9KSlcbik7XG5cbi8vIFF1ZXN0IHR5cGVzIHdob3NlIHByb2dyZXNzIGlzIG1lYXN1cmVkIGFnYWluc3QgYSBiYXNlbGluZSBjYXB0dXJlZCB3aGVuIHRoZSBxdWVzdCBpcyBkcmF3bi5cbmV4cG9ydCBjb25zdCBCQVNFTElORV9RVUVTVF9UWVBFUyA9IG5ldyBTZXQoW1wic2VsbFwiLCBcInNsb3RzXCIsIFwidG90YWxfc2xvdHNcIiwgXCJnb2xkX2Vhcm5lZFwiLCBcInN0b3JhZ2VcIiwgXCJ0cmVhc3VyZVwiXSk7XG4iLCAiLy8gUmVzb3VyY2UgY2F0YWxvZ3VlLiBEYXRhIG9ubHkuXG5pbXBvcnQgdHlwZSB7IFJlc291cmNlIH0gZnJvbSBcIi4uL2NvcmUvdHlwZXMudHNcIjtcblxuZXhwb3J0IGNvbnN0IFJFU09VUkNFUyA9IHtcblx0Ly8gV29vZCBjaGFpblxuXHRsb2dzOiB7IGxhYmVsOiBcIkxvZ3NcIiwgc2luZ3VsYXI6IFwiTG9nXCIsIHByaWNlOiA1IH0sXG5cdHRpbWJlcjogeyBsYWJlbDogXCJUaW1iZXJcIiwgc2luZ3VsYXI6IFwiVGltYmVyXCIsIHByaWNlOiAyNSB9LFxuXHRkb3dlbHM6IHsgbGFiZWw6IFwiRG93ZWxzXCIsIHNpbmd1bGFyOiBcIkRvd2VsXCIsIHByaWNlOiA3NSB9LFxuXHRoYW5kbGVzOiB7IGxhYmVsOiBcIkhhbmRsZXNcIiwgc2luZ3VsYXI6IFwiSGFuZGxlXCIsIHByaWNlOiAxMjAgfSxcblx0c2hhZnRzOiB7IGxhYmVsOiBcIlNoYWZ0c1wiLCBzaW5ndWxhcjogXCJTaGFmdFwiLCBwcmljZTogNTAwIH0sXG5cdHBsYW5rczogeyBsYWJlbDogXCJQbGFua3NcIiwgc2luZ3VsYXI6IFwiUGxhbmtcIiwgcHJpY2U6IDUwIH0sXG5cdGJvYXJkczogeyBsYWJlbDogXCJCb2FyZHNcIiwgc2luZ3VsYXI6IFwiQm9hcmRcIiwgcHJpY2U6IDIwMCB9LFxuXHRiZWFtczogeyBsYWJlbDogXCJCZWFtc1wiLCBzaW5ndWxhcjogXCJCZWFtXCIsIHByaWNlOiA3NTAgfSxcblx0Y3JhdGVzOiB7IGxhYmVsOiBcIkNyYXRlc1wiLCBzaW5ndWxhcjogXCJDcmF0ZVwiLCBwcmljZTogMjAwMCB9LFxuXHRmdXJuaXR1cmU6IHsgbGFiZWw6IFwiRnVybml0dXJlXCIsIHNpbmd1bGFyOiBcIkZ1cm5pdHVyZVwiLCBwcmljZTogMTAwMDAgfSxcblx0Y29hY2hlczogeyBsYWJlbDogXCJDb2FjaGVzXCIsIHNpbmd1bGFyOiBcIkNvYWNoXCIsIHByaWNlOiA1MDAwMCB9LFxuXHRtYW5vcnM6IHsgbGFiZWw6IFwiTWFub3JzXCIsIHNpbmd1bGFyOiBcIk1hbm9yXCIsIHByaWNlOiA1MDAwMDAgfSxcblx0Ly8gSXJvbiBjaGFpblxuXHRpcm9uX29yZTogeyBsYWJlbDogXCJJcm9uIE9yZVwiLCBzaW5ndWxhcjogXCJJcm9uIE9yZVwiLCBwcmljZTogMjUwIH0sXG5cdGlyb25fYmFyczogeyBsYWJlbDogXCJJcm9uIEJhcnNcIiwgc2luZ3VsYXI6IFwiSXJvbiBCYXJcIiwgcHJpY2U6IDI1MDAgfSxcblx0bmFpbHM6IHsgbGFiZWw6IFwiTmFpbHNcIiwgc2luZ3VsYXI6IFwiTmFpbFwiLCBwcmljZTogNTAwMCB9LFxuXHRpcm9uX2ZpdHRpbmdzOiB7IGxhYmVsOiBcIklyb24gRml0dGluZ3NcIiwgc2luZ3VsYXI6IFwiSXJvbiBGaXR0aW5nXCIsIHByaWNlOiAxNTAwMCB9LFxuXHQvLyBGb3VuZHJ5IGNoYWluXG5cdGdlYXJzOiB7IGxhYmVsOiBcIkdlYXJzXCIsIHNpbmd1bGFyOiBcIkdlYXJcIiwgcHJpY2U6IDEwMDAwMCB9LFxuXHRzcHJpbmdzOiB7IGxhYmVsOiBcIlNwcmluZ3NcIiwgc2luZ3VsYXI6IFwiU3ByaW5nXCIsIHByaWNlOiAyNTAwMDAgfSxcblx0bWVjaGFuaXNtczogeyBsYWJlbDogXCJNZWNoYW5pc21zXCIsIHNpbmd1bGFyOiBcIk1lY2hhbmlzbVwiLCBwcmljZTogMTI1MDAwMCB9LFxuXHRjbG9ja3dvcms6IHsgbGFiZWw6IFwiQ2xvY2t3b3JrXCIsIHNpbmd1bGFyOiBcIkNsb2Nrd29ya1wiLCBwcmljZTogNzUwMDAwMCB9LFxuXHQvLyBBcm1vdXJ5IGNoYWluXG5cdGJsYWRlczogeyBsYWJlbDogXCJCbGFkZXNcIiwgc2luZ3VsYXI6IFwiQmxhZGVcIiwgcHJpY2U6IDEwMDAwMCB9LFxuXHRjcm9zc2Jvd3M6IHsgbGFiZWw6IFwiQ3Jvc3Nib3dzXCIsIHNpbmd1bGFyOiBcIkNyb3NzYm93XCIsIHByaWNlOiA3NTAwMDAgfSxcblx0Y2Fubm9uczogeyBsYWJlbDogXCJDYW5ub25zXCIsIHNpbmd1bGFyOiBcIkNhbm5vblwiLCBwcmljZTogNzUwMDAwMCB9LFxuXHRhcnRpbGxlcnk6IHsgbGFiZWw6IFwiQXJ0aWxsZXJ5XCIsIHNpbmd1bGFyOiBcIkFydGlsbGVyeVwiLCBwcmljZTogMTUwMDAwMDAwIH0sXG5cdC8vIFNoaXB5YXJkIGNoYWluXG5cdGh1bGxzOiB7IGxhYmVsOiBcIkh1bGxzXCIsIHNpbmd1bGFyOiBcIkh1bGxcIiwgcHJpY2U6IDI1MDAwMDAgfSxcblx0cmlnZ2luZzogeyBsYWJlbDogXCJSaWdnaW5nXCIsIHNpbmd1bGFyOiBcIlJpZ2dpbmdcIiwgcHJpY2U6IDE1MDAwMDAgfSxcblx0Z2FsbGVvbnM6IHsgbGFiZWw6IFwiR2FsbGVvbnNcIiwgc2luZ3VsYXI6IFwiR2FsbGVvblwiLCBwcmljZTogMTAwMDAwMDAwIH0sXG5cdGRyZWFkbm91Z2h0czogeyBsYWJlbDogXCJEcmVhZG5vdWdodHNcIiwgc2luZ3VsYXI6IFwiRHJlYWRub3VnaHRcIiwgcHJpY2U6IDEwMDAwMDAwMDAgfSxcbn0gc2F0aXNmaWVzIFJlY29yZDxzdHJpbmcsIFJlc291cmNlPjtcbiIsICIvLyBTaW5nbGUgc291cmNlIG9mIHdhbGwgY2xvY2sgdGltZS4gRXZlcnkgdGltZSByZWFkIGluIHRoZSBnYW1lIGdvZXMgdGhyb3VnaCBub3coKS5cbi8vIFRoZSBoZWFkbGVzcyBzaW11bGF0b3IgcmVwbGFjZXMgdGhlIHNvdXJjZSB3aXRoIGEgdmlydHVhbCBjbG9jayBzbyBhIHJ1biBjYW4gYmVcbi8vIGFkdmFuY2VkIGZhc3RlciB0aGFuIHJlYWwgdGltZSBhbmQgcmVwbGF5ZWQgZGV0ZXJtaW5pc3RpY2FsbHkuXG5cbmxldCBzb3VyY2U6ICgpID0+IG51bWJlciA9ICgpID0+IERhdGUubm93KCk7XG5cbmV4cG9ydCBmdW5jdGlvbiBub3coKTogbnVtYmVyIHtcblx0cmV0dXJuIHNvdXJjZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0Q2xvY2soZm46ICgpID0+IG51bWJlcik6IHZvaWQge1xuXHRzb3VyY2UgPSBmbjtcbn1cbiIsICIvLyBTaW5nbGUgc291cmNlIG9mIHJhbmRvbW5lc3MuIFRyZWFzdXJlIHNwYXducywgcXVlc3QgZHJhd3MgYW5kIGFueSBmdXR1cmUgbWFya2V0XG4vLyBub2lzZSBhbGwgZHJhdyBmcm9tIGhlcmUuXG4vL1xuLy8gVGhlIGdlbmVyYXRvciBpcyBtdWxiZXJyeTMyOiBpdHMgd2hvbGUgc3RhdGUgaXMgb25lIDMyIGJpdCBpbnRlZ2VyLCBzbyBpdCByaWRlc1xuLy8gYWxvbmcgaW4gdGhlIHNhdmUgZmlsZS4gVGhhdCBtYWtlcyBhIHJ1biByZXByb2R1Y2libGUsIGFuZCBpdCBzdG9wcyBhIHJlbG9hZCBmcm9tXG4vLyBiZWluZyBhIGZyZWUgcmVyb2xsLCBiZWNhdXNlIGNvbWluZyBiYWNrIGxhbmRzIG9uIHRoZSBzYW1lIGRyYXcgeW91IGFscmVhZHkgc2F3LlxuXG5sZXQgY3Vyc29yID0gKE1hdGgucmFuZG9tKCkgKiAyICoqIDMyKSA+Pj4gMDtcbmxldCBvdmVycmlkZTogKCgpID0+IG51bWJlcikgfCBudWxsID0gbnVsbDtcblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbSgpOiBudW1iZXIge1xuXHRpZiAob3ZlcnJpZGUpIHJldHVybiBvdmVycmlkZSgpO1xuXHRjdXJzb3IgPSAoY3Vyc29yICsgMHg2RDJCNzlGNSkgfCAwO1xuXHRsZXQgdCA9IE1hdGguaW11bChjdXJzb3IgXiAoY3Vyc29yID4+PiAxNSksIDEgfCBjdXJzb3IpO1xuXHR0ID0gKHQgKyBNYXRoLmltdWwodCBeICh0ID4+PiA3KSwgNjEgfCB0KSkgXiB0O1xuXHRyZXR1cm4gKCh0IF4gKHQgPj4+IDE0KSkgPj4+IDApIC8gNDI5NDk2NzI5Njtcbn1cblxuLy8gUmVwbGFjZXMgdGhlIGdlbmVyYXRvciBvdXRyaWdodC4gVGVzdHMgYW5kIHRoZSBzaW11bGF0b3IgdXNlIHRoaXM7IHRoZSBnYW1lIGRvZXMgbm90LlxuZXhwb3J0IGZ1bmN0aW9uIHNldFJuZyhmbjogKCgpID0+IG51bWJlcikgfCBudWxsKTogdm9pZCB7XG5cdG92ZXJyaWRlID0gZm47XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzZWVkUm5nKHNlZWQ6IG51bWJlcik6IHZvaWQge1xuXHRjdXJzb3IgPSBzZWVkIHwgMDtcblx0b3ZlcnJpZGUgPSBudWxsO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcm5nU3RhdGUoKTogbnVtYmVyIHtcblx0cmV0dXJuIGN1cnNvcjtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNldFJuZ1N0YXRlKG46IG51bWJlcik6IHZvaWQge1xuXHRjdXJzb3IgPSBuIHwgMDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJhbmRvbVNlZWQoKTogbnVtYmVyIHtcblx0cmV0dXJuIChNYXRoLnJhbmRvbSgpICogMiAqKiAzMikgPj4+IDA7XG59XG5cbi8vIENvbXBhcmF0b3IgZm9yIHRoZSBzaHVmZmxlIGlkaW9tIHVzZWQgd2hlbiBkcmF3aW5nIHF1ZXN0cy5cbmV4cG9ydCBmdW5jdGlvbiBzaHVmZmxlKCk6IG51bWJlciB7XG5cdHJldHVybiByYW5kb20oKSAtIDAuNTtcbn1cbiIsICJleHBvcnQgY29uc3QgU0FWRV9LRVkgPSBcImNyYWZ0ZXJcIjtcblxuZXhwb3J0IGNvbnN0IFNUT1JBR0VfQkFTRSA9IDUwO1xuZXhwb3J0IGNvbnN0IFNUT1JBR0VfRklSU1RfVVBHUkFERSA9IDEwMDtcbmV4cG9ydCBjb25zdCBTVE9SQUdFX0lOQ1JFTUVOVCA9IDEwMDtcbmV4cG9ydCBjb25zdCBTVE9SQUdFX0JBU0VfQ09TVCA9IDE1MDtcbmV4cG9ydCBjb25zdCBTVE9SQUdFX0NPU1RfR1JPV1RIID0gMS4xO1xuXG5leHBvcnQgY29uc3QgUVVFU1RfU0xPVFMgPSA1O1xuZXhwb3J0IGNvbnN0IFJFUk9MTF9CQVNFX0NPU1QgPSAyNTA7XG5leHBvcnQgY29uc3QgUkVST0xMX0NPU1RfR1JPV1RIID0gMjtcblxuZXhwb3J0IGNvbnN0IFRSRUFTVVJFX01JTl9HQVBfTVMgPSAzMDAwMDA7XG5leHBvcnQgY29uc3QgVFJFQVNVUkVfR0FQX1NQUkVBRF9NUyA9IDYwMDAwMDtcbmV4cG9ydCBjb25zdCBUUkVBU1VSRV9NSU5fRFVSQVRJT05fTVMgPSAxMDAwMDtcbmV4cG9ydCBjb25zdCBUUkVBU1VSRV9EVVJBVElPTl9TUFJFQURfTVMgPSAyMDAwMDtcblxuZXhwb3J0IGNvbnN0IE9GRkxJTkVfQ0FQX01TID0gMjQgKiA2MCAqIDYwICogMTAwMDtcbmV4cG9ydCBjb25zdCBPRkZMSU5FX01JTl9NUyA9IDEwMDAwO1xuXG5leHBvcnQgY29uc3QgU0xPVF9SRUZVTkRfUENUID0gMC41O1xuZXhwb3J0IGNvbnN0IE1BTlVBTF9DTElDS19QUk9HUkVTUyA9IDAuMjU7XG4iLCAiLy8gU2F2ZSBzY2hlbWEgdmVyc2lvbmluZy5cbi8vXG4vLyBBIHNhdmUgY2FycmllcyB0aGUgdmVyc2lvbiBpdCB3YXMgd3JpdHRlbiB3aXRoLiBPbiBsb2FkIGl0IGlzIHdhbGtlZCBmb3J3YXJkIG9uZVxuLy8gbWlncmF0aW9uIGF0IGEgdGltZSB1bnRpbCBpdCBtYXRjaGVzIFNBVkVfVkVSU0lPTi4gU2F2ZXMgZnJvbSBhIG5ld2VyIGJ1aWxkIGFyZVxuLy8gcmVmdXNlZCByYXRoZXIgdGhhbiBtZXJnZWQsIHNvIGEgZG93bmdyYWRlIGNhbm5vdCBxdWlldGx5IGRlc3Ryb3kgcHJvZ3Jlc3MuXG5cbmltcG9ydCB7IHJhbmRvbVNlZWQgfSBmcm9tIFwiLi9ybmcudHNcIjtcblxuZXhwb3J0IGNvbnN0IFNBVkVfVkVSU0lPTiA9IDE7XG5cbnR5cGUgUmF3U2F2ZSA9IFJlY29yZDxzdHJpbmcsIGFueT47XG50eXBlIE1pZ3JhdGlvbiA9IChzOiBSYXdTYXZlKSA9PiBSYXdTYXZlO1xuXG5leHBvcnQgY29uc3QgTUlHUkFUSU9OUzogUmVjb3JkPG51bWJlciwgTWlncmF0aW9uPiA9IHtcblx0Ly8gdjAgaXMgZXZlcnkgc2F2ZSB3cml0dGVuIGJlZm9yZSB2ZXJzaW9uaW5nIGV4aXN0ZWQuIFRoZSBzaGFwZSBpcyB1bmNoYW5nZWQ7IHRoaXNcblx0Ly8ganVzdCBmaWxscyBpbiB3aGF0IGxvYWQoKSB1c2VkIHRvIHBhdGNoIHVwIGJ5IGhhbmQgb24gZXZlcnkgYm9vdC5cblx0MTogKHMpID0+IHtcblx0XHRmb3IgKGNvbnN0IGJzdCBvZiBPYmplY3QudmFsdWVzKHMuYnVpbGRpbmdzID8/IHt9KSBhcyBSYXdTYXZlW10pIHtcblx0XHRcdGZvciAoY29uc3QgcHN0IG9mIE9iamVjdC52YWx1ZXMoYnN0LnByb2R1Y3RzID8/IHt9KSBhcyBSYXdTYXZlW10pIHtcblx0XHRcdFx0aWYgKCFwc3QubWFudWFsIHx8IHR5cGVvZiBwc3QubWFudWFsICE9PSBcIm9iamVjdFwiKSBwc3QubWFudWFsID0geyBhY3RpdmU6IGZhbHNlLCBwcm9ncmVzczogMCB9O1xuXHRcdFx0XHRpZiAocHN0Lm1hbnVhbC5hY3RpdmUgPT09IHVuZGVmaW5lZCkgcHN0Lm1hbnVhbC5hY3RpdmUgPSBmYWxzZTtcblx0XHRcdFx0aWYgKHBzdC5tYW51YWwucHJvZ3Jlc3MgPT09IHVuZGVmaW5lZCkgcHN0Lm1hbnVhbC5wcm9ncmVzcyA9IDA7XG5cdFx0XHRcdGlmIChwc3QuZW5hYmxlZCA9PT0gdW5kZWZpbmVkKSBwc3QuZW5hYmxlZCA9IHRydWU7XG5cdFx0XHRcdGlmICghQXJyYXkuaXNBcnJheShwc3Quc2xvdHMpKSBwc3Quc2xvdHMgPSBbXTtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBzLnJuZ1N0YXRlICE9PSBcIm51bWJlclwiKSBzLnJuZ1N0YXRlID0gcmFuZG9tU2VlZCgpO1xuXHRcdHJldHVybiBzO1xuXHR9LFxufTtcblxuZXhwb3J0IGNsYXNzIFNhdmVUb29OZXdFcnJvciBleHRlbmRzIEVycm9yIHtcblx0Y29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IGZvdW5kOiBudW1iZXIpIHtcblx0XHRzdXBlcihgU2F2ZSB3YXMgd3JpdHRlbiBieSBhIG5ld2VyIGJ1aWxkICh2ZXJzaW9uICR7Zm91bmR9LCB0aGlzIGJ1aWxkIHJlYWRzICR7U0FWRV9WRVJTSU9OfSkuYCk7XG5cdFx0dGhpcy5uYW1lID0gXCJTYXZlVG9vTmV3RXJyb3JcIjtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2F2ZVZlcnNpb25PZihzOiBSYXdTYXZlKTogbnVtYmVyIHtcblx0cmV0dXJuIHR5cGVvZiBzLnZlcnNpb24gPT09IFwibnVtYmVyXCIgPyBzLnZlcnNpb24gOiAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbWlncmF0ZShyYXc6IFJhd1NhdmUpOiBSYXdTYXZlIHtcblx0bGV0IHMgPSByYXc7XG5cdGxldCB2ID0gc2F2ZVZlcnNpb25PZihzKTtcblx0aWYgKHYgPiBTQVZFX1ZFUlNJT04pIHRocm93IG5ldyBTYXZlVG9vTmV3RXJyb3Iodik7XG5cdHdoaWxlICh2IDwgU0FWRV9WRVJTSU9OKSB7XG5cdFx0disrO1xuXHRcdHMgPSBNSUdSQVRJT05TW3ZdKHMpO1xuXHRcdHMudmVyc2lvbiA9IHY7XG5cdH1cblx0cy52ZXJzaW9uID0gU0FWRV9WRVJTSU9OO1xuXHRyZXR1cm4gcztcbn1cbiIsICIvLyBPYmplY3QuZW50cmllcyBhbmQgT2JqZWN0LmtleXMgd2lkZW4ga2V5cyB0byBzdHJpbmcsIHdoaWNoIGxvc2VzIHRoZSByZXNvdXJjZSBhbmRcbi8vIGJ1aWxkaW5nIGtleSB1bmlvbnMgZXZlcnl3aGVyZSB0aGV5IGFyZSB1c2VkLiBUaGVzZSBrZWVwIHRoZW0uXG5cbmV4cG9ydCBmdW5jdGlvbiBlbnRyaWVzPEsgZXh0ZW5kcyBzdHJpbmcsIFY+KG9iajogUmVjb3JkPEssIFY+KTogW0ssIFZdW10ge1xuXHRyZXR1cm4gT2JqZWN0LmVudHJpZXMob2JqKSBhcyBbSywgVl1bXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGtleXM8SyBleHRlbmRzIHN0cmluZz4ob2JqOiBSZWNvcmQ8SywgdW5rbm93bj4pOiBLW10ge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMob2JqKSBhcyBLW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB2YWx1ZXM8Vj4ob2JqOiBSZWNvcmQ8c3RyaW5nLCBWPik6IFZbXSB7XG5cdHJldHVybiBPYmplY3QudmFsdWVzKG9iaik7XG59XG5cbi8vIE1hcC5nZXRPckluc2VydENvbXB1dGVkIGlzIHRvbyBuZXcgdG8gcmVseSBvbiwgc28gdGhlIGNvbXBvbmVudHMgdXNlIHRoaXMgaW5zdGVhZC5cbmV4cG9ydCBmdW5jdGlvbiBnZXRPckluc2VydDxLLCBWPihtYXA6IE1hcDxLLCBWPiwga2V5OiBLLCBtYWtlOiAoa2V5OiBLKSA9PiBWKTogViB7XG5cdGNvbnN0IGV4aXN0aW5nID0gbWFwLmdldChrZXkpO1xuXHRpZiAoZXhpc3RpbmcgIT09IHVuZGVmaW5lZCkgcmV0dXJuIGV4aXN0aW5nO1xuXHRjb25zdCBjcmVhdGVkID0gbWFrZShrZXkpO1xuXHRtYXAuc2V0KGtleSwgY3JlYXRlZCk7XG5cdHJldHVybiBjcmVhdGVkO1xufVxuIiwgImltcG9ydCB7IFJFU09VUkNFUyB9IGZyb20gXCIuLi9jb250ZW50L3Jlc291cmNlcy50c1wiO1xuaW1wb3J0IHsgQlVJTERJTkdTIH0gZnJvbSBcIi4uL2NvbnRlbnQvYnVpbGRpbmdzLnRzXCI7XG5pbXBvcnQgeyBub3cgfSBmcm9tIFwiLi9jbG9jay50c1wiO1xuaW1wb3J0IHsgcmFuZG9tLCByYW5kb21TZWVkIH0gZnJvbSBcIi4vcm5nLnRzXCI7XG5pbXBvcnQgeyBUUkVBU1VSRV9HQVBfU1BSRUFEX01TLCBUUkVBU1VSRV9NSU5fR0FQX01TIH0gZnJvbSBcIi4vY29uc3RhbnRzLnRzXCI7XG5pbXBvcnQgeyBTQVZFX1ZFUlNJT04gfSBmcm9tIFwiLi9taWdyYXRpb25zLnRzXCI7XG5pbXBvcnQgeyBrZXlzIH0gZnJvbSBcIi4vdXRpbC50c1wiO1xuaW1wb3J0IHR5cGUgeyBCdWlsZGluZ1N0YXRlLCBHYW1lU3RhdGUsIFByb2R1Y3RTdGF0ZSwgUmVzb3VyY2VLZXkgfSBmcm9tIFwiLi90eXBlcy50c1wiO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVlcENsb25lPFQ+KG9iajogVCk6IFQge1xuXHRyZXR1cm4gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShvYmopKSBhcyBUO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZGVlcE1lcmdlKGRzdDogUmVjb3JkPHN0cmluZywgYW55Piwgc3JjOiBSZWNvcmQ8c3RyaW5nLCBhbnk+KTogUmVjb3JkPHN0cmluZywgYW55PiB7XG5cdGZvciAoY29uc3Qga2V5IG9mIE9iamVjdC5rZXlzKHNyYykpIHtcblx0XHRpZiAoc3JjW2tleV0gIT09IG51bGwgJiYgdHlwZW9mIHNyY1trZXldID09PSBcIm9iamVjdFwiICYmICFBcnJheS5pc0FycmF5KHNyY1trZXldKSkge1xuXHRcdFx0aWYgKHR5cGVvZiBkc3Rba2V5XSAhPT0gXCJvYmplY3RcIiB8fCBkc3Rba2V5XSA9PT0gbnVsbCkgZHN0W2tleV0gPSB7fTtcblx0XHRcdGRlZXBNZXJnZShkc3Rba2V5XSwgc3JjW2tleV0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRkc3Rba2V5XSA9IHNyY1trZXldO1xuXHRcdH1cblx0fVxuXHRyZXR1cm4gZHN0O1xufVxuXG5mdW5jdGlvbiBlbXB0eUludmVudG9yeSgpOiBSZWNvcmQ8UmVzb3VyY2VLZXksIG51bWJlcj4ge1xuXHRyZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKGtleXMoUkVTT1VSQ0VTKS5tYXAoKGspID0+IFtrLCAwXSkpIGFzIFJlY29yZDxSZXNvdXJjZUtleSwgbnVtYmVyPjtcbn1cblxuZnVuY3Rpb24gZnJlc2hCdWlsZGluZ3MoKTogUmVjb3JkPHN0cmluZywgQnVpbGRpbmdTdGF0ZT4ge1xuXHRyZXR1cm4gT2JqZWN0LmZyb21FbnRyaWVzKFxuXHRcdE9iamVjdC5rZXlzKEJVSUxESU5HUykubWFwKChibGRLZXkpID0+IHtcblx0XHRcdGNvbnN0IHByb2R1Y3RzID0gT2JqZWN0LmZyb21FbnRyaWVzKFxuXHRcdFx0XHRPYmplY3QuZW50cmllcyhCVUlMRElOR1NbYmxkS2V5XS5wcm9kdWN0cykubWFwKChbcGssIHBjZmddKSA9PiB7XG5cdFx0XHRcdFx0Y29uc3QgcHN0OiBQcm9kdWN0U3RhdGUgPSB7XG5cdFx0XHRcdFx0XHR1bmxvY2tlZDogcGNmZy5zdGFydHNVbmxvY2tlZCA/PyBmYWxzZSxcblx0XHRcdFx0XHRcdGVuYWJsZWQ6IHRydWUsXG5cdFx0XHRcdFx0XHRzbG90czogW10sXG5cdFx0XHRcdFx0XHRtYW51YWw6IHsgYWN0aXZlOiBmYWxzZSwgcHJvZ3Jlc3M6IDAgfSxcblx0XHRcdFx0XHR9O1xuXHRcdFx0XHRcdHJldHVybiBbcGssIHBzdF07XG5cdFx0XHRcdH0pLFxuXHRcdFx0KTtcblx0XHRcdHJldHVybiBbYmxkS2V5LCB7IHVubG9ja2VkOiBibGRLZXkgPT09IFwibHVtYmVyX3lhcmRcIiwgcHJvZHVjdHMgfV07XG5cdFx0fSksXG5cdCk7XG59XG5cbi8vIEJ1aWx0IG9uIGVhY2ggY2FsbCByYXRoZXIgdGhhbiBjbG9uZWQgZnJvbSBhIG1vZHVsZSBsZXZlbCBjb25zdGFudCwgc28gdGhlIHRyZWFzdXJlXG4vLyB0aW1lciBpcyBzZWVkZWQgZnJvbSB0aGUgY3VycmVudCBjbG9jayBhbmQgYSBzZWVkZWQgc2ltdWxhdG9yIHJ1biBzdGF5cyByZXByb2R1Y2libGUuXG5leHBvcnQgZnVuY3Rpb24gZnJlc2hTdGF0ZSgpOiBHYW1lU3RhdGUge1xuXHRyZXR1cm4ge1xuXHRcdHZlcnNpb246IFNBVkVfVkVSU0lPTixcblx0XHRybmdTdGF0ZTogcmFuZG9tU2VlZCgpLFxuXHRcdGdvbGQ6IDAsXG5cdFx0bGFzdFRpY2s6IG51bGwsXG5cdFx0aW52ZW50b3J5OiBlbXB0eUludmVudG9yeSgpLFxuXHRcdHN0b3JhZ2U6IHsgdGllcjogMCB9LFxuXHRcdHN0YXRzOiB7IGdvbGRFYXJuZWQ6IDAsIHNvbGRCeVJlc291cmNlOiB7fSwgdHJlYXN1cmVDaGVzdHNPcGVuZWQ6IDAgfSxcblx0XHR0cmVhc3VyZTogeyBuZXh0U3Bhd246IG5vdygpICsgVFJFQVNVUkVfTUlOX0dBUF9NUyArIHJhbmRvbSgpICogVFJFQVNVUkVfR0FQX1NQUkVBRF9NUywgYWN0aXZlVW50aWw6IDAgfSxcblx0XHRxdWVzdHM6IHsgYWN0aXZlOiBbXSwgY29tcGxldGVkOiBbXSwgYmFzZWxpbmVzOiB7fSwgcmVyb2xsczogMCB9LFxuXHRcdHByZXN0aWdlOiB7XG5cdFx0XHRydW5zOiAwLFxuXHRcdFx0cmV3YXJkczogW10sXG5cdFx0XHRjb21wbGV0ZWRRdWVzdElkczogW10sXG5cdFx0XHRzZWVuQnVpbGRpbmdzOiBbXSxcblx0XHRcdGFjY3VtdWxhdGVkU3RhdHM6IHtcblx0XHRcdFx0Z29sZEVhcm5lZDogMCxcblx0XHRcdFx0c29sZEJ5UmVzb3VyY2U6IHt9LFxuXHRcdFx0XHRzdG9yYWdlVXBncmFkZXM6IDAsXG5cdFx0XHRcdHRvdGFsU2xvdHM6IDAsXG5cdFx0XHRcdG1heFNsb3RzQnlQcm9kdWN0OiB7fSxcblx0XHRcdFx0dG90YWxTbG90c0J5UHJvZHVjdDoge30sXG5cdFx0XHRcdHRyZWFzdXJlQ2hlc3RzT3BlbmVkOiAwLFxuXHRcdFx0fSxcblx0XHR9LFxuXHRcdGJ1aWxkaW5nczogZnJlc2hCdWlsZGluZ3MoKSxcblx0fTtcbn1cblxuLy8gTGl2ZSBiaW5kaW5nLiBNb2R1bGVzIHRoYXQgaW1wb3J0IHRoaXMgc2VlIHJlYXNzaWdubWVudHMgbWFkZSB0aHJvdWdoIHNldFN0YXRlLlxuZXhwb3J0IGxldCBzdGF0ZTogR2FtZVN0YXRlID0gZnJlc2hTdGF0ZSgpO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0U3RhdGUobmV4dDogR2FtZVN0YXRlKTogdm9pZCB7XG5cdHN0YXRlID0gbmV4dDtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBSdW50aW1lIHtcblx0bmV4dFNsb3RJZDogbnVtYmVyO1xuXHRzdGFsbEFubm91bmNlZDogUmVjb3JkPHN0cmluZywgXCJwZW5kaW5nXCIgfCB0cnVlPjtcblx0c2VsZWN0ZWRCdWlsZGluZzogc3RyaW5nIHwgbnVsbDtcbn1cblxuLy8gU2Vzc2lvbiBzY29wZWQgYm9va2tlZXBpbmcgdGhhdCBpcyBuZXZlciBzYXZlZC5cbmV4cG9ydCBjb25zdCBydW50aW1lOiBSdW50aW1lID0ge1xuXHRuZXh0U2xvdElkOiAwLFxuXHRzdGFsbEFubm91bmNlZDoge30sXG5cdHNlbGVjdGVkQnVpbGRpbmc6IG51bGwsXG59O1xuIiwgIi8vIE1pbmltYWwgZW1pdHRlci4gQ29yZSBzaWduYWxzIHdoYXQgaGFwcGVuZWQ7IHRoZSBVSSBkZWNpZGVzIHdoYXQgdGhhdCBsb29rcyBsaWtlLlxuLy8gS2VlcGluZyB0aGlzIGhlcmUgaXMgd2hhdCBsZXRzIGNvcmUgc3RheSBmcmVlIG9mIHRoZSBET00gYW5kIHJ1biB1bmRlciBEZW5vLlxuXG50eXBlIEhhbmRsZXIgPSAocGF5bG9hZD86IGFueSkgPT4gdm9pZDtcblxuY29uc3QgaGFuZGxlcnMgPSBuZXcgTWFwPHN0cmluZywgU2V0PEhhbmRsZXI+PigpO1xuXG5leHBvcnQgZnVuY3Rpb24gb24obmFtZTogc3RyaW5nLCBmbjogSGFuZGxlcik6ICgpID0+IHZvaWQge1xuXHRsZXQgc2V0ID0gaGFuZGxlcnMuZ2V0KG5hbWUpO1xuXHRpZiAoIXNldCkge1xuXHRcdHNldCA9IG5ldyBTZXQoKTtcblx0XHRoYW5kbGVycy5zZXQobmFtZSwgc2V0KTtcblx0fVxuXHRzZXQuYWRkKGZuKTtcblx0cmV0dXJuICgpID0+IHtcblx0XHRoYW5kbGVycy5nZXQobmFtZSk/LmRlbGV0ZShmbik7XG5cdH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbWl0KG5hbWU6IHN0cmluZywgcGF5bG9hZD86IHVua25vd24pOiB2b2lkIHtcblx0Y29uc3Qgc2V0ID0gaGFuZGxlcnMuZ2V0KG5hbWUpO1xuXHRpZiAoIXNldCkgcmV0dXJuO1xuXHRmb3IgKGNvbnN0IGZuIG9mIHNldCkgZm4ocGF5bG9hZCk7XG59XG5cbmxldCBtdXRlZCA9IGZhbHNlO1xuXG4vLyBPZmZsaW5lIGNhdGNoLXVwIHJlcGxheXMgaG91cnMgb2YgZ2FtZSB0aW1lLiBOb2JvZHkgd2FudHMgdGhhdCBiYWNrbG9nIHJlYWQgb3V0LlxuZXhwb3J0IGZ1bmN0aW9uIHNldE11dGVkKHZhbHVlOiBib29sZWFuKTogdm9pZCB7XG5cdG11dGVkID0gdmFsdWU7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbm5vdW5jZShtc2c6IHN0cmluZyk6IHZvaWQge1xuXHRpZiAobXV0ZWQpIHJldHVybjtcblx0ZW1pdChcImFubm91bmNlXCIsIG1zZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXF1ZXN0UmVuZGVyKCk6IHZvaWQge1xuXHRlbWl0KFwicmVuZGVyXCIpO1xufVxuXG4vLyBVc2VkIGJ5IHRlc3RzIGFuZCB0aGUgc2ltdWxhdG9yIGJldHdlZW4gcnVucy5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhckhhbmRsZXJzKCk6IHZvaWQge1xuXHRoYW5kbGVycy5jbGVhcigpO1xufVxuIiwgImltcG9ydCB0eXBlIHsgU3RvcmFnZUJhY2tlbmQgfSBmcm9tIFwiLi90eXBlcy50c1wiO1xuXG4vLyBQZXJzaXN0ZW5jZSBhZGFwdGVyLiBUaGUgYnJvd3NlciBwYXNzZXMgbG9jYWxTdG9yYWdlLiBUaGUgc2ltdWxhdG9yIHBhc3NlcyBhblxuLy8gaW4gbWVtb3J5IG9iamVjdCwgb3Igbm90aGluZyBhdCBhbGwgd2hlbiBhIHJ1biBzaG91bGQgbm90IHBlcnNpc3QuXG5cbmxldCBiYWNrZW5kOiBTdG9yYWdlQmFja2VuZCB8IG51bGwgPSBudWxsO1xuXG5leHBvcnQgZnVuY3Rpb24gc2V0QmFja2VuZChiOiBTdG9yYWdlQmFja2VuZCB8IG51bGwpOiB2b2lkIHtcblx0YmFja2VuZCA9IGI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRJdGVtKGtleTogc3RyaW5nKTogc3RyaW5nIHwgbnVsbCB7XG5cdGlmICghYmFja2VuZCkgcmV0dXJuIG51bGw7XG5cdHRyeSB7XG5cdFx0cmV0dXJuIGJhY2tlbmQuZ2V0SXRlbShrZXkpO1xuXHR9IGNhdGNoIHtcblx0XHRyZXR1cm4gbnVsbDtcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gc2V0SXRlbShrZXk6IHN0cmluZywgdmFsdWU6IHN0cmluZyk6IHZvaWQge1xuXHRpZiAoIWJhY2tlbmQpIHJldHVybjtcblx0dHJ5IHtcblx0XHRiYWNrZW5kLnNldEl0ZW0oa2V5LCB2YWx1ZSk7XG5cdH0gY2F0Y2gge1xuXHRcdC8vIEEgZnVsbCBvciBibG9ja2VkIHN0b3JlIG11c3Qgbm90IHRha2UgdGhlIGdhbWUgZG93bi5cblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVtb3ZlSXRlbShrZXk6IHN0cmluZyk6IHZvaWQge1xuXHRpZiAoIWJhY2tlbmQpIHJldHVybjtcblx0dHJ5IHtcblx0XHRiYWNrZW5kLnJlbW92ZUl0ZW0oa2V5KTtcblx0fSBjYXRjaCB7XG5cdFx0Ly8gU2VlIHNldEl0ZW0uXG5cdH1cbn1cbiIsICJpbXBvcnQgeyBSRVNPVVJDRVMgfSBmcm9tIFwiLi4vY29udGVudC9yZXNvdXJjZXMudHNcIjtcbmltcG9ydCB7IEJVSUxESU5HUyB9IGZyb20gXCIuLi9jb250ZW50L2J1aWxkaW5ncy50c1wiO1xuaW1wb3J0IHsgc3RhdGUgfSBmcm9tIFwiLi9zdGF0ZS50c1wiO1xuaW1wb3J0IHsgZW50cmllcywga2V5cyB9IGZyb20gXCIuL3V0aWwudHNcIjtcbmltcG9ydCB7IFNMT1RfUkVGVU5EX1BDVCwgU1RPUkFHRV9CQVNFLCBTVE9SQUdFX0JBU0VfQ09TVCwgU1RPUkFHRV9DT1NUX0dST1dUSCwgU1RPUkFHRV9GSVJTVF9VUEdSQURFLCBTVE9SQUdFX0lOQ1JFTUVOVCB9IGZyb20gXCIuL2NvbnN0YW50cy50c1wiO1xuaW1wb3J0IHR5cGUgeyBQcm9kdWN0aW9uQmFsYW5jZSwgUHJvZHVjdGlvbk92ZXJ2aWV3LCBQcm9kdWN0aW9uUm93LCBQcm9kdWN0S2V5LCBQdXJjaGFzZVN1Z2dlc3Rpb24sIFJlc291cmNlS2V5LCBSZXdhcmRUeXBlIH0gZnJvbSBcIi4vdHlwZXMudHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRvdGFsSXRlbXMoKTogbnVtYmVyIHtcblx0cmV0dXJuIGtleXMoUkVTT1VSQ0VTKS5yZWR1Y2UoKHN1bSwgaykgPT4gc3VtICsgKHN0YXRlLmludmVudG9yeVtrXSA/PyAwKSwgMCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzdG9yYWdlTWF4KCk6IG51bWJlciB7XG5cdGNvbnN0IHRpZXIgPSBzdGF0ZS5zdG9yYWdlLnRpZXIgKyBnZXRQcmVzdGlnZUJvbnVzKFwic3RvcmFnZV90aWVyXCIpO1xuXHRpZiAodGllciA8PSAwKSByZXR1cm4gU1RPUkFHRV9CQVNFO1xuXHRyZXR1cm4gU1RPUkFHRV9GSVJTVF9VUEdSQURFICsgKCh0aWVyIC0gMSkgKiBTVE9SQUdFX0lOQ1JFTUVOVCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXh0U3RvcmFnZU1heCgpOiBudW1iZXIge1xuXHRjb25zdCB0aWVyID0gc3RhdGUuc3RvcmFnZS50aWVyICsgZ2V0UHJlc3RpZ2VCb251cyhcInN0b3JhZ2VfdGllclwiKTtcblx0aWYgKHRpZXIgPD0gMCkgcmV0dXJuIFNUT1JBR0VfRklSU1RfVVBHUkFERTtcblx0cmV0dXJuIHN0b3JhZ2VNYXgoKSArIFNUT1JBR0VfSU5DUkVNRU5UO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RvcmFnZVVwZ3JhZGVDb3N0KCk6IG51bWJlciB7XG5cdHJldHVybiBNYXRoLnJvdW5kKFNUT1JBR0VfQkFTRV9DT1NUICogTWF0aC5wb3coU1RPUkFHRV9DT1NUX0dST1dUSCwgc3RhdGUuc3RvcmFnZS50aWVyKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXh0U2xvdENvc3QoYmxkS2V5OiBzdHJpbmcsIHByb2R1Y3RLZXk6IFByb2R1Y3RLZXkpOiBudW1iZXIge1xuXHRjb25zdCBuID0gc3RhdGUuYnVpbGRpbmdzW2JsZEtleV0ucHJvZHVjdHNbcHJvZHVjdEtleV0uc2xvdHMubGVuZ3RoO1xuXHRjb25zdCBleHAgPSBCVUlMRElOR1NbYmxkS2V5XS5zbG90Q29zdEV4cG9uZW50ID8/IDEuNTtcblx0Y29uc3QgYmFzZSA9IEJVSUxESU5HU1tibGRLZXldLnByb2R1Y3RzW3Byb2R1Y3RLZXldLmJhc2VTbG90Q29zdCAqIE1hdGgucG93KGV4cCwgbik7XG5cdHJldHVybiBNYXRoLnJvdW5kKGJhc2UgKiBwcmVzdGlnZVNsb3RDb3N0TXVsdCgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGxhc3RTbG90Q29zdChibGRLZXk6IHN0cmluZywgcHJvZHVjdEtleTogUHJvZHVjdEtleSk6IG51bWJlciB7XG5cdGNvbnN0IG4gPSBzdGF0ZS5idWlsZGluZ3NbYmxkS2V5XS5wcm9kdWN0c1twcm9kdWN0S2V5XS5zbG90cy5sZW5ndGg7XG5cdGlmIChuID09PSAwKSByZXR1cm4gMDtcblx0Y29uc3QgZXhwID0gQlVJTERJTkdTW2JsZEtleV0uc2xvdENvc3RFeHBvbmVudCA/PyAxLjU7XG5cdGNvbnN0IGJhc2UgPSBCVUlMRElOR1NbYmxkS2V5XS5wcm9kdWN0c1twcm9kdWN0S2V5XS5iYXNlU2xvdENvc3QgKiBNYXRoLnBvdyhleHAsIG4gLSAxKTtcblx0cmV0dXJuIE1hdGgucm91bmQoYmFzZSAqIHByZXN0aWdlU2xvdENvc3RNdWx0KCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc2xvdFJlZnVuZChibGRLZXk6IHN0cmluZywgcHJvZHVjdEtleTogUHJvZHVjdEtleSk6IG51bWJlciB7XG5cdHJldHVybiBNYXRoLmZsb29yKGxhc3RTbG90Q29zdChibGRLZXksIHByb2R1Y3RLZXkpICogU0xPVF9SRUZVTkRfUENUKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGN1cnJlbnRQcmljZShyZXNvdXJjZUtleTogUmVzb3VyY2VLZXkpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5yb3VuZChSRVNPVVJDRVNbcmVzb3VyY2VLZXldLnByaWNlICogcHJlc3RpZ2VTZWxsTXVsdCgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQ29zdChibGRLZXk6IHN0cmluZyk6IG51bWJlciB7XG5cdHJldHVybiBNYXRoLnJvdW5kKEJVSUxESU5HU1tibGRLZXldLmJ1aWxkQ29zdCAqIHByZXN0aWdlQnVpbGRDb3N0TXVsdCgpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHVubG9ja0Nvc3QoYmxkS2V5OiBzdHJpbmcsIHByb2R1Y3RLZXk6IFByb2R1Y3RLZXkpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5yb3VuZChCVUlMRElOR1NbYmxkS2V5XS5wcm9kdWN0c1twcm9kdWN0S2V5XS51bmxvY2tDb3N0ICogcHJlc3RpZ2VVbmxvY2tDb3N0TXVsdCgpKTtcbn1cblxuLy8gUmVwbGFjZXMgdGhlIGNsb3N1cmVzIHRoZSBidWlsZGluZyBjb25maWcgdXNlZCB0byBjYXJyeSwgc28gY29udGVudCBzdGF5cyBkYXRhIG9ubHkuXG5leHBvcnQgZnVuY3Rpb24gYnVpbGRpbmdQcmVyZXFNZXQoYmxkS2V5OiBzdHJpbmcpOiBib29sZWFuIHtcblx0Y29uc3QgcCA9IEJVSUxESU5HU1tibGRLZXldLnByZXJlcTtcblx0aWYgKCFwKSByZXR1cm4gdHJ1ZTtcblx0Y29uc3QgYnN0ID0gc3RhdGUuYnVpbGRpbmdzW3AuYnVpbGRpbmddO1xuXHRpZiAoIWJzdD8udW5sb2NrZWQpIHJldHVybiBmYWxzZTtcblx0aWYgKHAucHJvZHVjdCAmJiAhYnN0LnByb2R1Y3RzW3AucHJvZHVjdF0/LnVubG9ja2VkKSByZXR1cm4gZmFsc2U7XG5cdHJldHVybiB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJlc3RpZ2VCb251cyh0eXBlOiBSZXdhcmRUeXBlKTogbnVtYmVyIHtcblx0cmV0dXJuIHN0YXRlLnByZXN0aWdlLnJld2FyZHMuZmlsdGVyKChyKSA9PiByLnR5cGUgPT09IHR5cGUpLnJlZHVjZSgocywgcikgPT4gcyArIHIuYW1vdW50LCAwKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFByZXN0aWdlTXVsdCh0eXBlOiBSZXdhcmRUeXBlKTogbnVtYmVyIHtcblx0Y29uc3QgcmV3YXJkcyA9IHN0YXRlLnByZXN0aWdlLnJld2FyZHMuZmlsdGVyKChyKSA9PiByLnR5cGUgPT09IHR5cGUpO1xuXHRpZiAodHlwZSA9PT0gXCJzZWxsX3ByaWNlX3BjdFwiIHx8IHR5cGUgPT09IFwiY3ljbGVfc3BlZWRfcGN0XCIgfHwgdHlwZSA9PT0gXCJ0cmVhc3VyZV9nb2xkX3BjdFwiKSByZXR1cm4gcmV3YXJkcy5yZWR1Y2UoKG0sIHIpID0+IG0gKiAoMSArIHIuYW1vdW50IC8gMTAwKSwgMSk7XG5cdHJldHVybiByZXdhcmRzLnJlZHVjZSgobSwgcikgPT4gbSAqICgxIC0gci5hbW91bnQgLyAxMDApLCAxKTtcbn1cblxuZXhwb3J0IGNvbnN0IHByZXN0aWdlU2xvdENvc3RNdWx0ID0gKCk6IG51bWJlciA9PiBnZXRQcmVzdGlnZU11bHQoXCJzbG90X2Nvc3RfcGN0XCIpO1xuZXhwb3J0IGNvbnN0IHByZXN0aWdlU2VsbE11bHQgPSAoKTogbnVtYmVyID0+IGdldFByZXN0aWdlTXVsdChcInNlbGxfcHJpY2VfcGN0XCIpO1xuZXhwb3J0IGNvbnN0IHByZXN0aWdlQnVpbGRDb3N0TXVsdCA9ICgpOiBudW1iZXIgPT4gZ2V0UHJlc3RpZ2VNdWx0KFwiYnVpbGRfY29zdF9wY3RcIik7XG5leHBvcnQgY29uc3QgcHJlc3RpZ2VVbmxvY2tDb3N0TXVsdCA9ICgpOiBudW1iZXIgPT4gZ2V0UHJlc3RpZ2VNdWx0KFwidW5sb2NrX2Nvc3RfcGN0XCIpO1xuZXhwb3J0IGNvbnN0IHByZXN0aWdlU3BlZWRNdWx0ID0gKCk6IG51bWJlciA9PiBnZXRQcmVzdGlnZU11bHQoXCJjeWNsZV9zcGVlZF9wY3RcIik7XG5leHBvcnQgY29uc3QgcHJlc3RpZ2VUcmVhc3VyZU11bHQgPSAoKTogbnVtYmVyID0+IGdldFByZXN0aWdlTXVsdChcInRyZWFzdXJlX2dvbGRfcGN0XCIpO1xuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VHJlYXN1cmVCYXNlVmFsdWUoKTogbnVtYmVyIHtcblx0bGV0IG1heFByaWNlID0gNTtcblx0Zm9yIChjb25zdCBibGRLZXkgb2YgT2JqZWN0LmtleXMoQlVJTERJTkdTKSkge1xuXHRcdGNvbnN0IGJzdCA9IHN0YXRlLmJ1aWxkaW5nc1tibGRLZXldO1xuXHRcdGlmICghYnN0Py51bmxvY2tlZCkgY29udGludWU7XG5cdFx0Zm9yIChjb25zdCBwcm9kS2V5IG9mIE9iamVjdC5rZXlzKEJVSUxESU5HU1tibGRLZXldLnByb2R1Y3RzKSkge1xuXHRcdFx0Y29uc3QgcHN0ID0gYnN0LnByb2R1Y3RzW3Byb2RLZXldO1xuXHRcdFx0aWYgKCFwc3Q/LnVubG9ja2VkKSBjb250aW51ZTtcblx0XHRcdGNvbnN0IHByaWNlID0gUkVTT1VSQ0VTW0JVSUxESU5HU1tibGRLZXldLnByb2R1Y3RzW3Byb2RLZXldLm91dHB1dEtleV0ucHJpY2U7XG5cdFx0XHRpZiAocHJpY2UgPiBtYXhQcmljZSkgbWF4UHJpY2UgPSBwcmljZTtcblx0XHR9XG5cdH1cblx0cmV0dXJuIG1heFByaWNlICogMTAwICogKDEgKyAoc3RhdGUucHJlc3RpZ2U/LnJ1bnMgPz8gMCkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0UHJvZHVjdGlvbk92ZXJ2aWV3KCk6IFByb2R1Y3Rpb25PdmVydmlldyB7XG5cdGNvbnN0IHByb2R1Y3RSb3dzOiBQcm9kdWN0aW9uUm93W10gPSBbXTtcblx0Y29uc3Qgc3VwcGx5UmF0ZXM6IFBhcnRpYWw8UmVjb3JkPFJlc291cmNlS2V5LCBudW1iZXI+PiA9IHt9O1xuXHRjb25zdCBkZW1hbmRSYXRlczogUGFydGlhbDxSZWNvcmQ8UmVzb3VyY2VLZXksIG51bWJlcj4+ID0ge307XG5cdGNvbnN0IGN5Y2xlU3BlZWRNdWx0ID0gcHJlc3RpZ2VTcGVlZE11bHQoKTtcblx0Zm9yIChjb25zdCBbYmxkS2V5LCBjZmddIG9mIGVudHJpZXMoQlVJTERJTkdTKSkge1xuXHRcdGNvbnN0IGJzdCA9IHN0YXRlLmJ1aWxkaW5nc1tibGRLZXldO1xuXHRcdGlmICghYnN0Py51bmxvY2tlZCkgY29udGludWU7XG5cdFx0Zm9yIChjb25zdCBbcHJvZHVjdEtleSwgcGNmZ10gb2YgZW50cmllcyhjZmcucHJvZHVjdHMpKSB7XG5cdFx0XHRjb25zdCBwc3QgPSBic3QucHJvZHVjdHNbcHJvZHVjdEtleV07XG5cdFx0XHRpZiAoIXBzdD8udW5sb2NrZWQpIGNvbnRpbnVlO1xuXHRcdFx0Y29uc3QgbiA9IHBzdC5zbG90cy5sZW5ndGg7XG5cdFx0XHRwcm9kdWN0Um93cy5wdXNoKHtcblx0XHRcdFx0cmVzb3VyY2VLZXk6IHBjZmcub3V0cHV0S2V5LFxuXHRcdFx0XHRlbmFibGVkOiBwc3QuZW5hYmxlZCxcblx0XHRcdFx0c2xvdHM6IG4sXG5cdFx0XHRcdG91dHB1dEFtdDogcGNmZy5vdXRwdXRBbXQsXG5cdFx0XHRcdGJhc2VDeWNsZU1zOiBwY2ZnLmJhc2VDeWNsZU1zLFxuXHRcdFx0fSk7XG5cdFx0XHRpZiAoIXBzdC5lbmFibGVkIHx8IG4gPT09IDApIGNvbnRpbnVlO1xuXHRcdFx0Y29uc3QgYWN0dWFsQ3ljbGVNcyA9IHBjZmcuYmFzZUN5Y2xlTXMgLyBjeWNsZVNwZWVkTXVsdDtcblx0XHRcdHN1cHBseVJhdGVzW3BjZmcub3V0cHV0S2V5XSA9IChzdXBwbHlSYXRlc1twY2ZnLm91dHB1dEtleV0gPz8gMCkgKyBuICogcGNmZy5vdXRwdXRBbXQgKiA2MDAwMCAvIGFjdHVhbEN5Y2xlTXM7XG5cdFx0XHRmb3IgKGNvbnN0IFtpbnB1dEtleSwgaW5wdXRBbXRdIG9mIGVudHJpZXMocGNmZy5pbnB1dHMgYXMgUmVjb3JkPFJlc291cmNlS2V5LCBudW1iZXI+KSkge1xuXHRcdFx0XHRkZW1hbmRSYXRlc1tpbnB1dEtleV0gPSAoZGVtYW5kUmF0ZXNbaW5wdXRLZXldID8/IDApICsgbiAqIGlucHV0QW10ICogNjAwMDAgLyBhY3R1YWxDeWNsZU1zO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRjb25zdCBoYXNDaGFpbiA9IE9iamVjdC5rZXlzKGRlbWFuZFJhdGVzKS5sZW5ndGggPiAwO1xuXHRjb25zdCBhbGxLZXlzID0gQXJyYXkuZnJvbShcblx0XHRuZXcgU2V0KFtcblx0XHRcdC4uLmtleXMoc3VwcGx5UmF0ZXMgYXMgUmVjb3JkPFJlc291cmNlS2V5LCBudW1iZXI+KSxcblx0XHRcdC4uLmtleXMoZGVtYW5kUmF0ZXMgYXMgUmVjb3JkPFJlc291cmNlS2V5LCBudW1iZXI+KSxcblx0XHRdKSxcblx0KTtcblx0Y29uc3QgYmFsYW5jZXM6IFByb2R1Y3Rpb25CYWxhbmNlW10gPSBhbGxLZXlzLmZpbHRlcigocmVzb3VyY2VLZXkpID0+IFJFU09VUkNFU1tyZXNvdXJjZUtleV0pLm1hcCgocmVzb3VyY2VLZXkpID0+ICh7XG5cdFx0cmVzb3VyY2VLZXksXG5cdFx0c3VwcGx5OiBzdXBwbHlSYXRlc1tyZXNvdXJjZUtleV0gPz8gMCxcblx0XHRkZW1hbmQ6IGRlbWFuZFJhdGVzW3Jlc291cmNlS2V5XSA/PyAwLFxuXHRcdG5ldDogKHN1cHBseVJhdGVzW3Jlc291cmNlS2V5XSA/PyAwKSAtIChkZW1hbmRSYXRlc1tyZXNvdXJjZUtleV0gPz8gMCksXG5cdH0pKTtcblx0Y29uc3QgZGVmaWNpdHMgPSBiYWxhbmNlcy5maWx0ZXIoKGVudHJ5KSA9PiBlbnRyeS5kZW1hbmQgPiAwICYmIGVudHJ5Lm5ldCA8IC0wLjA1KS5zb3J0KChhLCBiKSA9PiBhLm5ldCAtIGIubmV0KTtcblx0Y29uc3QgdG90YWxEZW1hbmQgPSBPYmplY3QudmFsdWVzKGRlbWFuZFJhdGVzKS5yZWR1Y2UoKHN1bTogbnVtYmVyLCB2YWx1ZSkgPT4gc3VtICsgKHZhbHVlID8/IDApLCAwKTtcblx0Y29uc3QgZnVsZmlsbG1lbnQgPSB0b3RhbERlbWFuZCA8PSAwID8gMCA6IGJhbGFuY2VzLmZpbHRlcigoZW50cnkpID0+IGVudHJ5LmRlbWFuZCA+IDApLnJlZHVjZSgoc3VtLCBlbnRyeSkgPT4ge1xuXHRcdGNvbnN0IGNvdmVyYWdlID0gTWF0aC5taW4oZW50cnkuc3VwcGx5IC8gZW50cnkuZGVtYW5kLCAxKTtcblx0XHRyZXR1cm4gc3VtICsgKGVudHJ5LmRlbWFuZCAqIGNvdmVyYWdlKTtcblx0fSwgMCk7XG5cdGNvbnN0IGVmZmljaWVuY3lQY3QgPSB0b3RhbERlbWFuZCA8PSAwID8gbnVsbCA6IE1hdGgucm91bmQoKGZ1bGZpbGxtZW50IC8gdG90YWxEZW1hbmQpICogMTAwKTtcblx0cmV0dXJuIHsgcHJvZHVjdFJvd3MsIGhhc0NoYWluLCBkZWZpY2l0cywgYmFsYW5jZXMsIGVmZmljaWVuY3lQY3QgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJlc3ROZXh0UHVyY2hhc2UoKTogUHVyY2hhc2VTdWdnZXN0aW9uIHwgbnVsbCB7XG5cdGNvbnN0IHsgZGVmaWNpdHMgfSA9IGdldFByb2R1Y3Rpb25PdmVydmlldygpO1xuXHRjb25zdCBkZWZpY2l0TWFwOiBQYXJ0aWFsPFJlY29yZDxSZXNvdXJjZUtleSwgbnVtYmVyPj4gPSB7fTtcblx0Zm9yIChjb25zdCBkIG9mIGRlZmljaXRzKSBkZWZpY2l0TWFwW2QucmVzb3VyY2VLZXldID0gZC5uZXQ7XG5cdGxldCBiZXN0OiBQdXJjaGFzZVN1Z2dlc3Rpb24gfCBudWxsID0gbnVsbDtcblx0bGV0IGJlc3RTY29yZSA9IC1JbmZpbml0eTtcblx0Zm9yIChjb25zdCBbYmssIGJzdF0gb2YgZW50cmllcyhzdGF0ZS5idWlsZGluZ3MpKSB7XG5cdFx0aWYgKCFic3QudW5sb2NrZWQpIGNvbnRpbnVlO1xuXHRcdGZvciAoY29uc3QgW3BrLCBwY2ZnXSBvZiBlbnRyaWVzKEJVSUxESU5HU1tia10ucHJvZHVjdHMpKSB7XG5cdFx0XHRpZiAoIWJzdC5wcm9kdWN0c1twa10udW5sb2NrZWQpIGNvbnRpbnVlO1xuXHRcdFx0Y29uc3QgY29zdCA9IG5leHRTbG90Q29zdChiaywgcGspO1xuXHRcdFx0aWYgKGNvc3QgPD0gMCkgY29udGludWU7XG5cdFx0XHRjb25zdCBvdXRwdXRSYXRlID0gcGNmZy5vdXRwdXRBbXQgKiA2MDAwMCAvIHBjZmcuYmFzZUN5Y2xlTXM7XG5cdFx0XHRsZXQgc2NvcmUgPSAob3V0cHV0UmF0ZSAqIGN1cnJlbnRQcmljZShwY2ZnLm91dHB1dEtleSkpIC8gY29zdDtcblx0XHRcdGNvbnN0IGRlZmljaXQgPSBkZWZpY2l0TWFwW3BjZmcub3V0cHV0S2V5XTtcblx0XHRcdGlmIChkZWZpY2l0ICE9PSB1bmRlZmluZWQpIHNjb3JlICo9IDEgKyBNYXRoLmFicyhkZWZpY2l0KTtcblx0XHRcdGlmIChzY29yZSA+IGJlc3RTY29yZSkge1xuXHRcdFx0XHRiZXN0U2NvcmUgPSBzY29yZTtcblx0XHRcdFx0YmVzdCA9IHtcblx0XHRcdFx0XHRibGRLZXk6IGJrLFxuXHRcdFx0XHRcdHByb2R1Y3RLZXk6IHBrLFxuXHRcdFx0XHRcdGNvc3QsXG5cdFx0XHRcdFx0bGFiZWw6IFJFU09VUkNFU1twY2ZnLm91dHB1dEtleV0ubGFiZWwsXG5cdFx0XHRcdFx0aXNEZWZpY2l0OiBkZWZpY2l0ICE9PSB1bmRlZmluZWQsXG5cdFx0XHRcdH07XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBiZXN0O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbmV4dEJ1aWxkYWJsZUJ1aWxkaW5nKCk6IHN0cmluZyB8IHVuZGVmaW5lZCB7XG5cdHJldHVybiBPYmplY3Qua2V5cyhCVUlMRElOR1MpLmZpbmQoKGspID0+ICFzdGF0ZS5idWlsZGluZ3Nba10udW5sb2NrZWQgJiYgYnVpbGRpbmdQcmVyZXFNZXQoaykpO1xufVxuIiwgImltcG9ydCB7IFJFU09VUkNFUyB9IGZyb20gXCIuLi9jb250ZW50L3Jlc291cmNlcy50c1wiO1xuaW1wb3J0IHsgcHJlc3RpZ2VTcGVlZE11bHQgfSBmcm9tIFwiLi9lY29ub215LnRzXCI7XG5pbXBvcnQgeyBlbnRyaWVzIH0gZnJvbSBcIi4vdXRpbC50c1wiO1xuaW1wb3J0IHR5cGUgeyBSZXNvdXJjZUtleSB9IGZyb20gXCIuL3R5cGVzLnRzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRJbnB1dHMoaW5wdXRzOiBQYXJ0aWFsPFJlY29yZDxSZXNvdXJjZUtleSwgbnVtYmVyPj4pOiBzdHJpbmcge1xuXHRyZXR1cm4gZW50cmllcyhpbnB1dHMgYXMgUmVjb3JkPFJlc291cmNlS2V5LCBudW1iZXI+KVxuXHRcdC5tYXAoKFtrLCBhbXRdKSA9PiBgJHthbXQudG9Mb2NhbGVTdHJpbmcoKX0gJHthbXQgPT09IDEgPyBSRVNPVVJDRVNba10uc2luZ3VsYXIgOiBSRVNPVVJDRVNba10ubGFiZWx9YClcblx0XHQuam9pbihcIiwgXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0UmVzb3VyY2VOYW1lKHJlc291cmNlS2V5OiBSZXNvdXJjZUtleSwgYW1vdW50OiBudW1iZXIpOiBzdHJpbmcge1xuXHRyZXR1cm4gYW1vdW50ID09PSAxID8gUkVTT1VSQ0VTW3Jlc291cmNlS2V5XS5zaW5ndWxhciA6IFJFU09VUkNFU1tyZXNvdXJjZUtleV0ubGFiZWw7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBmb3JtYXRSYXRlKHNsb3RzOiBudW1iZXIsIG91dHB1dEFtdDogbnVtYmVyLCBiYXNlQ3ljbGVNczogbnVtYmVyLCBsYWJlbCA9IFwiXCIpOiBzdHJpbmcge1xuXHRjb25zdCBwZXJNaW4gPSBzbG90cyAqIG91dHB1dEFtdCAqIDYwMDAwIC8gYmFzZUN5Y2xlTXM7XG5cdGNvbnN0IHJvdW5kZWQgPSBNYXRoLnJvdW5kKHBlck1pbiAqIDEwKSAvIDEwO1xuXHRjb25zdCBudW0gPSByb3VuZGVkICUgMSA9PT0gMCA/IGAke3JvdW5kZWQudG9Mb2NhbGVTdHJpbmcoKX1gIDogcm91bmRlZC50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHsgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAxLCBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDEgfSk7XG5cdHJldHVybiBsYWJlbCA/IGAke251bX0gJHtsYWJlbH0gcGVyIG1pbnV0ZWAgOiBgJHtudW19IHBlciBtaW51dGVgO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0UHJvZHVjdE91dHB1dChzbG90czogbnVtYmVyLCBvdXRwdXRBbXQ6IG51bWJlciwgYmFzZUN5Y2xlTXM6IG51bWJlciwgbGFiZWw6IFJlc291cmNlS2V5IHwgXCJcIiA9IFwiXCIsIGJyaWVmID0gZmFsc2UpOiBzdHJpbmcge1xuXHRjb25zdCB0b3RhbCA9IHNsb3RzICogb3V0cHV0QW10O1xuXHRjb25zdCBjeWNsZVNwZWVkTXVsdCA9IHByZXN0aWdlU3BlZWRNdWx0KCk7XG5cdGNvbnN0IGFjdHVhbEN5Y2xlTXMgPSBiYXNlQ3ljbGVNcyAvIGN5Y2xlU3BlZWRNdWx0O1xuXHRjb25zdCBhY3R1YWxTZWNzID0gYWN0dWFsQ3ljbGVNcyAvIDEwMDA7XG5cdGNvbnN0IHBlck1pbiA9IHRvdGFsICogNjAgLyBhY3R1YWxTZWNzO1xuXHRjb25zdCBwZXJNaW5GbXQgPSBwZXJNaW4udG9Mb2NhbGVTdHJpbmcodW5kZWZpbmVkLCB7IG1pbmltdW1GcmFjdGlvbkRpZ2l0czogMSwgbWF4aW11bUZyYWN0aW9uRGlnaXRzOiAxIH0pLnJlcGxhY2UoL1xcLjAkLywgXCJcIik7XG5cdGNvbnN0IGR1cmF0aW9uTnVtID0gYWN0dWFsU2Vjcy50b0xvY2FsZVN0cmluZyh1bmRlZmluZWQsIHsgbWluaW11bUZyYWN0aW9uRGlnaXRzOiAxLCBtYXhpbXVtRnJhY3Rpb25EaWdpdHM6IDEgfSkucmVwbGFjZSgvXFwuMCQvLCBcIlwiKTtcblx0Y29uc3QgZHVyYXRpb24gPSBgJHtkdXJhdGlvbk51bX0gJHthY3R1YWxTZWNzID09PSAxID8gXCJzZWNvbmRcIiA6IFwic2Vjb25kc1wifWA7XG5cdGNvbnN0IG5hbWUgPSBsYWJlbCA/ICh0b3RhbCA9PT0gMSA/IFJFU09VUkNFU1tsYWJlbF0uc2luZ3VsYXIgOiBSRVNPVVJDRVNbbGFiZWxdLmxhYmVsKSA6IFwiXCI7XG5cdGlmIChicmllZikgcmV0dXJuIGAke3RvdGFsLnRvTG9jYWxlU3RyaW5nKCl9JHtuYW1lID8gXCIgXCIgKyBuYW1lIDogXCJcIn0gZXZlcnkgJHtkdXJhdGlvbn1gO1xuXHRyZXR1cm4gYCR7dG90YWwudG9Mb2NhbGVTdHJpbmcoKX0ke25hbWUgPyBcIiBcIiArIG5hbWUgOiBcIlwifSBldmVyeSAke2R1cmF0aW9ufSAoJHtwZXJNaW5GbXR9IHBlciBtaW51dGUpYDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdER1cmF0aW9uKHNlY29uZHM6IG51bWJlcik6IHN0cmluZyB7XG5cdGlmIChzZWNvbmRzIDwgNjApIHJldHVybiBgJHtzZWNvbmRzLnRvTG9jYWxlU3RyaW5nKCl9ICR7c2Vjb25kcyA9PT0gMSA/IFwic2Vjb25kXCIgOiBcInNlY29uZHNcIn1gO1xuXHRjb25zdCBtaW5zID0gTWF0aC5yb3VuZChzZWNvbmRzIC8gNjApO1xuXHRpZiAobWlucyA8IDYwKSByZXR1cm4gYCR7bWlucy50b0xvY2FsZVN0cmluZygpfSAke21pbnMgPT09IDEgPyBcIm1pbnV0ZVwiIDogXCJtaW51dGVzXCJ9YDtcblx0Y29uc3QgaG91cnMgPSBNYXRoLnJvdW5kKG1pbnMgLyA2MCk7XG5cdHJldHVybiBgJHtob3Vycy50b0xvY2FsZVN0cmluZygpfSAke2hvdXJzID09PSAxID8gXCJob3VyXCIgOiBcImhvdXJzXCJ9YDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE51bShuOiBudW1iZXIpOiBzdHJpbmcge1xuXHRyZXR1cm4gbi50b0xvY2FsZVN0cmluZygpO1xufVxuIiwgImltcG9ydCB7IFJFU09VUkNFUyB9IGZyb20gXCIuLi9jb250ZW50L3Jlc291cmNlcy50c1wiO1xuaW1wb3J0IHsgQlVJTERJTkdTIH0gZnJvbSBcIi4uL2NvbnRlbnQvYnVpbGRpbmdzLnRzXCI7XG5pbXBvcnQgeyBydW50aW1lLCBzdGF0ZSB9IGZyb20gXCIuL3N0YXRlLnRzXCI7XG5pbXBvcnQgeyBwcmVzdGlnZVNwZWVkTXVsdCwgc3RvcmFnZU1heCwgdG90YWxJdGVtcyB9IGZyb20gXCIuL2Vjb25vbXkudHNcIjtcbmltcG9ydCB7IGZvcm1hdElucHV0cyB9IGZyb20gXCIuL2Zvcm1hdC50c1wiO1xuaW1wb3J0IHsgYW5ub3VuY2UgfSBmcm9tIFwiLi9ldmVudHMudHNcIjtcbmltcG9ydCB0eXBlIHsgUHJvZHVjdEtleSwgUmVzb3VyY2VLZXkgfSBmcm9tIFwiLi90eXBlcy50c1wiO1xuXG4vLyBPZmZsaW5lIGNhdGNoLXVwIHJlcGxheXMgYSBkYXkgb2YgZ2FtZSB0aW1lIG9uZSBzZWNvbmQgYXQgYSB0aW1lLCB3aGljaCBpcyB0ZW5zIG9mXG4vLyBtaWxsaW9ucyBvZiBzbG90IHVwZGF0ZXMuIEV2ZXJ5dGhpbmcgdGhhdCBkb2VzIG5vdCBjaGFuZ2UgYmV0d2VlbiBzdGVwcyBpcyB3b3JrZWQgb3V0XG4vLyBvbmNlLCBoZXJlLCBhdCBtb2R1bGUgbG9hZDogdGhlIGlucHV0IGxpc3RzLCB0aGUgbmV0IHN0b3JhZ2UgY2hhbmdlLCB0aGUgc3RhbGxcbi8vIG1lc3NhZ2VzLiBUaGUgc3RlcCBsb29wIGJlbG93IHRoZW4gZG9lcyBhcml0aG1ldGljIGFuZCBub3RoaW5nIGVsc2UuXG5pbnRlcmZhY2UgQ29tcGlsZWRQcm9kdWN0IHtcblx0YmxkS2V5OiBzdHJpbmc7XG5cdHByb2R1Y3RLZXk6IFByb2R1Y3RLZXk7XG5cdG91dHB1dEtleTogUmVzb3VyY2VLZXk7XG5cdG91dHB1dEFtdDogbnVtYmVyO1xuXHRiYXNlQ3ljbGVTZWM6IG51bWJlcjtcblx0aW5wdXRLZXlzOiBSZXNvdXJjZUtleVtdO1xuXHRpbnB1dEFtdHM6IG51bWJlcltdO1xuXHRuZXRDaGFuZ2U6IG51bWJlcjtcblx0c3RhbGxLZXk6IHN0cmluZztcblx0c3RvcmFnZVN0YWxsTXNnOiBzdHJpbmc7XG5cdGlucHV0U3RhbGxNc2c6IHN0cmluZztcbn1cblxuY29uc3QgQ09NUElMRUQ6IENvbXBpbGVkUHJvZHVjdFtdID0gT2JqZWN0LmVudHJpZXMoQlVJTERJTkdTKS5mbGF0TWFwKChbYmxkS2V5LCBjZmddKSA9PlxuXHRPYmplY3QuZW50cmllcyhjZmcucHJvZHVjdHMpLm1hcCgoW3Byb2R1Y3RLZXksIHBjZmddKSA9PiB7XG5cdFx0Y29uc3QgaW5wdXRzID0gcGNmZy5pbnB1dHMgYXMgUmVjb3JkPFJlc291cmNlS2V5LCBudW1iZXI+O1xuXHRcdGNvbnN0IGlucHV0S2V5cyA9IE9iamVjdC5rZXlzKGlucHV0cykgYXMgUmVzb3VyY2VLZXlbXTtcblx0XHRjb25zdCBpbnB1dEFtdHMgPSBpbnB1dEtleXMubWFwKChrKSA9PiBpbnB1dHNba10pO1xuXHRcdGNvbnN0IGlucHV0U3VtID0gaW5wdXRBbXRzLnJlZHVjZSgocywgbikgPT4gcyArIG4sIDApO1xuXHRcdGNvbnN0IGxhYmVsID0gUkVTT1VSQ0VTW3BjZmcub3V0cHV0S2V5XS5sYWJlbDtcblx0XHRyZXR1cm4ge1xuXHRcdFx0YmxkS2V5LFxuXHRcdFx0cHJvZHVjdEtleSxcblx0XHRcdG91dHB1dEtleTogcGNmZy5vdXRwdXRLZXksXG5cdFx0XHRvdXRwdXRBbXQ6IHBjZmcub3V0cHV0QW10LFxuXHRcdFx0YmFzZUN5Y2xlU2VjOiBwY2ZnLmJhc2VDeWNsZU1zIC8gMTAwMCxcblx0XHRcdGlucHV0S2V5cyxcblx0XHRcdGlucHV0QW10cyxcblx0XHRcdG5ldENoYW5nZTogcGNmZy5vdXRwdXRBbXQgLSBpbnB1dFN1bSxcblx0XHRcdHN0YWxsS2V5OiBgJHtibGRLZXl9LSR7cHJvZHVjdEtleX1gLFxuXHRcdFx0c3RvcmFnZVN0YWxsTXNnOiBgJHtsYWJlbH0gc3RhbGxlZCAtIHN0b3JhZ2UgZnVsbC5gLFxuXHRcdFx0aW5wdXRTdGFsbE1zZzogYCR7bGFiZWx9IHN0YWxsZWQgLSBuZWVkICR7Zm9ybWF0SW5wdXRzKHBjZmcuaW5wdXRzKX0uYCxcblx0XHR9O1xuXHR9KVxuKTtcblxuLy8gV2hlcmUgYSBibG9ja2VkIHNsb3QgcGFya3M6IGJhciBmdWxsLCB3YWl0aW5nIGZvciByb29tIG9yIGZvciBpbnB1dHMuXG5jb25zdCBTVEFMTEVEX1BST0dSRVNTID0gMC45OTk7XG5cbmZ1bmN0aW9uIG1hcmtTdGFsbGVkKGM6IENvbXBpbGVkUHJvZHVjdCwgbWVzc2FnZTogc3RyaW5nKTogdm9pZCB7XG5cdGNvbnN0IHNlZW4gPSBydW50aW1lLnN0YWxsQW5ub3VuY2VkW2Muc3RhbGxLZXldO1xuXHRpZiAoIXNlZW4pIHtcblx0XHRydW50aW1lLnN0YWxsQW5ub3VuY2VkW2Muc3RhbGxLZXldID0gXCJwZW5kaW5nXCI7XG5cdH0gZWxzZSBpZiAoc2VlbiA9PT0gXCJwZW5kaW5nXCIpIHtcblx0XHRydW50aW1lLnN0YWxsQW5ub3VuY2VkW2Muc3RhbGxLZXldID0gdHJ1ZTtcblx0XHRpZiAocnVudGltZS5zZWxlY3RlZEJ1aWxkaW5nID09PSBjLmJsZEtleSkgYW5ub3VuY2UobWVzc2FnZSk7XG5cdH1cbn1cblxuLy8gUmV0dXJucyBmYWxzZSB3aGVuIHRoZSBwcm9kdWN0aW9uIHN5c3RlbSBoYXMgcmVhY2hlZCBhIGZpeGVkIHBvaW50OiBub3RoaW5nIHdhcyBtYWRlXG4vLyBhbmQgZXZlcnkgcnVubmluZyBzbG90IGlzIGFscmVhZHkgcGlubmVkIGFnYWluc3QgYSBmdWxsIHN0b3JlIG9yIGEgbWlzc2luZyBpbnB1dC4gRnJvbVxuLy8gdGhlcmUgdGhlIHN0YXRlIGNhbm5vdCBjaGFuZ2Ugb24gaXRzIG93biwgc28gYSBjYWxsZXIgcmVwbGF5aW5nIGEgbG9uZyBhYnNlbmNlIGNhbiBzdG9wXG4vLyBhc2tpbmcuIFRoYXQgaXMgdGhlIG5vcm1hbCBzaGFwZSBvZiBiZWluZyBhd2F5LCBzaW5jZSBzdG9yYWdlIGZpbGxzIGFuZCB0aGVuIGV2ZXJ5dGhpbmdcbi8vIHdhaXRzLCBhbmQgaXQgdHVybnMgdGhlIHJlc3Qgb2YgYSAyNCBob3VyIGNhdGNoLXVwIGludG8gbm8gd29yayBhdCBhbGwuXG5leHBvcnQgZnVuY3Rpb24gYWR2YW5jZUJ1aWxkaW5ncyhkZWx0YVNlYzogbnVtYmVyKTogYm9vbGVhbiB7XG5cdGNvbnN0IHNwZWVkTXVsdCA9IHByZXN0aWdlU3BlZWRNdWx0KCk7XG5cdGNvbnN0IG1heCA9IHN0b3JhZ2VNYXgoKTtcblx0Y29uc3QgaW52ID0gc3RhdGUuaW52ZW50b3J5O1xuXHQvLyBSdW5uaW5nIGNvdW50IG9mIGV2ZXJ5dGhpbmcgaGVsZC4gT25seSBwcm9kdWN0aW9uIG1vdmVzIGl0IGR1cmluZyBhIHN0ZXAsIHNvIGl0XG5cdC8vIGNhbiBiZSBjYXJyaWVkIGluc3RlYWQgb2YgcmVzdW1tZWQgb24gZXZlcnkgc2luZ2xlIGNvbXBsZXRpb24uXG5cdGxldCB0b3RhbCA9IHRvdGFsSXRlbXMoKTtcblx0bGV0IGxpdmUgPSBmYWxzZTtcblx0Zm9yIChjb25zdCBjIG9mIENPTVBJTEVEKSB7XG5cdFx0Y29uc3QgYnN0ID0gc3RhdGUuYnVpbGRpbmdzW2MuYmxkS2V5XTtcblx0XHRpZiAoIWJzdC51bmxvY2tlZCkgY29udGludWU7XG5cdFx0Y29uc3QgcHN0ID0gYnN0LnByb2R1Y3RzW2MucHJvZHVjdEtleV07XG5cdFx0aWYgKCFwc3QudW5sb2NrZWQpIGNvbnRpbnVlO1xuXHRcdGlmICghcHN0LmVuYWJsZWQpIHtcblx0XHRcdGlmIChwc3QubWFudWFsLmFjdGl2ZSkge1xuXHRcdFx0XHRwc3QubWFudWFsLmFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHRwc3QubWFudWFsLnByb2dyZXNzID0gMDtcblx0XHRcdH1cblx0XHRcdGNvbnRpbnVlO1xuXHRcdH1cblx0XHRjb25zdCBjeWNsZVNlYyA9IGMuYmFzZUN5Y2xlU2VjIC8gc3BlZWRNdWx0O1xuXHRcdGNvbnN0IGFkdmFuY2UgPSBkZWx0YVNlYyAvIGN5Y2xlU2VjO1xuXHRcdGNvbnN0IHsgaW5wdXRLZXlzLCBpbnB1dEFtdHMsIG91dHB1dEtleSwgb3V0cHV0QW10LCBuZXRDaGFuZ2UgfSA9IGM7XG5cdFx0Y29uc3QgaW5wdXRDb3VudCA9IGlucHV0S2V5cy5sZW5ndGg7XG5cdFx0Zm9yIChjb25zdCBzbG90IG9mIHBzdC5zbG90cykge1xuXHRcdFx0Y29uc3QgYmVmb3JlID0gc2xvdC5wcm9ncmVzcztcblx0XHRcdHNsb3QucHJvZ3Jlc3MgKz0gYWR2YW5jZTtcblx0XHRcdHdoaWxlIChzbG90LnByb2dyZXNzID49IDEuMCkge1xuXHRcdFx0XHQvLyBUaGUgY3ljbGUgaXMgb25seSBzcGVudCBvbmNlIHRoZSBvdXRwdXQgY2FuIGFjdHVhbGx5IGJlIHBsYWNlZC4gVGhlIG9sZCBidWlsZFxuXHRcdFx0XHQvLyBzdWJ0cmFjdGVkIGl0IGZpcnN0LCBzbyBhIHNsb3Qgd2FpdGluZyBvbiBhIGZ1bGwgc3RvcmUgdGhyZXcgYXdheSBhIHdob2xlIGN5Y2xlXG5cdFx0XHRcdC8vIGV2ZXJ5IHRpY2sgaW5zdGVhZCBvZiBob2xkaW5nIGF0IHRoZSBicmluay5cblx0XHRcdFx0aWYgKG5ldENoYW5nZSA+IDAgJiYgdG90YWwgKyBuZXRDaGFuZ2UgPiBtYXgpIHtcblx0XHRcdFx0XHRzbG90LnByb2dyZXNzID0gU1RBTExFRF9QUk9HUkVTUztcblx0XHRcdFx0XHRtYXJrU3RhbGxlZChjLCBjLnN0b3JhZ2VTdGFsbE1zZyk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGV0IHN0YXJ2ZWQgPSBmYWxzZTtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dENvdW50OyBpKyspIHtcblx0XHRcdFx0XHRpZiAoaW52W2lucHV0S2V5c1tpXV0gPCBpbnB1dEFtdHNbaV0pIHtcblx0XHRcdFx0XHRcdHN0YXJ2ZWQgPSB0cnVlO1xuXHRcdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHRcdGlmIChzdGFydmVkKSB7XG5cdFx0XHRcdFx0c2xvdC5wcm9ncmVzcyA9IFNUQUxMRURfUFJPR1JFU1M7XG5cdFx0XHRcdFx0bWFya1N0YWxsZWQoYywgYy5pbnB1dFN0YWxsTXNnKTtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdFx0fVxuXHRcdFx0XHRzbG90LnByb2dyZXNzIC09IDEuMDtcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBpbnB1dENvdW50OyBpKyspIGludltpbnB1dEtleXNbaV1dIC09IGlucHV0QW10c1tpXTtcblx0XHRcdFx0aW52W291dHB1dEtleV0gKz0gb3V0cHV0QW10O1xuXHRcdFx0XHR0b3RhbCArPSBuZXRDaGFuZ2U7XG5cdFx0XHRcdGlmIChydW50aW1lLnN0YWxsQW5ub3VuY2VkW2Muc3RhbGxLZXldICE9PSB1bmRlZmluZWQpIGRlbGV0ZSBydW50aW1lLnN0YWxsQW5ub3VuY2VkW2Muc3RhbGxLZXldO1xuXHRcdFx0XHRsaXZlID0gdHJ1ZTtcblx0XHRcdH1cblx0XHRcdGlmIChzbG90LnByb2dyZXNzICE9PSBiZWZvcmUpIGxpdmUgPSB0cnVlO1xuXHRcdH1cblx0XHRpZiAocHN0Lm1hbnVhbC5hY3RpdmUpIHtcblx0XHRcdGxpdmUgPSB0cnVlO1xuXHRcdFx0cHN0Lm1hbnVhbC5wcm9ncmVzcyArPSBhZHZhbmNlO1xuXHRcdFx0aWYgKHBzdC5tYW51YWwucHJvZ3Jlc3MgPj0gMS4wKSB7XG5cdFx0XHRcdHBzdC5tYW51YWwucHJvZ3Jlc3MgPSAwO1xuXHRcdFx0XHRwc3QubWFudWFsLmFjdGl2ZSA9IGZhbHNlO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IGlucHV0Q291bnQ7IGkrKykgaW52W2lucHV0S2V5c1tpXV0gLT0gaW5wdXRBbXRzW2ldO1xuXHRcdFx0XHRpbnZbb3V0cHV0S2V5XSArPSBvdXRwdXRBbXQ7XG5cdFx0XHRcdHRvdGFsICs9IG5ldENoYW5nZTtcblx0XHRcdFx0YW5ub3VuY2UoYCR7UkVTT1VSQ0VTW291dHB1dEtleV0uc2luZ3VsYXJ9IHByb2R1Y2VkLmApO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gbGl2ZTtcbn1cbiIsICJpbXBvcnQgeyBzdGF0ZSB9IGZyb20gXCIuL3N0YXRlLnRzXCI7XG5pbXBvcnQgeyByYW5kb20gfSBmcm9tIFwiLi9ybmcudHNcIjtcbmltcG9ydCB7IGFubm91bmNlLCBlbWl0IH0gZnJvbSBcIi4vZXZlbnRzLnRzXCI7XG5pbXBvcnQgeyBUUkVBU1VSRV9EVVJBVElPTl9TUFJFQURfTVMsIFRSRUFTVVJFX0dBUF9TUFJFQURfTVMsIFRSRUFTVVJFX01JTl9EVVJBVElPTl9NUywgVFJFQVNVUkVfTUlOX0dBUF9NUyB9IGZyb20gXCIuL2NvbnN0YW50cy50c1wiO1xuXG4vLyBSdW5zIGluc2lkZSB0aGUgc2ltdWxhdGlvbiBzdGVwLCBzbyBjaGVzdHMgc3Bhd24gYW5kIGV4cGlyZSBvbiB0aGVpciBvd24gc2NoZWR1bGVcbi8vIHdoZXRoZXIgb3Igbm90IGFueW9uZSBpcyB3YXRjaGluZy4gT25lIHRoYXQgY2FtZSBhbmQgd2VudCB3aGlsZSB5b3Ugd2VyZSBhd2F5IGlzXG4vLyBzaW1wbHkgZ29uZSwgd2hpY2ggaXMgd2hhdCB0aGUgdGltZXN0YW1wcyBhbHdheXMgaW1wbGllZC5cbmV4cG9ydCBmdW5jdGlvbiBhZHZhbmNlVHJlYXN1cmUoYXRNczogbnVtYmVyKTogdm9pZCB7XG5cdGlmIChzdGF0ZS50cmVhc3VyZS5hY3RpdmVVbnRpbCAmJiBhdE1zID4gc3RhdGUudHJlYXN1cmUuYWN0aXZlVW50aWwpIHtcblx0XHRzdGF0ZS50cmVhc3VyZS5hY3RpdmVVbnRpbCA9IDA7XG5cdFx0ZW1pdChcInRyZWFzdXJlOmNoYW5nZVwiKTtcblx0fVxuXHRpZiAoIXN0YXRlLnRyZWFzdXJlLmFjdGl2ZVVudGlsICYmIGF0TXMgPiBzdGF0ZS50cmVhc3VyZS5uZXh0U3Bhd24pIHtcblx0XHRjb25zdCBkdXJhdGlvbiA9IFRSRUFTVVJFX01JTl9EVVJBVElPTl9NUyArIHJhbmRvbSgpICogVFJFQVNVUkVfRFVSQVRJT05fU1BSRUFEX01TO1xuXHRcdHN0YXRlLnRyZWFzdXJlLmFjdGl2ZVVudGlsID0gYXRNcyArIGR1cmF0aW9uO1xuXHRcdHN0YXRlLnRyZWFzdXJlLm5leHRTcGF3biA9IGF0TXMgKyBUUkVBU1VSRV9NSU5fR0FQX01TICsgcmFuZG9tKCkgKiBUUkVBU1VSRV9HQVBfU1BSRUFEX01TO1xuXHRcdGFubm91bmNlKGBUcmVhc3VyZSBjaGVzdCBzcGF3bmVkLCBhY3RpdmUgZm9yICR7TWF0aC5yb3VuZChkdXJhdGlvbiAvIDEwMDApfSBzZWNvbmRzIWApO1xuXHRcdGVtaXQoXCJ0cmVhc3VyZTpjaGFuZ2VcIik7XG5cdH1cbn1cbiIsICJpbXBvcnQgeyBzdGF0ZSB9IGZyb20gXCIuL3N0YXRlLnRzXCI7XG5pbXBvcnQgeyBhZHZhbmNlQnVpbGRpbmdzIH0gZnJvbSBcIi4vcHJvZHVjdGlvbi50c1wiO1xuaW1wb3J0IHsgYWR2YW5jZVRyZWFzdXJlIH0gZnJvbSBcIi4vdHJlYXN1cmUudHNcIjtcblxuLy8gT25lIGZpeGVkIHN0ZXAgZHJpdmVzIGV2ZXJ5dGhpbmc6IHRoZSBsaXZlIGdhbWUsIG9mZmxpbmUgY2F0Y2gtdXAsIGFuZCB0aGUgaGVhZGxlc3Ncbi8vIHNpbXVsYXRvci4gVGltZSB0aGF0IGRvZXMgbm90IGZpbGwgYSB3aG9sZSBzdGVwIGlzIGxlZnQgb24gdGhlIGNsb2NrIGFuZCBwaWNrZWQgdXAgYnlcbi8vIGEgbGF0ZXIgY2FsbCwgc28gYW4gaG91ciBwbGF5ZWQgYXQgdGhlIGtleWJvYXJkIGFuZCBhbiBob3VyIHNwZW50IGF3YXkgcHJvZHVjZSB0aGVcbi8vIHNhbWUgcmVzdWx0LiBUd28gY29kZSBwYXRocyB3b3VsZCBtZWFuIHR3byBzZXRzIG9mIGJ1Z3MgYW5kIG5vIHdheSB0byB0cnVzdCBlaXRoZXIuXG5leHBvcnQgY29uc3QgU1RFUF9NUyA9IDEwMDA7XG5jb25zdCBTVEVQX1NFQyA9IFNURVBfTVMgLyAxMDAwO1xuXG4vLyBBZHZhbmNlcyB0aGUgd29ybGQgdXAgdG8gdGFyZ2V0TXMgYW5kIHJldHVybnMgaG93IG1hbnkgc3RlcHMgcmFuLiBgYnVkZ2V0YCBjYXBzIHRoZVxuLy8gd29yayBpbiBvbmUgY2FsbCBzbyBhIHZlcnkgc3RhbGUgc2F2ZSBjYW5ub3QgbG9jayB0aGUgcGFnZSB1cCBtaWQgYm9vdC5cbmV4cG9ydCBmdW5jdGlvbiBhZHZhbmNlVG8odGFyZ2V0TXM6IG51bWJlciwgYnVkZ2V0ID0gSW5maW5pdHkpOiBudW1iZXIge1xuXHRpZiAoc3RhdGUubGFzdFRpY2sgPT09IG51bGwpIHtcblx0XHRzdGF0ZS5sYXN0VGljayA9IHRhcmdldE1zO1xuXHRcdHJldHVybiAwO1xuXHR9XG5cdGlmICh0YXJnZXRNcyA8IHN0YXRlLmxhc3RUaWNrKSB7XG5cdFx0Ly8gQ2xvY2sgbW92ZWQgYmFja3dhcmRzICh0aW1lem9uZSBjaGFuZ2UsIG1hbnVhbCBjbG9jayBlZGl0KS4gUmVzeW5jLCBkbyBubyB3b3JrLlxuXHRcdHN0YXRlLmxhc3RUaWNrID0gdGFyZ2V0TXM7XG5cdFx0cmV0dXJuIDA7XG5cdH1cblx0bGV0IHN0ZXBzID0gMDtcblx0Ly8gT25jZSBwcm9kdWN0aW9uIHJlcG9ydHMgYSBmaXhlZCBwb2ludCBpdCBzdGF5cyB0aGVyZSBmb3IgdGhlIHJlc3Qgb2YgdGhpcyBjYWxsOlxuXHQvLyBub3RoaW5nIG91dHNpZGUgdGhlIGxvb3AgdG91Y2hlcyBpbnZlbnRvcnksIGFuZCB0cmVhc3VyZSBvbmx5IHBheXMgZ29sZC5cblx0bGV0IHByb2R1Y3Rpb25MaXZlID0gdHJ1ZTtcblx0d2hpbGUgKHRhcmdldE1zIC0gc3RhdGUubGFzdFRpY2sgPj0gU1RFUF9NUyAmJiBzdGVwcyA8IGJ1ZGdldCkge1xuXHRcdHN0YXRlLmxhc3RUaWNrICs9IFNURVBfTVM7XG5cdFx0YWR2YW5jZVRyZWFzdXJlKHN0YXRlLmxhc3RUaWNrKTtcblx0XHRpZiAocHJvZHVjdGlvbkxpdmUpIHByb2R1Y3Rpb25MaXZlID0gYWR2YW5jZUJ1aWxkaW5ncyhTVEVQX1NFQyk7XG5cdFx0c3RlcHMrKztcblx0fVxuXHRyZXR1cm4gc3RlcHM7XG59XG5cbi8vIFN0ZXBzIHBlbmRpbmcgYmV0d2VlbiBsYXN0VGljayBhbmQgbm93LiBVc2VmdWwgZm9yIHJlcG9ydGluZyBhbmQgZm9yIHRlc3RzLlxuZXhwb3J0IGZ1bmN0aW9uIHBlbmRpbmdTdGVwcyhub3dNczogbnVtYmVyKTogbnVtYmVyIHtcblx0aWYgKHN0YXRlLmxhc3RUaWNrID09PSBudWxsKSByZXR1cm4gMDtcblx0cmV0dXJuIE1hdGgubWF4KDAsIE1hdGguZmxvb3IoKG5vd01zIC0gc3RhdGUubGFzdFRpY2spIC8gU1RFUF9NUykpO1xufVxuIiwgImltcG9ydCB7IGRlZXBNZXJnZSwgZnJlc2hTdGF0ZSwgcnVudGltZSwgc2V0U3RhdGUsIHN0YXRlIH0gZnJvbSBcIi4vc3RhdGUudHNcIjtcbmltcG9ydCB7IE9GRkxJTkVfQ0FQX01TLCBTQVZFX0tFWSB9IGZyb20gXCIuL2NvbnN0YW50cy50c1wiO1xuaW1wb3J0IHsgbWlncmF0ZSwgU2F2ZVRvb05ld0Vycm9yIH0gZnJvbSBcIi4vbWlncmF0aW9ucy50c1wiO1xuaW1wb3J0IHsgcm5nU3RhdGUsIHNldFJuZ1N0YXRlIH0gZnJvbSBcIi4vcm5nLnRzXCI7XG5pbXBvcnQgeyBhZHZhbmNlVG8sIFNURVBfTVMgfSBmcm9tIFwiLi9zaW0udHNcIjtcbmltcG9ydCB7IG5vdyB9IGZyb20gXCIuL2Nsb2NrLnRzXCI7XG5pbXBvcnQgeyBhbm5vdW5jZSwgc2V0TXV0ZWQgfSBmcm9tIFwiLi9ldmVudHMudHNcIjtcbmltcG9ydCB7IHRvdGFsSXRlbXMgfSBmcm9tIFwiLi9lY29ub215LnRzXCI7XG5pbXBvcnQgKiBhcyBzdG9yYWdlIGZyb20gXCIuL3N0b3JhZ2UudHNcIjtcbmltcG9ydCB0eXBlIHsgR2FtZVN0YXRlIH0gZnJvbSBcIi4vdHlwZXMudHNcIjtcblxuLy8gU2V0IHdoZW4gYSBzYXZlIGZyb20gYSBuZXdlciBidWlsZCBpcyBmb3VuZC4gV3JpdGluZyB3b3VsZCBvdmVyd3JpdGUgcHJvZ3Jlc3MgdGhpc1xuLy8gYnVpbGQgY2Fubm90IHJlYWQsIHNvIHRoZSBzZXNzaW9uIHJ1bnMgcmVhZCBvbmx5IGluc3RlYWQuXG5sZXQgc2F2ZUJsb2NrZWQgPSBmYWxzZTtcblxuZXhwb3J0IGZ1bmN0aW9uIGlzU2F2ZUJsb2NrZWQoKTogYm9vbGVhbiB7XG5cdHJldHVybiBzYXZlQmxvY2tlZDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNhdmUoKTogdm9pZCB7XG5cdGlmIChzYXZlQmxvY2tlZCkgcmV0dXJuO1xuXHRzdGF0ZS5ybmdTdGF0ZSA9IHJuZ1N0YXRlKCk7XG5cdHN0b3JhZ2Uuc2V0SXRlbShTQVZFX0tFWSwgSlNPTi5zdHJpbmdpZnkoc3RhdGUpKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJhd1NhdmUoKTogc3RyaW5nIHwgbnVsbCB7XG5cdHJldHVybiBzdG9yYWdlLmdldEl0ZW0oU0FWRV9LRVkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gd3JpdGVSYXdTYXZlKHRleHQ6IHN0cmluZyk6IHZvaWQge1xuXHRzdG9yYWdlLnNldEl0ZW0oU0FWRV9LRVksIHRleHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY2xlYXJTYXZlKCk6IHZvaWQge1xuXHRzYXZlQmxvY2tlZCA9IGZhbHNlO1xuXHRzdG9yYWdlLnJlbW92ZUl0ZW0oU0FWRV9LRVkpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbG9hZCgpOiB2b2lkIHtcblx0Y29uc3QgcmF3ID0gc3RvcmFnZS5nZXRJdGVtKFNBVkVfS0VZKTtcblx0aWYgKCFyYXcpIHJldHVybjtcblx0bGV0IHBhcnNlZDogUmVjb3JkPHN0cmluZywgYW55Pjtcblx0dHJ5IHtcblx0XHRwYXJzZWQgPSBKU09OLnBhcnNlKHJhdyk7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHRjb25zb2xlLmVycm9yKFwiU2F2ZSBpcyBub3QgdmFsaWQgSlNPTiwgc3RhcnRpbmcgZnJlc2g6XCIsIGUpO1xuXHRcdHNldFN0YXRlKGZyZXNoU3RhdGUoKSk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGxldCBtaWdyYXRlZDogUmVjb3JkPHN0cmluZywgYW55Pjtcblx0dHJ5IHtcblx0XHRtaWdyYXRlZCA9IG1pZ3JhdGUocGFyc2VkKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGlmIChlIGluc3RhbmNlb2YgU2F2ZVRvb05ld0Vycm9yKSB7XG5cdFx0XHRzYXZlQmxvY2tlZCA9IHRydWU7XG5cdFx0XHRjb25zb2xlLmVycm9yKGUubWVzc2FnZSk7XG5cdFx0XHRzZXRTdGF0ZShmcmVzaFN0YXRlKCkpO1xuXHRcdFx0YW5ub3VuY2UoXCJUaGlzIHNhdmUgd2FzIG1hZGUgYnkgYSBuZXdlciB2ZXJzaW9uIG9mIENyYWZ0ZXIuIFNhdmluZyBpcyBvZmYgc28gaXQgaXMgbm90IG92ZXJ3cml0dGVuLlwiKTtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRjb25zdCBmcmVzaCA9IGZyZXNoU3RhdGUoKTtcblx0ZGVlcE1lcmdlKGZyZXNoIGFzIHVua25vd24gYXMgUmVjb3JkPHN0cmluZywgdW5rbm93bj4sIG1pZ3JhdGVkKTtcblx0Y29uc3QgbGFzdFRpbWUgPSBmcmVzaC5sYXN0VGljaztcblx0c2V0U3RhdGUoZnJlc2ggYXMgR2FtZVN0YXRlKTtcblx0c2V0Um5nU3RhdGUoc3RhdGUucm5nU3RhdGUpO1xuXHRydW50aW1lLm5leHRTbG90SWQgPSBoaWdoZXN0U2xvdElkKCk7XG5cdGlmIChsYXN0VGltZSAhPT0gbnVsbCkgYXBwbHlPZmZsaW5lUHJvZ3Jlc3MoKTtcbn1cblxuZnVuY3Rpb24gaGlnaGVzdFNsb3RJZCgpOiBudW1iZXIge1xuXHRsZXQgbWF4SWQgPSAwO1xuXHRmb3IgKGNvbnN0IGJzdCBvZiBPYmplY3QudmFsdWVzKHN0YXRlLmJ1aWxkaW5ncykpIHtcblx0XHRmb3IgKGNvbnN0IHBzdCBvZiBPYmplY3QudmFsdWVzKGJzdC5wcm9kdWN0cykpIHtcblx0XHRcdGZvciAoY29uc3Qgc2xvdCBvZiBwc3Quc2xvdHMpIHtcblx0XHRcdFx0aWYgKHNsb3QuaWQgPiBtYXhJZCkgbWF4SWQgPSBzbG90LmlkO1xuXHRcdFx0fVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gbWF4SWQ7XG59XG5cbi8vIFJlcGxheXMgdGhlIHRpbWUgYXdheSB0aHJvdWdoIHRoZSBzYW1lIHN0ZXAgdGhlIGxpdmUgZ2FtZSB1c2VzLiBUaGUgb2xkIGJ1aWxkIHJhbiBhXG4vLyBzZXBhcmF0ZSBvbmUgcGFzcyBlc3RpbWF0ZSBoZXJlLCB3aGljaCB1bmRlciBjb3VudGVkIGFueXRoaW5nIHRoYXQgZmVkIGEgbGF0ZXIgc3RhZ2Vcbi8vIG9mIGEgY2hhaW4sIGJlY2F1c2UgYSBzdGFnZSBjb3VsZCBvbmx5IGNvbnN1bWUgd2hhdCB3YXMgYWxyZWFkeSBpbiBzdG9yYWdlIHdoZW4gdGhlXG4vLyBwYXNzIHJlYWNoZWQgaXQuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlPZmZsaW5lUHJvZ3Jlc3MoKTogbnVtYmVyIHtcblx0aWYgKHN0YXRlLmxhc3RUaWNrID09PSBudWxsKSByZXR1cm4gMDtcblx0Y29uc3QgdGFyZ2V0ID0gbm93KCk7XG5cdGNvbnN0IGF3YXkgPSB0YXJnZXQgLSBzdGF0ZS5sYXN0VGljaztcblx0aWYgKGF3YXkgPCBTVEVQX01TKSByZXR1cm4gMDtcblx0aWYgKGF3YXkgPiBPRkZMSU5FX0NBUF9NUykgc3RhdGUubGFzdFRpY2sgPSB0YXJnZXQgLSBPRkZMSU5FX0NBUF9NUztcblx0Y29uc3QgYmVmb3JlID0gdG90YWxJdGVtcygpO1xuXHRzZXRNdXRlZCh0cnVlKTtcblx0dHJ5IHtcblx0XHRhZHZhbmNlVG8odGFyZ2V0KTtcblx0fSBmaW5hbGx5IHtcblx0XHRzZXRNdXRlZChmYWxzZSk7XG5cdH1cblx0c3RhdGUubGFzdFRpY2sgPSB0YXJnZXQ7XG5cdGNvbnN0IGdhaW5lZCA9IHRvdGFsSXRlbXMoKSAtIGJlZm9yZTtcblx0aWYgKGdhaW5lZCA+IDApIGFubm91bmNlKGBXZWxjb21lIGJhY2shIFlvdXIgd29ya2VycyBwcm9kdWNlZCAke2dhaW5lZC50b0xvY2FsZVN0cmluZygpfSBpdGVtcyB3aGlsZSB5b3Ugd2VyZSBhd2F5LmApO1xuXHRyZXR1cm4gZ2FpbmVkO1xufVxuIiwgIi8vIFJlY29yZHMgd2hhdCB0aGUgcGxheWVyIGFjdHVhbGx5IGRpZCwgd2l0aCB0aW1lc3RhbXBzLlxuLy9cbi8vIFRoaXMgaXMgdGhlIGdyb3VuZCB0cnV0aCB0aGUgYmFsYW5jZSB3b3JrIHJlc3RzIG9uLiBBIHJlY29yZGVkIHNlc3Npb24gY2FuIGJlIHJlcGxheWVkXG4vLyB0aHJvdWdoIHRoZSBoZWFkbGVzcyBjb3JlIGFuZCB0aGUgcmVzdWx0aW5nIHN0YXRlIGNvbXBhcmVkIGFnYWluc3Qgd2hhdCB0aGUgYnJvd3NlclxuLy8gcmVhbGx5IGhlbGQuIElmIHRoZXkgZGlmZmVyLCB0aGUgc2ltdWxhdG9yIGlzIGx5aW5nIGFuZCBldmVyeSBudW1iZXIgaXQgcHJvZHVjZXMgaXNcbi8vIHdvcnRobGVzcy4gV2l0aG91dCB0aGlzIHRoZXJlIGlzIG5vIHdheSB0byBmaW5kIHRoYXQgb3V0IGV4Y2VwdCBieSBwbGF5aW5nIHRoZSBnYW1lXG4vLyB5b3Vyc2VsZiBhbmQgbm90aWNpbmcgdGhlIGVzdGltYXRlIHdhcyBub3doZXJlIGNsb3NlLlxuXG5pbXBvcnQgeyBub3cgfSBmcm9tIFwiLi9jbG9jay50c1wiO1xuXG5leHBvcnQgdHlwZSBKb3VybmFsUGFyYW0gPSBzdHJpbmcgfCBudW1iZXI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSm91cm5hbEVudHJ5IHtcblx0LyoqIFdhbGwgY2xvY2sgdGltZSBvZiB0aGUgYWN0aW9uLiAqL1xuXHR0OiBudW1iZXI7XG5cdC8qKiBBY3Rpb24gbmFtZSwgbWF0Y2hpbmcgYSBrZXkgaW4gdGhlIHJlcGxheSB0YWJsZS4gKi9cblx0YTogc3RyaW5nO1xuXHQvKiogUG9zaXRpb25hbCBhcmd1bWVudHMsIGlmIGFueS4gKi9cblx0cD86IEpvdXJuYWxQYXJhbVtdO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlY29yZGluZyB7XG5cdGZvcm1hdDogMTtcblx0c3RhcnRlZEF0OiBudW1iZXI7XG5cdHNlZWQ6IG51bWJlcjtcblx0LyoqIFN0YXRlIGF0IHRoZSBtb21lbnQgcmVjb3JkaW5nIGJlZ2FuLCBhcyBKU09OLiAqL1xuXHRzdGFydFN0YXRlOiB1bmtub3duO1xuXHRlbnRyaWVzOiBKb3VybmFsRW50cnlbXTtcbn1cblxuLy8gQSBsb25nIHNlc3Npb24gaXMgdGhvdXNhbmRzIG9mIGNsaWNrcywgbm90IG1pbGxpb25zLiBUaGUgY2FwIHN0b3BzIGEgcnVuYXdheSBsb29wIGZyb21cbi8vIGVhdGluZyBtZW1vcnksIGFuZCBsb3NpbmcgdGhlIG9sZGVzdCBlbnRyaWVzIGlzIGJldHRlciB0aGFuIGxvc2luZyB0aGUgdGFiLlxuY29uc3QgTUFYX0VOVFJJRVMgPSA1MF8wMDA7XG5cbmxldCBlbnRyaWVzOiBKb3VybmFsRW50cnlbXSA9IFtdO1xubGV0IHN0YXJ0U3RhdGU6IHVua25vd24gPSBudWxsO1xubGV0IHN0YXJ0ZWRBdCA9IDA7XG5sZXQgc2VlZCA9IDA7XG5sZXQgcmVjb3JkaW5nID0gZmFsc2U7XG5cbmV4cG9ydCBmdW5jdGlvbiBzdGFydFJlY29yZGluZyhzdGF0ZVNuYXBzaG90OiB1bmtub3duLCBybmdTZWVkOiBudW1iZXIpOiB2b2lkIHtcblx0ZW50cmllcyA9IFtdO1xuXHRzdGFydFN0YXRlID0gc3RhdGVTbmFwc2hvdDtcblx0c3RhcnRlZEF0ID0gbm93KCk7XG5cdHNlZWQgPSBybmdTZWVkO1xuXHRyZWNvcmRpbmcgPSB0cnVlO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gc3RvcFJlY29yZGluZygpOiB2b2lkIHtcblx0cmVjb3JkaW5nID0gZmFsc2U7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc1JlY29yZGluZygpOiBib29sZWFuIHtcblx0cmV0dXJuIHJlY29yZGluZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlY29yZChhY3Rpb246IHN0cmluZywgLi4ucGFyYW1zOiBKb3VybmFsUGFyYW1bXSk6IHZvaWQge1xuXHRpZiAoIXJlY29yZGluZykgcmV0dXJuO1xuXHRpZiAoZW50cmllcy5sZW5ndGggPj0gTUFYX0VOVFJJRVMpIGVudHJpZXMuc2hpZnQoKTtcblx0ZW50cmllcy5wdXNoKHBhcmFtcy5sZW5ndGggPiAwID8geyB0OiBub3coKSwgYTogYWN0aW9uLCBwOiBwYXJhbXMgfSA6IHsgdDogbm93KCksIGE6IGFjdGlvbiB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFJlY29yZGluZygpOiBSZWNvcmRpbmcgfCBudWxsIHtcblx0aWYgKHN0YXJ0U3RhdGUgPT09IG51bGwpIHJldHVybiBudWxsO1xuXHRyZXR1cm4geyBmb3JtYXQ6IDEsIHN0YXJ0ZWRBdCwgc2VlZCwgc3RhcnRTdGF0ZSwgZW50cmllczogWy4uLmVudHJpZXNdIH07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBlbnRyeUNvdW50KCk6IG51bWJlciB7XG5cdHJldHVybiBlbnRyaWVzLmxlbmd0aDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNsZWFyUmVjb3JkaW5nKCk6IHZvaWQge1xuXHRlbnRyaWVzID0gW107XG5cdHN0YXJ0U3RhdGUgPSBudWxsO1xuXHRyZWNvcmRpbmcgPSBmYWxzZTtcbn1cbiIsICJpbXBvcnQgeyBCQVNFTElORV9RVUVTVF9UWVBFUywgUVVFU1RfQ0hBSU5TLCBRVUVTVF9QT09MIH0gZnJvbSBcIi4uL2NvbnRlbnQvcXVlc3RzLnRzXCI7XG5pbXBvcnQgeyBzdGF0ZSB9IGZyb20gXCIuL3N0YXRlLnRzXCI7XG5pbXBvcnQgeyBRVUVTVF9TTE9UUywgUkVST0xMX0JBU0VfQ09TVCwgUkVST0xMX0NPU1RfR1JPV1RIIH0gZnJvbSBcIi4vY29uc3RhbnRzLnRzXCI7XG5pbXBvcnQgeyBzaHVmZmxlIH0gZnJvbSBcIi4vcm5nLnRzXCI7XG5pbXBvcnQgeyBhbm5vdW5jZSwgZW1pdCwgcmVxdWVzdFJlbmRlciB9IGZyb20gXCIuL2V2ZW50cy50c1wiO1xuaW1wb3J0IHsgc2F2ZSB9IGZyb20gXCIuL3NhdmUudHNcIjtcbmltcG9ydCB7IHJlY29yZCB9IGZyb20gXCIuL2pvdXJuYWwudHNcIjtcbmltcG9ydCB0eXBlIHsgUXVlc3REZWYgfSBmcm9tIFwiLi90eXBlcy50c1wiO1xuXG5leHBvcnQgaW50ZXJmYWNlIFF1ZXN0UHJvZ3Jlc3Mge1xuXHRjdXJyZW50OiBudW1iZXI7XG5cdHRhcmdldDogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcXVlc3RCeUlkKGlkOiBzdHJpbmcpOiBRdWVzdERlZiB8IHVuZGVmaW5lZCB7XG5cdHJldHVybiBRVUVTVF9QT09MLmZpbmQoKHEpID0+IHEuaWQgPT09IGlkKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGVsaWdpYmxlUXVlc3RQb29sKCk6IFF1ZXN0RGVmW10ge1xuXHRjb25zdCBjb21wbGV0ZWQgPSBuZXcgU2V0KHN0YXRlLnByZXN0aWdlLmNvbXBsZXRlZFF1ZXN0SWRzKTtcblx0Y29uc3Qgc2VlbiA9IG5ldyBTZXQoW1wibHVtYmVyX3lhcmRcIiwgLi4uc3RhdGUucHJlc3RpZ2Uuc2VlbkJ1aWxkaW5nc10pO1xuXHRjb25zdCBwb29sOiBRdWVzdERlZltdID0gW107XG5cdGZvciAoY29uc3QgY2hhaW4gb2YgUVVFU1RfQ0hBSU5TKSB7XG5cdFx0aWYgKGNoYWluLnByZXJlcSAmJiAhc2Vlbi5oYXMoY2hhaW4ucHJlcmVxKSkgY29udGludWU7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjaGFpbi50aWVycy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgcXVlc3RJZCA9IGAke2NoYWluLmlkfV90JHtpfWA7XG5cdFx0XHRpZiAoIWNvbXBsZXRlZC5oYXMocXVlc3RJZCkpIHtcblx0XHRcdFx0Y29uc3QgcSA9IHF1ZXN0QnlJZChxdWVzdElkKTtcblx0XHRcdFx0aWYgKHEpIHBvb2wucHVzaChxKTtcblx0XHRcdFx0YnJlYWs7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cdHJldHVybiBwb29sO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNHYW1lQ29tcGxldGUoKTogYm9vbGVhbiB7XG5cdGNvbnN0IGNvbXBsZXRlZCA9IG5ldyBTZXQoc3RhdGUucHJlc3RpZ2UuY29tcGxldGVkUXVlc3RJZHMpO1xuXHRyZXR1cm4gUVVFU1RfUE9PTC5ldmVyeSgocSkgPT4gY29tcGxldGVkLmhhcyhxLmlkKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXRRdWVzdFByb2dyZXNzKGRlZjogUXVlc3REZWYsIGJhc2VsaW5lID0gMCk6IFF1ZXN0UHJvZ3Jlc3Mge1xuXHRjb25zdCBhY2MgPSBzdGF0ZS5wcmVzdGlnZS5hY2N1bXVsYXRlZFN0YXRzO1xuXHRsZXQgcmF3OiBudW1iZXI7XG5cdHN3aXRjaCAoZGVmLnR5cGUpIHtcblx0XHRjYXNlIFwidHJlYXN1cmVcIjpcblx0XHRcdHJhdyA9IChhY2MudHJlYXN1cmVDaGVzdHNPcGVuZWQgPz8gMCkgKyAoc3RhdGUuc3RhdHMudHJlYXN1cmVDaGVzdHNPcGVuZWQgPz8gMCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwic2VsbFwiOiB7XG5cdFx0XHRjb25zdCBrZXkgPSBkZWYucmVzb3VyY2UhO1xuXHRcdFx0cmF3ID0gKGFjYy5zb2xkQnlSZXNvdXJjZVtrZXldID8/IDApICsgKHN0YXRlLnN0YXRzLnNvbGRCeVJlc291cmNlW2tleV0gPz8gMCk7XG5cdFx0XHRicmVhaztcblx0XHR9XG5cdFx0Y2FzZSBcInNsb3RzXCI6IHtcblx0XHRcdGNvbnN0IGN1cnJlbnQgPSBzdGF0ZS5idWlsZGluZ3NbZGVmLmJsZCFdPy5wcm9kdWN0c1tkZWYucHJvZHVjdCFdPy5zbG90cy5sZW5ndGggPz8gMDtcblx0XHRcdGNvbnN0IGtleSA9IGAke2RlZi5ibGR9LiR7ZGVmLnByb2R1Y3R9YDtcblx0XHRcdGNvbnN0IHRvdGFsUHJldiA9IGFjYy50b3RhbFNsb3RzQnlQcm9kdWN0Py5ba2V5XSA/PyBhY2MubWF4U2xvdHNCeVByb2R1Y3Q/LltrZXldID8/IDA7XG5cdFx0XHRyYXcgPSB0b3RhbFByZXYgKyBjdXJyZW50O1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdGNhc2UgXCJ0b3RhbF9zbG90c1wiOiB7XG5cdFx0XHRyYXcgPSBhY2MudG90YWxTbG90cztcblx0XHRcdGZvciAoY29uc3QgYnN0IG9mIE9iamVjdC52YWx1ZXMoc3RhdGUuYnVpbGRpbmdzKSkge1xuXHRcdFx0XHRmb3IgKGNvbnN0IHBzdCBvZiBPYmplY3QudmFsdWVzKGJzdC5wcm9kdWN0cykpIHJhdyArPSBwc3Quc2xvdHMubGVuZ3RoO1xuXHRcdFx0fVxuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHRcdGNhc2UgXCJidWlsZFwiOlxuXHRcdFx0cmF3ID0gc3RhdGUuYnVpbGRpbmdzW2RlZi5ibGQhXT8udW5sb2NrZWQgPyAxIDogMDtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJ1bmxvY2tcIjpcblx0XHRcdHJhdyA9IHN0YXRlLmJ1aWxkaW5nc1tkZWYuYmxkIV0/LnByb2R1Y3RzW2RlZi5wcm9kdWN0IV0/LnVubG9ja2VkID8gMSA6IDA7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwic3RvcmFnZVwiOlxuXHRcdFx0cmF3ID0gYWNjLnN0b3JhZ2VVcGdyYWRlcyArIHN0YXRlLnN0b3JhZ2UudGllcjtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJnb2xkX2Vhcm5lZFwiOlxuXHRcdFx0cmF3ID0gYWNjLmdvbGRFYXJuZWQgKyBzdGF0ZS5zdGF0cy5nb2xkRWFybmVkO1xuXHRcdFx0YnJlYWs7XG5cdFx0ZGVmYXVsdDpcblx0XHRcdHJhdyA9IDA7XG5cdH1cblx0cmV0dXJuIHsgY3VycmVudDogTWF0aC5tYXgoMCwgcmF3IC0gYmFzZWxpbmUpLCB0YXJnZXQ6IGRlZi50YXJnZXQgfTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHF1ZXN0QmFzZWxpbmUoaWQ6IHN0cmluZywgZGVmOiBRdWVzdERlZik6IG51bWJlciB7XG5cdHJldHVybiBCQVNFTElORV9RVUVTVF9UWVBFUy5oYXMoZGVmLnR5cGUpID8gKHN0YXRlLnF1ZXN0cy5iYXNlbGluZXM/LltpZF0gPz8gMCkgOiAwO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZmx1c2hTYXRpc2ZpZWRRdWVzdHMoKTogdm9pZCB7XG5cdGNvbnN0IGNvbXBsZXRlZCA9IG5ldyBTZXQoc3RhdGUucHJlc3RpZ2UuY29tcGxldGVkUXVlc3RJZHMpO1xuXHRjb25zdCBzZWVuID0gbmV3IFNldChbXCJsdW1iZXJfeWFyZFwiLCAuLi5zdGF0ZS5wcmVzdGlnZS5zZWVuQnVpbGRpbmdzXSk7XG5cdGxldCBjaGFuZ2VkID0gZmFsc2U7XG5cdGZvciAoY29uc3QgY2hhaW4gb2YgUVVFU1RfQ0hBSU5TKSB7XG5cdFx0aWYgKGNoYWluLnByZXJlcSAmJiAhc2Vlbi5oYXMoY2hhaW4ucHJlcmVxKSkgY29udGludWU7XG5cdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCBjaGFpbi50aWVycy5sZW5ndGg7IGkrKykge1xuXHRcdFx0Y29uc3QgcXVlc3RJZCA9IGAke2NoYWluLmlkfV90JHtpfWA7XG5cdFx0XHRpZiAoY29tcGxldGVkLmhhcyhxdWVzdElkKSkgY29udGludWU7XG5cdFx0XHRjb25zdCBxID0gcXVlc3RCeUlkKHF1ZXN0SWQpO1xuXHRcdFx0aWYgKCFxKSBicmVhaztcblx0XHRcdGNvbnN0IHsgY3VycmVudCwgdGFyZ2V0IH0gPSBnZXRRdWVzdFByb2dyZXNzKHEpO1xuXHRcdFx0aWYgKGN1cnJlbnQgPj0gdGFyZ2V0KSB7XG5cdFx0XHRcdHN0YXRlLnByZXN0aWdlLmNvbXBsZXRlZFF1ZXN0SWRzLnB1c2gocXVlc3RJZCk7XG5cdFx0XHRcdHN0YXRlLnByZXN0aWdlLnJld2FyZHMucHVzaChxLnJld2FyZCk7XG5cdFx0XHRcdGNvbXBsZXRlZC5hZGQocXVlc3RJZCk7XG5cdFx0XHRcdGNoYW5nZWQgPSB0cnVlO1xuXHRcdFx0fSBlbHNlIGJyZWFrO1xuXHRcdH1cblx0fVxuXHRpZiAoY2hhbmdlZCkgc2F2ZSgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVyb2xsQ29zdCgpOiBudW1iZXIge1xuXHRyZXR1cm4gTWF0aC5yb3VuZChSRVJPTExfQkFTRV9DT1NUICogTWF0aC5wb3coUkVST0xMX0NPU1RfR1JPV1RILCBzdGF0ZS5xdWVzdHMucmVyb2xscyA/PyAwKSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXJvbGxRdWVzdChpbmRleDogbnVtYmVyKTogdm9pZCB7XG5cdHJlY29yZChcInJlcm9sbFwiLCBpbmRleCk7XG5cdGNvbnN0IGNvc3QgPSByZXJvbGxDb3N0KCk7XG5cdGlmIChzdGF0ZS5nb2xkIDwgY29zdCkge1xuXHRcdGFubm91bmNlKGBOZWVkICR7Y29zdC50b0xvY2FsZVN0cmluZygpfSBnb2xkIHRvIHJlcm9sbC5gKTtcblx0XHRyZXR1cm47XG5cdH1cblx0Y29uc3QgcG9vbCA9IGVsaWdpYmxlUXVlc3RQb29sKCk7XG5cdGNvbnN0IGtlZXBJZHMgPSBuZXcgU2V0KHN0YXRlLnF1ZXN0cy5hY3RpdmUuZmlsdGVyKChfLCBpKSA9PiBpICE9PSBpbmRleCkpO1xuXHRjb25zdCBhdmFpbGFibGUgPSBwb29sLmZpbHRlcigocSkgPT4gIWtlZXBJZHMuaGFzKHEuaWQpICYmIHEuaWQgIT09IHN0YXRlLnF1ZXN0cy5hY3RpdmVbaW5kZXhdKS5zb3J0KHNodWZmbGUpO1xuXHRjb25zdCBuZXdRdWVzdCA9IGF2YWlsYWJsZVswXTtcblx0aWYgKCFuZXdRdWVzdCkge1xuXHRcdGFubm91bmNlKFwiTm8gb3RoZXIgcXVlc3RzIGF2YWlsYWJsZSB0byByZXJvbGwgaW50by5cIik7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHN0YXRlLmdvbGQgLT0gY29zdDtcblx0Y29uc3Qgb2xkSWQgPSBzdGF0ZS5xdWVzdHMuYWN0aXZlW2luZGV4XTtcblx0Y29uc3QgbmV3QmFzZWxpbmVzID0geyAuLi5zdGF0ZS5xdWVzdHMuYmFzZWxpbmVzIH07XG5cdGRlbGV0ZSBuZXdCYXNlbGluZXNbb2xkSWRdO1xuXHRuZXdCYXNlbGluZXNbbmV3UXVlc3QuaWRdID0gQkFTRUxJTkVfUVVFU1RfVFlQRVMuaGFzKG5ld1F1ZXN0LnR5cGUpID8gZ2V0UXVlc3RQcm9ncmVzcyhuZXdRdWVzdCkuY3VycmVudCA6IDA7XG5cdHN0YXRlLnF1ZXN0cy5hY3RpdmVbaW5kZXhdID0gbmV3UXVlc3QuaWQ7XG5cdHN0YXRlLnF1ZXN0cy5jb21wbGV0ZWRbaW5kZXhdID0gZmFsc2U7XG5cdHN0YXRlLnF1ZXN0cy5iYXNlbGluZXMgPSBuZXdCYXNlbGluZXM7XG5cdHN0YXRlLnF1ZXN0cy5yZXJvbGxzID0gKHN0YXRlLnF1ZXN0cy5yZXJvbGxzID8/IDApICsgMTtcblx0ZW1pdChcInF1ZXN0czppbnZhbGlkYXRlXCIpO1xuXHRyZXF1ZXN0UmVuZGVyKCk7XG5cdGFubm91bmNlKGBRdWVzdCByZXJvbGxlZCBmb3IgJHtjb3N0LnRvTG9jYWxlU3RyaW5nKCl9IGdvbGQuYCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBkcmF3UXVlc3RzKCk6IHZvaWQge1xuXHRmbHVzaFNhdGlzZmllZFF1ZXN0cygpO1xuXHRjb25zdCBjdXJyZW50QWN0aXZlID0gc3RhdGUucXVlc3RzLmFjdGl2ZSB8fCBbXTtcblx0Y29uc3QgY3VycmVudENvbXBsZXRlZCA9IHN0YXRlLnF1ZXN0cy5jb21wbGV0ZWQgfHwgW107XG5cdGNvbnN0IGN1cnJlbnRCYXNlbGluZXMgPSBzdGF0ZS5xdWVzdHMuYmFzZWxpbmVzIHx8IHt9O1xuXHRjb25zdCBuZXdBY3RpdmU6IHN0cmluZ1tdID0gW107XG5cdGNvbnN0IG5ld0NvbXBsZXRlZDogYm9vbGVhbltdID0gW107XG5cdGNvbnN0IG5ld0Jhc2VsaW5lczogUmVjb3JkPHN0cmluZywgbnVtYmVyPiA9IHt9O1xuXHRmb3IgKGxldCBpID0gMDsgaSA8IGN1cnJlbnRBY3RpdmUubGVuZ3RoOyBpKyspIHtcblx0XHRpZiAoIWN1cnJlbnRDb21wbGV0ZWRbaV0pIHtcblx0XHRcdGNvbnN0IGlkID0gY3VycmVudEFjdGl2ZVtpXTtcblx0XHRcdG5ld0FjdGl2ZS5wdXNoKGlkKTtcblx0XHRcdG5ld0NvbXBsZXRlZC5wdXNoKGZhbHNlKTtcblx0XHRcdGlmIChjdXJyZW50QmFzZWxpbmVzW2lkXSAhPT0gdW5kZWZpbmVkKSBuZXdCYXNlbGluZXNbaWRdID0gY3VycmVudEJhc2VsaW5lc1tpZF07XG5cdFx0fVxuXHR9XG5cdGNvbnN0IHBvb2wgPSBlbGlnaWJsZVF1ZXN0UG9vbCgpO1xuXHRjb25zdCBleGlzdGluZ0lkcyA9IG5ldyBTZXQobmV3QWN0aXZlKTtcblx0Y29uc3QgYXZhaWxhYmxlID0gcG9vbC5maWx0ZXIoKHEpID0+ICFleGlzdGluZ0lkcy5oYXMocS5pZCkpLnNvcnQoc2h1ZmZsZSk7XG5cdHdoaWxlIChuZXdBY3RpdmUubGVuZ3RoIDwgUVVFU1RfU0xPVFMgJiYgYXZhaWxhYmxlLmxlbmd0aCA+IDApIHtcblx0XHRjb25zdCBxID0gYXZhaWxhYmxlLnNoaWZ0KCkhO1xuXHRcdG5ld0FjdGl2ZS5wdXNoKHEuaWQpO1xuXHRcdG5ld0NvbXBsZXRlZC5wdXNoKGZhbHNlKTtcblx0XHRuZXdCYXNlbGluZXNbcS5pZF0gPSBCQVNFTElORV9RVUVTVF9UWVBFUy5oYXMocS50eXBlKSA/IGdldFF1ZXN0UHJvZ3Jlc3MocSkuY3VycmVudCA6IDA7XG5cdH1cblx0c3RhdGUucXVlc3RzLmFjdGl2ZSA9IG5ld0FjdGl2ZTtcblx0c3RhdGUucXVlc3RzLmNvbXBsZXRlZCA9IG5ld0NvbXBsZXRlZDtcblx0c3RhdGUucXVlc3RzLmJhc2VsaW5lcyA9IG5ld0Jhc2VsaW5lcztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNoZWNrUXVlc3RDb21wbGV0aW9uKCk6IHZvaWQge1xuXHRpZiAoIXN0YXRlLnF1ZXN0cy5hY3RpdmUubGVuZ3RoKSByZXR1cm47XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdGUucXVlc3RzLmFjdGl2ZS5sZW5ndGg7IGkrKykge1xuXHRcdGlmIChzdGF0ZS5xdWVzdHMuY29tcGxldGVkW2ldKSBjb250aW51ZTtcblx0XHRjb25zdCBpZCA9IHN0YXRlLnF1ZXN0cy5hY3RpdmVbaV07XG5cdFx0Y29uc3QgZGVmID0gcXVlc3RCeUlkKGlkKTtcblx0XHRpZiAoIWRlZikgY29udGludWU7XG5cdFx0Y29uc3QgeyBjdXJyZW50LCB0YXJnZXQgfSA9IGdldFF1ZXN0UHJvZ3Jlc3MoZGVmLCBxdWVzdEJhc2VsaW5lKGlkLCBkZWYpKTtcblx0XHRpZiAoY3VycmVudCA+PSB0YXJnZXQpIHtcblx0XHRcdHN0YXRlLnF1ZXN0cy5jb21wbGV0ZWRbaV0gPSB0cnVlO1xuXHRcdFx0YW5ub3VuY2UoYFF1ZXN0IGNvbXBsZXRlOiAke2RlZi5sYWJlbH0hYCk7XG5cdFx0fVxuXHR9XG59XG4iLCAiaW1wb3J0IHsgbm93IH0gZnJvbSBcIi4vY2xvY2sudHNcIjtcbmltcG9ydCB7IGFkdmFuY2VUbyB9IGZyb20gXCIuL3NpbS50c1wiO1xuaW1wb3J0IHsgY2hlY2tRdWVzdENvbXBsZXRpb24gfSBmcm9tIFwiLi9xdWVzdHMudHNcIjtcbmltcG9ydCB7IGVtaXQgfSBmcm9tIFwiLi9ldmVudHMudHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHRpY2soKTogdm9pZCB7XG5cdHRyeSB7XG5cdFx0YWR2YW5jZVRvKG5vdygpKTtcblx0fSBjYXRjaCAoZSkge1xuXHRcdGNvbnNvbGUuZXJyb3IoXCJhZHZhbmNlVG86XCIsIGUpO1xuXHR9XG5cdGNoZWNrUXVlc3RDb21wbGV0aW9uKCk7XG5cdGVtaXQoXCJ0aWNrXCIpO1xufVxuIiwgImltcG9ydCB7IFJFU09VUkNFUyB9IGZyb20gXCIuLi9jb250ZW50L3Jlc291cmNlcy50c1wiO1xuaW1wb3J0IHsgQlVJTERJTkdTIH0gZnJvbSBcIi4uL2NvbnRlbnQvYnVpbGRpbmdzLnRzXCI7XG5pbXBvcnQgeyBzdGF0ZSB9IGZyb20gXCIuLi9jb3JlL3N0YXRlLnRzXCI7XG5pbXBvcnQgeyBjdXJyZW50UHJpY2UsIG5leHRTbG90Q29zdCwgbmV4dFN0b3JhZ2VNYXgsIHNsb3RSZWZ1bmQsIHN0b3JhZ2VNYXgsIHN0b3JhZ2VVcGdyYWRlQ29zdCwgdG90YWxJdGVtcywgdW5sb2NrQ29zdCB9IGZyb20gXCIuLi9jb3JlL2Vjb25vbXkudHNcIjtcbmltcG9ydCB7IGZvcm1hdElucHV0cywgZm9ybWF0UHJvZHVjdE91dHB1dCB9IGZyb20gXCIuLi9jb3JlL2Zvcm1hdC50c1wiO1xuaW1wb3J0IHsgZW50cmllcywgZ2V0T3JJbnNlcnQsIGtleXMgfSBmcm9tIFwiLi4vY29yZS91dGlsLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFJlc291cmNlS2V5IH0gZnJvbSBcIi4uL2NvcmUvdHlwZXMudHNcIjtcblxuZnVuY3Rpb24gc2V0RGF0YXNldE1hbnkoZWxzOiBJdGVyYWJsZTxIVE1MRWxlbWVudD4sIGtleTogc3RyaW5nLCB2YWx1ZTogc3RyaW5nKTogdm9pZCB7XG5cdGZvciAoY29uc3QgZWwgb2YgZWxzKSBlbC5kYXRhc2V0W2tleV0gPSB2YWx1ZTtcbn1cblxuLy8gTWlycm9ycyB0aGUgb3JpZ2luYWwgZ3VhcmQ6IGFuIGF0dHJpYnV0ZSBtYXkgYmUgc2V0IG9uY2UsIGFuZCBsYXRlciB3cml0ZXMgdGhhdFxuLy8gZGlzYWdyZWUgYXJlIHJldmVydGVkIHJhdGhlciB0aGFuIGFwcGxpZWQuXG5mdW5jdGlvbiBjbGFpbUF0dHJpYnV0ZShjdXJyZW50OiBzdHJpbmcgfCBudWxsLCBuZXh0OiBzdHJpbmcgfCBudWxsKTogXCJhZG9wdFwiIHwgXCJyZXZlcnRcIiB8IFwiaWdub3JlXCIge1xuXHRpZiAoY3VycmVudCA9PT0gbnVsbCkgcmV0dXJuIFwiYWRvcHRcIjtcblx0aWYgKGN1cnJlbnQgIT09IG5leHQpIHJldHVybiBcInJldmVydFwiO1xuXHRyZXR1cm4gXCJpZ25vcmVcIjtcbn1cblxuZXhwb3J0IGNsYXNzIEJ1aWxkaW5nUHJvZHVjdENhcmQgZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cdCNibGQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXHQjcHJvZHVjdDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cdCNsYWJlbCE6IEhUTUxIZWFkaW5nRWxlbWVudDtcblx0I3N0YXR1cyE6IEhUTUxTcGFuRWxlbWVudDtcblx0I2lucHV0RGVzYyE6IEhUTUxQYXJhZ3JhcGhFbGVtZW50O1xuXHQjaW5wdXRzITogVGV4dDtcblx0I3Npbmd1bGFyITogVGV4dDtcblx0I3RvZ2dsZVByb2R1Y3Rpb24hOiBIVE1MQnV0dG9uRWxlbWVudDtcblx0I3N1bW1hcnkhOiBIVE1MUGFyYWdyYXBoRWxlbWVudDtcblx0I3Nsb3RDb3N0ITogVGV4dDtcblx0I2FkZFNsb3QhOiBIVE1MQnV0dG9uRWxlbWVudDtcblx0I3NhbGVBbXQhOiBUZXh0O1xuXHQjc2VsbFNsb3QhOiBIVE1MQnV0dG9uRWxlbWVudDtcblx0I3dhbnRzQmxkQW5kUHJvZHVjdCA9IG5ldyBTZXQ8SFRNTEVsZW1lbnQ+KCk7XG5cdCN3YW50c0N5Y2xlRm10ID0gbmV3IFNldDxUZXh0PigpO1xuXHQjcGF1c2VkOiBib29sZWFuIHwgdW5kZWZpbmVkO1xuXG5cdGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xuXHRcdHRoaXMuY2xhc3NOYW1lID0gXCJwcm9kdWN0LXNlY3Rpb25cIjtcblx0XHRjb25zdCBoZWFkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGhlYWRlci5jbGFzc05hbWUgPSBcInByb2R1Y3QtaGVhZGVyXCI7XG5cdFx0Y29uc3QgdGl0bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDRcIik7XG5cdFx0dGhpcy4jbGFiZWwgPSB0aXRsZTtcblx0XHR0aXRsZS5jbGFzc05hbWUgPSBcInByb2R1Y3QtdGl0bGVcIjtcblx0XHRjb25zdCBzdGF0dXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTtcblx0XHR0aGlzLiNzdGF0dXMgPSBzdGF0dXM7XG5cdFx0c3RhdHVzLnN0eWxlLmZvbnRTaXplID0gXCJ2YXIoLS1mb250LXNtKVwiO1xuXHRcdGhlYWRlci5hcHBlbmQodGl0bGUsIHN0YXR1cyk7XG5cdFx0Y29uc3QgaW5wdXREZXNjID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG5cdFx0dGhpcy4jaW5wdXREZXNjID0gaW5wdXREZXNjO1xuXHRcdGlucHV0RGVzYy5jbGFzc05hbWUgPSBcInByb2R1Y3QtaW5wdXRzXCI7XG5cdFx0Y29uc3QgaW5wdXRzID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG5cdFx0dGhpcy4jaW5wdXRzID0gaW5wdXRzO1xuXHRcdGlucHV0RGVzYy5hcHBlbmQoXCJSZXF1aXJlcyBcIiwgaW5wdXRzLCBcIiBwZXIgY3ljbGVcIik7XG5cdFx0Y29uc3QgbWFudWFsUHJvZHVjZVJvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0bWFudWFsUHJvZHVjZVJvdy5jbGFzc05hbWUgPSBcIm1hbnVhbC1wcm9kdWNlLXJvd1wiO1xuXHRcdGNvbnN0IG1hbnVhbFByb2R1Y2UgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHRcdHRoaXMuI3dhbnRzQmxkQW5kUHJvZHVjdC5hZGQobWFudWFsUHJvZHVjZSk7XG5cdFx0bWFudWFsUHJvZHVjZS5jbGFzc05hbWUgPSBcIm1hbnVhbC1wcm9kdWNlLWJ0blwiO1xuXHRcdG1hbnVhbFByb2R1Y2UuZGF0YXNldC5hY3Rpb24gPSBcIm1hbnVhbC1wcm9kdWNlXCI7XG5cdFx0Y29uc3Qgc2luZ3VsYXIgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcblx0XHR0aGlzLiNzaW5ndWxhciA9IHNpbmd1bGFyO1xuXHRcdG1hbnVhbFByb2R1Y2UuYXBwZW5kKFwiUHJvZHVjZSBcIiwgc2luZ3VsYXIpO1xuXHRcdGNvbnN0IHRvZ2dsZVByb2R1Y3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHRcdHRoaXMuI3dhbnRzQmxkQW5kUHJvZHVjdC5hZGQodG9nZ2xlUHJvZHVjdGlvbik7XG5cdFx0dGhpcy4jdG9nZ2xlUHJvZHVjdGlvbiA9IHRvZ2dsZVByb2R1Y3Rpb247XG5cdFx0dG9nZ2xlUHJvZHVjdGlvbi5jbGFzc05hbWUgPSBcInRvZ2dsZS1wcm9kdWN0LWJ0blwiO1xuXHRcdHRvZ2dsZVByb2R1Y3Rpb24uZGF0YXNldC5hY3Rpb24gPSBcInRvZ2dsZS1wcm9kdWN0XCI7XG5cdFx0bWFudWFsUHJvZHVjZVJvdy5hcHBlbmQobWFudWFsUHJvZHVjZSwgdG9nZ2xlUHJvZHVjdGlvbik7XG5cdFx0Y29uc3Qgc3VtbWFyeSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuXHRcdHRoaXMuI3N1bW1hcnkgPSBzdW1tYXJ5O1xuXHRcdHN1bW1hcnkuY2xhc3NOYW1lID0gXCJzbG90LXN1bW1hcnlcIjtcblx0XHRjb25zdCBhZGRTbG90ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImJ1dHRvblwiKTtcblx0XHR0aGlzLiNhZGRTbG90ID0gYWRkU2xvdDtcblx0XHR0aGlzLiN3YW50c0JsZEFuZFByb2R1Y3QuYWRkKGFkZFNsb3QpO1xuXHRcdGFkZFNsb3QuY2xhc3NOYW1lID0gXCJhZGQtc2xvdC1idG5cIjtcblx0XHRhZGRTbG90LmRhdGFzZXQuYWN0aW9uID0gXCJhZGQtc2xvdFwiO1xuXHRcdGNvbnN0IHNsb3RDb3N0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG5cdFx0dGhpcy4jc2xvdENvc3QgPSBzbG90Q29zdDtcblx0XHRsZXQgY3ljbGVGbXQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcblx0XHR0aGlzLiN3YW50c0N5Y2xlRm10LmFkZChjeWNsZUZtdCk7XG5cdFx0YWRkU2xvdC5hcHBlbmQoXCJBZGQgU2xvdCBmb3IgXCIsIHNsb3RDb3N0LCBcIiBnb2xkICgrXCIsIGN5Y2xlRm10LCBcIilcIik7XG5cdFx0Y29uc3Qgc2VsbFNsb3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHRcdHRoaXMuI3NlbGxTbG90ID0gc2VsbFNsb3Q7XG5cdFx0dGhpcy4jd2FudHNCbGRBbmRQcm9kdWN0LmFkZChzZWxsU2xvdCk7XG5cdFx0c2VsbFNsb3QuY2xhc3NOYW1lID0gXCJzZWxsLXNsb3QtYnRuXCI7XG5cdFx0c2VsbFNsb3QuZGF0YXNldC5hY3Rpb24gPSBcInNlbGwtc2xvdFwiO1xuXHRcdGNvbnN0IHNhbGVBbXQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcblx0XHR0aGlzLiNzYWxlQW10ID0gc2FsZUFtdDtcblx0XHRjeWNsZUZtdCA9IGN5Y2xlRm10LmNsb25lTm9kZSgpIGFzIFRleHQ7XG5cdFx0dGhpcy4jd2FudHNDeWNsZUZtdC5hZGQoY3ljbGVGbXQpO1xuXHRcdHNlbGxTbG90LmFwcGVuZChcIlNlbGwgU2xvdCBmb3IgXCIsIHNhbGVBbXQsIFwiIGdvbGQgKC1cIiwgY3ljbGVGbXQsIFwiKVwiKTtcblx0XHRpZiAodGhpcy4jYmxkICE9PSBudWxsKSBzZXREYXRhc2V0TWFueSh0aGlzLiN3YW50c0JsZEFuZFByb2R1Y3QsIFwiYmxkXCIsIHRoaXMuI2JsZCk7XG5cdFx0aWYgKHRoaXMuI3Byb2R1Y3QgIT09IG51bGwpIHNldERhdGFzZXRNYW55KHRoaXMuI3dhbnRzQmxkQW5kUHJvZHVjdCwgXCJwcm9kdWN0XCIsIHRoaXMuI3Byb2R1Y3QpO1xuXHRcdHRoaXMuI2luaXQoKTtcblx0XHR0aGlzLnJlcGxhY2VDaGlsZHJlbihoZWFkZXIsIGlucHV0RGVzYywgbWFudWFsUHJvZHVjZVJvdywgc3VtbWFyeSwgYWRkU2xvdCwgc2VsbFNsb3QpO1xuXHR9XG5cblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKTogc3RyaW5nW10ge1xuXHRcdHJldHVybiBbXCJibGRcIiwgXCJwcm9kdWN0XCJdO1xuXHR9XG5cblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZyB8IG51bGwsIG5ld1ZhbHVlOiBzdHJpbmcgfCBudWxsKTogdm9pZCB7XG5cdFx0aWYgKG9sZFZhbHVlID09PSBuZXdWYWx1ZSkgcmV0dXJuO1xuXHRcdGlmIChuYW1lID09PSBcImJsZFwiKSB7XG5cdFx0XHRjb25zdCB2ZXJkaWN0ID0gY2xhaW1BdHRyaWJ1dGUodGhpcy4jYmxkLCBuZXdWYWx1ZSk7XG5cdFx0XHRpZiAodmVyZGljdCA9PT0gXCJyZXZlcnRcIikgcmV0dXJuIHRoaXMuc2V0QXR0cmlidXRlKFwiYmxkXCIsIHRoaXMuI2JsZCEpO1xuXHRcdFx0aWYgKHZlcmRpY3QgPT09IFwiaWdub3JlXCIpIHJldHVybjtcblx0XHRcdHRoaXMuI2JsZCA9IG5ld1ZhbHVlO1xuXHRcdH0gZWxzZSBpZiAobmFtZSA9PT0gXCJwcm9kdWN0XCIpIHtcblx0XHRcdGNvbnN0IHZlcmRpY3QgPSBjbGFpbUF0dHJpYnV0ZSh0aGlzLiNwcm9kdWN0LCBuZXdWYWx1ZSk7XG5cdFx0XHRpZiAodmVyZGljdCA9PT0gXCJyZXZlcnRcIikgcmV0dXJuIHRoaXMuc2V0QXR0cmlidXRlKFwicHJvZHVjdFwiLCB0aGlzLiNwcm9kdWN0ISk7XG5cdFx0XHRpZiAodmVyZGljdCA9PT0gXCJpZ25vcmVcIikgcmV0dXJuO1xuXHRcdFx0dGhpcy4jcHJvZHVjdCA9IG5ld1ZhbHVlO1xuXHRcdH0gZWxzZSByZXR1cm47XG5cdFx0aWYgKG5ld1ZhbHVlICE9PSBudWxsKSBzZXREYXRhc2V0TWFueSh0aGlzLiN3YW50c0JsZEFuZFByb2R1Y3QsIG5hbWUsIG5ld1ZhbHVlKTtcblx0XHR0aGlzLiNpbml0KCk7XG5cdH1cblxuXHRzZXQgYmxkKHZhbHVlOiBzdHJpbmcpIHtcblx0XHR0aGlzLnNldEF0dHJpYnV0ZShcImJsZFwiLCB2YWx1ZSk7XG5cdH1cblx0c2V0IHByb2R1Y3QodmFsdWU6IHN0cmluZykge1xuXHRcdHRoaXMuc2V0QXR0cmlidXRlKFwicHJvZHVjdFwiLCB2YWx1ZSk7XG5cdH1cblxuXHQjaW5pdCgpOiB2b2lkIHtcblx0XHRpZiAodGhpcy4jYmxkID09PSBudWxsIHx8IHRoaXMuI3Byb2R1Y3QgPT09IG51bGwgfHwgIXRoaXMuI2xhYmVsIHx8ICF0aGlzLiNzaW5ndWxhcikgcmV0dXJuO1xuXHRcdGNvbnN0IHJlcyA9IFJFU09VUkNFU1tCVUlMRElOR1NbdGhpcy4jYmxkXT8ucHJvZHVjdHNbdGhpcy4jcHJvZHVjdF0/Lm91dHB1dEtleV07XG5cdFx0aWYgKHJlcyA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cdFx0dGhpcy4jbGFiZWwudGV4dENvbnRlbnQgPSByZXMubGFiZWw7XG5cdFx0dGhpcy4jc2luZ3VsYXIudGV4dENvbnRlbnQgPSByZXMuc2luZ3VsYXI7XG5cdH1cblxuXHRyZWZyZXNoKCk6IHZvaWQge1xuXHRcdGNvbnN0IGJsZCA9IHRoaXMuI2JsZDtcblx0XHRjb25zdCBwcm9kdWN0ID0gdGhpcy4jcHJvZHVjdDtcblx0XHRpZiAoYmxkID09PSBudWxsIHx8IHByb2R1Y3QgPT09IG51bGwgfHwgIXRoaXMuI3N0YXR1cyB8fCAhdGhpcy4jYWRkU2xvdCkgcmV0dXJuO1xuXHRcdGNvbnN0IHBzdCA9IHN0YXRlLmJ1aWxkaW5nc1tibGRdPy5wcm9kdWN0c1twcm9kdWN0XTtcblx0XHRjb25zdCBwY2ZnID0gQlVJTERJTkdTW2JsZF0/LnByb2R1Y3RzW3Byb2R1Y3RdO1xuXHRcdGlmIChwY2ZnID09PSB1bmRlZmluZWQgfHwgcHN0ID09PSB1bmRlZmluZWQpIHJldHVybjtcblx0XHRjb25zdCBwYXVzZWQgPSAhcHN0LmVuYWJsZWQ7XG5cdFx0aWYgKHRoaXMuI3BhdXNlZCAhPT0gcGF1c2VkKSB7XG5cdFx0XHR0aGlzLiNwYXVzZWQgPSBwYXVzZWQ7XG5cdFx0XHR0aGlzLiNzdGF0dXMudGV4dENvbnRlbnQgPSBwYXVzZWQgPyBcIlBhdXNlZFwiIDogXCJBY3RpdmVcIjtcblx0XHRcdHRoaXMuI3N0YXR1cy5jbGFzc05hbWUgPSBwYXVzZWQgPyBcImhlYWx0aC13YXJuXCIgOiBcImhlYWx0aC1va1wiO1xuXHRcdFx0dGhpcy4jdG9nZ2xlUHJvZHVjdGlvbi50ZXh0Q29udGVudCA9IHBhdXNlZCA/IFwiUmVzdW1lXCIgOiBcIlBhdXNlXCI7XG5cdFx0XHR0aGlzLiN0b2dnbGVQcm9kdWN0aW9uLmNsYXNzTGlzdC50b2dnbGUoXCJwYXVzZWRcIiwgcGF1c2VkKTtcblx0XHR9XG5cdFx0Y29uc3Qgc2xvdENvc3QgPSBuZXh0U2xvdENvc3QoYmxkLCBwcm9kdWN0KTtcblx0XHR0aGlzLiNzbG90Q29zdC50ZXh0Q29udGVudCA9IFN0cmluZyhzbG90Q29zdCk7XG5cdFx0dGhpcy4jYWRkU2xvdC5kaXNhYmxlZCA9IHN0YXRlLmdvbGQgPCBzbG90Q29zdDtcblx0XHRjb25zdCBuID0gcHN0LnNsb3RzLmxlbmd0aDtcblx0XHR0aGlzLiN0b2dnbGVQcm9kdWN0aW9uLmhpZGRlbiA9IG4gPT09IDA7XG5cdFx0dGhpcy4jc2VsbFNsb3QuZGlzYWJsZWQgPSBuID09PSAwO1xuXHRcdGNvbnN0IHNjYWxlZCA9IE9iamVjdC5mcm9tRW50cmllcyhcblx0XHRcdGVudHJpZXMocGNmZy5pbnB1dHMgYXMgUmVjb3JkPFJlc291cmNlS2V5LCBudW1iZXI+KS5tYXAoKFtrLCB2XSkgPT4gW2ssIHYgKiBNYXRoLm1heCgxLCBuKV0pLFxuXHRcdCkgYXMgUmVjb3JkPFJlc291cmNlS2V5LCBudW1iZXI+O1xuXHRcdGNvbnN0IGlucHV0cyA9IGZvcm1hdElucHV0cyhzY2FsZWQpO1xuXHRcdGlmIChpbnB1dHMgPT09IFwiXCIpIHtcblx0XHRcdHRoaXMuI2lucHV0RGVzYy5oaWRkZW4gPSB0cnVlO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHR0aGlzLiNpbnB1dHMudGV4dENvbnRlbnQgPSBpbnB1dHM7XG5cdFx0XHR0aGlzLiNpbnB1dERlc2MuaGlkZGVuID0gZmFsc2U7XG5cdFx0fVxuXHRcdGNvbnN0IGN5Y2xlRm10ID0gZm9ybWF0UHJvZHVjdE91dHB1dCgxLCBwY2ZnLm91dHB1dEFtdCwgcGNmZy5iYXNlQ3ljbGVNcywgcGNmZy5vdXRwdXRLZXksIHRydWUpO1xuXHRcdGZvciAoY29uc3QgZWwgb2YgdGhpcy4jd2FudHNDeWNsZUZtdCkgZWwudGV4dENvbnRlbnQgPSBjeWNsZUZtdDtcblx0XHR0aGlzLiNzdW1tYXJ5LnRleHRDb250ZW50ID0gbiA9PT0gMFxuXHRcdFx0PyBcIk5vIHNsb3RzIHlldC5cIlxuXHRcdFx0OiBgJHtuLnRvTG9jYWxlU3RyaW5nKCl9ICR7biA9PT0gMSA/IFwic2xvdFwiIDogXCJzbG90c1wifSwgJHtmb3JtYXRQcm9kdWN0T3V0cHV0KG4sIHBjZmcub3V0cHV0QW10LCBwY2ZnLmJhc2VDeWNsZU1zLCBwY2ZnLm91dHB1dEtleSl9YDtcblx0XHR0aGlzLiNzYWxlQW10LnRleHRDb250ZW50ID0gU3RyaW5nKHNsb3RSZWZ1bmQoYmxkLCBwcm9kdWN0KSk7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIFVubG9ja1Byb2R1Y3RCdXR0b24gZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cdCNibGQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXHQjcHJvZHVjdDogc3RyaW5nIHwgbnVsbCA9IG51bGw7XG5cdCNidXR0b24hOiBIVE1MQnV0dG9uRWxlbWVudDtcblx0I2xhYmVsITogVGV4dDtcblx0I2Nvc3QhOiBUZXh0O1xuXG5cdGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xuXHRcdGNvbnN0IGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJidXR0b25cIik7XG5cdFx0dGhpcy4jYnV0dG9uID0gYnV0dG9uO1xuXHRcdGJ1dHRvbi5jbGFzc05hbWUgPSBcInVubG9jay1wcm9kdWN0LWJ0blwiO1xuXHRcdGJ1dHRvbi5kYXRhc2V0LmFjdGlvbiA9IFwidW5sb2NrLXByb2R1Y3RcIjtcblx0XHRpZiAodGhpcy4jYmxkICE9PSBudWxsKSBidXR0b24uZGF0YXNldC5ibGQgPSB0aGlzLiNibGQ7XG5cdFx0aWYgKHRoaXMuI3Byb2R1Y3QgIT09IG51bGwpIGJ1dHRvbi5kYXRhc2V0LnByb2R1Y3QgPSB0aGlzLiNwcm9kdWN0O1xuXHRcdGNvbnN0IG5hbWUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZSh0aGlzLiNnZXRMYWJlbFRleHQoKSk7XG5cdFx0dGhpcy4jbGFiZWwgPSBuYW1lO1xuXHRcdGNvbnN0IGNvc3QgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcblx0XHR0aGlzLiNjb3N0ID0gY29zdDtcblx0XHRidXR0b24uYXBwZW5kKFwiVW5sb2NrIFwiLCBuYW1lLCBcIiBmb3IgXCIsIGNvc3QsIFwiIGdvbGRcIik7XG5cdFx0dGhpcy5yZXBsYWNlQ2hpbGRyZW4oYnV0dG9uKTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCk6IHN0cmluZ1tdIHtcblx0XHRyZXR1cm4gW1wiYmxkXCIsIFwicHJvZHVjdFwiXTtcblx0fVxuXG5cdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmcgfCBudWxsLCBuZXdWYWx1ZTogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuXHRcdGlmIChuZXdWYWx1ZSA9PT0gb2xkVmFsdWUpIHJldHVybjtcblx0XHRpZiAobmFtZSA9PT0gXCJibGRcIikge1xuXHRcdFx0Y29uc3QgdmVyZGljdCA9IGNsYWltQXR0cmlidXRlKHRoaXMuI2JsZCwgbmV3VmFsdWUpO1xuXHRcdFx0aWYgKHZlcmRpY3QgPT09IFwicmV2ZXJ0XCIpIHJldHVybiB0aGlzLnNldEF0dHJpYnV0ZShcImJsZFwiLCB0aGlzLiNibGQhKTtcblx0XHRcdGlmICh2ZXJkaWN0ID09PSBcImlnbm9yZVwiKSByZXR1cm47XG5cdFx0XHR0aGlzLiNibGQgPSBuZXdWYWx1ZTtcblx0XHR9IGVsc2UgaWYgKG5hbWUgPT09IFwicHJvZHVjdFwiKSB7XG5cdFx0XHRjb25zdCB2ZXJkaWN0ID0gY2xhaW1BdHRyaWJ1dGUodGhpcy4jcHJvZHVjdCwgbmV3VmFsdWUpO1xuXHRcdFx0aWYgKHZlcmRpY3QgPT09IFwicmV2ZXJ0XCIpIHJldHVybiB0aGlzLnNldEF0dHJpYnV0ZShcInByb2R1Y3RcIiwgdGhpcy4jcHJvZHVjdCEpO1xuXHRcdFx0aWYgKHZlcmRpY3QgPT09IFwiaWdub3JlXCIpIHJldHVybjtcblx0XHRcdHRoaXMuI3Byb2R1Y3QgPSBuZXdWYWx1ZTtcblx0XHR9IGVsc2UgcmV0dXJuO1xuXHRcdGlmICh0aGlzLiNidXR0b24gIT09IHVuZGVmaW5lZCAmJiBuZXdWYWx1ZSAhPT0gbnVsbCkgdGhpcy4jYnV0dG9uLmRhdGFzZXRbbmFtZV0gPSBuZXdWYWx1ZTtcblx0XHRpZiAodGhpcy4jYmxkICE9PSBudWxsICYmIHRoaXMuI3Byb2R1Y3QgIT09IG51bGwgJiYgdGhpcy4jbGFiZWwgIT09IHVuZGVmaW5lZCkgdGhpcy4jbGFiZWwudGV4dENvbnRlbnQgPSB0aGlzLiNnZXRMYWJlbFRleHQoKTtcblx0XHR0aGlzLnJlZnJlc2goKTtcblx0fVxuXG5cdHNldCBibGQodmFsdWU6IHN0cmluZykge1xuXHRcdHRoaXMuc2V0QXR0cmlidXRlKFwiYmxkXCIsIHZhbHVlKTtcblx0fVxuXHRzZXQgcHJvZHVjdCh2YWx1ZTogc3RyaW5nKSB7XG5cdFx0dGhpcy5zZXRBdHRyaWJ1dGUoXCJwcm9kdWN0XCIsIHZhbHVlKTtcblx0fVxuXG5cdCNnZXRMYWJlbFRleHQoKTogc3RyaW5nIHtcblx0XHRpZiAodGhpcy4jYmxkID09PSBudWxsIHx8IHRoaXMuI3Byb2R1Y3QgPT09IG51bGwpIHJldHVybiBcIltwcm9kdWN0XVwiO1xuXHRcdHJldHVybiBSRVNPVVJDRVNbQlVJTERJTkdTW3RoaXMuI2JsZF0/LnByb2R1Y3RzW3RoaXMuI3Byb2R1Y3RdPy5vdXRwdXRLZXldPy5sYWJlbCA/PyBcIltwcm9kdWN0XVwiO1xuXHR9XG5cblx0cmVmcmVzaCgpOiB2b2lkIHtcblx0XHRjb25zdCBibGQgPSB0aGlzLiNibGQ7XG5cdFx0Y29uc3QgcHJvZHVjdCA9IHRoaXMuI3Byb2R1Y3Q7XG5cdFx0aWYgKGJsZCA9PT0gbnVsbCB8fCBwcm9kdWN0ID09PSBudWxsIHx8ICF0aGlzLiNidXR0b24gfHwgIXRoaXMuI2Nvc3QpIHJldHVybjtcblx0XHRjb25zdCBjb3N0ID0gdW5sb2NrQ29zdChibGQsIHByb2R1Y3QpO1xuXHRcdHRoaXMuI2J1dHRvbi5kaXNhYmxlZCA9IHN0YXRlLmdvbGQgPCBjb3N0O1xuXHRcdGNvbnN0IGNvc3RUZXh0ID0gY29zdC50b0xvY2FsZVN0cmluZygpO1xuXHRcdGlmICh0aGlzLiNjb3N0LnRleHRDb250ZW50ICE9PSBjb3N0VGV4dCkgdGhpcy4jY29zdC50ZXh0Q29udGVudCA9IGNvc3RUZXh0O1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBCdWlsZGluZ1NlY3Rpb24gZXh0ZW5kcyBIVE1MRWxlbWVudCB7XG5cdCNwcm9kdWN0Q2FyZHMgPSBuZXcgTWFwPHN0cmluZywgQnVpbGRpbmdQcm9kdWN0Q2FyZD4oKTtcblx0I3VubG9ja0J1dHRvbnMgPSBuZXcgTWFwPHN0cmluZywgVW5sb2NrUHJvZHVjdEJ1dHRvbj4oKTtcblx0I3Byb2R1Y3RTZWN0aW9uOiBIVE1MRGl2RWxlbWVudCB8IHVuZGVmaW5lZDtcblx0I3VubG9ja0dyb3VwOiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcblx0I3VubG9ja1NlY3Rpb246IEhUTUxEaXZFbGVtZW50IHwgdW5kZWZpbmVkO1xuXG5cdGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xuXHRcdGNvbnN0IHByb2R1Y3RHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWN0aW9uXCIpO1xuXHRcdHByb2R1Y3RHcm91cC5jbGFzc05hbWUgPSBcInByb2R1Y3QtZ3JvdXBcIjtcblx0XHRjb25zdCBwcm9kdWN0c0gzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgzXCIpO1xuXHRcdHByb2R1Y3RzSDMudGV4dENvbnRlbnQgPSBcIlByb2R1Y3RzXCI7XG5cdFx0Y29uc3QgcHJvZHVjdFNlY3Rpb24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdHRoaXMuI3Byb2R1Y3RTZWN0aW9uID0gcHJvZHVjdFNlY3Rpb247XG5cdFx0cHJvZHVjdFNlY3Rpb24uY2xhc3NOYW1lID0gXCJwcm9kdWN0LXNlY3Rpb25cIjtcblx0XHRwcm9kdWN0R3JvdXAuYXBwZW5kKHByb2R1Y3RzSDMsIHByb2R1Y3RTZWN0aW9uKTtcblx0XHRjb25zdCB1bmxvY2tHcm91cCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzZWN0aW9uXCIpO1xuXHRcdHRoaXMuI3VubG9ja0dyb3VwID0gdW5sb2NrR3JvdXA7XG5cdFx0dW5sb2NrR3JvdXAuY2xhc3NOYW1lID0gXCJ1bmxvY2stZ3JvdXBcIjtcblx0XHR1bmxvY2tHcm91cC5oaWRkZW4gPSB0cnVlO1xuXHRcdGNvbnN0IHVubG9ja0gzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImgzXCIpO1xuXHRcdHVubG9ja0gzLnRleHRDb250ZW50ID0gXCJVbmxvY2thYmxlIFByb2R1Y3RzXCI7XG5cdFx0Y29uc3QgdW5sb2NrU2VjdGlvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0dGhpcy4jdW5sb2NrU2VjdGlvbiA9IHVubG9ja1NlY3Rpb247XG5cdFx0dW5sb2NrU2VjdGlvbi5jbGFzc05hbWUgPSBcInVubG9jay1zZWN0aW9uXCI7XG5cdFx0dW5sb2NrR3JvdXAuYXBwZW5kKHVubG9ja0gzLCB1bmxvY2tTZWN0aW9uKTtcblx0XHR0aGlzLnJlcGxhY2VDaGlsZHJlbihwcm9kdWN0R3JvdXAsIHVubG9ja0dyb3VwKTtcblx0fVxuXG5cdHN0YXRpYyBnZXQgb2JzZXJ2ZWRBdHRyaWJ1dGVzKCk6IHN0cmluZ1tdIHtcblx0XHRyZXR1cm4gW1wiYmxkXCJdO1xuXHR9XG5cblx0YXR0cmlidXRlQ2hhbmdlZENhbGxiYWNrKG5hbWU6IHN0cmluZywgb2xkVmFsdWU6IHN0cmluZyB8IG51bGwsIG5ld1ZhbHVlOiBzdHJpbmcgfCBudWxsKTogdm9pZCB7XG5cdFx0aWYgKG5ld1ZhbHVlID09PSBvbGRWYWx1ZSkgcmV0dXJuO1xuXHRcdGlmIChuYW1lID09PSBcImJsZFwiKSB7XG5cdFx0XHR0aGlzLiNwcm9kdWN0Q2FyZHMuY2xlYXIoKTtcblx0XHRcdHRoaXMuI3VubG9ja0J1dHRvbnMuY2xlYXIoKTtcblx0XHRcdHRoaXMuI3Byb2R1Y3RTZWN0aW9uPy5yZXBsYWNlQ2hpbGRyZW4oKTtcblx0XHRcdHRoaXMuI3VubG9ja1NlY3Rpb24/LnJlcGxhY2VDaGlsZHJlbigpO1xuXHRcdH1cblx0fVxuXG5cdHNldCBibGQodmFsdWU6IHN0cmluZykge1xuXHRcdHRoaXMuc2V0QXR0cmlidXRlKFwiYmxkXCIsIHZhbHVlKTtcblx0fVxuXHRnZXQgYmxkKCk6IHN0cmluZyB8IG51bGwge1xuXHRcdHJldHVybiB0aGlzLmdldEF0dHJpYnV0ZShcImJsZFwiKTtcblx0fVxuXG5cdHJlZnJlc2goKTogdm9pZCB7XG5cdFx0Y29uc3QgYmxkS2V5ID0gdGhpcy5ibGQ7XG5cdFx0Y29uc3QgcHJvZHVjdFNlY3Rpb24gPSB0aGlzLiNwcm9kdWN0U2VjdGlvbjtcblx0XHRjb25zdCB1bmxvY2tTZWN0aW9uID0gdGhpcy4jdW5sb2NrU2VjdGlvbjtcblx0XHRjb25zdCB1bmxvY2tHcm91cCA9IHRoaXMuI3VubG9ja0dyb3VwO1xuXHRcdGlmICghYmxkS2V5IHx8ICFwcm9kdWN0U2VjdGlvbiB8fCAhdW5sb2NrU2VjdGlvbiB8fCAhdW5sb2NrR3JvdXApIHJldHVybjtcblx0XHRjb25zdCBjZmcgPSBCVUlMRElOR1NbYmxkS2V5XTtcblx0XHRjb25zdCBic3QgPSBzdGF0ZS5idWlsZGluZ3NbYmxkS2V5XTtcblx0XHRpZiAoIWNmZyB8fCAhYnN0KSByZXR1cm47XG5cdFx0Zm9yIChjb25zdCBbcGssIHBjZmddIG9mIGVudHJpZXMoY2ZnLnByb2R1Y3RzKSkge1xuXHRcdFx0bGV0IHVubG9ja2VkID0gZmFsc2U7XG5cdFx0XHRsZXQgdW5sb2NrYWJsZSA9IGZhbHNlO1xuXHRcdFx0aWYgKGJzdC5wcm9kdWN0c1twa10udW5sb2NrZWQpIHtcblx0XHRcdFx0dW5sb2NrZWQgPSB0cnVlO1xuXHRcdFx0XHRjb25zdCBjYXJkID0gZ2V0T3JJbnNlcnQodGhpcy4jcHJvZHVjdENhcmRzLCBwaywgKGtleSkgPT4ge1xuXHRcdFx0XHRcdGNvbnN0IGNhcmQgPSBuZXcgQnVpbGRpbmdQcm9kdWN0Q2FyZCgpO1xuXHRcdFx0XHRcdGNhcmQucHJvZHVjdCA9IGtleTtcblx0XHRcdFx0XHRjYXJkLmJsZCA9IGJsZEtleTtcblx0XHRcdFx0XHRyZXR1cm4gY2FyZDtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmICghcHJvZHVjdFNlY3Rpb24uY29udGFpbnMoY2FyZCkpIHByb2R1Y3RTZWN0aW9uLmFwcGVuZENoaWxkKGNhcmQpO1xuXHRcdFx0XHRjYXJkLnJlZnJlc2goKTtcblx0XHRcdH0gZWxzZSBpZiAoIXBjZmcucHJlcmVxUHJvZHVjdCB8fCBic3QucHJvZHVjdHNbcGNmZy5wcmVyZXFQcm9kdWN0XS51bmxvY2tlZCkge1xuXHRcdFx0XHR1bmxvY2thYmxlID0gdHJ1ZTtcblx0XHRcdFx0Y29uc3QgYnV0dG9uID0gZ2V0T3JJbnNlcnQodGhpcy4jdW5sb2NrQnV0dG9ucywgcGssIChrZXkpID0+IHtcblx0XHRcdFx0XHRjb25zdCBidXR0b24gPSBuZXcgVW5sb2NrUHJvZHVjdEJ1dHRvbigpO1xuXHRcdFx0XHRcdGJ1dHRvbi5wcm9kdWN0ID0ga2V5O1xuXHRcdFx0XHRcdGJ1dHRvbi5ibGQgPSBibGRLZXk7XG5cdFx0XHRcdFx0cmV0dXJuIGJ1dHRvbjtcblx0XHRcdFx0fSk7XG5cdFx0XHRcdGlmICghdW5sb2NrU2VjdGlvbi5jb250YWlucyhidXR0b24pKSB1bmxvY2tTZWN0aW9uLmFwcGVuZChidXR0b24pO1xuXHRcdFx0XHRidXR0b24ucmVmcmVzaCgpO1xuXHRcdFx0fVxuXHRcdFx0aWYgKCF1bmxvY2thYmxlICYmIHRoaXMuI3VubG9ja0J1dHRvbnMuaGFzKHBrKSkge1xuXHRcdFx0XHR1bmxvY2tTZWN0aW9uLnJlbW92ZUNoaWxkKHRoaXMuI3VubG9ja0J1dHRvbnMuZ2V0KHBrKSEpO1xuXHRcdFx0XHR0aGlzLiN1bmxvY2tCdXR0b25zLmRlbGV0ZShwayk7XG5cdFx0XHR9XG5cdFx0XHRpZiAoIXVubG9ja2VkICYmIHRoaXMuI3Byb2R1Y3RDYXJkcy5oYXMocGspKSB7XG5cdFx0XHRcdHByb2R1Y3RTZWN0aW9uLnJlbW92ZUNoaWxkKHRoaXMuI3Byb2R1Y3RDYXJkcy5nZXQocGspISk7XG5cdFx0XHRcdHRoaXMuI3Byb2R1Y3RDYXJkcy5kZWxldGUocGspO1xuXHRcdFx0fVxuXHRcdH1cblx0XHR1bmxvY2tHcm91cC5oaWRkZW4gPSB0aGlzLiN1bmxvY2tCdXR0b25zLnNpemUgPT09IDA7XG5cdH1cbn1cblxuZXhwb3J0IGNsYXNzIE1hcmtldFByb2R1Y3RDYXJkIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXHQjaW52Q291bnQhOiBUZXh0O1xuXHQjdW5pdFZhbHVlITogVGV4dDtcblx0I3RvdGFsVmFsdWUhOiBUZXh0O1xuXHQjc2VsbCE6IEhUTUxCdXR0b25FbGVtZW50O1xuXHQjd2FudHNMYWJlbCA9IG5ldyBTZXQ8Tm9kZT4oKTtcblx0I3Jlc291cmNlOiBSZXNvdXJjZUtleSB8IG51bGwgPSBudWxsO1xuXG5cdGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xuXHRcdHRoaXMuY2xhc3NOYW1lID0gXCJtYXJrZXQtcHJvZHVjdFwiO1xuXHRcdGNvbnN0IGhlYWRlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0aGVhZGVyLmNsYXNzTmFtZSA9IFwibWFya2V0LXByb2R1Y3QtaGVhZGVyXCI7XG5cdFx0Y29uc3QgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJoNFwiKTtcblx0XHR0aGlzLiN3YW50c0xhYmVsLmFkZChuYW1lKTtcblx0XHRuYW1lLmNsYXNzTmFtZSA9IFwibWFya2V0LXByb2R1Y3QtbmFtZVwiO1xuXHRcdGNvbnN0IHN0b2NrID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7XG5cdFx0c3RvY2suY2xhc3NOYW1lID0gXCJtYXJrZXQtcHJvZHVjdC1zdG9ja1wiO1xuXHRcdGNvbnN0IGludkNvdW50ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG5cdFx0dGhpcy4jaW52Q291bnQgPSBpbnZDb3VudDtcblx0XHRjb25zdCB1bml0VmFsdWUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcblx0XHR0aGlzLiN1bml0VmFsdWUgPSB1bml0VmFsdWU7XG5cdFx0c3RvY2suYXBwZW5kKGludkNvdW50LCBcIiBpbiBzdG9jaywgXCIsIHVuaXRWYWx1ZSwgXCIgZ29sZCBlYWNoXCIpO1xuXHRcdGhlYWRlci5hcHBlbmQobmFtZSwgc3RvY2spO1xuXHRcdGNvbnN0IHNlbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHRcdHRoaXMuI3NlbGwgPSBzZWxsO1xuXHRcdHNlbGwuY2xhc3NOYW1lID0gXCJzZWxsLWJ0blwiO1xuXHRcdHNlbGwuZGF0YXNldC5hY3Rpb24gPSBcInNlbGxcIjtcblx0XHRpZiAodGhpcy4jcmVzb3VyY2UgIT09IG51bGwpIHNlbGwuZGF0YXNldC5yZXNvdXJjZSA9IHRoaXMuI3Jlc291cmNlO1xuXHRcdGNvbnN0IGxhYmVsID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG5cdFx0dGhpcy4jd2FudHNMYWJlbC5hZGQobGFiZWwpO1xuXHRcdGNvbnN0IHRvdGFsVmFsdWUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcblx0XHR0aGlzLiN0b3RhbFZhbHVlID0gdG90YWxWYWx1ZTtcblx0XHRzZWxsLmFwcGVuZChcIlNlbGwgQWxsIFwiLCBsYWJlbCwgXCIgZm9yIFwiLCB0b3RhbFZhbHVlLCBcIiBnb2xkXCIpO1xuXHRcdHRoaXMucmVwbGFjZUNoaWxkcmVuKGhlYWRlciwgc2VsbCk7XG5cdFx0dGhpcy4jaW5pdCgpO1xuXHR9XG5cblx0c3RhdGljIGdldCBvYnNlcnZlZEF0dHJpYnV0ZXMoKTogc3RyaW5nW10ge1xuXHRcdHJldHVybiBbXCJyZXNvdXJjZVwiXTtcblx0fVxuXG5cdGF0dHJpYnV0ZUNoYW5nZWRDYWxsYmFjayhuYW1lOiBzdHJpbmcsIG9sZFZhbHVlOiBzdHJpbmcgfCBudWxsLCBuZXdWYWx1ZTogc3RyaW5nIHwgbnVsbCk6IHZvaWQge1xuXHRcdGlmIChvbGRWYWx1ZSA9PT0gbmV3VmFsdWUpIHJldHVybjtcblx0XHRpZiAobmFtZSAhPT0gXCJyZXNvdXJjZVwiKSByZXR1cm47XG5cdFx0aWYgKHRoaXMuI3Jlc291cmNlID09PSBudWxsKSB7XG5cdFx0XHR0aGlzLiNyZXNvdXJjZSA9IG5ld1ZhbHVlIGFzIFJlc291cmNlS2V5O1xuXHRcdFx0aWYgKHRoaXMuI3NlbGwgIT09IHVuZGVmaW5lZCAmJiBuZXdWYWx1ZSAhPT0gbnVsbCkgdGhpcy4jc2VsbC5kYXRhc2V0LnJlc291cmNlID0gbmV3VmFsdWU7XG5cdFx0XHR0aGlzLiNpbml0KCk7XG5cdFx0fSBlbHNlIGlmICh0aGlzLiNyZXNvdXJjZSAhPT0gbmV3VmFsdWUpIHJldHVybiB0aGlzLnNldEF0dHJpYnV0ZShcInJlc291cmNlXCIsIHRoaXMuI3Jlc291cmNlKTtcblx0fVxuXG5cdHNldCByZXNvdXJjZSh2YWx1ZTogUmVzb3VyY2VLZXkpIHtcblx0XHR0aGlzLnNldEF0dHJpYnV0ZShcInJlc291cmNlXCIsIHZhbHVlKTtcblx0fVxuXG5cdCNpbml0KCk6IHZvaWQge1xuXHRcdGlmICh0aGlzLiNyZXNvdXJjZSA9PT0gbnVsbCB8fCB0aGlzLiN3YW50c0xhYmVsLnNpemUgPT09IDApIHJldHVybjtcblx0XHRjb25zdCBsYWJlbCA9IFJFU09VUkNFU1t0aGlzLiNyZXNvdXJjZV0/LmxhYmVsO1xuXHRcdGlmIChsYWJlbCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cdFx0Zm9yIChjb25zdCBlbCBvZiB0aGlzLiN3YW50c0xhYmVsKSBlbC50ZXh0Q29udGVudCA9IGxhYmVsO1xuXHR9XG5cblx0cmVmcmVzaCgpOiB2b2lkIHtcblx0XHRjb25zdCByZXNvdXJjZSA9IHRoaXMuI3Jlc291cmNlO1xuXHRcdGlmIChyZXNvdXJjZSA9PT0gbnVsbCB8fCAhdGhpcy4jaW52Q291bnQgfHwgIXRoaXMuI3NlbGwpIHJldHVybjtcblx0XHRjb25zdCBpbnYgPSBzdGF0ZS5pbnZlbnRvcnlbcmVzb3VyY2VdIHx8IDA7XG5cdFx0Y29uc3QgaGFzU3RvY2sgPSBpbnYgPiAwO1xuXHRcdGNvbnN0IHByaWNlID0gY3VycmVudFByaWNlKHJlc291cmNlKTtcblx0XHR0aGlzLiNpbnZDb3VudC50ZXh0Q29udGVudCA9IGludi50b0xvY2FsZVN0cmluZygpO1xuXHRcdHRoaXMuaGlkZGVuID0gIWhhc1N0b2NrO1xuXHRcdHRoaXMuI3NlbGwuZGlzYWJsZWQgPSAhaGFzU3RvY2s7XG5cdFx0dGhpcy4jdW5pdFZhbHVlLnRleHRDb250ZW50ID0gcHJpY2UudG9Mb2NhbGVTdHJpbmcoKTtcblx0XHR0aGlzLiN0b3RhbFZhbHVlLnRleHRDb250ZW50ID0gKGludiAqIHByaWNlKS50b0xvY2FsZVN0cmluZygpO1xuXHR9XG59XG5cbmV4cG9ydCBjbGFzcyBNYXJrZXRTZWN0aW9uIGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuXHQjcHJvZ3Jlc3NCYXIhOiBIVE1MRGl2RWxlbWVudDtcblx0I3Byb2dyZXNzRmlsbCE6IEhUTUxEaXZFbGVtZW50O1xuXHQjdXNlZCE6IFRleHQ7XG5cdCNwY3QhOiBUZXh0O1xuXHQjdXBncmFkZSE6IEhUTUxCdXR0b25FbGVtZW50O1xuXHQjbmV4dCE6IFRleHQ7XG5cdCNjb3N0ITogVGV4dDtcblx0I3NlbGxBbGwhOiBIVE1MQnV0dG9uRWxlbWVudDtcblx0I3RvdGFsVmFsdWUhOiBUZXh0O1xuXHQjZW1wdHlUZXh0ITogSFRNTFBhcmFncmFwaEVsZW1lbnQ7XG5cdCNwcm9kdWN0R3JvdXAhOiBIVE1MRGl2RWxlbWVudDtcblx0I3Byb2R1Y3RDYXJkcyA9IG5ldyBNYXA8c3RyaW5nLCBNYXJrZXRQcm9kdWN0Q2FyZD4oKTtcblx0I3dhbnRzTWF4ID0gbmV3IFNldDxUZXh0PigpO1xuXG5cdGNvbm5lY3RlZENhbGxiYWNrKCk6IHZvaWQge1xuXHRcdGNvbnN0IGluZm8gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGluZm8uY2xhc3NOYW1lID0gXCJzdG9yYWdlLWluZm9cIjtcblx0XHRjb25zdCBwcm9ncmVzc0JhciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0dGhpcy4jcHJvZ3Jlc3NCYXIgPSBwcm9ncmVzc0Jhcjtcblx0XHRwcm9ncmVzc0Jhci5jbGFzc05hbWUgPSBcInN0b3JhZ2UtYmFyLXdyYXBcIjtcblx0XHRwcm9ncmVzc0Jhci5yb2xlID0gXCJwcm9ncmVzc2JhclwiO1xuXHRcdHByb2dyZXNzQmFyLmFyaWFMYWJlbCA9IFwiU3RvcmFnZSB1c2VkXCI7XG5cdFx0cHJvZ3Jlc3NCYXIuYXJpYVZhbHVlTWluID0gXCIwXCI7XG5cdFx0cHJvZ3Jlc3NCYXIuYXJpYVZhbHVlTWF4ID0gXCIxMDBcIjtcblx0XHRjb25zdCBwcm9ncmVzc0ZpbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdHRoaXMuI3Byb2dyZXNzRmlsbCA9IHByb2dyZXNzRmlsbDtcblx0XHRwcm9ncmVzc0ZpbGwuY2xhc3NOYW1lID0gXCJzdG9yYWdlLWJhci1maWxsXCI7XG5cdFx0cHJvZ3Jlc3NCYXIuYXBwZW5kQ2hpbGQocHJvZ3Jlc3NGaWxsKTtcblx0XHRjb25zdCBsYWJlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuXHRcdGxhYmVsLmNsYXNzTmFtZSA9IFwic3RvcmFnZS11c2VkLWxhYmVsXCI7XG5cdFx0dGhpcy4jdXNlZCA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO1xuXHRcdGxldCBtYXggPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcblx0XHR0aGlzLiN3YW50c01heC5hZGQobWF4KTtcblx0XHR0aGlzLiNwY3QgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcblx0XHRsYWJlbC5hcHBlbmQodGhpcy4jdXNlZCwgXCIgLyBcIiwgbWF4LCBcIiBpdGVtcyAoXCIsIHRoaXMuI3BjdCwgXCIlIGZ1bGwpXCIpO1xuXHRcdGNvbnN0IHVwZ3JhZGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHRcdHRoaXMuI3VwZ3JhZGUgPSB1cGdyYWRlO1xuXHRcdHVwZ3JhZGUuZGF0YXNldC5hY3Rpb24gPSBcInN0b3JhZ2UtdXBncmFkZVwiO1xuXHRcdG1heCA9IG1heC5jbG9uZU5vZGUoKSBhcyBUZXh0O1xuXHRcdHRoaXMuI3dhbnRzTWF4LmFkZChtYXgpO1xuXHRcdHRoaXMuI25leHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcblx0XHR0aGlzLiNjb3N0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJcIik7XG5cdFx0dXBncmFkZS5hcHBlbmQoXCJFeHBhbmQgU3RvcmFnZTogXCIsIG1heCwgXCIgdG8gXCIsIHRoaXMuI25leHQsIFwiIGl0ZW1zIGZvciBcIiwgdGhpcy4jY29zdCwgXCIgZ29sZFwiKTtcblx0XHRpbmZvLmFwcGVuZChwcm9ncmVzc0JhciwgbGFiZWwsIHVwZ3JhZGUpO1xuXHRcdGNvbnN0IGRpdmlkZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO1xuXHRcdGRpdmlkZXIuY2xhc3NOYW1lID0gXCJtYXJrZXQtZGl2aWRlclwiO1xuXHRcdGNvbnN0IHNlbGxBbGwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHRcdHRoaXMuI3NlbGxBbGwgPSBzZWxsQWxsO1xuXHRcdHNlbGxBbGwuY2xhc3NOYW1lID0gXCJzZWxsLWFsbC1idG5cIjtcblx0XHRzZWxsQWxsLmRhdGFzZXQuYWN0aW9uID0gXCJzZWxsLWFsbFwiO1xuXHRcdHRoaXMuI3RvdGFsVmFsdWUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtcblx0XHRzZWxsQWxsLmFwcGVuZChcIlNlbGwgRXZlcnl0aGluZyBmb3IgXCIsIHRoaXMuI3RvdGFsVmFsdWUsIFwiIGdvbGRcIik7XG5cdFx0Y29uc3QgZW1wdHlUZXh0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInBcIik7XG5cdFx0dGhpcy4jZW1wdHlUZXh0ID0gZW1wdHlUZXh0O1xuXHRcdGVtcHR5VGV4dC5jbGFzc05hbWUgPSBcIm1hcmtldC1lbXB0eVwiO1xuXHRcdGVtcHR5VGV4dC50ZXh0Q29udGVudCA9IFwiTm90aGluZyB0byBzZWxsIHlldC5cIjtcblx0XHRjb25zdCBpbnZlbnRvcnlTZWN0aW9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNlY3Rpb25cIik7XG5cdFx0aW52ZW50b3J5U2VjdGlvbi5jbGFzc05hbWUgPSBcIm1hcmtldC1pbnZlbnRvcnktc2VjdGlvblwiO1xuXHRcdGNvbnN0IGhlYWRpbmcgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiaDNcIik7XG5cdFx0aGVhZGluZy50ZXh0Q29udGVudCA9IFwiSW52ZW50b3J5XCI7XG5cdFx0Y29uc3QgcHJvZHVjdEdyb3VwID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHR0aGlzLiNwcm9kdWN0R3JvdXAgPSBwcm9kdWN0R3JvdXA7XG5cdFx0cHJvZHVjdEdyb3VwLmlkID0gXCJtYXJrZXQtcHJvZHVjdHNcIjtcblx0XHRpbnZlbnRvcnlTZWN0aW9uLmFwcGVuZChoZWFkaW5nLCBwcm9kdWN0R3JvdXApO1xuXHRcdHRoaXMucmVwbGFjZUNoaWxkcmVuKGluZm8sIGRpdmlkZXIsIHNlbGxBbGwsIGVtcHR5VGV4dCwgaW52ZW50b3J5U2VjdGlvbik7XG5cdH1cblxuXHRyZWZyZXNoKCk6IHZvaWQge1xuXHRcdGlmICghdGhpcy4jdXNlZCB8fCAhdGhpcy4jcHJvZ3Jlc3NCYXIgfHwgIXRoaXMuI3NlbGxBbGwpIHJldHVybjtcblx0XHRjb25zdCB1c2VkID0gdG90YWxJdGVtcygpO1xuXHRcdGNvbnN0IG1heCA9IHN0b3JhZ2VNYXgoKTtcblx0XHRjb25zdCBwY3QgPSBNYXRoLm1pbigxMDAsIE1hdGguZmxvb3IodXNlZCAvIG1heCAqIDEwMCkpO1xuXHRcdGNvbnN0IGNvc3QgPSBzdG9yYWdlVXBncmFkZUNvc3QoKTtcblx0XHRjb25zdCB3aXRoU3RvY2sgPSBrZXlzKFJFU09VUkNFUykuZmlsdGVyKChrKSA9PiBzdGF0ZS5pbnZlbnRvcnlba10gPiAwKTtcblx0XHRjb25zdCBoYXNTdG9jayA9IHdpdGhTdG9jay5sZW5ndGggPiAwO1xuXHRcdGNvbnN0IHRvdGFsVmFsdWUgPSB3aXRoU3RvY2sucmVkdWNlKChzdW0sIGspID0+IHN1bSArIHN0YXRlLmludmVudG9yeVtrXSAqIGN1cnJlbnRQcmljZShrKSwgMCk7XG5cdFx0dGhpcy4jdXNlZC50ZXh0Q29udGVudCA9IHVzZWQudG9Mb2NhbGVTdHJpbmcoKTtcblx0XHRmb3IgKGNvbnN0IGVsIG9mIHRoaXMuI3dhbnRzTWF4KSBlbC50ZXh0Q29udGVudCA9IG1heC50b0xvY2FsZVN0cmluZygpO1xuXHRcdHRoaXMuI3BjdC50ZXh0Q29udGVudCA9IHBjdC50b0xvY2FsZVN0cmluZygpO1xuXHRcdHRoaXMuI3Byb2dyZXNzQmFyLmFyaWFWYWx1ZU5vdyA9IFN0cmluZyhwY3QpO1xuXHRcdHRoaXMuI3Byb2dyZXNzRmlsbC5zdHlsZS53aWR0aCA9IGAke3BjdH0lYDtcblx0XHR0aGlzLiNjb3N0LnRleHRDb250ZW50ID0gY29zdC50b0xvY2FsZVN0cmluZygpO1xuXHRcdHRoaXMuI3VwZ3JhZGUuZGlzYWJsZWQgPSBzdGF0ZS5nb2xkIDwgY29zdDtcblx0XHR0aGlzLiNuZXh0LnRleHRDb250ZW50ID0gbmV4dFN0b3JhZ2VNYXgoKS50b0xvY2FsZVN0cmluZygpO1xuXHRcdHRoaXMuI3NlbGxBbGwuaGlkZGVuID0gIWhhc1N0b2NrO1xuXHRcdHRoaXMuI2VtcHR5VGV4dC5oaWRkZW4gPSBoYXNTdG9jaztcblx0XHR0aGlzLiN0b3RhbFZhbHVlLnRleHRDb250ZW50ID0gdG90YWxWYWx1ZS50b0xvY2FsZVN0cmluZygpO1xuXHRcdGZvciAoY29uc3Qgcmsgb2Yga2V5cyhSRVNPVVJDRVMpKSB7XG5cdFx0XHRjb25zdCBjYXJkID0gZ2V0T3JJbnNlcnQodGhpcy4jcHJvZHVjdENhcmRzLCByaywgKGtleSkgPT4ge1xuXHRcdFx0XHRjb25zdCBjYXJkID0gbmV3IE1hcmtldFByb2R1Y3RDYXJkKCk7XG5cdFx0XHRcdGNhcmQucmVzb3VyY2UgPSBrZXkgYXMgUmVzb3VyY2VLZXk7XG5cdFx0XHRcdHRoaXMuI3Byb2R1Y3RHcm91cC5hcHBlbmRDaGlsZChjYXJkKTtcblx0XHRcdFx0cmV0dXJuIGNhcmQ7XG5cdFx0XHR9KTtcblx0XHRcdGNhcmQucmVmcmVzaCgpO1xuXHRcdH1cblx0fVxufVxuIiwgImltcG9ydCB7IGRyYXdRdWVzdHMsIGlzR2FtZUNvbXBsZXRlLCBxdWVzdEJ5SWQgfSBmcm9tIFwiLi9xdWVzdHMudHNcIjtcbmltcG9ydCB7IGZyZXNoU3RhdGUsIHJ1bnRpbWUsIHNldFN0YXRlLCBzdGF0ZSB9IGZyb20gXCIuL3N0YXRlLnRzXCI7XG5pbXBvcnQgeyBnZXRQcmVzdGlnZUJvbnVzLCBnZXRQcmVzdGlnZU11bHQgfSBmcm9tIFwiLi9lY29ub215LnRzXCI7XG5pbXBvcnQgeyBhbm5vdW5jZSwgZW1pdCwgcmVxdWVzdFJlbmRlciB9IGZyb20gXCIuL2V2ZW50cy50c1wiO1xuaW1wb3J0IHsgc2F2ZSB9IGZyb20gXCIuL3NhdmUudHNcIjtcbmltcG9ydCB7IHJlY29yZCB9IGZyb20gXCIuL2pvdXJuYWwudHNcIjtcbmltcG9ydCB7IG5vdyB9IGZyb20gXCIuL2Nsb2NrLnRzXCI7XG5pbXBvcnQgeyBlbnRyaWVzIH0gZnJvbSBcIi4vdXRpbC50c1wiO1xuaW1wb3J0IHR5cGUgeyBSZXNvdXJjZUtleSwgUmV3YXJkVHlwZSB9IGZyb20gXCIuL3R5cGVzLnRzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgUHJlc3RpZ2VTdW1tYXJ5IHtcblx0dG90YWxBY3RpdmU6IG51bWJlcjtcblx0Y29tcGxldGVkQ291bnQ6IG51bWJlcjtcblx0aW5jb21wbGV0ZTogbnVtYmVyO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcHJlc3RpZ2VSZXNldFN1bW1hcnkoKTogUHJlc3RpZ2VTdW1tYXJ5IHtcblx0Y29uc3QgdG90YWxBY3RpdmUgPSBzdGF0ZS5xdWVzdHMuYWN0aXZlLmxlbmd0aDtcblx0Y29uc3QgY29tcGxldGVkQ291bnQgPSBzdGF0ZS5xdWVzdHMuY29tcGxldGVkLmZpbHRlcihCb29sZWFuKS5sZW5ndGg7XG5cdHJldHVybiB7IHRvdGFsQWN0aXZlLCBjb21wbGV0ZWRDb3VudCwgaW5jb21wbGV0ZTogdG90YWxBY3RpdmUgLSBjb21wbGV0ZWRDb3VudCB9O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlQcmVzdGlnZVJlc2V0KCk6IHZvaWQge1xuXHRyZWNvcmQoXCJwcmVzdGlnZVwiKTtcblx0Y29uc3QgeyBjb21wbGV0ZWRDb3VudCB9ID0gcHJlc3RpZ2VSZXNldFN1bW1hcnkoKTtcblx0aWYgKGNvbXBsZXRlZENvdW50ID09PSAwKSByZXR1cm47XG5cdGZvciAoY29uc3QgW2JrLCBic3RdIG9mIGVudHJpZXMoc3RhdGUuYnVpbGRpbmdzKSkge1xuXHRcdGlmIChic3QudW5sb2NrZWQgJiYgIXN0YXRlLnByZXN0aWdlLnNlZW5CdWlsZGluZ3MuaW5jbHVkZXMoYmspKSBzdGF0ZS5wcmVzdGlnZS5zZWVuQnVpbGRpbmdzLnB1c2goYmspO1xuXHR9XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgc3RhdGUucXVlc3RzLmFjdGl2ZS5sZW5ndGg7IGkrKykge1xuXHRcdGlmICghc3RhdGUucXVlc3RzLmNvbXBsZXRlZFtpXSkgY29udGludWU7XG5cdFx0Y29uc3QgcWlkID0gc3RhdGUucXVlc3RzLmFjdGl2ZVtpXTtcblx0XHRjb25zdCBkZWYgPSBxdWVzdEJ5SWQocWlkKTtcblx0XHRpZiAoZGVmKSB7XG5cdFx0XHRzdGF0ZS5wcmVzdGlnZS5yZXdhcmRzLnB1c2goZGVmLnJld2FyZCk7XG5cdFx0XHRpZiAoIXN0YXRlLnByZXN0aWdlLmNvbXBsZXRlZFF1ZXN0SWRzLmluY2x1ZGVzKHFpZCkpIHN0YXRlLnByZXN0aWdlLmNvbXBsZXRlZFF1ZXN0SWRzLnB1c2gocWlkKTtcblx0XHR9XG5cdH1cblx0Y29uc3QgYWNjID0gc3RhdGUucHJlc3RpZ2UuYWNjdW11bGF0ZWRTdGF0cztcblx0c3RhdGUucHJlc3RpZ2UucnVucysrO1xuXHRhY2MuZ29sZEVhcm5lZCArPSBzdGF0ZS5zdGF0cy5nb2xkRWFybmVkO1xuXHRhY2Muc3RvcmFnZVVwZ3JhZGVzICs9IHN0YXRlLnN0b3JhZ2UudGllcjtcblx0YWNjLnRyZWFzdXJlQ2hlc3RzT3BlbmVkICs9IHN0YXRlLnN0YXRzLnRyZWFzdXJlQ2hlc3RzT3BlbmVkID8/IDA7XG5cdGZvciAoY29uc3QgW2JrLCBic3RdIG9mIGVudHJpZXMoc3RhdGUuYnVpbGRpbmdzKSkge1xuXHRcdGZvciAoY29uc3QgW3BrLCBwc3RdIG9mIGVudHJpZXMoYnN0LnByb2R1Y3RzKSkge1xuXHRcdFx0YWNjLnRvdGFsU2xvdHMgKz0gcHN0LnNsb3RzLmxlbmd0aDtcblx0XHRcdGNvbnN0IGtleSA9IGAke2JrfS4ke3BrfWA7XG5cdFx0XHRhY2MubWF4U2xvdHNCeVByb2R1Y3Rba2V5XSA9IE1hdGgubWF4KGFjYy5tYXhTbG90c0J5UHJvZHVjdFtrZXldID8/IDAsIHBzdC5zbG90cy5sZW5ndGgpO1xuXHRcdFx0YWNjLnRvdGFsU2xvdHNCeVByb2R1Y3Rba2V5XSA9IChhY2MudG90YWxTbG90c0J5UHJvZHVjdFtrZXldID8/IDApICsgcHN0LnNsb3RzLmxlbmd0aDtcblx0XHR9XG5cdH1cblx0Zm9yIChjb25zdCBbaywgdl0gb2YgZW50cmllcyhzdGF0ZS5zdGF0cy5zb2xkQnlSZXNvdXJjZSBhcyBSZWNvcmQ8UmVzb3VyY2VLZXksIG51bWJlcj4pKSB7XG5cdFx0YWNjLnNvbGRCeVJlc291cmNlW2tdID0gKGFjYy5zb2xkQnlSZXNvdXJjZVtrXSA/PyAwKSArIHY7XG5cdH1cblx0Y29uc3QgaW5jb21wbGV0ZUFjdGl2ZSA9IHN0YXRlLnF1ZXN0cy5hY3RpdmUuZmlsdGVyKChfLCBpKSA9PiAhc3RhdGUucXVlc3RzLmNvbXBsZXRlZFtpXSk7XG5cdGNvbnN0IGluY29tcGxldGVCYXNlbGluZXM6IFJlY29yZDxzdHJpbmcsIG51bWJlcj4gPSB7fTtcblx0Zm9yIChjb25zdCBpZCBvZiBpbmNvbXBsZXRlQWN0aXZlKSB7XG5cdFx0aWYgKHN0YXRlLnF1ZXN0cy5iYXNlbGluZXM/LltpZF0gIT09IHVuZGVmaW5lZCkgaW5jb21wbGV0ZUJhc2VsaW5lc1tpZF0gPSBzdGF0ZS5xdWVzdHMuYmFzZWxpbmVzW2lkXTtcblx0fVxuXHRjb25zdCBwcmVzZXJ2ZWRQcmVzdGlnZSA9IHN0YXRlLnByZXN0aWdlO1xuXHRzZXRTdGF0ZShmcmVzaFN0YXRlKCkpO1xuXHRzdGF0ZS5wcmVzdGlnZSA9IHByZXNlcnZlZFByZXN0aWdlO1xuXHRzdGF0ZS5xdWVzdHMuYWN0aXZlID0gaW5jb21wbGV0ZUFjdGl2ZTtcblx0c3RhdGUucXVlc3RzLmNvbXBsZXRlZCA9IG5ldyBBcnJheShpbmNvbXBsZXRlQWN0aXZlLmxlbmd0aCkuZmlsbChmYWxzZSk7XG5cdHN0YXRlLnF1ZXN0cy5iYXNlbGluZXMgPSBpbmNvbXBsZXRlQmFzZWxpbmVzO1xuXHRzdGF0ZS5nb2xkID0gZ2V0UHJlc3RpZ2VCb251cyhcInN0YXJ0aW5nX2dvbGRcIik7XG5cdHN0YXRlLmxhc3RUaWNrID0gbm93KCk7XG5cdHJlc2V0UnVudGltZSgpO1xuXHRlbWl0KFwicHJlc3RpZ2U6cmVzZXRcIik7XG5cdGRyYXdRdWVzdHMoKTtcblx0c2F2ZSgpO1xuXHRyZXF1ZXN0UmVuZGVyKCk7XG5cdGFubm91bmNlKGBSdW4gJHsoc3RhdGUucHJlc3RpZ2UucnVucyArIDEpLnRvTG9jYWxlU3RyaW5nKCl9IHN0YXJ0ZWQhICR7Y29tcGxldGVkQ291bnQudG9Mb2NhbGVTdHJpbmcoKX0gcmV3YXJkJHtjb21wbGV0ZWRDb3VudCA9PT0gMSA/IFwiXCIgOiBcInNcIn0gZWFybmVkLmApO1xuXHRpZiAoaXNHYW1lQ29tcGxldGUoKSAmJiAhc3RhdGUucHJlc3RpZ2UudmljdG9yeVNob3duKSBlbWl0KFwidmljdG9yeVwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHZpY3RvcnlOZXdHYW1lKCk6IHZvaWQge1xuXHRyZWNvcmQoXCJuZXdHYW1lXCIpO1xuXHRjb25zdCB2aWN0b3J5Q291bnQgPSAoc3RhdGUucHJlc3RpZ2UudmljdG9yeUNvdW50ID8/IDApICsgMTtcblx0c2V0U3RhdGUoZnJlc2hTdGF0ZSgpKTtcblx0c3RhdGUucHJlc3RpZ2UudmljdG9yeUNvdW50ID0gdmljdG9yeUNvdW50O1xuXHRyZXNldFJ1bnRpbWUoKTtcblx0ZW1pdChcInZpY3Rvcnk6bmV3Z2FtZVwiKTtcblx0ZHJhd1F1ZXN0cygpO1xuXHRzYXZlKCk7XG5cdHJlcXVlc3RSZW5kZXIoKTtcblx0YW5ub3VuY2UoXCJOZXcgbGVnYWN5IGJlZ3VuIVwiKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGRpc21pc3NWaWN0b3J5KCk6IHZvaWQge1xuXHRzdGF0ZS5wcmVzdGlnZS52aWN0b3J5U2hvd24gPSB0cnVlO1xuXHRzYXZlKCk7XG59XG5cbmZ1bmN0aW9uIHJlc2V0UnVudGltZSgpOiB2b2lkIHtcblx0cnVudGltZS5uZXh0U2xvdElkID0gMDtcblx0cnVudGltZS5zdGFsbEFubm91bmNlZCA9IHt9O1xuXHRydW50aW1lLnNlbGVjdGVkQnVpbGRpbmcgPSBcImx1bWJlcl95YXJkXCI7XG59XG5cbmludGVyZmFjZSBTdW1tYXJ5RGVmIHtcblx0dHlwZTogUmV3YXJkVHlwZTtcblx0aXNNdWx0PzogYm9vbGVhbjtcblx0aXNEaXNjb3VudD86IGJvb2xlYW47XG5cdGZtdDogKG46IG51bWJlcikgPT4gc3RyaW5nO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gY29tcHV0ZVByZXN0aWdlU3VtbWFyeSgpOiBzdHJpbmdbXSB7XG5cdGNvbnN0IGRlZnM6IFN1bW1hcnlEZWZbXSA9IFtcblx0XHR7IHR5cGU6IFwic3RhcnRpbmdfZ29sZFwiLCBmbXQ6IChuKSA9PiBgKyR7bi50b0xvY2FsZVN0cmluZygpfSBTdGFydGluZyBHb2xkYCB9LFxuXHRcdHsgdHlwZTogXCJzbG90X2Nvc3RfcGN0XCIsIGlzTXVsdDogdHJ1ZSwgaXNEaXNjb3VudDogdHJ1ZSwgZm10OiAobikgPT4gYFNsb3QgQ29zdHMgLSR7bi50b0xvY2FsZVN0cmluZygpfSVgIH0sXG5cdFx0eyB0eXBlOiBcInVubG9ja19jb3N0X3BjdFwiLCBpc011bHQ6IHRydWUsIGlzRGlzY291bnQ6IHRydWUsIGZtdDogKG4pID0+IGBVbmxvY2sgQ29zdHMgLSR7bi50b0xvY2FsZVN0cmluZygpfSVgIH0sXG5cdFx0eyB0eXBlOiBcImJ1aWxkX2Nvc3RfcGN0XCIsIGlzTXVsdDogdHJ1ZSwgaXNEaXNjb3VudDogdHJ1ZSwgZm10OiAobikgPT4gYEJ1aWxkIENvc3RzIC0ke24udG9Mb2NhbGVTdHJpbmcoKX0lYCB9LFxuXHRcdHsgdHlwZTogXCJzZWxsX3ByaWNlX3BjdFwiLCBpc011bHQ6IHRydWUsIGlzRGlzY291bnQ6IGZhbHNlLCBmbXQ6IChuKSA9PiBgU2FsZSBQcmljZXMgKyR7bi50b0xvY2FsZVN0cmluZygpfSVgIH0sXG5cdFx0eyB0eXBlOiBcInN0b3JhZ2VfdGllclwiLCBmbXQ6IChuKSA9PiBgKyR7bi50b0xvY2FsZVN0cmluZygpfSBTdGFydGluZyBTdG9yYWdlIFRpZXIke24gPiAxID8gXCJzXCIgOiBcIlwifWAgfSxcblx0XHR7IHR5cGU6IFwiY3ljbGVfc3BlZWRfcGN0XCIsIGlzTXVsdDogdHJ1ZSwgaXNEaXNjb3VudDogZmFsc2UsIGZtdDogKG4pID0+IGBQcm9kdWN0aW9uIFNwZWVkICske24udG9Mb2NhbGVTdHJpbmcoKX0lYCB9LFxuXHRcdHsgdHlwZTogXCJ0cmVhc3VyZV9nb2xkX3BjdFwiLCBpc011bHQ6IHRydWUsIGlzRGlzY291bnQ6IGZhbHNlLCBmbXQ6IChuKSA9PiBgVHJlYXN1cmUgR29sZCArJHtuLnRvTG9jYWxlU3RyaW5nKCl9JWAgfSxcblx0XTtcblx0cmV0dXJuIGRlZnMubWFwKChkKSA9PiB7XG5cdFx0aWYgKGQuaXNNdWx0KSB7XG5cdFx0XHRjb25zdCBtdWx0ID0gZ2V0UHJlc3RpZ2VNdWx0KGQudHlwZSk7XG5cdFx0XHRjb25zdCB2YWwgPSBkLmlzRGlzY291bnQgPyBNYXRoLnJvdW5kKCgxIC0gbXVsdCkgKiAxMDApIDogTWF0aC5yb3VuZCgobXVsdCAtIDEpICogMTAwKTtcblx0XHRcdHJldHVybiB2YWwgPiAwID8gZC5mbXQodmFsKSA6IG51bGw7XG5cdFx0fVxuXHRcdGNvbnN0IHRvdGFsID0gZ2V0UHJlc3RpZ2VCb251cyhkLnR5cGUpO1xuXHRcdHJldHVybiB0b3RhbCA+IDAgPyBkLmZtdCh0b3RhbCkgOiBudWxsO1xuXHR9KS5maWx0ZXIoKHMpOiBzIGlzIHN0cmluZyA9PiBzICE9PSBudWxsKTtcbn1cbiIsICJpbXBvcnQgeyBzdGF0ZSB9IGZyb20gXCIuLi9jb3JlL3N0YXRlLnRzXCI7XG5pbXBvcnQgeyBnZXRRdWVzdFByb2dyZXNzLCBxdWVzdEJhc2VsaW5lLCBxdWVzdEJ5SWQsIHJlcm9sbENvc3QgfSBmcm9tIFwiLi4vY29yZS9xdWVzdHMudHNcIjtcbmltcG9ydCB7IGNvbXB1dGVQcmVzdGlnZVN1bW1hcnkgfSBmcm9tIFwiLi4vY29yZS9wcmVzdGlnZS50c1wiO1xuaW1wb3J0IHsgZm9ybWF0TnVtIH0gZnJvbSBcIi4uL2NvcmUvZm9ybWF0LnRzXCI7XG5cbmxldCByZW5kZXJLZXkgPSBcIlwiO1xuXG5leHBvcnQgZnVuY3Rpb24gaW52YWxpZGF0ZVF1ZXN0c1BhbmVsKCk6IHZvaWQge1xuXHRyZW5kZXJLZXkgPSBcIlwiO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyUXVlc3RzU2VjdGlvbigpOiB2b2lkIHtcblx0Y29uc3QgcGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhbmVsLXF1ZXN0c1wiKTtcblx0aWYgKCFwYW5lbCkgcmV0dXJuO1xuXHRjb25zdCBzdW1tYXJ5SDIgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKFwiI3NlY3Rpb24tcXVlc3RzID4gc3VtbWFyeSBoMlwiKTtcblx0aWYgKHN1bW1hcnlIMikgc3VtbWFyeUgyLnRleHRDb250ZW50ID0gYFF1ZXN0cyA6IFJ1biAkeyhzdGF0ZS5wcmVzdGlnZS5ydW5zICsgMSkudG9Mb2NhbGVTdHJpbmcoKX1gO1xuXHRjb25zdCBzdHJ1Y3RLZXkgPSBzdGF0ZS5xdWVzdHMuYWN0aXZlLmpvaW4oXCIsXCIpICsgXCI6XCIgKyBzdGF0ZS5xdWVzdHMuY29tcGxldGVkLm1hcChOdW1iZXIpLmpvaW4oXCIsXCIpICsgXCI6XCIgKyBzdGF0ZS5wcmVzdGlnZS5ydW5zO1xuXHRpZiAoc3RydWN0S2V5ID09PSByZW5kZXJLZXkgJiYgcGFuZWwuZmlyc3RDaGlsZCkge1xuXHRcdHVwZGF0ZVF1ZXN0QmFycyhwYW5lbCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHJlbmRlcktleSA9IHN0cnVjdEtleTtcblx0Y29uc3QgY29tcGxldGVkQ291bnQgPSBzdGF0ZS5xdWVzdHMuY29tcGxldGVkLmZpbHRlcihCb29sZWFuKS5sZW5ndGg7XG5cdGNvbnN0IGNhblJlc2V0ID0gY29tcGxldGVkQ291bnQgPj0gMTtcblx0Y29uc3QgYnVpbGRDYXJkID0gKGlkOiBzdHJpbmcsIGk6IG51bWJlcik6IHN0cmluZyA9PiB7XG5cdFx0Y29uc3QgZGVmID0gcXVlc3RCeUlkKGlkKTtcblx0XHRpZiAoIWRlZikgcmV0dXJuIFwiXCI7XG5cdFx0Y29uc3QgeyBjdXJyZW50LCB0YXJnZXQgfSA9IGdldFF1ZXN0UHJvZ3Jlc3MoZGVmLCBxdWVzdEJhc2VsaW5lKGlkLCBkZWYpKTtcblx0XHRjb25zdCBkb25lID0gc3RhdGUucXVlc3RzLmNvbXBsZXRlZFtpXTtcblx0XHRjb25zdCBpc0Jvb2xlYW4gPSBkZWYudHlwZSA9PT0gXCJidWlsZFwiIHx8IGRlZi50eXBlID09PSBcInVubG9ja1wiO1xuXHRcdGNvbnN0IHBjdCA9IGlzQm9vbGVhbiA/IChkb25lID8gMTAwIDogMCkgOiBNYXRoLm1pbigxMDAsIE1hdGguZmxvb3IoY3VycmVudCAvIHRhcmdldCAqIDEwMCkpO1xuXHRcdGNvbnN0IHByb2dyZXNzUm93ID0gZG9uZVxuXHRcdFx0PyBcIlwiXG5cdFx0XHQ6IGlzQm9vbGVhblxuXHRcdFx0PyBgPGRpdiBjbGFzcz1cInF1ZXN0LXByb2dyZXNzLXJvd1wiPjxzcGFuIGNsYXNzPVwicXVlc3QtcHJvZy10ZXh0XCI+Tm90IHlldDwvc3Bhbj48L2Rpdj5gXG5cdFx0XHQ6IGA8ZGl2IGNsYXNzPVwicXVlc3QtcHJvZ3Jlc3Mtcm93XCI+XG5cdFx0XHRcdDxkaXYgY2xhc3M9XCJxdWVzdC1iYXItd3JhcFwiIHJvbGU9XCJwcm9ncmVzc2JhclwiIGRhdGEtcXVlc3QtYmFyPVwiJHtpZH1cIiBhcmlhLWxhYmVsPVwicXVlc3QgcHJvZ3Jlc3NcIiBhcmlhLXZhbHVlbWluPVwiMFwiIGFyaWEtdmFsdWVtYXg9XCIxMDBcIiBhcmlhLXZhbHVlbm93PVwiJHtwY3R9XCI+XG5cdFx0XHRcdFx0PGRpdiBjbGFzcz1cInF1ZXN0LWJhci1maWxsXCIgc3R5bGU9XCJ3aWR0aDoke3BjdH0lXCI+PC9kaXY+XG5cdFx0XHRcdDwvZGl2PlxuXHRcdFx0XHQ8c3BhbiBjbGFzcz1cInF1ZXN0LXByb2ctdGV4dFwiIGRhdGEtcXVlc3QtdGV4dD1cIiR7aWR9XCI+JHtmb3JtYXROdW0oY3VycmVudCl9IC8gJHtmb3JtYXROdW0odGFyZ2V0KX08L3NwYW4+XG5cdFx0XHQ8L2Rpdj5gO1xuXHRcdGNvbnN0IHJlcm9sbEJ0biA9IGRvbmUgPyBcIlwiIDogKCgpID0+IHtcblx0XHRcdGNvbnN0IGNvc3QgPSByZXJvbGxDb3N0KCk7XG5cdFx0XHRyZXR1cm4gYDxidXR0b24gY2xhc3M9XCJyZXJvbGwtcXVlc3QtYnRuXCIgZGF0YS1hY3Rpb249XCJyZXJvbGwtcXVlc3RcIiBkYXRhLWluZGV4PVwiJHtpfVwiICR7XG5cdFx0XHRcdHN0YXRlLmdvbGQgPj0gY29zdCA/IFwiXCIgOiBcImRpc2FibGVkXCJcblx0XHRcdH0+UmVyb2xsICgke2Nvc3QudG9Mb2NhbGVTdHJpbmcoKX0gZ29sZCk8L2J1dHRvbj5gO1xuXHRcdH0pKCk7XG5cdFx0cmV0dXJuIGA8ZGl2IGNsYXNzPVwicXVlc3QtY2FyZCR7ZG9uZSA/IFwiIHF1ZXN0LWRvbmVcIiA6IFwiXCJ9XCI+XG5cdFx0XHQ8aDQgY2xhc3M9XCJxdWVzdC10aXRsZVwiPiR7ZGVmLmxhYmVsfTwvaDQ+XG5cdFx0XHQ8cCBjbGFzcz1cInF1ZXN0LXJld2FyZC1sYWJlbFwiPlJld2FyZDogJHtkZWYucmV3YXJkTGFiZWx9PC9wPlxuXHRcdFx0JHtwcm9ncmVzc1Jvd31cblx0XHRcdCR7cmVyb2xsQnRufVxuXHRcdDwvZGl2PmA7XG5cdH07XG5cdGNvbnN0IGluUHJvZ3Jlc3NIdG1sID0gc3RhdGUucXVlc3RzLmFjdGl2ZS5tYXAoKGlkLCBpKSA9PiBzdGF0ZS5xdWVzdHMuY29tcGxldGVkW2ldID8gXCJcIiA6IGJ1aWxkQ2FyZChpZCwgaSkpLmpvaW4oXCJcIik7XG5cdGNvbnN0IGNvbXBsZXRlZEh0bWwgPSBzdGF0ZS5xdWVzdHMuYWN0aXZlLm1hcCgoaWQsIGkpID0+IHN0YXRlLnF1ZXN0cy5jb21wbGV0ZWRbaV0gPyBidWlsZENhcmQoaWQsIGkpIDogXCJcIikuam9pbihcIlwiKTtcblx0Y29uc3QgYm9udXNlcyA9IGNvbXB1dGVQcmVzdGlnZVN1bW1hcnkoKTtcblx0Y29uc3QgYm9udXNlc0h0bWwgPSBib251c2VzLmxlbmd0aCA9PT0gMFxuXHRcdD8gYDxwIGNsYXNzPVwicXVlc3Qtbm8tYm9udXNlc1wiPk5vIGJvbnVzZXMgeWV0LiBDb21wbGV0ZSBxdWVzdHMgYW5kIHJlc2V0IHRvIGVhcm4gcGVybWFuZW50IHVwZ3JhZGVzLjwvcD5gXG5cdFx0OiBgPHVsIGNsYXNzPVwicHJlc3RpZ2UtYm9udXMtbGlzdFwiPiR7Ym9udXNlcy5tYXAoKGIpID0+IGA8bGk+JHtifTwvbGk+YCkuam9pbihcIlwiKX08L3VsPmA7XG5cdGNvbnN0IHJlc2V0TGFiZWwgPSBjb21wbGV0ZWRDb3VudCA9PT0gc3RhdGUucXVlc3RzLmFjdGl2ZS5sZW5ndGhcblx0XHQ/IFwiUmVzZXQgJiBDb2xsZWN0IEFsbCBSZXdhcmRzXCJcblx0XHQ6IGBSZXNldCAmIENvbGxlY3QgUmV3YXJkcyAoJHtjb21wbGV0ZWRDb3VudH0gLyAke3N0YXRlLnF1ZXN0cy5hY3RpdmUubGVuZ3RofSBjb21wbGV0ZSlgO1xuXHRjb25zdCB3YXJuaW5nSHRtbCA9IGNhblJlc2V0ICYmIGNvbXBsZXRlZENvdW50IDwgc3RhdGUucXVlc3RzLmFjdGl2ZS5sZW5ndGhcblx0XHQ/IGA8cCBjbGFzcz1cInJlc2V0LXdhcm5pbmdcIj4ke3N0YXRlLnF1ZXN0cy5hY3RpdmUubGVuZ3RoIC0gY29tcGxldGVkQ291bnR9IHF1ZXN0JHtcblx0XHRcdHN0YXRlLnF1ZXN0cy5hY3RpdmUubGVuZ3RoIC0gY29tcGxldGVkQ291bnQgPT09IDEgPyBcIlwiIDogXCJzXCJcblx0XHR9IHN0aWxsIGluY29tcGxldGUuIFlvdSB3aWxsIG1pc3MgdGhvc2UgcmV3YXJkcy48L3A+YFxuXHRcdDogXCJcIjtcblx0cGFuZWwuaW5uZXJIVE1MID0gYFxuXHRcdCR7aW5Qcm9ncmVzc0h0bWwgPyBgPHNlY3Rpb24gY2xhc3M9XCJxdWVzdC1ncm91cFwiPjxoMz5JbiBQcm9ncmVzczwvaDM+PGRpdiBjbGFzcz1cInF1ZXN0LWdyaWRcIj4ke2luUHJvZ3Jlc3NIdG1sfTwvZGl2Pjwvc2VjdGlvbj5gIDogXCJcIn1cblx0XHQke2NvbXBsZXRlZEh0bWwgPyBgPHNlY3Rpb24gY2xhc3M9XCJxdWVzdC1ncm91cFwiPjxoMz5Db21wbGV0ZWQ8L2gzPjxkaXYgY2xhc3M9XCJxdWVzdC1ncmlkXCI+JHtjb21wbGV0ZWRIdG1sfTwvZGl2Pjwvc2VjdGlvbj5gIDogXCJcIn1cblx0XHQ8c2VjdGlvbiBjbGFzcz1cInByZXN0aWdlLXNlY3Rpb25cIj5cblx0XHRcdDxoMz5QZXJtYW5lbnQgUmV3YXJkczwvaDM+XG5cdFx0XHQke2JvbnVzZXNIdG1sfVxuXHRcdDwvc2VjdGlvbj5cblx0XHQ8ZGl2IGNsYXNzPVwicHJlc3RpZ2UtcmVzZXQtcm93XCI+XG5cdFx0XHQke3dhcm5pbmdIdG1sfVxuXHRcdFx0PGJ1dHRvbiBjbGFzcz1cInByZXN0aWdlLXJlc2V0LWJ0blwiIGRhdGEtYWN0aW9uPVwicHJlc3RpZ2UtcmVzZXRcIiAke2NhblJlc2V0ID8gXCJcIiA6IFwiZGlzYWJsZWRcIn0+XG5cdFx0XHRcdCR7cmVzZXRMYWJlbH1cblx0XHRcdDwvYnV0dG9uPlxuXHRcdDwvZGl2PmA7XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZVF1ZXN0QmFycyhwYW5lbDogSFRNTEVsZW1lbnQpOiB2b2lkIHtcblx0Zm9yIChsZXQgaSA9IDA7IGkgPCBzdGF0ZS5xdWVzdHMuYWN0aXZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0aWYgKHN0YXRlLnF1ZXN0cy5jb21wbGV0ZWRbaV0pIGNvbnRpbnVlO1xuXHRcdGNvbnN0IGlkID0gc3RhdGUucXVlc3RzLmFjdGl2ZVtpXTtcblx0XHRjb25zdCBkZWYgPSBxdWVzdEJ5SWQoaWQpO1xuXHRcdGlmICghZGVmIHx8IGRlZi50eXBlID09PSBcImJ1aWxkXCIgfHwgZGVmLnR5cGUgPT09IFwidW5sb2NrXCIpIGNvbnRpbnVlO1xuXHRcdGNvbnN0IHsgY3VycmVudCwgdGFyZ2V0IH0gPSBnZXRRdWVzdFByb2dyZXNzKGRlZiwgcXVlc3RCYXNlbGluZShpZCwgZGVmKSk7XG5cdFx0Y29uc3QgcGN0ID0gTWF0aC5taW4oMTAwLCBNYXRoLmZsb29yKGN1cnJlbnQgLyB0YXJnZXQgKiAxMDApKTtcblx0XHRjb25zdCBiYXJFbCA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3IoYFtkYXRhLXF1ZXN0LWJhcj1cIiR7ZGVmLmlkfVwiXWApO1xuXHRcdGNvbnN0IHR4dEVsID0gcGFuZWwucXVlcnlTZWxlY3RvcihgW2RhdGEtcXVlc3QtdGV4dD1cIiR7ZGVmLmlkfVwiXWApO1xuXHRcdGlmIChiYXJFbCkge1xuXHRcdFx0YmFyRWwuc2V0QXR0cmlidXRlKFwiYXJpYS12YWx1ZW5vd1wiLCBTdHJpbmcocGN0KSk7XG5cdFx0XHRjb25zdCBmaWxsID0gYmFyRWwucXVlcnlTZWxlY3RvcjxIVE1MRWxlbWVudD4oXCIucXVlc3QtYmFyLWZpbGxcIik7XG5cdFx0XHRpZiAoZmlsbCkgZmlsbC5zdHlsZS53aWR0aCA9IGAke3BjdH0lYDtcblx0XHR9XG5cdFx0aWYgKHR4dEVsKSB0eHRFbC50ZXh0Q29udGVudCA9IGAke2Zvcm1hdE51bShjdXJyZW50KX0gLyAke2Zvcm1hdE51bSh0YXJnZXQpfWA7XG5cdH1cblx0Y29uc3QgY29zdCA9IHJlcm9sbENvc3QoKTtcblx0Y29uc3QgY2FuQWZmb3JkID0gc3RhdGUuZ29sZCA+PSBjb3N0O1xuXHRmb3IgKGNvbnN0IGJ0biBvZiBwYW5lbC5xdWVyeVNlbGVjdG9yQWxsPEhUTUxCdXR0b25FbGVtZW50PihcIi5yZXJvbGwtcXVlc3QtYnRuXCIpKSBidG4uZGlzYWJsZWQgPSAhY2FuQWZmb3JkO1xufVxuIiwgImltcG9ydCB7IFJFU09VUkNFUyB9IGZyb20gXCIuLi9jb250ZW50L3Jlc291cmNlcy50c1wiO1xuaW1wb3J0IHsgQlVJTERJTkdTIH0gZnJvbSBcIi4uL2NvbnRlbnQvYnVpbGRpbmdzLnRzXCI7XG5pbXBvcnQgeyBydW50aW1lLCBzdGF0ZSB9IGZyb20gXCIuLi9jb3JlL3N0YXRlLnRzXCI7XG5pbXBvcnQgeyBiZXN0TmV4dFB1cmNoYXNlLCBidWlsZENvc3QsIGdldFByb2R1Y3Rpb25PdmVydmlldywgbmV4dEJ1aWxkYWJsZUJ1aWxkaW5nLCBzdG9yYWdlTWF4LCB0b3RhbEl0ZW1zIH0gZnJvbSBcIi4uL2NvcmUvZWNvbm9teS50c1wiO1xuaW1wb3J0IHsgZm9ybWF0UmVzb3VyY2VOYW1lIH0gZnJvbSBcIi4uL2NvcmUvZm9ybWF0LnRzXCI7XG5pbXBvcnQgeyBub3cgfSBmcm9tIFwiLi4vY29yZS9jbG9jay50c1wiO1xuaW1wb3J0IHsgZW50cmllcyB9IGZyb20gXCIuLi9jb3JlL3V0aWwudHNcIjtcbmltcG9ydCB7IHR5cGUgQnVpbGRpbmdTZWN0aW9uLCBNYXJrZXRTZWN0aW9uIH0gZnJvbSBcIi4vY29tcG9uZW50cy50c1wiO1xuaW1wb3J0IHsgcmVuZGVyUXVlc3RzU2VjdGlvbiB9IGZyb20gXCIuL3F1ZXN0cy1wYW5lbC50c1wiO1xuXG5pbnRlcmZhY2UgSHVkQ2FjaGUge1xuXHRnb2xkOiBIVE1MRWxlbWVudCB8IG51bGw7XG5cdHN0b3JhZ2U6IEhUTUxFbGVtZW50IHwgbnVsbDtcblx0Y2hhaW46IEhUTUxFbGVtZW50IHwgbnVsbDtcblx0aW52ZW50b3J5OiBIVE1MRWxlbWVudCB8IG51bGw7XG59XG5cbmludGVyZmFjZSBQcm9kdWN0aW9uQ2FjaGUge1xuXHRwYW5lbDogSFRNTEVsZW1lbnQgfCBudWxsO1xuXHR1bmxvY2tTZWN0aW9uOiBIVE1MRGl2RWxlbWVudCB8IG51bGw7XG5cdHByb2R1Y3RTZWN0aW9uOiBCdWlsZGluZ1NlY3Rpb24gfCBudWxsO1xuXHRjaGFpblNlY3Rpb246IEhUTUxEaXZFbGVtZW50IHwgbnVsbDtcbn1cblxuaW50ZXJmYWNlIE1hcmtldENhY2hlIHtcblx0cGFuZWw6IEhUTUxFbGVtZW50IHwgbnVsbDtcblx0bWFya2V0U2VjdGlvbjogTWFya2V0U2VjdGlvbiB8IG51bGw7XG59XG5cbmludGVyZmFjZSBHdWlTdGF0ZSB7XG5cdGh1ZDogSHVkQ2FjaGU7XG5cdHByb2R1Y3Rpb246IFByb2R1Y3Rpb25DYWNoZTtcblx0bWFya2V0OiBNYXJrZXRDYWNoZTtcbn1cblxuZXhwb3J0IGNvbnN0IGd1aVN0YXRlOiBHdWlTdGF0ZSA9IHtcblx0aHVkOiB7IGdvbGQ6IG51bGwsIHN0b3JhZ2U6IG51bGwsIGNoYWluOiBudWxsLCBpbnZlbnRvcnk6IG51bGwgfSxcblx0cHJvZHVjdGlvbjogeyBwYW5lbDogbnVsbCwgdW5sb2NrU2VjdGlvbjogbnVsbCwgcHJvZHVjdFNlY3Rpb246IG51bGwsIGNoYWluU2VjdGlvbjogbnVsbCB9LFxuXHRtYXJrZXQ6IHsgcGFuZWw6IG51bGwsIG1hcmtldFNlY3Rpb246IG51bGwgfSxcbn07XG5cbmV4cG9ydCBmdW5jdGlvbiBhbm5vdW5jZVRvRG9tKG1zZzogc3RyaW5nKTogdm9pZCB7XG5cdGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJsaXZlLWFubm91bmNlclwiKTtcblx0aWYgKCFlbCkgcmV0dXJuO1xuXHRlbC50ZXh0Q29udGVudCA9IG1zZztcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZEJ1aWxkaW5nT3B0aW9uKGJsZEtleTogc3RyaW5nKTogdm9pZCB7XG5cdGNvbnN0IHNlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnVpbGRpbmctc2VsZWN0XCIpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbDtcblx0aWYgKCFzZWwgfHwgc2VsLnF1ZXJ5U2VsZWN0b3IoYG9wdGlvblt2YWx1ZT1cIiR7YmxkS2V5fVwiXWApKSByZXR1cm47XG5cdGNvbnN0IG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIik7XG5cdG9wdC52YWx1ZSA9IGJsZEtleTtcblx0b3B0LnRleHRDb250ZW50ID0gQlVJTERJTkdTW2JsZEtleV0ubGFiZWw7XG5cdHNlbC5hcHBlbmRDaGlsZChvcHQpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQWxsKCk6IHZvaWQge1xuXHRyZW5kZXJUcmVhc3VyZSgpO1xuXHRyZW5kZXJIVUQoKTtcblx0cmVuZGVyQnVpbGRpbmdTZWN0aW9uKCk7XG5cdHJlbmRlck1hcmtldFNlY3Rpb24oKTtcblx0cmVuZGVyUXVlc3RzU2VjdGlvbigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVySFVEKCk6IHZvaWQge1xuXHRjb25zdCBodWQgPSBndWlTdGF0ZS5odWQ7XG5cdGNvbnN0IGdvbGRUZXh0ID0gYCR7TWF0aC5mbG9vcihzdGF0ZS5nb2xkKS50b0xvY2FsZVN0cmluZygpfSBnb2xkYDtcblx0Y29uc3QgZ29sZEVsID0gaHVkLmdvbGQgPz89IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaHVkLWdvbGRcIik7XG5cdGlmIChnb2xkRWwgJiYgZ29sZEVsLnRleHRDb250ZW50ICE9PSBnb2xkVGV4dCkgZ29sZEVsLnRleHRDb250ZW50ID0gZ29sZFRleHQ7XG5cdGNvbnN0IHN0b3JhZ2VUZXh0ID0gYCR7dG90YWxJdGVtcygpLnRvTG9jYWxlU3RyaW5nKCl9LyR7c3RvcmFnZU1heCgpLnRvTG9jYWxlU3RyaW5nKCl9IGl0ZW1zYDtcblx0Y29uc3Qgc3RvcmFnZUVsID0gaHVkLnN0b3JhZ2UgPz89IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiaHVkLXN0b3JhZ2VcIik7XG5cdGlmIChzdG9yYWdlRWwgJiYgc3RvcmFnZUVsLnRleHRDb250ZW50ICE9PSBzdG9yYWdlVGV4dCkgc3RvcmFnZUVsLnRleHRDb250ZW50ID0gc3RvcmFnZVRleHQ7XG5cdGNvbnN0IGludmVudG9yeUVsID0gaHVkLmludmVudG9yeSA/Pz0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJodWQtaW52ZW50b3J5XCIpO1xuXHRpZiAoaW52ZW50b3J5RWwpIHtcblx0XHRjb25zdCBpbnZUZXh0ID0gZW50cmllcyhzdGF0ZS5pbnZlbnRvcnkpXG5cdFx0XHQuZmlsdGVyKChbLCB2XSkgPT4gdiA+IDApXG5cdFx0XHQubWFwKChbaywgdl0pID0+IGAke3YudG9Mb2NhbGVTdHJpbmcoKX0gJHtmb3JtYXRSZXNvdXJjZU5hbWUoaywgdil9YClcblx0XHRcdC5qb2luKFwiLCBcIik7XG5cdFx0aWYgKGludmVudG9yeUVsLnRleHRDb250ZW50ICE9PSBpbnZUZXh0KSBpbnZlbnRvcnlFbC50ZXh0Q29udGVudCA9IGludlRleHQ7XG5cdH1cblx0Y29uc3QgY2hhaW5FbCA9IGh1ZC5jaGFpbiA/Pz0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJodWQtY2hhaW5cIik7XG5cdGlmIChjaGFpbkVsKSB7XG5cdFx0Y29uc3QgeyBoYXNDaGFpbiwgZGVmaWNpdHMsIGVmZmljaWVuY3lQY3QgfSA9IGdldFByb2R1Y3Rpb25PdmVydmlldygpO1xuXHRcdGxldCBjaGFpblRleHQgPSBcIlwiO1xuXHRcdGxldCBjaGFpbkNsYXNzID0gXCJcIjtcblx0XHRpZiAoaGFzQ2hhaW4pIHtcblx0XHRcdGlmIChkZWZpY2l0cy5sZW5ndGggPiAwKSB7XG5cdFx0XHRcdGNvbnN0IG5hbWVzID0gZGVmaWNpdHMuc2xpY2UoMCwgMikubWFwKChlKSA9PiBSRVNPVVJDRVNbZS5yZXNvdXJjZUtleV0ubGFiZWwpLmpvaW4oXCIsIFwiKTtcblx0XHRcdFx0Y2hhaW5UZXh0ID0gYEJvdHRsZW5lY2s6ICR7bmFtZXN9YDtcblx0XHRcdFx0Y2hhaW5DbGFzcyA9IFwiaHVkLXdhcm5cIjtcblx0XHRcdH0gZWxzZSBpZiAoZWZmaWNpZW5jeVBjdCAhPT0gbnVsbCkge1xuXHRcdFx0XHRjaGFpblRleHQgPSBlZmZpY2llbmN5UGN0ID09PSAxMDAgPyBcIkNoYWluOiBPS1wiIDogYENoYWluOiAke2VmZmljaWVuY3lQY3R9JWA7XG5cdFx0XHRcdGNoYWluQ2xhc3MgPSBlZmZpY2llbmN5UGN0ID09PSAxMDAgPyBcImh1ZC1va1wiIDogXCJcIjtcblx0XHRcdH1cblx0XHR9XG5cdFx0aWYgKGNoYWluRWwudGV4dENvbnRlbnQgIT09IGNoYWluVGV4dCkgY2hhaW5FbC50ZXh0Q29udGVudCA9IGNoYWluVGV4dDtcblx0XHRpZiAoY2hhaW5FbC5jbGFzc05hbWUgIT09IGNoYWluQ2xhc3MpIGNoYWluRWwuY2xhc3NOYW1lID0gY2hhaW5DbGFzcztcblx0fVxufVxuXG5leHBvcnQgZnVuY3Rpb24gcmVuZGVyQ2hhaW5PdmVydmlldygpOiBzdHJpbmcge1xuXHRjb25zdCB7IGhhc0NoYWluLCBiYWxhbmNlcyB9ID0gZ2V0UHJvZHVjdGlvbk92ZXJ2aWV3KCk7XG5cdGlmICghaGFzQ2hhaW4pIHJldHVybiBcIlwiO1xuXHRjb25zdCBzaG9ydGFnZXMgPSBiYWxhbmNlcy5maWx0ZXIoKGIpID0+IGIubmV0IDwgLTAuMDUpLnNvcnQoKGEsIGIpID0+IGEubmV0IC0gYi5uZXQpO1xuXHRjb25zdCBzdXJwbHVzZXMgPSBiYWxhbmNlcy5maWx0ZXIoKGIpID0+IGIubmV0ID4gMC4wNSkuc29ydCgoYSwgYikgPT4gYi5uZXQgLSBhLm5ldCk7XG5cdGNvbnN0IHNlbnRlbmNlczogc3RyaW5nW10gPSBbXTtcblx0aWYgKHNob3J0YWdlcy5sZW5ndGggPiAwKSB7XG5cdFx0Y29uc3QgaXRlbXMgPSBzaG9ydGFnZXMubWFwKChiKSA9PiBgPGxpPiR7UkVTT1VSQ0VTW2IucmVzb3VyY2VLZXldLmxhYmVsfSAobmVlZCAke01hdGguYWJzKGIubmV0KS50b0ZpeGVkKDEpfS9taW4gbW9yZSk8L2xpPmApLmpvaW4oXCJcIik7XG5cdFx0c2VudGVuY2VzLnB1c2goYDxwIGNsYXNzPVwiY2hhaW4taXRlbS1uZWdcIj5Cb3R0bGVuZWNrOjwvcD48dWwgY2xhc3M9XCJjaGFpbi1pdGVtLW5lZ1wiPiR7aXRlbXN9PC91bD5gKTtcblx0fVxuXHRpZiAoc3VycGx1c2VzLmxlbmd0aCA+IDApIHtcblx0XHRjb25zdCBpdGVtcyA9IHN1cnBsdXNlcy5tYXAoKGIpID0+IGA8bGk+JHtSRVNPVVJDRVNbYi5yZXNvdXJjZUtleV0ubGFiZWx9ICgrJHtiLm5ldC50b0ZpeGVkKDEpfS9taW4pPC9saT5gKS5qb2luKFwiXCIpO1xuXHRcdHNlbnRlbmNlcy5wdXNoKGA8cCBjbGFzcz1cImNoYWluLWl0ZW0tcG9zXCI+U3VycGx1czo8L3A+PHVsIGNsYXNzPVwiY2hhaW4taXRlbS1wb3NcIj4ke2l0ZW1zfTwvdWw+YCk7XG5cdH1cblx0aWYgKHNob3J0YWdlcy5sZW5ndGggPT09IDAgJiYgc3VycGx1c2VzLmxlbmd0aCA9PT0gMCkgc2VudGVuY2VzLnB1c2goYDxwPllvdXIgcHJvZHVjdGlvbiBjaGFpbiBpcyBwZXJmZWN0bHkgYmFsYW5jZWQuPC9wPmApO1xuXHRjb25zdCBmaXhCdG4gPSBzaG9ydGFnZXMubGVuZ3RoID4gMCA/IGA8YnV0dG9uIGNsYXNzPVwiY2hhaW4tZml4LWJ0blwiIGRhdGEtYWN0aW9uPVwiZml4LWJvdHRsZW5lY2tcIj5CdXkgc2xvdHMgdG8gZml4IGJvdHRsZW5lY2s8L2J1dHRvbj5gIDogXCJcIjtcblx0Y29uc3Qgc3VnZ2VzdGlvbiA9IGJlc3ROZXh0UHVyY2hhc2UoKTtcblx0Y29uc3Qgc3VnZ2VzdGlvbkh0bWwgPSBzdWdnZXN0aW9uXG5cdFx0PyBgPHAgY2xhc3M9XCJjaGFpbi1zdWdnZXN0aW9uICR7c3VnZ2VzdGlvbi5pc0RlZmljaXQgPyBcImNoYWluLWl0ZW0tbmVnXCIgOiBcImNoYWluLWl0ZW0tbXV0ZWRcIn1cIj4ke1xuXHRcdFx0c3VnZ2VzdGlvbi5pc0RlZmljaXQgPyBcIlN1Z2dlc3RlZCBmaXhcIiA6IFwiQmVzdCB2YWx1ZVwiXG5cdFx0fTogYWRkIGEgJHtzdWdnZXN0aW9uLmxhYmVsfSBzbG90ICgke3N1Z2dlc3Rpb24uY29zdC50b0xvY2FsZVN0cmluZygpfSBnb2xkKTwvcD5gXG5cdFx0OiBcIlwiO1xuXHRyZXR1cm4gYFxuXHRcdDxoMz5Qcm9kdWN0aW9uIFN1bW1hcnk8L2gzPlxuXHRcdDxkaXYgY2xhc3M9XCJjaGFpbi1wcm9zZVwiPlxuXHRcdFx0JHtzZW50ZW5jZXMuam9pbihcIlwiKX1cblx0XHRcdCR7c3VnZ2VzdGlvbkh0bWx9XG5cdFx0PC9kaXY+XG5cdFx0JHtmaXhCdG59XG5cdGA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJCdWlsZGluZ1NlY3Rpb24oKTogdm9pZCB7XG5cdGNvbnN0IHByb2R1Y3Rpb24gPSBndWlTdGF0ZS5wcm9kdWN0aW9uO1xuXHRjb25zdCBwYW5lbCA9IHByb2R1Y3Rpb24ucGFuZWwgPz89IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwicGFuZWwtcHJvZHVjdGlvblwiKTtcblx0aWYgKCFwYW5lbCkgcmV0dXJuO1xuXHRjb25zdCBibGRLZXkgPSBydW50aW1lLnNlbGVjdGVkQnVpbGRpbmc7XG5cdGNvbnN0IG5leHRCbGRLZXkgPSBuZXh0QnVpbGRhYmxlQnVpbGRpbmcoKTtcblx0Y29uc3QgdW5sb2NrU2VjdGlvbiA9IHByb2R1Y3Rpb24udW5sb2NrU2VjdGlvbiA/Pz0gKCgpID0+IHtcblx0XHRjb25zdCBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7XG5cdFx0ZWwuY2xhc3NOYW1lID0gXCJ1bmxvY2stc2VjdGlvblwiO1xuXHRcdGVsLnN0eWxlLm1hcmdpblRvcCA9IFwiMFwiO1xuXHRcdGVsLnN0eWxlLm1hcmdpbkJvdHRvbSA9IFwidmFyKC0tc3BhY2UtbWQpXCI7XG5cdFx0cGFuZWwuYXBwZW5kQ2hpbGQoZWwpO1xuXHRcdHJldHVybiBlbDtcblx0fSkoKTtcblx0bGV0IG5leHRIdG1sID0gXCJObyBuZXh0IGJ1aWxkaW5nXCI7XG5cdGlmIChuZXh0QmxkS2V5KSB7XG5cdFx0Y29uc3QgbmNmZyA9IEJVSUxESU5HU1tuZXh0QmxkS2V5XTtcblx0XHRjb25zdCBuY29zdCA9IGJ1aWxkQ29zdChuZXh0QmxkS2V5KTtcblx0XHRuZXh0SHRtbCA9IGA8YnV0dG9uIGNsYXNzPVwidW5sb2NrLXByb2R1Y3QtYnRuXCIgZGF0YS1hY3Rpb249XCJidWlsZFwiIGRhdGEtYmxkPVwiJHtuZXh0QmxkS2V5fVwiICR7c3RhdGUuZ29sZCA+PSBuY29zdCA/IFwiXCIgOiBcImRpc2FibGVkXCJ9PlxuXHRcdFx0QnVpbGQgJHtuY2ZnLmxhYmVsfSAoJHtuY29zdCA9PT0gMCA/IFwiRnJlZVwiIDogbmNvc3QudG9Mb2NhbGVTdHJpbmcoKSArIFwiIGdvbGRcIn0pXG5cdFx0PC9idXR0b24+YDtcblx0fVxuXHR1bmxvY2tTZWN0aW9uLmlubmVySFRNTCA9IG5leHRIdG1sO1xuXHRjb25zdCBwcm9kdWN0U2VjdGlvbiA9IHByb2R1Y3Rpb24ucHJvZHVjdFNlY3Rpb24gPz89ICgoKSA9PiB7XG5cdFx0Y29uc3QgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnVpbGRpbmctc2VjdGlvblwiKSBhcyBCdWlsZGluZ1NlY3Rpb247XG5cdFx0cGFuZWwuYXBwZW5kQ2hpbGQoZWwpO1xuXHRcdHJldHVybiBlbDtcblx0fSkoKTtcblx0aWYgKGJsZEtleSAhPT0gbnVsbCAmJiBwcm9kdWN0U2VjdGlvbi5nZXRBdHRyaWJ1dGUoXCJibGRcIikgIT09IGJsZEtleSkgcHJvZHVjdFNlY3Rpb24uYmxkID0gYmxkS2V5O1xuXHRwcm9kdWN0U2VjdGlvbi5yZWZyZXNoKCk7XG5cdGNvbnN0IGNoYWluU2VjdGlvbiA9IHByb2R1Y3Rpb24uY2hhaW5TZWN0aW9uID8/PSAoKCkgPT4ge1xuXHRcdGNvbnN0IGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTtcblx0XHRlbC5jbGFzc05hbWUgPSBcImNoYWluLW92ZXJ2aWV3XCI7XG5cdFx0cGFuZWwuYXBwZW5kQ2hpbGQoZWwpO1xuXHRcdHJldHVybiBlbDtcblx0fSkoKTtcblx0Y2hhaW5TZWN0aW9uLmlubmVySFRNTCA9IHJlbmRlckNoYWluT3ZlcnZpZXcoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlck1hcmtldFNlY3Rpb24oKTogdm9pZCB7XG5cdGNvbnN0IG1hcmtldCA9IGd1aVN0YXRlLm1hcmtldDtcblx0Y29uc3QgbWFya2V0U2VjdGlvbiA9IG1hcmtldC5tYXJrZXRTZWN0aW9uID8/PSAoKCkgPT4ge1xuXHRcdGNvbnN0IHBhbmVsID0gbWFya2V0LnBhbmVsID8/PSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhbmVsLW1hcmtldFwiKTtcblx0XHRpZiAoIXBhbmVsKSByZXR1cm4gbnVsbDtcblx0XHRjb25zdCBzZWN0aW9uID0gbmV3IE1hcmtldFNlY3Rpb24oKTtcblx0XHRwYW5lbC5yZXBsYWNlQ2hpbGRyZW4oc2VjdGlvbik7XG5cdFx0cmV0dXJuIHNlY3Rpb247XG5cdH0pKCk7XG5cdGlmICghbWFya2V0U2VjdGlvbikgcmV0dXJuO1xuXHRtYXJrZXRTZWN0aW9uLnJlZnJlc2goKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlbmRlclRyZWFzdXJlKCk6IHZvaWQge1xuXHRjb25zdCBjb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInRyZWFzdXJlLWNvbnRhaW5lclwiKTtcblx0aWYgKCFjb250YWluZXIpIHJldHVybjtcblx0aWYgKHN0YXRlLnRyZWFzdXJlLmFjdGl2ZVVudGlsID4gbm93KCkpIHtcblx0XHRpZiAoIWNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKFwiYnV0dG9uXCIpKSB7XG5cdFx0XHRjb25zdCBidG4gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiYnV0dG9uXCIpO1xuXHRcdFx0YnRuLmNsYXNzTmFtZSA9IFwidHJlYXN1cmUtYnRuXCI7XG5cdFx0XHRidG4uZGF0YXNldC5hY3Rpb24gPSBcIm9wZW4tdHJlYXN1cmVcIjtcblx0XHRcdGJ0bi50ZXh0Q29udGVudCA9IFwiT3BlbiBUcmVhc3VyZSBDaGVzdCFcIjtcblx0XHRcdGNvbnRhaW5lci5hcHBlbmRDaGlsZChidG4pO1xuXHRcdH1cblx0fSBlbHNlIGNvbnRhaW5lci5pbm5lckhUTUwgPSBcIlwiO1xufVxuXG4vLyBDYWxsZWQgYWZ0ZXIgYSBwcmVzdGlnZSByZXNldCBvciBhIG5ldyBnYW1lLiBUaGUgY2FjaGVkIG5vZGVzIGFyZSBkZXRhY2hlZCBhdCB0aGF0XG4vLyBwb2ludCwgc28gdGhleSBoYXZlIHRvIGJlIGRyb3BwZWQgb3IgdGhlIHByb2R1Y3Rpb24gcGFuZWwgcmVuZGVycyBpbnRvIG5vdGhpbmcuXG5leHBvcnQgZnVuY3Rpb24gcmVzZXRQcm9kdWN0aW9uUGFuZWwoKTogdm9pZCB7XG5cdGNvbnN0IHNlbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiYnVpbGRpbmctc2VsZWN0XCIpIGFzIEhUTUxTZWxlY3RFbGVtZW50IHwgbnVsbDtcblx0aWYgKHNlbCkge1xuXHRcdHNlbC5pbm5lckhUTUwgPSBcIlwiO1xuXHRcdGFkZEJ1aWxkaW5nT3B0aW9uKFwibHVtYmVyX3lhcmRcIik7XG5cdFx0c2VsLnZhbHVlID0gXCJsdW1iZXJfeWFyZFwiO1xuXHR9XG5cdGNvbnN0IHBhbmVsID0gZ3VpU3RhdGUucHJvZHVjdGlvbi5wYW5lbCA/PyBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBhbmVsLXByb2R1Y3Rpb25cIik7XG5cdGlmIChwYW5lbCkgcGFuZWwuaW5uZXJIVE1MID0gXCJcIjtcblx0Z3VpU3RhdGUucHJvZHVjdGlvbiA9IHsgcGFuZWw6IG51bGwsIHVubG9ja1NlY3Rpb246IG51bGwsIHByb2R1Y3RTZWN0aW9uOiBudWxsLCBjaGFpblNlY3Rpb246IG51bGwgfTtcbn1cbiIsICJpbXBvcnQgeyBzdGF0ZSB9IGZyb20gXCIuLi9jb3JlL3N0YXRlLnRzXCI7XG5pbXBvcnQgeyBjb21wdXRlUHJlc3RpZ2VTdW1tYXJ5IH0gZnJvbSBcIi4uL2NvcmUvcHJlc3RpZ2UudHNcIjtcbmltcG9ydCB7IGFubm91bmNlIH0gZnJvbSBcIi4uL2NvcmUvZXZlbnRzLnRzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiBzaG93VmljdG9yeVNjcmVlbigpOiB2b2lkIHtcblx0Y29uc3QgZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInZpY3Rvcnktb3ZlcmxheVwiKTtcblx0aWYgKCFlbCkgcmV0dXJuO1xuXHRjb25zdCBydW5zID0gc3RhdGUucHJlc3RpZ2UucnVucztcblx0Y29uc3QgdG90YWxHb2xkID0gTWF0aC5mbG9vcihzdGF0ZS5wcmVzdGlnZS5hY2N1bXVsYXRlZFN0YXRzLmdvbGRFYXJuZWQgKyBzdGF0ZS5zdGF0cy5nb2xkRWFybmVkKTtcblx0Y29uc3QgdmljdG9yaWVzID0gc3RhdGUucHJlc3RpZ2UudmljdG9yeUNvdW50ID8/IDA7XG5cdGNvbnN0IGJvbnVzZXMgPSBjb21wdXRlUHJlc3RpZ2VTdW1tYXJ5KCk7XG5cdGNvbnN0IHN0YXRzTGluZXM6IChzdHJpbmcgfCBudWxsKVtdID0gW1xuXHRcdGBQcmVzdGlnZSBSdW5zOiAke3J1bnMudG9Mb2NhbGVTdHJpbmcoKX1gLFxuXHRcdGBUb3RhbCBHb2xkIEVhcm5lZDogJHt0b3RhbEdvbGQudG9Mb2NhbGVTdHJpbmcoKX1gLFxuXHRcdHZpY3RvcmllcyA+IDAgPyBgVGltZXMgQ29ucXVlcmVkOiAke3ZpY3Rvcmllcy50b0xvY2FsZVN0cmluZygpfWAgOiBudWxsLFxuXHRdLmZpbHRlcihCb29sZWFuKTtcblx0Y29uc3QgYm9udXNlc0h0bWwgPSBib251c2VzLmxlbmd0aCA+IDBcblx0XHQ/IGA8ZGl2PlxuXHRcdFx0PHAgY2xhc3M9XCJ2aWN0b3J5LWJvbnVzZXMtdGl0bGVcIj5QZXJtYW5lbnQgQm9udXNlcyBFYXJuZWQ8L3A+XG5cdFx0XHQ8dWwgY2xhc3M9XCJ2aWN0b3J5LWJvbnVzLWxpc3RcIj4ke2JvbnVzZXMubWFwKChiKSA9PiBgPGxpPiR7Yn08L2xpPmApLmpvaW4oXCJcIil9PC91bD5cblx0XHQ8L2Rpdj5gXG5cdFx0OiBcIlwiO1xuXHRlbC5pbm5lckhUTUwgPSBgXG5cdFx0PGRpdiBpZD1cInZpY3RvcnktY29udGVudFwiPlxuXHRcdFx0PGgyIGlkPVwidmljdG9yeS10aXRsZVwiPkVtcGlyZSBDb21wbGV0ZSE8L2gyPlxuXHRcdFx0PHAgY2xhc3M9XCJ2aWN0b3J5LXN1YnRpdGxlXCI+RnJvbSBodW1ibGUgbG9ncyB0byBtaWdodHkgZHJlYWRub3VnaHRzLCB5b3UgaGF2ZSBmb3JnZWQgYW4gaW5kdXN0cmlhbCBsZWdhY3kgdGhhdCBzcGFucyB0aGUgYWdlcy4gVGhlIHdvcmxkIGJvd3MgdG8geW91ciBjcmFmdC48L3A+XG5cdFx0XHQ8ZGl2IGNsYXNzPVwidmljdG9yeS1zdGF0c1wiPiR7c3RhdHNMaW5lcy5tYXAoKHMpID0+IGA8cD4ke3N9PC9wPmApLmpvaW4oXCJcIil9PC9kaXY+XG5cdFx0XHQke2JvbnVzZXNIdG1sfVxuXHRcdFx0PGRpdiBjbGFzcz1cInZpY3RvcnktYWN0aW9uc1wiPlxuXHRcdFx0XHQ8YnV0dG9uIGNsYXNzPVwidmljdG9yeS1rZWVwLWJ0blwiIGRhdGEtYWN0aW9uPVwidmljdG9yeS1rZWVwLXBsYXlpbmdcIj5LZWVwIFBsYXlpbmc8L2J1dHRvbj5cblx0XHRcdFx0PGJ1dHRvbiBjbGFzcz1cInZpY3RvcnktbmV3LWdhbWUtYnRuXCIgZGF0YS1hY3Rpb249XCJ2aWN0b3J5LW5ldy1nYW1lXCI+TmV3IExlZ2FjeTwvYnV0dG9uPlxuXHRcdFx0PC9kaXY+XG5cdFx0PC9kaXY+XG5cdGA7XG5cdGVsLmhpZGRlbiA9IGZhbHNlO1xuXHRlbC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIltkYXRhLWFjdGlvbj0ndmljdG9yeS1uZXctZ2FtZSddXCIpPy5mb2N1cygpO1xuXHRhbm5vdW5jZShcIlZpY3RvcnkhIFlvdSBoYXZlIGNvbnF1ZXJlZCBhbGwgY2hhbGxlbmdlcyBhbmQgYnVpbHQgdGhlIG1pZ2h0aWVzdCBlbXBpcmUhXCIpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaGlkZVZpY3RvcnlTY3JlZW4oKTogdm9pZCB7XG5cdGNvbnN0IGVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJ2aWN0b3J5LW92ZXJsYXlcIik7XG5cdGlmIChlbCkgZWwuaGlkZGVuID0gdHJ1ZTtcbn1cbiIsICJpbXBvcnQgeyBSRVNPVVJDRVMgfSBmcm9tIFwiLi4vY29udGVudC9yZXNvdXJjZXMudHNcIjtcbmltcG9ydCB7IEJVSUxESU5HUyB9IGZyb20gXCIuLi9jb250ZW50L2J1aWxkaW5ncy50c1wiO1xuaW1wb3J0IHsgcnVudGltZSwgc3RhdGUgfSBmcm9tIFwiLi9zdGF0ZS50c1wiO1xuaW1wb3J0IHsgTUFOVUFMX0NMSUNLX1BST0dSRVNTIH0gZnJvbSBcIi4vY29uc3RhbnRzLnRzXCI7XG5pbXBvcnQge1xuXHRidWlsZENvc3QsXG5cdGJ1aWxkaW5nUHJlcmVxTWV0LFxuXHRjdXJyZW50UHJpY2UsXG5cdGdldFByb2R1Y3Rpb25PdmVydmlldyxcblx0Z2V0VHJlYXN1cmVCYXNlVmFsdWUsXG5cdG5leHRTbG90Q29zdCxcblx0cHJlc3RpZ2VUcmVhc3VyZU11bHQsXG5cdHNsb3RSZWZ1bmQsXG5cdHN0b3JhZ2VNYXgsXG5cdHN0b3JhZ2VVcGdyYWRlQ29zdCxcblx0dG90YWxJdGVtcyxcblx0dW5sb2NrQ29zdCxcbn0gZnJvbSBcIi4vZWNvbm9teS50c1wiO1xuaW1wb3J0IHsgZm9ybWF0SW5wdXRzLCBmb3JtYXRSZXNvdXJjZU5hbWUgfSBmcm9tIFwiLi9mb3JtYXQudHNcIjtcbmltcG9ydCB7IGFubm91bmNlLCBlbWl0LCByZXF1ZXN0UmVuZGVyIH0gZnJvbSBcIi4vZXZlbnRzLnRzXCI7XG5pbXBvcnQgeyBzYXZlIH0gZnJvbSBcIi4vc2F2ZS50c1wiO1xuaW1wb3J0IHsgbm93IH0gZnJvbSBcIi4vY2xvY2sudHNcIjtcbmltcG9ydCB7IGVudHJpZXMsIGtleXMgfSBmcm9tIFwiLi91dGlsLnRzXCI7XG5pbXBvcnQgeyByZWNvcmQgfSBmcm9tIFwiLi9qb3VybmFsLnRzXCI7XG5pbXBvcnQgdHlwZSB7IFByb2R1Y3RLZXksIFJlc291cmNlS2V5IH0gZnJvbSBcIi4vdHlwZXMudHNcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIHVubG9ja0J1aWxkaW5nKGJsZEtleTogc3RyaW5nKTogdm9pZCB7XG5cdHJlY29yZChcImJ1aWxkXCIsIGJsZEtleSk7XG5cdGNvbnN0IGNmZyA9IEJVSUxESU5HU1tibGRLZXldO1xuXHRjb25zdCBic3QgPSBzdGF0ZS5idWlsZGluZ3NbYmxkS2V5XTtcblx0aWYgKGJzdC51bmxvY2tlZCkgcmV0dXJuO1xuXHRpZiAoIWJ1aWxkaW5nUHJlcmVxTWV0KGJsZEtleSkpIHJldHVybjtcblx0Y29uc3QgY29zdCA9IGJ1aWxkQ29zdChibGRLZXkpO1xuXHRpZiAoc3RhdGUuZ29sZCA8IGNvc3QpIHtcblx0XHRhbm5vdW5jZShgTmVlZCAke2Nvc3QudG9Mb2NhbGVTdHJpbmcoKX0gZ29sZCB0byBidWlsZCAke2NmZy5sYWJlbH0uYCk7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHN0YXRlLmdvbGQgLT0gY29zdDtcblx0YnN0LnVubG9ja2VkID0gdHJ1ZTtcblx0Zm9yIChjb25zdCBbcGssIHBjZmddIG9mIGVudHJpZXMoY2ZnLnByb2R1Y3RzKSkge1xuXHRcdGlmIChwY2ZnLnVubG9ja0Nvc3QgPT09IDAgJiYgIXBjZmcucHJlcmVxUHJvZHVjdCkgYnN0LnByb2R1Y3RzW3BrXS51bmxvY2tlZCA9IHRydWU7XG5cdH1cblx0YW5ub3VuY2UoYCR7Y2ZnLmxhYmVsfSBidWlsdCFgKTtcblx0ZW1pdChcImJ1aWxkaW5nOmJ1aWx0XCIsIGJsZEtleSk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1bmxvY2tQcm9kdWN0KGJsZEtleTogc3RyaW5nLCBwcm9kdWN0S2V5OiBQcm9kdWN0S2V5KTogdm9pZCB7XG5cdHJlY29yZChcInVubG9ja1wiLCBibGRLZXksIHByb2R1Y3RLZXkpO1xuXHRjb25zdCBwY2ZnID0gQlVJTERJTkdTW2JsZEtleV0ucHJvZHVjdHNbcHJvZHVjdEtleV07XG5cdGNvbnN0IHBzdCA9IHN0YXRlLmJ1aWxkaW5nc1tibGRLZXldLnByb2R1Y3RzW3Byb2R1Y3RLZXldO1xuXHRpZiAocHN0LnVubG9ja2VkKSByZXR1cm47XG5cdGlmIChwY2ZnLnByZXJlcVByb2R1Y3QgJiYgIXN0YXRlLmJ1aWxkaW5nc1tibGRLZXldLnByb2R1Y3RzW3BjZmcucHJlcmVxUHJvZHVjdF0udW5sb2NrZWQpIHJldHVybjtcblx0Y29uc3QgY29zdCA9IHVubG9ja0Nvc3QoYmxkS2V5LCBwcm9kdWN0S2V5KTtcblx0aWYgKHN0YXRlLmdvbGQgPCBjb3N0KSB7XG5cdFx0YW5ub3VuY2UoYE5lZWQgJHtjb3N0LnRvTG9jYWxlU3RyaW5nKCl9IGdvbGQgdG8gdW5sb2NrICR7UkVTT1VSQ0VTW3BjZmcub3V0cHV0S2V5XS5sYWJlbH0gcHJvZHVjdGlvbi5gKTtcblx0XHRyZXR1cm47XG5cdH1cblx0c3RhdGUuZ29sZCAtPSBjb3N0O1xuXHRwc3QudW5sb2NrZWQgPSB0cnVlO1xuXHRhbm5vdW5jZShgJHtSRVNPVVJDRVNbcGNmZy5vdXRwdXRLZXldLmxhYmVsfSBwcm9kdWN0aW9uIHVubG9ja2VkIWApO1xuXHRlbWl0KFwicHJvZHVjdDp1bmxvY2tlZFwiLCB7IGJsZEtleSwgcHJvZHVjdEtleSB9KTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGFkZFNsb3QoYmxkS2V5OiBzdHJpbmcsIHByb2R1Y3RLZXk6IFByb2R1Y3RLZXkpOiB2b2lkIHtcblx0cmVjb3JkKFwiYWRkU2xvdFwiLCBibGRLZXksIHByb2R1Y3RLZXkpO1xuXHRjb25zdCBwc3QgPSBzdGF0ZS5idWlsZGluZ3NbYmxkS2V5XS5wcm9kdWN0c1twcm9kdWN0S2V5XTtcblx0aWYgKCFwc3QudW5sb2NrZWQpIHJldHVybjtcblx0Y29uc3QgY29zdCA9IG5leHRTbG90Q29zdChibGRLZXksIHByb2R1Y3RLZXkpO1xuXHRpZiAoc3RhdGUuZ29sZCA8IGNvc3QpIHtcblx0XHRhbm5vdW5jZShgTmVlZCAke2Nvc3QudG9Mb2NhbGVTdHJpbmcoKX0gZ29sZCB0byBhZGQgYSBzbG90LmApO1xuXHRcdHJldHVybjtcblx0fVxuXHRzdGF0ZS5nb2xkIC09IGNvc3Q7XG5cdHBzdC5zbG90cy5wdXNoKHsgaWQ6ICsrcnVudGltZS5uZXh0U2xvdElkLCBwcm9ncmVzczogMC4wIH0pO1xuXHRjb25zdCBsYWJlbCA9IFJFU09VUkNFU1tCVUlMRElOR1NbYmxkS2V5XS5wcm9kdWN0c1twcm9kdWN0S2V5XS5vdXRwdXRLZXldLmxhYmVsO1xuXHRhbm5vdW5jZShgU2xvdCBhZGRlZC4gJHtsYWJlbH0gbm93IGhhcyAke3BzdC5zbG90cy5sZW5ndGgudG9Mb2NhbGVTdHJpbmcoKX0gc2xvdCR7cHN0LnNsb3RzLmxlbmd0aCA9PT0gMSA/IFwiXCIgOiBcInNcIn0uYCk7XG5cdHJlcXVlc3RSZW5kZXIoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGxTbG90KGJsZEtleTogc3RyaW5nLCBwcm9kdWN0S2V5OiBQcm9kdWN0S2V5KTogdm9pZCB7XG5cdHJlY29yZChcInNlbGxTbG90XCIsIGJsZEtleSwgcHJvZHVjdEtleSk7XG5cdGNvbnN0IHBzdCA9IHN0YXRlLmJ1aWxkaW5nc1tibGRLZXldLnByb2R1Y3RzW3Byb2R1Y3RLZXldO1xuXHRpZiAocHN0LnNsb3RzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHRjb25zdCByZWZ1bmQgPSBzbG90UmVmdW5kKGJsZEtleSwgcHJvZHVjdEtleSk7XG5cdHBzdC5zbG90cy5wb3AoKTtcblx0aWYgKHBzdC5zbG90cy5sZW5ndGggPT09IDApIGRlbGV0ZSBydW50aW1lLnN0YWxsQW5ub3VuY2VkW2Ake2JsZEtleX0tJHtwcm9kdWN0S2V5fWBdO1xuXHRzdGF0ZS5nb2xkICs9IHJlZnVuZDtcblx0Y29uc3QgbGFiZWwgPSBSRVNPVVJDRVNbQlVJTERJTkdTW2JsZEtleV0ucHJvZHVjdHNbcHJvZHVjdEtleV0ub3V0cHV0S2V5XS5sYWJlbDtcblx0YW5ub3VuY2UoYFNsb3Qgc29sZCBmb3IgJHtyZWZ1bmQudG9Mb2NhbGVTdHJpbmcoKX0gZ29sZC4gJHtsYWJlbH0gbm93IGhhcyAke3BzdC5zbG90cy5sZW5ndGgudG9Mb2NhbGVTdHJpbmcoKX0gc2xvdCR7cHN0LnNsb3RzLmxlbmd0aCA9PT0gMSA/IFwiXCIgOiBcInNcIn0uYCk7XG5cdHJlcXVlc3RSZW5kZXIoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIG1hbnVhbFByb2R1Y2UoYmxkS2V5OiBzdHJpbmcsIHByb2R1Y3RLZXk6IFByb2R1Y3RLZXkpOiB2b2lkIHtcblx0cmVjb3JkKFwibWFudWFsXCIsIGJsZEtleSwgcHJvZHVjdEtleSk7XG5cdGNvbnN0IHBjZmcgPSBCVUlMRElOR1NbYmxkS2V5XS5wcm9kdWN0c1twcm9kdWN0S2V5XTtcblx0Y29uc3QgcHN0ID0gc3RhdGUuYnVpbGRpbmdzW2JsZEtleV0ucHJvZHVjdHNbcHJvZHVjdEtleV07XG5cdGlmIChwc3QubWFudWFsLmFjdGl2ZSkge1xuXHRcdHBzdC5tYW51YWwucHJvZ3Jlc3MgKz0gTUFOVUFMX0NMSUNLX1BST0dSRVNTO1xuXHRcdHJldHVybjtcblx0fVxuXHRjb25zdCBpbnB1dHMgPSBwY2ZnLmlucHV0cyBhcyBSZWNvcmQ8UmVzb3VyY2VLZXksIG51bWJlcj47XG5cdGNvbnN0IGlucHV0U3VtID0gT2JqZWN0LnZhbHVlcyhpbnB1dHMpLnJlZHVjZSgoczogbnVtYmVyLCBuOiBudW1iZXIpID0+IHMgKyBuLCAwKTtcblx0Y29uc3QgbmV0Q2hhbmdlID0gcGNmZy5vdXRwdXRBbXQgLSBpbnB1dFN1bTtcblx0aWYgKG5ldENoYW5nZSA+IDAgJiYgdG90YWxJdGVtcygpICsgbmV0Q2hhbmdlID4gc3RvcmFnZU1heCgpKSB7XG5cdFx0YW5ub3VuY2UoXCJTdG9yYWdlIGlzIGZ1bGwuXCIpO1xuXHRcdHJldHVybjtcblx0fVxuXHRmb3IgKGNvbnN0IFtpbnB1dEtleSwgaW5wdXRBbXRdIG9mIGVudHJpZXMoaW5wdXRzKSkge1xuXHRcdGlmIChzdGF0ZS5pbnZlbnRvcnlbaW5wdXRLZXldIDwgaW5wdXRBbXQpIHtcblx0XHRcdGFubm91bmNlKGBOZWVkICR7Zm9ybWF0SW5wdXRzKHBjZmcuaW5wdXRzKX0uYCk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHR9XG5cdHBzdC5tYW51YWwuYWN0aXZlID0gdHJ1ZTtcblx0cHN0Lm1hbnVhbC5wcm9ncmVzcyA9IDA7XG5cdGFubm91bmNlKFwiQ3JhZnRpbmcgc3RhcnRlZC5cIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiB1cGdyYWRlU3RvcmFnZSgpOiB2b2lkIHtcblx0cmVjb3JkKFwic3RvcmFnZVwiKTtcblx0Y29uc3QgY29zdCA9IHN0b3JhZ2VVcGdyYWRlQ29zdCgpO1xuXHRpZiAoc3RhdGUuZ29sZCA8IGNvc3QpIHtcblx0XHRhbm5vdW5jZShgTmVlZCAke2Nvc3QudG9Mb2NhbGVTdHJpbmcoKX0gZ29sZCB0byBleHBhbmQgc3RvcmFnZS5gKTtcblx0XHRyZXR1cm47XG5cdH1cblx0c3RhdGUuZ29sZCAtPSBjb3N0O1xuXHRzdGF0ZS5zdG9yYWdlLnRpZXIrKztcblx0YW5ub3VuY2UoYFN0b3JhZ2UgZXhwYW5kZWQgdG8gJHtzdG9yYWdlTWF4KCkudG9Mb2NhbGVTdHJpbmcoKX0gaXRlbXMuYCk7XG5cdHJlcXVlc3RSZW5kZXIoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGxBbGwoKTogdm9pZCB7XG5cdHJlY29yZChcInNlbGxBbGxcIik7XG5cdGNvbnN0IHJlc291cmNlcyA9IGtleXMoUkVTT1VSQ0VTKS5maWx0ZXIoKGspID0+IHN0YXRlLmludmVudG9yeVtrXSA+IDApO1xuXHRpZiAocmVzb3VyY2VzLmxlbmd0aCA9PT0gMCkgcmV0dXJuO1xuXHRsZXQgdG90YWxFYXJuZWQgPSAwO1xuXHRmb3IgKGNvbnN0IGsgb2YgcmVzb3VyY2VzKSB7XG5cdFx0Y29uc3QgcXR5ID0gc3RhdGUuaW52ZW50b3J5W2tdO1xuXHRcdGNvbnN0IGVhcm5lZCA9IHF0eSAqIGN1cnJlbnRQcmljZShrKTtcblx0XHR0b3RhbEVhcm5lZCArPSBlYXJuZWQ7XG5cdFx0c3RhdGUuc3RhdHMuc29sZEJ5UmVzb3VyY2Vba10gPSAoc3RhdGUuc3RhdHMuc29sZEJ5UmVzb3VyY2Vba10gPz8gMCkgKyBxdHk7XG5cdFx0c3RhdGUuaW52ZW50b3J5W2tdID0gMDtcblx0fVxuXHRzdGF0ZS5zdGF0cy5nb2xkRWFybmVkICs9IHRvdGFsRWFybmVkO1xuXHRzdGF0ZS5nb2xkICs9IHRvdGFsRWFybmVkO1xuXHRhbm5vdW5jZShgU29sZCBldmVyeXRoaW5nIGZvciAke3RvdGFsRWFybmVkLnRvTG9jYWxlU3RyaW5nKCl9IGdvbGQuYCk7XG5cdHJlcXVlc3RSZW5kZXIoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHNlbGxQcm9kdWN0KHJlc291cmNlS2V5OiBSZXNvdXJjZUtleSk6IHZvaWQge1xuXHRyZWNvcmQoXCJzZWxsXCIsIHJlc291cmNlS2V5KTtcblx0Y29uc3QgaW52ID0gc3RhdGUuaW52ZW50b3J5W3Jlc291cmNlS2V5XTtcblx0aWYgKGludiA8PSAwKSByZXR1cm47XG5cdGNvbnN0IGVhcm5lZCA9IGludiAqIGN1cnJlbnRQcmljZShyZXNvdXJjZUtleSk7XG5cdHN0YXRlLmludmVudG9yeVtyZXNvdXJjZUtleV0gPSAwO1xuXHRzdGF0ZS5zdGF0cy5zb2xkQnlSZXNvdXJjZVtyZXNvdXJjZUtleV0gPSAoc3RhdGUuc3RhdHMuc29sZEJ5UmVzb3VyY2VbcmVzb3VyY2VLZXldID8/IDApICsgaW52O1xuXHRzdGF0ZS5zdGF0cy5nb2xkRWFybmVkICs9IGVhcm5lZDtcblx0c3RhdGUuZ29sZCArPSBlYXJuZWQ7XG5cdGFubm91bmNlKGBTb2xkICR7aW52LnRvTG9jYWxlU3RyaW5nKCl9ICR7Zm9ybWF0UmVzb3VyY2VOYW1lKHJlc291cmNlS2V5LCBpbnYpfSBmb3IgJHtlYXJuZWQudG9Mb2NhbGVTdHJpbmcoKX0gZ29sZC5gKTtcblx0cmVxdWVzdFJlbmRlcigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gdG9nZ2xlUHJvZHVjdEVuYWJsZWQoYmxkS2V5OiBzdHJpbmcsIHByb2R1Y3RLZXk6IFByb2R1Y3RLZXkpOiB2b2lkIHtcblx0cmVjb3JkKFwidG9nZ2xlXCIsIGJsZEtleSwgcHJvZHVjdEtleSk7XG5cdGNvbnN0IHBzdCA9IHN0YXRlLmJ1aWxkaW5nc1tibGRLZXldLnByb2R1Y3RzW3Byb2R1Y3RLZXldO1xuXHRpZiAoIXBzdC51bmxvY2tlZCkgcmV0dXJuO1xuXHRwc3QuZW5hYmxlZCA9ICFwc3QuZW5hYmxlZDtcblx0aWYgKCFwc3QuZW5hYmxlZCkge1xuXHRcdHBzdC5tYW51YWwuYWN0aXZlID0gZmFsc2U7XG5cdFx0cHN0Lm1hbnVhbC5wcm9ncmVzcyA9IDA7XG5cdH1cblx0Y29uc3Qgb3V0cHV0S2V5ID0gQlVJTERJTkdTW2JsZEtleV0ucHJvZHVjdHNbcHJvZHVjdEtleV0ub3V0cHV0S2V5O1xuXHRhbm5vdW5jZShgJHtSRVNPVVJDRVNbb3V0cHV0S2V5XS5sYWJlbH0gcHJvZHVjdGlvbiAke3BzdC5lbmFibGVkID8gXCJyZXN1bWVkXCIgOiBcInBhdXNlZFwifS5gKTtcblx0cmVxdWVzdFJlbmRlcigpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gb3BlblRyZWFzdXJlKCk6IHZvaWQge1xuXHRyZWNvcmQoXCJ0cmVhc3VyZVwiKTtcblx0aWYgKCFzdGF0ZS50cmVhc3VyZS5hY3RpdmVVbnRpbCB8fCBub3coKSA+IHN0YXRlLnRyZWFzdXJlLmFjdGl2ZVVudGlsKSByZXR1cm47XG5cdGNvbnN0IGFtb3VudCA9IE1hdGgucm91bmQoZ2V0VHJlYXN1cmVCYXNlVmFsdWUoKSAqIHByZXN0aWdlVHJlYXN1cmVNdWx0KCkpO1xuXHRzdGF0ZS5nb2xkICs9IGFtb3VudDtcblx0c3RhdGUuc3RhdHMuZ29sZEVhcm5lZCArPSBhbW91bnQ7XG5cdHN0YXRlLnN0YXRzLnRyZWFzdXJlQ2hlc3RzT3BlbmVkKys7XG5cdHN0YXRlLnRyZWFzdXJlLmFjdGl2ZVVudGlsID0gMDtcblx0YW5ub3VuY2UoYE9wZW5lZCB0cmVhc3VyZSBjaGVzdCBmb3IgJHthbW91bnQudG9Mb2NhbGVTdHJpbmcoKX0gZ29sZCFgKTtcblx0cmVxdWVzdFJlbmRlcigpO1xufVxuXG4vLyBBdXRvcGxheSBoZWxwZXIga2VwdCBmcm9tIHRoZSBvcmlnaW5hbCBidWlsZC4gUGhhc2UgMSByZW1vdmVzIGl0IG9yIG1vdmVzIGl0XG4vLyBiZWhpbmQgbGF0ZSBnYW1lIHJlc2VhcmNoLCBiZWNhdXNlIGl0IG1ha2VzIHRoZSBwdXJjaGFzZSBkZWNpc2lvbiBmb3IgdGhlIHBsYXllci5cbmV4cG9ydCBmdW5jdGlvbiBkb0ZpeEJvdHRsZW5lY2soKTogdm9pZCB7XG5cdHJlY29yZChcImZpeEJvdHRsZW5lY2tcIik7XG5cdGxldCB0b3RhbEJvdWdodCA9IDA7XG5cdGZvciAobGV0IGkgPSAwOyBpIDwgNTAwOyBpKyspIHtcblx0XHRjb25zdCB7IGRlZmljaXRzIH0gPSBnZXRQcm9kdWN0aW9uT3ZlcnZpZXcoKTtcblx0XHRpZiAoZGVmaWNpdHMubGVuZ3RoID09PSAwKSBicmVhaztcblx0XHRsZXQgYm91Z2h0ID0gZmFsc2U7XG5cdFx0Zm9yIChjb25zdCBkZWZpY2l0IG9mIGRlZmljaXRzKSB7XG5cdFx0XHRsZXQgZm91bmRCbGQ6IHN0cmluZyB8IG51bGwgPSBudWxsO1xuXHRcdFx0bGV0IGZvdW5kUHJvZDogUHJvZHVjdEtleSB8IG51bGwgPSBudWxsO1xuXHRcdFx0b3V0ZXI6IGZvciAoY29uc3QgW2JrLCBic3RdIG9mIGVudHJpZXMoc3RhdGUuYnVpbGRpbmdzKSkge1xuXHRcdFx0XHRpZiAoIWJzdC51bmxvY2tlZCkgY29udGludWU7XG5cdFx0XHRcdGZvciAoY29uc3QgW3BrLCBwY2ZnXSBvZiBlbnRyaWVzKEJVSUxESU5HU1tia10ucHJvZHVjdHMpKSB7XG5cdFx0XHRcdFx0aWYgKGJzdC5wcm9kdWN0c1twa10udW5sb2NrZWQgJiYgcGNmZy5vdXRwdXRLZXkgPT09IGRlZmljaXQucmVzb3VyY2VLZXkpIHtcblx0XHRcdFx0XHRcdGZvdW5kQmxkID0gYms7XG5cdFx0XHRcdFx0XHRmb3VuZFByb2QgPSBwaztcblx0XHRcdFx0XHRcdGJyZWFrIG91dGVyO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdFx0aWYgKCFmb3VuZEJsZCB8fCAhZm91bmRQcm9kKSBjb250aW51ZTtcblx0XHRcdGNvbnN0IGNvc3QgPSBuZXh0U2xvdENvc3QoZm91bmRCbGQsIGZvdW5kUHJvZCk7XG5cdFx0XHRpZiAoc3RhdGUuZ29sZCA8IGNvc3QpIGNvbnRpbnVlO1xuXHRcdFx0c3RhdGUuZ29sZCAtPSBjb3N0O1xuXHRcdFx0c3RhdGUuYnVpbGRpbmdzW2ZvdW5kQmxkXS5wcm9kdWN0c1tmb3VuZFByb2RdLnNsb3RzLnB1c2goeyBpZDogKytydW50aW1lLm5leHRTbG90SWQsIHByb2dyZXNzOiAwLjAgfSk7XG5cdFx0XHR0b3RhbEJvdWdodCsrO1xuXHRcdFx0Ym91Z2h0ID0gdHJ1ZTtcblx0XHRcdGJyZWFrO1xuXHRcdH1cblx0XHRpZiAoIWJvdWdodCkgYnJlYWs7XG5cdH1cblx0aWYgKHRvdGFsQm91Z2h0ID4gMCkge1xuXHRcdHNhdmUoKTtcblx0XHRyZXF1ZXN0UmVuZGVyKCk7XG5cdFx0YW5ub3VuY2UoYEJvdWdodCAke3RvdGFsQm91Z2h0fSBzbG90JHt0b3RhbEJvdWdodCA9PT0gMSA/IFwiXCIgOiBcInNcIn0gdG8gZml4IHByb2R1Y3Rpb24gYm90dGxlbmVja3MuYCk7XG5cdH0gZWxzZSBhbm5vdW5jZShcIk5vdCBlbm91Z2ggZ29sZCB0byBmaXggYW55IGJvdHRsZW5lY2suXCIpO1xufVxuIiwgImltcG9ydCB7IGZyZXNoU3RhdGUsIHNldFN0YXRlLCBzdGF0ZSB9IGZyb20gXCIuLi9jb3JlL3N0YXRlLnRzXCI7XG5pbXBvcnQgeyBjbGVhclNhdmUsIHNhdmUsIHdyaXRlUmF3U2F2ZSB9IGZyb20gXCIuLi9jb3JlL3NhdmUudHNcIjtcbmltcG9ydCB7IGFubm91bmNlIH0gZnJvbSBcIi4uL2NvcmUvZXZlbnRzLnRzXCI7XG5pbXBvcnQgeyBlbnRyeUNvdW50LCBnZXRSZWNvcmRpbmcgfSBmcm9tIFwiLi4vY29yZS9qb3VybmFsLnRzXCI7XG5cbmV4cG9ydCBmdW5jdGlvbiByZW5kZXJTZXR0aW5nc1NlY3Rpb24oKTogdm9pZCB7XG5cdGNvbnN0IHBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYW5lbC1zZXR0aW5nc1wiKTtcblx0aWYgKCFwYW5lbCkgcmV0dXJuO1xuXHRjb25zdCBzYXZlVGV4dCA9IGJ0b2EoSlNPTi5zdHJpbmdpZnkoc3RhdGUpKTtcblx0aWYgKHBhbmVsLmZpcnN0Q2hpbGQpIHtcblx0XHRjb25zdCB0YSA9IHBhbmVsLnF1ZXJ5U2VsZWN0b3I8SFRNTFRleHRBcmVhRWxlbWVudD4oXCIjc2F2ZS10ZXh0YXJlYVwiKTtcblx0XHRpZiAodGEgJiYgZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAhPT0gdGEpIHRhLnZhbHVlID0gc2F2ZVRleHQ7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdHBhbmVsLmlubmVySFRNTCA9IGA8c2VjdGlvbiBjbGFzcz1cInNldHRpbmdzLXNlY3Rpb25cIj5cblx0XHQ8aDM+U2F2ZTwvaDM+XG5cdFx0PGJ1dHRvbiBkYXRhLWFjdGlvbj1cInNhdmUtbm93XCIgc3R5bGU9XCJtYXJnaW4tYm90dG9tOnZhcigtLXNwYWNlLXNtKVwiPlNhdmUgTm93PC9idXR0b24+XG5cdFx0PHRleHRhcmVhIGlkPVwic2F2ZS10ZXh0YXJlYVwiIGNsYXNzPVwic2F2ZS10ZXh0YXJlYVwiIHJvd3M9XCI1XCIgc3BlbGxjaGVjaz1cImZhbHNlXCIgYXV0b2NvbXBsZXRlPVwib2ZmXCIgYXJpYS1sYWJlbD1cIlNhdmUgZGF0YVwiPiR7c2F2ZVRleHR9PC90ZXh0YXJlYT5cblx0XHQ8ZGl2IGNsYXNzPVwic2V0dGluZ3Mtcm93XCIgc3R5bGU9XCJtYXJnaW4tdG9wOnZhcigtLXNwYWNlLXNtKVwiPlxuXHRcdFx0PGJ1dHRvbiBkYXRhLWFjdGlvbj1cImltcG9ydC1zYXZlLXRleHRcIj5JbXBvcnQ8L2J1dHRvbj5cblx0XHRcdDxidXR0b24gZGF0YS1hY3Rpb249XCJjbGVhci1zYXZlXCI+Q2xlYXIgU2F2ZTwvYnV0dG9uPlxuXHRcdDwvZGl2PlxuXHQ8L3NlY3Rpb24+XG5cdDxzZWN0aW9uIGNsYXNzPVwic2V0dGluZ3Mtc2VjdGlvblwiPlxuXHRcdDxoMz5TZXNzaW9uIFJlY29yZGluZzwvaDM+XG5cdFx0PHAgY2xhc3M9XCJzZXR0aW5ncy1oaW50XCI+RXZlcnkgYWN0aW9uIHRoaXMgc2Vzc2lvbiBpcyBqb3VybmFsbGVkLiBFeHBvcnQgaXQgdG8gY2hlY2sgdGhlIGJhbGFuY2Ugc2ltdWxhdG9yIGFnYWluc3QgYSByZWFsIHBsYXl0aHJvdWdoLjwvcD5cblx0XHQ8YnV0dG9uIGRhdGEtYWN0aW9uPVwiZXhwb3J0LXJlY29yZGluZ1wiPkV4cG9ydCBSZWNvcmRpbmc8L2J1dHRvbj5cblx0PC9zZWN0aW9uPmA7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBzYXZlTm93KCk6IHZvaWQge1xuXHRzYXZlKCk7XG5cdGFubm91bmNlKFwiR2FtZSBzYXZlZC5cIik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBjbGVhclNhdmVEYXRhKCk6IHZvaWQge1xuXHRpZiAoIWNvbmZpcm0oXCJDbGVhciBhbGwgc2F2ZSBkYXRhIGFuZCBzdGFydCBvdmVyPyBUaGlzIHdpbGwgcmVzZXQgZXZlcnl0aGluZywgaW5jbHVkaW5nIHByZXN0aWdlIHJld2FyZHMuXCIpKSByZXR1cm47XG5cdGNsZWFyU2F2ZSgpO1xuXHRzZXRTdGF0ZShmcmVzaFN0YXRlKCkpO1xuXHRsb2NhdGlvbi5yZWxvYWQoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGltcG9ydFNhdmVGcm9tVGV4dCgpOiB2b2lkIHtcblx0Y29uc3QgdGV4dCA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNhdmUtdGV4dGFyZWFcIikgYXMgSFRNTFRleHRBcmVhRWxlbWVudCB8IG51bGwpPy52YWx1ZT8udHJpbSgpO1xuXHRpZiAoIXRleHQpIHtcblx0XHRhbm5vdW5jZShcIk5vdGhpbmcgdG8gaW1wb3J0LlwiKTtcblx0XHRyZXR1cm47XG5cdH1cblx0dHJ5IHtcblx0XHRjb25zdCBqc29uID0gYXRvYih0ZXh0KTtcblx0XHRjb25zdCBwYXJzZWQgPSBKU09OLnBhcnNlKGpzb24pO1xuXHRcdGlmIChwYXJzZWQgJiYgcGFyc2VkLnN0YXRlICYmIHBhcnNlZC5wcmVzdGlnZSkge1xuXHRcdFx0Y29uc3QgbWVyZ2VkID0geyAuLi5wYXJzZWQuc3RhdGUsIHByZXN0aWdlOiBwYXJzZWQucHJlc3RpZ2UgfTtcblx0XHRcdHdyaXRlUmF3U2F2ZShKU09OLnN0cmluZ2lmeShtZXJnZWQpKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0d3JpdGVSYXdTYXZlKGpzb24pO1xuXHRcdH1cblx0XHRhbm5vdW5jZShcIlNhdmUgaW1wb3J0ZWQuIFJlbG9hZGluZy4uLlwiKTtcblx0XHRzZXRUaW1lb3V0KCgpID0+IGxvY2F0aW9uLnJlbG9hZCgpLCA4MDApO1xuXHR9IGNhdGNoIHtcblx0XHRhbm5vdW5jZShcIkludmFsaWQgc2F2ZSBkYXRhLlwiKTtcblx0fVxufVxuXG4vLyBUaGUgcmVjb3JkaW5nIGNhcnJpZXMgdGhlIHN0YXRlIGl0IHN0YXJ0ZWQgZnJvbSwgZXZlcnl0aGluZyBkb25lIHNpbmNlLCBhbmQgdGhlIHN0YXRlXG4vLyByaWdodCBub3cuIFRoZSBzaW11bGF0b3IgcmVwbGF5cyB0aGUgbWlkZGxlIGFuZCBjb21wYXJlcyBhZ2FpbnN0IHRoZSBlbmQuXG5leHBvcnQgZnVuY3Rpb24gZXhwb3J0UmVjb3JkaW5nKCk6IHZvaWQge1xuXHRjb25zdCByZWNvcmRpbmcgPSBnZXRSZWNvcmRpbmcoKTtcblx0Y29uc3QgYm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzYXZlLXRleHRhcmVhXCIpIGFzIEhUTUxUZXh0QXJlYUVsZW1lbnQgfCBudWxsO1xuXHRpZiAoIXJlY29yZGluZyB8fCAhYm94KSB7XG5cdFx0YW5ub3VuY2UoXCJOb3RoaW5nIHJlY29yZGVkIHlldC5cIik7XG5cdFx0cmV0dXJuO1xuXHR9XG5cdGJveC52YWx1ZSA9IEpTT04uc3RyaW5naWZ5KHsgLi4ucmVjb3JkaW5nLCBlbmRTdGF0ZTogc3RhdGUsIGVuZGVkQXQ6IERhdGUubm93KCkgfSk7XG5cdGJveC5zZWxlY3QoKTtcblx0YW5ub3VuY2UoYFJlY29yZGluZyBvZiAke2VudHJ5Q291bnQoKS50b0xvY2FsZVN0cmluZygpfSBhY3Rpb25zIHJlYWR5IHRvIGNvcHkuYCk7XG59XG4iLCAiaW1wb3J0IHtcblx0YWRkU2xvdCxcblx0ZG9GaXhCb3R0bGVuZWNrLFxuXHRtYW51YWxQcm9kdWNlLFxuXHRvcGVuVHJlYXN1cmUsXG5cdHNlbGxBbGwsXG5cdHNlbGxQcm9kdWN0LFxuXHRzZWxsU2xvdCxcblx0dG9nZ2xlUHJvZHVjdEVuYWJsZWQsXG5cdHVubG9ja0J1aWxkaW5nLFxuXHR1bmxvY2tQcm9kdWN0LFxuXHR1cGdyYWRlU3RvcmFnZSxcbn0gZnJvbSBcIi4uL2NvcmUvYWN0aW9ucy50c1wiO1xuaW1wb3J0IHsgcmVyb2xsUXVlc3QgfSBmcm9tIFwiLi4vY29yZS9xdWVzdHMudHNcIjtcbmltcG9ydCB7IGFwcGx5UHJlc3RpZ2VSZXNldCwgZGlzbWlzc1ZpY3RvcnksIHByZXN0aWdlUmVzZXRTdW1tYXJ5LCB2aWN0b3J5TmV3R2FtZSB9IGZyb20gXCIuLi9jb3JlL3ByZXN0aWdlLnRzXCI7XG5pbXBvcnQgeyBjbGVhclNhdmVEYXRhLCBleHBvcnRSZWNvcmRpbmcsIGltcG9ydFNhdmVGcm9tVGV4dCwgcmVuZGVyU2V0dGluZ3NTZWN0aW9uLCBzYXZlTm93IH0gZnJvbSBcIi4vc2V0dGluZ3MudHNcIjtcbmltcG9ydCB7IGhpZGVWaWN0b3J5U2NyZWVuIH0gZnJvbSBcIi4vdmljdG9yeS50c1wiO1xuaW1wb3J0IHR5cGUgeyBSZXNvdXJjZUtleSB9IGZyb20gXCIuLi9jb3JlL3R5cGVzLnRzXCI7XG5cbmZ1bmN0aW9uIGNvbmZpcm1QcmVzdGlnZVJlc2V0KCk6IGJvb2xlYW4ge1xuXHRjb25zdCB7IHRvdGFsQWN0aXZlLCBjb21wbGV0ZWRDb3VudCwgaW5jb21wbGV0ZSB9ID0gcHJlc3RpZ2VSZXNldFN1bW1hcnkoKTtcblx0aWYgKGNvbXBsZXRlZENvdW50ID09PSAwKSByZXR1cm4gZmFsc2U7XG5cdGNvbnN0IG1zZyA9IGluY29tcGxldGUgPiAwXG5cdFx0PyBgUmVzZXQgd2l0aCAke2NvbXBsZXRlZENvdW50fS8ke3RvdGFsQWN0aXZlfSBxdWVzdHMgY29tcGxldGU/XFxuXFxuWW91J2xsIG1pc3MgJHtpbmNvbXBsZXRlfSByZXdhcmQke1xuXHRcdFx0aW5jb21wbGV0ZSA9PT0gMSA/IFwiXCIgOiBcInNcIlxuXHRcdH0uIFlvdSBjYW4gYWx3YXlzIGtlZXAgcGxheWluZyB0byBmaW5pc2ggdGhlbS5gXG5cdFx0OiBcIkFsbCBxdWVzdHMgY29tcGxldGUhIFJlc2V0IGFuZCBjbGFpbSB5b3VyIHJld2FyZHM/XCI7XG5cdHJldHVybiBjb25maXJtKG1zZyk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoYW5kbGVDbGljayhlOiBNb3VzZUV2ZW50KTogdm9pZCB7XG5cdGNvbnN0IGJ0biA9IChlLnRhcmdldCBhcyBFbGVtZW50IHwgbnVsbCk/LmNsb3Nlc3Q8SFRNTEVsZW1lbnQ+KFwiYnV0dG9uW2RhdGEtYWN0aW9uXVwiKTtcblx0aWYgKCFidG4pIHJldHVybjtcblx0Y29uc3QgeyBhY3Rpb24gfSA9IGJ0bi5kYXRhc2V0O1xuXHRjb25zdCBibGQgPSBidG4uZGF0YXNldC5ibGQ7XG5cdGNvbnN0IHByb2R1Y3QgPSBidG4uZGF0YXNldC5wcm9kdWN0O1xuXHRzd2l0Y2ggKGFjdGlvbikge1xuXHRcdGNhc2UgXCJvcGVuLXRyZWFzdXJlXCI6XG5cdFx0XHRvcGVuVHJlYXN1cmUoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJidWlsZFwiOlxuXHRcdFx0dW5sb2NrQnVpbGRpbmcoYmxkISk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwidW5sb2NrLXByb2R1Y3RcIjpcblx0XHRcdHVubG9ja1Byb2R1Y3QoYmxkISwgcHJvZHVjdCEpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcImFkZC1zbG90XCI6XG5cdFx0XHRhZGRTbG90KGJsZCEsIHByb2R1Y3QhKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJzZWxsLXNsb3RcIjpcblx0XHRcdHNlbGxTbG90KGJsZCEsIHByb2R1Y3QhKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJtYW51YWwtcHJvZHVjZVwiOlxuXHRcdFx0bWFudWFsUHJvZHVjZShibGQhLCBwcm9kdWN0ISk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwic3RvcmFnZS11cGdyYWRlXCI6XG5cdFx0XHR1cGdyYWRlU3RvcmFnZSgpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcInNlbGxcIjpcblx0XHRcdHNlbGxQcm9kdWN0KGJ0bi5kYXRhc2V0LnJlc291cmNlIGFzIFJlc291cmNlS2V5KTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJzZWxsLWFsbFwiOlxuXHRcdFx0c2VsbEFsbCgpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcInRvZ2dsZS1wcm9kdWN0XCI6XG5cdFx0XHR0b2dnbGVQcm9kdWN0RW5hYmxlZChibGQhLCBwcm9kdWN0ISk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwiZml4LWJvdHRsZW5lY2tcIjpcblx0XHRcdGRvRml4Qm90dGxlbmVjaygpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcInJlcm9sbC1xdWVzdFwiOlxuXHRcdFx0cmVyb2xsUXVlc3QoTnVtYmVyKGJ0bi5kYXRhc2V0LmluZGV4KSk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwicHJlc3RpZ2UtcmVzZXRcIjpcblx0XHRcdGlmIChjb25maXJtUHJlc3RpZ2VSZXNldCgpKSBhcHBseVByZXN0aWdlUmVzZXQoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJzYXZlLW5vd1wiOlxuXHRcdFx0c2F2ZU5vdygpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcImltcG9ydC1zYXZlLXRleHRcIjpcblx0XHRcdGltcG9ydFNhdmVGcm9tVGV4dCgpO1xuXHRcdFx0YnJlYWs7XG5cdFx0Y2FzZSBcImNsZWFyLXNhdmVcIjpcblx0XHRcdGNsZWFyU2F2ZURhdGEoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJleHBvcnQtcmVjb3JkaW5nXCI6XG5cdFx0XHRleHBvcnRSZWNvcmRpbmcoKTtcblx0XHRcdGJyZWFrO1xuXHRcdGNhc2UgXCJ2aWN0b3J5LWtlZXAtcGxheWluZ1wiOlxuXHRcdFx0ZGlzbWlzc1ZpY3RvcnkoKTtcblx0XHRcdGhpZGVWaWN0b3J5U2NyZWVuKCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwidmljdG9yeS1uZXctZ2FtZVwiOlxuXHRcdFx0aWYgKGNvbmZpcm0oXCJTdGFydCBhIGJyYW5kIG5ldyBnYW1lPyBBbGwgcHJvZ3Jlc3MgYW5kIHByZXN0aWdlIHJld2FyZHMgd2lsbCBiZSByZXNldC5cIikpIHZpY3RvcnlOZXdHYW1lKCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwic2V0dGluZ3Mtb3BlblwiOlxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcHBcIik/LmNsYXNzTGlzdC5hZGQoXCJzZXR0aW5ncy1vcGVuXCIpO1xuXHRcdFx0cmVuZGVyU2V0dGluZ3NTZWN0aW9uKCk7XG5cdFx0XHRkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxFbGVtZW50PihcIiNzZXR0aW5ncy1iYWNrLXJvdyBidXR0b25cIik/LmZvY3VzKCk7XG5cdFx0XHRicmVhaztcblx0XHRjYXNlIFwic2V0dGluZ3MtYmFja1wiOlxuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhcHBcIik/LmNsYXNzTGlzdC5yZW1vdmUoXCJzZXR0aW5ncy1vcGVuXCIpO1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZXR0aW5ncy1idG5cIik/LmZvY3VzKCk7XG5cdFx0XHRicmVhaztcblx0fVxufVxuIiwgImltcG9ydCB7IEJVSUxESU5HUyB9IGZyb20gXCIuL2NvbnRlbnQvYnVpbGRpbmdzLnRzXCI7XG5pbXBvcnQgeyBRVUVTVF9QT09MIH0gZnJvbSBcIi4vY29udGVudC9xdWVzdHMudHNcIjtcbmltcG9ydCB7IHJ1bnRpbWUsIHN0YXRlIH0gZnJvbSBcIi4vY29yZS9zdGF0ZS50c1wiO1xuaW1wb3J0IHsgb24gfSBmcm9tIFwiLi9jb3JlL2V2ZW50cy50c1wiO1xuaW1wb3J0IHsgc2V0QmFja2VuZCB9IGZyb20gXCIuL2NvcmUvc3RvcmFnZS50c1wiO1xuaW1wb3J0IHsgbm93IH0gZnJvbSBcIi4vY29yZS9jbG9jay50c1wiO1xuaW1wb3J0IHsgbG9hZCwgc2F2ZSB9IGZyb20gXCIuL2NvcmUvc2F2ZS50c1wiO1xuaW1wb3J0IHsgc3RhcnRSZWNvcmRpbmcgfSBmcm9tIFwiLi9jb3JlL2pvdXJuYWwudHNcIjtcbmltcG9ydCB7IHJuZ1N0YXRlIH0gZnJvbSBcIi4vY29yZS9ybmcudHNcIjtcbmltcG9ydCB7IGRyYXdRdWVzdHMsIGlzR2FtZUNvbXBsZXRlIH0gZnJvbSBcIi4vY29yZS9xdWVzdHMudHNcIjtcbmltcG9ydCB7IHRpY2sgfSBmcm9tIFwiLi9jb3JlL3RpY2sudHNcIjtcbmltcG9ydCB7IEJ1aWxkaW5nUHJvZHVjdENhcmQsIEJ1aWxkaW5nU2VjdGlvbiwgTWFya2V0UHJvZHVjdENhcmQsIE1hcmtldFNlY3Rpb24sIFVubG9ja1Byb2R1Y3RCdXR0b24gfSBmcm9tIFwiLi91aS9jb21wb25lbnRzLnRzXCI7XG5pbXBvcnQge1xuXHRhZGRCdWlsZGluZ09wdGlvbixcblx0YW5ub3VuY2VUb0RvbSxcblx0cmVuZGVyQWxsLFxuXHRyZW5kZXJCdWlsZGluZ1NlY3Rpb24sXG5cdHJlbmRlckhVRCxcblx0cmVuZGVyTWFya2V0U2VjdGlvbixcblx0cmVuZGVyVHJlYXN1cmUsXG5cdHJlc2V0UHJvZHVjdGlvblBhbmVsLFxufSBmcm9tIFwiLi91aS9yZW5kZXIudHNcIjtcbmltcG9ydCB7IGludmFsaWRhdGVRdWVzdHNQYW5lbCwgcmVuZGVyUXVlc3RzU2VjdGlvbiB9IGZyb20gXCIuL3VpL3F1ZXN0cy1wYW5lbC50c1wiO1xuaW1wb3J0IHsgaGlkZVZpY3RvcnlTY3JlZW4sIHNob3dWaWN0b3J5U2NyZWVuIH0gZnJvbSBcIi4vdWkvdmljdG9yeS50c1wiO1xuaW1wb3J0IHsgaGFuZGxlQ2xpY2sgfSBmcm9tIFwiLi91aS9oYW5kbGVycy50c1wiO1xuXG5jb25zdCBUSUNLX01TID0gMTAwO1xuY29uc3QgQVVUT1NBVkVfTVMgPSA1MDAwO1xuXG5mdW5jdGlvbiB3aXJlRXZlbnRzKCk6IHZvaWQge1xuXHRvbihcImFubm91bmNlXCIsIGFubm91bmNlVG9Eb20gYXMgKHA/OiB1bmtub3duKSA9PiB2b2lkKTtcblx0b24oXCJyZW5kZXJcIiwgcmVuZGVyQWxsKTtcblx0b24oXCJ0cmVhc3VyZTpjaGFuZ2VcIiwgcmVuZGVyVHJlYXN1cmUpO1xuXHRvbihcInRpY2tcIiwgKCkgPT4ge1xuXHRcdHJlbmRlckhVRCgpO1xuXHRcdHJlbmRlck1hcmtldFNlY3Rpb24oKTtcblx0XHRyZW5kZXJRdWVzdHNTZWN0aW9uKCk7XG5cdH0pO1xuXHRvbihcInF1ZXN0czppbnZhbGlkYXRlXCIsIGludmFsaWRhdGVRdWVzdHNQYW5lbCk7XG5cdG9uKFwidmljdG9yeVwiLCBzaG93VmljdG9yeVNjcmVlbik7XG5cdG9uKFwiYnVpbGRpbmc6YnVpbHRcIiwgKGJsZEtleTogc3RyaW5nKSA9PiB7XG5cdFx0YWRkQnVpbGRpbmdPcHRpb24oYmxkS2V5KTtcblx0XHRydW50aW1lLnNlbGVjdGVkQnVpbGRpbmcgPSBibGRLZXk7XG5cdFx0Y29uc3Qgc2VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidWlsZGluZy1zZWxlY3RcIikgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsO1xuXHRcdGlmIChzZWwpIHNlbC52YWx1ZSA9IGJsZEtleTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlY3Rpb24tcHJvZHVjdGlvblwiKT8uc2V0QXR0cmlidXRlKFwib3BlblwiLCBcIlwiKTtcblx0XHRyZW5kZXJBbGwoKTtcblx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1aWxkaW5nLXNlbGVjdFwiKT8uZm9jdXMoKTtcblx0fSk7XG5cdG9uKFwicHJvZHVjdDp1bmxvY2tlZFwiLCAoeyBibGRLZXksIHByb2R1Y3RLZXkgfTogeyBibGRLZXk6IHN0cmluZzsgcHJvZHVjdEtleTogc3RyaW5nIH0pID0+IHtcblx0XHRyZW5kZXJBbGwoKTtcblx0XHRjb25zdCBhZGRCdG4gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yPEhUTUxCdXR0b25FbGVtZW50PihgW2RhdGEtYWN0aW9uPVwiYWRkLXNsb3RcIl1bZGF0YS1ibGQ9XCIke2JsZEtleX1cIl1bZGF0YS1wcm9kdWN0PVwiJHtwcm9kdWN0S2V5fVwiXWApO1xuXHRcdGlmIChhZGRCdG4gJiYgIWFkZEJ0bi5kaXNhYmxlZCkgYWRkQnRuLmZvY3VzKCk7XG5cdFx0ZWxzZSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcImJ1aWxkaW5nLXNlbGVjdFwiKT8uZm9jdXMoKTtcblx0fSk7XG5cdG9uKFwicHJlc3RpZ2U6cmVzZXRcIiwgKCkgPT4ge1xuXHRcdHJlc2V0UHJvZHVjdGlvblBhbmVsKCk7XG5cdFx0aW52YWxpZGF0ZVF1ZXN0c1BhbmVsKCk7XG5cdH0pO1xuXHRvbihcInZpY3Rvcnk6bmV3Z2FtZVwiLCAoKSA9PiB7XG5cdFx0cmVzZXRQcm9kdWN0aW9uUGFuZWwoKTtcblx0XHRoaWRlVmljdG9yeVNjcmVlbigpO1xuXHRcdGludmFsaWRhdGVRdWVzdHNQYW5lbCgpO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gZGVmaW5lQ29tcG9uZW50cygpOiB2b2lkIHtcblx0Y3VzdG9tRWxlbWVudHMuZGVmaW5lKFwiYnVpbGRpbmctcHJvZHVjdC1jYXJkXCIsIEJ1aWxkaW5nUHJvZHVjdENhcmQpO1xuXHRjdXN0b21FbGVtZW50cy5kZWZpbmUoXCJidWlsZGluZy1zZWN0aW9uXCIsIEJ1aWxkaW5nU2VjdGlvbik7XG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZShcInVubG9jay1wcm9kdWN0LWJ1dHRvblwiLCBVbmxvY2tQcm9kdWN0QnV0dG9uKTtcblx0Y3VzdG9tRWxlbWVudHMuZGVmaW5lKFwibWFya2V0LXByb2R1Y3QtY2FyZFwiLCBNYXJrZXRQcm9kdWN0Q2FyZCk7XG5cdGN1c3RvbUVsZW1lbnRzLmRlZmluZShcIm1hcmtldC1zZWN0aW9uXCIsIE1hcmtldFNlY3Rpb24pO1xufVxuXG5mdW5jdGlvbiBpbml0KCk6IHZvaWQge1xuXHRkZWZpbmVDb21wb25lbnRzKCk7XG5cdHdpcmVFdmVudHMoKTtcblx0c2V0QmFja2VuZChsb2NhbFN0b3JhZ2UpO1xuXHRsb2FkKCk7XG5cdGNvbnN0IHF1ZXN0UG9vbElkcyA9IG5ldyBTZXQoUVVFU1RfUE9PTC5tYXAoKHEpID0+IHEuaWQpKTtcblx0Y29uc3QgaGFzU3RhbGVJZHMgPSBzdGF0ZS5xdWVzdHMuYWN0aXZlLnNvbWUoKGlkKSA9PiAhcXVlc3RQb29sSWRzLmhhcyhpZCkpO1xuXHRpZiAoc3RhdGUucXVlc3RzLmFjdGl2ZS5sZW5ndGggPT09IDAgfHwgaGFzU3RhbGVJZHMpIGRyYXdRdWVzdHMoKTtcblx0c3RhdGUubGFzdFRpY2sgPSBub3coKTtcblx0Ly8gUGVyc2lzdCBzdHJhaWdodCBhd2F5IHNvIGEgbWlncmF0ZWQgc2F2ZSBpcyB3cml0dGVuIGluIHRoZSBuZXcgc2hhcGUgZXZlbiBpZiB0aGVcblx0Ly8gdGFiIGlzIGNsb3NlZCBiZWZvcmUgdGhlIGZpcnN0IGF1dG9zYXZlLlxuXHRzYXZlKCk7XG5cdC8vIEZyb20gaGVyZSBldmVyeSBhY3Rpb24gaXMgam91cm5hbGxlZCwgc28gYSByZWFsIHNlc3Npb24gY2FuIGJlIHJlcGxheWVkIHRocm91Z2ggdGhlXG5cdC8vIGhlYWRsZXNzIGNvcmUgYW5kIGNoZWNrZWQgYWdhaW5zdCB3aGF0IGFjdHVhbGx5IGhhcHBlbmVkLlxuXHRzdGFydFJlY29yZGluZyhKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHN0YXRlKSksIHJuZ1N0YXRlKCkpO1xuXHRmb3IgKGNvbnN0IGJsZEtleSBvZiBPYmplY3Qua2V5cyhCVUlMRElOR1MpKSBpZiAoc3RhdGUuYnVpbGRpbmdzW2JsZEtleV0udW5sb2NrZWQpIGFkZEJ1aWxkaW5nT3B0aW9uKGJsZEtleSk7XG5cdGNvbnN0IGZpcnN0QnVpbHQgPSBPYmplY3Qua2V5cyhCVUlMRElOR1MpLmZpbmQoKGspID0+IHN0YXRlLmJ1aWxkaW5nc1trXS51bmxvY2tlZCk7XG5cdHJ1bnRpbWUuc2VsZWN0ZWRCdWlsZGluZyA9IGZpcnN0QnVpbHQgPz8gbnVsbDtcblx0Y29uc3Qgc2VsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJidWlsZGluZy1zZWxlY3RcIikgYXMgSFRNTFNlbGVjdEVsZW1lbnQgfCBudWxsO1xuXHRpZiAoc2VsICYmIGZpcnN0QnVpbHQpIHNlbC52YWx1ZSA9IGZpcnN0QnVpbHQ7XG5cdHNlbD8uYWRkRXZlbnRMaXN0ZW5lcihcImNoYW5nZVwiLCAoKSA9PiB7XG5cdFx0cnVudGltZS5zZWxlY3RlZEJ1aWxkaW5nID0gc2VsLnZhbHVlIHx8IG51bGw7XG5cdFx0cmVuZGVyQnVpbGRpbmdTZWN0aW9uKCk7XG5cdH0pO1xuXHRyZW5kZXJBbGwoKTtcblx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsIGhhbmRsZUNsaWNrIGFzIEV2ZW50TGlzdGVuZXIpO1xuXHRzZXRJbnRlcnZhbCh0aWNrLCBUSUNLX01TKTtcblx0c2V0SW50ZXJ2YWwoc2F2ZSwgQVVUT1NBVkVfTVMpO1xuXHRpZiAoaXNHYW1lQ29tcGxldGUoKSAmJiAhc3RhdGUucHJlc3RpZ2UudmljdG9yeVNob3duKSBzaG93VmljdG9yeVNjcmVlbigpO1xufVxuXG5pZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJsb2FkaW5nXCIpIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsIGluaXQpO1xuZWxzZSBpbml0KCk7XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBSU8sSUFBTSxrQkFBa0I7RUFDOUIsYUFBYTtJQUNaLE9BQU87SUFDUCxNQUFNO0lBQ04sV0FBVztJQUNYLGtCQUFrQjtJQUNsQixRQUFRO0lBQ1IsVUFBVTtNQUNULE1BQU07UUFDTCxXQUFXO1FBQ1gsV0FBVztRQUNYLFFBQVEsQ0FBQztRQUNULGFBQWE7UUFDYixZQUFZO1FBQ1osY0FBYztRQUNkLGVBQWU7UUFDZixnQkFBZ0I7TUFDakI7TUFDQSxRQUFRO1FBQ1AsV0FBVztRQUNYLFdBQVc7UUFDWCxRQUFRO1VBQUUsTUFBTTtRQUFFO1FBQ2xCLGFBQWE7UUFDYixZQUFZO1FBQ1osY0FBYztRQUNkLGVBQWU7TUFDaEI7TUFDQSxRQUFRO1FBQ1AsV0FBVztRQUNYLFdBQVc7UUFDWCxRQUFRO1VBQUUsUUFBUTtRQUFFO1FBQ3BCLGFBQWE7UUFDYixZQUFZO1FBQ1osY0FBYztRQUNkLGVBQWU7TUFDaEI7TUFDQSxTQUFTO1FBQ1IsV0FBVztRQUNYLFdBQVc7UUFDWCxRQUFRO1VBQUUsUUFBUTtRQUFFO1FBQ3BCLGFBQWE7UUFDYixZQUFZO1FBQ1osY0FBYztRQUNkLGVBQWU7TUFDaEI7TUFDQSxRQUFRO1FBQ1AsV0FBVztRQUNYLFdBQVc7UUFDWCxRQUFRO1VBQUUsU0FBUztVQUFHLFFBQVE7UUFBRTtRQUNoQyxhQUFhO1FBQ2IsWUFBWTtRQUNaLGNBQWM7UUFDZCxlQUFlO01BQ2hCO0lBQ0Q7RUFDRDtFQUNBLFNBQVM7SUFDUixPQUFPO0lBQ1AsTUFBTTtJQUNOLFdBQVc7SUFDWCxrQkFBa0I7SUFDbEIsUUFBUTtNQUFFLFVBQVU7SUFBYztJQUNsQyxVQUFVO01BQ1QsUUFBUTtRQUNQLFdBQVc7UUFDWCxXQUFXO1FBQ1gsUUFBUTtVQUFFLE1BQU07UUFBRTtRQUNsQixhQUFhO1FBQ2IsWUFBWTtRQUNaLGNBQWM7UUFDZCxlQUFlO1FBQ2YsZ0JBQWdCO01BQ2pCO01BQ0EsUUFBUTtRQUNQLFdBQVc7UUFDWCxXQUFXO1FBQ1gsUUFBUTtVQUFFLE1BQU07UUFBRTtRQUNsQixhQUFhO1FBQ2IsWUFBWTtRQUNaLGNBQWM7UUFDZCxlQUFlO01BQ2hCO01BQ0EsT0FBTztRQUNOLFdBQVc7UUFDWCxXQUFXO1FBQ1gsUUFBUTtVQUFFLE1BQU07UUFBRTtRQUNsQixhQUFhO1FBQ2IsWUFBWTtRQUNaLGNBQWM7UUFDZCxlQUFlO01BQ2hCO0lBQ0Q7RUFDRDtFQUNBLFVBQVU7SUFDVCxPQUFPO0lBQ1AsTUFBTTtJQUNOLFdBQVc7SUFDWCxrQkFBa0I7SUFDbEIsUUFBUTtNQUFFLFVBQVU7TUFBVyxTQUFTO0lBQVM7SUFDakQsVUFBVTtNQUNULFFBQVE7UUFDUCxXQUFXO1FBQ1gsV0FBVztRQUNYLFFBQVE7VUFBRSxRQUFRO1VBQUcsUUFBUTtRQUFFO1FBQy9CLGFBQWE7UUFDYixZQUFZO1FBQ1osY0FBYztRQUNkLGVBQWU7UUFDZixnQkFBZ0I7TUFDakI7TUFDQSxXQUFXO1FBQ1YsV0FBVztRQUNYLFdBQVc7UUFDWCxRQUFRO1VBQUUsUUFBUTtVQUFHLFNBQVM7UUFBRTtRQUNoQyxhQUFhO1FBQ2IsWUFBWTtRQUNaLGNBQWM7UUFDZCxlQUFlO01BQ2hCO01BQ0EsU0FBUztRQUNSLFdBQVc7UUFDWCxXQUFXO1FBQ1gsUUFBUTtVQUFFLE9BQU87VUFBRyxRQUFRO1FBQUU7UUFDOUIsYUFBYTtRQUNiLFlBQVk7UUFDWixjQUFjO1FBQ2QsZUFBZTtNQUNoQjtNQUNBLFFBQVE7UUFDUCxXQUFXO1FBQ1gsV0FBVztRQUNYLFFBQVE7VUFBRSxPQUFPO1VBQUcsUUFBUTtVQUFHLFFBQVE7UUFBRTtRQUN6QyxhQUFhO1FBQ2IsWUFBWTtRQUNaLGNBQWM7UUFDZCxlQUFlO01BQ2hCO0lBQ0Q7RUFDRDtFQUNBLE9BQU87SUFDTixPQUFPO0lBQ1AsTUFBTTtJQUNOLFdBQVc7SUFDWCxrQkFBa0I7SUFDbEIsUUFBUTtNQUFFLFVBQVU7SUFBVztJQUMvQixVQUFVO01BQ1QsVUFBVTtRQUNULFdBQVc7UUFDWCxXQUFXO1FBQ1gsUUFBUSxDQUFDO1FBQ1QsYUFBYTtRQUNiLFlBQVk7UUFDWixjQUFjO1FBQ2QsZUFBZTtRQUNmLGdCQUFnQjtNQUNqQjtNQUNBLFdBQVc7UUFDVixXQUFXO1FBQ1gsV0FBVztRQUNYLFFBQVE7VUFBRSxVQUFVO1FBQUU7UUFDdEIsYUFBYTtRQUNiLFlBQVk7UUFDWixjQUFjO1FBQ2QsZUFBZTtNQUNoQjtNQUNBLE9BQU87UUFDTixXQUFXO1FBQ1gsV0FBVztRQUNYLFFBQVE7VUFBRSxXQUFXO1FBQUU7UUFDdkIsYUFBYTtRQUNiLFlBQVk7UUFDWixjQUFjO1FBQ2QsZUFBZTtNQUNoQjtNQUNBLGVBQWU7UUFDZCxXQUFXO1FBQ1gsV0FBVztRQUNYLFFBQVE7VUFBRSxXQUFXO1FBQUU7UUFDdkIsYUFBYTtRQUNiLFlBQVk7UUFDWixjQUFjO1FBQ2QsZUFBZTtNQUNoQjtJQUNEO0VBQ0Q7RUFDQSxTQUFTO0lBQ1IsT0FBTztJQUNQLE1BQU07SUFDTixXQUFXO0lBQ1gsa0JBQWtCO0lBQ2xCLFFBQVE7TUFBRSxVQUFVO01BQVMsU0FBUztJQUFnQjtJQUN0RCxVQUFVO01BQ1QsT0FBTztRQUNOLFdBQVc7UUFDWCxXQUFXO1FBQ1gsUUFBUTtVQUFFLFdBQVc7VUFBRyxRQUFRO1FBQUU7UUFDbEMsYUFBYTtRQUNiLFlBQVk7UUFDWixjQUFjO1FBQ2QsZUFBZTtRQUNmLGdCQUFnQjtNQUNqQjtNQUNBLFNBQVM7UUFDUixXQUFXO1FBQ1gsV0FBVztRQUNYLFFBQVE7VUFBRSxlQUFlO1FBQUU7UUFDM0IsYUFBYTtRQUNiLFlBQVk7UUFDWixjQUFjO1FBQ2QsZUFBZTtNQUNoQjtNQUNBLFlBQVk7UUFDWCxXQUFXO1FBQ1gsV0FBVztRQUNYLFFBQVE7VUFBRSxPQUFPO1VBQUcsU0FBUztRQUFFO1FBQy9CLGFBQWE7UUFDYixZQUFZO1FBQ1osY0FBYztRQUNkLGVBQWU7TUFDaEI7TUFDQSxXQUFXO1FBQ1YsV0FBVztRQUNYLFdBQVc7UUFDWCxRQUFRO1VBQUUsWUFBWTtVQUFHLGVBQWU7UUFBRTtRQUMxQyxhQUFhO1FBQ2IsWUFBWTtRQUNaLGNBQWM7UUFDZCxlQUFlO01BQ2hCO0lBQ0Q7RUFDRDtFQUNBLFNBQVM7SUFDUixPQUFPO0lBQ1AsTUFBTTtJQUNOLFdBQVc7SUFDWCxrQkFBa0I7SUFDbEIsUUFBUTtNQUFFLFVBQVU7TUFBVyxTQUFTO0lBQWE7SUFDckQsVUFBVTtNQUNULFFBQVE7UUFDUCxXQUFXO1FBQ1gsV0FBVztRQUNYLFFBQVE7VUFBRSxXQUFXO1VBQUcsUUFBUTtRQUFFO1FBQ2xDLGFBQWE7UUFDYixZQUFZO1FBQ1osY0FBYztRQUNkLGVBQWU7UUFDZixnQkFBZ0I7TUFDakI7TUFDQSxXQUFXO1FBQ1YsV0FBVztRQUNYLFdBQVc7UUFDWCxRQUFRO1VBQUUsUUFBUTtVQUFHLFFBQVE7VUFBRyxlQUFlO1FBQUU7UUFDakQsYUFBYTtRQUNiLFlBQVk7UUFDWixjQUFjO1FBQ2QsZUFBZTtNQUNoQjtNQUNBLFNBQVM7UUFDUixXQUFXO1FBQ1gsV0FBVztRQUNYLFFBQVE7VUFBRSxPQUFPO1VBQUcsV0FBVztVQUFHLFlBQVk7UUFBRTtRQUNoRCxhQUFhO1FBQ2IsWUFBWTtRQUNaLGNBQWM7UUFDZCxlQUFlO01BQ2hCO01BQ0EsV0FBVztRQUNWLFdBQVc7UUFDWCxXQUFXO1FBQ1gsUUFBUTtVQUFFLE9BQU87VUFBRyxZQUFZO1VBQUcsV0FBVztRQUFFO1FBQ2hELGFBQWE7UUFDYixZQUFZO1FBQ1osY0FBYztRQUNkLGVBQWU7TUFDaEI7SUFDRDtFQUNEO0VBQ0EsVUFBVTtJQUNULE9BQU87SUFDUCxNQUFNO0lBQ04sV0FBVztJQUNYLGtCQUFrQjtJQUNsQixRQUFRO01BQUUsVUFBVTtNQUFXLFNBQVM7SUFBVTtJQUNsRCxVQUFVO01BQ1QsT0FBTztRQUNOLFdBQVc7UUFDWCxXQUFXO1FBQ1gsUUFBUTtVQUFFLE9BQU87VUFBRyxRQUFRO1FBQUU7UUFDOUIsYUFBYTtRQUNiLFlBQVk7UUFDWixjQUFjO1FBQ2QsZUFBZTtRQUNmLGdCQUFnQjtNQUNqQjtNQUNBLFNBQVM7UUFDUixXQUFXO1FBQ1gsV0FBVztRQUNYLFFBQVE7VUFBRSxRQUFRO1VBQUcsZUFBZTtRQUFFO1FBQ3RDLGFBQWE7UUFDYixZQUFZO1FBQ1osY0FBYztRQUNkLGVBQWU7TUFDaEI7TUFDQSxVQUFVO1FBQ1QsV0FBVztRQUNYLFdBQVc7UUFDWCxRQUFRO1VBQUUsT0FBTztVQUFHLFNBQVM7VUFBRyxTQUFTO1FBQUU7UUFDM0MsYUFBYTtRQUNiLFlBQVk7UUFDWixjQUFjO1FBQ2QsZUFBZTtNQUNoQjtNQUNBLGNBQWM7UUFDYixXQUFXO1FBQ1gsV0FBVztRQUNYLFFBQVE7VUFBRSxPQUFPO1VBQUcsU0FBUztVQUFHLFdBQVc7VUFBRyxXQUFXO1FBQUU7UUFDM0QsYUFBYTtRQUNiLFlBQVk7UUFDWixjQUFjO1FBQ2QsZUFBZTtNQUNoQjtJQUNEO0VBQ0Q7QUFDRDtBQUlPLElBQU0sWUFBNEM7OztBQ3hVbEQsU0FBUyxZQUFZLEdBQVM7QUFDcEMsTUFBSSxFQUFFLFNBQVMsZ0JBQWlCLFFBQU8sSUFBSSxFQUFFLE9BQU8sZUFBYyxDQUFBO0FBQ2xFLE1BQUksRUFBRSxTQUFTLGdCQUFpQixRQUFPLGVBQWUsRUFBRSxPQUFPLGVBQWMsQ0FBQTtBQUM3RSxNQUFJLEVBQUUsU0FBUyxrQkFBbUIsUUFBTyxpQkFBaUIsRUFBRSxPQUFPLGVBQWMsQ0FBQTtBQUNqRixNQUFJLEVBQUUsU0FBUyxpQkFBa0IsUUFBTyxnQkFBZ0IsRUFBRSxPQUFPLGVBQWMsQ0FBQTtBQUMvRSxNQUFJLEVBQUUsU0FBUyxpQkFBa0IsUUFBTyxnQkFBZ0IsRUFBRSxPQUFPLGVBQWMsQ0FBQTtBQUMvRSxNQUFJLEVBQUUsU0FBUyxlQUFnQixRQUFPLElBQUksRUFBRSxPQUFPLGVBQWMsQ0FBQSx5QkFBMkIsRUFBRSxTQUFTLElBQUksTUFBTSxFQUFBO0FBQ2pILE1BQUksRUFBRSxTQUFTLGtCQUFtQixRQUFPLHFCQUFxQixFQUFFLE9BQU8sZUFBYyxDQUFBO0FBQ3JGLE1BQUksRUFBRSxTQUFTLG9CQUFxQixRQUFPLGtCQUFrQixFQUFFLE9BQU8sZUFBYyxDQUFBO0FBQ3BGLFNBQU87QUFDUjtBQUlPLElBQU0sZUFBNkI7RUFDekM7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLFVBQVU7SUFDVixPQUFPO01BQ047UUFBRSxRQUFRO1FBQUssT0FBTztRQUFpQixRQUFRO1VBQUUsTUFBTTtVQUFpQixRQUFRO1FBQUc7TUFBRTtNQUNyRjtRQUFFLFFBQVE7UUFBTSxPQUFPO1FBQW1CLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFO01BQ3pGO1FBQUUsUUFBUTtRQUFNLE9BQU87UUFBbUIsUUFBUTtVQUFFLE1BQU07VUFBaUIsUUFBUTtRQUFHO01BQUU7TUFDeEY7UUFBRSxRQUFRO1FBQU0sT0FBTztRQUFtQixRQUFRO1VBQUUsTUFBTTtVQUFpQixRQUFRO1FBQUc7TUFBRTs7RUFFMUY7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sVUFBVTtJQUNWLE9BQU87TUFDTjtRQUFFLFFBQVE7UUFBSyxPQUFPO1FBQW1CLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFO01BQ3hGO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBbUIsUUFBUTtVQUFFLE1BQU07VUFBaUIsUUFBUTtRQUFHO01BQUU7TUFDdkY7UUFBRSxRQUFRO1FBQU0sT0FBTztRQUFxQixRQUFRO1VBQUUsTUFBTTtVQUFtQixRQUFRO1FBQUc7TUFBRTs7RUFFOUY7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sVUFBVTtJQUNWLE9BQU87TUFDTjtRQUFFLFFBQVE7UUFBSyxPQUFPO1FBQW1CLFFBQVE7VUFBRSxNQUFNO1VBQW1CLFFBQVE7UUFBRztNQUFFO01BQ3pGO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBbUIsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7O0VBRTFGO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLFVBQVU7SUFDVixPQUFPO01BQ047UUFBRSxRQUFRO1FBQUssT0FBTztRQUFvQixRQUFRO1VBQUUsTUFBTTtVQUFtQixRQUFRO1FBQUc7TUFBRTtNQUMxRjtRQUFFLFFBQVE7UUFBSyxPQUFPO1FBQW9CLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFOztFQUUzRjtFQUNBO0lBQ0MsSUFBSTtJQUNKLE1BQU07SUFDTixVQUFVO0lBQ1YsT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBbUIsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7TUFDeEY7UUFBRSxRQUFRO1FBQUssT0FBTztRQUFtQixRQUFRO1VBQUUsTUFBTTtVQUFrQixRQUFRO1FBQUc7TUFBRTs7RUFFMUY7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sVUFBVTtJQUNWLFFBQVE7SUFDUixPQUFPO01BQ047UUFBRSxRQUFRO1FBQUssT0FBTztRQUFtQixRQUFRO1VBQUUsTUFBTTtVQUFpQixRQUFRO1FBQUc7TUFBRTtNQUN2RjtRQUFFLFFBQVE7UUFBSyxPQUFPO1FBQW1CLFFBQVE7VUFBRSxNQUFNO1VBQW1CLFFBQVE7UUFBRztNQUFFO01BQ3pGO1FBQUUsUUFBUTtRQUFNLE9BQU87UUFBcUIsUUFBUTtVQUFFLE1BQU07VUFBaUIsUUFBUTtRQUFHO01BQUU7O0VBRTVGO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLFVBQVU7SUFDVixRQUFRO0lBQ1IsT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBbUIsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7TUFDeEY7UUFBRSxRQUFRO1FBQUssT0FBTztRQUFtQixRQUFRO1VBQUUsTUFBTTtVQUFpQixRQUFRO1FBQUc7TUFBRTtNQUN2RjtRQUFFLFFBQVE7UUFBTSxPQUFPO1FBQXFCLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFOztFQUU3RjtFQUNBO0lBQ0MsSUFBSTtJQUNKLE1BQU07SUFDTixVQUFVO0lBQ1YsUUFBUTtJQUNSLE9BQU87TUFDTjtRQUFFLFFBQVE7UUFBSyxPQUFPO1FBQWtCLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFO01BQ3ZGO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBa0IsUUFBUTtVQUFFLE1BQU07VUFBbUIsUUFBUTtRQUFHO01BQUU7TUFDeEY7UUFBRSxRQUFRO1FBQUssT0FBTztRQUFrQixRQUFRO1VBQUUsTUFBTTtVQUFpQixRQUFRO1FBQUc7TUFBRTs7RUFFeEY7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sVUFBVTtJQUNWLFFBQVE7SUFDUixPQUFPO01BQ047UUFBRSxRQUFRO1FBQUssT0FBTztRQUFtQixRQUFRO1VBQUUsTUFBTTtVQUFnQixRQUFRO1FBQUc7TUFBRTtNQUN0RjtRQUFFLFFBQVE7UUFBSyxPQUFPO1FBQW1CLFFBQVE7VUFBRSxNQUFNO1VBQWlCLFFBQVE7UUFBRztNQUFFO01BQ3ZGO1FBQUUsUUFBUTtRQUFNLE9BQU87UUFBcUIsUUFBUTtVQUFFLE1BQU07VUFBaUIsUUFBUTtRQUFHO01BQUU7O0VBRTVGO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLFVBQVU7SUFDVixRQUFRO0lBQ1IsT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFJLE9BQU87UUFBcUIsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7TUFDekY7UUFBRSxRQUFRO1FBQUssT0FBTztRQUFzQixRQUFRO1VBQUUsTUFBTTtVQUFrQixRQUFRO1FBQUc7TUFBRTtNQUMzRjtRQUFFLFFBQVE7UUFBSyxPQUFPO1FBQXNCLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFOztFQUU3RjtFQUNBO0lBQ0MsSUFBSTtJQUNKLE1BQU07SUFDTixVQUFVO0lBQ1YsUUFBUTtJQUNSLE9BQU87TUFDTjtRQUFFLFFBQVE7UUFBSSxPQUFPO1FBQW1CLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFO01BQ3ZGO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBb0IsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7O0VBRTNGO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLFVBQVU7SUFDVixRQUFRO0lBQ1IsT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFJLE9BQU87UUFBa0IsUUFBUTtVQUFFLE1BQU07VUFBbUIsUUFBUTtRQUFHO01BQUU7TUFDdkY7UUFBRSxRQUFRO1FBQUksT0FBTztRQUFrQixRQUFRO1VBQUUsTUFBTTtVQUFrQixRQUFRO1FBQUc7TUFBRTs7RUFFeEY7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sVUFBVTtJQUNWLFFBQVE7SUFDUixPQUFPO01BQ047UUFBRSxRQUFRO1FBQUssT0FBTztRQUFxQixRQUFRO1VBQUUsTUFBTTtVQUFpQixRQUFRO1FBQUc7TUFBRTtNQUN6RjtRQUFFLFFBQVE7UUFBTSxPQUFPO1FBQXVCLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFO01BQzdGO1FBQUUsUUFBUTtRQUFNLE9BQU87UUFBdUIsUUFBUTtVQUFFLE1BQU07VUFBaUIsUUFBUTtRQUFHO01BQUU7O0VBRTlGO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLFVBQVU7SUFDVixRQUFRO0lBQ1IsT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBc0IsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7TUFDM0Y7UUFBRSxRQUFRO1FBQUssT0FBTztRQUFzQixRQUFRO1VBQUUsTUFBTTtVQUFpQixRQUFRO1FBQUc7TUFBRTtNQUMxRjtRQUFFLFFBQVE7UUFBTSxPQUFPO1FBQXdCLFFBQVE7VUFBRSxNQUFNO1VBQW1CLFFBQVE7UUFBRztNQUFFOztFQUVqRztFQUNBO0lBQ0MsSUFBSTtJQUNKLE1BQU07SUFDTixVQUFVO0lBQ1YsUUFBUTtJQUNSLE9BQU87TUFDTjtRQUFFLFFBQVE7UUFBSyxPQUFPO1FBQWtCLFFBQVE7VUFBRSxNQUFNO1VBQWlCLFFBQVE7UUFBRztNQUFFO01BQ3RGO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBa0IsUUFBUTtVQUFFLE1BQU07VUFBaUIsUUFBUTtRQUFHO01BQUU7O0VBRXhGO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLFVBQVU7SUFDVixRQUFRO0lBQ1IsT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBMEIsUUFBUTtVQUFFLE1BQU07VUFBbUIsUUFBUTtRQUFHO01BQUU7TUFDaEc7UUFBRSxRQUFRO1FBQUssT0FBTztRQUEwQixRQUFRO1VBQUUsTUFBTTtVQUFrQixRQUFRO1FBQUc7TUFBRTs7RUFFakc7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sVUFBVTtJQUNWLFFBQVE7SUFDUixPQUFPO01BQ047UUFBRSxRQUFRO1FBQUksT0FBTztRQUFpQixRQUFRO1VBQUUsTUFBTTtVQUFrQixRQUFRO1FBQUc7TUFBRTtNQUNyRjtRQUFFLFFBQVE7UUFBSyxPQUFPO1FBQWtCLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFOztFQUV6RjtFQUNBO0lBQ0MsSUFBSTtJQUNKLE1BQU07SUFDTixVQUFVO0lBQ1YsUUFBUTtJQUNSLE9BQU87TUFDTjtRQUFFLFFBQVE7UUFBSSxPQUFPO1FBQW1CLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFO01BQ3ZGO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBb0IsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7O0VBRTNGO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLFVBQVU7SUFDVixRQUFRO0lBQ1IsT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFJLE9BQU87UUFBc0IsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7TUFDMUY7UUFBRSxRQUFRO1FBQUssT0FBTztRQUF1QixRQUFRO1VBQUUsTUFBTTtVQUFrQixRQUFRO1FBQUc7TUFBRTs7RUFFOUY7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sVUFBVTtJQUNWLFFBQVE7SUFDUixPQUFPO01BQ047UUFBRSxRQUFRO1FBQUksT0FBTztRQUFxQixRQUFRO1VBQUUsTUFBTTtVQUFpQixRQUFRO1FBQUc7TUFBRTtNQUN4RjtRQUFFLFFBQVE7UUFBSSxPQUFPO1FBQXFCLFFBQVE7VUFBRSxNQUFNO1VBQWlCLFFBQVE7UUFBRztNQUFFOztFQUUxRjtFQUNBO0lBQ0MsSUFBSTtJQUNKLE1BQU07SUFDTixVQUFVO0lBQ1YsUUFBUTtJQUNSLE9BQU87TUFDTjtRQUFFLFFBQVE7UUFBSSxPQUFPO1FBQWtCLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFO01BQ3RGO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBbUIsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7O0VBRTFGO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLFVBQVU7SUFDVixRQUFRO0lBQ1IsT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFJLE9BQU87UUFBcUIsUUFBUTtVQUFFLE1BQU07VUFBbUIsUUFBUTtRQUFHO01BQUU7TUFDMUY7UUFBRSxRQUFRO1FBQUssT0FBTztRQUFzQixRQUFRO1VBQUUsTUFBTTtVQUFrQixRQUFRO1FBQUc7TUFBRTs7RUFFN0Y7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sVUFBVTtJQUNWLFFBQVE7SUFDUixPQUFPO01BQ047UUFBRSxRQUFRO1FBQUksT0FBTztRQUFrQixRQUFRO1VBQUUsTUFBTTtVQUFrQixRQUFRO1FBQUc7TUFBRTtNQUN0RjtRQUFFLFFBQVE7UUFBSSxPQUFPO1FBQW1CLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFOztFQUV6RjtFQUNBO0lBQ0MsSUFBSTtJQUNKLE1BQU07SUFDTixVQUFVO0lBQ1YsUUFBUTtJQUNSLE9BQU87TUFDTjtRQUFFLFFBQVE7UUFBSSxPQUFPO1FBQXFCLFFBQVE7VUFBRSxNQUFNO1VBQW1CLFFBQVE7UUFBRztNQUFFO01BQzFGO1FBQUUsUUFBUTtRQUFJLE9BQU87UUFBcUIsUUFBUTtVQUFFLE1BQU07VUFBbUIsUUFBUTtRQUFHO01BQUU7O0VBRTVGO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLFVBQVU7SUFDVixRQUFRO0lBQ1IsT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFJLE9BQU87UUFBaUIsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7TUFDckY7UUFBRSxRQUFRO1FBQUssT0FBTztRQUFrQixRQUFRO1VBQUUsTUFBTTtVQUFrQixRQUFRO1FBQUc7TUFBRTs7RUFFekY7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sVUFBVTtJQUNWLFFBQVE7SUFDUixPQUFPO01BQ047UUFBRSxRQUFRO1FBQUksT0FBTztRQUFtQixRQUFRO1VBQUUsTUFBTTtVQUFtQixRQUFRO1FBQUc7TUFBRTtNQUN4RjtRQUFFLFFBQVE7UUFBSyxPQUFPO1FBQW9CLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFOztFQUUzRjtFQUNBO0lBQ0MsSUFBSTtJQUNKLE1BQU07SUFDTixVQUFVO0lBQ1YsUUFBUTtJQUNSLE9BQU87TUFDTjtRQUFFLFFBQVE7UUFBSSxPQUFPO1FBQW9CLFFBQVE7VUFBRSxNQUFNO1VBQW1CLFFBQVE7UUFBRztNQUFFO01BQ3pGO1FBQUUsUUFBUTtRQUFJLE9BQU87UUFBb0IsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7O0VBRTFGO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLFVBQVU7SUFDVixRQUFRO0lBQ1IsT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFJLE9BQU87UUFBd0IsUUFBUTtVQUFFLE1BQU07VUFBbUIsUUFBUTtRQUFHO01BQUU7O0VBRS9GO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLEtBQUs7SUFDTCxTQUFTO0lBQ1QsT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFJLE9BQU87UUFBb0IsUUFBUTtVQUFFLE1BQU07VUFBaUIsUUFBUTtRQUFHO01BQUU7TUFDdkY7UUFBRSxRQUFRO1FBQUssT0FBTztRQUFxQixRQUFRO1VBQUUsTUFBTTtVQUFpQixRQUFRO1FBQUc7TUFBRTtNQUN6RjtRQUFFLFFBQVE7UUFBSyxPQUFPO1FBQXFCLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFOztFQUU1RjtFQUNBO0lBQ0MsSUFBSTtJQUNKLE1BQU07SUFDTixLQUFLO0lBQ0wsU0FBUztJQUNULFFBQVE7SUFDUixPQUFPO01BQ047UUFBRSxRQUFRO1FBQUksT0FBTztRQUF5QixRQUFRO1VBQUUsTUFBTTtVQUFpQixRQUFRO1FBQUc7TUFBRTtNQUM1RjtRQUFFLFFBQVE7UUFBSyxPQUFPO1FBQTBCLFFBQVE7VUFBRSxNQUFNO1VBQWlCLFFBQVE7UUFBRztNQUFFO01BQzlGO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBMEIsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7O0VBRWpHO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLEtBQUs7SUFDTCxTQUFTO0lBQ1QsT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFJLE9BQU87UUFBdUIsUUFBUTtVQUFFLE1BQU07VUFBaUIsUUFBUTtRQUFHO01BQUU7TUFDMUY7UUFBRSxRQUFRO1FBQUssT0FBTztRQUF3QixRQUFRO1VBQUUsTUFBTTtVQUFpQixRQUFRO1FBQUc7TUFBRTs7RUFFOUY7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBdUIsUUFBUTtVQUFFLE1BQU07VUFBaUIsUUFBUTtRQUFHO01BQUU7TUFDM0Y7UUFBRSxRQUFRO1FBQUssT0FBTztRQUF1QixRQUFRO1VBQUUsTUFBTTtVQUFrQixRQUFRO1FBQUc7TUFBRTtNQUM1RjtRQUFFLFFBQVE7UUFBSyxPQUFPO1FBQXVCLFFBQVE7VUFBRSxNQUFNO1VBQWlCLFFBQVE7UUFBRztNQUFFO01BQzNGO1FBQUUsUUFBUTtRQUFNLE9BQU87UUFBeUIsUUFBUTtVQUFFLE1BQU07VUFBbUIsUUFBUTtRQUFHO01BQUU7O0VBRWxHO0VBQ0E7SUFBRSxJQUFJO0lBQWlCLE1BQU07SUFBUyxLQUFLO0lBQVcsT0FBTztNQUFDO1FBQUUsUUFBUTtRQUFHLE9BQU87UUFBcUIsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7O0VBQUc7RUFDeko7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLEtBQUs7SUFDTCxRQUFRO0lBQ1IsT0FBTztNQUFDO1FBQUUsUUFBUTtRQUFHLE9BQU87UUFBc0IsUUFBUTtVQUFFLE1BQU07VUFBZ0IsUUFBUTtRQUFHO01BQUU7O0VBQ2hHO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLEtBQUs7SUFDTCxRQUFRO0lBQ1IsT0FBTztNQUFDO1FBQUUsUUFBUTtRQUFHLE9BQU87UUFBbUIsUUFBUTtVQUFFLE1BQU07VUFBZ0IsUUFBUTtRQUFHO01BQUU7O0VBQzdGO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLEtBQUs7SUFDTCxRQUFRO0lBQ1IsT0FBTztNQUFDO1FBQUUsUUFBUTtRQUFHLE9BQU87UUFBcUIsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7O0VBQ2pHO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLEtBQUs7SUFDTCxRQUFRO0lBQ1IsT0FBTztNQUFDO1FBQUUsUUFBUTtRQUFHLE9BQU87UUFBcUIsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7O0VBQ2pHO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLEtBQUs7SUFDTCxRQUFRO0lBQ1IsT0FBTztNQUFDO1FBQUUsUUFBUTtRQUFHLE9BQU87UUFBc0IsUUFBUTtVQUFFLE1BQU07VUFBbUIsUUFBUTtRQUFHO01BQUU7O0VBQ25HO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLEtBQUs7SUFDTCxTQUFTO0lBQ1QsUUFBUTtJQUNSLE9BQU87TUFBQztRQUFFLFFBQVE7UUFBRyxPQUFPO1FBQWlCLFFBQVE7VUFBRSxNQUFNO1VBQW1CLFFBQVE7UUFBRztNQUFFOztFQUM5RjtFQUNBO0lBQ0MsSUFBSTtJQUNKLE1BQU07SUFDTixLQUFLO0lBQ0wsU0FBUztJQUNULE9BQU87TUFBQztRQUFFLFFBQVE7UUFBRyxPQUFPO1FBQWlCLFFBQVE7VUFBRSxNQUFNO1VBQW1CLFFBQVE7UUFBRztNQUFFOztFQUM5RjtFQUNBO0lBQ0MsSUFBSTtJQUNKLE1BQU07SUFDTixLQUFLO0lBQ0wsU0FBUztJQUNULFFBQVE7SUFDUixPQUFPO01BQUM7UUFBRSxRQUFRO1FBQUcsT0FBTztRQUFvQixRQUFRO1VBQUUsTUFBTTtVQUFrQixRQUFRO1FBQUc7TUFBRTs7RUFDaEc7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sS0FBSztJQUNMLFNBQVM7SUFDVCxRQUFRO0lBQ1IsT0FBTztNQUFDO1FBQUUsUUFBUTtRQUFHLE9BQU87UUFBd0IsUUFBUTtVQUFFLE1BQU07VUFBbUIsUUFBUTtRQUFHO01BQUU7O0VBQ3JHO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLEtBQUs7SUFDTCxTQUFTO0lBQ1QsUUFBUTtJQUNSLE9BQU87TUFBQztRQUFFLFFBQVE7UUFBRyxPQUFPO1FBQW9CLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFOztFQUNoRztFQUNBO0lBQ0MsSUFBSTtJQUNKLE1BQU07SUFDTixLQUFLO0lBQ0wsU0FBUztJQUNULFFBQVE7SUFDUixPQUFPO01BQUM7UUFBRSxRQUFRO1FBQUcsT0FBTztRQUFvQixRQUFRO1VBQUUsTUFBTTtVQUFrQixRQUFRO1FBQUc7TUFBRTs7RUFDaEc7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sS0FBSztJQUNMLFNBQVM7SUFDVCxRQUFRO0lBQ1IsT0FBTztNQUFDO1FBQUUsUUFBUTtRQUFHLE9BQU87UUFBdUIsUUFBUTtVQUFFLE1BQU07VUFBbUIsUUFBUTtRQUFHO01BQUU7O0VBQ3BHO0VBQ0E7SUFDQyxJQUFJO0lBQ0osTUFBTTtJQUNOLE9BQU87TUFDTjtRQUFFLFFBQVE7UUFBSSxPQUFPO1FBQTRCLFFBQVE7VUFBRSxNQUFNO1VBQWdCLFFBQVE7UUFBRztNQUFFO01BQzlGO1FBQUUsUUFBUTtRQUFLLE9BQU87UUFBNkIsUUFBUTtVQUFFLE1BQU07VUFBZ0IsUUFBUTtRQUFHO01BQUU7TUFDaEc7UUFBRSxRQUFRO1FBQUssT0FBTztRQUE2QixRQUFRO1VBQUUsTUFBTTtVQUFnQixRQUFRO1FBQUc7TUFBRTs7RUFFbEc7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFRLE9BQU87UUFBcUIsUUFBUTtVQUFFLE1BQU07VUFBa0IsUUFBUTtRQUFHO01BQUU7TUFDN0Y7UUFBRSxRQUFRO1FBQVMsT0FBTztRQUF1QixRQUFRO1VBQUUsTUFBTTtVQUFrQixRQUFRO1FBQUc7TUFBRTtNQUNoRztRQUFFLFFBQVE7UUFBVSxPQUFPO1FBQXdCLFFBQVE7VUFBRSxNQUFNO1VBQWtCLFFBQVE7UUFBRztNQUFFO01BQ2xHO1FBQUUsUUFBUTtRQUFXLE9BQU87UUFBeUIsUUFBUTtVQUFFLE1BQU07VUFBbUIsUUFBUTtRQUFHO01BQUU7TUFDckc7UUFBRSxRQUFRO1FBQVksT0FBTztRQUEyQixRQUFRO1VBQUUsTUFBTTtVQUFtQixRQUFRO1FBQUc7TUFBRTs7RUFFMUc7RUFDQTtJQUNDLElBQUk7SUFDSixNQUFNO0lBQ04sT0FBTztNQUNOO1FBQUUsUUFBUTtRQUFHLE9BQU87UUFBMEIsUUFBUTtVQUFFLE1BQU07VUFBcUIsUUFBUTtRQUFHO01BQUU7TUFDaEc7UUFBRSxRQUFRO1FBQUksT0FBTztRQUEyQixRQUFRO1VBQUUsTUFBTTtVQUFxQixRQUFRO1FBQUc7TUFBRTs7RUFFcEc7O0FBSU0sSUFBTSxhQUF5QixhQUFhLFFBQVEsQ0FBQyxVQUMzRCxNQUFNLE1BQU0sSUFBSSxDQUFDLE1BQU0sT0FBTztFQUM3QixJQUFJLEdBQUcsTUFBTSxFQUFFLEtBQUssQ0FBQTtFQUNwQixTQUFTLE1BQU07RUFDZixXQUFXO0VBQ1gsT0FBTyxLQUFLO0VBQ1osTUFBTSxNQUFNO0VBQ1osVUFBVSxNQUFNO0VBQ2hCLEtBQUssTUFBTTtFQUNYLFNBQVMsTUFBTTtFQUNmLFFBQVEsS0FBSztFQUNiLFFBQVEsS0FBSztFQUNiLGFBQWEsWUFBWSxLQUFLLE1BQU07QUFDckMsRUFBQyxDQUFBO0FBSUssSUFBTSx1QkFBdUIsb0JBQUksSUFBSTtFQUFDO0VBQVE7RUFBUztFQUFlO0VBQWU7RUFBVztDQUFXOzs7QUNqZTNHLElBQU0sWUFBWTs7RUFFeEIsTUFBTTtJQUFFLE9BQU87SUFBUSxVQUFVO0lBQU8sT0FBTztFQUFFO0VBQ2pELFFBQVE7SUFBRSxPQUFPO0lBQVUsVUFBVTtJQUFVLE9BQU87RUFBRztFQUN6RCxRQUFRO0lBQUUsT0FBTztJQUFVLFVBQVU7SUFBUyxPQUFPO0VBQUc7RUFDeEQsU0FBUztJQUFFLE9BQU87SUFBVyxVQUFVO0lBQVUsT0FBTztFQUFJO0VBQzVELFFBQVE7SUFBRSxPQUFPO0lBQVUsVUFBVTtJQUFTLE9BQU87RUFBSTtFQUN6RCxRQUFRO0lBQUUsT0FBTztJQUFVLFVBQVU7SUFBUyxPQUFPO0VBQUc7RUFDeEQsUUFBUTtJQUFFLE9BQU87SUFBVSxVQUFVO0lBQVMsT0FBTztFQUFJO0VBQ3pELE9BQU87SUFBRSxPQUFPO0lBQVMsVUFBVTtJQUFRLE9BQU87RUFBSTtFQUN0RCxRQUFRO0lBQUUsT0FBTztJQUFVLFVBQVU7SUFBUyxPQUFPO0VBQUs7RUFDMUQsV0FBVztJQUFFLE9BQU87SUFBYSxVQUFVO0lBQWEsT0FBTztFQUFNO0VBQ3JFLFNBQVM7SUFBRSxPQUFPO0lBQVcsVUFBVTtJQUFTLE9BQU87RUFBTTtFQUM3RCxRQUFRO0lBQUUsT0FBTztJQUFVLFVBQVU7SUFBUyxPQUFPO0VBQU87O0VBRTVELFVBQVU7SUFBRSxPQUFPO0lBQVksVUFBVTtJQUFZLE9BQU87RUFBSTtFQUNoRSxXQUFXO0lBQUUsT0FBTztJQUFhLFVBQVU7SUFBWSxPQUFPO0VBQUs7RUFDbkUsT0FBTztJQUFFLE9BQU87SUFBUyxVQUFVO0lBQVEsT0FBTztFQUFLO0VBQ3ZELGVBQWU7SUFBRSxPQUFPO0lBQWlCLFVBQVU7SUFBZ0IsT0FBTztFQUFNOztFQUVoRixPQUFPO0lBQUUsT0FBTztJQUFTLFVBQVU7SUFBUSxPQUFPO0VBQU87RUFDekQsU0FBUztJQUFFLE9BQU87SUFBVyxVQUFVO0lBQVUsT0FBTztFQUFPO0VBQy9ELFlBQVk7SUFBRSxPQUFPO0lBQWMsVUFBVTtJQUFhLE9BQU87RUFBUTtFQUN6RSxXQUFXO0lBQUUsT0FBTztJQUFhLFVBQVU7SUFBYSxPQUFPO0VBQVE7O0VBRXZFLFFBQVE7SUFBRSxPQUFPO0lBQVUsVUFBVTtJQUFTLE9BQU87RUFBTztFQUM1RCxXQUFXO0lBQUUsT0FBTztJQUFhLFVBQVU7SUFBWSxPQUFPO0VBQU87RUFDckUsU0FBUztJQUFFLE9BQU87SUFBVyxVQUFVO0lBQVUsT0FBTztFQUFRO0VBQ2hFLFdBQVc7SUFBRSxPQUFPO0lBQWEsVUFBVTtJQUFhLE9BQU87RUFBVTs7RUFFekUsT0FBTztJQUFFLE9BQU87SUFBUyxVQUFVO0lBQVEsT0FBTztFQUFRO0VBQzFELFNBQVM7SUFBRSxPQUFPO0lBQVcsVUFBVTtJQUFXLE9BQU87RUFBUTtFQUNqRSxVQUFVO0lBQUUsT0FBTztJQUFZLFVBQVU7SUFBVyxPQUFPO0VBQVU7RUFDckUsY0FBYztJQUFFLE9BQU87SUFBZ0IsVUFBVTtJQUFlLE9BQU87RUFBVztBQUNuRjs7O0FDakNBLElBQUksU0FBdUIsTUFBTSxLQUFLLElBQUc7QUFFbEMsU0FBUyxNQUFBO0FBQ2YsU0FBTyxPQUFBO0FBQ1I7OztBQ0RBLElBQUksU0FBVSxLQUFLLE9BQU0sSUFBSyxLQUFLLE9BQVE7QUFDM0MsSUFBSSxXQUFrQztBQUUvQixTQUFTLFNBQUE7QUFDZixNQUFJLFNBQVUsUUFBTyxTQUFBO0FBQ3JCLFdBQVUsU0FBUyxhQUFjO0FBQ2pDLE1BQUksSUFBSSxLQUFLLEtBQUssU0FBVSxXQUFXLElBQUssSUFBSSxNQUFBO0FBQ2hELE1BQUssSUFBSSxLQUFLLEtBQUssSUFBSyxNQUFNLEdBQUksS0FBSyxDQUFBLElBQU07QUFDN0MsV0FBUyxJQUFLLE1BQU0sUUFBUyxLQUFLO0FBQ25DO0FBWU8sU0FBUyxXQUFBO0FBQ2YsU0FBTztBQUNSO0FBRU8sU0FBUyxZQUFZLEdBQVM7QUFDcEMsV0FBUyxJQUFJO0FBQ2Q7QUFFTyxTQUFTLGFBQUE7QUFDZixTQUFRLEtBQUssT0FBTSxJQUFLLEtBQUssT0FBUTtBQUN0QztBQUdPLFNBQVMsVUFBQTtBQUNmLFNBQU8sT0FBQSxJQUFXO0FBQ25COzs7QUMzQ08sSUFBTSxXQUFXO0FBRWpCLElBQU0sZUFBZTtBQUNyQixJQUFNLHdCQUF3QjtBQUM5QixJQUFNLG9CQUFvQjtBQUMxQixJQUFNLG9CQUFvQjtBQUMxQixJQUFNLHNCQUFzQjtBQUU1QixJQUFNLGNBQWM7QUFDcEIsSUFBTSxtQkFBbUI7QUFDekIsSUFBTSxxQkFBcUI7QUFFM0IsSUFBTSxzQkFBc0I7QUFDNUIsSUFBTSx5QkFBeUI7QUFDL0IsSUFBTSwyQkFBMkI7QUFDakMsSUFBTSw4QkFBOEI7QUFFcEMsSUFBTSxpQkFBaUIsS0FBSyxLQUFLLEtBQUs7QUFHdEMsSUFBTSxrQkFBa0I7QUFDeEIsSUFBTSx3QkFBd0I7OztBQ2I5QixJQUFNLGVBQWU7QUFLckIsSUFBTSxhQUF3Qzs7O0VBR3BELEdBQUcsQ0FBQyxNQUFBO0FBQ0gsZUFBVyxPQUFPLE9BQU8sT0FBTyxFQUFFLGFBQWEsQ0FBQyxDQUFBLEdBQWlCO0FBQ2hFLGlCQUFXLE9BQU8sT0FBTyxPQUFPLElBQUksWUFBWSxDQUFDLENBQUEsR0FBaUI7QUFDakUsWUFBSSxDQUFDLElBQUksVUFBVSxPQUFPLElBQUksV0FBVyxTQUFVLEtBQUksU0FBUztVQUFFLFFBQVE7VUFBTyxVQUFVO1FBQUU7QUFDN0YsWUFBSSxJQUFJLE9BQU8sV0FBVyxPQUFXLEtBQUksT0FBTyxTQUFTO0FBQ3pELFlBQUksSUFBSSxPQUFPLGFBQWEsT0FBVyxLQUFJLE9BQU8sV0FBVztBQUM3RCxZQUFJLElBQUksWUFBWSxPQUFXLEtBQUksVUFBVTtBQUM3QyxZQUFJLENBQUMsTUFBTSxRQUFRLElBQUksS0FBSyxFQUFHLEtBQUksUUFBUSxDQUFBO01BQzVDO0lBQ0Q7QUFDQSxRQUFJLE9BQU8sRUFBRSxhQUFhLFNBQVUsR0FBRSxXQUFXLFdBQUE7QUFDakQsV0FBTztFQUNSO0FBQ0Q7QUFFTyxJQUFNLGtCQUFOLGNBQThCLE1BQUE7O0VBQ3BDLFlBQTRCLE9BQWU7QUFDMUMsVUFBTSw4Q0FBOEMsS0FBQSxzQkFBMkIsWUFBQSxJQUFnQixHQUFBLEtBRHBFLFFBQUE7QUFFM0IsU0FBSyxPQUFPO0VBQ2I7QUFDRDtBQUVPLFNBQVMsY0FBYyxHQUFVO0FBQ3ZDLFNBQU8sT0FBTyxFQUFFLFlBQVksV0FBVyxFQUFFLFVBQVU7QUFDcEQ7QUFFTyxTQUFTLFFBQVEsS0FBWTtBQUNuQyxNQUFJLElBQUk7QUFDUixNQUFJLElBQUksY0FBYyxDQUFBO0FBQ3RCLE1BQUksSUFBSSxhQUFjLE9BQU0sSUFBSSxnQkFBZ0IsQ0FBQTtBQUNoRCxTQUFPLElBQUksY0FBYztBQUN4QjtBQUNBLFFBQUksV0FBVyxDQUFBLEVBQUcsQ0FBQTtBQUNsQixNQUFFLFVBQVU7RUFDYjtBQUNBLElBQUUsVUFBVTtBQUNaLFNBQU87QUFDUjs7O0FDbERPLFNBQVMsUUFBNkIsS0FBaUI7QUFDN0QsU0FBTyxPQUFPLFFBQVEsR0FBQTtBQUN2QjtBQUVPLFNBQVMsS0FBdUIsS0FBdUI7QUFDN0QsU0FBTyxPQUFPLEtBQUssR0FBQTtBQUNwQjtBQU9PLFNBQVMsWUFBa0IsS0FBZ0IsS0FBUSxNQUFtQjtBQUM1RSxRQUFNLFdBQVcsSUFBSSxJQUFJLEdBQUE7QUFDekIsTUFBSSxhQUFhLE9BQVcsUUFBTztBQUNuQyxRQUFNLFVBQVUsS0FBSyxHQUFBO0FBQ3JCLE1BQUksSUFBSSxLQUFLLE9BQUE7QUFDYixTQUFPO0FBQ1I7OztBQ1RPLFNBQVMsVUFBVSxLQUEwQixLQUF3QjtBQUMzRSxhQUFXLE9BQU8sT0FBTyxLQUFLLEdBQUEsR0FBTTtBQUNuQyxRQUFJLElBQUksR0FBQSxNQUFTLFFBQVEsT0FBTyxJQUFJLEdBQUEsTUFBUyxZQUFZLENBQUMsTUFBTSxRQUFRLElBQUksR0FBQSxDQUFJLEdBQUc7QUFDbEYsVUFBSSxPQUFPLElBQUksR0FBQSxNQUFTLFlBQVksSUFBSSxHQUFBLE1BQVMsS0FBTSxLQUFJLEdBQUEsSUFBTyxDQUFDO0FBQ25FLGdCQUFVLElBQUksR0FBQSxHQUFNLElBQUksR0FBQSxDQUFJO0lBQzdCLE9BQU87QUFDTixVQUFJLEdBQUEsSUFBTyxJQUFJLEdBQUE7SUFDaEI7RUFDRDtBQUNBLFNBQU87QUFDUjtBQUVBLFNBQVMsaUJBQUE7QUFDUixTQUFPLE9BQU8sWUFBWSxLQUFLLFNBQUEsRUFBVyxJQUFJLENBQUMsTUFBTTtJQUFDO0lBQUc7R0FBRSxDQUFBO0FBQzVEO0FBRUEsU0FBUyxpQkFBQTtBQUNSLFNBQU8sT0FBTyxZQUNiLE9BQU8sS0FBSyxTQUFBLEVBQVcsSUFBSSxDQUFDLFdBQUE7QUFDM0IsVUFBTSxXQUFXLE9BQU8sWUFDdkIsT0FBTyxRQUFRLFVBQVUsTUFBQSxFQUFRLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxJQUFJLElBQUEsTUFBSztBQUN6RCxZQUFNLE1BQW9CO1FBQ3pCLFVBQVUsS0FBSyxrQkFBa0I7UUFDakMsU0FBUztRQUNULE9BQU8sQ0FBQTtRQUNQLFFBQVE7VUFBRSxRQUFRO1VBQU8sVUFBVTtRQUFFO01BQ3RDO0FBQ0EsYUFBTztRQUFDO1FBQUk7O0lBQ2IsQ0FBQSxDQUFBO0FBRUQsV0FBTztNQUFDO01BQVE7UUFBRSxVQUFVLFdBQVc7UUFBZTtNQUFTOztFQUNoRSxDQUFBLENBQUE7QUFFRjtBQUlPLFNBQVMsYUFBQTtBQUNmLFNBQU87SUFDTixTQUFTO0lBQ1QsVUFBVSxXQUFBO0lBQ1YsTUFBTTtJQUNOLFVBQVU7SUFDVixXQUFXLGVBQUE7SUFDWCxTQUFTO01BQUUsTUFBTTtJQUFFO0lBQ25CLE9BQU87TUFBRSxZQUFZO01BQUcsZ0JBQWdCLENBQUM7TUFBRyxzQkFBc0I7SUFBRTtJQUNwRSxVQUFVO01BQUUsV0FBVyxJQUFBLElBQVEsc0JBQXNCLE9BQUEsSUFBVztNQUF3QixhQUFhO0lBQUU7SUFDdkcsUUFBUTtNQUFFLFFBQVEsQ0FBQTtNQUFJLFdBQVcsQ0FBQTtNQUFJLFdBQVcsQ0FBQztNQUFHLFNBQVM7SUFBRTtJQUMvRCxVQUFVO01BQ1QsTUFBTTtNQUNOLFNBQVMsQ0FBQTtNQUNULG1CQUFtQixDQUFBO01BQ25CLGVBQWUsQ0FBQTtNQUNmLGtCQUFrQjtRQUNqQixZQUFZO1FBQ1osZ0JBQWdCLENBQUM7UUFDakIsaUJBQWlCO1FBQ2pCLFlBQVk7UUFDWixtQkFBbUIsQ0FBQztRQUNwQixxQkFBcUIsQ0FBQztRQUN0QixzQkFBc0I7TUFDdkI7SUFDRDtJQUNBLFdBQVcsZUFBQTtFQUNaO0FBQ0Q7QUFHTyxJQUFJLFFBQW1CLFdBQUE7QUFFdkIsU0FBUyxTQUFTLE1BQWU7QUFDdkMsVUFBUTtBQUNUO0FBU08sSUFBTSxVQUFtQjtFQUMvQixZQUFZO0VBQ1osZ0JBQWdCLENBQUM7RUFDakIsa0JBQWtCO0FBQ25COzs7QUM3RkEsSUFBTSxXQUFXLG9CQUFJLElBQUE7QUFFZCxTQUFTLEdBQUcsTUFBYyxJQUFXO0FBQzNDLE1BQUksTUFBTSxTQUFTLElBQUksSUFBQTtBQUN2QixNQUFJLENBQUMsS0FBSztBQUNULFVBQU0sb0JBQUksSUFBQTtBQUNWLGFBQVMsSUFBSSxNQUFNLEdBQUE7RUFDcEI7QUFDQSxNQUFJLElBQUksRUFBQTtBQUNSLFNBQU8sTUFBQTtBQUNOLGFBQVMsSUFBSSxJQUFBLEdBQU8sT0FBTyxFQUFBO0VBQzVCO0FBQ0Q7QUFFTyxTQUFTLEtBQUssTUFBYyxTQUFpQjtBQUNuRCxRQUFNLE1BQU0sU0FBUyxJQUFJLElBQUE7QUFDekIsTUFBSSxDQUFDLElBQUs7QUFDVixhQUFXLE1BQU0sSUFBSyxJQUFHLE9BQUE7QUFDMUI7QUFFQSxJQUFJLFFBQVE7QUFHTCxTQUFTLFNBQVMsT0FBYztBQUN0QyxVQUFRO0FBQ1Q7QUFFTyxTQUFTLFNBQVMsS0FBVztBQUNuQyxNQUFJLE1BQU87QUFDWCxPQUFLLFlBQVksR0FBQTtBQUNsQjtBQUVPLFNBQVMsZ0JBQUE7QUFDZixPQUFLLFFBQUE7QUFDTjs7O0FDbENBLElBQUksVUFBaUM7QUFFOUIsU0FBUyxXQUFXLEdBQXdCO0FBQ2xELFlBQVU7QUFDWDtBQUVPLFNBQVMsUUFBUSxLQUFXO0FBQ2xDLE1BQUksQ0FBQyxRQUFTLFFBQU87QUFDckIsTUFBSTtBQUNILFdBQU8sUUFBUSxRQUFRLEdBQUE7RUFDeEIsUUFBUTtBQUNQLFdBQU87RUFDUjtBQUNEO0FBRU8sU0FBUyxRQUFRLEtBQWEsT0FBYTtBQUNqRCxNQUFJLENBQUMsUUFBUztBQUNkLE1BQUk7QUFDSCxZQUFRLFFBQVEsS0FBSyxLQUFBO0VBQ3RCLFFBQVE7RUFFUjtBQUNEO0FBRU8sU0FBUyxXQUFXLEtBQVc7QUFDckMsTUFBSSxDQUFDLFFBQVM7QUFDZCxNQUFJO0FBQ0gsWUFBUSxXQUFXLEdBQUE7RUFDcEIsUUFBUTtFQUVSO0FBQ0Q7OztBQzdCTyxTQUFTLGFBQUE7QUFDZixTQUFPLEtBQUssU0FBQSxFQUFXLE9BQU8sQ0FBQyxLQUFLLE1BQU0sT0FBTyxNQUFNLFVBQVUsQ0FBQSxLQUFNLElBQUksQ0FBQTtBQUM1RTtBQUVPLFNBQVMsYUFBQTtBQUNmLFFBQU0sT0FBTyxNQUFNLFFBQVEsT0FBTyxpQkFBaUIsY0FBQTtBQUNuRCxNQUFJLFFBQVEsRUFBRyxRQUFPO0FBQ3RCLFNBQU8seUJBQTBCLE9BQU8sS0FBSztBQUM5QztBQUVPLFNBQVMsaUJBQUE7QUFDZixRQUFNLE9BQU8sTUFBTSxRQUFRLE9BQU8saUJBQWlCLGNBQUE7QUFDbkQsTUFBSSxRQUFRLEVBQUcsUUFBTztBQUN0QixTQUFPLFdBQUEsSUFBZTtBQUN2QjtBQUVPLFNBQVMscUJBQUE7QUFDZixTQUFPLEtBQUssTUFBTSxvQkFBb0IsS0FBSyxJQUFJLHFCQUFxQixNQUFNLFFBQVEsSUFBSSxDQUFBO0FBQ3ZGO0FBRU8sU0FBUyxhQUFhLFFBQWdCLFlBQXNCO0FBQ2xFLFFBQU0sSUFBSSxNQUFNLFVBQVUsTUFBQSxFQUFRLFNBQVMsVUFBQSxFQUFZLE1BQU07QUFDN0QsUUFBTSxNQUFNLFVBQVUsTUFBQSxFQUFRLG9CQUFvQjtBQUNsRCxRQUFNLE9BQU8sVUFBVSxNQUFBLEVBQVEsU0FBUyxVQUFBLEVBQVksZUFBZSxLQUFLLElBQUksS0FBSyxDQUFBO0FBQ2pGLFNBQU8sS0FBSyxNQUFNLE9BQU8scUJBQUEsQ0FBQTtBQUMxQjtBQUVPLFNBQVMsYUFBYSxRQUFnQixZQUFzQjtBQUNsRSxRQUFNLElBQUksTUFBTSxVQUFVLE1BQUEsRUFBUSxTQUFTLFVBQUEsRUFBWSxNQUFNO0FBQzdELE1BQUksTUFBTSxFQUFHLFFBQU87QUFDcEIsUUFBTSxNQUFNLFVBQVUsTUFBQSxFQUFRLG9CQUFvQjtBQUNsRCxRQUFNLE9BQU8sVUFBVSxNQUFBLEVBQVEsU0FBUyxVQUFBLEVBQVksZUFBZSxLQUFLLElBQUksS0FBSyxJQUFJLENBQUE7QUFDckYsU0FBTyxLQUFLLE1BQU0sT0FBTyxxQkFBQSxDQUFBO0FBQzFCO0FBRU8sU0FBUyxXQUFXLFFBQWdCLFlBQXNCO0FBQ2hFLFNBQU8sS0FBSyxNQUFNLGFBQWEsUUFBUSxVQUFBLElBQWMsZUFBQTtBQUN0RDtBQUVPLFNBQVMsYUFBYSxhQUF3QjtBQUNwRCxTQUFPLEtBQUssTUFBTSxVQUFVLFdBQUEsRUFBYSxRQUFRLGlCQUFBLENBQUE7QUFDbEQ7QUFFTyxTQUFTLFVBQVUsUUFBYztBQUN2QyxTQUFPLEtBQUssTUFBTSxVQUFVLE1BQUEsRUFBUSxZQUFZLHNCQUFBLENBQUE7QUFDakQ7QUFFTyxTQUFTLFdBQVcsUUFBZ0IsWUFBc0I7QUFDaEUsU0FBTyxLQUFLLE1BQU0sVUFBVSxNQUFBLEVBQVEsU0FBUyxVQUFBLEVBQVksYUFBYSx1QkFBQSxDQUFBO0FBQ3ZFO0FBR08sU0FBUyxrQkFBa0IsUUFBYztBQUMvQyxRQUFNLElBQUksVUFBVSxNQUFBLEVBQVE7QUFDNUIsTUFBSSxDQUFDLEVBQUcsUUFBTztBQUNmLFFBQU0sTUFBTSxNQUFNLFVBQVUsRUFBRSxRQUFRO0FBQ3RDLE1BQUksQ0FBQyxLQUFLLFNBQVUsUUFBTztBQUMzQixNQUFJLEVBQUUsV0FBVyxDQUFDLElBQUksU0FBUyxFQUFFLE9BQU8sR0FBRyxTQUFVLFFBQU87QUFDNUQsU0FBTztBQUNSO0FBRU8sU0FBUyxpQkFBaUIsTUFBZ0I7QUFDaEQsU0FBTyxNQUFNLFNBQVMsUUFBUSxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsSUFBQSxFQUFNLE9BQU8sQ0FBQyxHQUFHLE1BQU0sSUFBSSxFQUFFLFFBQVEsQ0FBQTtBQUM3RjtBQUVPLFNBQVMsZ0JBQWdCLE1BQWdCO0FBQy9DLFFBQU0sVUFBVSxNQUFNLFNBQVMsUUFBUSxPQUFPLENBQUMsTUFBTSxFQUFFLFNBQVMsSUFBQTtBQUNoRSxNQUFJLFNBQVMsb0JBQW9CLFNBQVMscUJBQXFCLFNBQVMsb0JBQXFCLFFBQU8sUUFBUSxPQUFPLENBQUMsR0FBRyxNQUFNLEtBQUssSUFBSSxFQUFFLFNBQVMsTUFBTSxDQUFBO0FBQ3ZKLFNBQU8sUUFBUSxPQUFPLENBQUMsR0FBRyxNQUFNLEtBQUssSUFBSSxFQUFFLFNBQVMsTUFBTSxDQUFBO0FBQzNEO0FBRU8sSUFBTSx1QkFBdUIsTUFBYyxnQkFBZ0IsZUFBQTtBQUMzRCxJQUFNLG1CQUFtQixNQUFjLGdCQUFnQixnQkFBQTtBQUN2RCxJQUFNLHdCQUF3QixNQUFjLGdCQUFnQixnQkFBQTtBQUM1RCxJQUFNLHlCQUF5QixNQUFjLGdCQUFnQixpQkFBQTtBQUM3RCxJQUFNLG9CQUFvQixNQUFjLGdCQUFnQixpQkFBQTtBQUN4RCxJQUFNLHVCQUF1QixNQUFjLGdCQUFnQixtQkFBQTtBQUUzRCxTQUFTLHVCQUFBO0FBQ2YsTUFBSSxXQUFXO0FBQ2YsYUFBVyxVQUFVLE9BQU8sS0FBSyxTQUFBLEdBQVk7QUFDNUMsVUFBTSxNQUFNLE1BQU0sVUFBVSxNQUFBO0FBQzVCLFFBQUksQ0FBQyxLQUFLLFNBQVU7QUFDcEIsZUFBVyxXQUFXLE9BQU8sS0FBSyxVQUFVLE1BQUEsRUFBUSxRQUFRLEdBQUc7QUFDOUQsWUFBTSxNQUFNLElBQUksU0FBUyxPQUFBO0FBQ3pCLFVBQUksQ0FBQyxLQUFLLFNBQVU7QUFDcEIsWUFBTSxRQUFRLFVBQVUsVUFBVSxNQUFBLEVBQVEsU0FBUyxPQUFBLEVBQVMsU0FBUyxFQUFFO0FBQ3ZFLFVBQUksUUFBUSxTQUFVLFlBQVc7SUFDbEM7RUFDRDtBQUNBLFNBQU8sV0FBVyxPQUFPLEtBQUssTUFBTSxVQUFVLFFBQVE7QUFDdkQ7QUFFTyxTQUFTLHdCQUFBO0FBQ2YsUUFBTSxjQUErQixDQUFBO0FBQ3JDLFFBQU0sY0FBb0QsQ0FBQztBQUMzRCxRQUFNLGNBQW9ELENBQUM7QUFDM0QsUUFBTSxpQkFBaUIsa0JBQUE7QUFDdkIsYUFBVyxDQUFDLFFBQVEsR0FBQSxLQUFRLFFBQVEsU0FBQSxHQUFZO0FBQy9DLFVBQU0sTUFBTSxNQUFNLFVBQVUsTUFBQTtBQUM1QixRQUFJLENBQUMsS0FBSyxTQUFVO0FBQ3BCLGVBQVcsQ0FBQyxZQUFZLElBQUEsS0FBUyxRQUFRLElBQUksUUFBUSxHQUFHO0FBQ3ZELFlBQU0sTUFBTSxJQUFJLFNBQVMsVUFBQTtBQUN6QixVQUFJLENBQUMsS0FBSyxTQUFVO0FBQ3BCLFlBQU0sSUFBSSxJQUFJLE1BQU07QUFDcEIsa0JBQVksS0FBSztRQUNoQixhQUFhLEtBQUs7UUFDbEIsU0FBUyxJQUFJO1FBQ2IsT0FBTztRQUNQLFdBQVcsS0FBSztRQUNoQixhQUFhLEtBQUs7TUFDbkIsQ0FBQTtBQUNBLFVBQUksQ0FBQyxJQUFJLFdBQVcsTUFBTSxFQUFHO0FBQzdCLFlBQU0sZ0JBQWdCLEtBQUssY0FBYztBQUN6QyxrQkFBWSxLQUFLLFNBQVMsS0FBSyxZQUFZLEtBQUssU0FBUyxLQUFLLEtBQUssSUFBSSxLQUFLLFlBQVksTUFBUTtBQUNoRyxpQkFBVyxDQUFDLFVBQVUsUUFBQSxLQUFhLFFBQVEsS0FBSyxNQUFNLEdBQWtDO0FBQ3ZGLG9CQUFZLFFBQUEsS0FBYSxZQUFZLFFBQUEsS0FBYSxLQUFLLElBQUksV0FBVyxNQUFRO01BQy9FO0lBQ0Q7RUFDRDtBQUNBLFFBQU0sV0FBVyxPQUFPLEtBQUssV0FBQSxFQUFhLFNBQVM7QUFDbkQsUUFBTSxVQUFVLE1BQU0sS0FDckIsb0JBQUksSUFBSTtPQUNKLEtBQUssV0FBQTtPQUNMLEtBQUssV0FBQTtHQUNSLENBQUE7QUFFRixRQUFNLFdBQWdDLFFBQVEsT0FBTyxDQUFDLGdCQUFnQixVQUFVLFdBQUEsQ0FBWSxFQUFFLElBQUksQ0FBQyxpQkFBaUI7SUFDbkg7SUFDQSxRQUFRLFlBQVksV0FBQSxLQUFnQjtJQUNwQyxRQUFRLFlBQVksV0FBQSxLQUFnQjtJQUNwQyxNQUFNLFlBQVksV0FBQSxLQUFnQixNQUFNLFlBQVksV0FBQSxLQUFnQjtFQUNyRSxFQUFDO0FBQ0QsUUFBTSxXQUFXLFNBQVMsT0FBTyxDQUFDLFVBQVUsTUFBTSxTQUFTLEtBQUssTUFBTSxNQUFNLEtBQUMsRUFBTSxLQUFLLENBQUMsR0FBRyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUc7QUFDL0csUUFBTSxjQUFjLE9BQU8sT0FBTyxXQUFBLEVBQWEsT0FBTyxDQUFDLEtBQWEsVUFBVSxPQUFPLFNBQVMsSUFBSSxDQUFBO0FBQ2xHLFFBQU0sY0FBYyxlQUFlLElBQUksSUFBSSxTQUFTLE9BQU8sQ0FBQyxVQUFVLE1BQU0sU0FBUyxDQUFBLEVBQUcsT0FBTyxDQUFDLEtBQUssVUFBQTtBQUNwRyxVQUFNLFdBQVcsS0FBSyxJQUFJLE1BQU0sU0FBUyxNQUFNLFFBQVEsQ0FBQTtBQUN2RCxXQUFPLE1BQU8sTUFBTSxTQUFTO0VBQzlCLEdBQUcsQ0FBQTtBQUNILFFBQU0sZ0JBQWdCLGVBQWUsSUFBSSxPQUFPLEtBQUssTUFBTyxjQUFjLGNBQWUsR0FBQTtBQUN6RixTQUFPO0lBQUU7SUFBYTtJQUFVO0lBQVU7SUFBVTtFQUFjO0FBQ25FO0FBRU8sU0FBUyxtQkFBQTtBQUNmLFFBQU0sRUFBRSxTQUFRLElBQUssc0JBQUE7QUFDckIsUUFBTSxhQUFtRCxDQUFDO0FBQzFELGFBQVcsS0FBSyxTQUFVLFlBQVcsRUFBRSxXQUFXLElBQUksRUFBRTtBQUN4RCxNQUFJLE9BQWtDO0FBQ3RDLE1BQUksWUFBWTtBQUNoQixhQUFXLENBQUMsSUFBSSxHQUFBLEtBQVEsUUFBUSxNQUFNLFNBQVMsR0FBRztBQUNqRCxRQUFJLENBQUMsSUFBSSxTQUFVO0FBQ25CLGVBQVcsQ0FBQyxJQUFJLElBQUEsS0FBUyxRQUFRLFVBQVUsRUFBQSxFQUFJLFFBQVEsR0FBRztBQUN6RCxVQUFJLENBQUMsSUFBSSxTQUFTLEVBQUEsRUFBSSxTQUFVO0FBQ2hDLFlBQU0sT0FBTyxhQUFhLElBQUksRUFBQTtBQUM5QixVQUFJLFFBQVEsRUFBRztBQUNmLFlBQU0sYUFBYSxLQUFLLFlBQVksTUFBUSxLQUFLO0FBQ2pELFVBQUksUUFBUyxhQUFhLGFBQWEsS0FBSyxTQUFTLElBQUs7QUFDMUQsWUFBTSxVQUFVLFdBQVcsS0FBSyxTQUFTO0FBQ3pDLFVBQUksWUFBWSxPQUFXLFVBQVMsSUFBSSxLQUFLLElBQUksT0FBQTtBQUNqRCxVQUFJLFFBQVEsV0FBVztBQUN0QixvQkFBWTtBQUNaLGVBQU87VUFDTixRQUFRO1VBQ1IsWUFBWTtVQUNaO1VBQ0EsT0FBTyxVQUFVLEtBQUssU0FBUyxFQUFFO1VBQ2pDLFdBQVcsWUFBWTtRQUN4QjtNQUNEO0lBQ0Q7RUFDRDtBQUNBLFNBQU87QUFDUjtBQUVPLFNBQVMsd0JBQUE7QUFDZixTQUFPLE9BQU8sS0FBSyxTQUFBLEVBQVcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLFVBQVUsQ0FBQSxFQUFHLFlBQVksa0JBQWtCLENBQUEsQ0FBQTtBQUM3Rjs7O0FDbExPLFNBQVMsYUFBYSxRQUE0QztBQUN4RSxTQUFPLFFBQVEsTUFBQSxFQUNiLElBQUksQ0FBQyxDQUFDLEdBQUcsR0FBQSxNQUFTLEdBQUcsSUFBSSxlQUFjLENBQUEsSUFBTSxRQUFRLElBQUksVUFBVSxDQUFBLEVBQUcsV0FBVyxVQUFVLENBQUEsRUFBRyxLQUFLLEVBQUUsRUFDckcsS0FBSyxJQUFBO0FBQ1I7QUFFTyxTQUFTLG1CQUFtQixhQUEwQixRQUFjO0FBQzFFLFNBQU8sV0FBVyxJQUFJLFVBQVUsV0FBQSxFQUFhLFdBQVcsVUFBVSxXQUFBLEVBQWE7QUFDaEY7QUFTTyxTQUFTLG9CQUFvQixPQUFlLFdBQW1CLGFBQXFCLFFBQTBCLElBQUksUUFBUSxPQUFLO0FBQ3JJLFFBQU0sUUFBUSxRQUFRO0FBQ3RCLFFBQU0saUJBQWlCLGtCQUFBO0FBQ3ZCLFFBQU0sZ0JBQWdCLGNBQWM7QUFDcEMsUUFBTSxhQUFhLGdCQUFnQjtBQUNuQyxRQUFNLFNBQVMsUUFBUSxLQUFLO0FBQzVCLFFBQU0sWUFBWSxPQUFPLGVBQWUsUUFBVztJQUFFLHVCQUF1QjtJQUFHLHVCQUF1QjtFQUFFLENBQUEsRUFBRyxRQUFRLFFBQVEsRUFBQTtBQUMzSCxRQUFNLGNBQWMsV0FBVyxlQUFlLFFBQVc7SUFBRSx1QkFBdUI7SUFBRyx1QkFBdUI7RUFBRSxDQUFBLEVBQUcsUUFBUSxRQUFRLEVBQUE7QUFDakksUUFBTSxXQUFXLEdBQUcsV0FBQSxJQUFlLGVBQWUsSUFBSSxXQUFXLFNBQUE7QUFDakUsUUFBTSxPQUFPLFFBQVMsVUFBVSxJQUFJLFVBQVUsS0FBQSxFQUFPLFdBQVcsVUFBVSxLQUFBLEVBQU8sUUFBUztBQUMxRixNQUFJLE1BQU8sUUFBTyxHQUFHLE1BQU0sZUFBYyxDQUFBLEdBQUssT0FBTyxNQUFNLE9BQU8sRUFBQSxVQUFZLFFBQUE7QUFDOUUsU0FBTyxHQUFHLE1BQU0sZUFBYyxDQUFBLEdBQUssT0FBTyxNQUFNLE9BQU8sRUFBQSxVQUFZLFFBQUEsS0FBYSxTQUFBO0FBQ2pGO0FBVU8sU0FBUyxVQUFVLEdBQVM7QUFDbEMsU0FBTyxFQUFFLGVBQWM7QUFDeEI7OztBQ3BCQSxJQUFNLFdBQThCLE9BQU8sUUFBUSxTQUFBLEVBQVcsUUFBUSxDQUFDLENBQUMsUUFBUSxHQUFBLE1BQy9FLE9BQU8sUUFBUSxJQUFJLFFBQVEsRUFBRSxJQUFJLENBQUMsQ0FBQyxZQUFZLElBQUEsTUFBSztBQUNuRCxRQUFNLFNBQVMsS0FBSztBQUNwQixRQUFNLFlBQVksT0FBTyxLQUFLLE1BQUE7QUFDOUIsUUFBTSxZQUFZLFVBQVUsSUFBSSxDQUFDLE1BQU0sT0FBTyxDQUFBLENBQUU7QUFDaEQsUUFBTSxXQUFXLFVBQVUsT0FBTyxDQUFDLEdBQUcsTUFBTSxJQUFJLEdBQUcsQ0FBQTtBQUNuRCxRQUFNLFFBQVEsVUFBVSxLQUFLLFNBQVMsRUFBRTtBQUN4QyxTQUFPO0lBQ047SUFDQTtJQUNBLFdBQVcsS0FBSztJQUNoQixXQUFXLEtBQUs7SUFDaEIsY0FBYyxLQUFLLGNBQWM7SUFDakM7SUFDQTtJQUNBLFdBQVcsS0FBSyxZQUFZO0lBQzVCLFVBQVUsR0FBRyxNQUFBLElBQVUsVUFBQTtJQUN2QixpQkFBaUIsR0FBRyxLQUFBO0lBQ3BCLGVBQWUsR0FBRyxLQUFBLG1CQUF3QixhQUFhLEtBQUssTUFBTSxDQUFBO0VBQ25FO0FBQ0QsQ0FBQSxDQUFBO0FBSUQsSUFBTSxtQkFBbUI7QUFFekIsU0FBUyxZQUFZLEdBQW9CLFNBQWU7QUFDdkQsUUFBTSxPQUFPLFFBQVEsZUFBZSxFQUFFLFFBQVE7QUFDOUMsTUFBSSxDQUFDLE1BQU07QUFDVixZQUFRLGVBQWUsRUFBRSxRQUFRLElBQUk7RUFDdEMsV0FBVyxTQUFTLFdBQVc7QUFDOUIsWUFBUSxlQUFlLEVBQUUsUUFBUSxJQUFJO0FBQ3JDLFFBQUksUUFBUSxxQkFBcUIsRUFBRSxPQUFRLFVBQVMsT0FBQTtFQUNyRDtBQUNEO0FBT08sU0FBUyxpQkFBaUIsVUFBZ0I7QUFDaEQsUUFBTSxZQUFZLGtCQUFBO0FBQ2xCLFFBQU0sTUFBTSxXQUFBO0FBQ1osUUFBTSxNQUFNLE1BQU07QUFHbEIsTUFBSSxRQUFRLFdBQUE7QUFDWixNQUFJLE9BQU87QUFDWCxhQUFXLEtBQUssVUFBVTtBQUN6QixVQUFNLE1BQU0sTUFBTSxVQUFVLEVBQUUsTUFBTTtBQUNwQyxRQUFJLENBQUMsSUFBSSxTQUFVO0FBQ25CLFVBQU0sTUFBTSxJQUFJLFNBQVMsRUFBRSxVQUFVO0FBQ3JDLFFBQUksQ0FBQyxJQUFJLFNBQVU7QUFDbkIsUUFBSSxDQUFDLElBQUksU0FBUztBQUNqQixVQUFJLElBQUksT0FBTyxRQUFRO0FBQ3RCLFlBQUksT0FBTyxTQUFTO0FBQ3BCLFlBQUksT0FBTyxXQUFXO01BQ3ZCO0FBQ0E7SUFDRDtBQUNBLFVBQU0sV0FBVyxFQUFFLGVBQWU7QUFDbEMsVUFBTSxVQUFVLFdBQVc7QUFDM0IsVUFBTSxFQUFFLFdBQVcsV0FBVyxXQUFXLFdBQVcsVUFBUyxJQUFLO0FBQ2xFLFVBQU0sYUFBYSxVQUFVO0FBQzdCLGVBQVcsUUFBUSxJQUFJLE9BQU87QUFDN0IsWUFBTSxTQUFTLEtBQUs7QUFDcEIsV0FBSyxZQUFZO0FBQ2pCLGFBQU8sS0FBSyxZQUFZLEdBQUs7QUFJNUIsWUFBSSxZQUFZLEtBQUssUUFBUSxZQUFZLEtBQUs7QUFDN0MsZUFBSyxXQUFXO0FBQ2hCLHNCQUFZLEdBQUcsRUFBRSxlQUFlO0FBQ2hDO1FBQ0Q7QUFDQSxZQUFJLFVBQVU7QUFDZCxpQkFBUyxJQUFJLEdBQUcsSUFBSSxZQUFZLEtBQUs7QUFDcEMsY0FBSSxJQUFJLFVBQVUsQ0FBQSxDQUFFLElBQUksVUFBVSxDQUFBLEdBQUk7QUFDckMsc0JBQVU7QUFDVjtVQUNEO1FBQ0Q7QUFDQSxZQUFJLFNBQVM7QUFDWixlQUFLLFdBQVc7QUFDaEIsc0JBQVksR0FBRyxFQUFFLGFBQWE7QUFDOUI7UUFDRDtBQUNBLGFBQUssWUFBWTtBQUNqQixpQkFBUyxJQUFJLEdBQUcsSUFBSSxZQUFZLElBQUssS0FBSSxVQUFVLENBQUEsQ0FBRSxLQUFLLFVBQVUsQ0FBQTtBQUNwRSxZQUFJLFNBQUEsS0FBYztBQUNsQixpQkFBUztBQUNULFlBQUksUUFBUSxlQUFlLEVBQUUsUUFBUSxNQUFNLE9BQVcsUUFBTyxRQUFRLGVBQWUsRUFBRSxRQUFRO0FBQzlGLGVBQU87TUFDUjtBQUNBLFVBQUksS0FBSyxhQUFhLE9BQVEsUUFBTztJQUN0QztBQUNBLFFBQUksSUFBSSxPQUFPLFFBQVE7QUFDdEIsYUFBTztBQUNQLFVBQUksT0FBTyxZQUFZO0FBQ3ZCLFVBQUksSUFBSSxPQUFPLFlBQVksR0FBSztBQUMvQixZQUFJLE9BQU8sV0FBVztBQUN0QixZQUFJLE9BQU8sU0FBUztBQUNwQixpQkFBUyxJQUFJLEdBQUcsSUFBSSxZQUFZLElBQUssS0FBSSxVQUFVLENBQUEsQ0FBRSxLQUFLLFVBQVUsQ0FBQTtBQUNwRSxZQUFJLFNBQUEsS0FBYztBQUNsQixpQkFBUztBQUNULGlCQUFTLEdBQUcsVUFBVSxTQUFBLEVBQVcsUUFBUSxZQUFZO01BQ3REO0lBQ0Q7RUFDRDtBQUNBLFNBQU87QUFDUjs7O0FDbElPLFNBQVMsZ0JBQWdCLE1BQVk7QUFDM0MsTUFBSSxNQUFNLFNBQVMsZUFBZSxPQUFPLE1BQU0sU0FBUyxhQUFhO0FBQ3BFLFVBQU0sU0FBUyxjQUFjO0FBQzdCLFNBQUssaUJBQUE7RUFDTjtBQUNBLE1BQUksQ0FBQyxNQUFNLFNBQVMsZUFBZSxPQUFPLE1BQU0sU0FBUyxXQUFXO0FBQ25FLFVBQU0sV0FBVywyQkFBMkIsT0FBQSxJQUFXO0FBQ3ZELFVBQU0sU0FBUyxjQUFjLE9BQU87QUFDcEMsVUFBTSxTQUFTLFlBQVksT0FBTyxzQkFBc0IsT0FBQSxJQUFXO0FBQ25FLGFBQVMsc0NBQXNDLEtBQUssTUFBTSxXQUFXLEdBQUEsQ0FBQSxXQUFnQjtBQUNyRixTQUFLLGlCQUFBO0VBQ047QUFDRDs7O0FDWk8sSUFBTSxVQUFVO0FBQ3ZCLElBQU0sV0FBVyxVQUFVO0FBSXBCLFNBQVMsVUFBVSxVQUFrQixTQUFTLFVBQVE7QUFDNUQsTUFBSSxNQUFNLGFBQWEsTUFBTTtBQUM1QixVQUFNLFdBQVc7QUFDakIsV0FBTztFQUNSO0FBQ0EsTUFBSSxXQUFXLE1BQU0sVUFBVTtBQUU5QixVQUFNLFdBQVc7QUFDakIsV0FBTztFQUNSO0FBQ0EsTUFBSSxRQUFRO0FBR1osTUFBSSxpQkFBaUI7QUFDckIsU0FBTyxXQUFXLE1BQU0sWUFBWSxXQUFXLFFBQVEsUUFBUTtBQUM5RCxVQUFNLFlBQVk7QUFDbEIsb0JBQWdCLE1BQU0sUUFBUTtBQUM5QixRQUFJLGVBQWdCLGtCQUFpQixpQkFBaUIsUUFBQTtBQUN0RDtFQUNEO0FBQ0EsU0FBTztBQUNSOzs7QUNyQkEsSUFBSSxjQUFjO0FBTVgsU0FBUyxPQUFBO0FBQ2YsTUFBSSxZQUFhO0FBQ2pCLFFBQU0sV0FBVyxTQUFBO0FBQ2pCLEVBQVEsUUFBUSxVQUFVLEtBQUssVUFBVSxLQUFBLENBQUE7QUFDMUM7QUFNTyxTQUFTLGFBQWEsTUFBWTtBQUN4QyxFQUFRLFFBQVEsVUFBVSxJQUFBO0FBQzNCO0FBRU8sU0FBUyxZQUFBO0FBQ2YsZ0JBQWM7QUFDZCxFQUFRLFdBQVcsUUFBQTtBQUNwQjtBQUVPLFNBQVMsT0FBQTtBQUNmLFFBQU0sTUFBYyxRQUFRLFFBQUE7QUFDNUIsTUFBSSxDQUFDLElBQUs7QUFDVixNQUFJO0FBQ0osTUFBSTtBQUNILGFBQVMsS0FBSyxNQUFNLEdBQUE7RUFDckIsU0FBUyxHQUFHO0FBQ1gsWUFBUSxNQUFNLDJDQUEyQyxDQUFBO0FBQ3pELGFBQVMsV0FBQSxDQUFBO0FBQ1Q7RUFDRDtBQUNBLE1BQUk7QUFDSixNQUFJO0FBQ0gsZUFBVyxRQUFRLE1BQUE7RUFDcEIsU0FBUyxHQUFHO0FBQ1gsUUFBSSxhQUFhLGlCQUFpQjtBQUNqQyxvQkFBYztBQUNkLGNBQVEsTUFBTSxFQUFFLE9BQU87QUFDdkIsZUFBUyxXQUFBLENBQUE7QUFDVCxlQUFTLDJGQUFBO0FBQ1Q7SUFDRDtBQUNBLFVBQU07RUFDUDtBQUNBLFFBQU0sUUFBUSxXQUFBO0FBQ2QsWUFBVSxPQUE2QyxRQUFBO0FBQ3ZELFFBQU0sV0FBVyxNQUFNO0FBQ3ZCLFdBQVMsS0FBQTtBQUNULGNBQVksTUFBTSxRQUFRO0FBQzFCLFVBQVEsYUFBYSxjQUFBO0FBQ3JCLE1BQUksYUFBYSxLQUFNLHNCQUFBO0FBQ3hCO0FBRUEsU0FBUyxnQkFBQTtBQUNSLE1BQUksUUFBUTtBQUNaLGFBQVcsT0FBTyxPQUFPLE9BQU8sTUFBTSxTQUFTLEdBQUc7QUFDakQsZUFBVyxPQUFPLE9BQU8sT0FBTyxJQUFJLFFBQVEsR0FBRztBQUM5QyxpQkFBVyxRQUFRLElBQUksT0FBTztBQUM3QixZQUFJLEtBQUssS0FBSyxNQUFPLFNBQVEsS0FBSztNQUNuQztJQUNEO0VBQ0Q7QUFDQSxTQUFPO0FBQ1I7QUFNTyxTQUFTLHVCQUFBO0FBQ2YsTUFBSSxNQUFNLGFBQWEsS0FBTSxRQUFPO0FBQ3BDLFFBQU0sU0FBUyxJQUFBO0FBQ2YsUUFBTSxPQUFPLFNBQVMsTUFBTTtBQUM1QixNQUFJLE9BQU8sUUFBUyxRQUFPO0FBQzNCLE1BQUksT0FBTyxlQUFnQixPQUFNLFdBQVcsU0FBUztBQUNyRCxRQUFNLFNBQVMsV0FBQTtBQUNmLFdBQVMsSUFBQTtBQUNULE1BQUk7QUFDSCxjQUFVLE1BQUE7RUFDWCxVQUFBO0FBQ0MsYUFBUyxLQUFBO0VBQ1Y7QUFDQSxRQUFNLFdBQVc7QUFDakIsUUFBTSxTQUFTLFdBQUEsSUFBZTtBQUM5QixNQUFJLFNBQVMsRUFBRyxVQUFTLHVDQUF1QyxPQUFPLGVBQWMsQ0FBQSw2QkFBK0I7QUFDcEgsU0FBTztBQUNSOzs7QUN4RUEsSUFBTSxjQUFjO0FBRXBCLElBQUlBLFdBQTBCLENBQUE7QUFDOUIsSUFBSSxhQUFzQjtBQUMxQixJQUFJLFlBQVk7QUFDaEIsSUFBSSxPQUFPO0FBQ1gsSUFBSSxZQUFZO0FBRVQsU0FBUyxlQUFlLGVBQXdCLFNBQWU7QUFDckUsRUFBQUEsV0FBVSxDQUFBO0FBQ1YsZUFBYTtBQUNiLGNBQVksSUFBQTtBQUNaLFNBQU87QUFDUCxjQUFZO0FBQ2I7QUFVTyxTQUFTLE9BQU8sV0FBbUIsUUFBc0I7QUFDL0QsTUFBSSxDQUFDLFVBQVc7QUFDaEIsTUFBSUMsU0FBUSxVQUFVLFlBQWEsQ0FBQUEsU0FBUSxNQUFLO0FBQ2hELEVBQUFBLFNBQVEsS0FBSyxPQUFPLFNBQVMsSUFBSTtJQUFFLEdBQUcsSUFBQTtJQUFPLEdBQUc7SUFBUSxHQUFHO0VBQU8sSUFBSTtJQUFFLEdBQUcsSUFBQTtJQUFPLEdBQUc7RUFBTyxDQUFBO0FBQzdGO0FBRU8sU0FBUyxlQUFBO0FBQ2YsTUFBSSxlQUFlLEtBQU0sUUFBTztBQUNoQyxTQUFPO0lBQUUsUUFBUTtJQUFHO0lBQVc7SUFBTTtJQUFZLFNBQVM7U0FBSUE7O0VBQVM7QUFDeEU7QUFFTyxTQUFTLGFBQUE7QUFDZixTQUFPQSxTQUFRO0FBQ2hCOzs7QUN2RE8sU0FBUyxVQUFVLElBQVU7QUFDbkMsU0FBTyxXQUFXLEtBQUssQ0FBQyxNQUFNLEVBQUUsT0FBTyxFQUFBO0FBQ3hDO0FBRU8sU0FBUyxvQkFBQTtBQUNmLFFBQU0sWUFBWSxJQUFJLElBQUksTUFBTSxTQUFTLGlCQUFpQjtBQUMxRCxRQUFNLE9BQU8sb0JBQUksSUFBSTtJQUFDO09BQWtCLE1BQU0sU0FBUztHQUFjO0FBQ3JFLFFBQU0sT0FBbUIsQ0FBQTtBQUN6QixhQUFXLFNBQVMsY0FBYztBQUNqQyxRQUFJLE1BQU0sVUFBVSxDQUFDLEtBQUssSUFBSSxNQUFNLE1BQU0sRUFBRztBQUM3QyxhQUFTLElBQUksR0FBRyxJQUFJLE1BQU0sTUFBTSxRQUFRLEtBQUs7QUFDNUMsWUFBTSxVQUFVLEdBQUcsTUFBTSxFQUFFLEtBQUssQ0FBQTtBQUNoQyxVQUFJLENBQUMsVUFBVSxJQUFJLE9BQUEsR0FBVTtBQUM1QixjQUFNLElBQUksVUFBVSxPQUFBO0FBQ3BCLFlBQUksRUFBRyxNQUFLLEtBQUssQ0FBQTtBQUNqQjtNQUNEO0lBQ0Q7RUFDRDtBQUNBLFNBQU87QUFDUjtBQUVPLFNBQVMsaUJBQUE7QUFDZixRQUFNLFlBQVksSUFBSSxJQUFJLE1BQU0sU0FBUyxpQkFBaUI7QUFDMUQsU0FBTyxXQUFXLE1BQU0sQ0FBQyxNQUFNLFVBQVUsSUFBSSxFQUFFLEVBQUUsQ0FBQTtBQUNsRDtBQUVPLFNBQVMsaUJBQWlCLEtBQWUsV0FBVyxHQUFDO0FBQzNELFFBQU0sTUFBTSxNQUFNLFNBQVM7QUFDM0IsTUFBSTtBQUNKLFVBQVEsSUFBSSxNQUFJO0lBQ2YsS0FBSztBQUNKLGFBQU8sSUFBSSx3QkFBd0IsTUFBTSxNQUFNLE1BQU0sd0JBQXdCO0FBQzdFO0lBQ0QsS0FBSyxRQUFRO0FBQ1osWUFBTSxNQUFNLElBQUk7QUFDaEIsYUFBTyxJQUFJLGVBQWUsR0FBQSxLQUFRLE1BQU0sTUFBTSxNQUFNLGVBQWUsR0FBQSxLQUFRO0FBQzNFO0lBQ0Q7SUFDQSxLQUFLLFNBQVM7QUFDYixZQUFNLFVBQVUsTUFBTSxVQUFVLElBQUksR0FBRyxHQUFJLFNBQVMsSUFBSSxPQUFPLEdBQUksTUFBTSxVQUFVO0FBQ25GLFlBQU0sTUFBTSxHQUFHLElBQUksR0FBRyxJQUFJLElBQUksT0FBTztBQUNyQyxZQUFNLFlBQVksSUFBSSxzQkFBc0IsR0FBQSxLQUFRLElBQUksb0JBQW9CLEdBQUEsS0FBUTtBQUNwRixZQUFNLFlBQVk7QUFDbEI7SUFDRDtJQUNBLEtBQUssZUFBZTtBQUNuQixZQUFNLElBQUk7QUFDVixpQkFBVyxPQUFPLE9BQU8sT0FBTyxNQUFNLFNBQVMsR0FBRztBQUNqRCxtQkFBVyxPQUFPLE9BQU8sT0FBTyxJQUFJLFFBQVEsRUFBRyxRQUFPLElBQUksTUFBTTtNQUNqRTtBQUNBO0lBQ0Q7SUFDQSxLQUFLO0FBQ0osWUFBTSxNQUFNLFVBQVUsSUFBSSxHQUFHLEdBQUksV0FBVyxJQUFJO0FBQ2hEO0lBQ0QsS0FBSztBQUNKLFlBQU0sTUFBTSxVQUFVLElBQUksR0FBRyxHQUFJLFNBQVMsSUFBSSxPQUFPLEdBQUksV0FBVyxJQUFJO0FBQ3hFO0lBQ0QsS0FBSztBQUNKLFlBQU0sSUFBSSxrQkFBa0IsTUFBTSxRQUFRO0FBQzFDO0lBQ0QsS0FBSztBQUNKLFlBQU0sSUFBSSxhQUFhLE1BQU0sTUFBTTtBQUNuQztJQUNEO0FBQ0MsWUFBTTtFQUNSO0FBQ0EsU0FBTztJQUFFLFNBQVMsS0FBSyxJQUFJLEdBQUcsTUFBTSxRQUFBO0lBQVcsUUFBUSxJQUFJO0VBQU87QUFDbkU7QUFFTyxTQUFTLGNBQWMsSUFBWSxLQUFhO0FBQ3RELFNBQU8scUJBQXFCLElBQUksSUFBSSxJQUFJLElBQUssTUFBTSxPQUFPLFlBQVksRUFBQSxLQUFPLElBQUs7QUFDbkY7QUFFTyxTQUFTLHVCQUFBO0FBQ2YsUUFBTSxZQUFZLElBQUksSUFBSSxNQUFNLFNBQVMsaUJBQWlCO0FBQzFELFFBQU0sT0FBTyxvQkFBSSxJQUFJO0lBQUM7T0FBa0IsTUFBTSxTQUFTO0dBQWM7QUFDckUsTUFBSSxVQUFVO0FBQ2QsYUFBVyxTQUFTLGNBQWM7QUFDakMsUUFBSSxNQUFNLFVBQVUsQ0FBQyxLQUFLLElBQUksTUFBTSxNQUFNLEVBQUc7QUFDN0MsYUFBUyxJQUFJLEdBQUcsSUFBSSxNQUFNLE1BQU0sUUFBUSxLQUFLO0FBQzVDLFlBQU0sVUFBVSxHQUFHLE1BQU0sRUFBRSxLQUFLLENBQUE7QUFDaEMsVUFBSSxVQUFVLElBQUksT0FBQSxFQUFVO0FBQzVCLFlBQU0sSUFBSSxVQUFVLE9BQUE7QUFDcEIsVUFBSSxDQUFDLEVBQUc7QUFDUixZQUFNLEVBQUUsU0FBUyxPQUFNLElBQUssaUJBQWlCLENBQUE7QUFDN0MsVUFBSSxXQUFXLFFBQVE7QUFDdEIsY0FBTSxTQUFTLGtCQUFrQixLQUFLLE9BQUE7QUFDdEMsY0FBTSxTQUFTLFFBQVEsS0FBSyxFQUFFLE1BQU07QUFDcEMsa0JBQVUsSUFBSSxPQUFBO0FBQ2Qsa0JBQVU7TUFDWCxNQUFPO0lBQ1I7RUFDRDtBQUNBLE1BQUksUUFBUyxNQUFBO0FBQ2Q7QUFFTyxTQUFTLGFBQUE7QUFDZixTQUFPLEtBQUssTUFBTSxtQkFBbUIsS0FBSyxJQUFJLG9CQUFvQixNQUFNLE9BQU8sV0FBVyxDQUFBLENBQUE7QUFDM0Y7QUFFTyxTQUFTLFlBQVksT0FBYTtBQUN4QyxTQUFPLFVBQVUsS0FBQTtBQUNqQixRQUFNLE9BQU8sV0FBQTtBQUNiLE1BQUksTUFBTSxPQUFPLE1BQU07QUFDdEIsYUFBUyxRQUFRLEtBQUssZUFBYyxDQUFBLGtCQUFvQjtBQUN4RDtFQUNEO0FBQ0EsUUFBTSxPQUFPLGtCQUFBO0FBQ2IsUUFBTSxVQUFVLElBQUksSUFBSSxNQUFNLE9BQU8sT0FBTyxPQUFPLENBQUMsR0FBRyxNQUFNLE1BQU0sS0FBQSxDQUFBO0FBQ25FLFFBQU0sWUFBWSxLQUFLLE9BQU8sQ0FBQyxNQUFNLENBQUMsUUFBUSxJQUFJLEVBQUUsRUFBRSxLQUFLLEVBQUUsT0FBTyxNQUFNLE9BQU8sT0FBTyxLQUFBLENBQU0sRUFBRSxLQUFLLE9BQUE7QUFDckcsUUFBTSxXQUFXLFVBQVUsQ0FBQTtBQUMzQixNQUFJLENBQUMsVUFBVTtBQUNkLGFBQVMsMkNBQUE7QUFDVDtFQUNEO0FBQ0EsUUFBTSxRQUFRO0FBQ2QsUUFBTSxRQUFRLE1BQU0sT0FBTyxPQUFPLEtBQUE7QUFDbEMsUUFBTSxlQUFlO0lBQUUsR0FBRyxNQUFNLE9BQU87RUFBVTtBQUNqRCxTQUFPLGFBQWEsS0FBQTtBQUNwQixlQUFhLFNBQVMsRUFBRSxJQUFJLHFCQUFxQixJQUFJLFNBQVMsSUFBSSxJQUFJLGlCQUFpQixRQUFBLEVBQVUsVUFBVTtBQUMzRyxRQUFNLE9BQU8sT0FBTyxLQUFBLElBQVMsU0FBUztBQUN0QyxRQUFNLE9BQU8sVUFBVSxLQUFBLElBQVM7QUFDaEMsUUFBTSxPQUFPLFlBQVk7QUFDekIsUUFBTSxPQUFPLFdBQVcsTUFBTSxPQUFPLFdBQVcsS0FBSztBQUNyRCxPQUFLLG1CQUFBO0FBQ0wsZ0JBQUE7QUFDQSxXQUFTLHNCQUFzQixLQUFLLGVBQWMsQ0FBQSxRQUFVO0FBQzdEO0FBRU8sU0FBUyxhQUFBO0FBQ2YsdUJBQUE7QUFDQSxRQUFNLGdCQUFnQixNQUFNLE9BQU8sVUFBVSxDQUFBO0FBQzdDLFFBQU0sbUJBQW1CLE1BQU0sT0FBTyxhQUFhLENBQUE7QUFDbkQsUUFBTSxtQkFBbUIsTUFBTSxPQUFPLGFBQWEsQ0FBQztBQUNwRCxRQUFNLFlBQXNCLENBQUE7QUFDNUIsUUFBTSxlQUEwQixDQUFBO0FBQ2hDLFFBQU0sZUFBdUMsQ0FBQztBQUM5QyxXQUFTLElBQUksR0FBRyxJQUFJLGNBQWMsUUFBUSxLQUFLO0FBQzlDLFFBQUksQ0FBQyxpQkFBaUIsQ0FBQSxHQUFJO0FBQ3pCLFlBQU0sS0FBSyxjQUFjLENBQUE7QUFDekIsZ0JBQVUsS0FBSyxFQUFBO0FBQ2YsbUJBQWEsS0FBSyxLQUFBO0FBQ2xCLFVBQUksaUJBQWlCLEVBQUEsTUFBUSxPQUFXLGNBQWEsRUFBQSxJQUFNLGlCQUFpQixFQUFBO0lBQzdFO0VBQ0Q7QUFDQSxRQUFNLE9BQU8sa0JBQUE7QUFDYixRQUFNLGNBQWMsSUFBSSxJQUFJLFNBQUE7QUFDNUIsUUFBTSxZQUFZLEtBQUssT0FBTyxDQUFDLE1BQU0sQ0FBQyxZQUFZLElBQUksRUFBRSxFQUFFLENBQUEsRUFBRyxLQUFLLE9BQUE7QUFDbEUsU0FBTyxVQUFVLFNBQVMsZUFBZSxVQUFVLFNBQVMsR0FBRztBQUM5RCxVQUFNLElBQUksVUFBVSxNQUFLO0FBQ3pCLGNBQVUsS0FBSyxFQUFFLEVBQUU7QUFDbkIsaUJBQWEsS0FBSyxLQUFBO0FBQ2xCLGlCQUFhLEVBQUUsRUFBRSxJQUFJLHFCQUFxQixJQUFJLEVBQUUsSUFBSSxJQUFJLGlCQUFpQixDQUFBLEVBQUcsVUFBVTtFQUN2RjtBQUNBLFFBQU0sT0FBTyxTQUFTO0FBQ3RCLFFBQU0sT0FBTyxZQUFZO0FBQ3pCLFFBQU0sT0FBTyxZQUFZO0FBQzFCO0FBRU8sU0FBUyx1QkFBQTtBQUNmLE1BQUksQ0FBQyxNQUFNLE9BQU8sT0FBTyxPQUFRO0FBQ2pDLFdBQVMsSUFBSSxHQUFHLElBQUksTUFBTSxPQUFPLE9BQU8sUUFBUSxLQUFLO0FBQ3BELFFBQUksTUFBTSxPQUFPLFVBQVUsQ0FBQSxFQUFJO0FBQy9CLFVBQU0sS0FBSyxNQUFNLE9BQU8sT0FBTyxDQUFBO0FBQy9CLFVBQU0sTUFBTSxVQUFVLEVBQUE7QUFDdEIsUUFBSSxDQUFDLElBQUs7QUFDVixVQUFNLEVBQUUsU0FBUyxPQUFNLElBQUssaUJBQWlCLEtBQUssY0FBYyxJQUFJLEdBQUEsQ0FBQTtBQUNwRSxRQUFJLFdBQVcsUUFBUTtBQUN0QixZQUFNLE9BQU8sVUFBVSxDQUFBLElBQUs7QUFDNUIsZUFBUyxtQkFBbUIsSUFBSSxLQUFLLEdBQUc7SUFDekM7RUFDRDtBQUNEOzs7QUN2TE8sU0FBUyxPQUFBO0FBQ2YsTUFBSTtBQUNILGNBQVUsSUFBQSxDQUFBO0VBQ1gsU0FBUyxHQUFHO0FBQ1gsWUFBUSxNQUFNLGNBQWMsQ0FBQTtFQUM3QjtBQUNBLHVCQUFBO0FBQ0EsT0FBSyxNQUFBO0FBQ047OztBQ0xBLFNBQVMsZUFBZSxLQUE0QixLQUFhLE9BQWE7QUFDN0UsYUFBVyxNQUFNLElBQUssSUFBRyxRQUFRLEdBQUEsSUFBTztBQUN6QztBQUlBLFNBQVMsZUFBZSxTQUF3QixNQUFtQjtBQUNsRSxNQUFJLFlBQVksS0FBTSxRQUFPO0FBQzdCLE1BQUksWUFBWSxLQUFNLFFBQU87QUFDN0IsU0FBTztBQUNSO0FBRU8sSUFBTSxzQkFBTixjQUFrQyxZQUFBO0VBQ3hDLE9BQXNCO0VBQ3RCLFdBQTBCO0VBQzFCO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQSxzQkFBc0Isb0JBQUksSUFBQTtFQUMxQixpQkFBaUIsb0JBQUksSUFBQTtFQUNyQjtFQUVBLG9CQUEwQjtBQUN6QixTQUFLLFlBQVk7QUFDakIsVUFBTSxTQUFTLFNBQVMsY0FBYyxLQUFBO0FBQ3RDLFdBQU8sWUFBWTtBQUNuQixVQUFNLFFBQVEsU0FBUyxjQUFjLElBQUE7QUFDckMsU0FBSyxTQUFTO0FBQ2QsVUFBTSxZQUFZO0FBQ2xCLFVBQU0sU0FBUyxTQUFTLGNBQWMsTUFBQTtBQUN0QyxTQUFLLFVBQVU7QUFDZixXQUFPLE1BQU0sV0FBVztBQUN4QixXQUFPLE9BQU8sT0FBTyxNQUFBO0FBQ3JCLFVBQU0sWUFBWSxTQUFTLGNBQWMsR0FBQTtBQUN6QyxTQUFLLGFBQWE7QUFDbEIsY0FBVSxZQUFZO0FBQ3RCLFVBQU0sU0FBUyxTQUFTLGVBQWUsRUFBQTtBQUN2QyxTQUFLLFVBQVU7QUFDZixjQUFVLE9BQU8sYUFBYSxRQUFRLFlBQUE7QUFDdEMsVUFBTSxtQkFBbUIsU0FBUyxjQUFjLEtBQUE7QUFDaEQscUJBQWlCLFlBQVk7QUFDN0IsVUFBTUMsaUJBQWdCLFNBQVMsY0FBYyxRQUFBO0FBQzdDLFNBQUssb0JBQW9CLElBQUlBLGNBQUE7QUFDN0IsSUFBQUEsZUFBYyxZQUFZO0FBQzFCLElBQUFBLGVBQWMsUUFBUSxTQUFTO0FBQy9CLFVBQU0sV0FBVyxTQUFTLGVBQWUsRUFBQTtBQUN6QyxTQUFLLFlBQVk7QUFDakIsSUFBQUEsZUFBYyxPQUFPLFlBQVksUUFBQTtBQUNqQyxVQUFNLG1CQUFtQixTQUFTLGNBQWMsUUFBQTtBQUNoRCxTQUFLLG9CQUFvQixJQUFJLGdCQUFBO0FBQzdCLFNBQUssb0JBQW9CO0FBQ3pCLHFCQUFpQixZQUFZO0FBQzdCLHFCQUFpQixRQUFRLFNBQVM7QUFDbEMscUJBQWlCLE9BQU9BLGdCQUFlLGdCQUFBO0FBQ3ZDLFVBQU0sVUFBVSxTQUFTLGNBQWMsR0FBQTtBQUN2QyxTQUFLLFdBQVc7QUFDaEIsWUFBUSxZQUFZO0FBQ3BCLFVBQU1DLFdBQVUsU0FBUyxjQUFjLFFBQUE7QUFDdkMsU0FBSyxXQUFXQTtBQUNoQixTQUFLLG9CQUFvQixJQUFJQSxRQUFBO0FBQzdCLElBQUFBLFNBQVEsWUFBWTtBQUNwQixJQUFBQSxTQUFRLFFBQVEsU0FBUztBQUN6QixVQUFNLFdBQVcsU0FBUyxlQUFlLEVBQUE7QUFDekMsU0FBSyxZQUFZO0FBQ2pCLFFBQUksV0FBVyxTQUFTLGVBQWUsRUFBQTtBQUN2QyxTQUFLLGVBQWUsSUFBSSxRQUFBO0FBQ3hCLElBQUFBLFNBQVEsT0FBTyxpQkFBaUIsVUFBVSxZQUFZLFVBQVUsR0FBQTtBQUNoRSxVQUFNQyxZQUFXLFNBQVMsY0FBYyxRQUFBO0FBQ3hDLFNBQUssWUFBWUE7QUFDakIsU0FBSyxvQkFBb0IsSUFBSUEsU0FBQTtBQUM3QixJQUFBQSxVQUFTLFlBQVk7QUFDckIsSUFBQUEsVUFBUyxRQUFRLFNBQVM7QUFDMUIsVUFBTSxVQUFVLFNBQVMsZUFBZSxFQUFBO0FBQ3hDLFNBQUssV0FBVztBQUNoQixlQUFXLFNBQVMsVUFBUztBQUM3QixTQUFLLGVBQWUsSUFBSSxRQUFBO0FBQ3hCLElBQUFBLFVBQVMsT0FBTyxrQkFBa0IsU0FBUyxZQUFZLFVBQVUsR0FBQTtBQUNqRSxRQUFJLEtBQUssU0FBUyxLQUFNLGdCQUFlLEtBQUsscUJBQXFCLE9BQU8sS0FBSyxJQUFJO0FBQ2pGLFFBQUksS0FBSyxhQUFhLEtBQU0sZ0JBQWUsS0FBSyxxQkFBcUIsV0FBVyxLQUFLLFFBQVE7QUFDN0YsU0FBSyxNQUFLO0FBQ1YsU0FBSyxnQkFBZ0IsUUFBUSxXQUFXLGtCQUFrQixTQUFTRCxVQUFTQyxTQUFBO0VBQzdFO0VBRUEsV0FBVyxxQkFBK0I7QUFDekMsV0FBTztNQUFDO01BQU87O0VBQ2hCO0VBRUEseUJBQXlCLE1BQWMsVUFBeUIsVUFBK0I7QUFDOUYsUUFBSSxhQUFhLFNBQVU7QUFDM0IsUUFBSSxTQUFTLE9BQU87QUFDbkIsWUFBTSxVQUFVLGVBQWUsS0FBSyxNQUFNLFFBQUE7QUFDMUMsVUFBSSxZQUFZLFNBQVUsUUFBTyxLQUFLLGFBQWEsT0FBTyxLQUFLLElBQUk7QUFDbkUsVUFBSSxZQUFZLFNBQVU7QUFDMUIsV0FBSyxPQUFPO0lBQ2IsV0FBVyxTQUFTLFdBQVc7QUFDOUIsWUFBTSxVQUFVLGVBQWUsS0FBSyxVQUFVLFFBQUE7QUFDOUMsVUFBSSxZQUFZLFNBQVUsUUFBTyxLQUFLLGFBQWEsV0FBVyxLQUFLLFFBQVE7QUFDM0UsVUFBSSxZQUFZLFNBQVU7QUFDMUIsV0FBSyxXQUFXO0lBQ2pCLE1BQU87QUFDUCxRQUFJLGFBQWEsS0FBTSxnQkFBZSxLQUFLLHFCQUFxQixNQUFNLFFBQUE7QUFDdEUsU0FBSyxNQUFLO0VBQ1g7RUFFQSxJQUFJLElBQUksT0FBZTtBQUN0QixTQUFLLGFBQWEsT0FBTyxLQUFBO0VBQzFCO0VBQ0EsSUFBSSxRQUFRLE9BQWU7QUFDMUIsU0FBSyxhQUFhLFdBQVcsS0FBQTtFQUM5QjtFQUVBLFFBQUs7QUFDSixRQUFJLEtBQUssU0FBUyxRQUFRLEtBQUssYUFBYSxRQUFRLENBQUMsS0FBSyxVQUFVLENBQUMsS0FBSyxVQUFXO0FBQ3JGLFVBQU0sTUFBTSxVQUFVLFVBQVUsS0FBSyxJQUFJLEdBQUcsU0FBUyxLQUFLLFFBQVEsR0FBRyxTQUFBO0FBQ3JFLFFBQUksUUFBUSxPQUFXO0FBQ3ZCLFNBQUssT0FBTyxjQUFjLElBQUk7QUFDOUIsU0FBSyxVQUFVLGNBQWMsSUFBSTtFQUNsQztFQUVBLFVBQWdCO0FBQ2YsVUFBTSxNQUFNLEtBQUs7QUFDakIsVUFBTSxVQUFVLEtBQUs7QUFDckIsUUFBSSxRQUFRLFFBQVEsWUFBWSxRQUFRLENBQUMsS0FBSyxXQUFXLENBQUMsS0FBSyxTQUFVO0FBQ3pFLFVBQU0sTUFBTSxNQUFNLFVBQVUsR0FBQSxHQUFNLFNBQVMsT0FBQTtBQUMzQyxVQUFNLE9BQU8sVUFBVSxHQUFBLEdBQU0sU0FBUyxPQUFBO0FBQ3RDLFFBQUksU0FBUyxVQUFhLFFBQVEsT0FBVztBQUM3QyxVQUFNLFNBQVMsQ0FBQyxJQUFJO0FBQ3BCLFFBQUksS0FBSyxZQUFZLFFBQVE7QUFDNUIsV0FBSyxVQUFVO0FBQ2YsV0FBSyxRQUFRLGNBQWMsU0FBUyxXQUFXO0FBQy9DLFdBQUssUUFBUSxZQUFZLFNBQVMsZ0JBQWdCO0FBQ2xELFdBQUssa0JBQWtCLGNBQWMsU0FBUyxXQUFXO0FBQ3pELFdBQUssa0JBQWtCLFVBQVUsT0FBTyxVQUFVLE1BQUE7SUFDbkQ7QUFDQSxVQUFNLFdBQVcsYUFBYSxLQUFLLE9BQUE7QUFDbkMsU0FBSyxVQUFVLGNBQWMsT0FBTyxRQUFBO0FBQ3BDLFNBQUssU0FBUyxXQUFXLE1BQU0sT0FBTztBQUN0QyxVQUFNLElBQUksSUFBSSxNQUFNO0FBQ3BCLFNBQUssa0JBQWtCLFNBQVMsTUFBTTtBQUN0QyxTQUFLLFVBQVUsV0FBVyxNQUFNO0FBQ2hDLFVBQU0sU0FBUyxPQUFPLFlBQ3JCLFFBQVEsS0FBSyxNQUFNLEVBQWlDLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQSxNQUFPO01BQUM7TUFBRyxJQUFJLEtBQUssSUFBSSxHQUFHLENBQUE7S0FBRyxDQUFBO0FBRTVGLFVBQU0sU0FBUyxhQUFhLE1BQUE7QUFDNUIsUUFBSSxXQUFXLElBQUk7QUFDbEIsV0FBSyxXQUFXLFNBQVM7SUFDMUIsT0FBTztBQUNOLFdBQUssUUFBUSxjQUFjO0FBQzNCLFdBQUssV0FBVyxTQUFTO0lBQzFCO0FBQ0EsVUFBTSxXQUFXLG9CQUFvQixHQUFHLEtBQUssV0FBVyxLQUFLLGFBQWEsS0FBSyxXQUFXLElBQUE7QUFDMUYsZUFBVyxNQUFNLEtBQUssZUFBZ0IsSUFBRyxjQUFjO0FBQ3ZELFNBQUssU0FBUyxjQUFjLE1BQU0sSUFDL0Isa0JBQ0EsR0FBRyxFQUFFLGVBQWMsQ0FBQSxJQUFNLE1BQU0sSUFBSSxTQUFTLE9BQUEsS0FBWSxvQkFBb0IsR0FBRyxLQUFLLFdBQVcsS0FBSyxhQUFhLEtBQUssU0FBUyxDQUFBO0FBQ2xJLFNBQUssU0FBUyxjQUFjLE9BQU8sV0FBVyxLQUFLLE9BQUEsQ0FBQTtFQUNwRDtBQUNEO0FBRU8sSUFBTSxzQkFBTixjQUFrQyxZQUFBO0VBQ3hDLE9BQXNCO0VBQ3RCLFdBQTBCO0VBQzFCO0VBQ0E7RUFDQTtFQUVBLG9CQUEwQjtBQUN6QixVQUFNLFNBQVMsU0FBUyxjQUFjLFFBQUE7QUFDdEMsU0FBSyxVQUFVO0FBQ2YsV0FBTyxZQUFZO0FBQ25CLFdBQU8sUUFBUSxTQUFTO0FBQ3hCLFFBQUksS0FBSyxTQUFTLEtBQU0sUUFBTyxRQUFRLE1BQU0sS0FBSztBQUNsRCxRQUFJLEtBQUssYUFBYSxLQUFNLFFBQU8sUUFBUSxVQUFVLEtBQUs7QUFDMUQsVUFBTSxPQUFPLFNBQVMsZUFBZSxLQUFLLGNBQWEsQ0FBQTtBQUN2RCxTQUFLLFNBQVM7QUFDZCxVQUFNLE9BQU8sU0FBUyxlQUFlLEVBQUE7QUFDckMsU0FBSyxRQUFRO0FBQ2IsV0FBTyxPQUFPLFdBQVcsTUFBTSxTQUFTLE1BQU0sT0FBQTtBQUM5QyxTQUFLLGdCQUFnQixNQUFBO0VBQ3RCO0VBRUEsV0FBVyxxQkFBK0I7QUFDekMsV0FBTztNQUFDO01BQU87O0VBQ2hCO0VBRUEseUJBQXlCLE1BQWMsVUFBeUIsVUFBK0I7QUFDOUYsUUFBSSxhQUFhLFNBQVU7QUFDM0IsUUFBSSxTQUFTLE9BQU87QUFDbkIsWUFBTSxVQUFVLGVBQWUsS0FBSyxNQUFNLFFBQUE7QUFDMUMsVUFBSSxZQUFZLFNBQVUsUUFBTyxLQUFLLGFBQWEsT0FBTyxLQUFLLElBQUk7QUFDbkUsVUFBSSxZQUFZLFNBQVU7QUFDMUIsV0FBSyxPQUFPO0lBQ2IsV0FBVyxTQUFTLFdBQVc7QUFDOUIsWUFBTSxVQUFVLGVBQWUsS0FBSyxVQUFVLFFBQUE7QUFDOUMsVUFBSSxZQUFZLFNBQVUsUUFBTyxLQUFLLGFBQWEsV0FBVyxLQUFLLFFBQVE7QUFDM0UsVUFBSSxZQUFZLFNBQVU7QUFDMUIsV0FBSyxXQUFXO0lBQ2pCLE1BQU87QUFDUCxRQUFJLEtBQUssWUFBWSxVQUFhLGFBQWEsS0FBTSxNQUFLLFFBQVEsUUFBUSxJQUFBLElBQVE7QUFDbEYsUUFBSSxLQUFLLFNBQVMsUUFBUSxLQUFLLGFBQWEsUUFBUSxLQUFLLFdBQVcsT0FBVyxNQUFLLE9BQU8sY0FBYyxLQUFLLGNBQWE7QUFDM0gsU0FBSyxRQUFPO0VBQ2I7RUFFQSxJQUFJLElBQUksT0FBZTtBQUN0QixTQUFLLGFBQWEsT0FBTyxLQUFBO0VBQzFCO0VBQ0EsSUFBSSxRQUFRLE9BQWU7QUFDMUIsU0FBSyxhQUFhLFdBQVcsS0FBQTtFQUM5QjtFQUVBLGdCQUFhO0FBQ1osUUFBSSxLQUFLLFNBQVMsUUFBUSxLQUFLLGFBQWEsS0FBTSxRQUFPO0FBQ3pELFdBQU8sVUFBVSxVQUFVLEtBQUssSUFBSSxHQUFHLFNBQVMsS0FBSyxRQUFRLEdBQUcsU0FBQSxHQUFZLFNBQVM7RUFDdEY7RUFFQSxVQUFnQjtBQUNmLFVBQU0sTUFBTSxLQUFLO0FBQ2pCLFVBQU0sVUFBVSxLQUFLO0FBQ3JCLFFBQUksUUFBUSxRQUFRLFlBQVksUUFBUSxDQUFDLEtBQUssV0FBVyxDQUFDLEtBQUssTUFBTztBQUN0RSxVQUFNLE9BQU8sV0FBVyxLQUFLLE9BQUE7QUFDN0IsU0FBSyxRQUFRLFdBQVcsTUFBTSxPQUFPO0FBQ3JDLFVBQU0sV0FBVyxLQUFLLGVBQWM7QUFDcEMsUUFBSSxLQUFLLE1BQU0sZ0JBQWdCLFNBQVUsTUFBSyxNQUFNLGNBQWM7RUFDbkU7QUFDRDtBQUVPLElBQU0sa0JBQU4sY0FBOEIsWUFBQTtFQUNwQyxnQkFBZ0Isb0JBQUksSUFBQTtFQUNwQixpQkFBaUIsb0JBQUksSUFBQTtFQUNyQjtFQUNBO0VBQ0E7RUFFQSxvQkFBMEI7QUFDekIsVUFBTSxlQUFlLFNBQVMsY0FBYyxTQUFBO0FBQzVDLGlCQUFhLFlBQVk7QUFDekIsVUFBTSxhQUFhLFNBQVMsY0FBYyxJQUFBO0FBQzFDLGVBQVcsY0FBYztBQUN6QixVQUFNLGlCQUFpQixTQUFTLGNBQWMsS0FBQTtBQUM5QyxTQUFLLGtCQUFrQjtBQUN2QixtQkFBZSxZQUFZO0FBQzNCLGlCQUFhLE9BQU8sWUFBWSxjQUFBO0FBQ2hDLFVBQU0sY0FBYyxTQUFTLGNBQWMsU0FBQTtBQUMzQyxTQUFLLGVBQWU7QUFDcEIsZ0JBQVksWUFBWTtBQUN4QixnQkFBWSxTQUFTO0FBQ3JCLFVBQU0sV0FBVyxTQUFTLGNBQWMsSUFBQTtBQUN4QyxhQUFTLGNBQWM7QUFDdkIsVUFBTSxnQkFBZ0IsU0FBUyxjQUFjLEtBQUE7QUFDN0MsU0FBSyxpQkFBaUI7QUFDdEIsa0JBQWMsWUFBWTtBQUMxQixnQkFBWSxPQUFPLFVBQVUsYUFBQTtBQUM3QixTQUFLLGdCQUFnQixjQUFjLFdBQUE7RUFDcEM7RUFFQSxXQUFXLHFCQUErQjtBQUN6QyxXQUFPO01BQUM7O0VBQ1Q7RUFFQSx5QkFBeUIsTUFBYyxVQUF5QixVQUErQjtBQUM5RixRQUFJLGFBQWEsU0FBVTtBQUMzQixRQUFJLFNBQVMsT0FBTztBQUNuQixXQUFLLGNBQWMsTUFBSztBQUN4QixXQUFLLGVBQWUsTUFBSztBQUN6QixXQUFLLGlCQUFpQixnQkFBQTtBQUN0QixXQUFLLGdCQUFnQixnQkFBQTtJQUN0QjtFQUNEO0VBRUEsSUFBSSxJQUFJLE9BQWU7QUFDdEIsU0FBSyxhQUFhLE9BQU8sS0FBQTtFQUMxQjtFQUNBLElBQUksTUFBcUI7QUFDeEIsV0FBTyxLQUFLLGFBQWEsS0FBQTtFQUMxQjtFQUVBLFVBQWdCO0FBQ2YsVUFBTSxTQUFTLEtBQUs7QUFDcEIsVUFBTSxpQkFBaUIsS0FBSztBQUM1QixVQUFNLGdCQUFnQixLQUFLO0FBQzNCLFVBQU0sY0FBYyxLQUFLO0FBQ3pCLFFBQUksQ0FBQyxVQUFVLENBQUMsa0JBQWtCLENBQUMsaUJBQWlCLENBQUMsWUFBYTtBQUNsRSxVQUFNLE1BQU0sVUFBVSxNQUFBO0FBQ3RCLFVBQU0sTUFBTSxNQUFNLFVBQVUsTUFBQTtBQUM1QixRQUFJLENBQUMsT0FBTyxDQUFDLElBQUs7QUFDbEIsZUFBVyxDQUFDLElBQUksSUFBQSxLQUFTLFFBQVEsSUFBSSxRQUFRLEdBQUc7QUFDL0MsVUFBSSxXQUFXO0FBQ2YsVUFBSSxhQUFhO0FBQ2pCLFVBQUksSUFBSSxTQUFTLEVBQUEsRUFBSSxVQUFVO0FBQzlCLG1CQUFXO0FBQ1gsY0FBTSxPQUFPLFlBQVksS0FBSyxlQUFlLElBQUksQ0FBQyxRQUFBO0FBQ2pELGdCQUFNQyxRQUFPLElBQUksb0JBQUE7QUFDakIsVUFBQUEsTUFBSyxVQUFVO0FBQ2YsVUFBQUEsTUFBSyxNQUFNO0FBQ1gsaUJBQU9BO1FBQ1IsQ0FBQTtBQUNBLFlBQUksQ0FBQyxlQUFlLFNBQVMsSUFBQSxFQUFPLGdCQUFlLFlBQVksSUFBQTtBQUMvRCxhQUFLLFFBQU87TUFDYixXQUFXLENBQUMsS0FBSyxpQkFBaUIsSUFBSSxTQUFTLEtBQUssYUFBYSxFQUFFLFVBQVU7QUFDNUUscUJBQWE7QUFDYixjQUFNLFNBQVMsWUFBWSxLQUFLLGdCQUFnQixJQUFJLENBQUMsUUFBQTtBQUNwRCxnQkFBTUMsVUFBUyxJQUFJLG9CQUFBO0FBQ25CLFVBQUFBLFFBQU8sVUFBVTtBQUNqQixVQUFBQSxRQUFPLE1BQU07QUFDYixpQkFBT0E7UUFDUixDQUFBO0FBQ0EsWUFBSSxDQUFDLGNBQWMsU0FBUyxNQUFBLEVBQVMsZUFBYyxPQUFPLE1BQUE7QUFDMUQsZUFBTyxRQUFPO01BQ2Y7QUFDQSxVQUFJLENBQUMsY0FBYyxLQUFLLGVBQWUsSUFBSSxFQUFBLEdBQUs7QUFDL0Msc0JBQWMsWUFBWSxLQUFLLGVBQWUsSUFBSSxFQUFBLENBQUE7QUFDbEQsYUFBSyxlQUFlLE9BQU8sRUFBQTtNQUM1QjtBQUNBLFVBQUksQ0FBQyxZQUFZLEtBQUssY0FBYyxJQUFJLEVBQUEsR0FBSztBQUM1Qyx1QkFBZSxZQUFZLEtBQUssY0FBYyxJQUFJLEVBQUEsQ0FBQTtBQUNsRCxhQUFLLGNBQWMsT0FBTyxFQUFBO01BQzNCO0lBQ0Q7QUFDQSxnQkFBWSxTQUFTLEtBQUssZUFBZSxTQUFTO0VBQ25EO0FBQ0Q7QUFFTyxJQUFNLG9CQUFOLGNBQWdDLFlBQUE7RUFDdEM7RUFDQTtFQUNBO0VBQ0E7RUFDQSxjQUFjLG9CQUFJLElBQUE7RUFDbEIsWUFBZ0M7RUFFaEMsb0JBQTBCO0FBQ3pCLFNBQUssWUFBWTtBQUNqQixVQUFNLFNBQVMsU0FBUyxjQUFjLEtBQUE7QUFDdEMsV0FBTyxZQUFZO0FBQ25CLFVBQU0sT0FBTyxTQUFTLGNBQWMsSUFBQTtBQUNwQyxTQUFLLFlBQVksSUFBSSxJQUFBO0FBQ3JCLFNBQUssWUFBWTtBQUNqQixVQUFNLFFBQVEsU0FBUyxjQUFjLE1BQUE7QUFDckMsVUFBTSxZQUFZO0FBQ2xCLFVBQU0sV0FBVyxTQUFTLGVBQWUsRUFBQTtBQUN6QyxTQUFLLFlBQVk7QUFDakIsVUFBTSxZQUFZLFNBQVMsZUFBZSxFQUFBO0FBQzFDLFNBQUssYUFBYTtBQUNsQixVQUFNLE9BQU8sVUFBVSxlQUFlLFdBQVcsWUFBQTtBQUNqRCxXQUFPLE9BQU8sTUFBTSxLQUFBO0FBQ3BCLFVBQU0sT0FBTyxTQUFTLGNBQWMsUUFBQTtBQUNwQyxTQUFLLFFBQVE7QUFDYixTQUFLLFlBQVk7QUFDakIsU0FBSyxRQUFRLFNBQVM7QUFDdEIsUUFBSSxLQUFLLGNBQWMsS0FBTSxNQUFLLFFBQVEsV0FBVyxLQUFLO0FBQzFELFVBQU0sUUFBUSxTQUFTLGVBQWUsRUFBQTtBQUN0QyxTQUFLLFlBQVksSUFBSSxLQUFBO0FBQ3JCLFVBQU0sYUFBYSxTQUFTLGVBQWUsRUFBQTtBQUMzQyxTQUFLLGNBQWM7QUFDbkIsU0FBSyxPQUFPLGFBQWEsT0FBTyxTQUFTLFlBQVksT0FBQTtBQUNyRCxTQUFLLGdCQUFnQixRQUFRLElBQUE7QUFDN0IsU0FBSyxNQUFLO0VBQ1g7RUFFQSxXQUFXLHFCQUErQjtBQUN6QyxXQUFPO01BQUM7O0VBQ1Q7RUFFQSx5QkFBeUIsTUFBYyxVQUF5QixVQUErQjtBQUM5RixRQUFJLGFBQWEsU0FBVTtBQUMzQixRQUFJLFNBQVMsV0FBWTtBQUN6QixRQUFJLEtBQUssY0FBYyxNQUFNO0FBQzVCLFdBQUssWUFBWTtBQUNqQixVQUFJLEtBQUssVUFBVSxVQUFhLGFBQWEsS0FBTSxNQUFLLE1BQU0sUUFBUSxXQUFXO0FBQ2pGLFdBQUssTUFBSztJQUNYLFdBQVcsS0FBSyxjQUFjLFNBQVUsUUFBTyxLQUFLLGFBQWEsWUFBWSxLQUFLLFNBQVM7RUFDNUY7RUFFQSxJQUFJLFNBQVMsT0FBb0I7QUFDaEMsU0FBSyxhQUFhLFlBQVksS0FBQTtFQUMvQjtFQUVBLFFBQUs7QUFDSixRQUFJLEtBQUssY0FBYyxRQUFRLEtBQUssWUFBWSxTQUFTLEVBQUc7QUFDNUQsVUFBTSxRQUFRLFVBQVUsS0FBSyxTQUFTLEdBQUc7QUFDekMsUUFBSSxVQUFVLE9BQVc7QUFDekIsZUFBVyxNQUFNLEtBQUssWUFBYSxJQUFHLGNBQWM7RUFDckQ7RUFFQSxVQUFnQjtBQUNmLFVBQU0sV0FBVyxLQUFLO0FBQ3RCLFFBQUksYUFBYSxRQUFRLENBQUMsS0FBSyxhQUFhLENBQUMsS0FBSyxNQUFPO0FBQ3pELFVBQU0sTUFBTSxNQUFNLFVBQVUsUUFBQSxLQUFhO0FBQ3pDLFVBQU0sV0FBVyxNQUFNO0FBQ3ZCLFVBQU0sUUFBUSxhQUFhLFFBQUE7QUFDM0IsU0FBSyxVQUFVLGNBQWMsSUFBSSxlQUFjO0FBQy9DLFNBQUssU0FBUyxDQUFDO0FBQ2YsU0FBSyxNQUFNLFdBQVcsQ0FBQztBQUN2QixTQUFLLFdBQVcsY0FBYyxNQUFNLGVBQWM7QUFDbEQsU0FBSyxZQUFZLGVBQWUsTUFBTSxPQUFPLGVBQWM7RUFDNUQ7QUFDRDtBQUVPLElBQU0sZ0JBQU4sY0FBNEIsWUFBQTtFQUNsQztFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0E7RUFDQTtFQUNBO0VBQ0EsZ0JBQWdCLG9CQUFJLElBQUE7RUFDcEIsWUFBWSxvQkFBSSxJQUFBO0VBRWhCLG9CQUEwQjtBQUN6QixVQUFNLE9BQU8sU0FBUyxjQUFjLEtBQUE7QUFDcEMsU0FBSyxZQUFZO0FBQ2pCLFVBQU0sY0FBYyxTQUFTLGNBQWMsS0FBQTtBQUMzQyxTQUFLLGVBQWU7QUFDcEIsZ0JBQVksWUFBWTtBQUN4QixnQkFBWSxPQUFPO0FBQ25CLGdCQUFZLFlBQVk7QUFDeEIsZ0JBQVksZUFBZTtBQUMzQixnQkFBWSxlQUFlO0FBQzNCLFVBQU0sZUFBZSxTQUFTLGNBQWMsS0FBQTtBQUM1QyxTQUFLLGdCQUFnQjtBQUNyQixpQkFBYSxZQUFZO0FBQ3pCLGdCQUFZLFlBQVksWUFBQTtBQUN4QixVQUFNLFFBQVEsU0FBUyxjQUFjLEdBQUE7QUFDckMsVUFBTSxZQUFZO0FBQ2xCLFNBQUssUUFBUSxTQUFTLGVBQWUsRUFBQTtBQUNyQyxRQUFJLE1BQU0sU0FBUyxlQUFlLEVBQUE7QUFDbEMsU0FBSyxVQUFVLElBQUksR0FBQTtBQUNuQixTQUFLLE9BQU8sU0FBUyxlQUFlLEVBQUE7QUFDcEMsVUFBTSxPQUFPLEtBQUssT0FBTyxPQUFPLEtBQUssWUFBWSxLQUFLLE1BQU0sU0FBQTtBQUM1RCxVQUFNLFVBQVUsU0FBUyxjQUFjLFFBQUE7QUFDdkMsU0FBSyxXQUFXO0FBQ2hCLFlBQVEsUUFBUSxTQUFTO0FBQ3pCLFVBQU0sSUFBSSxVQUFTO0FBQ25CLFNBQUssVUFBVSxJQUFJLEdBQUE7QUFDbkIsU0FBSyxRQUFRLFNBQVMsZUFBZSxFQUFBO0FBQ3JDLFNBQUssUUFBUSxTQUFTLGVBQWUsRUFBQTtBQUNyQyxZQUFRLE9BQU8sb0JBQW9CLEtBQUssUUFBUSxLQUFLLE9BQU8sZUFBZSxLQUFLLE9BQU8sT0FBQTtBQUN2RixTQUFLLE9BQU8sYUFBYSxPQUFPLE9BQUE7QUFDaEMsVUFBTSxVQUFVLFNBQVMsY0FBYyxLQUFBO0FBQ3ZDLFlBQVEsWUFBWTtBQUNwQixVQUFNQyxXQUFVLFNBQVMsY0FBYyxRQUFBO0FBQ3ZDLFNBQUssV0FBV0E7QUFDaEIsSUFBQUEsU0FBUSxZQUFZO0FBQ3BCLElBQUFBLFNBQVEsUUFBUSxTQUFTO0FBQ3pCLFNBQUssY0FBYyxTQUFTLGVBQWUsRUFBQTtBQUMzQyxJQUFBQSxTQUFRLE9BQU8sd0JBQXdCLEtBQUssYUFBYSxPQUFBO0FBQ3pELFVBQU0sWUFBWSxTQUFTLGNBQWMsR0FBQTtBQUN6QyxTQUFLLGFBQWE7QUFDbEIsY0FBVSxZQUFZO0FBQ3RCLGNBQVUsY0FBYztBQUN4QixVQUFNLG1CQUFtQixTQUFTLGNBQWMsU0FBQTtBQUNoRCxxQkFBaUIsWUFBWTtBQUM3QixVQUFNLFVBQVUsU0FBUyxjQUFjLElBQUE7QUFDdkMsWUFBUSxjQUFjO0FBQ3RCLFVBQU0sZUFBZSxTQUFTLGNBQWMsS0FBQTtBQUM1QyxTQUFLLGdCQUFnQjtBQUNyQixpQkFBYSxLQUFLO0FBQ2xCLHFCQUFpQixPQUFPLFNBQVMsWUFBQTtBQUNqQyxTQUFLLGdCQUFnQixNQUFNLFNBQVNBLFVBQVMsV0FBVyxnQkFBQTtFQUN6RDtFQUVBLFVBQWdCO0FBQ2YsUUFBSSxDQUFDLEtBQUssU0FBUyxDQUFDLEtBQUssZ0JBQWdCLENBQUMsS0FBSyxTQUFVO0FBQ3pELFVBQU0sT0FBTyxXQUFBO0FBQ2IsVUFBTSxNQUFNLFdBQUE7QUFDWixVQUFNLE1BQU0sS0FBSyxJQUFJLEtBQUssS0FBSyxNQUFNLE9BQU8sTUFBTSxHQUFBLENBQUE7QUFDbEQsVUFBTSxPQUFPLG1CQUFBO0FBQ2IsVUFBTSxZQUFZLEtBQUssU0FBQSxFQUFXLE9BQU8sQ0FBQyxNQUFNLE1BQU0sVUFBVSxDQUFBLElBQUssQ0FBQTtBQUNyRSxVQUFNLFdBQVcsVUFBVSxTQUFTO0FBQ3BDLFVBQU0sYUFBYSxVQUFVLE9BQU8sQ0FBQyxLQUFLLE1BQU0sTUFBTSxNQUFNLFVBQVUsQ0FBQSxJQUFLLGFBQWEsQ0FBQSxHQUFJLENBQUE7QUFDNUYsU0FBSyxNQUFNLGNBQWMsS0FBSyxlQUFjO0FBQzVDLGVBQVcsTUFBTSxLQUFLLFVBQVcsSUFBRyxjQUFjLElBQUksZUFBYztBQUNwRSxTQUFLLEtBQUssY0FBYyxJQUFJLGVBQWM7QUFDMUMsU0FBSyxhQUFhLGVBQWUsT0FBTyxHQUFBO0FBQ3hDLFNBQUssY0FBYyxNQUFNLFFBQVEsR0FBRyxHQUFBO0FBQ3BDLFNBQUssTUFBTSxjQUFjLEtBQUssZUFBYztBQUM1QyxTQUFLLFNBQVMsV0FBVyxNQUFNLE9BQU87QUFDdEMsU0FBSyxNQUFNLGNBQWMsZUFBQSxFQUFpQixlQUFjO0FBQ3hELFNBQUssU0FBUyxTQUFTLENBQUM7QUFDeEIsU0FBSyxXQUFXLFNBQVM7QUFDekIsU0FBSyxZQUFZLGNBQWMsV0FBVyxlQUFjO0FBQ3hELGVBQVcsTUFBTSxLQUFLLFNBQUEsR0FBWTtBQUNqQyxZQUFNLE9BQU8sWUFBWSxLQUFLLGVBQWUsSUFBSSxDQUFDLFFBQUE7QUFDakQsY0FBTUYsUUFBTyxJQUFJLGtCQUFBO0FBQ2pCLFFBQUFBLE1BQUssV0FBVztBQUNoQixhQUFLLGNBQWMsWUFBWUEsS0FBQTtBQUMvQixlQUFPQTtNQUNSLENBQUE7QUFDQSxXQUFLLFFBQU87SUFDYjtFQUNEO0FBQ0Q7OztBQ2hmTyxTQUFTLHVCQUFBO0FBQ2YsUUFBTSxjQUFjLE1BQU0sT0FBTyxPQUFPO0FBQ3hDLFFBQU0saUJBQWlCLE1BQU0sT0FBTyxVQUFVLE9BQU8sT0FBQSxFQUFTO0FBQzlELFNBQU87SUFBRTtJQUFhO0lBQWdCLFlBQVksY0FBYztFQUFlO0FBQ2hGO0FBRU8sU0FBUyxxQkFBQTtBQUNmLFNBQU8sVUFBQTtBQUNQLFFBQU0sRUFBRSxlQUFjLElBQUsscUJBQUE7QUFDM0IsTUFBSSxtQkFBbUIsRUFBRztBQUMxQixhQUFXLENBQUMsSUFBSSxHQUFBLEtBQVEsUUFBUSxNQUFNLFNBQVMsR0FBRztBQUNqRCxRQUFJLElBQUksWUFBWSxDQUFDLE1BQU0sU0FBUyxjQUFjLFNBQVMsRUFBQSxFQUFLLE9BQU0sU0FBUyxjQUFjLEtBQUssRUFBQTtFQUNuRztBQUNBLFdBQVMsSUFBSSxHQUFHLElBQUksTUFBTSxPQUFPLE9BQU8sUUFBUSxLQUFLO0FBQ3BELFFBQUksQ0FBQyxNQUFNLE9BQU8sVUFBVSxDQUFBLEVBQUk7QUFDaEMsVUFBTSxNQUFNLE1BQU0sT0FBTyxPQUFPLENBQUE7QUFDaEMsVUFBTSxNQUFNLFVBQVUsR0FBQTtBQUN0QixRQUFJLEtBQUs7QUFDUixZQUFNLFNBQVMsUUFBUSxLQUFLLElBQUksTUFBTTtBQUN0QyxVQUFJLENBQUMsTUFBTSxTQUFTLGtCQUFrQixTQUFTLEdBQUEsRUFBTSxPQUFNLFNBQVMsa0JBQWtCLEtBQUssR0FBQTtJQUM1RjtFQUNEO0FBQ0EsUUFBTSxNQUFNLE1BQU0sU0FBUztBQUMzQixRQUFNLFNBQVM7QUFDZixNQUFJLGNBQWMsTUFBTSxNQUFNO0FBQzlCLE1BQUksbUJBQW1CLE1BQU0sUUFBUTtBQUNyQyxNQUFJLHdCQUF3QixNQUFNLE1BQU0sd0JBQXdCO0FBQ2hFLGFBQVcsQ0FBQyxJQUFJLEdBQUEsS0FBUSxRQUFRLE1BQU0sU0FBUyxHQUFHO0FBQ2pELGVBQVcsQ0FBQyxJQUFJLEdBQUEsS0FBUSxRQUFRLElBQUksUUFBUSxHQUFHO0FBQzlDLFVBQUksY0FBYyxJQUFJLE1BQU07QUFDNUIsWUFBTSxNQUFNLEdBQUcsRUFBQSxJQUFNLEVBQUE7QUFDckIsVUFBSSxrQkFBa0IsR0FBQSxJQUFPLEtBQUssSUFBSSxJQUFJLGtCQUFrQixHQUFBLEtBQVEsR0FBRyxJQUFJLE1BQU0sTUFBTTtBQUN2RixVQUFJLG9CQUFvQixHQUFBLEtBQVEsSUFBSSxvQkFBb0IsR0FBQSxLQUFRLEtBQUssSUFBSSxNQUFNO0lBQ2hGO0VBQ0Q7QUFDQSxhQUFXLENBQUMsR0FBRyxDQUFBLEtBQU0sUUFBUSxNQUFNLE1BQU0sY0FBYyxHQUFrQztBQUN4RixRQUFJLGVBQWUsQ0FBQSxLQUFNLElBQUksZUFBZSxDQUFBLEtBQU0sS0FBSztFQUN4RDtBQUNBLFFBQU0sbUJBQW1CLE1BQU0sT0FBTyxPQUFPLE9BQU8sQ0FBQyxHQUFHLE1BQU0sQ0FBQyxNQUFNLE9BQU8sVUFBVSxDQUFBLENBQUU7QUFDeEYsUUFBTSxzQkFBOEMsQ0FBQztBQUNyRCxhQUFXLE1BQU0sa0JBQWtCO0FBQ2xDLFFBQUksTUFBTSxPQUFPLFlBQVksRUFBQSxNQUFRLE9BQVcscUJBQW9CLEVBQUEsSUFBTSxNQUFNLE9BQU8sVUFBVSxFQUFBO0VBQ2xHO0FBQ0EsUUFBTSxvQkFBb0IsTUFBTTtBQUNoQyxXQUFTLFdBQUEsQ0FBQTtBQUNULFFBQU0sV0FBVztBQUNqQixRQUFNLE9BQU8sU0FBUztBQUN0QixRQUFNLE9BQU8sWUFBWSxJQUFJLE1BQU0saUJBQWlCLE1BQU0sRUFBRSxLQUFLLEtBQUE7QUFDakUsUUFBTSxPQUFPLFlBQVk7QUFDekIsUUFBTSxPQUFPLGlCQUFpQixlQUFBO0FBQzlCLFFBQU0sV0FBVyxJQUFBO0FBQ2pCLGVBQUE7QUFDQSxPQUFLLGdCQUFBO0FBQ0wsYUFBQTtBQUNBLE9BQUE7QUFDQSxnQkFBQTtBQUNBLFdBQVMsUUFBUSxNQUFNLFNBQVMsT0FBTyxHQUFHLGVBQWMsQ0FBQSxhQUFlLGVBQWUsZUFBYyxDQUFBLFVBQVksbUJBQW1CLElBQUksS0FBSyxHQUFBLFVBQWE7QUFDekosTUFBSSxlQUFBLEtBQW9CLENBQUMsTUFBTSxTQUFTLGFBQWMsTUFBSyxTQUFBO0FBQzVEO0FBRU8sU0FBUyxpQkFBQTtBQUNmLFNBQU8sU0FBQTtBQUNQLFFBQU0sZ0JBQWdCLE1BQU0sU0FBUyxnQkFBZ0IsS0FBSztBQUMxRCxXQUFTLFdBQUEsQ0FBQTtBQUNULFFBQU0sU0FBUyxlQUFlO0FBQzlCLGVBQUE7QUFDQSxPQUFLLGlCQUFBO0FBQ0wsYUFBQTtBQUNBLE9BQUE7QUFDQSxnQkFBQTtBQUNBLFdBQVMsbUJBQUE7QUFDVjtBQUVPLFNBQVMsaUJBQUE7QUFDZixRQUFNLFNBQVMsZUFBZTtBQUM5QixPQUFBO0FBQ0Q7QUFFQSxTQUFTLGVBQUE7QUFDUixVQUFRLGFBQWE7QUFDckIsVUFBUSxpQkFBaUIsQ0FBQztBQUMxQixVQUFRLG1CQUFtQjtBQUM1QjtBQVNPLFNBQVMseUJBQUE7QUFDZixRQUFNLE9BQXFCO0lBQzFCO01BQUUsTUFBTTtNQUFpQixLQUFLLENBQUMsTUFBTSxJQUFJLEVBQUUsZUFBYyxDQUFBO0lBQW1CO0lBQzVFO01BQUUsTUFBTTtNQUFpQixRQUFRO01BQU0sWUFBWTtNQUFNLEtBQUssQ0FBQyxNQUFNLGVBQWUsRUFBRSxlQUFjLENBQUE7SUFBTTtJQUMxRztNQUFFLE1BQU07TUFBbUIsUUFBUTtNQUFNLFlBQVk7TUFBTSxLQUFLLENBQUMsTUFBTSxpQkFBaUIsRUFBRSxlQUFjLENBQUE7SUFBTTtJQUM5RztNQUFFLE1BQU07TUFBa0IsUUFBUTtNQUFNLFlBQVk7TUFBTSxLQUFLLENBQUMsTUFBTSxnQkFBZ0IsRUFBRSxlQUFjLENBQUE7SUFBTTtJQUM1RztNQUFFLE1BQU07TUFBa0IsUUFBUTtNQUFNLFlBQVk7TUFBTyxLQUFLLENBQUMsTUFBTSxnQkFBZ0IsRUFBRSxlQUFjLENBQUE7SUFBTTtJQUM3RztNQUFFLE1BQU07TUFBZ0IsS0FBSyxDQUFDLE1BQU0sSUFBSSxFQUFFLGVBQWMsQ0FBQSx5QkFBMkIsSUFBSSxJQUFJLE1BQU0sRUFBQTtJQUFLO0lBQ3RHO01BQUUsTUFBTTtNQUFtQixRQUFRO01BQU0sWUFBWTtNQUFPLEtBQUssQ0FBQyxNQUFNLHFCQUFxQixFQUFFLGVBQWMsQ0FBQTtJQUFNO0lBQ25IO01BQUUsTUFBTTtNQUFxQixRQUFRO01BQU0sWUFBWTtNQUFPLEtBQUssQ0FBQyxNQUFNLGtCQUFrQixFQUFFLGVBQWMsQ0FBQTtJQUFNOztBQUVuSCxTQUFPLEtBQUssSUFBSSxDQUFDLE1BQUE7QUFDaEIsUUFBSSxFQUFFLFFBQVE7QUFDYixZQUFNLE9BQU8sZ0JBQWdCLEVBQUUsSUFBSTtBQUNuQyxZQUFNLE1BQU0sRUFBRSxhQUFhLEtBQUssT0FBTyxJQUFJLFFBQVEsR0FBQSxJQUFPLEtBQUssT0FBTyxPQUFPLEtBQUssR0FBQTtBQUNsRixhQUFPLE1BQU0sSUFBSSxFQUFFLElBQUksR0FBQSxJQUFPO0lBQy9CO0FBQ0EsVUFBTSxRQUFRLGlCQUFpQixFQUFFLElBQUk7QUFDckMsV0FBTyxRQUFRLElBQUksRUFBRSxJQUFJLEtBQUEsSUFBUztFQUNuQyxDQUFBLEVBQUcsT0FBTyxDQUFDLE1BQW1CLE1BQU0sSUFBQTtBQUNyQzs7O0FDMUhBLElBQUksWUFBWTtBQUVULFNBQVMsd0JBQUE7QUFDZixjQUFZO0FBQ2I7QUFFTyxTQUFTLHNCQUFBO0FBQ2YsUUFBTSxRQUFRLFNBQVMsZUFBZSxjQUFBO0FBQ3RDLE1BQUksQ0FBQyxNQUFPO0FBQ1osUUFBTSxZQUFZLFNBQVMsY0FBYyw4QkFBQTtBQUN6QyxNQUFJLFVBQVcsV0FBVSxjQUFjLGlCQUFpQixNQUFNLFNBQVMsT0FBTyxHQUFHLGVBQWMsQ0FBQTtBQUMvRixRQUFNLFlBQVksTUFBTSxPQUFPLE9BQU8sS0FBSyxHQUFBLElBQU8sTUFBTSxNQUFNLE9BQU8sVUFBVSxJQUFJLE1BQUEsRUFBUSxLQUFLLEdBQUEsSUFBTyxNQUFNLE1BQU0sU0FBUztBQUM1SCxNQUFJLGNBQWMsYUFBYSxNQUFNLFlBQVk7QUFDaEQsb0JBQWdCLEtBQUE7QUFDaEI7RUFDRDtBQUNBLGNBQVk7QUFDWixRQUFNLGlCQUFpQixNQUFNLE9BQU8sVUFBVSxPQUFPLE9BQUEsRUFBUztBQUM5RCxRQUFNLFdBQVcsa0JBQWtCO0FBQ25DLFFBQU0sWUFBWSxDQUFDLElBQVksTUFBQTtBQUM5QixVQUFNLE1BQU0sVUFBVSxFQUFBO0FBQ3RCLFFBQUksQ0FBQyxJQUFLLFFBQU87QUFDakIsVUFBTSxFQUFFLFNBQVMsT0FBTSxJQUFLLGlCQUFpQixLQUFLLGNBQWMsSUFBSSxHQUFBLENBQUE7QUFDcEUsVUFBTSxPQUFPLE1BQU0sT0FBTyxVQUFVLENBQUE7QUFDcEMsVUFBTSxZQUFZLElBQUksU0FBUyxXQUFXLElBQUksU0FBUztBQUN2RCxVQUFNLE1BQU0sWUFBYSxPQUFPLE1BQU0sSUFBSyxLQUFLLElBQUksS0FBSyxLQUFLLE1BQU0sVUFBVSxTQUFTLEdBQUEsQ0FBQTtBQUN2RixVQUFNLGNBQWMsT0FDakIsS0FDQSxZQUNBLHVGQUNBO3FFQUNnRSxFQUFBLHNGQUF3RixHQUFBO2dEQUM3RyxHQUFBOztxREFFSyxFQUFBLEtBQU8sVUFBVSxPQUFBLENBQUEsTUFBYyxVQUFVLE1BQUEsQ0FBQTs7QUFFNUYsVUFBTSxZQUFZLE9BQU8sTUFBTSxNQUFBO0FBQzlCLFlBQU0sT0FBTyxXQUFBO0FBQ2IsYUFBTywyRUFBMkUsQ0FBQSxLQUNqRixNQUFNLFFBQVEsT0FBTyxLQUFLLFVBQUEsWUFDZixLQUFLLGVBQWMsQ0FBQTtJQUNoQyxHQUFDO0FBQ0QsV0FBTyx5QkFBeUIsT0FBTyxnQkFBZ0IsRUFBQTs2QkFDNUIsSUFBSSxLQUFLOzJDQUNLLElBQUksV0FBVztLQUNyRCxXQUFBO0tBQ0EsU0FBQTs7RUFFSjtBQUNBLFFBQU0saUJBQWlCLE1BQU0sT0FBTyxPQUFPLElBQUksQ0FBQyxJQUFJLE1BQU0sTUFBTSxPQUFPLFVBQVUsQ0FBQSxJQUFLLEtBQUssVUFBVSxJQUFJLENBQUEsQ0FBQSxFQUFJLEtBQUssRUFBQTtBQUNsSCxRQUFNLGdCQUFnQixNQUFNLE9BQU8sT0FBTyxJQUFJLENBQUMsSUFBSSxNQUFNLE1BQU0sT0FBTyxVQUFVLENBQUEsSUFBSyxVQUFVLElBQUksQ0FBQSxJQUFLLEVBQUEsRUFBSSxLQUFLLEVBQUE7QUFDakgsUUFBTSxVQUFVLHVCQUFBO0FBQ2hCLFFBQU0sY0FBYyxRQUFRLFdBQVcsSUFDcEMsMEdBQ0EsbUNBQW1DLFFBQVEsSUFBSSxDQUFDLE1BQU0sT0FBTyxDQUFBLE9BQVEsRUFBRSxLQUFLLEVBQUEsQ0FBQTtBQUMvRSxRQUFNLGFBQWEsbUJBQW1CLE1BQU0sT0FBTyxPQUFPLFNBQ3ZELGdDQUNBLDRCQUE0QixjQUFBLE1BQW9CLE1BQU0sT0FBTyxPQUFPLE1BQU07QUFDN0UsUUFBTSxjQUFjLFlBQVksaUJBQWlCLE1BQU0sT0FBTyxPQUFPLFNBQ2xFLDRCQUE0QixNQUFNLE9BQU8sT0FBTyxTQUFTLGNBQUEsU0FDMUQsTUFBTSxPQUFPLE9BQU8sU0FBUyxtQkFBbUIsSUFBSSxLQUFLLEdBQUEsd0RBRXhEO0FBQ0gsUUFBTSxZQUFZO0lBQ2YsaUJBQWlCLDRFQUE0RSxjQUFBLHFCQUFtQyxFQUFBO0lBQ2hJLGdCQUFnQiwwRUFBMEUsYUFBQSxxQkFBa0MsRUFBQTs7O0tBRzNILFdBQUE7OztLQUdBLFdBQUE7cUVBQ2dFLFdBQVcsS0FBSyxVQUFBO01BQy9FLFVBQUE7OztBQUdOO0FBRUEsU0FBUyxnQkFBZ0IsT0FBa0I7QUFDMUMsV0FBUyxJQUFJLEdBQUcsSUFBSSxNQUFNLE9BQU8sT0FBTyxRQUFRLEtBQUs7QUFDcEQsUUFBSSxNQUFNLE9BQU8sVUFBVSxDQUFBLEVBQUk7QUFDL0IsVUFBTSxLQUFLLE1BQU0sT0FBTyxPQUFPLENBQUE7QUFDL0IsVUFBTSxNQUFNLFVBQVUsRUFBQTtBQUN0QixRQUFJLENBQUMsT0FBTyxJQUFJLFNBQVMsV0FBVyxJQUFJLFNBQVMsU0FBVTtBQUMzRCxVQUFNLEVBQUUsU0FBUyxPQUFNLElBQUssaUJBQWlCLEtBQUssY0FBYyxJQUFJLEdBQUEsQ0FBQTtBQUNwRSxVQUFNLE1BQU0sS0FBSyxJQUFJLEtBQUssS0FBSyxNQUFNLFVBQVUsU0FBUyxHQUFBLENBQUE7QUFDeEQsVUFBTSxRQUFRLE1BQU0sY0FBYyxvQkFBb0IsSUFBSSxFQUFFLElBQUk7QUFDaEUsVUFBTSxRQUFRLE1BQU0sY0FBYyxxQkFBcUIsSUFBSSxFQUFFLElBQUk7QUFDakUsUUFBSSxPQUFPO0FBQ1YsWUFBTSxhQUFhLGlCQUFpQixPQUFPLEdBQUEsQ0FBQTtBQUMzQyxZQUFNLE9BQU8sTUFBTSxjQUEyQixpQkFBQTtBQUM5QyxVQUFJLEtBQU0sTUFBSyxNQUFNLFFBQVEsR0FBRyxHQUFBO0lBQ2pDO0FBQ0EsUUFBSSxNQUFPLE9BQU0sY0FBYyxHQUFHLFVBQVUsT0FBQSxDQUFBLE1BQWMsVUFBVSxNQUFBLENBQUE7RUFDckU7QUFDQSxRQUFNLE9BQU8sV0FBQTtBQUNiLFFBQU0sWUFBWSxNQUFNLFFBQVE7QUFDaEMsYUFBVyxPQUFPLE1BQU0saUJBQW9DLG1CQUFBLEVBQXNCLEtBQUksV0FBVyxDQUFDO0FBQ25HOzs7QUNwRU8sSUFBTSxXQUFxQjtFQUNqQyxLQUFLO0lBQUUsTUFBTTtJQUFNLFNBQVM7SUFBTSxPQUFPO0lBQU0sV0FBVztFQUFLO0VBQy9ELFlBQVk7SUFBRSxPQUFPO0lBQU0sZUFBZTtJQUFNLGdCQUFnQjtJQUFNLGNBQWM7RUFBSztFQUN6RixRQUFRO0lBQUUsT0FBTztJQUFNLGVBQWU7RUFBSztBQUM1QztBQUVPLFNBQVMsY0FBYyxLQUFXO0FBQ3hDLFFBQU0sS0FBSyxTQUFTLGVBQWUsZ0JBQUE7QUFDbkMsTUFBSSxDQUFDLEdBQUk7QUFDVCxLQUFHLGNBQWM7QUFDbEI7QUFFTyxTQUFTLGtCQUFrQixRQUFjO0FBQy9DLFFBQU0sTUFBTSxTQUFTLGVBQWUsaUJBQUE7QUFDcEMsTUFBSSxDQUFDLE9BQU8sSUFBSSxjQUFjLGlCQUFpQixNQUFBLElBQVUsRUFBRztBQUM1RCxRQUFNLE1BQU0sU0FBUyxjQUFjLFFBQUE7QUFDbkMsTUFBSSxRQUFRO0FBQ1osTUFBSSxjQUFjLFVBQVUsTUFBQSxFQUFRO0FBQ3BDLE1BQUksWUFBWSxHQUFBO0FBQ2pCO0FBRU8sU0FBUyxZQUFBO0FBQ2YsaUJBQUE7QUFDQSxZQUFBO0FBQ0Esd0JBQUE7QUFDQSxzQkFBQTtBQUNBLHNCQUFBO0FBQ0Q7QUFFTyxTQUFTLFlBQUE7QUFDZixRQUFNLE1BQU0sU0FBUztBQUNyQixRQUFNLFdBQVcsR0FBRyxLQUFLLE1BQU0sTUFBTSxJQUFJLEVBQUUsZUFBYyxDQUFBO0FBQ3pELFFBQU0sU0FBUyxJQUFJLFNBQVMsU0FBUyxlQUFlLFVBQUE7QUFDcEQsTUFBSSxVQUFVLE9BQU8sZ0JBQWdCLFNBQVUsUUFBTyxjQUFjO0FBQ3BFLFFBQU0sY0FBYyxHQUFHLFdBQUEsRUFBYSxlQUFjLENBQUEsSUFBTSxXQUFBLEVBQWEsZUFBYyxDQUFBO0FBQ25GLFFBQU0sWUFBWSxJQUFJLFlBQVksU0FBUyxlQUFlLGFBQUE7QUFDMUQsTUFBSSxhQUFhLFVBQVUsZ0JBQWdCLFlBQWEsV0FBVSxjQUFjO0FBQ2hGLFFBQU0sY0FBYyxJQUFJLGNBQWMsU0FBUyxlQUFlLGVBQUE7QUFDOUQsTUFBSSxhQUFhO0FBQ2hCLFVBQU0sVUFBVSxRQUFRLE1BQU0sU0FBUyxFQUNyQyxPQUFPLENBQUMsQ0FBQSxFQUFHLENBQUEsTUFBTyxJQUFJLENBQUEsRUFDdEIsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFBLE1BQU8sR0FBRyxFQUFFLGVBQWMsQ0FBQSxJQUFNLG1CQUFtQixHQUFHLENBQUEsQ0FBQSxFQUFJLEVBQ25FLEtBQUssSUFBQTtBQUNQLFFBQUksWUFBWSxnQkFBZ0IsUUFBUyxhQUFZLGNBQWM7RUFDcEU7QUFDQSxRQUFNLFVBQVUsSUFBSSxVQUFVLFNBQVMsZUFBZSxXQUFBO0FBQ3RELE1BQUksU0FBUztBQUNaLFVBQU0sRUFBRSxVQUFVLFVBQVUsY0FBYSxJQUFLLHNCQUFBO0FBQzlDLFFBQUksWUFBWTtBQUNoQixRQUFJLGFBQWE7QUFDakIsUUFBSSxVQUFVO0FBQ2IsVUFBSSxTQUFTLFNBQVMsR0FBRztBQUN4QixjQUFNLFFBQVEsU0FBUyxNQUFNLEdBQUcsQ0FBQSxFQUFHLElBQUksQ0FBQyxNQUFNLFVBQVUsRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLEtBQUssSUFBQTtBQUNuRixvQkFBWSxlQUFlLEtBQUE7QUFDM0IscUJBQWE7TUFDZCxXQUFXLGtCQUFrQixNQUFNO0FBQ2xDLG9CQUFZLGtCQUFrQixNQUFNLGNBQWMsVUFBVSxhQUFBO0FBQzVELHFCQUFhLGtCQUFrQixNQUFNLFdBQVc7TUFDakQ7SUFDRDtBQUNBLFFBQUksUUFBUSxnQkFBZ0IsVUFBVyxTQUFRLGNBQWM7QUFDN0QsUUFBSSxRQUFRLGNBQWMsV0FBWSxTQUFRLFlBQVk7RUFDM0Q7QUFDRDtBQUVPLFNBQVMsc0JBQUE7QUFDZixRQUFNLEVBQUUsVUFBVSxTQUFRLElBQUssc0JBQUE7QUFDL0IsTUFBSSxDQUFDLFNBQVUsUUFBTztBQUN0QixRQUFNLFlBQVksU0FBUyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sS0FBQyxFQUFNLEtBQUssQ0FBQyxHQUFHLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRztBQUNwRixRQUFNLFlBQVksU0FBUyxPQUFPLENBQUMsTUFBTSxFQUFFLE1BQU0sSUFBQSxFQUFNLEtBQUssQ0FBQyxHQUFHLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRztBQUNuRixRQUFNLFlBQXNCLENBQUE7QUFDNUIsTUFBSSxVQUFVLFNBQVMsR0FBRztBQUN6QixVQUFNLFFBQVEsVUFBVSxJQUFJLENBQUMsTUFBTSxPQUFPLFVBQVUsRUFBRSxXQUFXLEVBQUUsS0FBSyxVQUFVLEtBQUssSUFBSSxFQUFFLEdBQUcsRUFBRSxRQUFRLENBQUEsQ0FBQSxpQkFBbUIsRUFBRSxLQUFLLEVBQUE7QUFDcEksY0FBVSxLQUFLLHVFQUF1RSxLQUFBLE9BQVk7RUFDbkc7QUFDQSxNQUFJLFVBQVUsU0FBUyxHQUFHO0FBQ3pCLFVBQU0sUUFBUSxVQUFVLElBQUksQ0FBQyxNQUFNLE9BQU8sVUFBVSxFQUFFLFdBQVcsRUFBRSxLQUFLLE1BQU0sRUFBRSxJQUFJLFFBQVEsQ0FBQSxDQUFBLFlBQWMsRUFBRSxLQUFLLEVBQUE7QUFDakgsY0FBVSxLQUFLLG9FQUFvRSxLQUFBLE9BQVk7RUFDaEc7QUFDQSxNQUFJLFVBQVUsV0FBVyxLQUFLLFVBQVUsV0FBVyxFQUFHLFdBQVUsS0FBSyxxREFBcUQ7QUFDMUgsUUFBTSxTQUFTLFVBQVUsU0FBUyxJQUFJLG9HQUFvRztBQUMxSSxRQUFNLGFBQWEsaUJBQUE7QUFDbkIsUUFBTSxpQkFBaUIsYUFDcEIsOEJBQThCLFdBQVcsWUFBWSxtQkFBbUIsa0JBQUEsS0FDekUsV0FBVyxZQUFZLGtCQUFrQixZQUFBLFdBQy9CLFdBQVcsS0FBSyxVQUFVLFdBQVcsS0FBSyxlQUFjLENBQUEsZUFDakU7QUFDSCxTQUFPOzs7S0FHSCxVQUFVLEtBQUssRUFBQSxDQUFBO0tBQ2YsY0FBQTs7SUFFRCxNQUFBOztBQUVKO0FBRU8sU0FBUyx3QkFBQTtBQUNmLFFBQU0sYUFBYSxTQUFTO0FBQzVCLFFBQU0sUUFBUSxXQUFXLFVBQVUsU0FBUyxlQUFlLGtCQUFBO0FBQzNELE1BQUksQ0FBQyxNQUFPO0FBQ1osUUFBTSxTQUFTLFFBQVE7QUFDdkIsUUFBTSxhQUFhLHNCQUFBO0FBQ25CLFFBQU0sZ0JBQWdCLFdBQVcsbUJBQW1CLE1BQUE7QUFDbkQsVUFBTSxLQUFLLFNBQVMsY0FBYyxLQUFBO0FBQ2xDLE9BQUcsWUFBWTtBQUNmLE9BQUcsTUFBTSxZQUFZO0FBQ3JCLE9BQUcsTUFBTSxlQUFlO0FBQ3hCLFVBQU0sWUFBWSxFQUFBO0FBQ2xCLFdBQU87RUFDUixHQUFDO0FBQ0QsTUFBSSxXQUFXO0FBQ2YsTUFBSSxZQUFZO0FBQ2YsVUFBTSxPQUFPLFVBQVUsVUFBQTtBQUN2QixVQUFNLFFBQVEsVUFBVSxVQUFBO0FBQ3hCLGVBQVcsb0VBQW9FLFVBQUEsS0FBZSxNQUFNLFFBQVEsUUFBUSxLQUFLLFVBQUE7V0FDaEgsS0FBSyxLQUFLLEtBQUssVUFBVSxJQUFJLFNBQVMsTUFBTSxlQUFjLElBQUssT0FBQTs7RUFFekU7QUFDQSxnQkFBYyxZQUFZO0FBQzFCLFFBQU0saUJBQWlCLFdBQVcsb0JBQW9CLE1BQUE7QUFDckQsVUFBTSxLQUFLLFNBQVMsY0FBYyxrQkFBQTtBQUNsQyxVQUFNLFlBQVksRUFBQTtBQUNsQixXQUFPO0VBQ1IsR0FBQztBQUNELE1BQUksV0FBVyxRQUFRLGVBQWUsYUFBYSxLQUFBLE1BQVcsT0FBUSxnQkFBZSxNQUFNO0FBQzNGLGlCQUFlLFFBQU87QUFDdEIsUUFBTSxlQUFlLFdBQVcsa0JBQWtCLE1BQUE7QUFDakQsVUFBTSxLQUFLLFNBQVMsY0FBYyxLQUFBO0FBQ2xDLE9BQUcsWUFBWTtBQUNmLFVBQU0sWUFBWSxFQUFBO0FBQ2xCLFdBQU87RUFDUixHQUFDO0FBQ0QsZUFBYSxZQUFZLG9CQUFBO0FBQzFCO0FBRU8sU0FBUyxzQkFBQTtBQUNmLFFBQU0sU0FBUyxTQUFTO0FBQ3hCLFFBQU0sZ0JBQWdCLE9BQU8sbUJBQW1CLE1BQUE7QUFDL0MsVUFBTSxRQUFRLE9BQU8sVUFBVSxTQUFTLGVBQWUsY0FBQTtBQUN2RCxRQUFJLENBQUMsTUFBTyxRQUFPO0FBQ25CLFVBQU0sVUFBVSxJQUFJLGNBQUE7QUFDcEIsVUFBTSxnQkFBZ0IsT0FBQTtBQUN0QixXQUFPO0VBQ1IsR0FBQztBQUNELE1BQUksQ0FBQyxjQUFlO0FBQ3BCLGdCQUFjLFFBQU87QUFDdEI7QUFFTyxTQUFTLGlCQUFBO0FBQ2YsUUFBTSxZQUFZLFNBQVMsZUFBZSxvQkFBQTtBQUMxQyxNQUFJLENBQUMsVUFBVztBQUNoQixNQUFJLE1BQU0sU0FBUyxjQUFjLElBQUEsR0FBTztBQUN2QyxRQUFJLENBQUMsVUFBVSxjQUFjLFFBQUEsR0FBVztBQUN2QyxZQUFNLE1BQU0sU0FBUyxjQUFjLFFBQUE7QUFDbkMsVUFBSSxZQUFZO0FBQ2hCLFVBQUksUUFBUSxTQUFTO0FBQ3JCLFVBQUksY0FBYztBQUNsQixnQkFBVSxZQUFZLEdBQUE7SUFDdkI7RUFDRCxNQUFPLFdBQVUsWUFBWTtBQUM5QjtBQUlPLFNBQVMsdUJBQUE7QUFDZixRQUFNLE1BQU0sU0FBUyxlQUFlLGlCQUFBO0FBQ3BDLE1BQUksS0FBSztBQUNSLFFBQUksWUFBWTtBQUNoQixzQkFBa0IsYUFBQTtBQUNsQixRQUFJLFFBQVE7RUFDYjtBQUNBLFFBQU0sUUFBUSxTQUFTLFdBQVcsU0FBUyxTQUFTLGVBQWUsa0JBQUE7QUFDbkUsTUFBSSxNQUFPLE9BQU0sWUFBWTtBQUM3QixXQUFTLGFBQWE7SUFBRSxPQUFPO0lBQU0sZUFBZTtJQUFNLGdCQUFnQjtJQUFNLGNBQWM7RUFBSztBQUNwRzs7O0FDOU1PLFNBQVMsb0JBQUE7QUFDZixRQUFNLEtBQUssU0FBUyxlQUFlLGlCQUFBO0FBQ25DLE1BQUksQ0FBQyxHQUFJO0FBQ1QsUUFBTSxPQUFPLE1BQU0sU0FBUztBQUM1QixRQUFNLFlBQVksS0FBSyxNQUFNLE1BQU0sU0FBUyxpQkFBaUIsYUFBYSxNQUFNLE1BQU0sVUFBVTtBQUNoRyxRQUFNLFlBQVksTUFBTSxTQUFTLGdCQUFnQjtBQUNqRCxRQUFNLFVBQVUsdUJBQUE7QUFDaEIsUUFBTSxhQUFnQztJQUNyQyxrQkFBa0IsS0FBSyxlQUFjLENBQUE7SUFDckMsc0JBQXNCLFVBQVUsZUFBYyxDQUFBO0lBQzlDLFlBQVksSUFBSSxvQkFBb0IsVUFBVSxlQUFjLENBQUEsS0FBTztJQUNsRSxPQUFPLE9BQUE7QUFDVCxRQUFNLGNBQWMsUUFBUSxTQUFTLElBQ2xDOztvQ0FFZ0MsUUFBUSxJQUFJLENBQUMsTUFBTSxPQUFPLENBQUEsT0FBUSxFQUFFLEtBQUssRUFBQSxDQUFBO1lBRXpFO0FBQ0gsS0FBRyxZQUFZOzs7O2dDQUlnQixXQUFXLElBQUksQ0FBQyxNQUFNLE1BQU0sQ0FBQSxNQUFPLEVBQUUsS0FBSyxFQUFBLENBQUE7S0FDckUsV0FBQTs7Ozs7OztBQU9KLEtBQUcsU0FBUztBQUNaLEtBQUcsY0FBMkIsa0NBQUEsR0FBcUMsTUFBQTtBQUNuRSxXQUFTLDRFQUFBO0FBQ1Y7QUFFTyxTQUFTLG9CQUFBO0FBQ2YsUUFBTSxLQUFLLFNBQVMsZUFBZSxpQkFBQTtBQUNuQyxNQUFJLEdBQUksSUFBRyxTQUFTO0FBQ3JCOzs7QUNoQk8sU0FBUyxlQUFlLFFBQWM7QUFDNUMsU0FBTyxTQUFTLE1BQUE7QUFDaEIsUUFBTSxNQUFNLFVBQVUsTUFBQTtBQUN0QixRQUFNLE1BQU0sTUFBTSxVQUFVLE1BQUE7QUFDNUIsTUFBSSxJQUFJLFNBQVU7QUFDbEIsTUFBSSxDQUFDLGtCQUFrQixNQUFBLEVBQVM7QUFDaEMsUUFBTSxPQUFPLFVBQVUsTUFBQTtBQUN2QixNQUFJLE1BQU0sT0FBTyxNQUFNO0FBQ3RCLGFBQVMsUUFBUSxLQUFLLGVBQWMsQ0FBQSxrQkFBb0IsSUFBSSxLQUFLLEdBQUc7QUFDcEU7RUFDRDtBQUNBLFFBQU0sUUFBUTtBQUNkLE1BQUksV0FBVztBQUNmLGFBQVcsQ0FBQyxJQUFJLElBQUEsS0FBUyxRQUFRLElBQUksUUFBUSxHQUFHO0FBQy9DLFFBQUksS0FBSyxlQUFlLEtBQUssQ0FBQyxLQUFLLGNBQWUsS0FBSSxTQUFTLEVBQUEsRUFBSSxXQUFXO0VBQy9FO0FBQ0EsV0FBUyxHQUFHLElBQUksS0FBSyxTQUFTO0FBQzlCLE9BQUssa0JBQWtCLE1BQUE7QUFDeEI7QUFFTyxTQUFTLGNBQWMsUUFBZ0IsWUFBc0I7QUFDbkUsU0FBTyxVQUFVLFFBQVEsVUFBQTtBQUN6QixRQUFNLE9BQU8sVUFBVSxNQUFBLEVBQVEsU0FBUyxVQUFBO0FBQ3hDLFFBQU0sTUFBTSxNQUFNLFVBQVUsTUFBQSxFQUFRLFNBQVMsVUFBQTtBQUM3QyxNQUFJLElBQUksU0FBVTtBQUNsQixNQUFJLEtBQUssaUJBQWlCLENBQUMsTUFBTSxVQUFVLE1BQUEsRUFBUSxTQUFTLEtBQUssYUFBYSxFQUFFLFNBQVU7QUFDMUYsUUFBTSxPQUFPLFdBQVcsUUFBUSxVQUFBO0FBQ2hDLE1BQUksTUFBTSxPQUFPLE1BQU07QUFDdEIsYUFBUyxRQUFRLEtBQUssZUFBYyxDQUFBLG1CQUFxQixVQUFVLEtBQUssU0FBUyxFQUFFLEtBQUssY0FBYztBQUN0RztFQUNEO0FBQ0EsUUFBTSxRQUFRO0FBQ2QsTUFBSSxXQUFXO0FBQ2YsV0FBUyxHQUFHLFVBQVUsS0FBSyxTQUFTLEVBQUUsS0FBSyx1QkFBdUI7QUFDbEUsT0FBSyxvQkFBb0I7SUFBRTtJQUFRO0VBQVcsQ0FBQTtBQUMvQztBQUVPLFNBQVMsUUFBUSxRQUFnQixZQUFzQjtBQUM3RCxTQUFPLFdBQVcsUUFBUSxVQUFBO0FBQzFCLFFBQU0sTUFBTSxNQUFNLFVBQVUsTUFBQSxFQUFRLFNBQVMsVUFBQTtBQUM3QyxNQUFJLENBQUMsSUFBSSxTQUFVO0FBQ25CLFFBQU0sT0FBTyxhQUFhLFFBQVEsVUFBQTtBQUNsQyxNQUFJLE1BQU0sT0FBTyxNQUFNO0FBQ3RCLGFBQVMsUUFBUSxLQUFLLGVBQWMsQ0FBQSxzQkFBd0I7QUFDNUQ7RUFDRDtBQUNBLFFBQU0sUUFBUTtBQUNkLE1BQUksTUFBTSxLQUFLO0lBQUUsSUFBSSxFQUFFLFFBQVE7SUFBWSxVQUFVO0VBQUksQ0FBQTtBQUN6RCxRQUFNLFFBQVEsVUFBVSxVQUFVLE1BQUEsRUFBUSxTQUFTLFVBQUEsRUFBWSxTQUFTLEVBQUU7QUFDMUUsV0FBUyxlQUFlLEtBQUEsWUFBaUIsSUFBSSxNQUFNLE9BQU8sZUFBYyxDQUFBLFFBQVUsSUFBSSxNQUFNLFdBQVcsSUFBSSxLQUFLLEdBQUEsR0FBTTtBQUN0SCxnQkFBQTtBQUNEO0FBRU8sU0FBUyxTQUFTLFFBQWdCLFlBQXNCO0FBQzlELFNBQU8sWUFBWSxRQUFRLFVBQUE7QUFDM0IsUUFBTSxNQUFNLE1BQU0sVUFBVSxNQUFBLEVBQVEsU0FBUyxVQUFBO0FBQzdDLE1BQUksSUFBSSxNQUFNLFdBQVcsRUFBRztBQUM1QixRQUFNLFNBQVMsV0FBVyxRQUFRLFVBQUE7QUFDbEMsTUFBSSxNQUFNLElBQUc7QUFDYixNQUFJLElBQUksTUFBTSxXQUFXLEVBQUcsUUFBTyxRQUFRLGVBQWUsR0FBRyxNQUFBLElBQVUsVUFBQSxFQUFZO0FBQ25GLFFBQU0sUUFBUTtBQUNkLFFBQU0sUUFBUSxVQUFVLFVBQVUsTUFBQSxFQUFRLFNBQVMsVUFBQSxFQUFZLFNBQVMsRUFBRTtBQUMxRSxXQUFTLGlCQUFpQixPQUFPLGVBQWMsQ0FBQSxVQUFZLEtBQUEsWUFBaUIsSUFBSSxNQUFNLE9BQU8sZUFBYyxDQUFBLFFBQVUsSUFBSSxNQUFNLFdBQVcsSUFBSSxLQUFLLEdBQUEsR0FBTTtBQUN6SixnQkFBQTtBQUNEO0FBRU8sU0FBUyxjQUFjLFFBQWdCLFlBQXNCO0FBQ25FLFNBQU8sVUFBVSxRQUFRLFVBQUE7QUFDekIsUUFBTSxPQUFPLFVBQVUsTUFBQSxFQUFRLFNBQVMsVUFBQTtBQUN4QyxRQUFNLE1BQU0sTUFBTSxVQUFVLE1BQUEsRUFBUSxTQUFTLFVBQUE7QUFDN0MsTUFBSSxJQUFJLE9BQU8sUUFBUTtBQUN0QixRQUFJLE9BQU8sWUFBWTtBQUN2QjtFQUNEO0FBQ0EsUUFBTSxTQUFTLEtBQUs7QUFDcEIsUUFBTSxXQUFXLE9BQU8sT0FBTyxNQUFBLEVBQVEsT0FBTyxDQUFDLEdBQVcsTUFBYyxJQUFJLEdBQUcsQ0FBQTtBQUMvRSxRQUFNLFlBQVksS0FBSyxZQUFZO0FBQ25DLE1BQUksWUFBWSxLQUFLLFdBQUEsSUFBZSxZQUFZLFdBQUEsR0FBYztBQUM3RCxhQUFTLGtCQUFBO0FBQ1Q7RUFDRDtBQUNBLGFBQVcsQ0FBQyxVQUFVLFFBQUEsS0FBYSxRQUFRLE1BQUEsR0FBUztBQUNuRCxRQUFJLE1BQU0sVUFBVSxRQUFBLElBQVksVUFBVTtBQUN6QyxlQUFTLFFBQVEsYUFBYSxLQUFLLE1BQU0sQ0FBQSxHQUFJO0FBQzdDO0lBQ0Q7RUFDRDtBQUNBLE1BQUksT0FBTyxTQUFTO0FBQ3BCLE1BQUksT0FBTyxXQUFXO0FBQ3RCLFdBQVMsbUJBQUE7QUFDVjtBQUVPLFNBQVMsaUJBQUE7QUFDZixTQUFPLFNBQUE7QUFDUCxRQUFNLE9BQU8sbUJBQUE7QUFDYixNQUFJLE1BQU0sT0FBTyxNQUFNO0FBQ3RCLGFBQVMsUUFBUSxLQUFLLGVBQWMsQ0FBQSwwQkFBNEI7QUFDaEU7RUFDRDtBQUNBLFFBQU0sUUFBUTtBQUNkLFFBQU0sUUFBUTtBQUNkLFdBQVMsdUJBQXVCLFdBQUEsRUFBYSxlQUFjLENBQUEsU0FBVztBQUN0RSxnQkFBQTtBQUNEO0FBRU8sU0FBUyxVQUFBO0FBQ2YsU0FBTyxTQUFBO0FBQ1AsUUFBTSxZQUFZLEtBQUssU0FBQSxFQUFXLE9BQU8sQ0FBQyxNQUFNLE1BQU0sVUFBVSxDQUFBLElBQUssQ0FBQTtBQUNyRSxNQUFJLFVBQVUsV0FBVyxFQUFHO0FBQzVCLE1BQUksY0FBYztBQUNsQixhQUFXLEtBQUssV0FBVztBQUMxQixVQUFNLE1BQU0sTUFBTSxVQUFVLENBQUE7QUFDNUIsVUFBTSxTQUFTLE1BQU0sYUFBYSxDQUFBO0FBQ2xDLG1CQUFlO0FBQ2YsVUFBTSxNQUFNLGVBQWUsQ0FBQSxLQUFNLE1BQU0sTUFBTSxlQUFlLENBQUEsS0FBTSxLQUFLO0FBQ3ZFLFVBQU0sVUFBVSxDQUFBLElBQUs7RUFDdEI7QUFDQSxRQUFNLE1BQU0sY0FBYztBQUMxQixRQUFNLFFBQVE7QUFDZCxXQUFTLHVCQUF1QixZQUFZLGVBQWMsQ0FBQSxRQUFVO0FBQ3BFLGdCQUFBO0FBQ0Q7QUFFTyxTQUFTLFlBQVksYUFBd0I7QUFDbkQsU0FBTyxRQUFRLFdBQUE7QUFDZixRQUFNLE1BQU0sTUFBTSxVQUFVLFdBQUE7QUFDNUIsTUFBSSxPQUFPLEVBQUc7QUFDZCxRQUFNLFNBQVMsTUFBTSxhQUFhLFdBQUE7QUFDbEMsUUFBTSxVQUFVLFdBQUEsSUFBZTtBQUMvQixRQUFNLE1BQU0sZUFBZSxXQUFBLEtBQWdCLE1BQU0sTUFBTSxlQUFlLFdBQUEsS0FBZ0IsS0FBSztBQUMzRixRQUFNLE1BQU0sY0FBYztBQUMxQixRQUFNLFFBQVE7QUFDZCxXQUFTLFFBQVEsSUFBSSxlQUFjLENBQUEsSUFBTSxtQkFBbUIsYUFBYSxHQUFBLENBQUEsUUFBWSxPQUFPLGVBQWMsQ0FBQSxRQUFVO0FBQ3BILGdCQUFBO0FBQ0Q7QUFFTyxTQUFTLHFCQUFxQixRQUFnQixZQUFzQjtBQUMxRSxTQUFPLFVBQVUsUUFBUSxVQUFBO0FBQ3pCLFFBQU0sTUFBTSxNQUFNLFVBQVUsTUFBQSxFQUFRLFNBQVMsVUFBQTtBQUM3QyxNQUFJLENBQUMsSUFBSSxTQUFVO0FBQ25CLE1BQUksVUFBVSxDQUFDLElBQUk7QUFDbkIsTUFBSSxDQUFDLElBQUksU0FBUztBQUNqQixRQUFJLE9BQU8sU0FBUztBQUNwQixRQUFJLE9BQU8sV0FBVztFQUN2QjtBQUNBLFFBQU0sWUFBWSxVQUFVLE1BQUEsRUFBUSxTQUFTLFVBQUEsRUFBWTtBQUN6RCxXQUFTLEdBQUcsVUFBVSxTQUFBLEVBQVcsS0FBSyxlQUFlLElBQUksVUFBVSxZQUFZLFFBQUEsR0FBVztBQUMxRixnQkFBQTtBQUNEO0FBRU8sU0FBUyxlQUFBO0FBQ2YsU0FBTyxVQUFBO0FBQ1AsTUFBSSxDQUFDLE1BQU0sU0FBUyxlQUFlLElBQUEsSUFBUSxNQUFNLFNBQVMsWUFBYTtBQUN2RSxRQUFNLFNBQVMsS0FBSyxNQUFNLHFCQUFBLElBQXlCLHFCQUFBLENBQUE7QUFDbkQsUUFBTSxRQUFRO0FBQ2QsUUFBTSxNQUFNLGNBQWM7QUFDMUIsUUFBTSxNQUFNO0FBQ1osUUFBTSxTQUFTLGNBQWM7QUFDN0IsV0FBUyw2QkFBNkIsT0FBTyxlQUFjLENBQUEsUUFBVTtBQUNyRSxnQkFBQTtBQUNEO0FBSU8sU0FBUyxrQkFBQTtBQUNmLFNBQU8sZUFBQTtBQUNQLE1BQUksY0FBYztBQUNsQixXQUFTLElBQUksR0FBRyxJQUFJLEtBQUssS0FBSztBQUM3QixVQUFNLEVBQUUsU0FBUSxJQUFLLHNCQUFBO0FBQ3JCLFFBQUksU0FBUyxXQUFXLEVBQUc7QUFDM0IsUUFBSSxTQUFTO0FBQ2IsZUFBVyxXQUFXLFVBQVU7QUFDL0IsVUFBSSxXQUEwQjtBQUM5QixVQUFJLFlBQStCO0FBQ25DLFlBQU8sWUFBVyxDQUFDLElBQUksR0FBQSxLQUFRLFFBQVEsTUFBTSxTQUFTLEdBQUc7QUFDeEQsWUFBSSxDQUFDLElBQUksU0FBVTtBQUNuQixtQkFBVyxDQUFDLElBQUksSUFBQSxLQUFTLFFBQVEsVUFBVSxFQUFBLEVBQUksUUFBUSxHQUFHO0FBQ3pELGNBQUksSUFBSSxTQUFTLEVBQUEsRUFBSSxZQUFZLEtBQUssY0FBYyxRQUFRLGFBQWE7QUFDeEUsdUJBQVc7QUFDWCx3QkFBWTtBQUNaLGtCQUFNO1VBQ1A7UUFDRDtNQUNEO0FBQ0EsVUFBSSxDQUFDLFlBQVksQ0FBQyxVQUFXO0FBQzdCLFlBQU0sT0FBTyxhQUFhLFVBQVUsU0FBQTtBQUNwQyxVQUFJLE1BQU0sT0FBTyxLQUFNO0FBQ3ZCLFlBQU0sUUFBUTtBQUNkLFlBQU0sVUFBVSxRQUFBLEVBQVUsU0FBUyxTQUFBLEVBQVcsTUFBTSxLQUFLO1FBQUUsSUFBSSxFQUFFLFFBQVE7UUFBWSxVQUFVO01BQUksQ0FBQTtBQUNuRztBQUNBLGVBQVM7QUFDVDtJQUNEO0FBQ0EsUUFBSSxDQUFDLE9BQVE7RUFDZDtBQUNBLE1BQUksY0FBYyxHQUFHO0FBQ3BCLFNBQUE7QUFDQSxrQkFBQTtBQUNBLGFBQVMsVUFBVSxXQUFBLFFBQW1CLGdCQUFnQixJQUFJLEtBQUssR0FBQSxpQ0FBb0M7RUFDcEcsTUFBTyxVQUFTLHdDQUFBO0FBQ2pCOzs7QUM3Tk8sU0FBUyx3QkFBQTtBQUNmLFFBQU0sUUFBUSxTQUFTLGVBQWUsZ0JBQUE7QUFDdEMsTUFBSSxDQUFDLE1BQU87QUFDWixRQUFNLFdBQVcsS0FBSyxLQUFLLFVBQVUsS0FBQSxDQUFBO0FBQ3JDLE1BQUksTUFBTSxZQUFZO0FBQ3JCLFVBQU0sS0FBSyxNQUFNLGNBQW1DLGdCQUFBO0FBQ3BELFFBQUksTUFBTSxTQUFTLGtCQUFrQixHQUFJLElBQUcsUUFBUTtBQUNwRDtFQUNEO0FBQ0EsUUFBTSxZQUFZOzs7NkhBRzBHLFFBQUE7Ozs7Ozs7Ozs7O0FBVzdIO0FBRU8sU0FBUyxVQUFBO0FBQ2YsT0FBQTtBQUNBLFdBQVMsYUFBQTtBQUNWO0FBRU8sU0FBUyxnQkFBQTtBQUNmLE1BQUksQ0FBQyxRQUFRLDZGQUFBLEVBQWdHO0FBQzdHLFlBQUE7QUFDQSxXQUFTLFdBQUEsQ0FBQTtBQUNULFdBQVMsT0FBTTtBQUNoQjtBQUVPLFNBQVMscUJBQUE7QUFDZixRQUFNLE9BQVEsU0FBUyxlQUFlLGVBQUEsR0FBaUQsT0FBTyxLQUFBO0FBQzlGLE1BQUksQ0FBQyxNQUFNO0FBQ1YsYUFBUyxvQkFBQTtBQUNUO0VBQ0Q7QUFDQSxNQUFJO0FBQ0gsVUFBTSxPQUFPLEtBQUssSUFBQTtBQUNsQixVQUFNLFNBQVMsS0FBSyxNQUFNLElBQUE7QUFDMUIsUUFBSSxVQUFVLE9BQU8sU0FBUyxPQUFPLFVBQVU7QUFDOUMsWUFBTSxTQUFTO1FBQUUsR0FBRyxPQUFPO1FBQU8sVUFBVSxPQUFPO01BQVM7QUFDNUQsbUJBQWEsS0FBSyxVQUFVLE1BQUEsQ0FBQTtJQUM3QixPQUFPO0FBQ04sbUJBQWEsSUFBQTtJQUNkO0FBQ0EsYUFBUyw2QkFBQTtBQUNULGVBQVcsTUFBTSxTQUFTLE9BQU0sR0FBSSxHQUFBO0VBQ3JDLFFBQVE7QUFDUCxhQUFTLG9CQUFBO0VBQ1Y7QUFDRDtBQUlPLFNBQVMsa0JBQUE7QUFDZixRQUFNRyxhQUFZLGFBQUE7QUFDbEIsUUFBTSxNQUFNLFNBQVMsZUFBZSxlQUFBO0FBQ3BDLE1BQUksQ0FBQ0EsY0FBYSxDQUFDLEtBQUs7QUFDdkIsYUFBUyx1QkFBQTtBQUNUO0VBQ0Q7QUFDQSxNQUFJLFFBQVEsS0FBSyxVQUFVO0lBQUUsR0FBR0E7SUFBVyxVQUFVO0lBQU8sU0FBUyxLQUFLLElBQUc7RUFBRyxDQUFBO0FBQ2hGLE1BQUksT0FBTTtBQUNWLFdBQVMsZ0JBQWdCLFdBQUEsRUFBYSxlQUFjLENBQUEseUJBQTJCO0FBQ2hGOzs7QUN6REEsU0FBUyx1QkFBQTtBQUNSLFFBQU0sRUFBRSxhQUFhLGdCQUFnQixXQUFVLElBQUsscUJBQUE7QUFDcEQsTUFBSSxtQkFBbUIsRUFBRyxRQUFPO0FBQ2pDLFFBQU0sTUFBTSxhQUFhLElBQ3RCLGNBQWMsY0FBQSxJQUFrQixXQUFBOztjQUErQyxVQUFBLFVBQ2hGLGVBQWUsSUFBSSxLQUFLLEdBQUEsa0RBRXZCO0FBQ0gsU0FBTyxRQUFRLEdBQUE7QUFDaEI7QUFFTyxTQUFTLFlBQVksR0FBYTtBQUN4QyxRQUFNLE1BQU8sRUFBRSxRQUEyQixRQUFxQixxQkFBQTtBQUMvRCxNQUFJLENBQUMsSUFBSztBQUNWLFFBQU0sRUFBRSxPQUFNLElBQUssSUFBSTtBQUN2QixRQUFNLE1BQU0sSUFBSSxRQUFRO0FBQ3hCLFFBQU0sVUFBVSxJQUFJLFFBQVE7QUFDNUIsVUFBUSxRQUFBO0lBQ1AsS0FBSztBQUNKLG1CQUFBO0FBQ0E7SUFDRCxLQUFLO0FBQ0oscUJBQWUsR0FBQTtBQUNmO0lBQ0QsS0FBSztBQUNKLG9CQUFjLEtBQU0sT0FBQTtBQUNwQjtJQUNELEtBQUs7QUFDSixjQUFRLEtBQU0sT0FBQTtBQUNkO0lBQ0QsS0FBSztBQUNKLGVBQVMsS0FBTSxPQUFBO0FBQ2Y7SUFDRCxLQUFLO0FBQ0osb0JBQWMsS0FBTSxPQUFBO0FBQ3BCO0lBQ0QsS0FBSztBQUNKLHFCQUFBO0FBQ0E7SUFDRCxLQUFLO0FBQ0osa0JBQVksSUFBSSxRQUFRLFFBQVE7QUFDaEM7SUFDRCxLQUFLO0FBQ0osY0FBQTtBQUNBO0lBQ0QsS0FBSztBQUNKLDJCQUFxQixLQUFNLE9BQUE7QUFDM0I7SUFDRCxLQUFLO0FBQ0osc0JBQUE7QUFDQTtJQUNELEtBQUs7QUFDSixrQkFBWSxPQUFPLElBQUksUUFBUSxLQUFLLENBQUE7QUFDcEM7SUFDRCxLQUFLO0FBQ0osVUFBSSxxQkFBQSxFQUF3QixvQkFBQTtBQUM1QjtJQUNELEtBQUs7QUFDSixjQUFBO0FBQ0E7SUFDRCxLQUFLO0FBQ0oseUJBQUE7QUFDQTtJQUNELEtBQUs7QUFDSixvQkFBQTtBQUNBO0lBQ0QsS0FBSztBQUNKLHNCQUFBO0FBQ0E7SUFDRCxLQUFLO0FBQ0oscUJBQUE7QUFDQSx3QkFBQTtBQUNBO0lBQ0QsS0FBSztBQUNKLFVBQUksUUFBUSwwRUFBQSxFQUE2RSxnQkFBQTtBQUN6RjtJQUNELEtBQUs7QUFDSixlQUFTLGVBQWUsS0FBQSxHQUFRLFVBQVUsSUFBSSxlQUFBO0FBQzlDLDRCQUFBO0FBQ0EsZUFBUyxjQUEyQiwyQkFBQSxHQUE4QixNQUFBO0FBQ2xFO0lBQ0QsS0FBSztBQUNKLGVBQVMsZUFBZSxLQUFBLEdBQVEsVUFBVSxPQUFPLGVBQUE7QUFDakQsZUFBUyxlQUFlLGNBQUEsR0FBaUIsTUFBQTtBQUN6QztFQUNGO0FBQ0Q7OztBQy9FQSxJQUFNLFVBQVU7QUFDaEIsSUFBTSxjQUFjO0FBRXBCLFNBQVMsYUFBQTtBQUNSLEtBQUcsWUFBWSxhQUFBO0FBQ2YsS0FBRyxVQUFVLFNBQUE7QUFDYixLQUFHLG1CQUFtQixjQUFBO0FBQ3RCLEtBQUcsUUFBUSxNQUFBO0FBQ1YsY0FBQTtBQUNBLHdCQUFBO0FBQ0Esd0JBQUE7RUFDRCxDQUFBO0FBQ0EsS0FBRyxxQkFBcUIscUJBQUE7QUFDeEIsS0FBRyxXQUFXLGlCQUFBO0FBQ2QsS0FBRyxrQkFBa0IsQ0FBQyxXQUFBO0FBQ3JCLHNCQUFrQixNQUFBO0FBQ2xCLFlBQVEsbUJBQW1CO0FBQzNCLFVBQU0sTUFBTSxTQUFTLGVBQWUsaUJBQUE7QUFDcEMsUUFBSSxJQUFLLEtBQUksUUFBUTtBQUNyQixhQUFTLGVBQWUsb0JBQUEsR0FBdUIsYUFBYSxRQUFRLEVBQUE7QUFDcEUsY0FBQTtBQUNBLGFBQVMsZUFBZSxpQkFBQSxHQUFvQixNQUFBO0VBQzdDLENBQUE7QUFDQSxLQUFHLG9CQUFvQixDQUFDLEVBQUUsUUFBUSxXQUFVLE1BQTBDO0FBQ3JGLGNBQUE7QUFDQSxVQUFNLFNBQVMsU0FBUyxjQUFpQyxzQ0FBc0MsTUFBQSxvQkFBMEIsVUFBQSxJQUFjO0FBQ3ZJLFFBQUksVUFBVSxDQUFDLE9BQU8sU0FBVSxRQUFPLE1BQUs7UUFDdkMsVUFBUyxlQUFlLGlCQUFBLEdBQW9CLE1BQUE7RUFDbEQsQ0FBQTtBQUNBLEtBQUcsa0JBQWtCLE1BQUE7QUFDcEIseUJBQUE7QUFDQSwwQkFBQTtFQUNELENBQUE7QUFDQSxLQUFHLG1CQUFtQixNQUFBO0FBQ3JCLHlCQUFBO0FBQ0Esc0JBQUE7QUFDQSwwQkFBQTtFQUNELENBQUE7QUFDRDtBQUVBLFNBQVMsbUJBQUE7QUFDUixpQkFBZSxPQUFPLHlCQUF5QixtQkFBQTtBQUMvQyxpQkFBZSxPQUFPLG9CQUFvQixlQUFBO0FBQzFDLGlCQUFlLE9BQU8seUJBQXlCLG1CQUFBO0FBQy9DLGlCQUFlLE9BQU8sdUJBQXVCLGlCQUFBO0FBQzdDLGlCQUFlLE9BQU8sa0JBQWtCLGFBQUE7QUFDekM7QUFFQSxTQUFTLE9BQUE7QUFDUixtQkFBQTtBQUNBLGFBQUE7QUFDQSxhQUFXLFlBQUE7QUFDWCxPQUFBO0FBQ0EsUUFBTSxlQUFlLElBQUksSUFBSSxXQUFXLElBQUksQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFBO0FBQ3ZELFFBQU0sY0FBYyxNQUFNLE9BQU8sT0FBTyxLQUFLLENBQUMsT0FBTyxDQUFDLGFBQWEsSUFBSSxFQUFBLENBQUE7QUFDdkUsTUFBSSxNQUFNLE9BQU8sT0FBTyxXQUFXLEtBQUssWUFBYSxZQUFBO0FBQ3JELFFBQU0sV0FBVyxJQUFBO0FBR2pCLE9BQUE7QUFHQSxpQkFBZSxLQUFLLE1BQU0sS0FBSyxVQUFVLEtBQUEsQ0FBQSxHQUFTLFNBQUEsQ0FBQTtBQUNsRCxhQUFXLFVBQVUsT0FBTyxLQUFLLFNBQUEsRUFBWSxLQUFJLE1BQU0sVUFBVSxNQUFBLEVBQVEsU0FBVSxtQkFBa0IsTUFBQTtBQUNyRyxRQUFNLGFBQWEsT0FBTyxLQUFLLFNBQUEsRUFBVyxLQUFLLENBQUMsTUFBTSxNQUFNLFVBQVUsQ0FBQSxFQUFHLFFBQVE7QUFDakYsVUFBUSxtQkFBbUIsY0FBYztBQUN6QyxRQUFNLE1BQU0sU0FBUyxlQUFlLGlCQUFBO0FBQ3BDLE1BQUksT0FBTyxXQUFZLEtBQUksUUFBUTtBQUNuQyxPQUFLLGlCQUFpQixVQUFVLE1BQUE7QUFDL0IsWUFBUSxtQkFBbUIsSUFBSSxTQUFTO0FBQ3hDLDBCQUFBO0VBQ0QsQ0FBQTtBQUNBLFlBQUE7QUFDQSxXQUFTLGlCQUFpQixTQUFTLFdBQUE7QUFDbkMsY0FBWSxNQUFNLE9BQUE7QUFDbEIsY0FBWSxNQUFNLFdBQUE7QUFDbEIsTUFBSSxlQUFBLEtBQW9CLENBQUMsTUFBTSxTQUFTLGFBQWMsbUJBQUE7QUFDdkQ7QUFFQSxJQUFJLFNBQVMsZUFBZSxVQUFXLFVBQVMsaUJBQWlCLG9CQUFvQixJQUFBO0lBQ2hGLE1BQUE7IiwKICAibmFtZXMiOiBbImVudHJpZXMiLCAiZW50cmllcyIsICJtYW51YWxQcm9kdWNlIiwgImFkZFNsb3QiLCAic2VsbFNsb3QiLCAiY2FyZCIsICJidXR0b24iLCAic2VsbEFsbCIsICJyZWNvcmRpbmciXQp9Cg==
