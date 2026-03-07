/**
 * Labor Rates Database
 * Comprehensive labor rates by trade with crew compositions and productivity rates.
 * Rates are average US market and should be adjusted for local conditions.
 */

export const LABOR_RATES = {
  // =========================================================================
  // GENERAL / LABORER
  // =========================================================================
  laborer: {
    trade: 'General Laborer',
    baseRate: 22.00,
    overtimeRate: 33.00,
    burdenRate: 0.35,
    fullyBurdenedRate: 29.70,
    productivityRates: {
      cleanup: { rate: 1.0, unit: 'hr', description: 'General cleanup per hour' },
      demolition: { rate: 50, unit: 'sf/hr', description: 'Light demolition' },
      materialHandling: { rate: 1.0, unit: 'hr', description: 'Material handling per hour' },
    },
  },

  // =========================================================================
  // CARPENTER
  // =========================================================================
  carpenter: {
    trade: 'Carpenter',
    baseRate: 35.00,
    overtimeRate: 52.50,
    burdenRate: 0.35,
    fullyBurdenedRate: 47.25,
    productivityRates: {
      framing_walls: { rate: 160, unit: 'sf/day', description: 'Wall framing per day (1 carpenter)' },
      framing_floor: { rate: 200, unit: 'sf/day', description: 'Floor framing per day' },
      framing_roof: { rate: 120, unit: 'sf/day', description: 'Roof framing per day' },
      sheathing: { rate: 320, unit: 'sf/day', description: 'Wall/roof sheathing per day' },
      subfloor: { rate: 400, unit: 'sf/day', description: 'Subfloor installation per day' },
      siding_vinyl: { rate: 200, unit: 'sf/day', description: 'Vinyl siding per day' },
      siding_fiber: { rate: 150, unit: 'sf/day', description: 'Fiber cement siding per day' },
      trim_baseboard: { rate: 150, unit: 'lf/day', description: 'Baseboard installation per day' },
      trim_casing: { rate: 20, unit: 'ea/day', description: 'Door/window casing per day (openings)' },
      trim_crown: { rate: 100, unit: 'lf/day', description: 'Crown molding per day' },
      door_install_int: { rate: 6, unit: 'ea/day', description: 'Interior door installation per day' },
      door_install_ext: { rate: 3, unit: 'ea/day', description: 'Exterior door installation per day' },
      window_install: { rate: 5, unit: 'ea/day', description: 'Window installation per day' },
      decking: { rate: 100, unit: 'sf/day', description: 'Deck board installation per day' },
      cabinet_install: { rate: 15, unit: 'lf/day', description: 'Cabinet installation per day' },
    },
  },

  // =========================================================================
  // CONCRETE FINISHER
  // =========================================================================
  concreteFinisher: {
    trade: 'Concrete Finisher',
    baseRate: 32.00,
    overtimeRate: 48.00,
    burdenRate: 0.35,
    fullyBurdenedRate: 43.20,
    productivityRates: {
      flatwork_pour: { rate: 500, unit: 'sf/day', description: 'Flatwork pour & finish per day (crew of 4)' },
      foundation_wall: { rate: 80, unit: 'lf/day', description: 'Foundation wall per day' },
      slab_on_grade: { rate: 800, unit: 'sf/day', description: 'Slab on grade per day (crew of 4)' },
      footings: { rate: 100, unit: 'lf/day', description: 'Footings per day' },
      formwork: { rate: 200, unit: 'sf/day', description: 'Formwork per day' },
      rebar_placement: { rate: 500, unit: 'lb/day', description: 'Rebar placement per day' },
    },
  },

  // =========================================================================
  // ELECTRICIAN
  // =========================================================================
  electrician: {
    trade: 'Electrician',
    baseRate: 42.00,
    overtimeRate: 63.00,
    burdenRate: 0.38,
    fullyBurdenedRate: 57.96,
    productivityRates: {
      rough_in_outlet: { rate: 8, unit: 'ea/day', description: 'Rough-in outlets per day' },
      rough_in_switch: { rate: 10, unit: 'ea/day', description: 'Rough-in switches per day' },
      rough_in_light: { rate: 6, unit: 'ea/day', description: 'Rough-in light fixtures per day' },
      wire_run: { rate: 200, unit: 'lf/day', description: 'Wire run per day' },
      panel_install: { rate: 0.5, unit: 'ea/day', description: 'Panel installation (2 days)' },
      trim_outlet: { rate: 25, unit: 'ea/day', description: 'Trim-out devices per day' },
      fixture_install: { rate: 8, unit: 'ea/day', description: 'Light fixture installation per day' },
      can_light: { rate: 10, unit: 'ea/day', description: 'Recessed can light per day' },
    },
  },

  // =========================================================================
  // PLUMBER
  // =========================================================================
  plumber: {
    trade: 'Plumber',
    baseRate: 40.00,
    overtimeRate: 60.00,
    burdenRate: 0.38,
    fullyBurdenedRate: 55.20,
    productivityRates: {
      rough_in_fixture: { rate: 3, unit: 'ea/day', description: 'Rough-in per fixture per day' },
      water_line: { rate: 80, unit: 'lf/day', description: 'Water line per day' },
      drain_line: { rate: 50, unit: 'lf/day', description: 'Drain line per day' },
      toilet_install: { rate: 4, unit: 'ea/day', description: 'Toilet installation per day' },
      sink_install: { rate: 3, unit: 'ea/day', description: 'Sink installation per day' },
      water_heater: { rate: 0.5, unit: 'ea/day', description: 'Water heater installation (2 days)' },
      tub_shower: { rate: 1, unit: 'ea/day', description: 'Tub/shower installation per day' },
      faucet_install: { rate: 6, unit: 'ea/day', description: 'Faucet installation per day' },
    },
  },

  // =========================================================================
  // HVAC TECHNICIAN
  // =========================================================================
  hvacTech: {
    trade: 'HVAC Technician',
    baseRate: 38.00,
    overtimeRate: 57.00,
    burdenRate: 0.38,
    fullyBurdenedRate: 52.44,
    productivityRates: {
      furnace_install: { rate: 0.5, unit: 'ea/day', description: 'Furnace installation (2 days)' },
      condenser_install: { rate: 1, unit: 'ea/day', description: 'Condenser installation per day' },
      ductwork_main: { rate: 40, unit: 'lf/day', description: 'Main trunk line per day' },
      ductwork_branch: { rate: 80, unit: 'lf/day', description: 'Branch duct per day' },
      register_install: { rate: 20, unit: 'ea/day', description: 'Register installation per day' },
    },
  },

  // =========================================================================
  // DRYWALL INSTALLER / FINISHER
  // =========================================================================
  drywaller: {
    trade: 'Drywall Installer/Finisher',
    baseRate: 28.00,
    overtimeRate: 42.00,
    burdenRate: 0.35,
    fullyBurdenedRate: 37.80,
    productivityRates: {
      hang_walls: { rate: 400, unit: 'sf/day', description: 'Hang drywall walls per day' },
      hang_ceiling: { rate: 300, unit: 'sf/day', description: 'Hang drywall ceiling per day' },
      tape_and_mud: { rate: 500, unit: 'sf/day', description: 'Tape and first coat per day' },
      finish_coat: { rate: 600, unit: 'sf/day', description: 'Finish coat per day' },
      sand: { rate: 800, unit: 'sf/day', description: 'Sanding per day' },
    },
  },

  // =========================================================================
  // PAINTER
  // =========================================================================
  painter: {
    trade: 'Painter',
    baseRate: 25.00,
    overtimeRate: 37.50,
    burdenRate: 0.35,
    fullyBurdenedRate: 33.75,
    productivityRates: {
      prime_walls: { rate: 400, unit: 'sf/day', description: 'Prime walls per day' },
      paint_walls_1coat: { rate: 350, unit: 'sf/day', description: 'Paint walls (1 coat) per day' },
      paint_walls_2coat: { rate: 200, unit: 'sf/day', description: 'Paint walls (2 coats) per day' },
      paint_trim: { rate: 200, unit: 'lf/day', description: 'Paint trim per day' },
      paint_doors: { rate: 8, unit: 'ea/day', description: 'Paint doors per day' },
      paint_exterior: { rate: 250, unit: 'sf/day', description: 'Paint exterior per day' },
      stain_deck: { rate: 300, unit: 'sf/day', description: 'Stain deck per day' },
    },
  },

  // =========================================================================
  // ROOFER
  // =========================================================================
  roofer: {
    trade: 'Roofer',
    baseRate: 30.00,
    overtimeRate: 45.00,
    burdenRate: 0.40,
    fullyBurdenedRate: 42.00,
    productivityRates: {
      tear_off: { rate: 15, unit: 'sq/day', description: 'Tear-off shingles per day (crew of 3)' },
      shingle_install: { rate: 10, unit: 'sq/day', description: 'Shingle installation per day (crew of 3)' },
      metal_roof: { rate: 200, unit: 'sf/day', description: 'Standing seam metal roof per day' },
      underlayment: { rate: 25, unit: 'sq/day', description: 'Underlayment per day' },
      flashing: { rate: 60, unit: 'lf/day', description: 'Flashing per day' },
      gutter_install: { rate: 100, unit: 'lf/day', description: 'Gutter installation per day' },
    },
  },

  // =========================================================================
  // TILE SETTER
  // =========================================================================
  tileSetter: {
    trade: 'Tile Setter',
    baseRate: 35.00,
    overtimeRate: 52.50,
    burdenRate: 0.35,
    fullyBurdenedRate: 47.25,
    productivityRates: {
      floor_tile: { rate: 80, unit: 'sf/day', description: 'Floor tile per day' },
      wall_tile: { rate: 50, unit: 'sf/day', description: 'Wall tile per day' },
      backsplash: { rate: 30, unit: 'sf/day', description: 'Backsplash tile per day' },
      shower_tile: { rate: 40, unit: 'sf/day', description: 'Shower tile per day' },
      grouting: { rate: 150, unit: 'sf/day', description: 'Grouting per day' },
    },
  },

  // =========================================================================
  // FLOORING INSTALLER
  // =========================================================================
  flooringInstaller: {
    trade: 'Flooring Installer',
    baseRate: 28.00,
    overtimeRate: 42.00,
    burdenRate: 0.35,
    fullyBurdenedRate: 37.80,
    productivityRates: {
      hardwood: { rate: 150, unit: 'sf/day', description: 'Hardwood installation per day' },
      lvp: { rate: 300, unit: 'sf/day', description: 'LVP installation per day' },
      laminate: { rate: 350, unit: 'sf/day', description: 'Laminate installation per day' },
      carpet: { rate: 60, unit: 'sy/day', description: 'Carpet installation per day' },
    },
  },

  // =========================================================================
  // EXCAVATION / EQUIPMENT OPERATOR
  // =========================================================================
  equipmentOperator: {
    trade: 'Equipment Operator',
    baseRate: 35.00,
    overtimeRate: 52.50,
    burdenRate: 0.38,
    fullyBurdenedRate: 48.30,
    productivityRates: {
      excavation: { rate: 200, unit: 'cy/day', description: 'Excavation per day' },
      backfill: { rate: 300, unit: 'cy/day', description: 'Backfill per day' },
      grading: { rate: 5000, unit: 'sf/day', description: 'Fine grading per day' },
      trenching: { rate: 200, unit: 'lf/day', description: 'Utility trenching per day' },
    },
  },
};

/**
 * Standard Crew Compositions
 */
export const CREW_COMPOSITIONS = {
  framing_crew: {
    name: 'Framing Crew',
    members: [
      { trade: 'carpenter', count: 2 },
      { trade: 'laborer', count: 1 },
    ],
    compositeRate: (2 * 47.25 + 1 * 29.70),
    description: '2 Carpenters + 1 Laborer',
  },
  concrete_crew: {
    name: 'Concrete Crew',
    members: [
      { trade: 'concreteFinisher', count: 2 },
      { trade: 'laborer', count: 2 },
    ],
    compositeRate: (2 * 43.20 + 2 * 29.70),
    description: '2 Finishers + 2 Laborers',
  },
  roofing_crew: {
    name: 'Roofing Crew',
    members: [
      { trade: 'roofer', count: 2 },
      { trade: 'laborer', count: 1 },
    ],
    compositeRate: (2 * 42.00 + 1 * 29.70),
    description: '2 Roofers + 1 Laborer',
  },
  drywall_crew: {
    name: 'Drywall Crew',
    members: [
      { trade: 'drywaller', count: 2 },
      { trade: 'laborer', count: 1 },
    ],
    compositeRate: (2 * 37.80 + 1 * 29.70),
    description: '2 Drywallers + 1 Laborer',
  },
  painting_crew: {
    name: 'Painting Crew',
    members: [
      { trade: 'painter', count: 2 },
    ],
    compositeRate: (2 * 33.75),
    description: '2 Painters',
  },
  electrical_crew: {
    name: 'Electrical Crew',
    members: [
      { trade: 'electrician', count: 1 },
      { trade: 'laborer', count: 1 },
    ],
    compositeRate: (1 * 57.96 + 1 * 29.70),
    description: '1 Electrician + 1 Laborer',
  },
  plumbing_crew: {
    name: 'Plumbing Crew',
    members: [
      { trade: 'plumber', count: 1 },
      { trade: 'laborer', count: 1 },
    ],
    compositeRate: (1 * 55.20 + 1 * 29.70),
    description: '1 Plumber + 1 Laborer',
  },
};

/**
 * Look up a labor rate by trade
 */
export function getLaborRate(trade) {
  return LABOR_RATES[trade] || null;
}

/**
 * Calculate fully burdened labor cost
 */
export function calculateBurdenedRate(baseRate, burdenRate) {
  return baseRate * (1 + burdenRate);
}

/**
 * Calculate labor hours for a task
 */
export function calculateLaborHours(trade, task, quantity) {
  const tradeData = LABOR_RATES[trade];
  if (!tradeData || !tradeData.productivityRates[task]) return null;

  const prod = tradeData.productivityRates[task];
  const hoursPerDay = 8;
  const daysNeeded = quantity / prod.rate;
  const totalHours = daysNeeded * hoursPerDay;

  return {
    trade: tradeData.trade,
    task: prod.description,
    quantity,
    productivityRate: prod.rate,
    productivityUnit: prod.unit,
    daysNeeded: Math.round(daysNeeded * 100) / 100,
    totalHours: Math.round(totalHours * 100) / 100,
    laborCost: Math.round(totalHours * tradeData.fullyBurdenedRate * 100) / 100,
    baseRate: tradeData.baseRate,
    burdenedRate: tradeData.fullyBurdenedRate,
  };
}

/**
 * Get all available trades
 */
export function getTrades() {
  return Object.entries(LABOR_RATES).map(([key, data]) => ({
    key,
    trade: data.trade,
    baseRate: data.baseRate,
    burdenedRate: data.fullyBurdenedRate,
  }));
}

export default LABOR_RATES;
