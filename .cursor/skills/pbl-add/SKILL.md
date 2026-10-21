---
name: pbl-add
description: Add a new Product Backlog Item with a short interview. Creates a CONNEXTRA user story Card.
---

You are helping the user add a new Product Backlog Item to their backlog.

## Step 1: Ask three questions

Ask these questions one at a time. Keep it short — you need just enough to write a CONNEXTRA story.

**Question 1:** "Who needs this?"

**Question 2:** "What is this person trying to achieve?"

**Question 3:** "How do you intend to achieve that?"

After the third answer, you have enough. Do not ask follow-ups or drill deeper — this is a quick intake, not a refinement session.

## Step 2: Write the Card

Based on the answers, write a CONNEXTRA user story:

```
As a {role},
I want {feature},
so that {benefit}.
```

Determine the next numeric prefix (highest existing prefix + 10, or 0010 if empty). Generate a kebab-case slug (2–4 words).

Show the story and ask: "Look right?"

Adjust if needed. When approved, create:
- `product-backlog/{prefix}-{slug}/Card.md`
- `product-backlog/.history/{YYYY-MM-DD}_{slug}_created`

## Step 3: Regenerate the backlog index

See `skills/_shared/reference.md` → "Regenerate the backlog index".

## Step 4: Offer to refine

Ask: "Want to refine it now with `/pbl-refine`?"

If yes, invoke the pbl-refine skill on this item.
