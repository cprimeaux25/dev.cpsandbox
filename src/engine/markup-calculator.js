/**
 * Markup Calculator Module
 * Handles all markup, overhead, profit, contingency, and bond calculations.
 * Supports multiple markup methods: cost-plus, fixed, tiered.
 */

import { roundCurrency } from '../utils/helpers.js';

/**
 * Calculate cost-plus markup
 * Overhead is applied first, then profit on (cost + overhead)
 */
export function calculateCostPlus(directCosts, overheadRate, profitRate) {
  const overhead = roundCurrency(directCosts * overheadRate);
  const profit = roundCurrency((directCosts + overhead) * profitRate);
  return {
    method: 'cost-plus',
    directCosts,
    overhead,
    profit,
    totalMarkup: roundCurrency(overhead + profit),
    totalWithMarkup: roundCurrency(directCosts + overhead + profit),
    effectiveMarkupRate: directCosts > 0 ? roundCurrency((overhead + profit) / directCosts) : 0,
  };
}

/**
 * Calculate fixed/flat markup
 * Single markup rate applied to direct costs
 */
export function calculateFixedMarkup(directCosts, markupRate) {
  const totalMarkup = roundCurrency(directCosts * markupRate);
  return {
    method: 'fixed',
    directCosts,
    markupRate,
    totalMarkup,
    totalWithMarkup: roundCurrency(directCosts + totalMarkup),
    effectiveMarkupRate: markupRate,
  };
}

/**
 * Calculate tiered markup
 * Different markup rates for different cost categories
 */
export function calculateTieredMarkup(costs, rates) {
  const materialMarkup = roundCurrency((costs.materials || 0) * (rates.materials || 0.15));
  const laborMarkup = roundCurrency((costs.labor || 0) * (rates.labor || 0.25));
  const equipmentMarkup = roundCurrency((costs.equipment || 0) * (rates.equipment || 0.15));
  const subMarkup = roundCurrency((costs.subcontractors || 0) * (rates.subcontractors || 0.10));

  const totalCosts = (costs.materials || 0) + (costs.labor || 0) + (costs.equipment || 0) + (costs.subcontractors || 0);
  const totalMarkup = roundCurrency(materialMarkup + laborMarkup + equipmentMarkup + subMarkup);

  return {
    method: 'tiered',
    breakdown: {
      materials: { cost: costs.materials || 0, rate: rates.materials || 0.15, markup: materialMarkup },
      labor: { cost: costs.labor || 0, rate: rates.labor || 0.25, markup: laborMarkup },
      equipment: { cost: costs.equipment || 0, rate: rates.equipment || 0.15, markup: equipmentMarkup },
      subcontractors: { cost: costs.subcontractors || 0, rate: rates.subcontractors || 0.10, markup: subMarkup },
    },
    totalCosts,
    totalMarkup,
    totalWithMarkup: roundCurrency(totalCosts + totalMarkup),
    effectiveMarkupRate: totalCosts > 0 ? roundCurrency(totalMarkup / totalCosts) : 0,
  };
}

/**
 * Calculate contingency
 */
export function calculateContingency(subtotal, contingencyRate) {
  return roundCurrency(subtotal * contingencyRate);
}

/**
 * Calculate sales tax on taxable materials
 */
export function calculateSalesTax(taxableAmount, taxRate) {
  return roundCurrency(taxableAmount * taxRate);
}

/**
 * Calculate bond cost
 */
export function calculateBond(totalBeforeBoond, bondRate) {
  return roundCurrency(totalBeforeBoond * bondRate);
}

/**
 * Calculate labor burden from base rate
 */
export function calculateLaborBurden(baseRate, burdenComponents) {
  const totalBurdenRate = Object.values(burdenComponents).reduce((sum, rate) => sum + rate, 0);
  const burdenCost = roundCurrency(baseRate * totalBurdenRate);
  return {
    baseRate,
    totalBurdenRate,
    burdenCost,
    fullyBurdenedRate: roundCurrency(baseRate + burdenCost),
    breakdown: Object.entries(burdenComponents).map(([name, rate]) => ({
      name,
      rate,
      cost: roundCurrency(baseRate * rate),
    })),
  };
}

/**
 * Reverse-calculate: what direct cost yields a target sell price?
 */
export function reverseMarkup(targetPrice, overheadRate, profitRate) {
  // targetPrice = directCost * (1 + OH) * (1 + profit)
  const divisor = (1 + overheadRate) * (1 + profitRate);
  const directCost = roundCurrency(targetPrice / divisor);
  return {
    targetPrice,
    directCost,
    overhead: roundCurrency(directCost * overheadRate),
    profit: roundCurrency((directCost * (1 + overheadRate)) * profitRate),
  };
}

/**
 * Calculate gross margin percentage
 */
export function calculateGrossMargin(sellPrice, directCost) {
  if (sellPrice === 0) return 0;
  return roundCurrency(((sellPrice - directCost) / sellPrice) * 100);
}

/**
 * Calculate markup percentage from cost and sell price
 */
export function calculateMarkupFromPrice(directCost, sellPrice) {
  if (directCost === 0) return 0;
  return roundCurrency(((sellPrice - directCost) / directCost) * 100);
}

export default {
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
};
