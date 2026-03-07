/**
 * Validation Module for Construction Estimates
 * Enforces guardrails and validates all inputs.
 */

/**
 * Validate a complete estimate
 */
export function validateEstimate(estimate) {
  const errors = [];
  const warnings = [];

  if (!estimate) {
    return { valid: false, errors: ['Estimate object is required'], warnings: [] };
  }

  // Project info
  if (!estimate.projectName || estimate.projectName.trim() === '') {
    warnings.push('Project name is empty');
  }

  // Config validation
  if (estimate.config) {
    const c = estimate.config;

    if (c.taxRate !== undefined && (c.taxRate < 0 || c.taxRate > 0.15)) {
      warnings.push(`Tax rate ${(c.taxRate * 100).toFixed(1)}% is outside typical range (0-15%)`);
    }

    if (c.overheadRate !== undefined && (c.overheadRate < 0 || c.overheadRate > 0.50)) {
      warnings.push(`Overhead rate ${(c.overheadRate * 100).toFixed(1)}% is outside typical range (0-50%)`);
    }

    if (c.profitRate !== undefined && (c.profitRate < 0 || c.profitRate > 0.50)) {
      warnings.push(`Profit rate ${(c.profitRate * 100).toFixed(1)}% is outside typical range (0-50%)`);
    }

    if (c.contingencyRate !== undefined && (c.contingencyRate < 0 || c.contingencyRate > 0.25)) {
      warnings.push(`Contingency rate ${(c.contingencyRate * 100).toFixed(1)}% is outside typical range (0-25%)`);
    }

    if (c.laborBurdenRate !== undefined && (c.laborBurdenRate < 0.15 || c.laborBurdenRate > 0.60)) {
      warnings.push(`Labor burden rate ${(c.laborBurdenRate * 100).toFixed(1)}% is outside typical range (15-60%)`);
    }

    if (c.wasteFactor !== undefined && (c.wasteFactor < 0 || c.wasteFactor > 0.30)) {
      warnings.push(`Waste factor ${(c.wasteFactor * 100).toFixed(1)}% is outside typical range (0-30%)`);
    }
  }

  // Line items
  if (!estimate.lineItems || estimate.lineItems.length === 0) {
    warnings.push('Estimate has no line items');
  }

  for (const item of (estimate.lineItems || [])) {
    const itemValidation = validateLineItem(item);
    if (!itemValidation.valid) {
      errors.push(`Line item "${item.description}": ${itemValidation.errors.join(', ')}`);
    }
    if (itemValidation.warnings.length > 0) {
      warnings.push(`Line item "${item.description}": ${itemValidation.warnings.join(', ')}`);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate a single line item
 */
export function validateLineItem(item) {
  const errors = [];
  const warnings = [];

  if (!item) {
    return { valid: false, errors: ['Line item object is required'], warnings: [] };
  }

  // Description
  if (!item.description || item.description.trim() === '') {
    errors.push('Description is required');
  }

  // Type
  const validTypes = ['material', 'labor', 'equipment', 'subcontractor'];
  if (item.type && !validTypes.includes(item.type)) {
    errors.push(`Invalid type "${item.type}". Must be one of: ${validTypes.join(', ')}`);
  }

  // Quantity
  if (item.type !== 'subcontractor' && item.type !== 'equipment') {
    if (item.quantity !== undefined && item.quantity < 0) {
      errors.push('Quantity cannot be negative');
    }
    if (item.quantity === 0) {
      warnings.push('Quantity is zero');
    }
  }

  // Unit Price
  if (item.unitPrice !== undefined && item.unitPrice < 0) {
    errors.push('Unit price cannot be negative');
  }

  // Labor Rate
  if (item.laborRate !== undefined && item.laborRate < 0) {
    errors.push('Labor rate cannot be negative');
  }
  if (item.laborRate !== undefined && item.laborRate > 250) {
    warnings.push(`Labor rate $${item.laborRate}/hr is unusually high`);
  }

  // Labor Hours
  if (item.laborHours !== undefined && item.laborHours < 0) {
    errors.push('Labor hours cannot be negative');
  }

  // Waste Factor
  if (item.wasteFactor !== undefined) {
    if (item.wasteFactor < 0) {
      errors.push('Waste factor cannot be negative');
    }
    if (item.wasteFactor > 0.30) {
      warnings.push(`Waste factor ${(item.wasteFactor * 100).toFixed(0)}% exceeds 30% — verify this is intentional`);
    }
  }

  // Productivity Rate
  if (item.productivityRate !== undefined && item.productivityRate <= 0) {
    errors.push('Productivity rate must be greater than zero');
  }

  // Crew Size
  if (item.crewSize !== undefined && item.crewSize < 1) {
    errors.push('Crew size must be at least 1');
  }

  // Subcontractor bid
  if (item.type === 'subcontractor' && item.subBid < 0) {
    errors.push('Subcontractor bid cannot be negative');
  }

  // Equipment
  if (item.type === 'equipment') {
    if (item.equipmentDailyRate < 0) errors.push('Equipment daily rate cannot be negative');
    if (item.equipmentDays < 0) errors.push('Equipment days cannot be negative');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate markup configuration
 */
export function validateMarkupConfig(config) {
  const errors = [];
  const warnings = [];

  if (config.overheadRate < 0) errors.push('Overhead rate cannot be negative');
  if (config.profitRate < 0) errors.push('Profit rate cannot be negative');

  const totalMarkup = (config.overheadRate || 0) + (config.profitRate || 0);
  if (totalMarkup > 0.50) {
    warnings.push(`Combined markup of ${(totalMarkup * 100).toFixed(1)}% exceeds 50% — this may be above market rates`);
  }
  if (totalMarkup < 0.10) {
    warnings.push(`Combined markup of ${(totalMarkup * 100).toFixed(1)}% is below 10% — ensure this covers your costs`);
  }

  return { valid: errors.length === 0, errors, warnings };
}

/**
 * Validate tax rate
 */
export function validateTaxRate(rate, state = '') {
  const warnings = [];
  if (rate < 0) return { valid: false, errors: ['Tax rate cannot be negative'], warnings: [] };
  if (rate > 0.12) {
    warnings.push(`Tax rate of ${(rate * 100).toFixed(2)}% is unusually high — verify with local tax authority`);
  }
  return { valid: true, errors: [], warnings };
}
