import { promises as fs } from "node:fs";
import path from "node:path";
import YAML from "yaml";
import { boundaryContractsSchema, boundaryExceptionsFileSchema } from "./schema";
import type { BoundaryContracts, BoundaryExceptionsFile } from "./types";
import { pathExists } from "../utils/fs";

export const CONTRACT_FILE = "boundary.contracts.yaml";

export async function loadBoundaryContracts(root: string): Promise<BoundaryContracts> {
  const contractPath = path.join(root, CONTRACT_FILE);
  if (!(await pathExists(contractPath))) {
    throw new Error(`Missing ${CONTRACT_FILE} in ${root}. Run boundary-contracts init first.`);
  }
  const parsed = YAML.parse(await fs.readFile(contractPath, "utf8"));
  return boundaryContractsSchema.parse(parsed);
}

export async function loadBoundaryExceptions(
  root: string,
  contracts: BoundaryContracts
): Promise<BoundaryExceptionsFile> {
  if (!contracts.exceptions?.file) {
    return { exceptions: [] };
  }
  const exceptionPath = path.join(root, contracts.exceptions.file);
  if (!(await pathExists(exceptionPath))) {
    return { exceptions: [] };
  }
  const parsed = YAML.parse(await fs.readFile(exceptionPath, "utf8"));
  return boundaryExceptionsFileSchema.parse(parsed);
}
