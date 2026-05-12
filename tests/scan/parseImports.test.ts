import { describe, expect, it } from "vitest";
import { parseImports, resolveRelativeImport } from "../../src/scan/parseImports";
import type { SourceFile } from "../../src/scan/types";

describe("parseImports", () => {
  it("detects static, dynamic, and require imports", () => {
    const files: SourceFile[] = [
      {
        absolutePath: "/repo/services/authService.ts",
        relativePath: "services/authService.ts",
        text: `
          import { authenticate } from "../domain/auth";
          const lazy = import("../domain/lazy");
          const config = require("../domain/config");
        `
      },
      {
        absolutePath: "/repo/domain/auth.ts",
        relativePath: "domain/auth.ts",
        text: ""
      },
      {
        absolutePath: "/repo/domain/lazy.ts",
        relativePath: "domain/lazy.ts",
        text: ""
      },
      {
        absolutePath: "/repo/domain/config.ts",
        relativePath: "domain/config.ts",
        text: ""
      }
    ];

    const imports = parseImports(files);

    expect(imports.map((item) => item.resolvedTo)).toEqual([
      "domain/auth.ts",
      "domain/lazy.ts",
      "domain/config.ts"
    ]);
    expect(imports.map((item) => item.kind)).toEqual(["static", "dynamic", "dynamic"]);
  });

  it("resolves extensionless imports and index files", () => {
    const knownFiles = new Set(["domain/auth.ts", "domain/session/index.ts"]);

    expect(resolveRelativeImport("services/authService.ts", "../domain/auth", knownFiles)).toBe("domain/auth.ts");
    expect(resolveRelativeImport("services/authService.ts", "../domain/session", knownFiles)).toBe("domain/session/index.ts");
    expect(resolveRelativeImport("services/authService.ts", "react", knownFiles)).toBeUndefined();
  });
});
