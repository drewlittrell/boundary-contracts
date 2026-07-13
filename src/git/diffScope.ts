import { changedFilesFromFixture, changedFilesFromGit } from "./changedFiles";

export function validateDiffSource(input: { since?: string; changedFiles?: string }): void {
  const hasSince = input.since !== undefined;
  const hasChangedFiles = input.changedFiles !== undefined;

  if (!hasSince && !hasChangedFiles) {
    throw new Error("Provide exactly one change source: --since <ref> or --changed-files <path>.");
  }
  if (hasSince && hasChangedFiles) {
    throw new Error("--since and --changed-files are mutually exclusive; provide exactly one change source.");
  }
}

export async function resolveChangedFiles(input: {
  root: string;
  since?: string;
  changedFiles?: string;
}): Promise<string[]> {
  validateDiffSource(input);

  if (input.changedFiles !== undefined) {
    return changedFilesFromFixture(input.changedFiles);
  }
  if (input.since !== undefined) {
    return changedFilesFromGit(input.root, input.since);
  }
  return [];
}
