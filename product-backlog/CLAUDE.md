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
