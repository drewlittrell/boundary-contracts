export type BoundaryStatus = "pass" | "warn" | "fail";

export type ViolationKind =
  | "forbidden_import"
  | "layer_import"
  | "protected_path"
  | "out_of_scope_change"
  | "expired_exception"
  | "unused_exception"
  | "unclassified_file";

export interface BoundaryViolation {
  id: string;
  kind: ViolationKind;
  status: BoundaryStatus;
  message: string;
  files: string[];
  ruleId?: string;
  exceptionId?: string;
  suggestion?: string;
}

export interface BoundaryReport {
  schemaVersion: 1;
  generatedAt: string;
  status: BoundaryStatus;
  mode: "scan" | "diff";
  scope?: string;
  summary: {
    filesScanned: number;
    importsScanned: number;
    violations: number;
    warnings: number;
  };
  violations: BoundaryViolation[];
}
