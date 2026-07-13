import type { RepoScan } from "../scan/types";
import type { BoundaryViolation } from "../reports/types";
import { checkChangeScopes } from "./checkChangeScopes";
import { checkExceptions } from "./checkExceptions";
import { checkForbiddenImports } from "./checkForbiddenImports";
import { checkLayerRules, checkUnclassifiedFiles } from "./checkLayerRules";
import { checkProtectedPaths } from "./checkProtectedPaths";
import type { BoundaryContracts, BoundaryException } from "./types";

export interface EvaluateBoundariesOptions {
  scan: RepoScan;
  contracts: BoundaryContracts;
  exceptions: BoundaryException[];
  mode: "scan" | "diff";
  scope?: string;
  changedFiles: string[];
}

export function evaluateBoundaries(options: EvaluateBoundariesOptions): BoundaryViolation[] {
  const violations: BoundaryViolation[] = [
    ...checkLayerRules(options.scan, options.contracts),
    ...checkForbiddenImports(options.scan, options.contracts),
    ...checkUnclassifiedFiles(options.scan)
  ];

  if (options.mode === "diff") {
    violations.push(
      ...checkChangeScopes(options.changedFiles, options.scope, options.scan, options.contracts),
      ...checkProtectedPaths(options.changedFiles, options.contracts)
    );
  }

  return checkExceptions(violations, options.exceptions).violations;
}
