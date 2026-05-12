#!/usr/bin/env node
import { Command } from "commander";
import path from "node:path";
import { promises as fs } from "node:fs";
import { defaultBoundaryContractsYaml, defaultBoundaryExceptionsYaml } from "./config/defaults";
import { ensureDir, pathExists, writeJsonFile } from "./utils/fs";
import { runBoundaryCheck, writeReportOutputs } from "./index";
import { terminalReport } from "./reports/terminalReport";
import { markdownReport } from "./reports/markdownReport";

const program = new Command();

program
  .name("boundary-contracts")
  .description("Make architecture and change-scope boundaries executable for AI-assisted codebases.")
  .version("0.1.0");

program
  .command("init")
  .argument("[root]", "repo root", ".")
  .description("create starter boundary contract config")
  .action(async (root: string) => {
    const targetRoot = path.resolve(root);
    await ensureDir(targetRoot);
    await writeIfMissing(path.join(targetRoot, "boundary.contracts.yaml"), defaultBoundaryContractsYaml);
    await writeIfMissing(path.join(targetRoot, "boundary.exceptions.yaml"), defaultBoundaryExceptionsYaml);
    await ensureDir(path.join(targetRoot, ".boundary-contracts"));
    console.log(`Initialized Boundary Contracts in ${targetRoot}`);
  });

program
  .command("scan")
  .argument("[root]", "repo root", ".")
  .option("--out <path>", "write Markdown report")
  .option("--json-out <path>", "write JSON report")
  .option("--strict", "exit non-zero on warnings as well as failures")
  .description("inspect current repo files/imports against boundaries")
  .action(async (root: string, options: { out?: string; jsonOut?: string; strict?: boolean }) => {
    const { report } = await runBoundaryCheck({ root, mode: "scan" });
    await writeReportOutputs({ report, out: options.out, jsonOut: options.jsonOut });
    console.log(terminalReport(report));
    exitForStatus(report.status, options.strict);
  });

program
  .command("diff")
  .argument("[root]", "repo root", ".")
  .requiredOption("--scope <id>", "declared change scope")
  .option("--since <ref>", "git ref to diff against")
  .option("--changed-files <path>", "newline-delimited changed files fixture")
  .option("--out <path>", "write Markdown report")
  .option("--json-out <path>", "write JSON report")
  .option("--strict", "exit non-zero on warnings as well as failures")
  .description("inspect changed files against a declared change scope")
  .action(
    async (
      root: string,
      options: {
        scope: string;
        since?: string;
        changedFiles?: string;
        out?: string;
        jsonOut?: string;
        strict?: boolean;
      }
    ) => {
      const { report } = await runBoundaryCheck({
        root,
        mode: "diff",
        scope: options.scope,
        since: options.since,
        changedFiles: options.changedFiles
      });
      await writeReportOutputs({ report, out: options.out, jsonOut: options.jsonOut });
      console.log(terminalReport(report));
      exitForStatus(report.status, options.strict);
    }
  );

program
  .command("report")
  .argument("[root]", "repo root", ".")
  .option("--out <path>", "write Markdown report", ".boundary-contracts/report.md")
  .option("--json-out <path>", "write JSON report", ".boundary-contracts/report.json")
  .option("--strict", "exit non-zero on warnings as well as failures")
  .description("write Markdown and JSON reports for a full scan")
  .action(async (root: string, options: { out: string; jsonOut: string; strict?: boolean }) => {
    const targetRoot = path.resolve(root);
    const { report } = await runBoundaryCheck({ root: targetRoot, mode: "scan" });
    const out = resolveReportOutput(targetRoot, options.out, ".boundary-contracts/report.md");
    const jsonOut = resolveReportOutput(targetRoot, options.jsonOut, ".boundary-contracts/report.json");
    await writeReportOutputs({ report, out, jsonOut });
    console.log(terminalReport(report));
    exitForStatus(report.status, options.strict);
  });

program
  .command("render-report")
  .argument("<json>", "report JSON path")
  .description("render an existing JSON report as Markdown")
  .action(async (jsonPath: string) => {
    const report = JSON.parse(await fs.readFile(path.resolve(jsonPath), "utf8"));
    console.log(markdownReport(report));
  });

program.parseAsync().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});

async function writeIfMissing(target: string, contents: string): Promise<void> {
  if (await pathExists(target)) {
    return;
  }
  await fs.writeFile(target, contents, "utf8");
}

function exitForStatus(status: string, strict?: boolean): void {
  if (status === "fail" || (strict && status === "warn")) {
    process.exit(1);
  }
}

function resolveReportOutput(root: string, value: string, defaultValue: string): string {
  if (path.isAbsolute(value)) {
    return value;
  }
  return value === defaultValue ? path.join(root, value) : path.resolve(value);
}
