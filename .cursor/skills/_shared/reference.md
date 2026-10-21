# Shared Templates & Instructions

This file contains templates and instructions shared across multiple pbl-* skills.
Individual skills reference sections here by name to avoid duplicating content in every SKILL.md.

---

## CLAUDE.md template

When a skill instructs you to create `product-backlog/CLAUDE.md`, write this content:

```markdown
# Product Backlog

This folder contains the product backlog managed with the pbl-* skills.

## Folder structure
- Each item is a folder: `0010-item-name/` (numeric prefix defines priority order)
- `done/` — completed items
- `.removed-items/` — removed items (soft-deleted, not gone)
- `.history/` — one file per lifecycle event: `YYYY-MM-DD_{item-slug}_{event}`

## Item lifecycle (inferred from files present)
- `Card.md` only → raw idea
- `Card.md` + `Conversation.md` → refining
- `Card.md` + `Conversation.md` + `Confirmation.md` → ready to develop
- Moved to `done/` → done
- Moved to `.removed-items/` → removed (can be restored)

## Files in each item folder
- `Card.md` — CONNEXTRA user story (As a / I want / So that)
- `Conversation.md` — structured summary of refinement decisions (appendable, date-headed sections)
- `Confirmation.md` — prose acceptance criteria written so it can be translated into automated tests

## Skills
- `/pbl-add` — add a new item with a short interview
- `/pbl-kickoff` — bootstrap a full product idea into backlog items
- `/pbl-refine` — refine the top unrefined item (or specify one)
- `/pbl-split` — split an item using the Hamburger Method
- `/pbl-metrics` — backlog health widget + velocity sparkline (TUI tool)
- `/pbl-diagnose` — deep analysis of backlog health, anti-pattern detection, and action recommendations
- `/pbl-done` — mark an item as done
- `/pbl-implement` — bridge from refinement to coding: test skeleton, design files, domain check
```

---

## ADR criteria

A decision deserves an ADR only when **all three** are true:

1. **Hard to reverse** — the cost of changing your mind later is meaningful
2. **Surprising without context** — a future reader would wonder "why did they do it this way?"
3. **Result of a real trade-off** — genuine alternatives existed and one was chosen for specific reasons

Most decisions belong in `Conversation.md`, not in an ADR. ADRs are rare.

## ADR template

When a skill instructs you to create an ADR, write this content:

```markdown
# ADR {NNNN}: {Decision Title}

## Status
Accepted

## Context
{The situation that led to this decision — constraints, requirements, forces at play}

## Decision
{What was decided, stated clearly}

## Consequences
{Trade-offs accepted: what becomes easier, what becomes harder, what is explicitly ruled out}
```

Create the file in `docs/adr/{NNNN}-{slug}.md`. Find the next sequence number by listing existing files in `docs/adr/`.

---

## Regenerate the backlog index

After any mutation to the backlog (create, refine, confirm, split, reorder, done, delete), run:

```
node scripts/pbl-index.js
```

if the `scripts/` directory exists. This keeps `.index.md` current for faster future reads.
