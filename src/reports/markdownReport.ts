import type { BoundaryReport, BoundaryViolation } from "./types";

export function markdownReport(report: BoundaryReport): string {
  const lines = [
    "# Boundary Contracts Report",
    "",
    `Status: ${report.status}  `,
    `Mode: ${report.mode}${report.scope ? `  \nScope: ${report.scope}` : ""}`,
    "",
    "## What This Report Means",
    "",
    "This report checks whether code stayed inside declared architecture and change-scope boundaries.",
    "",
    "## Summary",
    "",
    "| Files scanned | Imports scanned | Violations | Warnings |",
    "|---:|---:|---:|---:|",
    `| ${report.summary.filesScanned} | ${report.summary.importsScanned} | ${report.summary.violations} | ${report.summary.warnings} |`,
    "",
    "## Violations",
    ""
  ];

  if (report.violations.length === 0) {
    lines.push("No violations found.", "");
    return `${lines.join("\n").trimEnd()}\n`;
  }

  for (const violation of report.violations) {
    lines.push(...renderViolation(violation), "");
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

function renderViolation(violation: BoundaryViolation): string[] {
  const title = violation.kind
    .split("_")
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join(" ");
  const lines = [`### ${title}`, "", `Status: ${violation.status}`, "", violation.message];
  if (violation.files.length) {
    lines.push("", "Files:");
    for (const file of violation.files) {
      lines.push(`- \`${file}\``);
    }
  }
  if (violation.ruleId) {
    lines.push("", `Rule: \`${violation.ruleId}\``);
  }
  if (violation.exceptionId) {
    lines.push("", `Exception: \`${violation.exceptionId}\``);
  }
  if (violation.suggestion) {
    lines.push("", "Suggested fix:", "", `- ${violation.suggestion}`);
  }
  return lines;
}
