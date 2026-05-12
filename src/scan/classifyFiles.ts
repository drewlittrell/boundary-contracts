import type { BoundaryContracts } from "../contracts/types";
import type { FileClassification } from "./types";
import { matchesAny, patternSpecificity } from "../utils/match";

export function classifyFiles(files: string[], contracts: BoundaryContracts): FileClassification[] {
  return files.map((file) => {
    const layerIds = Object.entries(contracts.layers)
      .filter(([, layer]) => matchesAny(file, layer.paths))
      .sort(([, a], [, b]) => mostSpecific(b.paths) - mostSpecific(a.paths))
      .map(([id]) => id);
    const ownerIds = Object.entries(contracts.owners ?? {})
      .filter(([, owner]) => matchesAny(file, owner.paths))
      .sort(([, a], [, b]) => mostSpecific(b.paths) - mostSpecific(a.paths))
      .map(([id]) => id);
    const layerProtected = layerIds.some((id) => contracts.layers[id]?.protected);
    const explicitlyProtected = (contracts.protectedPaths ?? []).some((rule) => matchesAny(file, rule.paths));
    return {
      file,
      layerIds,
      ownerIds,
      protected: layerProtected || explicitlyProtected
    };
  });
}

function mostSpecific(patterns: string[]): number {
  return Math.max(...patterns.map(patternSpecificity));
}
