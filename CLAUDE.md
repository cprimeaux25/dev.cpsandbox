# Construction Estimating Plugin for Claude Code

## Overview
This is a fully functional construction estimating system built as a Claude Code plugin. It provides comprehensive tools for creating, managing, and calculating construction project estimates with industry-standard formulas, markup structures, and reporting.

## Plugin Architecture

### Skills Available
- **`/estimate`** — Create a new construction estimate interactively
- **`/estimate-quick`** — Generate a quick rough estimate from a project description
- **`/estimate-material`** — Look up material costs and add to an estimate
- **`/estimate-labor`** — Calculate labor costs with crew rates and productivity
- **`/estimate-report`** — Generate a formatted estimate report/proposal
- **`/estimate-markup`** — Configure and apply markup, overhead, and profit
- **`/estimate-template`** — Load or save estimate templates by trade/project type
- **`/estimate-compare`** — Compare two estimates side by side
- **`/estimate-change-order`** — Create a change order against an existing estimate

### Core Capabilities
1. **Material Takeoff & Pricing** — Unit-based material calculations with waste factors
2. **Labor Costing** — Crew-based labor with productivity rates and burden
3. **Equipment Costs** — Rental/owned equipment cost allocation
4. **Subcontractor Management** — Sub bids and scope tracking
5. **Overhead & Profit** — Configurable markup structures (cost-plus, fixed, tiered)
6. **Tax Calculations** — State/local tax rates on materials and labor
7. **Contingency** — Risk-based contingency allocation
8. **Change Orders** — Track scope changes with cost impact
9. **Report Generation** — Professional estimate summaries and detailed breakdowns
10. **Template System** — Reusable templates for common project types

## Directory Structure
```
src/
  engine/         — Core calculation engine and formulas
  data/           — Material databases, labor rates, default configs
  reports/        — Report templates and generators
  utils/          — Helper functions, validation, formatting
  skills/         — Claude skill definitions and handlers
templates/        — Pre-built estimate templates by trade
examples/         — Sample estimates for reference
tests/            — Test suite
```

## Key Formulas & Calculations

### Material Cost
```
Material Cost = Quantity × Unit Price × (1 + Waste Factor)
```

### Labor Cost
```
Labor Cost = (Hours / Productivity Rate) × Hourly Rate × (1 + Burden Rate)
Labor Burden = Base Rate × (FICA + Workers Comp + Insurance + Benefits)
```

### Equipment Cost
```
Equipment Cost = (Daily Rate × Days) + Mobilization + Fuel
```

### Total Project Cost
```
Direct Costs = Materials + Labor + Equipment + Subcontractors
Subtotal = Direct Costs + General Conditions
Total Before Markup = Subtotal + Contingency
Overhead = Total Before Markup × Overhead %
Profit = (Total Before Markup + Overhead) × Profit %
Sales Tax = Taxable Materials × Tax Rate
Bond = (Total Before Markup + Overhead + Profit) × Bond Rate
TOTAL PROJECT COST = Total Before Markup + Overhead + Profit + Sales Tax + Bond
```

### Markup Methods
- **Cost-Plus**: Apply overhead % then profit % on top
- **Fixed Markup**: Single markup percentage on direct costs
- **Tiered Markup**: Different rates for materials vs labor vs subs

## Guardrails & Validation
- All quantities must be positive numbers
- Unit prices cannot be negative
- Markup percentages are validated against industry ranges (warn if outside 10-50%)
- Waste factors validated (typically 5-15% for most materials)
- Labor productivity rates checked against trade standards
- Estimates must have at least one line item to generate reports
- Tax rates validated against known state/local ranges
- Change orders must reference a valid base estimate

## Working with Estimates
- Estimates are stored as JSON files in the project directory
- Each estimate has a unique ID, project name, and date
- Line items are organized by CSI division codes (optional) or custom categories
- All calculations auto-update when inputs change
- Currency formatting uses USD by default (configurable)
