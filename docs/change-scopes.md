# Change Scopes

A change scope is a declared allowed area for a patch.

```yaml
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
```

Run:

```sh
npm run cli -- diff . --since main --scope auth-login-fix
```

Every changed file must match `allowedPaths`. When `requiredOwners` is present, each changed file must also be classified under one of those owners.

For examples and tests, use `--changed-files`:

```sh
npm run cli -- diff examples/nextjs-auth/scenarios/drift-out-of-scope-change --scope auth-login-fix --changed-files examples/nextjs-auth/scenarios/drift-out-of-scope-change/changed-files.txt
```
