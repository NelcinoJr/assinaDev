---
name: pbl-kickoff
description: Bootstrap a product backlog from a full product idea. Interviews the user to decompose the product into vertical slices, creates Cards inline as items crystallize, and refines only the top priorities.
---

You are helping the user decompose a product idea into a Product Backlog. Your job is to surface what matters most — not to fully plan everything.

**Key principle: do not over-refine.** Every item gets a Card. Only the top items get a full grill session. The rest wait until their turn comes.

## Step 0: Check existing state

If `product-backlog/` already exists and has items, read the existing Cards and tell the user what's already there. Ask whether they want to add to the existing backlog or start a new product line.

If `product-backlog/` does not exist, the `create_backlog_item` tool will create it automatically when you write the first Card — no manual setup needed. The CLAUDE.md template lives in `skills/_shared/reference.md` (see "CLAUDE.md template" section).

## Step 1: Understand the product

Ask the user: "Describe your product idea — what does it do, who is it for, and what's the core problem it solves?"

Listen to the full answer before continuing.

## Step 2: Sharpen the user and the problem

Ask one targeted question to sharpen the most important fuzzy element in what they described. Focus on:
- Who exactly is the primary user? (avoid "users" — get a specific role)
- What is the core pain they have today without this product?
- What does success look like for that user?

Ask one question at a time. Stop when you have a clear user and a clear problem.

## Step 3: Decompose into vertical slices

Based on the conversation so far, propose an initial set of PBIs as vertical slices. Each must be:
- A complete end-to-end experience for the user (not a layer, not a component)
- Independently deliverable (delivers value on its own)
- Written in CONNEXTRA format

Present 5–8 items as a draft backlog, already ordered by priority (what delivers value fastest at the top).

Example format:
```
Draft backlog:

1. As a job seeker, I want to create a profile, so that employers can find me.
2. As a job seeker, I want to search for open positions, so that I can find relevant opportunities.
3. As an employer, I want to post a job listing, so that I can attract candidates.
...
```

Ask: "Does this capture the right slices? What's missing, wrong, or in the wrong order?"

Adjust based on feedback. This may take 1–2 rounds.

## Step 4: Create Cards inline as each item is confirmed

As soon as the user confirms an item (individually or as a batch), create it immediately — don't wait for the whole list to be finalized.

For each confirmed item:
- Assign the next numeric prefix (starting at 0010, gaps of 10)
- Generate a kebab-case slug (2–4 words)
- Create `product-backlog/{prefix}-{slug}/Card.md`
- Create `product-backlog/.history/{YYYY-MM-DD}_{slug}_created`

Card.md format:
```markdown
# {Title}

As a {role},
I want {feature},
so that {benefit}.
```

Tell the user as each item is written: "Created: {slug}"

## Step 5: Regenerate the backlog index

See `skills/_shared/reference.md` → "Regenerate the backlog index".

## Step 6: Establish the Definition of Done

Before wrapping up, propose creating a Definition of Done file. This becomes the checklist that `/pbl-done` uses to verify completion.

Write `product-backlog/definition-of-done.md`:

```markdown
# Definition of Done

The increment is done when:

- [ ] All acceptance criteria in `Confirmation.md` are met
- [ ] Tests pass
- [ ] No known defects remain
- [ ] The feature is demoable to stakeholders
```

Show it to the user and say: "This is a starting point — it describes the state the increment must reach to be considered complete. What else should be in here for your product and team? For example: accessibility standards, performance thresholds, security review, code review, deployment to staging?"

Let the user respond. Then show the updated DoD with their additions and ask: "Here's the updated version. Does this look right?"

Adjust based on feedback. The user owns this file. Keep it focused on the increment's state, not process steps.

Tell the user: "The DoD lives in `product-backlog/definition-of-done.md`. It's not set in stone — start simple and improve it as you learn what quality means for this product. Whenever an ADR is created or a new type of work emerges, review it."

## Step 7: Do not over-refine — focus on the top

Tell the user:

> "Backlog created with {N} items. Every item has a Card.
>
> We don't need to refine everything now — that would be waste. Let's focus on the top {1 or 2} items only.
>
> Want me to run `/pbl-refine` on **{top item name}** now?"

If yes, run `/pbl-refine` on the top item.
If the user wants to refine the second item too, do it.
After that, stop. The rest of the backlog stays as raw Cards until their turn comes.

Suggest the user clear the conversation context now. The kickoff skill prompt and the long decomposition conversation are dead weight for the next interaction — starting fresh saves significant tokens.

## ADRs during kickoff

During Steps 2 and 3, fundamental product decisions can surface that deserve an ADR — not technical ones, but decisions about the product's core shape that meet the ADR criteria in `skills/_shared/reference.md` → "ADR criteria".

Examples: "We decided the MVP is B2C only, not B2B" or "We decided to launch with manual onboarding before building self-serve."

If yes, write the ADR using the template in `skills/_shared/reference.md` → "ADR template". Write it immediately — do not batch. Most decisions belong in `Conversation.md`; ADRs are rare.

After creating an ADR, remind the user: this decision may affect the Definition of Done — review `product-backlog/definition-of-done.md`.

## What NOT to do

- Do not create Conversation.md or Confirmation.md for items beyond the top 1–2
- Do not ask about implementation details, tech stack, or architecture
- Do not try to make every item perfectly worded before moving on — get them good enough and keep moving
- Do not refine more than 2 items during kickoff, even if the user asks — remind them that over-refining is waste
