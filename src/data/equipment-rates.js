/**
 * Equipment Rates Database
 * Rental rates for common construction equipment.
 */

export const EQUIPMENT_RATES = {
  // Earthmoving
  excavator_mini: {
    name: 'Mini Excavator (5-10 ton)',
    dailyRate: 350.00,
    weeklyRate: 1400.00,
    monthlyRate: 3500.00,
    mobilization: 250.00,
    fuelPerDay: 75.00,
    operatorRequired: true,
  },
  excavator_mid: {
    name: 'Excavator (20-30 ton)',
    dailyRate: 650.00,
    weeklyRate: 2600.00,
    monthlyRate: 6500.00,
    mobilization: 500.00,
    fuelPerDay: 150.00,
    operatorRequired: true,
  },
  skid_steer: {
    name: 'Skid Steer Loader',
    dailyRate: 275.00,
    weeklyRate: 1100.00,
    monthlyRate: 2750.00,
    mobilization: 200.00,
    fuelPerDay: 60.00,
    operatorRequired: true,
  },
  backhoe: {
    name: 'Backhoe Loader',
    dailyRate: 325.00,
    weeklyRate: 1300.00,
    monthlyRate: 3250.00,
    mobilization: 300.00,
    fuelPerDay: 65.00,
    operatorRequired: true,
  },
  dozer_small: {
    name: 'Bulldozer (D3-D5)',
    dailyRate: 500.00,
    weeklyRate: 2000.00,
    monthlyRate: 5000.00,
    mobilization: 500.00,
    fuelPerDay: 120.00,
    operatorRequired: true,
  },

  // Concrete
  concrete_pump: {
    name: 'Concrete Pump Truck',
    dailyRate: 1200.00,
    weeklyRate: null,
    monthlyRate: null,
    mobilization: 500.00,
    fuelPerDay: 0,
    operatorRequired: true,
    notes: 'Typically rented by the day/pour',
  },
  concrete_mixer: {
    name: 'Concrete Mixer (portable)',
    dailyRate: 85.00,
    weeklyRate: 340.00,
    monthlyRate: 850.00,
    mobilization: 0,
    fuelPerDay: 15.00,
    operatorRequired: false,
  },
  power_trowel: {
    name: 'Power Trowel 36"',
    dailyRate: 95.00,
    weeklyRate: 380.00,
    monthlyRate: 950.00,
    mobilization: 0,
    fuelPerDay: 10.00,
    operatorRequired: false,
  },

  // Lifting
  forklift: {
    name: 'Forklift (5,000 lb)',
    dailyRate: 225.00,
    weeklyRate: 900.00,
    monthlyRate: 2250.00,
    mobilization: 200.00,
    fuelPerDay: 40.00,
    operatorRequired: true,
  },
  boom_lift_40: {
    name: 'Boom Lift 40\'',
    dailyRate: 300.00,
    weeklyRate: 1200.00,
    monthlyRate: 3000.00,
    mobilization: 250.00,
    fuelPerDay: 30.00,
    operatorRequired: false,
  },
  scissor_lift_26: {
    name: 'Scissor Lift 26\'',
    dailyRate: 175.00,
    weeklyRate: 700.00,
    monthlyRate: 1750.00,
    mobilization: 150.00,
    fuelPerDay: 15.00,
    operatorRequired: false,
  },
  crane_25ton: {
    name: 'Crane 25 Ton (w/ operator)',
    dailyRate: 2500.00,
    weeklyRate: 10000.00,
    monthlyRate: null,
    mobilization: 1500.00,
    fuelPerDay: 200.00,
    operatorRequired: true,
    notes: 'Includes operator',
  },

  // Compaction & Paving
  plate_compactor: {
    name: 'Plate Compactor',
    dailyRate: 75.00,
    weeklyRate: 300.00,
    monthlyRate: 750.00,
    mobilization: 0,
    fuelPerDay: 10.00,
    operatorRequired: false,
  },
  roller_vibratory: {
    name: 'Vibratory Roller (walk-behind)',
    dailyRate: 150.00,
    weeklyRate: 600.00,
    monthlyRate: 1500.00,
    mobilization: 100.00,
    fuelPerDay: 20.00,
    operatorRequired: false,
  },

  // General
  generator_7500w: {
    name: 'Generator 7,500W',
    dailyRate: 85.00,
    weeklyRate: 340.00,
    monthlyRate: 850.00,
    mobilization: 0,
    fuelPerDay: 25.00,
    operatorRequired: false,
  },
  air_compressor: {
    name: 'Air Compressor (185 CFM)',
    dailyRate: 150.00,
    weeklyRate: 600.00,
    monthlyRate: 1500.00,
    mobilization: 100.00,
    fuelPerDay: 30.00,
    operatorRequired: false,
  },
  scaffold_set: {
    name: 'Scaffolding Set (5\' section)',
    dailyRate: 15.00,
    weeklyRate: 60.00,
    monthlyRate: 150.00,
    mobilization: 0,
    fuelPerDay: 0,
    operatorRequired: false,
  },
  dumpster_20cy: {
    name: 'Dumpster 20 CY',
    dailyRate: null,
    weeklyRate: 450.00,
    monthlyRate: null,
    mobilization: 0,
    fuelPerDay: 0,
    operatorRequired: false,
    notes: 'Includes 1 haul, additional hauls $350',
  },
  dumpster_30cy: {
    name: 'Dumpster 30 CY',
    dailyRate: null,
    weeklyRate: 550.00,
    monthlyRate: null,
    mobilization: 0,
    fuelPerDay: 0,
    operatorRequired: false,
    notes: 'Includes 1 haul, additional hauls $400',
  },
  portable_toilet: {
    name: 'Portable Toilet',
    dailyRate: null,
    weeklyRate: null,
    monthlyRate: 150.00,
    mobilization: 75.00,
    fuelPerDay: 0,
    operatorRequired: false,
    notes: 'Weekly servicing included',
  },
};

/**
 * Calculate equipment cost
 */
export function calculateEquipmentCost(equipmentId, days, options = {}) {
  const equipment = EQUIPMENT_RATES[equipmentId];
  if (!equipment) return null;

  let rentalCost;
  const weeks = Math.floor(days / 7);
  const remainingDays = days % 7;

  // Optimize rental period (weekly is usually cheaper than 5+ days)
  if (equipment.weeklyRate && days >= 5) {
    rentalCost = (weeks * equipment.weeklyRate) + (remainingDays * equipment.dailyRate);
  } else if (equipment.monthlyRate && days >= 22) {
    const months = Math.floor(days / 30);
    const remainingAfterMonths = days % 30;
    rentalCost = months * equipment.monthlyRate;
    if (remainingAfterMonths >= 5 && equipment.weeklyRate) {
      const remWeeks = Math.floor(remainingAfterMonths / 7);
      const remDays = remainingAfterMonths % 7;
      rentalCost += (remWeeks * equipment.weeklyRate) + (remDays * equipment.dailyRate);
    } else {
      rentalCost += remainingAfterMonths * (equipment.dailyRate || 0);
    }
  } else {
    rentalCost = days * (equipment.dailyRate || 0);
  }

  const fuelCost = days * equipment.fuelPerDay;
  const mobilization = options.includeMobilization !== false ? equipment.mobilization : 0;

  return {
    equipment: equipment.name,
    days,
    rentalCost: Math.round(rentalCost * 100) / 100,
    fuelCost: Math.round(fuelCost * 100) / 100,
    mobilization,
    totalCost: Math.round((rentalCost + fuelCost + mobilization) * 100) / 100,
    operatorRequired: equipment.operatorRequired,
    notes: equipment.notes || '',
  };
}

/**
 * Get all equipment
 */
export function getEquipmentList() {
  return Object.entries(EQUIPMENT_RATES).map(([key, data]) => ({
    key,
    name: data.name,
    dailyRate: data.dailyRate,
    weeklyRate: data.weeklyRate,
    monthlyRate: data.monthlyRate,
  }));
}

export default EQUIPMENT_RATES;
