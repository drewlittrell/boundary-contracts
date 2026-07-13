import { describe, expect, it } from "vitest";
import { evaluateBoundaries } from "../../src/contracts/evaluateBoundaries";
import type { BoundaryContracts, BoundaryException } from "../../src/contracts/types";
import type { RepoScan } from "../../src/scan/types";

const contracts: BoundaryContracts = {
  version: "0.1",
  layers: {
    app: { paths: ["app/**"], mayImport: [] },
    generated: { paths: ["generated/**"], mayImport: [], protected: true }
  },
  changeScopes: {
    app: { allowedPaths: ["app/**"] }
  }
};

const scan: RepoScan = {
  schemaVersion: 1,
  generatedAt: "now",
  root: "/repo",
  files: ["app/route.ts", "generated/contracts.ts", "scripts/tool.ts"],
  imports: [
    {
      id: "import-0001",
      fromFile: "app/route.ts",
      importPath: "../generated/contracts",
      resolvedTo: "generated/contracts.ts",
      kind: "static"
    }
  ],
  classifications: [
    { file: "app/route.ts", layerIds: ["app"], ownerIds: [], protected: false },
    { file: "generated/contracts.ts", layerIds: ["generated"], ownerIds: [], protected: true },
    { file: "scripts/tool.ts", layerIds: [], ownerIds: [], protected: false }
  ]
};

describe("evaluateBoundaries", () => {
  it("evaluates scan rules without diff-only rules", () => {
    const violations = evaluateBoundaries({
      scan,
      contracts,
      exceptions: [],
      mode: "scan",
      scope: "app",
      changedFiles: ["generated/contracts.ts"]
    });

    expect(violations.map((violation) => violation.kind)).toEqual([
      "layer_import",
      "unclassified_file"
    ]);
  });

  it("evaluates scan and diff rules in their existing order", () => {
    const violations = evaluateBoundaries({
      scan,
      contracts,
      exceptions: [],
      mode: "diff",
      scope: "app",
      changedFiles: ["generated/contracts.ts"]
    });

    expect(violations.map((violation) => violation.kind)).toEqual([
      "layer_import",
      "unclassified_file",
      "out_of_scope_change",
      "protected_path"
    ]);
  });

  it("applies active exceptions to matching violations", () => {
    const exceptions: BoundaryException[] = [
      {
        id: "generated-import",
        rule: "app-may-import",
        path: "app/route.ts",
        reason: "Temporary generated contract import.",
        owner: "architecture",
        expires: "2099-01-01"
      }
    ];

    const violations = evaluateBoundaries({
      scan,
      contracts,
      exceptions,
      mode: "scan",
      changedFiles: []
    });

    expect(violations.map((violation) => violation.kind)).toEqual(["unclassified_file"]);
  });
});
