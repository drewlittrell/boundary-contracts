export interface LayerContract {
  paths: string[];
  mayImport: string[];
  protected?: boolean;
}

export interface OwnerContract {
  paths: string[];
}

export interface ChangeScopeContract {
  description?: string;
  allowedPaths: string[];
  requiredOwners?: string[];
}

export interface ForbiddenImportRule {
  id: string;
  from: string[];
  to: string[];
  reason: string;
}

export interface ProtectedPathRule {
  id: string;
  paths: string[];
  reason: string;
}

export interface BoundaryContracts {
  version: "0.1";
  layers: Record<string, LayerContract>;
  owners?: Record<string, OwnerContract>;
  changeScopes?: Record<string, ChangeScopeContract>;
  forbiddenImports?: ForbiddenImportRule[];
  protectedPaths?: ProtectedPathRule[];
  exceptions?: {
    file: string;
  };
}

export interface BoundaryException {
  id: string;
  rule: string;
  path: string;
  reason: string;
  owner: string;
  expires: string;
}

export interface BoundaryExceptionsFile {
  exceptions: BoundaryException[];
}
