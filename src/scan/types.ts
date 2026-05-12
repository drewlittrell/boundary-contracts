export interface SourceFile {
  absolutePath: string;
  relativePath: string;
  text: string;
}

export interface ImportSignal {
  id: string;
  fromFile: string;
  importPath: string;
  resolvedTo?: string;
  kind: "static" | "dynamic";
}

export interface FileClassification {
  file: string;
  layerIds: string[];
  ownerIds: string[];
  protected: boolean;
}

export interface RepoScan {
  schemaVersion: 1;
  generatedAt: string;
  root: string;
  files: string[];
  imports: ImportSignal[];
  classifications: FileClassification[];
}
