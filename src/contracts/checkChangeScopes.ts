import type { BoundaryContracts } from "./types";
import type { RepoScan } from "../scan/types";
import type { BoundaryViolation } from "../reports/types";
import { matchesAny } from "../utils/match";

export function checkChangeScopes(
  changedFiles: string[],
  scopeId: string | undefined,
  scan: RepoScan,
  contracts: BoundaryContracts
): BoundaryViolation[] {
  if (!scopeId) {
    return [];
  }
  const scope = contracts.changeScopes?.[scopeId];
  if (!scope) {
    return [
      {
        id: `unknown-scope:${scopeId}`,
        kind: "out_of_scope_change",
        status: "fail",
        message: `Unknown change scope: ${scopeId}.`,
        files: [],
        ruleId: scopeId,
        suggestion: "Declare the scope in boundary.contracts.yaml or use a declared scope."
      }
    ];
  }

  const classifications = new Map(scan.classifications.map((item) => [item.file, item]));
  const violations: BoundaryViolation[] = [];
  for (const file of changedFiles) {
    const inAllowedPath = matchesAny(file, scope.allowedPaths);
    if (!inAllowedPath) {
      violations.push({
        id: `out-of-scope-path:${scopeId}:${file}`,
        kind: "out_of_scope_change",
        status: "fail",
        message: `${file} was changed, but ${scopeId} does not allow that path.`,
        files: [file],
        ruleId: scopeId,
        suggestion: "Move this change to a matching scope, or update the declared scope intentionally."
      });
      continue;
    }
    if (scope.requiredOwners?.length) {
      const ownerIds = classifications.get(file)?.ownerIds ?? [];
      const hasRequiredOwner = ownerIds.some((ownerId) => scope.requiredOwners?.includes(ownerId));
      if (!hasRequiredOwner) {
        violations.push({
          id: `out-of-scope-owner:${scopeId}:${file}`,
          kind: "out_of_scope_change",
          status: "fail",
          message: `${file} was changed, but it is not owned by ${scope.requiredOwners.join(", ")}.`,
          files: [file],
          ruleId: scopeId,
          suggestion: "Add ownership for the path or use a scope whose required owners match this change."
        });
      }
    }
  }
  return violations;
}
