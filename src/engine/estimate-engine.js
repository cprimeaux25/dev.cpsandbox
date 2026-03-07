/**
 * Construction Estimating Engine
 * Core calculation engine for construction project estimates.
 * Handles materials, labor, equipment, subcontractors, overhead, profit, and taxes.
 */

import { generateId, roundCurrency, formatCurrency } from '../utils/helpers.js';
import { validateEstimate, validateLineItem } from '../utils/validator.js';
import { DEFAULTS } from '../data/defaults.js';

export class EstimateEngine {
  constructor(config = {}) {
    this.config = {
      taxRate: config.taxRate ?? DEFAULTS.TAX_RATE,
      overheadRate: config.overheadRate ?? DEFAULTS.OVERHEAD_RATE,
      profitRate: config.profitRate ?? DEFAULTS.PROFIT_RATE,
      contingencyRate: config.contingencyRate ?? DEFAULTS.CONTINGENCY_RATE,
      bondRate: config.bondRate ?? DEFAULTS.BOND_RATE,
      laborBurdenRate: config.laborBurdenRate ?? DEFAULTS.LABOR_BURDEN_RATE,
      markupMethod: config.markupMethod ?? 'cost-plus', // 'cost-plus', 'fixed', 'tiered'
      currency: config.currency ?? 'USD',
      wasteFactor: config.wasteFactor ?? DEFAULTS.WASTE_FACTOR,
      // Tiered markup rates (used when markupMethod is 'tiered')
      tieredRates: config.tieredRates ?? {
        materials: 0.15,
        labor: 0.25,
        equipment: 0.15,
        subcontractors: 0.10,
      },
      ...config,
    };
  }

  /**
   * Create a new blank estimate
   */
  createEstimate(projectInfo = {}) {
    return {
      id: generateId(),
      projectName: projectInfo.projectName || 'Untitled Project',
      clientName: projectInfo.clientName || '',
      projectAddress: projectInfo.projectAddress || '',
      estimatorName: projectInfo.estimatorName || '',
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString(),
      status: 'draft', // draft, pending, approved, rejected
      config: { ...this.config },
      categories: [],
      lineItems: [],
      generalConditions: [],
      changeOrders: [],
      notes: projectInfo.notes || '',
      exclusions: projectInfo.exclusions || [],
      inclusions: projectInfo.inclusions || [],
    };
  }

  /**
   * Add a category to organize line items
   */
  addCategory(estimate, category) {
    const cat = {
      id: generateId(),
      name: category.name,
      description: category.description || '',
      csiCode: category.csiCode || '', // CSI MasterFormat division code
      sortOrder: estimate.categories.length + 1,
    };
    estimate.categories.push(cat);
    estimate.dateModified = new Date().toISOString();
    return cat;
  }

  /**
   * Add a line item to the estimate
   */
  addLineItem(estimate, item) {
    const validation = validateLineItem(item);
    if (!validation.valid) {
      throw new Error(`Invalid line item: ${validation.errors.join(', ')}`);
    }

    const lineItem = {
      id: generateId(),
      categoryId: item.categoryId || null,
      description: item.description,
      type: item.type || 'material', // material, labor, equipment, subcontractor
      // Quantity & Units
      quantity: item.quantity,
      unit: item.unit || 'ea', // ea, sf, lf, sy, cy, hr, ls, etc.
      // Pricing
      unitPrice: item.unitPrice || 0,
      // Material-specific
      wasteFactor: item.wasteFactor ?? this.config.wasteFactor,
      // Labor-specific
      laborHours: item.laborHours || 0,
      laborRate: item.laborRate || 0,
      crewSize: item.crewSize || 1,
      productivityRate: item.productivityRate || 1.0, // units per hour
      includeBurden: item.includeBurden ?? true,
      // Equipment-specific
      equipmentDailyRate: item.equipmentDailyRate || 0,
      equipmentDays: item.equipmentDays || 0,
      mobilizationCost: item.mobilizationCost || 0,
      fuelCost: item.fuelCost || 0,
      // Subcontractor-specific
      subBid: item.subBid || 0,
      subScope: item.subScope || '',
      // Tax
      taxable: item.taxable ?? (item.type === 'material'),
      // Notes
      notes: item.notes || '',
      sortOrder: estimate.lineItems.length + 1,
    };

    // Calculate costs
    this._calculateLineItemCosts(lineItem);

    estimate.lineItems.push(lineItem);
    estimate.dateModified = new Date().toISOString();
    return lineItem;
  }

  /**
   * Update an existing line item
   */
  updateLineItem(estimate, itemId, updates) {
    const item = estimate.lineItems.find(i => i.id === itemId);
    if (!item) throw new Error(`Line item not found: ${itemId}`);

    Object.assign(item, updates);
    this._calculateLineItemCosts(item);
    estimate.dateModified = new Date().toISOString();
    return item;
  }

  /**
   * Remove a line item
   */
  removeLineItem(estimate, itemId) {
    const index = estimate.lineItems.findIndex(i => i.id === itemId);
    if (index === -1) throw new Error(`Line item not found: ${itemId}`);
    estimate.lineItems.splice(index, 1);
    estimate.dateModified = new Date().toISOString();
  }

  /**
   * Add a general conditions line item
   */
  addGeneralCondition(estimate, item) {
    const gc = {
      id: generateId(),
      description: item.description,
      cost: item.cost || 0,
      type: item.type || 'fixed', // fixed, percentage
      percentage: item.percentage || 0,
      notes: item.notes || '',
    };
    estimate.generalConditions.push(gc);
    estimate.dateModified = new Date().toISOString();
    return gc;
  }

  /**
   * Create a change order against an existing estimate
   */
  createChangeOrder(estimate, changeOrder) {
    const co = {
      id: generateId(),
      number: estimate.changeOrders.length + 1,
      description: changeOrder.description,
      reason: changeOrder.reason || '',
      dateCreated: new Date().toISOString(),
      status: 'pending', // pending, approved, rejected
      lineItems: [],
      totalCost: 0,
    };

    if (changeOrder.lineItems) {
      for (const item of changeOrder.lineItems) {
        const lineItem = { ...item, id: generateId(), type: item.type || 'material' };
        this._calculateLineItemCosts(lineItem);
        co.lineItems.push(lineItem);
      }
      co.totalCost = co.lineItems.reduce((sum, i) => sum + (i.totalCost || 0), 0);
    }

    estimate.changeOrders.push(co);
    estimate.dateModified = new Date().toISOString();
    return co;
  }

  /**
   * Calculate all costs for a single line item
   */
  _calculateLineItemCosts(item) {
    switch (item.type) {
      case 'material':
        item.adjustedQuantity = item.quantity * (1 + (item.wasteFactor || 0));
        item.materialCost = roundCurrency(item.adjustedQuantity * item.unitPrice);
        item.laborCost = roundCurrency((item.laborHours || 0) * (item.laborRate || 0) * (item.includeBurden ? (1 + this.config.laborBurdenRate) : 1));
        item.totalCost = roundCurrency(item.materialCost + item.laborCost);
        break;

      case 'labor':
        item.materialCost = 0;
        const effectiveHours = item.quantity / (item.productivityRate || 1);
        const burdenMultiplier = item.includeBurden ? (1 + this.config.laborBurdenRate) : 1;
        item.laborCost = roundCurrency(effectiveHours * item.laborRate * item.crewSize * burdenMultiplier);
        item.totalCost = item.laborCost;
        break;

      case 'equipment':
        item.materialCost = 0;
        item.laborCost = 0;
        item.equipmentCost = roundCurrency(
          (item.equipmentDailyRate * item.equipmentDays) +
          item.mobilizationCost +
          item.fuelCost
        );
        item.totalCost = item.equipmentCost;
        break;

      case 'subcontractor':
        item.materialCost = 0;
        item.laborCost = 0;
        item.totalCost = roundCurrency(item.subBid);
        break;

      default:
        item.totalCost = roundCurrency(item.quantity * item.unitPrice);
    }

    return item;
  }

  /**
   * Calculate the full estimate summary with all markups
   */
  calculateEstimate(estimate) {
    const summary = {
      // Direct Costs by type
      materialsCost: 0,
      laborCost: 0,
      equipmentCost: 0,
      subcontractorCost: 0,

      // Aggregates
      totalDirectCosts: 0,
      generalConditionsCost: 0,
      subtotal: 0,
      contingency: 0,
      totalBeforeMarkup: 0,
      overhead: 0,
      profit: 0,
      salesTax: 0,
      bond: 0,
      totalProjectCost: 0,

      // Change Orders
      approvedChangeOrders: 0,
      pendingChangeOrders: 0,
      revisedTotal: 0,

      // Breakdown by category
      categoryBreakdown: [],

      // Per-unit costs (if applicable)
      costPerSF: 0,
      totalArea: estimate.config?.totalArea || 0,

      // Line item count
      lineItemCount: estimate.lineItems.length,
    };

    const config = estimate.config || this.config;

    // Sum direct costs by type
    for (const item of estimate.lineItems) {
      this._calculateLineItemCosts(item);

      switch (item.type) {
        case 'material':
          summary.materialsCost += item.materialCost || 0;
          summary.laborCost += item.laborCost || 0;
          break;
        case 'labor':
          summary.laborCost += item.laborCost || 0;
          break;
        case 'equipment':
          summary.equipmentCost += item.equipmentCost || 0;
          break;
        case 'subcontractor':
          summary.subcontractorCost += item.totalCost || 0;
          break;
      }
    }

    // Round direct costs
    summary.materialsCost = roundCurrency(summary.materialsCost);
    summary.laborCost = roundCurrency(summary.laborCost);
    summary.equipmentCost = roundCurrency(summary.equipmentCost);
    summary.subcontractorCost = roundCurrency(summary.subcontractorCost);

    // Total Direct Costs
    summary.totalDirectCosts = roundCurrency(
      summary.materialsCost + summary.laborCost + summary.equipmentCost + summary.subcontractorCost
    );

    // General Conditions
    for (const gc of estimate.generalConditions) {
      if (gc.type === 'percentage') {
        summary.generalConditionsCost += roundCurrency(summary.totalDirectCosts * gc.percentage);
      } else {
        summary.generalConditionsCost += gc.cost;
      }
    }
    summary.generalConditionsCost = roundCurrency(summary.generalConditionsCost);

    // Subtotal
    summary.subtotal = roundCurrency(summary.totalDirectCosts + summary.generalConditionsCost);

    // Contingency
    summary.contingency = roundCurrency(summary.subtotal * (config.contingencyRate || 0));

    // Total Before Markup
    summary.totalBeforeMarkup = roundCurrency(summary.subtotal + summary.contingency);

    // Apply markup based on method
    switch (config.markupMethod) {
      case 'cost-plus':
        summary.overhead = roundCurrency(summary.totalBeforeMarkup * (config.overheadRate || 0));
        summary.profit = roundCurrency((summary.totalBeforeMarkup + summary.overhead) * (config.profitRate || 0));
        break;

      case 'fixed': {
        const fixedMarkupRate = (config.overheadRate || 0) + (config.profitRate || 0);
        const totalMarkup = roundCurrency(summary.totalBeforeMarkup * fixedMarkupRate);
        summary.overhead = roundCurrency(totalMarkup * ((config.overheadRate || 0) / fixedMarkupRate || 0));
        summary.profit = roundCurrency(totalMarkup - summary.overhead);
        break;
      }

      case 'tiered': {
        const rates = config.tieredRates || {};
        const matMarkup = roundCurrency(summary.materialsCost * (rates.materials || 0.15));
        const labMarkup = roundCurrency(summary.laborCost * (rates.labor || 0.25));
        const eqMarkup = roundCurrency(summary.equipmentCost * (rates.equipment || 0.15));
        const subMarkup = roundCurrency(summary.subcontractorCost * (rates.subcontractors || 0.10));
        const totalTieredMarkup = matMarkup + labMarkup + eqMarkup + subMarkup;
        summary.overhead = roundCurrency(totalTieredMarkup * 0.6); // 60% allocated to overhead
        summary.profit = roundCurrency(totalTieredMarkup * 0.4);   // 40% allocated to profit
        break;
      }
    }

    // Sales Tax (on taxable materials only)
    let taxableAmount = 0;
    for (const item of estimate.lineItems) {
      if (item.taxable) {
        taxableAmount += item.materialCost || item.totalCost || 0;
      }
    }
    summary.salesTax = roundCurrency(taxableAmount * (config.taxRate || 0));

    // Bond
    const bondBase = summary.totalBeforeMarkup + summary.overhead + summary.profit;
    summary.bond = roundCurrency(bondBase * (config.bondRate || 0));

    // Total Project Cost
    summary.totalProjectCost = roundCurrency(
      summary.totalBeforeMarkup + summary.overhead + summary.profit + summary.salesTax + summary.bond
    );

    // Change Orders
    for (const co of estimate.changeOrders) {
      if (co.status === 'approved') {
        summary.approvedChangeOrders += co.totalCost || 0;
      } else if (co.status === 'pending') {
        summary.pendingChangeOrders += co.totalCost || 0;
      }
    }
    summary.approvedChangeOrders = roundCurrency(summary.approvedChangeOrders);
    summary.pendingChangeOrders = roundCurrency(summary.pendingChangeOrders);
    summary.revisedTotal = roundCurrency(summary.totalProjectCost + summary.approvedChangeOrders);

    // Cost per SF
    if (summary.totalArea > 0) {
      summary.costPerSF = roundCurrency(summary.totalProjectCost / summary.totalArea);
    }

    // Category breakdown
    const catMap = new Map();
    for (const item of estimate.lineItems) {
      const catId = item.categoryId || '__uncategorized__';
      if (!catMap.has(catId)) {
        const cat = estimate.categories.find(c => c.id === catId);
        catMap.set(catId, {
          categoryId: catId,
          categoryName: cat?.name || 'Uncategorized',
          csiCode: cat?.csiCode || '',
          materialsCost: 0,
          laborCost: 0,
          equipmentCost: 0,
          subcontractorCost: 0,
          totalCost: 0,
          itemCount: 0,
        });
      }
      const bucket = catMap.get(catId);
      bucket.materialsCost += item.materialCost || 0;
      bucket.laborCost += item.laborCost || 0;
      bucket.equipmentCost += item.equipmentCost || 0;
      bucket.subcontractorCost += item.type === 'subcontractor' ? item.totalCost : 0;
      bucket.totalCost += item.totalCost || 0;
      bucket.itemCount++;
    }
    summary.categoryBreakdown = Array.from(catMap.values()).map(b => ({
      ...b,
      materialsCost: roundCurrency(b.materialsCost),
      laborCost: roundCurrency(b.laborCost),
      equipmentCost: roundCurrency(b.equipmentCost),
      subcontractorCost: roundCurrency(b.subcontractorCost),
      totalCost: roundCurrency(b.totalCost),
    }));

    return summary;
  }

  /**
   * Compare two estimates side by side
   */
  compareEstimates(estimate1, estimate2) {
    const summary1 = this.calculateEstimate(estimate1);
    const summary2 = this.calculateEstimate(estimate2);

    return {
      estimate1: {
        name: estimate1.projectName,
        summary: summary1,
      },
      estimate2: {
        name: estimate2.projectName,
        summary: summary2,
      },
      differences: {
        materialsCost: roundCurrency(summary2.materialsCost - summary1.materialsCost),
        laborCost: roundCurrency(summary2.laborCost - summary1.laborCost),
        equipmentCost: roundCurrency(summary2.equipmentCost - summary1.equipmentCost),
        subcontractorCost: roundCurrency(summary2.subcontractorCost - summary1.subcontractorCost),
        totalDirectCosts: roundCurrency(summary2.totalDirectCosts - summary1.totalDirectCosts),
        overhead: roundCurrency(summary2.overhead - summary1.overhead),
        profit: roundCurrency(summary2.profit - summary1.profit),
        totalProjectCost: roundCurrency(summary2.totalProjectCost - summary1.totalProjectCost),
        percentageDifference: summary1.totalProjectCost > 0
          ? roundCurrency(((summary2.totalProjectCost - summary1.totalProjectCost) / summary1.totalProjectCost) * 100)
          : 0,
      },
    };
  }
}

export default EstimateEngine;
