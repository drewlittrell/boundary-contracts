import { beforeEach, describe, expect, it, vi } from "vitest";
import { resolveChangedFiles } from "../../src/git/diffScope";
import { changedFilesFromFixture, changedFilesFromGit } from "../../src/git/changedFiles";

vi.mock("../../src/git/changedFiles", () => ({
  changedFilesFromFixture: vi.fn(),
  changedFilesFromGit: vi.fn()
}));

const mockedChangedFilesFromFixture = vi.mocked(changedFilesFromFixture);
const mockedChangedFilesFromGit = vi.mocked(changedFilesFromGit);

describe("resolveChangedFiles", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects when no change source is provided", async () => {
    await expect(resolveChangedFiles({ root: "/repo" })).rejects.toThrow(
      "Provide exactly one change source: --since <ref> or --changed-files <path>."
    );
  });

  it("rejects when both change sources are provided", async () => {
    await expect(
      resolveChangedFiles({ root: "/repo", since: "main", changedFiles: "changed-files.txt" })
    ).rejects.toThrow("--since and --changed-files are mutually exclusive; provide exactly one change source.");
  });

  it("resolves changed files from Git when only since is provided", async () => {
    mockedChangedFilesFromGit.mockResolvedValueOnce(["src/a.ts"]);

    await expect(resolveChangedFiles({ root: "/repo", since: "main" })).resolves.toEqual(["src/a.ts"]);
    expect(mockedChangedFilesFromGit).toHaveBeenCalledWith("/repo", "main");
    expect(mockedChangedFilesFromFixture).not.toHaveBeenCalled();
  });

  it("resolves changed files from a fixture when only changedFiles is provided", async () => {
    mockedChangedFilesFromFixture.mockResolvedValueOnce(["src/b.ts"]);

    await expect(resolveChangedFiles({ root: "/repo", changedFiles: "changed-files.txt" })).resolves.toEqual(["src/b.ts"]);
    expect(mockedChangedFilesFromFixture).toHaveBeenCalledWith("changed-files.txt");
    expect(mockedChangedFilesFromGit).not.toHaveBeenCalled();
  });
});
