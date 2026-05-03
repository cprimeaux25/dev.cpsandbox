# Construction Estimator — Figma UI/UX Design Specification

> **Style:** modern, professional, light-themed
> **Companion Figma file:** https://www.figma.com/design/wLzN9RDhMzPmskugdM1Eri
> **Companion Lovable prompt:** [`./lovable-prompt.md`](./lovable-prompt.md)

This document is the canonical visual / interaction specification. It is written so a designer can rebuild it in Figma in under an hour, and so Lovable can generate the front-end faithfully from the prompt + this spec.

---

## 1. Brand & Personality

| Attribute | Direction |
|---|---|
| Tone | Confident, precise, calm. Built for contractors who handle six- and seven-figure bids. |
| Inspiration | Linear (precision), Notion (calm density), Stripe Dashboard (financial credibility) |
| Avoid | Skeuomorphic blueprint textures, hard-hat clip art, dark "industrial" themes |
| Light theme only | Yes — soft warm-neutral background, never pure `#FFFFFF` for the canvas |

---

## 2. Design Tokens

### 2.1 Color

| Token | Hex | Usage |
|---|---|---|
| `--bg` | `#FAFBFC` | App background |
| `--surface` | `#FFFFFF` | Cards, modals, table rows |
| `--surface-muted` | `#F8FAFC` | Sidebar, table header, hover |
| `--border` | `#E4E7EB` | Default 1px borders |
| `--border-muted` | `#F1F4F8` | Subtle dividers inside cards |
| `--text` | `#0F172A` | Headings, primary numbers |
| `--text-secondary` | `#475569` | Body, labels |
| `--text-tertiary` | `#94A3B8` | Captions, placeholders |
| `--primary` | `#1E40AF` | Primary buttons, links, focus ring |
| `--primary-soft` | `#EFF4FF` | Selected row, primary tints |
| `--primary-dark` | `#1E3A8A` | Hover on primary button |
| `--accent` | `#F59E0B` | Highlights, "approval pending" |
| `--accent-soft` | `#FEF3C7` | Warning chip background |
| `--success` | `#10B981` | Approved, paid, in-budget |
| `--success-soft` | `#D1FAE5` | Success chip bg |
| `--danger` | `#EF4444` | Errors, over-budget, deletes |
| `--danger-soft` | `#FEE2E2` | Danger chip bg |

Status semantics for estimates: `Draft` (slate), `In Review` (amber), `Sent` (blue), `Approved` (green), `Lost` (rose).

### 2.2 Typography

- **Sans:** Inter (400, 500, 600, 700)
- **Mono (numbers / totals):** JetBrains Mono (500, 700)
- Tabular figures `font-feature-settings: "tnum"` everywhere a money value appears.

| Style | Family / Weight | Size / Line | Usage |
|---|---|---|---|
| Display | Inter Bold | 40 / 48 | Hero project totals on report |
| H1 | Inter Semi Bold | 28 / 36 | Page titles |
| H2 | Inter Semi Bold | 20 / 28 | Section headers |
| H3 | Inter Semi Bold | 16 / 24 | Card titles |
| Body | Inter Regular | 14 / 20 | Default text |
| Small | Inter Regular | 13 / 18 | Table cells |
| Caption | Inter Medium | 11 / 16, +0.5 tracking, UPPERCASE | Eyebrows, KPI labels |
| Mono / total | JetBrains Mono Bold | 28 / 36 | Grand total |
| Mono / cell | JetBrains Mono Medium | 13 / 18 | Currency cells |

### 2.3 Spacing & Layout

- 8px base grid. Allowed steps: `4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80`.
- Container max width: `1440px` desktop, fluid below `1024px`.
- Sidebar width: `240px` collapsed → `64px` icon-only.
- Right summary panel: `360px`.

### 2.4 Radius

- 6px — chips, small toggles
- 8px — inputs, buttons
- 12px — cards, modals
- 16px — page hero cards / KPIs

### 2.5 Elevation (single-layer, very soft)

```
shadow-sm:  0 1px 2px  rgba(15, 23, 42, 0.04);
shadow:     0 1px 3px  rgba(15, 23, 42, 0.06), 0 1px 2px rgba(15,23,42,0.04);
shadow-md:  0 4px 12px rgba(15, 23, 42, 0.06);
shadow-lg:  0 12px 32px rgba(15, 23, 42, 0.08);  // modals
```

### 2.6 Iconography

Lucide icons, 1.5px stroke, 20px default in nav, 16px inline.

---

## 3. Component Library

### 3.1 Buttons

- `Primary` — `bg-primary` `text-white` `radius-8` `px-5 py-3` `font-semibold`. Hover: `bg-primary-dark`. Focus: 3px ring `rgba(30,64,175,0.25)`.
- `Secondary` — `bg-surface` `border-1 border-border` `text-text`. Hover bg `surface-muted`.
- `Ghost` — no border, `text-text-secondary` → hover `bg-surface-muted` `text-text`.
- `Danger` — `bg-danger` `text-white`.
- Sizes: sm `32px`, md `40px` (default), lg `48px`. Icon-only buttons are square.

### 3.2 Inputs

- Height 40px. 12px horizontal padding. 8px radius. 1px border `--border`.
- Focus: 1px primary border + 3px primary-soft ring.
- Error: 1px danger border + helper text in `--danger`.
- Number inputs: right-align, mono font, currency prefix in `--text-tertiary`.

### 3.3 Status Chip

- 24px height, 6px radius, 10px horizontal padding, 11px Medium text, 6px dot indicator.

### 3.4 Data Table

- Header: `--surface-muted` bg, 12px Medium uppercase, 0.5 tracking, `--text-tertiary`.
- Rows: 56px height, 1px bottom border `--border-muted`, hover `--surface-muted`, selected `--primary-soft` with 2px left border `--primary`.
- Sticky first column on scroll for line-item grid.

### 3.5 KPI Card

- 240×116, `radius-16`, padding 20, `shadow-sm`.
- Eyebrow caption + 28px mono number + 12px trend chip with arrow.

### 3.6 Modal

- Max 640px width (forms) / 960px (wizards). 16px radius, `shadow-lg`. 24px header, 32px body, 24px footer.

### 3.7 Toast

- Bottom-right, 360px wide, 12px radius, success/error/info variants.

---

## 4. Information Architecture

```
/                       Dashboard
/estimates              List
/estimates/new          Wizard (modal route)
/estimates/:id          Editor (default tab)
/estimates/:id/report   Report viewer
/estimates/:id/changes  Change orders
/library/materials      Material catalog
/library/labor          Labor rates
/templates              Templates
/settings               Markup, taxes, company
```

Persistent left nav: Dashboard · Estimates · Library · Templates · Reports · Settings.

---

## 5. Screen Specifications

### 5.1 Dashboard

**Goal:** answer "what should I work on now?" in under 5 seconds.

Layout (1440 desktop):
- Top bar (64h): logo, breadcrumb, global search (`⌘K`), `+ New Estimate` primary, avatar.
- KPI row (4 cards × 240w): `Active Estimates`, `Backlog $`, `Win Rate`, `Avg Margin`.
- Two-column grid below:
  - Left (`8/12 col`): "Recent Estimates" data table — 8 rows, columns: Project · Client · Status chip · Total · Modified · `…` menu.
  - Right (`4/12 col`):
    - "Quick Actions" card — three big tiles (New, From Template, Quick Estimate) icons + label.
    - "Approaching Deadline" card — list of 3 estimates with due date pills.
- Bottom strip: simple sparkline of monthly bid volume (Recharts area chart, primary fill at 8% opacity).

### 5.2 Estimates List

- Sub-header: title + filter pills (`All`, `Drafts`, `Sent`, `Approved`, `Lost`) + search + `Sort by` dropdown + `+ New`.
- Bulk-select column with checkbox, sticky header.
- Empty state: outlined illustration + "Create your first estimate" CTA.

### 5.3 Estimate Editor — **HERO SCREEN**

Three-pane layout:

**Left pane (264w) — Category tree**
- Collapsible CSI division groups (e.g. "03 Concrete", "06 Wood & Plastics", "09 Finishes").
- Each row: chevron · folder icon · name · count badge · running subtotal in mono.
- "+ Add category" pinned at bottom.

**Center pane (flex) — Line items grid**
- Header: project name H1, sub-row with client · location · `Edited 2m ago` · `Saved` chip · `Print` `Duplicate` `Settings` ghost buttons.
- Tab bar: `Line Items` · `Equipment` · `Subcontractors` · `General Conditions` · `Notes`.
- Grid columns: `☐ · Type chip · Description · Qty · Unit · Unit Cost · Waste % · Extended` (Material/Labor/Equipment/Sub).
- Inline-edit on click. Tab/Enter to next cell. `+ Add line` row at bottom of each category.
- Type chip color-codes: Material (slate), Labor (blue), Equipment (amber), Sub (purple).

**Right pane (360w) — Live cost summary** (sticky)
- Card with the cost waterfall:
  - Materials      $X
  - Labor          $X
  - Equipment      $X
  - Subcontractors $X
  - **Direct Costs**          $X
  - General Conditions
  - Contingency  (with editable %)
  - Overhead     (with editable %)
  - Profit       (with editable %)
  - Sales Tax    (with editable %)
  - Bond
  - **TOTAL**            (Display 40 mono)
  - Cost / SF caption
- Two CTAs at the bottom: `Generate Report` primary, `Send to Client` secondary.

### 5.4 New Estimate Wizard (modal, 3 steps)

1. **Project Info** — name, client (combobox), address (autocomplete), project type (segmented control: Residential / Commercial / TI / Civil), square footage.
2. **Template** — grid of template cards (icon, name, line-item count, last used).
3. **Configuration** — markup defaults (overhead %, profit %, contingency %), sales tax %, bond %, currency.

Footer always shows `Step n of 3` + `Back` ghost + `Next` primary. Progress bar across the top.

### 5.5 Material / Labor Library

- Two-pane: left = CSI division filters; right = searchable, sortable table.
- Each row has a hover `+ Add to estimate` button (uses currently-open estimate context).

### 5.6 Reports

- Tabs: `Detailed` · `Proposal` · `Category Summary` · `Comparison`.
- Print-styled (white paper, 16px body), branded header, page numbers in footer.
- Toolbar: `Export PDF`, `Export Excel`, `Email Client`, `Print`.

### 5.7 Change Orders

- Header: parent estimate breadcrumb, original total vs. revised total chips.
- Stack of CO cards (CO-001, CO-002 …): status, scope description, +/− amount, approver avatar.
- `+ New Change Order` opens a modal with line-item picker.

### 5.8 Settings

- Sectioned form: Company (logo upload, name, license #), Branding (primary color picker), Defaults (markup %s, tax %, productivity multipliers), Team (roles).

---

## 6. Interaction Notes

- **Autosave:** every keystroke debounced 400ms; status chip flips `Saved` → `Saving…` → `Saved`.
- **Live recalc:** the right-pane total animates in (200ms ease-out) on any input change.
- **Keyboard:**
  - `⌘K` global command palette
  - `⌘S` force save / generate report (when on report tab)
  - `⌘N` new estimate
  - `⌘D` duplicate estimate
  - In grid: `Enter` next row, `Tab` next cell, `↑↓` navigate, `⌘⌫` delete row
- **Empty states** everywhere — no blank screens. Always: illustration (outline-style only), one-sentence explanation, primary CTA.
- **Errors:** validation appears inline below the field; never modal-block.

---

## 7. Responsive

- ≥1280px: full three-pane editor.
- 768–1279px: collapse left nav to icon rail; right summary becomes a sticky bottom bar with totals + "View summary" sheet.
- <768px (mobile): editor read-only; summary as expandable sheet; line-item editing routes to a focused single-item view.

---

## 8. Accessibility

- WCAG 2.2 AA contrast on all text & UI controls.
- Visible focus rings (3px `rgba(30,64,175,0.25)`) — never `outline:none` without replacement.
- Every actionable icon has `aria-label`.
- Form fields always have visible labels (no placeholder-only).
- Color is never the only indicator (status chips also use a leading glyph: `●`, `○`, `◐`).

---

## 9. Sample Seed Content (for the Figma mocks and Lovable seed data)

**Estimate 1 — "Maple Street Renovation"**
Client: Sarah Chen · Type: Residential · 2,400 SF · Status: In Review
- Demo & Site Prep — $4,200
- Framing — $18,750
- Drywall — $9,800
- Electrical (sub) — $14,500
- Plumbing (sub) — $11,200
- Finishes — $22,400
Direct $80,850 · OH 10% · Profit 12% · Tax 8.25% · **Total $112,840**

**Estimate 2 — "Riverside Office TI"**
Client: Apex Holdings · Type: Commercial TI · 8,500 SF · Status: Sent
Direct $312,000 · **Total $487,250**

**Estimate 3 — "Oak Hill Garage Addition"**
Client: M. Rivera · Type: Residential Addition · 720 SF · Status: Draft
Direct $42,300 · **Total $58,940**
