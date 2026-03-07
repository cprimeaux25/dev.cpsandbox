#!/usr/bin/env node
/**
 * Demo: Complete Kitchen Remodel Estimate
 * Demonstrates the full estimating engine with a realistic project.
 */

import { EstimateEngine } from '../src/engine/estimate-engine.js';
import { KITCHEN_REMODEL_TEMPLATE } from '../templates/residential-remodel.js';
import { generateDetailedReport, generateProposalSummary } from '../src/reports/report-generator.js';
import { validateEstimate } from '../src/utils/validator.js';
import { applyTemplate } from '../src/skills/estimate-skill.js';

// ── Create the Estimate ────────────────────────────────────────────────
const engine = new EstimateEngine({
  taxRate: 0.0825,
  overheadRate: 0.10,
  profitRate: 0.10,
  contingencyRate: 0.10,
  laborBurdenRate: 0.35,
  markupMethod: 'cost-plus',
});

const estimate = engine.createEstimate({
  projectName: 'Smith Kitchen Remodel',
  clientName: 'John & Jane Smith',
  projectAddress: '123 Main Street, Anytown, USA 12345',
  estimatorName: 'CP Construction Services',
  notes: 'Full kitchen remodel including new cabinets, countertops, flooring, electrical, and plumbing.',
});

// Apply template
applyTemplate(engine, estimate, KITCHEN_REMODEL_TEMPLATE);

// Get category IDs for organizing line items
const catIds = {};
for (const cat of estimate.categories) {
  catIds[cat.name] = cat.id;
}

// ── DEMOLITION ─────────────────────────────────────────────────────────
engine.addLineItem(estimate, {
  description: 'Remove existing cabinets & countertops',
  type: 'labor',
  quantity: 1,
  unit: 'ls',
  laborRate: 29.70,
  laborHours: 16,
  productivityRate: 1,
  crewSize: 2,
  includeBurden: false,
  categoryId: catIds['Demolition'],
});

engine.addLineItem(estimate, {
  description: 'Remove existing flooring (180 SF)',
  type: 'labor',
  quantity: 180,
  unit: 'sf',
  laborRate: 29.70,
  productivityRate: 50,
  crewSize: 1,
  includeBurden: false,
  categoryId: catIds['Demolition'],
});

engine.addLineItem(estimate, {
  description: 'Debris removal & dumpster',
  type: 'equipment',
  quantity: 1,
  unit: 'ls',
  equipmentDailyRate: 0,
  equipmentDays: 0,
  mobilizationCost: 0,
  fuelCost: 0,
  categoryId: catIds['Demolition'],
  notes: 'Included in General Conditions',
});

// ── ROUGH ELECTRICAL ────────────────────────────────────────────────────
engine.addLineItem(estimate, {
  description: 'New 20A kitchen circuit (GFCI)',
  type: 'material',
  quantity: 2,
  unit: 'ea',
  unitPrice: 42.00,
  laborHours: 4,
  laborRate: 57.96,
  wasteFactor: 0,
  categoryId: catIds['Rough Electrical'],
});

engine.addLineItem(estimate, {
  description: 'Undercabinet LED lighting rough-in',
  type: 'material',
  quantity: 12,
  unit: 'lf',
  unitPrice: 8.50,
  laborHours: 3,
  laborRate: 57.96,
  wasteFactor: 0.05,
  categoryId: catIds['Rough Electrical'],
});

engine.addLineItem(estimate, {
  description: 'Recessed can lights (LED)',
  type: 'material',
  quantity: 6,
  unit: 'ea',
  unitPrice: 28.00,
  laborHours: 6,
  laborRate: 57.96,
  wasteFactor: 0,
  categoryId: catIds['Rough Electrical'],
});

engine.addLineItem(estimate, {
  description: 'GFCI outlets',
  type: 'material',
  quantity: 4,
  unit: 'ea',
  unitPrice: 18.00,
  laborHours: 2,
  laborRate: 57.96,
  wasteFactor: 0,
  categoryId: catIds['Rough Electrical'],
});

// ── ROUGH PLUMBING ──────────────────────────────────────────────────────
engine.addLineItem(estimate, {
  description: 'Relocate sink supply lines',
  type: 'material',
  quantity: 20,
  unit: 'lf',
  unitPrice: 1.25,
  laborHours: 4,
  laborRate: 55.20,
  wasteFactor: 0.05,
  categoryId: catIds['Rough Plumbing'],
});

engine.addLineItem(estimate, {
  description: 'Relocate drain line',
  type: 'material',
  quantity: 15,
  unit: 'lf',
  unitPrice: 3.25,
  laborHours: 6,
  laborRate: 55.20,
  wasteFactor: 0.05,
  categoryId: catIds['Rough Plumbing'],
});

// ── DRYWALL & PATCHING ──────────────────────────────────────────────────
engine.addLineItem(estimate, {
  description: 'Drywall patching & repair',
  type: 'material',
  quantity: 8,
  unit: 'sht',
  unitPrice: 12.50,
  laborHours: 12,
  laborRate: 37.80,
  wasteFactor: 0.10,
  categoryId: catIds['Drywall & Patching'],
});

// ── CABINETS ───────────────────────────────────────────────────────────
engine.addLineItem(estimate, {
  description: 'Kitchen cabinets - Shaker style (25 LF)',
  type: 'material',
  quantity: 25,
  unit: 'lf',
  unitPrice: 175.00,
  laborHours: 16,
  laborRate: 47.25,
  wasteFactor: 0,
  categoryId: catIds['Cabinets'],
  notes: 'Mid-grade maple shaker cabinets, soft-close',
});

// ── COUNTERTOPS ────────────────────────────────────────────────────────
engine.addLineItem(estimate, {
  description: 'Quartz countertop (fabricated & installed)',
  type: 'subcontractor',
  quantity: 1,
  unit: 'ls',
  subBid: 4200.00,
  subScope: '38 SF quartz countertop, fabrication, template, installation, undermount sink cutout',
  categoryId: catIds['Countertops'],
});

// ── BACKSPLASH ─────────────────────────────────────────────────────────
engine.addLineItem(estimate, {
  description: 'Subway tile backsplash',
  type: 'material',
  quantity: 30,
  unit: 'sf',
  unitPrice: 4.50,
  laborHours: 8,
  laborRate: 47.25,
  wasteFactor: 0.15,
  categoryId: catIds['Backsplash'],
});

engine.addLineItem(estimate, {
  description: 'Thinset & grout for backsplash',
  type: 'material',
  quantity: 2,
  unit: 'bag',
  unitPrice: 16.50,
  wasteFactor: 0,
  categoryId: catIds['Backsplash'],
});

// ── FLOORING ───────────────────────────────────────────────────────────
engine.addLineItem(estimate, {
  description: 'Luxury Vinyl Plank flooring',
  type: 'material',
  quantity: 180,
  unit: 'sf',
  unitPrice: 3.25,
  laborHours: 5,
  laborRate: 37.80,
  wasteFactor: 0.10,
  categoryId: catIds['Flooring'],
});

engine.addLineItem(estimate, {
  description: 'Floor underlayment',
  type: 'material',
  quantity: 1,
  unit: 'roll',
  unitPrice: 28.00,
  wasteFactor: 0,
  categoryId: catIds['Flooring'],
});

// ── PAINT ──────────────────────────────────────────────────────────────
engine.addLineItem(estimate, {
  description: 'Prime & paint kitchen walls (2 coats)',
  type: 'material',
  quantity: 3,
  unit: 'gal',
  unitPrice: 38.00,
  laborHours: 12,
  laborRate: 33.75,
  wasteFactor: 0.05,
  categoryId: catIds['Paint'],
});

engine.addLineItem(estimate, {
  description: 'Primer',
  type: 'material',
  quantity: 1,
  unit: 'gal',
  unitPrice: 25.00,
  wasteFactor: 0,
  categoryId: catIds['Paint'],
});

// ── FINISH PLUMBING ────────────────────────────────────────────────────
engine.addLineItem(estimate, {
  description: 'Kitchen sink (SS undermount double bowl)',
  type: 'material',
  quantity: 1,
  unit: 'ea',
  unitPrice: 225.00,
  laborHours: 3,
  laborRate: 55.20,
  wasteFactor: 0,
  categoryId: catIds['Finish Plumbing'],
});

engine.addLineItem(estimate, {
  description: 'Kitchen faucet (pull-down, mid-grade)',
  type: 'material',
  quantity: 1,
  unit: 'ea',
  unitPrice: 175.00,
  laborHours: 1.5,
  laborRate: 55.20,
  wasteFactor: 0,
  categoryId: catIds['Finish Plumbing'],
});

engine.addLineItem(estimate, {
  description: 'Garbage disposal (3/4 HP)',
  type: 'material',
  quantity: 1,
  unit: 'ea',
  unitPrice: 135.00,
  laborHours: 1.5,
  laborRate: 55.20,
  wasteFactor: 0,
  categoryId: catIds['Finish Plumbing'],
});

// ── HARDWARE ───────────────────────────────────────────────────────────
engine.addLineItem(estimate, {
  description: 'Cabinet hardware (knobs & pulls)',
  type: 'material',
  quantity: 30,
  unit: 'ea',
  unitPrice: 4.50,
  laborHours: 2,
  laborRate: 33.75,
  wasteFactor: 0,
  categoryId: catIds['Hardware & Accessories'],
});

// ── GENERAL CONDITIONS ─────────────────────────────────────────────────
engine.addGeneralCondition(estimate, {
  description: 'Dumpster rental (20 CY)',
  cost: 450.00,
  type: 'fixed',
});

engine.addGeneralCondition(estimate, {
  description: 'Floor & surface protection',
  cost: 150.00,
  type: 'fixed',
});

engine.addGeneralCondition(estimate, {
  description: 'Project management & supervision',
  type: 'percentage',
  percentage: 0.05,
});

// ── Calculate & Report ─────────────────────────────────────────────────
const summary = engine.calculateEstimate(estimate);
const validation = validateEstimate(estimate);

// Print detailed report
console.log(generateDetailedReport(estimate, summary));

console.log('\n\n');
console.log('='.repeat(80));
console.log('VALIDATION RESULTS');
console.log('='.repeat(80));
console.log(`Valid: ${validation.valid}`);
if (validation.warnings.length > 0) {
  console.log(`Warnings: ${validation.warnings.length}`);
  for (const w of validation.warnings) {
    console.log(`  ⚠ ${w}`);
  }
}
if (validation.errors.length > 0) {
  console.log(`Errors: ${validation.errors.length}`);
  for (const e of validation.errors) {
    console.log(`  ✗ ${e}`);
  }
}

console.log('\n\n');
console.log('='.repeat(80));
console.log('PROPOSAL FORMAT');
console.log('='.repeat(80));
console.log(generateProposalSummary(estimate, summary));
