---
name: pbl-diagnose
description: Deep analysis of backlog health. Identifies anti-patterns, explains root causes, and offers to act on flagged items. Run after /pbl-metrics to understand what the numbers mean.
---

You are auditing the product backlog for common anti-patterns and offering to act on anything problematic.

## Step 1: Read the backlog state

**Fast path — use the index if available:**
Check if `product-backlog/.index.md` exists. If it does, read it. The index already contains item counts by status and a recent history summary — use it to perform all count-based anti-pattern checks (Steps 2–3) without scanning individual folders.

**Slow path — scan from scratch:**
If `.index.md` does not exist, list all folders in `product-backlog/` (excluding `done/` and `.history/`). For each item, check which files exist (Card.md, Conversation.md, Confirmation.md). List all files in `product-backlog/.history/` to build an event timeline.

## Step 2: Compute metrics

For each active item, determine its status:
- **raw** — Card.md only
- **refined** — Card.md + Conversation.md
- **ready** — Card.md + Conversation.md + Confirmation.md

For staleness checks (anti-patterns 3 and 4), read the `.history/` files only for items flagged by the count checks above — not all of them upfront.

From the history, for each item:
- **Created at:** date of `_created` history entry
- **Refined at:** date of `_refined` history entry (if any)
- **Items delivered since refinement:** count `_done` history entries with dates after the item's `_refined` date
- **Items added since refinement:** count `_created` history entries with dates after the item's `_refined` date

## Step 3: Check anti-patterns

Run all checks. Flag items that meet the threshold.

### Anti-pattern 1: Refinement bottleneck
**Condition:** More than 3 items have `Conversation.md` but no `Confirmation.md`
**Message:** "X items have been discussed but never confirmed. These are stuck mid-refinement."

### Anti-pattern 2: Ready but not started
**Condition:** More than 5 items have all 3 C-files but are not in `done/`
**Message:** "X items are fully refined and waiting. Consider reducing WIP or removing items that lost priority."

### Anti-pattern 3: Stale refining items
**Condition:** Any item has 5 or more `_done` events recorded after its `_refined` date
**Message:** "{item}: refined X items ago. This story may no longer reflect current understanding."

### Anti-pattern 4: Stale unrefined items
**Condition:** Any item has 8 or more `_created` events recorded after its own `_created` date and still has no `Conversation.md`
**Message:** "{item}: added X items ago and never discussed. Is it still relevant?"

### Anti-pattern 5: DoD may be stale
**Condition:** `docs/adr/` contains files newer than `product-backlog/definition-of-done.md`'s last modification date
**Message:** "Definition of Done hasn't been updated since {date}. {N} ADRs have been created since then — the DoD may be missing checks these decisions require."

## Step 4: Report findings

Print a summary:

```
Backlog health: {N} items total, {N} done, {N} ready, {N} refining, {N} raw

Issues found:
- [Anti-pattern name]: description
  Affected: item-name, item-name

No issues: [category] ✓
```

If no issues are found, say so clearly.

## Step 5: Offer to act on each flagged item

For each flagged item, ask the user what to do:

> **{item-name}** — {reason flagged}
> Options: (1) Refine it now `/pbl-refine` · (2) Split it `/pbl-split` · (3) Delete it · (4) Skip

If the user chooses refine or split, run the appropriate skill immediately.
If the user chooses delete, confirm once, then delete the item folder and write a history entry: `{YYYY-MM-DD}_{slug}_deleted`.
If the user chooses skip, move on.

Process items one at a time.

## Step 6: Closing note

After all items are processed: "Metrics update complete. Run `/pbl-metrics` again anytime to check for new issues."
