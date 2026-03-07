/**
 * Default Configuration Values for Construction Estimating
 */

export const DEFAULTS = {
  // Tax & Rates
  TAX_RATE: 0.0825,           // 8.25% default sales tax
  OVERHEAD_RATE: 0.10,        // 10% overhead
  PROFIT_RATE: 0.10,          // 10% profit
  CONTINGENCY_RATE: 0.05,     // 5% contingency
  BOND_RATE: 0.015,           // 1.5% bond rate
  LABOR_BURDEN_RATE: 0.35,    // 35% labor burden (FICA, WC, insurance, benefits)
  WASTE_FACTOR: 0.05,         // 5% default waste factor

  // Labor Burden Breakdown
  LABOR_BURDEN: {
    fica: 0.0765,             // Social Security + Medicare
    futa: 0.006,              // Federal Unemployment
    suta: 0.027,              // State Unemployment (varies by state)
    workersComp: 0.08,        // Workers Compensation (varies by trade)
    generalLiability: 0.04,   // General Liability Insurance
    healthInsurance: 0.06,    // Health Insurance
    retirement: 0.03,         // 401k/Retirement
    other: 0.015,             // PTO, training, etc.
  },

  // Waste Factors by Material Type
  WASTE_FACTORS: {
    lumber: 0.10,
    framing: 0.10,
    drywall: 0.10,
    tile: 0.15,
    flooring: 0.10,
    paint: 0.05,
    concrete: 0.05,
    roofing: 0.15,
    siding: 0.10,
    insulation: 0.05,
    plumbing: 0.03,
    electrical: 0.03,
    hardware: 0.02,
    general: 0.05,
  },

  // Standard Units
  UNITS: [
    { abbr: 'ea', name: 'Each' },
    { abbr: 'sf', name: 'Square Feet' },
    { abbr: 'lf', name: 'Linear Feet' },
    { abbr: 'sy', name: 'Square Yards' },
    { abbr: 'cy', name: 'Cubic Yards' },
    { abbr: 'hr', name: 'Hours' },
    { abbr: 'ls', name: 'Lump Sum' },
    { abbr: 'gal', name: 'Gallons' },
    { abbr: 'lb', name: 'Pounds' },
    { abbr: 'ton', name: 'Tons' },
    { abbr: 'bag', name: 'Bags' },
    { abbr: 'bndl', name: 'Bundles' },
    { abbr: 'roll', name: 'Rolls' },
    { abbr: 'sht', name: 'Sheets' },
    { abbr: 'pc', name: 'Pieces' },
    { abbr: 'ft', name: 'Feet' },
    { abbr: 'day', name: 'Days' },
  ],
};
