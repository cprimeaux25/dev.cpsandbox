# Construction Estimator — Design Handoff

This directory contains everything needed to scaffold the EstiCraft web app in
[Lovable](https://lovable.dev) using a Figma reference and an expert prompt.

## Files

| File | Purpose |
|---|---|
| [`figma-design-spec.md`](./figma-design-spec.md) | Full visual / interaction specification — design tokens, component library, screen-by-screen layout. Use this to either rebuild the design in Figma or as supporting context for Lovable. |
| [`lovable-prompt.md`](./lovable-prompt.md) | Copy-paste-ready prompt for Lovable. Includes stack, tokens, routes, domain model, calculation formulas, acceptance criteria. |

## Figma File

A blank Figma file has been created at:

**https://www.figma.com/design/wLzN9RDhMzPmskugdM1Eri**

> ⚠️ The file is currently empty. The Figma MCP tool-call quota on the Starter
> plan was reached before the screens could be drawn programmatically. To
> populate the file, either:
> 1. Upgrade the Figma plan (Professional or higher) and re-run the design
>    generation, or
> 2. Hand the spec in `figma-design-spec.md` to a designer to build manually
>    (1–2 hours of work given the detail), or
> 3. Skip Figma entirely — `lovable-prompt.md` is self-contained and Lovable
>    will produce a high-quality result from the prompt alone.

## Recommended Workflow

1. Open Lovable and create a new project.
2. (Optional) Attach the Figma URL above as a reference.
3. Open `lovable-prompt.md`, copy everything between the marked lines, paste
   into Lovable's chat, and submit.
4. Lovable will scaffold the full app on the first generation. Iterate from
   there using the acceptance criteria as a checklist.
