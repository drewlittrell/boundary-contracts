import type { BoundaryReport } from "./types";

export function terminalReport(report: BoundaryReport): string {
  const lines = [
    "Boundary Contracts",
    `Status: ${report.status}`,
    `Mode: ${report.mode}`
  ];
  if (report.scope) {
    lines.push(`Scope: ${report.scope}`);
  }
  if (report.violations.length === 0) {
    lines.push("Violations: none");
    return lines.join("\n");
  }
  lines.push("Violations:");
  for (const violation of report.violations) {
    const files = violation.files.join(" -> ");
    lines.push(`- ${violation.kind}${files ? ` ${files}` : ""}`);
  }
  return lines.join("\n");
}
