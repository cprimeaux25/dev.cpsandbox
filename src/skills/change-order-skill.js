/**
 * /estimate-change-order Skill - Change Order Management
 *
 * Create, track, and manage change orders against existing estimates.
 * Usage: /estimate-change-order [estimate-id]
 */

import { formatCurrency, formatDate } from '../utils/helpers.js';

/**
 * Create a change order
 */
export function createChangeOrder(engine, estimate, changeOrderData) {
  const co = engine.createChangeOrder(estimate, changeOrderData);

  // Calculate impact on total
  const summary = engine.calculateEstimate(estimate);

  return {
    changeOrder: co,
    impact: {
      changeOrderCost: formatCurrency(co.totalCost),
      originalTotal: formatCurrency(summary.totalProjectCost - summary.approvedChangeOrders),
      revisedTotal: formatCurrency(summary.revisedTotal),
      totalChangeOrders: estimate.changeOrders.length,
      approvedTotal: formatCurrency(summary.approvedChangeOrders),
      pendingTotal: formatCurrency(summary.pendingChangeOrders),
    },
  };
}

/**
 * Approve a change order
 */
export function approveChangeOrder(estimate, changeOrderId) {
  const co = estimate.changeOrders.find(c => c.id === changeOrderId);
  if (!co) throw new Error(`Change order not found: ${changeOrderId}`);
  co.status = 'approved';
  co.dateApproved = new Date().toISOString();
  estimate.dateModified = new Date().toISOString();
  return co;
}

/**
 * Reject a change order
 */
export function rejectChangeOrder(estimate, changeOrderId) {
  const co = estimate.changeOrders.find(c => c.id === changeOrderId);
  if (!co) throw new Error(`Change order not found: ${changeOrderId}`);
  co.status = 'rejected';
  co.dateRejected = new Date().toISOString();
  estimate.dateModified = new Date().toISOString();
  return co;
}

/**
 * List all change orders for an estimate
 */
export function listChangeOrders(estimate) {
  return estimate.changeOrders.map(co => ({
    id: co.id,
    number: co.number,
    description: co.description,
    reason: co.reason,
    status: co.status,
    cost: formatCurrency(co.totalCost),
    date: formatDate(co.dateCreated),
    itemCount: co.lineItems?.length || 0,
  }));
}

/**
 * Generate a change order report
 */
export function generateChangeOrderReport(estimate, changeOrderId) {
  const co = estimate.changeOrders.find(c => c.id === changeOrderId);
  if (!co) throw new Error(`Change order not found: ${changeOrderId}`);

  const lines = [];
  lines.push(`# Change Order #${co.number}`);
  lines.push('');
  lines.push(`**Project:** ${estimate.projectName}`);
  lines.push(`**Date:** ${formatDate(co.dateCreated)}`);
  lines.push(`**Status:** ${co.status.toUpperCase()}`);
  lines.push('');
  lines.push(`## Description`);
  lines.push(co.description);
  if (co.reason) {
    lines.push('');
    lines.push(`**Reason:** ${co.reason}`);
  }
  lines.push('');

  if (co.lineItems?.length > 0) {
    lines.push('## Line Items');
    lines.push('');
    lines.push('| Description | Type | Amount |');
    lines.push('|-------------|------|--------|');
    for (const item of co.lineItems) {
      lines.push(`| ${item.description} | ${item.type} | ${formatCurrency(item.totalCost || 0)} |`);
    }
    lines.push('');
  }

  lines.push(`**Change Order Total: ${formatCurrency(co.totalCost)}**`);

  return lines.join('\n');
}

export default {
  createChangeOrder,
  approveChangeOrder,
  rejectChangeOrder,
  listChangeOrders,
  generateChangeOrderReport,
};
