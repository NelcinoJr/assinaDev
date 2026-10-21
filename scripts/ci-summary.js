#!/usr/bin/env node
// Converte o relatório JSON do Vitest em Markdown para o resumo do GitHub Actions.
// Uso: node scripts/ci-summary.js [test-results.json] >> "$GITHUB_STEP_SUMMARY"

import fs from "node:fs";

const file = process.argv[2] ?? "test-results.json";

if (!fs.existsSync(file)) {
  console.log("## ❌ Testes de aceite\n\nRelatório não encontrado: os testes não chegaram a rodar.");
  process.exit(0);
}

const report = JSON.parse(fs.readFileSync(file, "utf8"));

const ICONS = { passed: "✅", failed: "❌", todo: "📝", pending: "⏭️", skipped: "⏭️" };
const LABELS = { passed: "Passou", failed: "Falhou", todo: "Pendente", pending: "Ignorado", skipped: "Ignorado" };

const env = process.env;
const commit = env.GITHUB_SHA?.slice(0, 7) ?? "local";
const runUrl = env.GITHUB_RUN_ID
  ? `${env.GITHUB_SERVER_URL}/${env.GITHUB_REPOSITORY}/actions/runs/${env.GITHUB_RUN_ID}`
  : null;
const durationSec = (
  report.testResults.reduce((sum, r) => sum + ((r.endTime ?? 0) - (r.startTime ?? 0)), 0) / 1000
).toFixed(1);

const lines = [];
lines.push(`## ${report.success ? "✅" : "❌"} Testes de aceite — Node ${process.versions.node}`);
lines.push("");
lines.push("| Total | Passaram | Falharam | Pendentes | Duração |");
lines.push("|---:|---:|---:|---:|---:|");
lines.push(
  `| ${report.numTotalTests} | ${report.numPassedTests} | ${report.numFailedTests} | ` +
    `${(report.numTodoTests ?? 0) + (report.numPendingTests ?? 0)} | ${durationSec}s |`
);
lines.push("");
lines.push(
  `Commit \`${commit}\` · ${new Date(report.startTime).toISOString()}` + (runUrl ? ` · [execução](${runUrl})` : "")
);

for (const suite of report.testResults) {
  const groups = new Map();
  for (const test of suite.assertionResults) {
    const key = test.ancestorTitles.join(" › ") || suite.name;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(test);
  }

  for (const [title, tests] of groups) {
    lines.push("");
    lines.push(`### ${title}`);
    lines.push("");
    lines.push("| | Critério | Resultado | Tempo |");
    lines.push("|---|---|---|---:|");
    for (const t of tests) {
      const time = t.duration != null ? `${Math.round(t.duration)} ms` : "—";
      lines.push(`| ${ICONS[t.status] ?? "•"} | ${t.title.replaceAll("|", "\\|")} | ${LABELS[t.status] ?? t.status} | ${time} |`);
    }
  }
}

const failures = report.testResults.flatMap((s) => s.assertionResults.filter((t) => t.status === "failed"));
if (failures.length > 0) {
  lines.push("");
  lines.push("### Falhas");
  for (const t of failures) {
    lines.push("");
    lines.push(`<details><summary>${t.fullName}</summary>`);
    lines.push("");
    lines.push("```");
    lines.push((t.failureMessages ?? []).join("\n").slice(0, 4000));
    lines.push("```");
    lines.push("</details>");
  }
}

console.log(lines.join("\n"));
