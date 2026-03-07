/**
 * Tests for the Construction Estimating Engine
 */

import { EstimateEngine } from '../src/engine/estimate-engine.js';
import { validateEstimate, validateLineItem } from '../src/utils/validator.js';
import { roundCurrency } from '../src/utils/helpers.js';
import { calculateCostPlus, calculateTieredMarkup, reverseMarkup, calculateGrossMargin } from '../src/engine/markup-calculator.js';
import { searchMaterials } from '../src/data/materials-catalog.js';
import { calculateLaborHours, getTrades } from '../src/data/labor-rates.js';
import { calculateEquipmentCost } from '../src/data/equipment-rates.js';

// ─── Simple Test Runner ──────────────────────────────────────────────────
let passed = 0;
let failed = 0;

function test(name, fn) {
  try {
    fn();
    passed++;
    console.log(`  ✓ ${name}`);
  } catch (err) {
    failed++;
    console.log(`  ✗ ${name}`);
    console.log(`    ${err.message}`);
  }
}

function assert(condition, message) {
  if (!condition) throw new Error(message || 'Assertion failed');
}

function assertEqual(actual, expected, message) {
  if (actual !== expected) {
    throw new Error(message || `Expected ${expected}, got ${actual}`);
  }
}

function assertClose(actual, expected, tolerance = 0.01, message) {
  if (Math.abs(actual - expected) > tolerance) {
    throw new Error(message || `Expected ~${expected}, got ${actual} (tolerance: ${tolerance})`);
  }
}

// ─── Engine Tests ────────────────────────────────────────────────────────
console.log('\n=== Estimate Engine Tests ===\n');

test('Create blank estimate', () => {
  const engine = new EstimateEngine();
  const estimate = engine.createEstimate({ projectName: 'Test Project' });
  assertEqual(estimate.projectName, 'Test Project');
  assertEqual(estimate.status, 'draft');
  assert(estimate.id.startsWith('est_'));
  assertEqual(estimate.lineItems.length, 0);
});

test('Add category', () => {
  const engine = new EstimateEngine();
  const estimate = engine.createEstimate();
  const cat = engine.addCategory(estimate, { name: 'Framing', csiCode: '06' });
  assertEqual(estimate.categories.length, 1);
  assertEqual(cat.name, 'Framing');
  assertEqual(cat.csiCode, '06');
});

test('Add material line item', () => {
  const engine = new EstimateEngine();
  const estimate = engine.createEstimate();
  const item = engine.addLineItem(estimate, {
    description: '2x4 Studs',
    type: 'material',
    quantity: 100,
    unit: 'ea',
    unitPrice: 3.85,
    wasteFactor: 0.10,
  });
  assertEqual(estimate.lineItems.length, 1);
  assertClose(item.adjustedQuantity, 110, 0.01);
  assertClose(item.materialCost, 423.50);
});

test('Add material with labor', () => {
  const engine = new EstimateEngine();
  const estimate = engine.createEstimate();
  const item = engine.addLineItem(estimate, {
    description: 'Drywall sheets',
    type: 'material',
    quantity: 20,
    unit: 'sht',
    unitPrice: 12.50,
    wasteFactor: 0.10,
    laborHours: 8,
    laborRate: 28.00,
    includeBurden: true,
  });
  assertClose(item.materialCost, 275.00);
  assertClose(item.laborCost, 302.40); // 8 * 28 * 1.35
  assertClose(item.totalCost, 577.40);
});

test('Add labor line item', () => {
  const engine = new EstimateEngine();
  const estimate = engine.createEstimate();
  const item = engine.addLineItem(estimate, {
    description: 'Framing labor',
    type: 'labor',
    quantity: 1000,
    unit: 'sf',
    laborRate: 35.00,
    productivityRate: 20, // 20 sf/hr
    crewSize: 2,
    includeBurden: true,
  });
  // hours = 1000/20 = 50 hours
  // cost = 50 * 35 * 2 * 1.35 = 4725
  assertClose(item.laborCost, 4725.00);
});

test('Add equipment line item', () => {
  const engine = new EstimateEngine();
  const estimate = engine.createEstimate();
  const item = engine.addLineItem(estimate, {
    description: 'Mini Excavator',
    type: 'equipment',
    quantity: 1,
    equipmentDailyRate: 350,
    equipmentDays: 3,
    mobilizationCost: 250,
    fuelCost: 225,
  });
  assertClose(item.equipmentCost, 1525.00);
  assertClose(item.totalCost, 1525.00);
});

test('Add subcontractor line item', () => {
  const engine = new EstimateEngine();
  const estimate = engine.createEstimate();
  const item = engine.addLineItem(estimate, {
    description: 'HVAC Subcontractor',
    type: 'subcontractor',
    quantity: 1,
    subBid: 12500.00,
  });
  assertClose(item.totalCost, 12500.00);
});

test('Calculate full estimate - cost-plus', () => {
  const engine = new EstimateEngine({
    overheadRate: 0.10,
    profitRate: 0.10,
    contingencyRate: 0.05,
    taxRate: 0.08,
    bondRate: 0,
  });
  const estimate = engine.createEstimate();

  engine.addLineItem(estimate, {
    description: 'Materials',
    type: 'material',
    quantity: 100,
    unit: 'ea',
    unitPrice: 10.00,
    wasteFactor: 0,
    taxable: true,
  });

  engine.addLineItem(estimate, {
    description: 'Labor',
    type: 'labor',
    quantity: 40,
    unit: 'hr',
    laborRate: 35.00,
    productivityRate: 1,
    crewSize: 1,
    includeBurden: false,
  });

  const summary = engine.calculateEstimate(estimate);

  assertEqual(summary.materialsCost, 1000);
  assertEqual(summary.laborCost, 1400);
  assertEqual(summary.totalDirectCosts, 2400);

  // Contingency: 2400 * 0.05 = 120
  assertClose(summary.contingency, 120);
  // Total before markup: 2520
  assertClose(summary.totalBeforeMarkup, 2520);
  // Overhead: 2520 * 0.10 = 252
  assertClose(summary.overhead, 252);
  // Profit: (2520 + 252) * 0.10 = 277.20
  assertClose(summary.profit, 277.20);
  // Tax: 1000 * 0.08 = 80
  assertClose(summary.salesTax, 80);
});

test('Update line item', () => {
  const engine = new EstimateEngine();
  const estimate = engine.createEstimate();
  const item = engine.addLineItem(estimate, {
    description: 'Test item',
    type: 'material',
    quantity: 10,
    unitPrice: 5.00,
    wasteFactor: 0,
  });
  engine.updateLineItem(estimate, item.id, { quantity: 20 });
  assertClose(estimate.lineItems[0].materialCost, 100);
});

test('Remove line item', () => {
  const engine = new EstimateEngine();
  const estimate = engine.createEstimate();
  const item = engine.addLineItem(estimate, {
    description: 'To remove',
    type: 'material',
    quantity: 1,
    unitPrice: 1.00,
  });
  assertEqual(estimate.lineItems.length, 1);
  engine.removeLineItem(estimate, item.id);
  assertEqual(estimate.lineItems.length, 0);
});

test('Change order', () => {
  const engine = new EstimateEngine();
  const estimate = engine.createEstimate();
  engine.addLineItem(estimate, {
    description: 'Base item',
    type: 'material',
    quantity: 10,
    unitPrice: 100,
    wasteFactor: 0,
  });

  const co = engine.createChangeOrder(estimate, {
    description: 'Add extra work',
    lineItems: [{
      description: 'Extra material',
      type: 'material',
      quantity: 5,
      unitPrice: 50,
      wasteFactor: 0,
    }],
  });

  assertEqual(estimate.changeOrders.length, 1);
  assertEqual(co.number, 1);
  assertClose(co.totalCost, 250);
});

test('Compare estimates', () => {
  const engine = new EstimateEngine();
  const est1 = engine.createEstimate({ projectName: 'Option A' });
  const est2 = engine.createEstimate({ projectName: 'Option B' });

  engine.addLineItem(est1, { description: 'A', type: 'material', quantity: 10, unitPrice: 100, wasteFactor: 0 });
  engine.addLineItem(est2, { description: 'B', type: 'material', quantity: 10, unitPrice: 150, wasteFactor: 0 });

  const comparison = engine.compareEstimates(est1, est2);
  assertClose(comparison.differences.materialsCost, 500);
});

// ─── Markup Calculator Tests ─────────────────────────────────────────────
console.log('\n=== Markup Calculator Tests ===\n');

test('Cost-plus calculation', () => {
  const result = calculateCostPlus(10000, 0.10, 0.10);
  assertClose(result.overhead, 1000);
  assertClose(result.profit, 1100);
  assertClose(result.totalWithMarkup, 12100);
});

test('Tiered markup calculation', () => {
  const result = calculateTieredMarkup(
    { materials: 5000, labor: 3000, equipment: 1000, subcontractors: 2000 },
    { materials: 0.15, labor: 0.25, equipment: 0.15, subcontractors: 0.10 }
  );
  // materials: 750, labor: 750, equipment: 150, subs: 200
  assertClose(result.totalMarkup, 1850);
});

test('Reverse markup', () => {
  const result = reverseMarkup(12100, 0.10, 0.10);
  assertClose(result.directCost, 10000, 1);
});

test('Gross margin', () => {
  assertClose(calculateGrossMargin(12100, 10000), 17.36, 0.01);
});

// ─── Material Catalog Tests ──────────────────────────────────────────────
console.log('\n=== Material Catalog Tests ===\n');

test('Search materials by name', () => {
  const results = searchMaterials('2x4');
  assert(results.length > 0, 'Should find 2x4 materials');
  assert(results.some(r => r.name.includes('2x4')));
});

test('Search materials by category', () => {
  const results = searchMaterials('concrete');
  assert(results.length > 0, 'Should find concrete materials');
});

test('Material prices are positive', () => {
  const results = searchMaterials('');
  // Search with empty string won't match anything, search by known item
  const concrete = searchMaterials('Ready-Mix');
  assert(concrete.length > 0);
  assert(concrete[0].unitPrice > 0);
});

// ─── Labor Rate Tests ────────────────────────────────────────────────────
console.log('\n=== Labor Rate Tests ===\n');

test('Get all trades', () => {
  const trades = getTrades();
  assert(trades.length > 0, 'Should have at least one trade');
  assert(trades.some(t => t.trade === 'Carpenter'));
});

test('Calculate labor hours', () => {
  const result = calculateLaborHours('carpenter', 'framing_walls', 1600);
  assert(result !== null);
  assertEqual(result.daysNeeded, 10);
  assertEqual(result.totalHours, 80);
});

test('Labor burden applied correctly', () => {
  const result = calculateLaborHours('carpenter', 'framing_walls', 160);
  // 1 day, 8 hours, burdened rate = 47.25
  assertClose(result.laborCost, 378, 1);
});

// ─── Equipment Rate Tests ────────────────────────────────────────────────
console.log('\n=== Equipment Rate Tests ===\n');

test('Calculate equipment cost', () => {
  const result = calculateEquipmentCost('excavator_mini', 3);
  assert(result !== null);
  assertEqual(result.days, 3);
  assert(result.totalCost > 0);
  assert(result.rentalCost > 0);
  assert(result.mobilization > 0);
});

test('Weekly rate optimization', () => {
  const result = calculateEquipmentCost('skid_steer', 6);
  // 6 days should be cheaper at weekly rate (1100) vs 6 * daily (1650)
  assert(result.rentalCost <= 1650);
});

// ─── Validator Tests ─────────────────────────────────────────────────────
console.log('\n=== Validator Tests ===\n');

test('Valid line item passes', () => {
  const result = validateLineItem({
    description: 'Test',
    type: 'material',
    quantity: 10,
    unitPrice: 5.00,
  });
  assert(result.valid);
});

test('Missing description fails', () => {
  const result = validateLineItem({
    type: 'material',
    quantity: 10,
  });
  assert(!result.valid);
});

test('Negative quantity fails', () => {
  const result = validateLineItem({
    description: 'Test',
    type: 'material',
    quantity: -5,
    unitPrice: 5.00,
  });
  assert(!result.valid);
});

test('High waste factor warns', () => {
  const result = validateLineItem({
    description: 'Test',
    type: 'material',
    quantity: 10,
    unitPrice: 5.00,
    wasteFactor: 0.35,
  });
  assert(result.valid);
  assert(result.warnings.length > 0);
});

test('Estimate with no items warns', () => {
  const engine = new EstimateEngine();
  const estimate = engine.createEstimate();
  const result = validateEstimate(estimate);
  assert(result.warnings.some(w => w.includes('no line items')));
});

// ─── Summary ──────────────────────────────────────────────────────────────
console.log(`\n${'='.repeat(50)}`);
console.log(`Tests: ${passed + failed} total, ${passed} passed, ${failed} failed`);
console.log(`${'='.repeat(50)}\n`);

if (failed > 0) {
  process.exit(1);
}
