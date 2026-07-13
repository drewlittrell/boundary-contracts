import path from "node:path";
import { promises as fs } from "node:fs";
import { loadBoundaryContracts, loadBoundaryExceptions } from "./contracts/loadBoundaryContracts";
import { scanRepo } from "./scan/scanRepo";
import type { BoundaryReport } from "./reports/types";
import { buildBoundaryReport } from "./reports/jsonReport";
import { evaluateBoundaries } from "./contracts/evaluateBoundaries";
import { writeJsonFile } from "./utils/fs";
import { markdownReport } from "./reports/markdownReport";
import { resolveChangedFiles } from "./git/diffScope";

export interface RunBoundaryCheckOptions {
  root: string;
  mode: "scan" | "diff";
  scope?: string;
  since?: string;
  changedFiles?: string;
}

export async function runBoundaryCheck(options: RunBoundaryCheckOptions): Promise<{
  report: BoundaryReport;
  scanPath: string;
  reportPath: string;
}> {
  const root = path.resolve(options.root);
  const contracts = await loadBoundaryContracts(root);
  const exceptionsFile = await loadBoundaryExceptions(root, contracts);
  const scan = await scanRepo(root, contracts);
  const changedFiles = options.mode === "diff"
    ? await resolveChangedFiles({ root, since: options.since, changedFiles: options.changedFiles })
    : [];

  const violations = evaluateBoundaries({
    scan,
    contracts,
    exceptions: exceptionsFile.exceptions,
    mode: options.mode,
    scope: options.scope,
    changedFiles
  });
  const report = buildBoundaryReport({
    scan,
    mode: options.mode,
    scope: options.scope,
    violations
  });

  const outputDir = path.join(root, ".boundary-contracts");
  const scanPath = path.join(outputDir, "scan.json");
  const reportPath = path.join(outputDir, "report.json");
  await writeJsonFile(scanPath, scan);
  await writeJsonFile(reportPath, report);

  return { report, scanPath, reportPath };
}

export async function writeReportOutputs(input: {
  report: BoundaryReport;
  out?: string;
  jsonOut?: string;
}): Promise<void> {
  if (input.out) {
    await fs.mkdir(path.dirname(path.resolve(input.out)), { recursive: true });
    await fs.writeFile(path.resolve(input.out), markdownReport(input.report), "utf8");
  }
  if (input.jsonOut) {
    await writeJsonFile(path.resolve(input.jsonOut), input.report);
  }
}
