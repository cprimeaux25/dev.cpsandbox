/**
 * /estimate-template Skill - Template Management
 *
 * Load, save, and manage estimate templates for common project types.
 * Usage: /estimate-template [template-name]
 */

import { RESIDENTIAL_REMODEL_TEMPLATE, KITCHEN_REMODEL_TEMPLATE, BATHROOM_REMODEL_TEMPLATE } from '../../templates/residential-remodel.js';
import { NEW_CONSTRUCTION_TEMPLATE, COMMERCIAL_TENANT_IMPROVEMENT } from '../../templates/new-construction.js';

const BUILT_IN_TEMPLATES = {
  'residential-remodel': RESIDENTIAL_REMODEL_TEMPLATE,
  'kitchen-remodel': KITCHEN_REMODEL_TEMPLATE,
  'bathroom-remodel': BATHROOM_REMODEL_TEMPLATE,
  'new-construction': NEW_CONSTRUCTION_TEMPLATE,
  'commercial-ti': COMMERCIAL_TENANT_IMPROVEMENT,
};

/**
 * List all available templates
 */
export function listTemplates() {
  return Object.entries(BUILT_IN_TEMPLATES).map(([key, template]) => ({
    key,
    name: template.name,
    description: template.description,
    categoryCount: template.categories?.length || 0,
    markupMethod: template.config?.markupMethod || 'cost-plus',
    overheadRate: template.config?.overheadRate || 0,
    profitRate: template.config?.profitRate || 0,
  }));
}

/**
 * Get a specific template
 */
export function getTemplate(templateKey) {
  const template = BUILT_IN_TEMPLATES[templateKey];
  if (!template) {
    return {
      found: false,
      message: `Template not found: "${templateKey}"`,
      available: Object.keys(BUILT_IN_TEMPLATES),
    };
  }

  return {
    found: true,
    template,
  };
}

/**
 * Apply a template to an estimate
 */
export function applyTemplateToEstimate(engine, estimate, templateKey) {
  const result = getTemplate(templateKey);
  if (!result.found) {
    throw new Error(result.message);
  }

  const template = result.template;

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

  return {
    applied: true,
    templateName: template.name,
    categoriesAdded: template.categories?.length || 0,
    config: estimate.config,
  };
}

/**
 * Create a template from an existing estimate
 */
export function createTemplateFromEstimate(estimate, templateName, description) {
  return {
    name: templateName,
    description: description || `Template created from ${estimate.projectName}`,
    config: { ...estimate.config },
    categories: estimate.categories.map(c => ({
      name: c.name,
      csiCode: c.csiCode,
      description: c.description,
    })),
    exclusions: [...(estimate.exclusions || [])],
    inclusions: [...(estimate.inclusions || [])],
  };
}

export default {
  listTemplates,
  getTemplate,
  applyTemplateToEstimate,
  createTemplateFromEstimate,
};
