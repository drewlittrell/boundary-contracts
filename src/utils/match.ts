import { minimatch } from "minimatch";
import { normalizeRelativePath } from "./paths";

export function matchesAny(file: string, patterns: string[]): boolean {
  const normalized = normalizeRelativePath(file);
  return patterns.some((pattern) =>
    minimatch(normalized, normalizeRelativePath(pattern), {
      dot: true,
      matchBase: false
    })
  );
}

export function patternSpecificity(pattern: string): number {
  return normalizeRelativePath(pattern).replace(/[*{}[\]!]/g, "").length;
}

export function bestMatchingPattern(file: string, patterns: string[]): string | undefined {
  return patterns
    .filter((pattern) => matchesAny(file, [pattern]))
    .sort((a, b) => patternSpecificity(b) - patternSpecificity(a))[0];
}
