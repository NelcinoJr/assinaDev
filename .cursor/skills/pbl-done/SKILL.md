---
name: pbl-done
description: Mark a Product Backlog Item as done. Moves it to the done/ folder, records history, then updates the backlog index.
---

You are marking a Product Backlog Item as completed.

## Step 1: Identify the item

If the user specified an item, use that. Otherwise, ask: "Which item did you complete?"

Read the item's `Card.md` to confirm it's the right one.

## Step 2: Definition of Done gate

Read `product-backlog/definition-of-done.md`. If it exists, present its checklist to the user.

If it does NOT exist, use this fallback checklist:

```
Checking Definition of Done for {item-name}...
(No definition-of-done.md found. Run /pbl-kickoff to establish one.)

[ ] All acceptance criteria in Confirmation.md are met
[ ] Tests pass
[ ] No known defects remain
```

If `pbl.config.json` exists, check for these optional config keys and augment the checklist:
- `testCommand` → append the specific command to "Tests pass?"
- `blogPath` → add `[ ] Blog post drafted?`

This is a lightweight checklist — you are not running the tests yourself. You are asking the user to confirm they've done their due diligence.

If the user says items are incomplete, stop and let them resolve it. Do not force-close.

Also ask: "Any new domain terms to add to the glossary?" This is a process side-effect of implementation, not a DoD item, but worth checking before close.

## Step 3: ADR check

Ask: "Was there any technical decision during implementation that a new team member would find surprising without context?" 

If yes, offer to write an ADR now before closing. If no, continue.

## Step 4: Move to done/

Move the entire item folder from `product-backlog/{item-folder}/` to `product-backlog/done/{item-folder}/`.

## Step 5: Write history entry

Create: `product-backlog/.history/{YYYY-MM-DD}_{slug}_done` (empty file).

## Step 6: Regenerate the backlog index

See `skills/_shared/reference.md` → "Regenerate the backlog index".

## Step 7: Celebrate briefly

"{item-name} is done."

## Step 8: Suggest a health check

Say: "Run `/pbl-diagnose` to review what's next and check for anything that's gone stale."

Do not run `/pbl-diagnose` automatically — let the user decide.
