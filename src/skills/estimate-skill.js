/**
 * /estimate Skill - Interactive Estimate Builder
 *
 * This skill provides Claude with the ability to create and manage
 * construction estimates interactively through conversation.
 *
 * Usage: /estimate [project-name]
 */

import { EstimateEngine } from '../engine/estimate-engine.js';
import { searchMaterials, getCategories } from '../data/materials-catalog.js';
import { getTrades, calculateLaborHours } from '../data/labor-rates.js';
import { calculateEquipmentCost } from '../data/equipment-rates.js';
import { generateDetailedReport, generateProposalSummary, generateCategorySummary } from '../reports/report-generator.js';
import { validateEstimate } from '../utils/validator.js';

/**
 * Skill: Create New Estimate
 * Creates a new estimate with project information and walks through setup.
 */
export function createEstimate(projectInfo = {}) {
  const engine = new EstimateEngine(projectInfo.config || {});
  const estimate = engine.createEstimate(projectInfo);
  return { engine, estimate };
}

/**
 * Skill: Add material line items from catalog
 */
export function addMaterialFromCatalog(engine, estimate, materialId, quantity, options = {}) {
  const results = searchMaterials(materialId);
  if (results.length === 0) {
    throw new Error(`Material not found: ${materialId}. Use searchMaterials() to find available items.`);
  }

  const material = results[0];
  return engine.addLineItem(estimate, {
    description: options.description || material.name,
    type: 'material',
    quantity,
    unit: material.unit,
    unitPrice: options.unitPrice || material.unitPrice,
    wasteFactor: options.wasteFactor ?? material.wasteFactor,
    laborHours: options.laborHours || 0,
    laborRate: options.laborRate || 0,
    taxable: options.taxable ?? true,
    categoryId: options.categoryId || null,
    notes: options.notes || '',
  });
}

/**
 * Skill: Add labor line item with productivity calculation
 */
export function addLaborItem(engine, estimate, trade, task, quantity, options = {}) {
  const laborCalc = calculateLaborHours(trade, task, quantity);
  if (!laborCalc) {
    throw new Error(`Invalid trade/task combination: ${trade}/${task}`);
  }

  return engine.addLineItem(estimate, {
    description: options.description || `${laborCalc.trade} - ${laborCalc.task}`,
    type: 'labor',
    quantity,
    unit: laborCalc.productivityUnit.split('/')[0] || 'ea',
    laborRate: laborCalc.burdenedRate,
    productivityRate: laborCalc.productivityRate / 8, // convert from per-day to per-hour
    crewSize: options.crewSize || 1,
    includeBurden: false, // already burdened
    categoryId: options.categoryId || null,
    notes: options.notes || `Productivity: ${laborCalc.productivityRate} ${laborCalc.productivityUnit}`,
  });
}

/**
 * Skill: Add equipment line item
 */
export function addEquipmentItem(engine, estimate, equipmentId, days, options = {}) {
  const equipCalc = calculateEquipmentCost(equipmentId, days, options);
  if (!equipCalc) {
    throw new Error(`Equipment not found: ${equipmentId}`);
  }

  return engine.addLineItem(estimate, {
    description: options.description || equipCalc.equipment,
    type: 'equipment',
    quantity: 1,
    unit: 'ls',
    equipmentDailyRate: equipCalc.rentalCost / days,
    equipmentDays: days,
    mobilizationCost: equipCalc.mobilization,
    fuelCost: equipCalc.fuelCost,
    categoryId: options.categoryId || null,
    notes: options.notes || equipCalc.notes,
  });
}

/**
 * Skill: Add subcontractor line item
 */
export function addSubcontractorItem(engine, estimate, description, bidAmount, options = {}) {
  return engine.addLineItem(estimate, {
    description,
    type: 'subcontractor',
    quantity: 1,
    unit: 'ls',
    subBid: bidAmount,
    subScope: options.scope || description,
    taxable: false,
    categoryId: options.categoryId || null,
    notes: options.notes || '',
  });
}

/**
 * Skill: Apply a template to an estimate
 */
export function applyTemplate(engine, estimate, template) {
  // Apply config
  if (template.config) {
    estimate.config = { ...estimate.config, ...template.config };
  }

  // Add categories
  if (template.categories) {
    for (const cat of template.categories) {
      engine.addCategory(estimate, cat);
    }
  }

  // Set exclusions and inclusions
  if (template.exclusions) {
    estimate.exclusions = [...template.exclusions];
  }
  if (template.inclusions) {
    estimate.inclusions = [...template.inclusions];
  }

  return estimate;
}

/**
 * Skill: Generate and return a report
 */
export function generateReport(engine, estimate, format = 'detailed') {
  const summary = engine.calculateEstimate(estimate);
  const validation = validateEstimate(estimate);

  let report;
  switch (format) {
    case 'detailed':
      report = generateDetailedReport(estimate, summary);
      break;
    case 'proposal':
      report = generateProposalSummary(estimate, summary);
      break;
    case 'summary':
      report = generateCategorySummary(estimate, summary);
      break;
    default:
      report = generateDetailedReport(estimate, summary);
  }

  return { report, summary, validation };
}

/**
 * Skill: Quick estimate from description
 * Generates a rough estimate based on project type and square footage.
 */
export function quickEstimate(projectType, squareFootage, qualityLevel = 'mid') {
  // Cost per SF ranges by project type and quality
  const costRanges = {
    'new-home': { budget: { low: 120, high: 160 }, mid: { low: 175, high: 250 }, high: { low: 275, high: 400 } },
    'addition': { budget: { low: 150, high: 200 }, mid: { low: 200, high: 300 }, high: { low: 300, high: 450 } },
    'kitchen': { budget: { low: 75, high: 125 }, mid: { low: 150, high: 250 }, high: { low: 300, high: 500 } },
    'bathroom': { budget: { low: 200, high: 350 }, mid: { low: 400, high: 600 }, high: { low: 600, high: 1000 } },
    'basement': { budget: { low: 30, high: 50 }, mid: { low: 50, high: 85 }, high: { low: 85, high: 150 } },
    'deck': { budget: { low: 15, high: 25 }, mid: { low: 30, high: 50 }, high: { low: 50, high: 90 } },
    'garage': { budget: { low: 40, high: 60 }, mid: { low: 60, high: 90 }, high: { low: 90, high: 150 } },
    'commercial-ti': { budget: { low: 40, high: 70 }, mid: { low: 75, high: 120 }, high: { low: 125, high: 200 } },
    'roofing': { budget: { low: 4, high: 6 }, mid: { low: 7, high: 10 }, high: { low: 12, high: 20 } },
    'siding': { budget: { low: 5, high: 8 }, mid: { low: 9, high: 14 }, high: { low: 15, high: 25 } },
  };

  const range = costRanges[projectType]?.[qualityLevel] || costRanges['new-home'].mid;
  const lowEstimate = squareFootage * range.low;
  const highEstimate = squareFootage * range.high;
  const midEstimate = (lowEstimate + highEstimate) / 2;

  return {
    projectType,
    squareFootage,
    qualityLevel,
    costPerSF: { low: range.low, high: range.high, mid: (range.low + range.high) / 2 },
    estimatedCost: {
      low: Math.round(lowEstimate),
      mid: Math.round(midEstimate),
      high: Math.round(highEstimate),
    },
    disclaimer: 'This is a rough estimate based on national averages. Actual costs vary by location, specific materials, site conditions, and project complexity. A detailed estimate with specific line items is recommended.',
  };
}

export default {
  createEstimate,
  addMaterialFromCatalog,
  addLaborItem,
  addEquipmentItem,
  addSubcontractorItem,
  applyTemplate,
  generateReport,
  quickEstimate,
};
