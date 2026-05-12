import path from "node:path";
import type { ImportSignal, SourceFile } from "./types";
import { normalizeRelativePath } from "../utils/paths";

const staticImportPattern = /import\s+(?:type\s+)?(?:[^'"]*?\s+from\s+)?["']([^"']+)["']/g;
const dynamicImportPattern = /import\s*\(\s*["']([^"']+)["']\s*\)/g;
const requirePattern = /require\s*\(\s*["']([^"']+)["']\s*\)/g;
const extensions = [".ts", ".tsx", ".js", ".jsx"];

export function parseImports(files: SourceFile[]): ImportSignal[] {
  const knownFiles = new Set(files.map((file) => file.relativePath));
  const imports: ImportSignal[] = [];

  for (const file of files) {
    imports.push(...parsePattern(file, staticImportPattern, "static", knownFiles));
    imports.push(...parsePattern(file, dynamicImportPattern, "dynamic", knownFiles));
    imports.push(...parsePattern(file, requirePattern, "dynamic", knownFiles));
  }

  return imports.map((signal, index) => ({
    ...signal,
    id: `import-${String(index + 1).padStart(4, "0")}`
  }));
}

function parsePattern(
  file: SourceFile,
  pattern: RegExp,
  kind: "static" | "dynamic",
  knownFiles: Set<string>
): ImportSignal[] {
  pattern.lastIndex = 0;
  const found: ImportSignal[] = [];
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(file.text)) !== null) {
    const importPath = match[1];
    found.push({
      id: "",
      fromFile: file.relativePath,
      importPath,
      resolvedTo: resolveRelativeImport(file.relativePath, importPath, knownFiles),
      kind
    });
  }
  return found;
}

export function resolveRelativeImport(
  fromFile: string,
  importPath: string,
  knownFiles: Set<string>
): string | undefined {
  if (!importPath.startsWith(".")) {
    return undefined;
  }
  const fromDirectory = path.posix.dirname(normalizeRelativePath(fromFile));
  const withoutExtension = normalizeRelativePath(path.posix.normalize(path.posix.join(fromDirectory, importPath)));
  const candidates = [
    ...extensions.map((extension) => `${withoutExtension}${extension}`),
    ...extensions.map((extension) => `${withoutExtension}/index${extension}`)
  ];
  return candidates.find((candidate) => knownFiles.has(candidate));
}
