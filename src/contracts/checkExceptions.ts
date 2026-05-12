import type { BoundaryException } from "./types";
import type { BoundaryViolation } from "../reports/types";
import { matchesAny } from "../utils/match";

export interface ExceptionResult {
  violations: BoundaryViolation[];
}

export function checkExceptions(
  violations: BoundaryViolation[],
  exceptions: BoundaryException[],
  now = new Date()
): ExceptionResult {
  const usedExceptionIds = new Set<string>();
  const output: BoundaryViolation[] = [];

  for (const violation of violations) {
    const matching = exceptions.filter((exception) => exceptionMatchesViolation(exception, violation));
    const expired = matching.find((exception) => isExpired(exception, now));
    if (expired) {
      usedExceptionIds.add(expired.id);
      output.push({
        id: `expired-exception:${expired.id}:${violation.id}`,
        kind: "expired_exception",
        status: "fail",
        message: `Exception ${expired.id} matched ${violation.id}, but expired on ${expired.expires}.`,
        files: violation.files,
        ruleId: violation.ruleId,
        exceptionId: expired.id,
        suggestion: "Remove the exception or renew it with a current owner, reason, and expiry."
      });
      continue;
    }
    const active = matching[0];
    if (active) {
      usedExceptionIds.add(active.id);
      continue;
    }
    output.push(violation);
  }

  for (const exception of exceptions) {
    if (!usedExceptionIds.has(exception.id)) {
      output.push({
        id: `unused-exception:${exception.id}`,
        kind: "unused_exception",
        status: "warn",
        message: `Exception ${exception.id} did not match any current violation.`,
        files: [exception.path],
        ruleId: exception.rule,
        exceptionId: exception.id,
        suggestion: "Remove stale exceptions so boundary drift stays visible."
      });
    }
  }

  return { violations: output };
}

function exceptionMatchesViolation(exception: BoundaryException, violation: BoundaryViolation): boolean {
  const ruleMatches = exception.rule === violation.ruleId || exception.rule === violation.kind;
  const pathMatches = violation.files.some((file) => matchesAny(file, [exception.path]));
  return ruleMatches && pathMatches;
}

function isExpired(exception: BoundaryException, now: Date): boolean {
  const expires = new Date(`${exception.expires}T23:59:59.999Z`);
  return Number.isNaN(expires.getTime()) || expires < now;
}
