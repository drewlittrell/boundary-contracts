import { execFile } from "node:child_process";
import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { describe, expect, it } from "vitest";

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

async function runCli(args: string[]): Promise<{ exitCode: number; stdout: string; stderr: string }> {
  try {
    const result = await execFileAsync(process.execPath, ["--import", "tsx", "src/cli.ts", ...args], {
      cwd: repoRoot,
      env: { ...process.env, BOUNDARY_CONTRACTS_DETERMINISTIC: "1" }
    });
    return { exitCode: 0, stdout: String(result.stdout), stderr: String(result.stderr) };
  } catch (error) {
    const failed = error as { code?: number; stdout?: string; stderr?: string };
    return { exitCode: failed.code ?? 1, stdout: String(failed.stdout ?? ""), stderr: String(failed.stderr ?? "") };
  }
}

async function createFixtureRoot(): Promise<{ root: string; changedFiles: string }> {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), "boundary-cli-diff-"));
  await fs.mkdir(path.join(root, "app"), { recursive: true });
  await fs.writeFile(path.join(root, "app", "a.ts"), "export const a = 1;\n", "utf8");
  await fs.writeFile(path.join(root, "changed-files.txt"), "app/a.ts\n", "utf8");
  await fs.writeFile(
    path.join(root, "boundary.contracts.yaml"),
    `version: "0.1"
layers:
  app:
    paths:
      - app/**
    mayImport: []
owners:
  auth:
    paths:
      - app/**
changeScopes:
  auth-login-fix:
    description: Changes related to the login flow.
    allowedPaths:
      - app/**
    requiredOwners:
      - auth
exceptions:
  file: boundary.exceptions.yaml
`,
    "utf8"
  );
  await fs.writeFile(path.join(root, "boundary.exceptions.yaml"), "exceptions: []\n", "utf8");
  return { root, changedFiles: path.join(root, "changed-files.txt") };
}

describe("diff command change source validation", () => {
  it("rejects a missing change source before writing a successful report", async () => {
    const outputDir = await fs.mkdtemp(path.join(os.tmpdir(), "boundary-cli-output-"));
    const jsonOut = path.join(outputDir, "report.json");

    const result = await runCli(["diff", outputDir, "--scope", "auth-login-fix", "--json-out", jsonOut]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("Provide exactly one change source");
    await expect(fs.access(jsonOut)).rejects.toThrow();
  });

  it("rejects conflicting change sources before writing a successful report", async () => {
    const { root, changedFiles } = await createFixtureRoot();
    const jsonOut = path.join(root, "conflict-report.json");

    const result = await runCli([
      "diff",
      root,
      "--scope",
      "auth-login-fix",
      "--since",
      "main",
      "--changed-files",
      changedFiles,
      "--json-out",
      jsonOut
    ]);

    expect(result.exitCode).not.toBe(0);
    expect(result.stderr).toContain("--since and --changed-files are mutually exclusive");
    await expect(fs.access(jsonOut)).rejects.toThrow();
  });

  it("keeps valid changed-files invocations working", async () => {
    const { root, changedFiles } = await createFixtureRoot();

    const result = await runCli(["diff", root, "--scope", "auth-login-fix", "--changed-files", changedFiles]);

    expect(result.exitCode).toBe(0);
    expect(result.stdout).toContain("Boundary Contracts");
    expect(result.stdout).toContain("Status: pass");
  });
});
