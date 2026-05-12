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

### Out Of Scope Change

Status: fail

services/billingService.ts was changed, but auth-login-fix does not allow that path.

Files:
- `services/billingService.ts`

Rule: `auth-login-fix`

Suggested fix:

- Move this change to a matching scope, or update the declared scope intentionally.
