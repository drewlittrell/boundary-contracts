import type { BoundaryContracts } from "./types";
import type { RepoScan } from "../scan/types";
import type { BoundaryViolation } from "../reports/types";
import { matchesAny } from "../utils/match";

export function checkForbiddenImports(scan: RepoScan, contracts: BoundaryContracts): BoundaryViolation[] {
  const violations: BoundaryViolation[] = [];
  for (const rule of contracts.forbiddenImports ?? []) {
    for (const importSignal of scan.imports) {
      if (!importSignal.resolvedTo) {
        continue;
      }
      if (matchesAny(importSignal.fromFile, rule.from) && matchesAny(importSignal.resolvedTo, rule.to)) {
        violations.push({
          id: `forbidden-import:${rule.id}:${importSignal.id}`,
          kind: "forbidden_import",
          status: "fail",
          message: `${importSignal.fromFile} imports ${importSignal.resolvedTo}.`,
          files: [importSignal.fromFile, importSignal.resolvedTo],
          ruleId: rule.id,
          suggestion: rule.reason
        });
      }
    }
  }
  return violations;
}
