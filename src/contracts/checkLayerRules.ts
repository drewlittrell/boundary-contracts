import type { BoundaryContracts } from "./types";
import type { RepoScan } from "../scan/types";
import type { BoundaryViolation } from "../reports/types";

export function checkLayerRules(scan: RepoScan, contracts: BoundaryContracts): BoundaryViolation[] {
  const classifications = new Map(scan.classifications.map((item) => [item.file, item]));
  const violations: BoundaryViolation[] = [];

  for (const importSignal of scan.imports) {
    if (!importSignal.resolvedTo) {
      continue;
    }
    const fromLayer = classifications.get(importSignal.fromFile)?.layerIds[0];
    const toLayer = classifications.get(importSignal.resolvedTo)?.layerIds[0];
    if (!fromLayer || !toLayer || fromLayer === toLayer) {
      continue;
    }
    const allowed = contracts.layers[fromLayer]?.mayImport ?? [];
    if (!allowed.includes(toLayer)) {
      violations.push({
        id: `layer-import:${importSignal.id}`,
        kind: "layer_import",
        status: "fail",
        message: `${importSignal.fromFile} imports ${importSignal.resolvedTo}, but ${fromLayer} may not import ${toLayer}.`,
        files: [importSignal.fromFile, importSignal.resolvedTo],
        ruleId: `${fromLayer}-may-import`,
        suggestion: `Move the dependency behind an allowed ${fromLayer} -> ${allowed.join(", ") || "none"} boundary, or intentionally update the layer contract.`
      });
    }
  }

  return violations;
}

export function checkUnclassifiedFiles(scan: RepoScan): BoundaryViolation[] {
  return scan.classifications
    .filter((classification) => classification.layerIds.length === 0)
    .map((classification) => ({
      id: `unclassified-file:${classification.file}`,
      kind: "unclassified_file" as const,
      status: "warn" as const,
      message: `${classification.file} does not match any declared layer.`,
      files: [classification.file],
      suggestion: "Add the file to an existing layer path or declare a new layer."
    }));
}
