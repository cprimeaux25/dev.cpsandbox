/**
 * Materials Cost Database / Catalog
 * Comprehensive material pricing organized by CSI division and category.
 * Prices are average US market rates and should be adjusted for local conditions.
 */

export const MATERIALS_CATALOG = {
  // =========================================================================
  // DIVISION 03 - CONCRETE
  // =========================================================================
  concrete: {
    division: '03',
    divisionName: 'Concrete',
    items: [
      { id: 'conc-3000', name: 'Ready-Mix Concrete 3000 PSI', unit: 'cy', unitPrice: 145.00, wasteFactor: 0.05 },
      { id: 'conc-4000', name: 'Ready-Mix Concrete 4000 PSI', unit: 'cy', unitPrice: 155.00, wasteFactor: 0.05 },
      { id: 'conc-5000', name: 'Ready-Mix Concrete 5000 PSI', unit: 'cy', unitPrice: 170.00, wasteFactor: 0.05 },
      { id: 'rebar-3', name: 'Rebar #3 (3/8")', unit: 'lf', unitPrice: 0.45, wasteFactor: 0.05 },
      { id: 'rebar-4', name: 'Rebar #4 (1/2")', unit: 'lf', unitPrice: 0.65, wasteFactor: 0.05 },
      { id: 'rebar-5', name: 'Rebar #5 (5/8")', unit: 'lf', unitPrice: 0.95, wasteFactor: 0.05 },
      { id: 'wwm-6x6', name: 'Welded Wire Mesh 6x6-W1.4xW1.4', unit: 'sht', unitPrice: 8.50, wasteFactor: 0.10 },
      { id: 'form-ply', name: 'Forming Plywood (3/4" BB)', unit: 'sht', unitPrice: 42.00, wasteFactor: 0.15 },
      { id: 'form-tube-8', name: 'Sonotube 8" Diameter', unit: 'lf', unitPrice: 3.25, wasteFactor: 0.05 },
      { id: 'form-tube-12', name: 'Sonotube 12" Diameter', unit: 'lf', unitPrice: 5.50, wasteFactor: 0.05 },
      { id: 'anchor-bolt', name: 'Anchor Bolt 1/2" x 10"', unit: 'ea', unitPrice: 1.85, wasteFactor: 0.02 },
      { id: 'vapor-barrier', name: 'Vapor Barrier 10mil Poly', unit: 'sf', unitPrice: 0.08, wasteFactor: 0.10 },
      { id: 'expansion-joint', name: 'Expansion Joint Material 1/2"', unit: 'lf', unitPrice: 1.25, wasteFactor: 0.05 },
      { id: 'gravel-base', name: 'Gravel Base Material', unit: 'ton', unitPrice: 28.00, wasteFactor: 0.10 },
      { id: 'conc-sealer', name: 'Concrete Sealer', unit: 'gal', unitPrice: 32.00, wasteFactor: 0.05 },
    ],
  },

  // =========================================================================
  // DIVISION 05 - METALS / STRUCTURAL STEEL
  // =========================================================================
  metals: {
    division: '05',
    divisionName: 'Metals',
    items: [
      { id: 'steel-beam-w8', name: 'Steel W8x31 Beam', unit: 'lf', unitPrice: 32.50, wasteFactor: 0.03 },
      { id: 'steel-beam-w10', name: 'Steel W10x49 Beam', unit: 'lf', unitPrice: 52.00, wasteFactor: 0.03 },
      { id: 'steel-col-4x4', name: 'Steel Column 4x4 Tube', unit: 'lf', unitPrice: 18.75, wasteFactor: 0.03 },
      { id: 'steel-angle', name: 'Steel Angle 3x3x1/4"', unit: 'lf', unitPrice: 4.25, wasteFactor: 0.05 },
      { id: 'steel-plate', name: 'Steel Plate 1/2"', unit: 'sf', unitPrice: 22.00, wasteFactor: 0.05 },
      { id: 'joist-hanger', name: 'Joist Hanger 2x10', unit: 'ea', unitPrice: 3.25, wasteFactor: 0.02 },
      { id: 'simpson-a35', name: 'Simpson A35 Framing Clip', unit: 'ea', unitPrice: 1.45, wasteFactor: 0.02 },
      { id: 'deck-post-base', name: 'Post Base (Simpson ABU)', unit: 'ea', unitPrice: 12.50, wasteFactor: 0.02 },
    ],
  },

  // =========================================================================
  // DIVISION 06 - WOOD / PLASTICS / COMPOSITES (FRAMING)
  // =========================================================================
  framing: {
    division: '06',
    divisionName: 'Wood, Plastics & Composites',
    items: [
      { id: '2x4-8-spf', name: '2x4x8 SPF Stud', unit: 'ea', unitPrice: 3.85, wasteFactor: 0.10 },
      { id: '2x4-10-spf', name: '2x4x10 SPF', unit: 'ea', unitPrice: 5.25, wasteFactor: 0.10 },
      { id: '2x4-12-spf', name: '2x4x12 SPF', unit: 'ea', unitPrice: 6.75, wasteFactor: 0.10 },
      { id: '2x6-8-spf', name: '2x6x8 SPF', unit: 'ea', unitPrice: 5.95, wasteFactor: 0.10 },
      { id: '2x6-10-spf', name: '2x6x10 SPF', unit: 'ea', unitPrice: 7.85, wasteFactor: 0.10 },
      { id: '2x6-12-spf', name: '2x6x12 SPF', unit: 'ea', unitPrice: 9.50, wasteFactor: 0.10 },
      { id: '2x8-12-spf', name: '2x8x12 SPF', unit: 'ea', unitPrice: 12.50, wasteFactor: 0.10 },
      { id: '2x10-12-spf', name: '2x10x12 SPF', unit: 'ea', unitPrice: 16.00, wasteFactor: 0.10 },
      { id: '2x12-12-spf', name: '2x12x12 SPF', unit: 'ea', unitPrice: 22.00, wasteFactor: 0.10 },
      { id: 'lvl-1.75x9.5', name: 'LVL 1-3/4"x9-1/2"', unit: 'lf', unitPrice: 5.50, wasteFactor: 0.05 },
      { id: 'lvl-1.75x11.875', name: 'LVL 1-3/4"x11-7/8"', unit: 'lf', unitPrice: 7.00, wasteFactor: 0.05 },
      { id: 'glulam-3.125x9', name: 'Glulam 3-1/8"x9"', unit: 'lf', unitPrice: 12.50, wasteFactor: 0.05 },
      { id: 'tji-11.875', name: 'TJI 11-7/8" I-Joist', unit: 'lf', unitPrice: 4.75, wasteFactor: 0.05 },
      { id: 'tji-14', name: 'TJI 14" I-Joist', unit: 'lf', unitPrice: 5.50, wasteFactor: 0.05 },
      { id: 'osb-7/16', name: 'OSB Sheathing 7/16"', unit: 'sht', unitPrice: 14.50, wasteFactor: 0.10 },
      { id: 'osb-3/4', name: 'OSB Sheathing 3/4" T&G', unit: 'sht', unitPrice: 28.00, wasteFactor: 0.10 },
      { id: 'plywood-1/2-cdx', name: 'Plywood 1/2" CDX', unit: 'sht', unitPrice: 32.00, wasteFactor: 0.10 },
      { id: 'plywood-3/4-cdx', name: 'Plywood 3/4" CDX', unit: 'sht', unitPrice: 45.00, wasteFactor: 0.10 },
      { id: 'pt-2x6-12', name: 'Pressure Treated 2x6x12', unit: 'ea', unitPrice: 14.50, wasteFactor: 0.10 },
      { id: 'pt-4x4-8', name: 'Pressure Treated 4x4x8', unit: 'ea', unitPrice: 12.00, wasteFactor: 0.05 },
      { id: 'pt-6x6-10', name: 'Pressure Treated 6x6x10', unit: 'ea', unitPrice: 38.00, wasteFactor: 0.05 },
    ],
  },

  // =========================================================================
  // DIVISION 07 - THERMAL & MOISTURE PROTECTION
  // =========================================================================
  roofingInsulation: {
    division: '07',
    divisionName: 'Thermal & Moisture Protection',
    items: [
      // Roofing
      { id: 'arch-shingle', name: 'Architectural Shingles (30yr)', unit: 'sq', unitPrice: 95.00, wasteFactor: 0.15 },
      { id: '3tab-shingle', name: '3-Tab Shingles (25yr)', unit: 'sq', unitPrice: 72.00, wasteFactor: 0.15 },
      { id: 'metal-roof-29ga', name: 'Standing Seam Metal Roof 29ga', unit: 'sf', unitPrice: 3.75, wasteFactor: 0.10 },
      { id: 'ice-water-shield', name: 'Ice & Water Shield', unit: 'roll', unitPrice: 55.00, wasteFactor: 0.10 },
      { id: 'felt-15', name: '15# Roofing Felt', unit: 'roll', unitPrice: 22.00, wasteFactor: 0.10 },
      { id: 'synth-underlay', name: 'Synthetic Underlayment', unit: 'roll', unitPrice: 85.00, wasteFactor: 0.10 },
      { id: 'ridge-vent', name: 'Ridge Vent', unit: 'lf', unitPrice: 3.50, wasteFactor: 0.05 },
      { id: 'drip-edge', name: 'Drip Edge Aluminum', unit: 'lf', unitPrice: 1.25, wasteFactor: 0.05 },
      { id: 'step-flash', name: 'Step Flashing', unit: 'ea', unitPrice: 0.85, wasteFactor: 0.10 },
      { id: 'roof-nails', name: 'Roofing Nails (Coil)', unit: 'box', unitPrice: 45.00, wasteFactor: 0.05 },
      // Insulation
      { id: 'batt-r13', name: 'Fiberglass Batt R-13 (3.5")', unit: 'sf', unitPrice: 0.55, wasteFactor: 0.05 },
      { id: 'batt-r19', name: 'Fiberglass Batt R-19 (6.25")', unit: 'sf', unitPrice: 0.72, wasteFactor: 0.05 },
      { id: 'batt-r30', name: 'Fiberglass Batt R-30 (10")', unit: 'sf', unitPrice: 1.10, wasteFactor: 0.05 },
      { id: 'batt-r38', name: 'Fiberglass Batt R-38 (12")', unit: 'sf', unitPrice: 1.35, wasteFactor: 0.05 },
      { id: 'blown-cellulose', name: 'Blown Cellulose Insulation', unit: 'bag', unitPrice: 12.50, wasteFactor: 0.10 },
      { id: 'spray-foam-oc', name: 'Spray Foam Open Cell (per BF)', unit: 'bf', unitPrice: 0.45, wasteFactor: 0.05 },
      { id: 'spray-foam-cc', name: 'Spray Foam Closed Cell (per BF)', unit: 'bf', unitPrice: 1.25, wasteFactor: 0.05 },
      { id: 'rigid-foam-1', name: 'Rigid Foam XPS 1"', unit: 'sht', unitPrice: 22.00, wasteFactor: 0.10 },
      { id: 'rigid-foam-2', name: 'Rigid Foam XPS 2"', unit: 'sht', unitPrice: 38.00, wasteFactor: 0.10 },
      { id: 'house-wrap', name: 'House Wrap (Tyvek)', unit: 'roll', unitPrice: 155.00, wasteFactor: 0.10 },
    ],
  },

  // =========================================================================
  // DIVISION 08 - OPENINGS (DOORS & WINDOWS)
  // =========================================================================
  openings: {
    division: '08',
    divisionName: 'Openings',
    items: [
      { id: 'ext-door-steel', name: 'Exterior Steel Door 36" (prehung)', unit: 'ea', unitPrice: 285.00, wasteFactor: 0.0 },
      { id: 'ext-door-fiber', name: 'Exterior Fiberglass Door 36" (prehung)', unit: 'ea', unitPrice: 425.00, wasteFactor: 0.0 },
      { id: 'int-door-hollow', name: 'Interior Hollow Core Door 32" (prehung)', unit: 'ea', unitPrice: 85.00, wasteFactor: 0.0 },
      { id: 'int-door-solid', name: 'Interior Solid Core Door 32" (prehung)', unit: 'ea', unitPrice: 165.00, wasteFactor: 0.0 },
      { id: 'bi-fold-36', name: 'Bi-Fold Door 36"', unit: 'ea', unitPrice: 95.00, wasteFactor: 0.0 },
      { id: 'pocket-door', name: 'Pocket Door 32" (frame + door)', unit: 'ea', unitPrice: 175.00, wasteFactor: 0.0 },
      { id: 'slider-6', name: 'Sliding Glass Door 6\' (vinyl)', unit: 'ea', unitPrice: 650.00, wasteFactor: 0.0 },
      { id: 'garage-door-16', name: 'Garage Door 16\'x7\' (steel insulated)', unit: 'ea', unitPrice: 1250.00, wasteFactor: 0.0 },
      { id: 'window-dh-3x4', name: 'Double Hung Window 3\'x4\' (vinyl)', unit: 'ea', unitPrice: 285.00, wasteFactor: 0.0 },
      { id: 'window-dh-3x5', name: 'Double Hung Window 3\'x5\' (vinyl)', unit: 'ea', unitPrice: 325.00, wasteFactor: 0.0 },
      { id: 'window-case-2x4', name: 'Casement Window 2\'x4\' (vinyl)', unit: 'ea', unitPrice: 310.00, wasteFactor: 0.0 },
      { id: 'window-pic-5x4', name: 'Picture Window 5\'x4\' (vinyl)', unit: 'ea', unitPrice: 425.00, wasteFactor: 0.0 },
      { id: 'skylight-2x4', name: 'Skylight 2\'x4\' (fixed)', unit: 'ea', unitPrice: 450.00, wasteFactor: 0.0 },
    ],
  },

  // =========================================================================
  // DIVISION 09 - FINISHES
  // =========================================================================
  finishes: {
    division: '09',
    divisionName: 'Finishes',
    items: [
      // Drywall
      { id: 'drywall-1/2', name: 'Drywall 1/2" (4x8)', unit: 'sht', unitPrice: 12.50, wasteFactor: 0.10 },
      { id: 'drywall-5/8', name: 'Drywall 5/8" Fire-Rated (4x8)', unit: 'sht', unitPrice: 15.50, wasteFactor: 0.10 },
      { id: 'drywall-mold', name: 'Mold Resistant Drywall 1/2" (4x8)', unit: 'sht', unitPrice: 16.00, wasteFactor: 0.10 },
      { id: 'joint-compound', name: 'Joint Compound (5 gal)', unit: 'ea', unitPrice: 15.00, wasteFactor: 0.05 },
      { id: 'drywall-tape', name: 'Drywall Tape (500\')', unit: 'roll', unitPrice: 5.50, wasteFactor: 0.05 },
      { id: 'corner-bead', name: 'Corner Bead Metal 8\'', unit: 'ea', unitPrice: 2.75, wasteFactor: 0.05 },
      // Paint
      { id: 'primer-int', name: 'Interior Primer (gal)', unit: 'gal', unitPrice: 25.00, wasteFactor: 0.05 },
      { id: 'paint-int-flat', name: 'Interior Paint Flat (gal)', unit: 'gal', unitPrice: 35.00, wasteFactor: 0.05 },
      { id: 'paint-int-satin', name: 'Interior Paint Satin (gal)', unit: 'gal', unitPrice: 38.00, wasteFactor: 0.05 },
      { id: 'paint-int-semi', name: 'Interior Paint Semi-Gloss (gal)', unit: 'gal', unitPrice: 40.00, wasteFactor: 0.05 },
      { id: 'paint-ext', name: 'Exterior Paint (gal)', unit: 'gal', unitPrice: 45.00, wasteFactor: 0.05 },
      { id: 'caulk-paint', name: 'Paintable Caulk', unit: 'ea', unitPrice: 4.50, wasteFactor: 0.05 },
      // Flooring
      { id: 'hardwood-oak', name: 'Red Oak Hardwood 3/4"x3-1/4"', unit: 'sf', unitPrice: 5.50, wasteFactor: 0.10 },
      { id: 'lvp-click', name: 'Luxury Vinyl Plank (Click Lock)', unit: 'sf', unitPrice: 3.25, wasteFactor: 0.10 },
      { id: 'laminate-12mm', name: 'Laminate Flooring 12mm', unit: 'sf', unitPrice: 2.50, wasteFactor: 0.10 },
      { id: 'carpet-mid', name: 'Carpet Mid-Grade (w/ pad)', unit: 'sy', unitPrice: 32.00, wasteFactor: 0.10 },
      { id: 'tile-ceramic-12', name: 'Ceramic Tile 12x12', unit: 'sf', unitPrice: 2.75, wasteFactor: 0.15 },
      { id: 'tile-porcelain-12', name: 'Porcelain Tile 12x24', unit: 'sf', unitPrice: 4.50, wasteFactor: 0.15 },
      { id: 'tile-thinset', name: 'Thinset Mortar (50lb)', unit: 'bag', unitPrice: 18.00, wasteFactor: 0.05 },
      { id: 'tile-grout', name: 'Grout (25lb)', unit: 'bag', unitPrice: 15.00, wasteFactor: 0.05 },
      { id: 'underlayment', name: 'Floor Underlayment Foam', unit: 'roll', unitPrice: 28.00, wasteFactor: 0.05 },
      // Trim
      { id: 'baseboard-mdf', name: 'MDF Baseboard 3-1/4" (primed)', unit: 'lf', unitPrice: 1.25, wasteFactor: 0.10 },
      { id: 'casing-mdf', name: 'MDF Door/Window Casing 2-1/4" (primed)', unit: 'lf', unitPrice: 0.95, wasteFactor: 0.10 },
      { id: 'crown-mdf', name: 'MDF Crown Molding 3-5/8" (primed)', unit: 'lf', unitPrice: 1.85, wasteFactor: 0.10 },
    ],
  },

  // =========================================================================
  // DIVISION 22 - PLUMBING
  // =========================================================================
  plumbing: {
    division: '22',
    divisionName: 'Plumbing',
    items: [
      { id: 'pvc-1.5', name: 'PVC Pipe 1-1/2" DWV', unit: 'lf', unitPrice: 2.50, wasteFactor: 0.03 },
      { id: 'pvc-2', name: 'PVC Pipe 2" DWV', unit: 'lf', unitPrice: 3.25, wasteFactor: 0.03 },
      { id: 'pvc-3', name: 'PVC Pipe 3" DWV', unit: 'lf', unitPrice: 5.00, wasteFactor: 0.03 },
      { id: 'pvc-4', name: 'PVC Pipe 4" DWV', unit: 'lf', unitPrice: 7.50, wasteFactor: 0.03 },
      { id: 'pex-1/2', name: 'PEX Tubing 1/2"', unit: 'lf', unitPrice: 0.85, wasteFactor: 0.05 },
      { id: 'pex-3/4', name: 'PEX Tubing 3/4"', unit: 'lf', unitPrice: 1.25, wasteFactor: 0.05 },
      { id: 'copper-1/2', name: 'Copper Pipe 1/2" Type L', unit: 'lf', unitPrice: 4.50, wasteFactor: 0.05 },
      { id: 'copper-3/4', name: 'Copper Pipe 3/4" Type L', unit: 'lf', unitPrice: 7.25, wasteFactor: 0.05 },
      { id: 'water-heater-50', name: 'Water Heater 50 Gal (Gas)', unit: 'ea', unitPrice: 850.00, wasteFactor: 0.0 },
      { id: 'water-heater-tank', name: 'Water Heater 40 Gal (Electric)', unit: 'ea', unitPrice: 650.00, wasteFactor: 0.0 },
      { id: 'toilet-std', name: 'Toilet (Standard)', unit: 'ea', unitPrice: 185.00, wasteFactor: 0.0 },
      { id: 'toilet-elong', name: 'Toilet (Elongated, Comfort Height)', unit: 'ea', unitPrice: 275.00, wasteFactor: 0.0 },
      { id: 'vanity-30', name: 'Bathroom Vanity 30" w/ Top', unit: 'ea', unitPrice: 350.00, wasteFactor: 0.0 },
      { id: 'vanity-48', name: 'Bathroom Vanity 48" w/ Top', unit: 'ea', unitPrice: 550.00, wasteFactor: 0.0 },
      { id: 'kitchen-sink', name: 'Kitchen Sink SS Double Bowl', unit: 'ea', unitPrice: 225.00, wasteFactor: 0.0 },
      { id: 'kitchen-faucet', name: 'Kitchen Faucet (Mid-Grade)', unit: 'ea', unitPrice: 175.00, wasteFactor: 0.0 },
      { id: 'shower-valve', name: 'Shower Valve Assembly', unit: 'ea', unitPrice: 125.00, wasteFactor: 0.0 },
      { id: 'tub-surround', name: 'Bathtub/Shower Combo (Fiberglass)', unit: 'ea', unitPrice: 425.00, wasteFactor: 0.0 },
    ],
  },

  // =========================================================================
  // DIVISION 26 - ELECTRICAL
  // =========================================================================
  electrical: {
    division: '26',
    divisionName: 'Electrical',
    items: [
      { id: 'nm-14/2', name: 'Romex NM-B 14/2 (250\')', unit: 'roll', unitPrice: 65.00, wasteFactor: 0.05 },
      { id: 'nm-12/2', name: 'Romex NM-B 12/2 (250\')', unit: 'roll', unitPrice: 85.00, wasteFactor: 0.05 },
      { id: 'nm-10/3', name: 'Romex NM-B 10/3 (100\')', unit: 'roll', unitPrice: 95.00, wasteFactor: 0.05 },
      { id: 'panel-200a', name: 'Main Panel 200A (40 space)', unit: 'ea', unitPrice: 350.00, wasteFactor: 0.0 },
      { id: 'panel-100a-sub', name: 'Sub Panel 100A (20 space)', unit: 'ea', unitPrice: 175.00, wasteFactor: 0.0 },
      { id: 'breaker-20a', name: 'Circuit Breaker 20A Single Pole', unit: 'ea', unitPrice: 8.50, wasteFactor: 0.02 },
      { id: 'breaker-30a-2p', name: 'Circuit Breaker 30A Double Pole', unit: 'ea', unitPrice: 15.00, wasteFactor: 0.02 },
      { id: 'gfci-breaker', name: 'GFCI Breaker 20A', unit: 'ea', unitPrice: 42.00, wasteFactor: 0.02 },
      { id: 'outlet-std', name: 'Duplex Outlet (15A)', unit: 'ea', unitPrice: 1.25, wasteFactor: 0.05 },
      { id: 'outlet-gfci', name: 'GFCI Outlet (20A)', unit: 'ea', unitPrice: 18.00, wasteFactor: 0.02 },
      { id: 'outlet-usb', name: 'USB Outlet Combo', unit: 'ea', unitPrice: 22.00, wasteFactor: 0.02 },
      { id: 'switch-single', name: 'Single Pole Switch', unit: 'ea', unitPrice: 1.50, wasteFactor: 0.05 },
      { id: 'switch-3way', name: '3-Way Switch', unit: 'ea', unitPrice: 3.25, wasteFactor: 0.05 },
      { id: 'switch-dimmer', name: 'Dimmer Switch', unit: 'ea', unitPrice: 18.00, wasteFactor: 0.02 },
      { id: 'box-1gang', name: 'Electrical Box 1-Gang (plastic)', unit: 'ea', unitPrice: 0.65, wasteFactor: 0.05 },
      { id: 'box-2gang', name: 'Electrical Box 2-Gang (plastic)', unit: 'ea', unitPrice: 1.25, wasteFactor: 0.05 },
      { id: 'can-light-6', name: 'Recessed Can Light 6" (LED)', unit: 'ea', unitPrice: 28.00, wasteFactor: 0.02 },
      { id: 'light-fixture', name: 'Light Fixture (Mid-Grade)', unit: 'ea', unitPrice: 75.00, wasteFactor: 0.0 },
      { id: 'ceiling-fan', name: 'Ceiling Fan w/ Light', unit: 'ea', unitPrice: 150.00, wasteFactor: 0.0 },
      { id: 'smoke-det', name: 'Smoke/CO Detector (Hardwired)', unit: 'ea', unitPrice: 32.00, wasteFactor: 0.02 },
    ],
  },

  // =========================================================================
  // DIVISION 31 - EARTHWORK / SITEWORK
  // =========================================================================
  sitework: {
    division: '31',
    divisionName: 'Earthwork',
    items: [
      { id: 'topsoil', name: 'Topsoil (delivered)', unit: 'cy', unitPrice: 35.00, wasteFactor: 0.10 },
      { id: 'fill-dirt', name: 'Fill Dirt (delivered)', unit: 'cy', unitPrice: 18.00, wasteFactor: 0.10 },
      { id: 'crushed-stone', name: 'Crushed Stone 3/4"', unit: 'ton', unitPrice: 32.00, wasteFactor: 0.10 },
      { id: 'sand-fill', name: 'Sand Fill', unit: 'ton', unitPrice: 25.00, wasteFactor: 0.10 },
      { id: 'sod', name: 'Sod (per pallet ~450sf)', unit: 'sf', unitPrice: 0.45, wasteFactor: 0.05 },
      { id: 'erosion-blanket', name: 'Erosion Control Blanket', unit: 'sy', unitPrice: 1.75, wasteFactor: 0.10 },
      { id: 'silt-fence', name: 'Silt Fence', unit: 'lf', unitPrice: 1.50, wasteFactor: 0.10 },
      { id: 'landscape-fabric', name: 'Landscape Fabric', unit: 'roll', unitPrice: 45.00, wasteFactor: 0.10 },
    ],
  },

  // =========================================================================
  // DIVISION 32 - EXTERIOR IMPROVEMENTS
  // =========================================================================
  exterior: {
    division: '32',
    divisionName: 'Exterior Improvements',
    items: [
      { id: 'asphalt-drive', name: 'Asphalt Paving 3"', unit: 'sf', unitPrice: 4.50, wasteFactor: 0.05 },
      { id: 'conc-sidewalk', name: 'Concrete Sidewalk 4"', unit: 'sf', unitPrice: 8.00, wasteFactor: 0.05 },
      { id: 'conc-driveway', name: 'Concrete Driveway 6"', unit: 'sf', unitPrice: 10.50, wasteFactor: 0.05 },
      { id: 'paver-brick', name: 'Brick Pavers', unit: 'sf', unitPrice: 6.50, wasteFactor: 0.10 },
      { id: 'vinyl-siding', name: 'Vinyl Siding (Double 4")', unit: 'sf', unitPrice: 2.25, wasteFactor: 0.10 },
      { id: 'fiber-cement', name: 'Fiber Cement Siding (HardiePlank)', unit: 'sf', unitPrice: 3.50, wasteFactor: 0.10 },
      { id: 'soffit-alum', name: 'Aluminum Soffit', unit: 'sf', unitPrice: 3.25, wasteFactor: 0.10 },
      { id: 'fascia-alum', name: 'Aluminum Fascia 6"', unit: 'lf', unitPrice: 4.50, wasteFactor: 0.10 },
      { id: 'gutter-alum-5', name: 'Aluminum Gutter 5" (seamless)', unit: 'lf', unitPrice: 6.50, wasteFactor: 0.05 },
      { id: 'downspout-alum', name: 'Aluminum Downspout 2x3', unit: 'lf', unitPrice: 4.00, wasteFactor: 0.05 },
      { id: 'deck-pt', name: 'Pressure Treated Decking 5/4x6', unit: 'lf', unitPrice: 2.25, wasteFactor: 0.10 },
      { id: 'deck-composite', name: 'Composite Decking (Trex)', unit: 'lf', unitPrice: 5.50, wasteFactor: 0.10 },
      { id: 'fence-wood-6', name: 'Wood Privacy Fence 6\' (per section)', unit: 'lf', unitPrice: 18.00, wasteFactor: 0.05 },
      { id: 'fence-chain-4', name: 'Chain Link Fence 4\'', unit: 'lf', unitPrice: 12.00, wasteFactor: 0.05 },
    ],
  },

  // =========================================================================
  // FASTENERS & ADHESIVES
  // =========================================================================
  fasteners: {
    division: '06',
    divisionName: 'Fasteners & Adhesives',
    items: [
      { id: 'nail-16d', name: 'Framing Nails 16d (5lb)', unit: 'box', unitPrice: 12.00, wasteFactor: 0.05 },
      { id: 'nail-8d', name: 'Common Nails 8d (5lb)', unit: 'box', unitPrice: 10.00, wasteFactor: 0.05 },
      { id: 'screw-deck-3', name: 'Deck Screws 3" (5lb)', unit: 'box', unitPrice: 28.00, wasteFactor: 0.05 },
      { id: 'screw-drywall', name: 'Drywall Screws 1-5/8" (5lb)', unit: 'box', unitPrice: 18.00, wasteFactor: 0.05 },
      { id: 'lag-bolt-3/8', name: 'Lag Bolt 3/8"x4"', unit: 'ea', unitPrice: 0.85, wasteFactor: 0.05 },
      { id: 'construction-adhesive', name: 'Construction Adhesive (tube)', unit: 'ea', unitPrice: 5.50, wasteFactor: 0.05 },
      { id: 'subfloor-adhesive', name: 'Subfloor Adhesive (28oz)', unit: 'ea', unitPrice: 7.00, wasteFactor: 0.05 },
    ],
  },

  // =========================================================================
  // HVAC (DIVISION 23)
  // =========================================================================
  hvac: {
    division: '23',
    divisionName: 'HVAC',
    items: [
      { id: 'furnace-gas-80k', name: 'Gas Furnace 80,000 BTU (80% eff)', unit: 'ea', unitPrice: 1200.00, wasteFactor: 0.0 },
      { id: 'furnace-gas-100k', name: 'Gas Furnace 100,000 BTU (96% eff)', unit: 'ea', unitPrice: 2200.00, wasteFactor: 0.0 },
      { id: 'ac-condenser-3ton', name: 'A/C Condenser 3 Ton (14 SEER)', unit: 'ea', unitPrice: 1800.00, wasteFactor: 0.0 },
      { id: 'ac-condenser-4ton', name: 'A/C Condenser 4 Ton (14 SEER)', unit: 'ea', unitPrice: 2400.00, wasteFactor: 0.0 },
      { id: 'evap-coil-3ton', name: 'Evaporator Coil 3 Ton', unit: 'ea', unitPrice: 450.00, wasteFactor: 0.0 },
      { id: 'ductwork-flex-6', name: 'Flex Duct 6" (25\')', unit: 'ea', unitPrice: 28.00, wasteFactor: 0.10 },
      { id: 'ductwork-flex-8', name: 'Flex Duct 8" (25\')', unit: 'ea', unitPrice: 35.00, wasteFactor: 0.10 },
      { id: 'sheet-metal-duct', name: 'Sheet Metal Duct (per lf)', unit: 'lf', unitPrice: 8.50, wasteFactor: 0.05 },
      { id: 'register-supply', name: 'Supply Register 4x10', unit: 'ea', unitPrice: 8.00, wasteFactor: 0.02 },
      { id: 'register-return', name: 'Return Air Grille 20x20', unit: 'ea', unitPrice: 15.00, wasteFactor: 0.02 },
      { id: 'thermostat-prog', name: 'Programmable Thermostat', unit: 'ea', unitPrice: 85.00, wasteFactor: 0.0 },
      { id: 'thermostat-smart', name: 'Smart Thermostat', unit: 'ea', unitPrice: 225.00, wasteFactor: 0.0 },
    ],
  },
};

/**
 * Search the materials catalog
 */
export function searchMaterials(query) {
  const results = [];
  const queryLower = query.toLowerCase();

  for (const [category, data] of Object.entries(MATERIALS_CATALOG)) {
    for (const item of data.items) {
      if (
        item.name.toLowerCase().includes(queryLower) ||
        item.id.toLowerCase().includes(queryLower) ||
        category.toLowerCase().includes(queryLower)
      ) {
        results.push({
          ...item,
          category,
          division: data.division,
          divisionName: data.divisionName,
        });
      }
    }
  }

  return results;
}

/**
 * Get all materials in a category
 */
export function getMaterialsByCategory(category) {
  const data = MATERIALS_CATALOG[category];
  if (!data) return [];
  return data.items.map(item => ({
    ...item,
    category,
    division: data.division,
    divisionName: data.divisionName,
  }));
}

/**
 * Get all categories
 */
export function getCategories() {
  return Object.entries(MATERIALS_CATALOG).map(([key, data]) => ({
    key,
    division: data.division,
    divisionName: data.divisionName,
    itemCount: data.items.length,
  }));
}

export default MATERIALS_CATALOG;
