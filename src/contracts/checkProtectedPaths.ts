import type { BoundaryContracts } from "./types";
import type { BoundaryViolation } from "../reports/types";
import { matchesAny } from "../utils/match";

export function checkProtectedPaths(
  changedFiles: string[],
  contracts: BoundaryContracts
): BoundaryViolation[] {
  const violations: BoundaryViolation[] = [];
  for (const rule of contracts.protectedPaths ?? []) {
    for (const file of changedFiles) {
      if (!matchesAny(file, rule.paths)) {
        continue;
      }
      violations.push({
        id: `protected-path:${rule.id}:${file}`,
        kind: "protected_path",
        status: "fail",
        message: `${file} changed, but it is protected by ${rule.id}.`,
        files: [file],
        ruleId: rule.id,
        suggestion: rule.reason
      });
    }
  }
  for (const [layerId, layer] of Object.entries(contracts.layers)) {
    if (!layer.protected) {
      continue;
    }
    for (const file of changedFiles) {
      if (!matchesAny(file, layer.paths)) {
        continue;
      }
      if (violations.some((violation) => violation.files.includes(file) && violation.kind === "protected_path")) {
        continue;
      }
      violations.push({
        id: `protected-layer:${layerId}:${file}`,
        kind: "protected_path",
        status: "fail",
        message: `${file} changed, but layer ${layerId} is protected.`,
        files: [file],
        ruleId: layerId,
        suggestion: "Update this file through its generator or declare a narrow exception."
      });
    }
  }
  return violations;
}
