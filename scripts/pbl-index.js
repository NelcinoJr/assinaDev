#!/usr/bin/env node
// pbl-index.js — pre-compiled from pbl-index.ts (do not edit manually)
// Run: node scripts/pbl-index.js

"use strict";
const fs = require("node:fs");
const path = require("node:path");

const bp = path.join(process.cwd(), "product-backlog");
const histDir = path.join(bp, ".history");
const doneDir = path.join(bp, "done");
const indexPath = path.join(bp, ".index.md");

function scanDir(dir, forcedStatus) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => e.isDirectory() && /^\d+-.+/.test(e.name))
    .map(e => {
      const fp = path.join(dir, e.name);
      const hasCard = fs.existsSync(path.join(fp, "Card.md"));
      const hasConv = fs.existsSync(path.join(fp, "Conversation.md"));
      const hasConf = fs.existsSync(path.join(fp, "Confirmation.md"));
      const status = forcedStatus ?? (
        hasCard && hasConv && hasConf ? "READY" :
        hasCard && hasConv ? "REFINED" : "RAW"
      );
      return { name: e.name, status };
    });
}

function scanHistory(limit = 30) {
  if (!fs.existsSync(histDir)) return [];
  const entries = fs.readdirSync(histDir)
    .map(f => {
      const m = f.match(/^(\d{4}-\d{2}-\d{2})_(.+)_(created|refined|confirmed|done|split|deleted)$/);
      return m ? { date: m[1], slug: m[2], event: m[3] } : null;
    })
    .filter(Boolean);
  entries.sort((a, b) => b.date.localeCompare(a.date));
  return entries.slice(0, limit);
}

const active = scanDir(bp);
const done = scanDir(doneDir, "DONE");

const groups = {
  READY:   active.filter(i => i.status === "READY"),
  REFINED: active.filter(i => i.status === "REFINED"),
  RAW:     active.filter(i => i.status === "RAW"),
  DONE:    done,
};

const today = new Date().toISOString().slice(0, 10);
const lines = [`# Backlog Index — updated ${today}`, ""];

for (const [label, items] of Object.entries(groups)) {
  const names = items.map(i => i.name).join("  ");
  lines.push(`${label.padEnd(8)} (${items.length})${names ? "  " + names : ""}`);
}

const history = scanHistory();
if (history.length > 0) {
  lines.push("", "HISTORY");
  for (const e of history) {
    lines.push(`${e.date}  ${e.slug}  ${e.event}`);
  }
}

fs.mkdirSync(bp, { recursive: true });
fs.writeFileSync(indexPath, lines.join("\n") + "\n");
console.log(`Updated ${indexPath}`);
