# Boundary Contracts Report

Status: fail  
Mode: scan

## What This Report Means

This report checks whether code stayed inside declared architecture and change-scope boundaries.

## Summary

| Files scanned | Imports scanned | Violations | Warnings |
|---:|---:|---:|---:|
| 5 | 3 | 2 | 0 |

## Violations

### Layer Import

Status: fail

services/authService.ts imports app/api/login/route.ts, but services may not import app.

Files:
- `services/authService.ts`
- `app/api/login/route.ts`

Rule: `services-may-import`

Suggested fix:

- Move the dependency behind an allowed services -> domain boundary, or intentionally update the layer contract.

### Forbidden Import

Status: fail

services/authService.ts imports app/api/login/route.ts.

Files:
- `services/authService.ts`
- `app/api/login/route.ts`

Rule: `services-must-not-import-app`

Suggested fix:

- Service code must not depend on app route handlers.
