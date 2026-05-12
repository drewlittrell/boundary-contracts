# Boundary Contracts Report

Status: fail  
Mode: diff  
Scope: auth-login-fix

## What This Report Means

This report checks whether code stayed inside declared architecture and change-scope boundaries.

## Summary

| Files scanned | Imports scanned | Violations | Warnings |
|---:|---:|---:|---:|
| 5 | 2 | 1 | 0 |

## Violations

### Protected Path

Status: fail

generated/contracts.ts changed, but it is protected by generated-contracts.

Files:
- `generated/contracts.ts`

Rule: `generated-contracts`

Suggested fix:

- Generated files must be updated through their generator.
