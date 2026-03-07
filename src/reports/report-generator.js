/**
 * Estimate Report Generator
 * Generates formatted estimate reports, proposals, and summaries.
 */

import { formatCurrency, formatPercentage, formatDate, unitFullName, horizontalRule } from '../utils/helpers.js';

/**
 * Generate a detailed estimate report
 */
export function generateDetailedReport(estimate, summary) {
  const config = estimate.config || {};
  const lines = [];
  const HR = horizontalRule(80, '=');
  const hr = horizontalRule(80, '-');

  // Header
  lines.push(HR);
  lines.push(centerText('CONSTRUCTION COST ESTIMATE', 80));
  lines.push(centerText('DETAILED BREAKDOWN', 80));
  lines.push(HR);
  lines.push('');

  // Project Information
  lines.push('PROJECT INFORMATION');
  lines.push(hr);
  lines.push(`  Project Name:     ${estimate.projectName}`);
  lines.push(`  Client:           ${estimate.clientName || 'N/A'}`);
  lines.push(`  Address:          ${estimate.projectAddress || 'N/A'}`);
  lines.push(`  Estimator:        ${estimate.estimatorName || 'N/A'}`);
  lines.push(`  Date Created:     ${formatDate(estimate.dateCreated)}`);
  lines.push(`  Date Modified:    ${formatDate(estimate.dateModified)}`);
  lines.push(`  Status:           ${estimate.status.toUpperCase()}`);
  lines.push(`  Estimate ID:      ${estimate.id}`);
  lines.push('');

  // Configuration
  lines.push('ESTIMATE CONFIGURATION');
  lines.push(hr);
  lines.push(`  Markup Method:    ${config.markupMethod || 'cost-plus'}`);
  lines.push(`  Overhead Rate:    ${formatPercentage(config.overheadRate || 0)}`);
  lines.push(`  Profit Rate:      ${formatPercentage(config.profitRate || 0)}`);
  lines.push(`  Contingency:      ${formatPercentage(config.contingencyRate || 0)}`);
  lines.push(`  Sales Tax Rate:   ${formatPercentage(config.taxRate || 0)}`);
  lines.push(`  Bond Rate:        ${formatPercentage(config.bondRate || 0)}`);
  lines.push(`  Labor Burden:     ${formatPercentage(config.laborBurdenRate || 0)}`);
  lines.push(`  Waste Factor:     ${formatPercentage(config.wasteFactor || 0)}`);
  lines.push('');

  // Line Items by Category
  lines.push(HR);
  lines.push(centerText('LINE ITEM DETAIL', 80));
  lines.push(HR);
  lines.push('');

  // Group by category
  const categorized = groupByCategory(estimate);

  for (const [catName, items] of Object.entries(categorized)) {
    lines.push(`  ${catName.toUpperCase()}`);
    lines.push(`  ${'-'.repeat(76)}`);

    // Table header
    lines.push(`  ${'Description'.padEnd(30)} ${'Qty'.padStart(8)} ${'Unit'.padEnd(5)} ${'Unit $'.padStart(10)} ${'Material'.padStart(10)} ${'Labor'.padStart(10)}`);
    lines.push(`  ${'-'.repeat(30)} ${'-'.repeat(8)} ${'-'.repeat(5)} ${'-'.repeat(10)} ${'-'.repeat(10)} ${'-'.repeat(10)}`);

    let catMaterial = 0;
    let catLabor = 0;
    let catTotal = 0;

    for (const item of items) {
      const desc = (item.description || '').substring(0, 30).padEnd(30);
      const qty = formatNumber(item.quantity || item.subBid || 0).padStart(8);
      const unit = (item.unit || '').padEnd(5);
      const unitP = formatCurrency(item.unitPrice || 0).padStart(10);
      const matCost = formatCurrency(item.materialCost || 0).padStart(10);
      const labCost = formatCurrency(item.laborCost || 0).padStart(10);

      lines.push(`  ${desc} ${qty} ${unit} ${unitP} ${matCost} ${labCost}`);

      if (item.notes) {
        lines.push(`    Note: ${item.notes}`);
      }

      catMaterial += item.materialCost || 0;
      catLabor += item.laborCost || 0;
      catTotal += item.totalCost || 0;
    }

    lines.push(`  ${'-'.repeat(30)} ${'-'.repeat(8)} ${'-'.repeat(5)} ${'-'.repeat(10)} ${'-'.repeat(10)} ${'-'.repeat(10)}`);
    lines.push(`  ${'Subtotal'.padEnd(30)} ${''.padStart(8)} ${''.padEnd(5)} ${''.padStart(10)} ${formatCurrency(catMaterial).padStart(10)} ${formatCurrency(catLabor).padStart(10)}`);
    lines.push(`  ${'Category Total:'.padEnd(55)} ${formatCurrency(catTotal).padStart(12)}`);
    lines.push('');
  }

  // General Conditions
  if (estimate.generalConditions?.length > 0) {
    lines.push('  GENERAL CONDITIONS');
    lines.push(`  ${'-'.repeat(76)}`);
    for (const gc of estimate.generalConditions) {
      lines.push(`  ${gc.description.padEnd(55)} ${formatCurrency(gc.type === 'percentage' ? summary.totalDirectCosts * gc.percentage : gc.cost).padStart(12)}`);
    }
    lines.push('');
  }

  // Summary
  lines.push(HR);
  lines.push(centerText('ESTIMATE SUMMARY', 80));
  lines.push(HR);
  lines.push('');
  lines.push(`  ${'Materials Cost:'.padEnd(45)} ${formatCurrency(summary.materialsCost).padStart(15)}`);
  lines.push(`  ${'Labor Cost:'.padEnd(45)} ${formatCurrency(summary.laborCost).padStart(15)}`);
  lines.push(`  ${'Equipment Cost:'.padEnd(45)} ${formatCurrency(summary.equipmentCost).padStart(15)}`);
  lines.push(`  ${'Subcontractor Cost:'.padEnd(45)} ${formatCurrency(summary.subcontractorCost).padStart(15)}`);
  lines.push(`  ${hr}`);
  lines.push(`  ${'TOTAL DIRECT COSTS:'.padEnd(45)} ${formatCurrency(summary.totalDirectCosts).padStart(15)}`);
  lines.push('');
  lines.push(`  ${'General Conditions:'.padEnd(45)} ${formatCurrency(summary.generalConditionsCost).padStart(15)}`);
  lines.push(`  ${'SUBTOTAL:'.padEnd(45)} ${formatCurrency(summary.subtotal).padStart(15)}`);
  lines.push('');
  lines.push(`  ${'Contingency (' + formatPercentage(config.contingencyRate || 0) + '):'.padEnd(45)} ${formatCurrency(summary.contingency).padStart(15)}`);
  lines.push(`  ${'TOTAL BEFORE MARKUP:'.padEnd(45)} ${formatCurrency(summary.totalBeforeMarkup).padStart(15)}`);
  lines.push('');
  lines.push(`  ${'Overhead (' + formatPercentage(config.overheadRate || 0) + '):'.padEnd(45)} ${formatCurrency(summary.overhead).padStart(15)}`);
  lines.push(`  ${'Profit (' + formatPercentage(config.profitRate || 0) + '):'.padEnd(45)} ${formatCurrency(summary.profit).padStart(15)}`);
  lines.push(`  ${'Sales Tax (' + formatPercentage(config.taxRate || 0) + '):'.padEnd(45)} ${formatCurrency(summary.salesTax).padStart(15)}`);
  lines.push(`  ${'Bond (' + formatPercentage(config.bondRate || 0) + '):'.padEnd(45)} ${formatCurrency(summary.bond).padStart(15)}`);
  lines.push('');
  lines.push(`  ${HR}`);
  lines.push(`  ${'TOTAL PROJECT COST:'.padEnd(45)} ${formatCurrency(summary.totalProjectCost).padStart(15)}`);
  lines.push(`  ${HR}`);

  if (summary.totalArea > 0) {
    lines.push(`  ${'Cost per Square Foot:'.padEnd(45)} ${formatCurrency(summary.costPerSF).padStart(15)}`);
    lines.push(`  ${'Total Area:'.padEnd(45)} ${formatNumber(summary.totalArea).padStart(12)} SF`);
  }

  // Change Orders
  if (estimate.changeOrders?.length > 0) {
    lines.push('');
    lines.push('  CHANGE ORDERS');
    lines.push(`  ${'-'.repeat(76)}`);
    for (const co of estimate.changeOrders) {
      const status = co.status.toUpperCase().padEnd(10);
      lines.push(`  CO #${co.number}  ${status}  ${co.description.padEnd(40)} ${formatCurrency(co.totalCost).padStart(12)}`);
    }
    lines.push(`  ${'-'.repeat(76)}`);
    lines.push(`  ${'Approved Change Orders:'.padEnd(45)} ${formatCurrency(summary.approvedChangeOrders).padStart(15)}`);
    lines.push(`  ${'Pending Change Orders:'.padEnd(45)} ${formatCurrency(summary.pendingChangeOrders).padStart(15)}`);
    lines.push(`  ${'REVISED TOTAL:'.padEnd(45)} ${formatCurrency(summary.revisedTotal).padStart(15)}`);
  }

  // Notes
  if (estimate.notes) {
    lines.push('');
    lines.push('  NOTES');
    lines.push(`  ${'-'.repeat(76)}`);
    lines.push(`  ${estimate.notes}`);
  }

  // Exclusions & Inclusions
  if (estimate.exclusions?.length > 0) {
    lines.push('');
    lines.push('  EXCLUSIONS');
    lines.push(`  ${'-'.repeat(76)}`);
    for (const exc of estimate.exclusions) {
      lines.push(`  - ${exc}`);
    }
  }

  if (estimate.inclusions?.length > 0) {
    lines.push('');
    lines.push('  INCLUSIONS');
    lines.push(`  ${'-'.repeat(76)}`);
    for (const inc of estimate.inclusions) {
      lines.push(`  - ${inc}`);
    }
  }

  lines.push('');
  lines.push(HR);
  lines.push(centerText('END OF ESTIMATE', 80));
  lines.push(HR);

  return lines.join('\n');
}

/**
 * Generate a client-facing proposal summary (condensed)
 */
export function generateProposalSummary(estimate, summary) {
  const config = estimate.config || {};
  const lines = [];

  lines.push('# Construction Cost Proposal');
  lines.push('');
  lines.push(`**Project:** ${estimate.projectName}`);
  lines.push(`**Client:** ${estimate.clientName || 'N/A'}`);
  lines.push(`**Date:** ${formatDate(estimate.dateCreated)}`);
  lines.push(`**Valid For:** 30 Days`);
  lines.push('');

  // Category summary table
  lines.push('## Cost Summary');
  lines.push('');
  lines.push('| Category | Cost |');
  lines.push('|----------|------|');

  for (const cat of summary.categoryBreakdown) {
    lines.push(`| ${cat.categoryName} | ${formatCurrency(cat.totalCost)} |`);
  }

  lines.push(`| **Direct Costs** | **${formatCurrency(summary.totalDirectCosts)}** |`);

  if (summary.generalConditionsCost > 0) {
    lines.push(`| General Conditions | ${formatCurrency(summary.generalConditionsCost)} |`);
  }
  if (summary.contingency > 0) {
    lines.push(`| Contingency | ${formatCurrency(summary.contingency)} |`);
  }
  lines.push(`| Overhead & Profit | ${formatCurrency(summary.overhead + summary.profit)} |`);
  if (summary.salesTax > 0) {
    lines.push(`| Sales Tax | ${formatCurrency(summary.salesTax)} |`);
  }
  if (summary.bond > 0) {
    lines.push(`| Bond | ${formatCurrency(summary.bond)} |`);
  }
  lines.push(`| **TOTAL** | **${formatCurrency(summary.totalProjectCost)}** |`);
  lines.push('');

  if (summary.totalArea > 0) {
    lines.push(`**Cost per Square Foot:** ${formatCurrency(summary.costPerSF)}/SF`);
    lines.push('');
  }

  // Exclusions
  if (estimate.exclusions?.length > 0) {
    lines.push('## Exclusions');
    for (const exc of estimate.exclusions) {
      lines.push(`- ${exc}`);
    }
    lines.push('');
  }

  // Inclusions
  if (estimate.inclusions?.length > 0) {
    lines.push('## Scope Includes');
    for (const inc of estimate.inclusions) {
      lines.push(`- ${inc}`);
    }
    lines.push('');
  }

  lines.push('## Terms & Conditions');
  lines.push('- This estimate is valid for 30 days from the date above.');
  lines.push('- Pricing is based on current material costs and is subject to change.');
  lines.push('- Payment terms: As agreed upon in the signed contract.');
  lines.push('- Any work not specifically included in this estimate is excluded.');
  lines.push('- Change orders will be priced separately and require written approval.');

  return lines.join('\n');
}

/**
 * Generate a category-level summary report
 */
export function generateCategorySummary(estimate, summary) {
  const lines = [];

  lines.push(`Estimate Summary: ${estimate.projectName}`);
  lines.push(`Date: ${formatDate(estimate.dateModified)}`);
  lines.push(horizontalRule(65));
  lines.push('');
  lines.push(`${'Category'.padEnd(30)} ${'Materials'.padStart(12)} ${'Labor'.padStart(12)} ${'Total'.padStart(12)}`);
  lines.push(`${'-'.repeat(30)} ${'-'.repeat(12)} ${'-'.repeat(12)} ${'-'.repeat(12)}`);

  for (const cat of summary.categoryBreakdown) {
    lines.push(
      `${cat.categoryName.substring(0, 30).padEnd(30)} ` +
      `${formatCurrency(cat.materialsCost).padStart(12)} ` +
      `${formatCurrency(cat.laborCost).padStart(12)} ` +
      `${formatCurrency(cat.totalCost).padStart(12)}`
    );
  }

  lines.push(`${'-'.repeat(30)} ${'-'.repeat(12)} ${'-'.repeat(12)} ${'-'.repeat(12)}`);
  lines.push(
    `${'TOTALS'.padEnd(30)} ` +
    `${formatCurrency(summary.materialsCost).padStart(12)} ` +
    `${formatCurrency(summary.laborCost).padStart(12)} ` +
    `${formatCurrency(summary.totalDirectCosts).padStart(12)}`
  );
  lines.push('');
  lines.push(`${'Overhead + Profit:'.padEnd(55)} ${formatCurrency(summary.overhead + summary.profit).padStart(12)}`);
  lines.push(`${'Tax + Bond:'.padEnd(55)} ${formatCurrency(summary.salesTax + summary.bond).padStart(12)}`);
  lines.push(`${'TOTAL PROJECT COST:'.padEnd(55)} ${formatCurrency(summary.totalProjectCost).padStart(12)}`);

  return lines.join('\n');
}

/**
 * Generate a comparison report between two estimates
 */
export function generateComparisonReport(comparison) {
  const lines = [];
  const s1 = comparison.estimate1.summary;
  const s2 = comparison.estimate2.summary;
  const diff = comparison.differences;

  lines.push('# Estimate Comparison Report');
  lines.push('');
  lines.push(`| Item | ${comparison.estimate1.name} | ${comparison.estimate2.name} | Difference |`);
  lines.push('|------|------|------|------|');
  lines.push(`| Materials | ${formatCurrency(s1.materialsCost)} | ${formatCurrency(s2.materialsCost)} | ${formatCurrency(diff.materialsCost)} |`);
  lines.push(`| Labor | ${formatCurrency(s1.laborCost)} | ${formatCurrency(s2.laborCost)} | ${formatCurrency(diff.laborCost)} |`);
  lines.push(`| Equipment | ${formatCurrency(s1.equipmentCost)} | ${formatCurrency(s2.equipmentCost)} | ${formatCurrency(diff.equipmentCost)} |`);
  lines.push(`| Subcontractors | ${formatCurrency(s1.subcontractorCost)} | ${formatCurrency(s2.subcontractorCost)} | ${formatCurrency(diff.subcontractorCost)} |`);
  lines.push(`| **Direct Costs** | **${formatCurrency(s1.totalDirectCosts)}** | **${formatCurrency(s2.totalDirectCosts)}** | **${formatCurrency(diff.totalDirectCosts)}** |`);
  lines.push(`| Overhead | ${formatCurrency(s1.overhead)} | ${formatCurrency(s2.overhead)} | ${formatCurrency(diff.overhead)} |`);
  lines.push(`| Profit | ${formatCurrency(s1.profit)} | ${formatCurrency(s2.profit)} | ${formatCurrency(diff.profit)} |`);
  lines.push(`| **Total** | **${formatCurrency(s1.totalProjectCost)}** | **${formatCurrency(s2.totalProjectCost)}** | **${formatCurrency(diff.totalProjectCost)}** |`);
  lines.push('');
  lines.push(`**Percentage Difference:** ${diff.percentageDifference}%`);

  return lines.join('\n');
}

// ─── Helper Functions ────────────────────────────────────────────────────

function groupByCategory(estimate) {
  const groups = {};
  for (const item of estimate.lineItems) {
    const cat = estimate.categories.find(c => c.id === item.categoryId);
    const catName = cat?.name || 'General';
    if (!groups[catName]) groups[catName] = [];
    groups[catName].push(item);
  }
  return groups;
}

function centerText(text, width) {
  const padding = Math.max(0, Math.floor((width - text.length) / 2));
  return ' '.repeat(padding) + text;
}

function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num);
}

export default {
  generateDetailedReport,
  generateProposalSummary,
  generateCategorySummary,
  generateComparisonReport,
};
