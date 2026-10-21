---
name: pbl-refine
description: Refine a Product Backlog Item through a relentless interview, then propose acceptance criteria. Defaults to the top unrefined item.
---

You are helping the user refine a Product Backlog Item using the 3 C's structure.

## Step 1: Identify the item to refine

If the user specified an item (by name or number), use that.

Otherwise, scan `product-backlog/` for the item with the lowest numeric prefix that has `Card.md` but NO `Conversation.md`. That is the default target.

If no unrefined items exist, check if there are items with `Conversation.md` but no `Confirmation.md` and offer to continue refining those.

Read the `Card.md` of the target item and show the user the story.

## Step 2: Check refinement history

Check `product-backlog/.history/` for files matching `*_{slug}_refined`. Count how many exist.

- If 0 prior refinements: proceed normally.
- If 1–2 prior refinements: note it. Show any existing `Conversation.md` and say you'll append with today's date.
- If 3 or more prior refinements: warn the user — "This item has been refined {N} times. That's usually a signal it's too big or too uncertain. Consider running `/pbl-split` before refining again." Ask whether to continue or split.

If `Conversation.md` already exists, read it and show the user the existing decisions before proceeding.

## Step 3: Conduct the refinement interview

Interview me relentlessly about every aspect of this plan until we reach a shared understanding. Walk down each branch of the design tree, resolving dependencies between decisions one-by-one. For each question, provide your recommended answer.

Ask the questions one at a time.

If a question can be answered by exploring the codebase, explore the codebase instead.

Focus on:
- Who exactly is the user/role in this story?
- What does "done" look like from their perspective?
- What is explicitly OUT of scope?
- What are the edge cases or failure scenarios?
- Are there technical or business constraints?
- Does this story feel too big? (If yes, note it — splitting may be needed.)

**If at any point you sense the item is too large or uncertain, proactively suggest running `/pbl-split` before continuing.** Don't wait for the user to ask.

## Step 4: Write Conversation.md

Write a structured summary of the decisions made. Format:

```markdown
## {YYYY-MM-DD}

**Scope:** {what was decided in/out of scope}
**Users:** {who this is for, with any nuance}
**Edge cases:** {key scenarios discussed}
**Constraints:** {technical or business constraints}
**Open questions:** {anything still unresolved}
```

If `Conversation.md` already exists, append this section at the end. Do not overwrite.

Write the file to `product-backlog/{item-folder}/Conversation.md`.

Write history entry: `product-backlog/.history/{YYYY-MM-DD}_{slug}_refined` (empty file).

## Step 4b: Offer ADRs sparingly

During the interview, watch for decisions that meet the ADR criteria in `skills/_shared/reference.md` → "ADR criteria". If a decision meets all three, offer inline: "This feels like it deserves an ADR — want me to write one?"

If yes, write the ADR using the template in `skills/_shared/reference.md` → "ADR template". Write it immediately — do not batch ADRs for later. After creating an ADR, remind the user: this decision may affect the Definition of Done — review `product-backlog/definition-of-done.md`.

If a decision does not meet the ADR criteria, record it in `Conversation.md` instead. Most decisions belong there, not in an ADR.

## Step 5: Propose Confirmation.md

Based on everything discussed, draft the acceptance criteria in prose format — not Gherkin, but written so it can be translated into automated tests (RSpec, Jest, ExUnit, etc.).

Before drafting, read `product-backlog/definition-of-done.md` if it exists. Use the DoD as a lens: each general quality attribute should translate into one or more item-specific acceptance criteria. For example:
- DoD: "keyboard navigable" → Confirmation: "the login form can be completed using only the keyboard (Tab, Enter, Esc)"
- DoD: "responsive on mobile" → Confirmation: "the profile page renders correctly at 320px width"
- DoD: "no known defects remain" → Confirmation: "invalid credentials show 'Wrong email or password' above the form, not a generic error"

When presenting the draft, list which DoD items are covered so the user can see the traceability. If a DoD item doesn't apply to this specific story, note it explicitly.

Format:
```markdown
# Acceptance Criteria

The {role} should be able to:
- {criterion 1}
- {criterion 2}
- {criterion 3}

The system should:
- {system behavior 1}
- {system behavior 2}
```

Show the draft to the user. Ask: "Does this look right? I'll save it as the Confirmation once you approve."

Adjust based on feedback. When approved, write to `product-backlog/{item-folder}/Confirmation.md`.

Write history entry: `product-backlog/.history/{YYYY-MM-DD}_{slug}_confirmed` (empty file).

## Step 6: Regenerate the backlog index

See `skills/_shared/reference.md` → "Regenerate the backlog index".

## Step 7: Suggest next step

"This item is now fully refined and ready to develop. Run `/pbl-implement` to get a test skeleton and check design files before coding. If it feels too big, run `/pbl-split` to break it down."

Suggest the user clear the conversation context now. The refine skill prompt and the interview conversation are dead weight — the next step (implement, split, or refine another item) benefits from a clean slate.

If the user wants to refine another item immediately, offer to do so in this same context first, then suggest clearing before starting implementation.
