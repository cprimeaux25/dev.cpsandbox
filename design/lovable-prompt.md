# Expert-Level Lovable AI Prompt — Construction Estimator

> **How to use:** open a fresh Lovable project, attach the Figma file
> (https://www.figma.com/design/wLzN9RDhMzPmskugdM1Eri) and the design spec
> (`figma-design-spec.md`), then paste the prompt below verbatim into the chat.

---

## ⬇️ COPY EVERYTHING BELOW THIS LINE INTO LOVABLE ⬇️

You are building **EstiCraft**, a modern, professional, light-themed web app for general contractors to create, manage, and present construction estimates. Build a polished, production-quality MVP on the first generation. Treat this brief as a contract — implement every numbered requirement.

---

### 1. Stack (use exactly this)

- React 18 + TypeScript + Vite
- Tailwind CSS with a custom design token layer (CSS variables on `:root`)
- shadcn/ui for primitives (Button, Input, Select, Dialog, Tabs, Tooltip, DropdownMenu, Toast, Sheet, Command)
- React Router v6
- **Zustand** for global state (estimates store, UI store) — persisted to `localStorage` via `zustand/middleware`
- **React Hook Form + Zod** for all forms and validation
- **TanStack Table v8** for the line-item grid and estimates list (inline-editable cells)
- **Recharts** for the dashboard sparkline + reports breakdown chart
- **Lucide React** for icons (1.5px stroke)
- **date-fns** for dates, **clsx + tailwind-merge** via a `cn()` helper
- **react-to-print** for the report print view
- No backend — everything persists to `localStorage` under the key `esticraft:v1`. Seed with sample data on first load if empty.

### 2. Design Tokens (apply exactly)

Add to `src/styles/tokens.css` and reference via Tailwind theme extension. Light theme only.

```css
:root {
  --bg: #FAFBFC;
  --surface: #FFFFFF;
  --surface-muted: #F8FAFC;
  --border: #E4E7EB;
  --border-muted: #F1F4F8;
  --text: #0F172A;
  --text-secondary: #475569;
  --text-tertiary: #94A3B8;
  --primary: #1E40AF;
  --primary-soft: #EFF4FF;
  --primary-dark: #1E3A8A;
  --accent: #F59E0B;
  --accent-soft: #FEF3C7;
  --success: #10B981;
  --success-soft: #D1FAE5;
  --danger: #EF4444;
  --danger-soft: #FEE2E2;
  --radius-sm: 6px;
  --radius: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --shadow-sm: 0 1px 2px rgba(15,23,42,0.04);
  --shadow: 0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04);
  --shadow-md: 0 4px 12px rgba(15,23,42,0.06);
  --shadow-lg: 0 12px 32px rgba(15,23,42,0.08);
}
```

Typography: **Inter** (400/500/600/700) for UI, **JetBrains Mono** (500/700) for every currency value. Load both via Google Fonts. Apply `font-feature-settings: "tnum"` globally on number-bearing elements.

Spacing grid: 4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64. Don't deviate.

### 3. Routes and Pages

```
/                       Dashboard
/estimates              Estimates list
/estimates/new          Wizard (opens as a modal route over the list)
/estimates/:id          Editor (default tab = Line Items)
/estimates/:id/report   Report viewer
/estimates/:id/changes  Change orders
/library/materials      Material catalog
/library/labor          Labor rates
/templates              Template gallery
/settings               Settings (markup defaults, tax, branding)
```

Persistent app shell:
- 240px left nav (collapsible to 64px icon rail). Items: Dashboard, Estimates, Library, Templates, Reports, Settings. Active item: `bg-primary-soft` + 2px left border `--primary` + `text-primary`.
- 64px top bar: breadcrumb · global `⌘K` command palette · `+ New Estimate` primary button · avatar.

### 4. Domain Model (TypeScript — create `src/types/estimate.ts`)

```ts
export type LineItemType = "material" | "labor" | "equipment" | "subcontractor";

export interface LineItem {
  id: string;
  type: LineItemType;
  category: string;             // CSI code or custom (e.g. "06 Wood & Plastics")
  description: string;
  quantity: number;
  unit: string;                 // "EA", "SF", "LF", "HR", "DAY", "LS"
  unitCost: number;
  wasteFactor: number;          // 0.0 – 0.20
  productivityRate?: number;    // labor only — units per hour
  hourlyRate?: number;          // labor only
  burdenRate?: number;          // labor only — 0.20 – 0.45
  taxable?: boolean;            // default true for material
}

export interface MarkupConfig {
  overheadPct: number;          // e.g. 0.10
  profitPct: number;            // e.g. 0.12
  contingencyPct: number;       // e.g. 0.05
  salesTaxPct: number;          // e.g. 0.0825
  bondPct: number;              // e.g. 0.01
  method: "cost-plus" | "fixed" | "tiered";
}

export interface ChangeOrder {
  id: string;
  number: string;               // "CO-001"
  description: string;
  lineItems: LineItem[];
  status: "draft" | "pending" | "approved" | "rejected";
  createdAt: string;
  approvedAt?: string;
}

export type EstimateStatus = "draft" | "in-review" | "sent" | "approved" | "lost";

export interface Estimate {
  id: string;
  number: string;               // "EST-2025-014"
  projectName: string;
  client: string;
  address: string;
  projectType: "residential" | "commercial" | "ti" | "civil" | "addition";
  squareFootage?: number;
  status: EstimateStatus;
  lineItems: LineItem[];
  markup: MarkupConfig;
  changeOrders: ChangeOrder[];
  notes: string;
  createdAt: string;
  updatedAt: string;
}
```

### 5. Calculation Engine (create `src/lib/calc.ts`)

Implement these EXACT formulas. They drive the right-pane summary and the report. All inputs/outputs are numbers in dollars.

```
materialCost(li)  = li.quantity * li.unitCost * (1 + li.wasteFactor)
laborCost(li)     = (li.quantity / li.productivityRate) * li.hourlyRate * (1 + li.burdenRate)
equipmentCost(li) = li.quantity * li.unitCost            // quantity = days
subCost(li)       = li.quantity * li.unitCost            // quantity = 1, lump sum

directCosts       = sum by type (materials + labor + equipment + subs)
subtotal          = directCosts + generalConditions
totalBeforeMarkup = subtotal + (subtotal * markup.contingencyPct)
overhead          = totalBeforeMarkup * markup.overheadPct
profit            = (totalBeforeMarkup + overhead) * markup.profitPct
salesTax          = sum(taxable material extended) * markup.salesTaxPct
bond              = (totalBeforeMarkup + overhead + profit) * markup.bondPct

TOTAL = totalBeforeMarkup + overhead + profit + salesTax + bond
```

Export: `calculateEstimate(estimate): EstimateBreakdown` returning every intermediate value plus per-category subtotals and per-type subtotals. The right-pane and report both consume this object — don't recompute downstream.

Validate at write time:
- quantity > 0, unitCost ≥ 0
- wasteFactor between 0 and 0.25 (warn outside 0.05–0.15)
- markup percentages between 0 and 1; warn if overhead+profit < 0.10 or > 0.50
- productivityRate > 0 for labor lines

### 6. Pages (build all of them)

#### 6.1 Dashboard (`/`)

- KPI row (4 cards, 240×116, `radius-lg`, `shadow-sm`): Active Estimates, Backlog $, Win Rate, Avg Margin. Eyebrow caption (11px medium, 0.5 tracking, uppercase, `--text-tertiary`) + 28px JetBrains Mono Bold value + 12px trend chip with arrow.
- Two-column grid: left 8/12 = "Recent Estimates" table (Project, Client, Status chip, Total, Modified, ⋯). Right 4/12 = "Quick Actions" tile group (3 large tiles: New Estimate, From Template, Quick Estimate) and "Approaching Deadline" list.
- Bottom strip: Recharts area chart (monthly bid volume), primary fill at 8% opacity, no axes line, only y-grid at 1px `--border-muted`.

#### 6.2 Estimates List (`/estimates`)

- Sub-header: filter pills (All, Drafts, In Review, Sent, Approved, Lost) + search input (`⌘F` focuses) + Sort dropdown + `+ New Estimate`.
- TanStack Table with bulk-select, sticky header, 56px row height, hover `--surface-muted`, status chip column.
- Empty state: outlined illustration (use a Lucide `FileBarChart2` at 80px, `--text-tertiary`) + headline + primary CTA.

#### 6.3 Estimate Editor (`/estimates/:id`) — **HERO SCREEN**

Three-pane layout. The whole page is the hero — invest the most polish here.

**Left pane (264w, sticky):** category tree of CSI divisions for that estimate. Each row: chevron · folder icon · name · count badge · running subtotal (mono). Click to filter the center grid. `+ Add Category` pinned at bottom.

**Center pane (flex):**
- Header: project name H1 (28 Semi Bold), sub-row with client · address · "Edited 2m ago" · `Saved` success chip · ghost buttons `Print`, `Duplicate`, `Settings`.
- Tab bar: `Line Items` · `Equipment` · `Subcontractors` · `General Conditions` · `Notes`.
- Inline-editable TanStack grid:
  - Columns: `☐` · Type chip · Description · Qty · Unit · Unit Cost · Waste % · **Extended**.
  - Click a cell to edit in place; Enter advances down, Tab right, ↑↓ navigates, `⌘⌫` deletes the row, `⌘D` duplicates.
  - Numeric cells right-align, mono font, currency prefix in `--text-tertiary`.
  - Type chip uses leading glyph + color: Material (slate `●`), Labor (blue `▲`), Equipment (amber `◆`), Sub (purple `■`).
- `+ Add line` row at the bottom of each category group.

**Right pane (360w, sticky):** "Cost Summary" card with the full waterfall from §5. The TOTAL is rendered Display 40 JetBrains Mono Bold. Show "Cost / SF" caption beneath if `squareFootage > 0`. Editable `%` inputs inline for contingency, overhead, profit, sales tax, bond. Two CTAs: `Generate Report` primary, `Send to Client` secondary.

Behavior:
- Autosave: every keystroke debounced 400ms; chip flips `Saved` → `Saving…` → `Saved`.
- Live recalc: total animates in (200ms ease-out) on any change.
- All edits go through Zustand actions; never mutate state directly.

#### 6.4 New Estimate Wizard (`/estimates/new`)

Modal route (Dialog) over the list. Three steps with a top progress bar.
1. **Project Info** — name, client combobox (typeahead from past clients), address, project type (segmented control), square footage.
2. **Template** — grid of cards (icon, name, line-item count, last used). Selecting a template pre-fills line items.
3. **Configuration** — markup defaults (overhead, profit, contingency), sales tax, bond, currency.

Footer: `Step n of 3` left, `Back` ghost + `Next`/`Create Estimate` primary right. Validate each step with Zod before advancing.

#### 6.5 Material / Labor Library (`/library/*`)

Two-pane: left = CSI division filter list; right = searchable, sortable table. Each row has a hover-revealed `+ Add to estimate` button — context comes from `useActiveEstimate()` (the most recently opened estimate).

#### 6.6 Reports (`/estimates/:id/report`)

Tabs: `Detailed` · `Proposal` · `Category Summary` · `Comparison`.
- Print-styled: white background, generous margins, branded header (logo + company), page numbers in footer.
- Toolbar floating top-right: `Export PDF` (use `react-to-print`), `Export Excel` (use `xlsx`), `Email Client` (mailto with summary), `Print`.
- "Detailed" lists every line item grouped by category with subtotals, then the cost waterfall.
- "Proposal" is the client-facing version — categories collapsed to scopes with bold totals; markup line items hidden, only TOTAL shown.
- "Category Summary" is a Recharts horizontal bar chart of category subtotals.
- "Comparison" lets the user pick another estimate to view side-by-side variance.

#### 6.7 Change Orders (`/estimates/:id/changes`)

- Header: parent estimate breadcrumb, two pill stats: `Original $X` and `Revised $Y` with a delta chip in success/danger.
- Stack of CO cards (CO-001, CO-002 …): status chip, scope description, ± amount, approver avatar, click-to-expand line items.
- `+ New Change Order` opens a modal with a line-item picker + reason textarea.

#### 6.8 Settings (`/settings`)

Sectioned form: Company (logo upload, name, license #), Branding (primary color picker that updates `--primary`), Defaults (markup %s, tax %, productivity multipliers), Team (mocked roles).

### 7. Components (build a clean library in `src/components/`)

- `Button` (primary / secondary / ghost / danger; sm / md / lg; iconLeft, iconRight, loading)
- `Input`, `NumberInput` (currency / percentage variants, mono font, right-aligned), `Select`, `Combobox`, `Checkbox`
- `StatusChip` (`status: EstimateStatus` → label + color + glyph)
- `KPICard`
- `DataTable` (TanStack wrapper)
- `LineItemGrid` (specialized DataTable with inline editing)
- `CategoryTree`
- `SummaryCard` (right-pane cost waterfall)
- `Modal` / `Sheet`
- `EmptyState` (icon, title, description, action)
- `Toast` (success / error / info)
- `CommandPalette` (`⌘K`) — fuzzy search across estimates, clients, line items, navigation

### 8. Interactions and Keyboard

- `⌘K` global command palette
- `⌘N` new estimate (works from any page)
- `⌘S` on report tab generates PDF
- `⌘D` duplicate estimate (or duplicate row in grid)
- `⌘F` focuses search on list pages
- In the line-item grid: `Enter` next row · `Tab` next cell · `↑↓` navigate · `⌘⌫` delete row · `Esc` cancel cell edit
- Optimistic updates everywhere; on error revert and toast.

### 9. Seed Data

On first load, if `localStorage` is empty, seed with:

1. **Maple Street Renovation** — Client: Sarah Chen · Residential · 2,400 SF · `in-review` · status colors visible
2. **Riverside Office TI** — Client: Apex Holdings · Commercial TI · 8,500 SF · `sent` · ~$487k total
3. **Oak Hill Garage Addition** — Client: M. Rivera · Addition · 720 SF · `draft`

Plus a material catalog with ~40 items across CSI divisions 03, 06, 07, 08, 09, 26, 22, and a labor rate table with 12 trades.

### 10. Acceptance Criteria (self-verify)

- [ ] All 9 routes render without console errors.
- [ ] Light theme only — no dark mode toggle, no `bg-black`, no near-white-on-white contrast issues.
- [ ] All currency values render in JetBrains Mono with tabular figures.
- [ ] Editing any line-item field updates the right-pane TOTAL within 300ms.
- [ ] Refreshing the browser preserves estimates (localStorage).
- [ ] Wizard validates each step before allowing `Next`.
- [ ] Report PDF export prints cleanly (one estimate per page set, footer page numbers).
- [ ] Keyboard: `⌘K`, `⌘N`, grid navigation, focus rings visible everywhere.
- [ ] WCAG 2.2 AA contrast on body, captions, button labels, status chips.
- [ ] No empty screens — every list/state has a designed empty state.
- [ ] Seed data loads on first visit; the dashboard's KPI numbers reflect it.

### 11. Out of Scope (do NOT build)

- Authentication, multi-tenancy, real backend / database, real email sending, file storage, payment, mobile app, dark mode, internationalization beyond `en-US` + USD.

### 12. Quality Bar

Treat every screen as a portfolio piece. No placeholder lorem text — use realistic construction industry copy ("Demolition & site prep", "5/8" Type X drywall", "Journeyman electrician — 3 hrs"). No stock-icon spam — only Lucide, sparingly. Whitespace > density. Numbers always right-aligned, never centered. Borders are 1px and `--border` — never thicker. Shadows are soft and single-layer — never harsh.

When you finish, write a one-paragraph README in the project root summarizing what was built and how to run it.

---

## ⬆️ COPY EVERYTHING ABOVE THIS LINE INTO LOVABLE ⬆️
