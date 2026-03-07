/**
 * /estimate-labor Skill - Labor Cost Calculator
 *
 * Provides labor rate lookup, crew cost calculation,
 * and productivity-based labor estimating.
 *
 * Usage: /estimate-labor [trade] [task] [quantity]
 */

import { LABOR_RATES, CREW_COMPOSITIONS, getTrades, calculateLaborHours, calculateBurdenedRate } from '../data/labor-rates.js';
import { DEFAULTS } from '../data/defaults.js';
import { formatCurrency, formatPercentage } from '../utils/helpers.js';

/**
 * Look up labor rates for a trade
 */
export function lookupLaborRate(trade) {
  const data = LABOR_RATES[trade];
  if (!data) {
    return {
      found: false,
      message: `Trade not found: "${trade}"`,
      availableTrades: getTrades(),
    };
  }

  return {
    found: true,
    trade: data.trade,
    baseRate: data.baseRate,
    overtimeRate: data.overtimeRate,
    burdenRate: data.burdenRate,
    fullyBurdenedRate: data.fullyBurdenedRate,
    formattedBase: formatCurrency(data.baseRate) + '/hr',
    formattedBurdened: formatCurrency(data.fullyBurdenedRate) + '/hr',
    availableTasks: Object.entries(data.productivityRates).map(([key, val]) => ({
      task: key,
      rate: val.rate,
      unit: val.unit,
      description: val.description,
    })),
  };
}

/**
 * Calculate labor cost for a specific task
 */
export function calculateLabor(trade, task, quantity, options = {}) {
  const result = calculateLaborHours(trade, task, quantity);
  if (!result) {
    throw new Error(`Invalid trade/task: ${trade}/${task}. Use lookupLaborRate() to see available tasks.`);
  }

  const crewSize = options.crewSize || 1;
  const adjustedDays = result.daysNeeded / crewSize;
  const adjustedHours = result.totalHours; // Total man-hours stays the same

  return {
    ...result,
    crewSize,
    adjustedDays: Math.round(adjustedDays * 100) / 100,
    calendarDays: Math.ceil(adjustedDays),
    formattedCost: formatCurrency(result.laborCost),
  };
}

/**
 * Calculate crew cost for a day
 */
export function calculateCrewCost(crewKey, days = 1) {
  const crew = CREW_COMPOSITIONS[crewKey];
  if (!crew) {
    return {
      found: false,
      message: `Crew not found: "${crewKey}"`,
      availableCrews: Object.entries(CREW_COMPOSITIONS).map(([key, c]) => ({
        key,
        name: c.name,
        description: c.description,
        dailyCost: formatCurrency(c.compositeRate * 8),
      })),
    };
  }

  const dailyCost = crew.compositeRate * 8;
  const totalCost = dailyCost * days;

  return {
    found: true,
    crew: crew.name,
    description: crew.description,
    members: crew.members.map(m => {
      const rate = LABOR_RATES[m.trade];
      return {
        trade: rate?.trade || m.trade,
        count: m.count,
        hourlyRate: rate?.fullyBurdenedRate || 0,
      };
    }),
    compositeHourlyRate: crew.compositeRate,
    dailyCost: Math.round(dailyCost * 100) / 100,
    days,
    totalCost: Math.round(totalCost * 100) / 100,
    formattedDaily: formatCurrency(dailyCost),
    formattedTotal: formatCurrency(totalCost),
  };
}

/**
 * Calculate labor burden breakdown
 */
export function calculateBurdenBreakdown(baseRate) {
  const burden = DEFAULTS.LABOR_BURDEN;
  const breakdown = Object.entries(burden).map(([name, rate]) => ({
    component: formatBurdenName(name),
    rate: formatPercentage(rate),
    hourlyAmount: formatCurrency(baseRate * rate),
  }));

  const totalBurdenRate = Object.values(burden).reduce((sum, r) => sum + r, 0);

  return {
    baseRate,
    formattedBase: formatCurrency(baseRate) + '/hr',
    breakdown,
    totalBurdenRate,
    formattedBurdenRate: formatPercentage(totalBurdenRate),
    totalBurdenPerHour: formatCurrency(baseRate * totalBurdenRate),
    fullyBurdenedRate: formatCurrency(baseRate * (1 + totalBurdenRate)),
  };
}

/**
 * Estimate total labor for a project scope
 */
export function estimateProjectLabor(tasks) {
  const results = [];
  let totalHours = 0;
  let totalCost = 0;

  for (const task of tasks) {
    const calc = calculateLaborHours(task.trade, task.task, task.quantity);
    if (calc) {
      results.push({
        description: task.description || calc.task,
        ...calc,
        formattedCost: formatCurrency(calc.laborCost),
      });
      totalHours += calc.totalHours;
      totalCost += calc.laborCost;
    }
  }

  return {
    tasks: results,
    totalManHours: Math.round(totalHours * 100) / 100,
    totalManDays: Math.round((totalHours / 8) * 100) / 100,
    totalLaborCost: Math.round(totalCost * 100) / 100,
    formattedTotal: formatCurrency(totalCost),
  };
}

function formatBurdenName(key) {
  const names = {
    fica: 'FICA (Social Security + Medicare)',
    futa: 'FUTA (Federal Unemployment)',
    suta: 'SUTA (State Unemployment)',
    workersComp: 'Workers Compensation',
    generalLiability: 'General Liability Insurance',
    healthInsurance: 'Health Insurance',
    retirement: '401k/Retirement',
    other: 'PTO, Training & Other',
  };
  return names[key] || key;
}

export default {
  lookupLaborRate,
  calculateLabor,
  calculateCrewCost,
  calculateBurdenBreakdown,
  estimateProjectLabor,
};
