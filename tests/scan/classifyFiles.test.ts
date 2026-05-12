import { describe, expect, it } from "vitest";
import { classifyFiles } from "../../src/scan/classifyFiles";
import type { BoundaryContracts } from "../../src/contracts/types";

describe("classifyFiles", () => {
  it("classifies layers, owners, and protected paths", () => {
    const contracts: BoundaryContracts = {
      version: "0.1",
      layers: {
        services: { paths: ["services/**"], mayImport: ["domain"] },
        domain: { paths: ["domain/**"], mayImport: [] },
        generated: { paths: ["generated/**"], mayImport: [], protected: true }
      },
      owners: {
        auth: { paths: ["services/authService.ts"] }
      },
      protectedPaths: [{ id: "generated", paths: ["generated/**"], reason: "generated" }]
    };

    expect(classifyFiles(["services/authService.ts", "generated/contracts.ts"], contracts)).toEqual([
      {
        file: "services/authService.ts",
        layerIds: ["services"],
        ownerIds: ["auth"],
        protected: false
      },
      {
        file: "generated/contracts.ts",
        layerIds: ["generated"],
        ownerIds: [],
        protected: true
      }
    ]);
  });
});
