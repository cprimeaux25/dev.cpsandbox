/**
 * /estimate-markup Skill - Markup & Profit Calculator
 *
 * Configure and calculate markup, overhead, profit, contingency,
 * tax, and bond costs. Supports multiple markup methods.
 *
 * Usage: /estimate-markup [method]
 */

import {
  calculateCostPlus,
  calculateFixedMarkup,
  calculateTieredMarkup,
  calculateContingency,
  calculateSalesTax,
  calculateBond,
  calculateLaborBurden,
  reverseMarkup,
  calculateGrossMargin,
  calculateMarkupFromPrice,
} from '../engine/markup-calculator.js';
import { formatCurrency, formatPercentage } from '../utils/helpers.js';
import { validateMarkupConfig } from '../utils/validator.js';

/**
 * Calculate markup using any method
 */
export function calculateMarkup(directCosts, config = {}) {
  const method = config.method || 'cost-plus';

  let result;
  switch (method) {
    case 'cost-plus':
      result = calculateCostPlus(
        directCosts,
        config.overheadRate || 0.10,
        config.profitRate || 0.10
      );
      break;

    case 'fixed':
      result = calculateFixedMarkup(
        directCosts,
        config.markupRate || 0.20
      );
      break;

    case 'tiered':
      result = calculateTieredMarkup(
        {
          materials: config.materialsCost || 0,
          labor: config.laborCost || 0,
          equipment: config.equipmentCost || 0,
          subcontractors: config.subcontractorCost || 0,
        },
        config.tieredRates || {
          materials: 0.15,
          labor: 0.25,
          equipment: 0.15,
          subcontractors: 0.10,
        }
      );
      break;

    default:
      throw new Error(`Unknown markup method: ${method}`);
  }

  // Validate
  const validation = validateMarkupConfig({
    overheadRate: config.overheadRate || 0.10,
    profitRate: config.profitRate || 0.10,
  });

  return {
    ...result,
    formatted: {
      directCosts: formatCurrency(result.directCosts || directCosts),
      totalMarkup: formatCurrency(result.totalMarkup),
      totalWithMarkup: formatCurrency(result.totalWithMarkup),
      effectiveMarkupRate: formatPercentage(result.effectiveMarkupRate),
    },
    validation,
  };
}

/**
 * Full project cost calculation with all additions
 */
export function calculateFullProjectCost(params = {}) {
  const directCosts = params.directCosts || 0;
  const overheadRate = params.overheadRate || 0.10;
  const profitRate = params.profitRate || 0.10;
  const contingencyRate = params.contingencyRate || 0.05;
  const taxRate = params.taxRate || 0.0825;
  const taxableAmount = params.taxableAmount || 0;
  const bondRate = params.bondRate || 0;

  const contingency = calculateContingency(directCosts, contingencyRate);
  const subtotal = directCosts + contingency;
  const markup = calculateCostPlus(subtotal, overheadRate, profitRate);
  const salesTax = calculateSalesTax(taxableAmount, taxRate);
  const bond = calculateBond(markup.totalWithMarkup, bondRate);
  const totalCost = markup.totalWithMarkup + salesTax + bond;
  const grossMargin = calculateGrossMargin(totalCost, directCosts);

  return {
    directCosts: formatCurrency(directCosts),
    contingency: { rate: formatPercentage(contingencyRate), amount: formatCurrency(contingency) },
    subtotal: formatCurrency(subtotal),
    overhead: { rate: formatPercentage(overheadRate), amount: formatCurrency(markup.overhead) },
    profit: { rate: formatPercentage(profitRate), amount: formatCurrency(markup.profit) },
    salesTax: { rate: formatPercentage(taxRate), taxable: formatCurrency(taxableAmount), amount: formatCurrency(salesTax) },
    bond: { rate: formatPercentage(bondRate), amount: formatCurrency(bond) },
    totalProjectCost: formatCurrency(totalCost),
    grossMargin: `${grossMargin}%`,
    rawValues: { directCosts, contingency, subtotal, overhead: markup.overhead, profit: markup.profit, salesTax, bond, totalCost, grossMargin },
  };
}

/**
 * Reverse engineer: what should direct cost be to hit a target price?
 */
export function reverseCalculate(targetPrice, overheadRate = 0.10, profitRate = 0.10) {
  const result = reverseMarkup(targetPrice, overheadRate, profitRate);
  return {
    targetSellPrice: formatCurrency(targetPrice),
    directCost: formatCurrency(result.directCost),
    overhead: formatCurrency(result.overhead),
    profit: formatCurrency(result.profit),
    overheadRate: formatPercentage(overheadRate),
    profitRate: formatPercentage(profitRate),
    note: `To sell at ${formatCurrency(targetPrice)}, your direct costs should not exceed ${formatCurrency(result.directCost)}.`,
  };
}

/**
 * Compare different markup methods side by side
 */
export function compareMarkupMethods(costs = {}) {
  const directCosts = (costs.materials || 0) + (costs.labor || 0) + (costs.equipment || 0) + (costs.subcontractors || 0);

  const costPlus = calculateCostPlus(directCosts, 0.10, 0.10);
  const fixed = calculateFixedMarkup(directCosts, 0.20);
  const tiered = calculateTieredMarkup(costs, {
    materials: 0.15,
    labor: 0.25,
    equipment: 0.15,
    subcontractors: 0.10,
  });

  return {
    directCosts: formatCurrency(directCosts),
    methods: {
      'Cost-Plus (10% OH + 10% Profit)': {
        markup: formatCurrency(costPlus.totalMarkup),
        total: formatCurrency(costPlus.totalWithMarkup),
        effectiveRate: formatPercentage(costPlus.effectiveMarkupRate),
      },
      'Fixed (20%)': {
        markup: formatCurrency(fixed.totalMarkup),
        total: formatCurrency(fixed.totalWithMarkup),
        effectiveRate: formatPercentage(fixed.effectiveMarkupRate),
      },
      'Tiered': {
        markup: formatCurrency(tiered.totalMarkup),
        total: formatCurrency(tiered.totalWithMarkup),
        effectiveRate: formatPercentage(tiered.effectiveMarkupRate),
        breakdown: tiered.breakdown,
      },
    },
  };
}

/**
 * Labor burden calculator
 */
export function showLaborBurden(baseRate) {
  return calculateLaborBurden(baseRate, {
    fica: 0.0765,
    futa: 0.006,
    suta: 0.027,
    workersComp: 0.08,
    generalLiability: 0.04,
    healthInsurance: 0.06,
    retirement: 0.03,
    other: 0.015,
  });
}

export default {
  calculateMarkup,
  calculateFullProjectCost,
  reverseCalculate,
  compareMarkupMethods,
  showLaborBurden,
};
