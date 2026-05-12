import type { BoundaryReport, BoundaryStatus, BoundaryViolation } from "./types";
import type { RepoScan } from "../scan/types";
import { deterministicTimestamp } from "../utils/paths";

export function buildBoundaryReport(input: {
  scan: RepoScan;
  mode: "scan" | "diff";
  scope?: string;
  violations: BoundaryViolation[];
}): BoundaryReport {
  const status = summarizeStatus(input.violations);
  return {
    schemaVersion: 1,
    generatedAt: deterministicTimestamp(),
    status,
    mode: input.mode,
    scope: input.scope,
    summary: {
      filesScanned: input.scan.files.length,
      importsScanned: input.scan.imports.length,
      violations: input.violations.filter((violation) => violation.status === "fail").length,
      warnings: input.violations.filter((violation) => violation.status === "warn").length
    },
    violations: input.violations
  };
}

function summarizeStatus(violations: BoundaryViolation[]): BoundaryStatus {
  if (violations.some((violation) => violation.status === "fail")) {
    return "fail";
  }
  if (violations.some((violation) => violation.status === "warn")) {
    return "warn";
  }
  return "pass";
}
