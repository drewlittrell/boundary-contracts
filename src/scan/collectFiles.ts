import { promises as fs } from "node:fs";
import path from "node:path";
import type { SourceFile } from "./types";
import { relativeFrom } from "../utils/paths";
import { matchesAny } from "../utils/match";

const includePatterns = ["**/*.ts", "**/*.tsx", "**/*.js", "**/*.jsx"];
const excludePatterns = [
  "node_modules/**",
  "dist/**",
  "build/**",
  ".next/**",
  "coverage/**",
  ".boundary-contracts/**"
];

export async function collectFiles(root: string): Promise<SourceFile[]> {
  const absoluteRoot = path.resolve(root);
  const files: SourceFile[] = [];

  async function walk(directory: string): Promise<void> {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(directory, entry.name);
      const relativePath = relativeFrom(absoluteRoot, absolutePath);
      if (matchesAny(relativePath, excludePatterns)) {
        continue;
      }
      if (entry.isDirectory()) {
        await walk(absolutePath);
        continue;
      }
      if (!entry.isFile() || !matchesAny(relativePath, includePatterns)) {
        continue;
      }
      files.push({
        absolutePath,
        relativePath,
        text: await fs.readFile(absolutePath, "utf8")
      });
    }
  }

  await walk(absoluteRoot);
  return files.sort((a, b) => a.relativePath.localeCompare(b.relativePath));
}
