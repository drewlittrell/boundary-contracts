# CI

Run Boundary Contracts in CI as a local deterministic check.

```yaml
- run: npm ci
- run: npm run typecheck
- run: npm run test
- run: npm run example:all
  env:
    BOUNDARY_CONTRACTS_DETERMINISTIC: "1"
- run: git diff --exit-code
```

For a project using the CLI directly:

```sh
npm run cli -- diff . --since origin/main --scope auth-login-fix
```

Use `--strict` when warnings should fail CI.
