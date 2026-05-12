import { describe, expect, it } from "vitest";
import { runBoundaryCheck } from "../../src/index";

describe("example scenarios", () => {
  it("healthy scenario passes", async () => {
    const { report } = await runBoundaryCheck({
      root: "examples/nextjs-auth/scenarios/healthy",
      mode: "scan"
    });
    expect(report.status).toBe("pass");
  });

  it("cross-boundary import scenario fails", async () => {
    const { report } = await runBoundaryCheck({
      root: "examples/nextjs-auth/scenarios/drift-cross-boundary-import",
      mode: "scan"
    });
    expect(report.status).toBe("fail");
    expect(report.violations.map((violation) => violation.kind)).toContain("forbidden_import");
  });

  it("out-of-scope scenario fails in diff mode", async () => {
    const { report } = await runBoundaryCheck({
      root: "examples/nextjs-auth/scenarios/drift-out-of-scope-change",
      mode: "diff",
      scope: "auth-login-fix",
      changedFiles: "examples/nextjs-auth/scenarios/drift-out-of-scope-change/changed-files.txt"
    });
    expect(report.status).toBe("fail");
    expect(report.violations.map((violation) => violation.kind)).toContain("out_of_scope_change");
  });

  it("protected path scenario fails in diff mode", async () => {
    const { report } = await runBoundaryCheck({
      root: "examples/nextjs-auth/scenarios/drift-protected-path-change",
      mode: "diff",
      scope: "auth-login-fix",
      changedFiles: "examples/nextjs-auth/scenarios/drift-protected-path-change/changed-files.txt"
    });
    expect(report.status).toBe("fail");
    expect(report.violations.map((violation) => violation.kind)).toContain("protected_path");
  });
});
