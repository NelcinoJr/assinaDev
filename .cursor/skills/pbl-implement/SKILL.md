---
name: pbl-implement
description: Bridge from a refined backlog item to coding. Creates a test skeleton, identifies relevant design files, and checks domain terminology before the first commit.
---

You are helping the developer start implementation of a refined Product Backlog Item. Your job is to answer "what do I need to read and write before coding?" so that context is front-loaded, not discovered mid-implementation.

## Step 1: Identify the item

If the user specified an item, use that. Otherwise, find the item with the lowest numeric prefix that has all three C-files (Card.md, Conversation.md, Confirmation.md) and is not in `done/`.

Read `Card.md`, `Conversation.md`, and `Confirmation.md`. Show the user a brief summary of what this item delivers and its acceptance criteria.

If the item has no `Confirmation.md`, stop and say: "This item hasn't been confirmed yet. Run `/pbl-refine` first."

## Step 2: Generate the test skeleton

For each acceptance criterion in `Confirmation.md`, produce a skeleton test block. Detect the project's stack by checking the project root for cues (`package.json` → Jest/Vitest, `Gemfile` → RSpec, `mix.exs` → ExUnit, `pyproject.toml` → pytest, etc.). Generate the skeleton in the matching framework's idiomatic format. If no stack is detectable, default to a language-agnostic `describe`/`it` format.

Present the full skeleton to the user. Say: "This is a starting point — paste it into your test file and fill in the assertions."

Do not write the test file to disk. The user chooses where it lives.

## Step 3: Check domain terminology

Check if a domain glossary file exists. Look for it in this order:
1. Path specified in `pbl.config.json` under `domainGlossary` key
2. `CONTEXT.md` in the project root
3. `docs/CONTEXT.md`

If a glossary is found, scan `Confirmation.md` for nouns and domain terms that do NOT appear in the glossary. List them:

```
Terms in Confirmation.md not found in the domain glossary:
  - "invoice reconciliation"
  - "approval threshold"

Add these to the glossary before coding, or confirm they're intentional synonyms.
```

If no glossary is found, skip this check silently.

## Step 4: Identify relevant design files

Check if a design manifest exists. Look for it in this order:
1. Path specified in `pbl.config.json` under `designManifest` key
2. `docs/design/manifest.json`
3. `docs/design/manifest.md`

If a manifest is found, match terms from the item title and `Conversation.md` against the manifest keys. List any matches:

```
Relevant design files for "{item title}":
  → screens/instructor-course.html  (matches: "course", "instructor")
  → screens/course-overview.html    (matches: "course overview")

Read these before writing any UI code.
```

If no manifest is found, skip this check silently.

## Step 5: Offer to create a git branch

Ask: "Want me to create a git branch for this item? Suggested name: `{prefix}-{slug}`"

If yes, run: `git checkout -b {prefix}-{slug}`
If no, move on.

## Step 6: Mark as in progress (optional WIP marker)

Ask: "Want to mark this item as in progress?" 

If yes, create an empty file `product-backlog/{item-folder}/.wip` and write a history entry: `product-backlog/.history/{YYYY-MM-DD}_{slug}_started` (empty file).

## Step 7: Closing summary

Print a brief checklist of what was surfaced:

```
Ready to start {item title}:
  ✓ Test skeleton generated ({N} cases)
  {✓ / —} Domain terms checked ({N} new terms flagged / glossary not found)
  {✓ / —} Design files identified ({N} screens / manifest not found)
  {✓ / —} Branch created: {branch-name} / skipped
```
