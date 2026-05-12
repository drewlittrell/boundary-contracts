import { changedFilesFromFixture, changedFilesFromGit } from "./changedFiles";

export async function resolveChangedFiles(input: {
  root: string;
  since?: string;
  changedFiles?: string;
}): Promise<string[]> {
  if (input.changedFiles) {
    return changedFilesFromFixture(input.changedFiles);
  }
  if (input.since) {
    return changedFilesFromGit(input.root, input.since);
  }
  return [];
}
