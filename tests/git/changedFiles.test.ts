import { promises as fs } from "node:fs";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { changedFilesFromFixture } from "../../src/git/changedFiles";

describe("changedFilesFromFixture", () => {
  it("loads and sorts changed files", async () => {
    const fixture = path.join(await fs.mkdtemp(path.join(os.tmpdir(), "boundary-files-")), "changed.txt");
    await fs.writeFile(fixture, "services/b.ts\napp/a.ts\n\n", "utf8");

    await expect(changedFilesFromFixture(fixture)).resolves.toEqual(["app/a.ts", "services/b.ts"]);
  });
});
