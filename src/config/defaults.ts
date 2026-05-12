export const defaultBoundaryContractsYaml = `version: "0.1"
layers:
  app:
    paths:
      - app/**
    mayImport:
      - services
      - domain
      - ui
  services:
    paths:
      - services/**
    mayImport:
      - domain
  domain:
    paths:
      - domain/**
    mayImport: []
  generated:
    paths:
      - generated/**
    mayImport: []
    protected: true
owners:
  auth:
    paths:
      - app/api/login/**
      - services/authService.ts
      - domain/auth.ts
changeScopes:
  auth-login-fix:
    description: Changes related to the login flow.
    allowedPaths:
      - app/api/login/**
      - services/authService.ts
      - domain/auth.ts
      - tests/auth/**
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
`;

export const defaultBoundaryExceptionsYaml = `exceptions: []
`;
