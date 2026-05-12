import path from "node:path";

export function toPosixPath(value: string): string {
  return value.split(path.sep).join("/");
}

export function normalizeRelativePath(value: string): string {
  return toPosixPath(value).replace(/^\.\//, "");
}

export function relativeFrom(root: string, absolutePath: string): string {
  return normalizeRelativePath(path.relative(root, absolutePath));
}

export function deterministicTimestamp(): string {
  if (process.env.BOUNDARY_CONTRACTS_DETERMINISTIC === "1") {
    return "2026-01-01T00:00:00.000Z";
  }
  return new Date().toISOString();
}

export function ensureInsideRoot(root: string, target: string): string {
  const absoluteRoot = path.resolve(root);
  const absoluteTarget = path.resolve(root, target);
  if (!absoluteTarget.startsWith(absoluteRoot)) {
    throw new Error(`Path escapes root: ${target}`);
  }
  return absoluteTarget;
}
