import { describe, expect, it } from "vitest";
import { checkChangeScopes } from "../../src/contracts/checkChangeScopes";
import { checkExceptions } from "../../src/contracts/checkExceptions";
import { checkForbiddenImports } from "../../src/contracts/checkForbiddenImports";
import { checkLayerRules, checkUnclassifiedFiles } from "../../src/contracts/checkLayerRules";
import { checkProtectedPaths } from "../../src/contracts/checkProtectedPaths";
import type { BoundaryContracts } from "../../src/contracts/types";
import type { RepoScan } from "../../src/scan/types";

const contracts: BoundaryContracts = {
  version: "0.1",
  layers: {
    app: { paths: ["app/**"], mayImport: ["services", "domain"] },
    services: { paths: ["services/**"], mayImport: ["domain"] },
    domain: { paths: ["domain/**"], mayImport: [] },
    generated: { paths: ["generated/**"], mayImport: [], protected: true }
  },
  owners: {
    auth: { paths: ["app/api/login/**", "services/authService.ts", "domain/auth.ts"] },
    billing: { paths: ["services/billingService.ts"] }
  },
  changeScopes: {
    "auth-login-fix": {
      allowedPaths: ["app/api/login/**", "services/authService.ts", "domain/auth.ts"],
      requiredOwners: ["auth"]
    }
  },
  forbiddenImports: [
    {
      id: "services-must-not-import-app",
      from: ["services/**"],
      to: ["app/**"],
      reason: "Service code must not depend on app route handlers."
    }
  ],
  protectedPaths: [{ id: "generated-contracts", paths: ["generated/**"], reason: "Generated." }]
};

const scan: RepoScan = {
  schemaVersion: 1,
  generatedAt: "now",
  root: "/repo",
  files: [
    "app/api/login/route.ts",
    "services/authService.ts",
    "services/billingService.ts",
    "domain/auth.ts",
    "generated/contracts.ts",
    "scripts/tool.ts"
  ],
  imports: [
    {
      id: "import-0001",
      fromFile: "services/authService.ts",
      importPath: "../app/api/login/route",
      resolvedTo: "app/api/login/route.ts",
      kind: "static"
    }
  ],
  classifications: [
    { file: "app/api/login/route.ts", layerIds: ["app"], ownerIds: ["auth"], protected: false },
    { file: "services/authService.ts", layerIds: ["services"], ownerIds: ["auth"], protected: false },
    { file: "services/billingService.ts", layerIds: ["services"], ownerIds: ["billing"], protected: false },
    { file: "domain/auth.ts", layerIds: ["domain"], ownerIds: ["auth"], protected: false },
    { file: "generated/contracts.ts", layerIds: ["generated"], ownerIds: [], protected: true },
    { file: "scripts/tool.ts", layerIds: [], ownerIds: [], protected: false }
  ]
};

describe("boundary checks", () => {
  it("detects forbidden import violations", () => {
    expect(checkForbiddenImports(scan, contracts)).toHaveLength(1);
  });

  it("detects layer import violations", () => {
    expect(checkLayerRules(scan, contracts)).toHaveLength(1);
  });

  it("warns on unclassified files", () => {
    expect(checkUnclassifiedFiles(scan)[0]?.kind).toBe("unclassified_file");
  });

  it("passes in-scope changes", () => {
    expect(checkChangeScopes(["services/authService.ts"], "auth-login-fix", scan, contracts)).toHaveLength(0);
  });

  it("fails out-of-scope changes", () => {
    const violations = checkChangeScopes(["services/billingService.ts"], "auth-login-fix", scan, contracts);
    expect(violations[0]?.kind).toBe("out_of_scope_change");
  });

  it("fails protected path changes", () => {
    const violations = checkProtectedPaths(["generated/contracts.ts"], contracts);
    expect(violations[0]?.kind).toBe("protected_path");
  });

  it("suppresses active exceptions", () => {
    const violation = checkForbiddenImports(scan, contracts)[0];
    const result = checkExceptions(
      [violation],
      [
        {
          id: "legacy-auth-adapter",
          rule: "services-must-not-import-app",
          path: "services/authService.ts",
          reason: "Legacy adapter pending extraction.",
          owner: "drew",
          expires: "2099-01-01"
        }
      ],
      new Date("2026-01-01T00:00:00Z")
    );
    expect(result.violations).toHaveLength(0);
  });

  it("fails expired exceptions", () => {
    const violation = checkForbiddenImports(scan, contracts)[0];
    const result = checkExceptions(
      [violation],
      [
        {
          id: "legacy-auth-adapter",
          rule: "services-must-not-import-app",
          path: "services/authService.ts",
          reason: "Legacy adapter pending extraction.",
          owner: "drew",
          expires: "2020-01-01"
        }
      ],
      new Date("2026-01-01T00:00:00Z")
    );
    expect(result.violations[0]?.kind).toBe("expired_exception");
  });

  it("warns on unused exceptions", () => {
    const result = checkExceptions(
      [],
      [
        {
          id: "unused",
          rule: "services-must-not-import-app",
          path: "services/authService.ts",
          reason: "Old.",
          owner: "drew",
          expires: "2099-01-01"
        }
      ]
    );
    expect(result.violations[0]?.kind).toBe("unused_exception");
  });
});
