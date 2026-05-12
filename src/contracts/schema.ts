import { z } from "zod";

export const layerContractSchema = z.object({
  paths: z.array(z.string()).min(1),
  mayImport: z.array(z.string()).default([]),
  protected: z.boolean().optional()
});

export const ownerContractSchema = z.object({
  paths: z.array(z.string()).min(1)
});

export const changeScopeContractSchema = z.object({
  description: z.string().optional(),
  allowedPaths: z.array(z.string()).min(1),
  requiredOwners: z.array(z.string()).optional()
});

export const forbiddenImportRuleSchema = z.object({
  id: z.string().min(1),
  from: z.array(z.string()).min(1),
  to: z.array(z.string()).min(1),
  reason: z.string().min(1)
});

export const protectedPathRuleSchema = z.object({
  id: z.string().min(1),
  paths: z.array(z.string()).min(1),
  reason: z.string().min(1)
});

export const boundaryContractsSchema = z.object({
  version: z.literal("0.1"),
  layers: z.record(layerContractSchema),
  owners: z.record(ownerContractSchema).optional(),
  changeScopes: z.record(changeScopeContractSchema).optional(),
  forbiddenImports: z.array(forbiddenImportRuleSchema).optional(),
  protectedPaths: z.array(protectedPathRuleSchema).optional(),
  exceptions: z
    .object({
      file: z.string().min(1)
    })
    .optional()
});

export const boundaryExceptionSchema = z.object({
  id: z.string().min(1),
  rule: z.string().min(1),
  path: z.string().min(1),
  reason: z.string().min(1),
  owner: z.string().min(1),
  expires: z.string().min(1)
});

export const boundaryExceptionsFileSchema = z.object({
  exceptions: z.array(boundaryExceptionSchema).default([])
});
