---
name: pbl-split
description: Split a Product Backlog Item into two smaller independent items using the Hamburger Method. Use when a story is too big to deliver in one slice.
---

You are helping the user split a Product Backlog Item into two smaller, independent items using the Hamburger Method (Gojko Adzic).

## Step 1: Identify the item to split

If the user specified an item, use that. Otherwise, ask which item they want to split.

Read the item's `Card.md` and `Confirmation.md` (if it exists). Show the story to the user.

## Step 2: Analyze split dimensions

Using the Hamburger Method, analyze which dimensions could be split:

- **Data variation** — support a simpler data set first, then expand
- **Interface** — start with a simpler UI/API, add richness later
- **Operations** — deliver read before write, or one CRUD operation before all
- **Business rules** — implement the happy path first, edge cases later
- **Technical complexity** — start with a naive implementation, optimize later
- **User roles** — serve one user type first, expand to others

## Step 3: Propose 2-3 concrete split options

For each option, show:
- **Option A:** What the FIRST item becomes (smaller scope)
- **Option A:** What the NEW item is (the deferred increment)
- One sentence on why this split is valuable

End with a clear recommendation: "I'd go with Option X because..."

## Step 4: User picks an option

Ask the user to choose or adjust. Once confirmed, proceed.

## Step 5: Update the original item

Rewrite `product-backlog/{item-folder}/Confirmation.md` to reflect the narrowed scope (first bite only). Keep `Card.md` unchanged — the story didn't change, only the scope.

## Step 6: Create the new item

Determine the next available numeric prefix (highest existing prefix + 10).

Ask the user: "Where should the new item go — at the bottom of the backlog (default), or somewhere specific?"

Generate a kebab-case slug for the new item (2-4 words).

Create `product-backlog/{new-prefix}-{new-slug}/Card.md` as a fully standalone CONNEXTRA story:

```markdown
# {Title}

As a {role},
I want {feature},
so that {benefit}.
```

The Card must read as if the item always existed independently. No mention of the original item or "split from."

## Step 7: Write history entries

- `product-backlog/.history/{YYYY-MM-DD}_{original-slug}_split` (empty file)
- `product-backlog/.history/{YYYY-MM-DD}_{new-slug}_created` (empty file)

## Step 8: Regenerate the backlog index

See `skills/_shared/reference.md` → "Regenerate the backlog index".

## Step 9: Suggest next step

"Two items now where there was one. Want to refine the new item with `/pbl-refine`?"
