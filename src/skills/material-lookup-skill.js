/**
 * /estimate-material Skill - Material Cost Lookup
 *
 * Provides material search, pricing, and quantity calculation capabilities.
 * Usage: /estimate-material [search-term]
 */

import { searchMaterials, getMaterialsByCategory, getCategories, MATERIALS_CATALOG } from '../data/materials-catalog.js';
import { formatCurrency } from '../utils/helpers.js';
import { DEFAULTS } from '../data/defaults.js';

/**
 * Search for materials by keyword
 */
export function lookupMaterial(query) {
  const results = searchMaterials(query);

  if (results.length === 0) {
    return {
      found: false,
      message: `No materials found matching "${query}".`,
      suggestions: getSuggestions(query),
    };
  }

  return {
    found: true,
    count: results.length,
    results: results.map(r => ({
      id: r.id,
      name: r.name,
      category: r.divisionName,
      unit: r.unit,
      unitPrice: r.unitPrice,
      formattedPrice: formatCurrency(r.unitPrice),
      wasteFactor: r.wasteFactor,
      wastePercent: `${(r.wasteFactor * 100).toFixed(0)}%`,
    })),
  };
}

/**
 * Calculate material cost with quantity and waste
 */
export function calculateMaterialCost(materialId, quantity, options = {}) {
  const results = searchMaterials(materialId);
  if (results.length === 0) {
    throw new Error(`Material not found: ${materialId}`);
  }

  const material = results[0];
  const wasteFactor = options.wasteFactor ?? material.wasteFactor;
  const unitPrice = options.unitPrice ?? material.unitPrice;
  const adjustedQty = quantity * (1 + wasteFactor);
  const totalCost = Math.round(adjustedQty * unitPrice * 100) / 100;

  return {
    material: material.name,
    originalQuantity: quantity,
    wasteFactor,
    wastePercent: `${(wasteFactor * 100).toFixed(0)}%`,
    adjustedQuantity: Math.round(adjustedQty * 100) / 100,
    unit: material.unit,
    unitPrice,
    totalCost,
    formattedTotal: formatCurrency(totalCost),
  };
}

/**
 * Calculate materials needed for common scenarios
 */
export const CALCULATORS = {
  /**
   * Calculate drywall materials for a room
   * @param {number} perimeter - Room perimeter in feet
   * @param {number} height - Wall height in feet (typically 8 or 9)
   * @param {number} openings - Number of standard openings (doors/windows) to subtract
   */
  drywallRoom(perimeter, height, openings = 0) {
    const wallArea = (perimeter * height) - (openings * 21); // ~21 sf per opening
    const sheetsNeeded = Math.ceil((wallArea * 1.10) / 32); // 4x8 sheets = 32sf, 10% waste
    const mudBuckets = Math.ceil(sheetsNeeded / 8); // 1 bucket per 8 sheets
    const tapeRolls = Math.ceil(sheetsNeeded / 15); // 1 roll per 15 sheets
    const screwBoxes = Math.ceil(sheetsNeeded / 30); // 1 box per 30 sheets

    return {
      description: `Drywall for room: ${perimeter}' perimeter x ${height}' height`,
      wallArea: Math.round(wallArea),
      materials: [
        { item: 'Drywall 1/2" (4x8)', quantity: sheetsNeeded, unit: 'sheets', unitPrice: 12.50, total: sheetsNeeded * 12.50 },
        { item: 'Joint Compound (5 gal)', quantity: mudBuckets, unit: 'buckets', unitPrice: 15.00, total: mudBuckets * 15.00 },
        { item: 'Drywall Tape', quantity: tapeRolls, unit: 'rolls', unitPrice: 5.50, total: tapeRolls * 5.50 },
        { item: 'Drywall Screws (5lb)', quantity: screwBoxes, unit: 'boxes', unitPrice: 18.00, total: screwBoxes * 18.00 },
      ],
      totalMaterialCost: Math.round((sheetsNeeded * 12.50 + mudBuckets * 15.00 + tapeRolls * 5.50 + screwBoxes * 18.00) * 100) / 100,
    };
  },

  /**
   * Calculate paint needed for a room
   * @param {number} wallArea - Total wall area in square feet
   * @param {number} coats - Number of coats
   * @param {boolean} includePrimer - Whether to include primer
   */
  paintRoom(wallArea, coats = 2, includePrimer = true) {
    const coveragePerGal = 350; // sf per gallon
    const paintGallons = Math.ceil((wallArea * coats) / coveragePerGal);
    const primerGallons = includePrimer ? Math.ceil(wallArea / coveragePerGal) : 0;
    const caulkTubes = Math.ceil(wallArea / 200);

    return {
      description: `Paint for ${wallArea} SF (${coats} coats${includePrimer ? ' + primer' : ''})`,
      materials: [
        ...(includePrimer ? [{ item: 'Interior Primer', quantity: primerGallons, unit: 'gallons', unitPrice: 25.00, total: primerGallons * 25.00 }] : []),
        { item: 'Interior Paint', quantity: paintGallons, unit: 'gallons', unitPrice: 38.00, total: paintGallons * 38.00 },
        { item: 'Paintable Caulk', quantity: caulkTubes, unit: 'tubes', unitPrice: 4.50, total: caulkTubes * 4.50 },
      ],
      totalMaterialCost: Math.round(((includePrimer ? primerGallons * 25.00 : 0) + paintGallons * 38.00 + caulkTubes * 4.50) * 100) / 100,
    };
  },

  /**
   * Calculate roofing materials
   * @param {number} roofArea - Roof area in square feet
   * @param {string} type - 'architectural' or '3tab' or 'metal'
   */
  roofing(roofArea, type = 'architectural') {
    const squares = roofArea / 100;
    const materials = [];

    if (type === 'metal') {
      materials.push(
        { item: 'Standing Seam Metal Roof', quantity: Math.round(roofArea * 1.10), unit: 'sf', unitPrice: 3.75, total: Math.round(roofArea * 1.10) * 3.75 },
        { item: 'Synthetic Underlayment', quantity: Math.ceil(squares / 10), unit: 'rolls', unitPrice: 85.00, total: Math.ceil(squares / 10) * 85.00 },
      );
    } else {
      const shinglePrice = type === 'architectural' ? 95.00 : 72.00;
      const shingleName = type === 'architectural' ? 'Architectural Shingles (30yr)' : '3-Tab Shingles (25yr)';
      materials.push(
        { item: shingleName, quantity: Math.ceil(squares * 1.15), unit: 'squares', unitPrice: shinglePrice, total: Math.ceil(squares * 1.15) * shinglePrice },
        { item: 'Synthetic Underlayment', quantity: Math.ceil(squares / 10), unit: 'rolls', unitPrice: 85.00, total: Math.ceil(squares / 10) * 85.00 },
        { item: 'Roofing Nails (Coil)', quantity: Math.ceil(squares / 5), unit: 'boxes', unitPrice: 45.00, total: Math.ceil(squares / 5) * 45.00 },
      );
    }

    const ridgeLength = Math.sqrt(roofArea) * 0.5; // rough estimate
    materials.push(
      { item: 'Ice & Water Shield', quantity: Math.ceil(squares / 15), unit: 'rolls', unitPrice: 55.00, total: Math.ceil(squares / 15) * 55.00 },
      { item: 'Drip Edge', quantity: Math.ceil(Math.sqrt(roofArea) * 2.5), unit: 'lf', unitPrice: 1.25, total: Math.ceil(Math.sqrt(roofArea) * 2.5) * 1.25 },
      { item: 'Ridge Vent', quantity: Math.ceil(ridgeLength), unit: 'lf', unitPrice: 3.50, total: Math.ceil(ridgeLength) * 3.50 },
    );

    const totalCost = materials.reduce((sum, m) => sum + m.total, 0);

    return {
      description: `Roofing materials for ${roofArea} SF (${type})`,
      squares: Math.round(squares * 100) / 100,
      materials,
      totalMaterialCost: Math.round(totalCost * 100) / 100,
    };
  },

  /**
   * Calculate flooring materials
   * @param {number} area - Floor area in square feet
   * @param {string} type - 'hardwood', 'lvp', 'laminate', 'tile', 'carpet'
   */
  flooring(area, type = 'lvp') {
    const priceMap = {
      hardwood: { name: 'Red Oak Hardwood 3/4"', price: 5.50, waste: 0.10, unit: 'sf' },
      lvp: { name: 'Luxury Vinyl Plank', price: 3.25, waste: 0.10, unit: 'sf' },
      laminate: { name: 'Laminate Flooring 12mm', price: 2.50, waste: 0.10, unit: 'sf' },
      tile: { name: 'Porcelain Tile 12x24', price: 4.50, waste: 0.15, unit: 'sf' },
      carpet: { name: 'Carpet Mid-Grade (w/ pad)', price: 32.00, waste: 0.10, unit: 'sy' },
    };

    const spec = priceMap[type] || priceMap.lvp;
    const qty = type === 'carpet' ? area / 9 : area;
    const adjustedQty = Math.ceil(qty * (1 + spec.waste));
    const materials = [
      { item: spec.name, quantity: adjustedQty, unit: spec.unit, unitPrice: spec.price, total: Math.round(adjustedQty * spec.price * 100) / 100 },
    ];

    if (['lvp', 'laminate'].includes(type)) {
      const underlayRolls = Math.ceil(area / 200);
      materials.push({ item: 'Floor Underlayment', quantity: underlayRolls, unit: 'rolls', unitPrice: 28.00, total: underlayRolls * 28.00 });
    }

    if (type === 'tile') {
      const thinsetBags = Math.ceil(area / 50);
      const groutBags = Math.ceil(area / 100);
      materials.push(
        { item: 'Thinset Mortar (50lb)', quantity: thinsetBags, unit: 'bags', unitPrice: 18.00, total: thinsetBags * 18.00 },
        { item: 'Grout (25lb)', quantity: groutBags, unit: 'bags', unitPrice: 15.00, total: groutBags * 15.00 },
      );
    }

    const totalCost = materials.reduce((sum, m) => sum + m.total, 0);

    return {
      description: `${spec.name} for ${area} SF`,
      materials,
      totalMaterialCost: Math.round(totalCost * 100) / 100,
    };
  },

  /**
   * Calculate framing materials for a wall
   * @param {number} length - Wall length in feet
   * @param {number} height - Wall height in feet
   * @param {boolean} exterior - Whether it's an exterior wall (2x6 vs 2x4)
   */
  wallFraming(length, height, exterior = false) {
    const studSpacing = 16; // inches OC
    const numStuds = Math.ceil((length * 12) / studSpacing) + 1;
    const topBottomPlates = Math.ceil(length / (exterior ? 10 : 8)) * 3; // double top + single bottom
    const studSize = exterior ? '2x6' : '2x4';
    const studPrice = exterior ? 7.85 : 5.25;
    const platePrice = exterior ? 7.85 : 5.25;
    const sheathingSheets = exterior ? Math.ceil((length * height * 1.10) / 32) : 0;

    const materials = [
      { item: `${studSize}x${height === 9 ? '10' : '8'} Studs`, quantity: Math.ceil(numStuds * 1.10), unit: 'ea', unitPrice: studPrice, total: Math.ceil(numStuds * 1.10) * studPrice },
      { item: `${studSize}x10 Plates`, quantity: topBottomPlates, unit: 'ea', unitPrice: platePrice, total: topBottomPlates * platePrice },
      { item: 'Framing Nails 16d', quantity: Math.ceil(numStuds / 30), unit: 'boxes', unitPrice: 12.00, total: Math.ceil(numStuds / 30) * 12.00 },
    ];

    if (exterior) {
      materials.push(
        { item: 'OSB Sheathing 7/16"', quantity: sheathingSheets, unit: 'sheets', unitPrice: 14.50, total: sheathingSheets * 14.50 },
      );
    }

    const totalCost = materials.reduce((sum, m) => sum + m.total, 0);

    return {
      description: `${exterior ? 'Exterior' : 'Interior'} wall framing: ${length}' x ${height}'`,
      studCount: numStuds,
      materials,
      totalMaterialCost: Math.round(totalCost * 100) / 100,
    };
  },

  /**
   * Calculate concrete for a slab
   * @param {number} length - Slab length in feet
   * @param {number} width - Slab width in feet
   * @param {number} thickness - Slab thickness in inches
   */
  concreteSlab(length, width, thickness = 4) {
    const cubicFeet = length * width * (thickness / 12);
    const cubicYards = Math.ceil((cubicFeet / 27) * 1.05); // 5% waste
    const area = length * width;
    const perimeter = 2 * (length + width);
    const wwmSheets = Math.ceil(area / 32 * 1.10);
    const gravelTons = Math.ceil((area * (4 / 12) * 110) / 2000); // 4" base, 110 lb/cf

    const materials = [
      { item: 'Ready-Mix Concrete 3000 PSI', quantity: cubicYards, unit: 'cy', unitPrice: 145.00, total: cubicYards * 145.00 },
      { item: 'Welded Wire Mesh', quantity: wwmSheets, unit: 'sheets', unitPrice: 8.50, total: wwmSheets * 8.50 },
      { item: 'Vapor Barrier 10mil', quantity: Math.ceil(area * 1.10), unit: 'sf', unitPrice: 0.08, total: Math.ceil(area * 1.10) * 0.08 },
      { item: 'Gravel Base Material', quantity: gravelTons, unit: 'tons', unitPrice: 28.00, total: gravelTons * 28.00 },
      { item: 'Expansion Joint Material', quantity: Math.ceil(perimeter), unit: 'lf', unitPrice: 1.25, total: Math.ceil(perimeter) * 1.25 },
      { item: 'Forming Lumber', quantity: Math.ceil(perimeter / 8), unit: 'ea', unitPrice: 6.75, total: Math.ceil(perimeter / 8) * 6.75 },
    ];

    const totalCost = materials.reduce((sum, m) => sum + m.total, 0);

    return {
      description: `Concrete slab: ${length}' x ${width}' x ${thickness}"`,
      area,
      cubicYards,
      materials,
      totalMaterialCost: Math.round(totalCost * 100) / 100,
    };
  },
};

function getSuggestions(query) {
  const categories = getCategories();
  return categories.map(c => `Try searching by category: "${c.divisionName}" or "${c.key}"`).slice(0, 5);
}

export default {
  lookupMaterial,
  calculateMaterialCost,
  CALCULATORS,
};
