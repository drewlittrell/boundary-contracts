# Exceptions

Exceptions suppress matching violations only when they are explicit and current.

```yaml
exceptions:
  - id: legacy-auth-adapter
    rule: services-must-not-import-app
    path: services/authService.ts
    reason: Legacy adapter pending extraction.
    owner: drew
    expires: "2026-07-01"
```

Rules:

- `reason` is required.
- `owner` is required.
- `expires` is required.
- Expired exceptions fail.
- Unused exceptions warn.

This keeps exceptions temporary and reviewable.
