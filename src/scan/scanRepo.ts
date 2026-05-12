import path from "node:path";
import { loadBoundaryContracts } from "../contracts/loadBoundaryContracts";
import type { BoundaryContracts } from "../contracts/types";
import { deterministicTimestamp } from "../utils/paths";
import { collectFiles } from "./collectFiles";
import { parseImports } from "./parseImports";
import { classifyFiles } from "./classifyFiles";
import type { RepoScan } from "./types";

export async function scanRepo(root: string, contracts?: BoundaryContracts): Promise<RepoScan> {
  const absoluteRoot = path.resolve(root);
  const loadedContracts = contracts ?? (await loadBoundaryContracts(absoluteRoot));
  const sourceFiles = await collectFiles(absoluteRoot);
  const files = sourceFiles.map((file) => file.relativePath);
  return {
    schemaVersion: 1,
    generatedAt: deterministicTimestamp(),
    root: absoluteRoot,
    files,
    imports: parseImports(sourceFiles),
    classifications: classifyFiles(files, loadedContracts)
  };
}
