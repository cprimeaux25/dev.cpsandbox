/**
 * Construction Estimating Plugin - Main Entry Point
 *
 * Exports all modules for use as a plugin or library.
 */

// Core Engine
export { EstimateEngine } from './engine/estimate-engine.js';
export { default as MarkupCalculator } from './engine/markup-calculator.js';

// Data
export { MATERIALS_CATALOG, searchMaterials, getMaterialsByCategory, getCategories } from './data/materials-catalog.js';
export { LABOR_RATES, CREW_COMPOSITIONS, getTrades, calculateLaborHours, calculateBurdenedRate, getLaborRate } from './data/labor-rates.js';
export { EQUIPMENT_RATES, calculateEquipmentCost, getEquipmentList } from './data/equipment-rates.js';
export { DEFAULTS } from './data/defaults.js';

// Reports
export { generateDetailedReport, generateProposalSummary, generateCategorySummary, generateComparisonReport } from './reports/report-generator.js';

// Validation
export { validateEstimate, validateLineItem, validateMarkupConfig, validateTaxRate } from './utils/validator.js';

// Utilities
export { generateId, roundCurrency, formatCurrency, formatPercentage, formatDate, unitFullName, deepClone } from './utils/helpers.js';

// Skills
export { default as EstimateSkill } from './skills/estimate-skill.js';
export { default as MaterialLookupSkill } from './skills/material-lookup-skill.js';
export { default as LaborSkill } from './skills/labor-skill.js';
export { default as MarkupSkill } from './skills/markup-skill.js';

// Templates
export { RESIDENTIAL_REMODEL_TEMPLATE, KITCHEN_REMODEL_TEMPLATE, BATHROOM_REMODEL_TEMPLATE } from '../templates/residential-remodel.js';
export { NEW_CONSTRUCTION_TEMPLATE, COMMERCIAL_TENANT_IMPROVEMENT } from '../templates/new-construction.js';
