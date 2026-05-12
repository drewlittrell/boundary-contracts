# Contract Format

Boundary Contracts reads `boundary.contracts.yaml`.

```yaml
version: "0.1"
layers:
  services:
    paths:
      - services/**
    mayImport:
      - domain
owners:
  auth:
    paths:
      - services/authService.ts
changeScopes:
  auth-login-fix:
    description: Changes related to the login flow.
    allowedPaths:
      - services/authService.ts
    requiredOwners:
      - auth
forbiddenImports:
  - id: services-must-not-import-app
    from:
      - services/**
    to:
      - app/**
    reason: Service code must not depend on app route handlers.
protectedPaths:
  - id: generated-contracts
    paths:
      - generated/**
    reason: Generated files must be updated through their generator.
exceptions:
  file: boundary.exceptions.yaml
```

Layer paths classify files. `mayImport` declares which other layers are allowed dependencies.

Owners classify files by human or system ownership.

Protected paths are checked in diff mode and fail when changed without a valid exception.
