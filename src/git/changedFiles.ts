import { promises as fs } from "node:fs";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import path from "node:path";
import { normalizeRelativePath } from "../utils/paths";

const execFileAsync = promisify(execFile);

export async function changedFilesFromGit(root: string, since: string): Promise<string[]> {
  const { stdout } = await execFileAsync("git", ["diff", "--name-only", since, "--"], {
    cwd: root
  });
  return normalizeChangedFileList(stdout);
}

export async function changedFilesFromFixture(fixturePath: string): Promise<string[]> {
  return normalizeChangedFileList(await fs.readFile(path.resolve(fixturePath), "utf8"));
}

function normalizeChangedFileList(text: string): string[] {
  return text
    .split(/\r?\n/g)
    .map((line) => normalizeRelativePath(line.trim()))
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));
}
