import { describe, expect, it } from "vitest";
import { buildBoundaryReport } from "../../src/reports/jsonReport";
import { markdownReport } from "../../src/reports/markdownReport";
import type { RepoScan } from "../../src/scan/types";

describe("markdownReport", () => {
  it("renders summary and violations", () => {
    const scan: RepoScan = {
      schemaVersion: 1,
      generatedAt: "now",
      root: "/repo",
      files: ["services/authService.ts"],
      imports: [],
      classifications: []
    };
    const report = buildBoundaryReport({
      scan,
      mode: "diff",
      scope: "auth-login-fix",
      violations: [
        {
          id: "out",
          kind: "out_of_scope_change",
          status: "fail",
          message: "services/billingService.ts was changed outside the scope.",
          files: ["services/billingService.ts"],
          ruleId: "auth-login-fix"
        }
      ]
    });

    expect(markdownReport(report)).toContain("# Boundary Contracts Report");
    expect(markdownReport(report)).toContain("Out Of Scope Change");
  });
});
