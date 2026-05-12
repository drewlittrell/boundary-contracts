# Boundary Contracts

[![CI](https://github.com/drewlittrell/boundary-contracts/actions/workflows/ci.yml/badge.svg)](https://github.com/drewlittrell/boundary-contracts/actions/workflows/ci.yml)

Make architecture and change-scope boundaries executable for AI-assisted codebases.

AI can change code faster than reviewers can reconstruct intent. Boundary Contracts lets teams declare which layers, owners, paths, and change scopes are allowed to interact, then checks whether a repo or diff respected those boundaries.

## Start Here

```sh
npm install
npm run cli -- init
npm run cli -- scan .
npm run cli -- diff . --since main --scope auth-login-fix
npm run cli -- report .
```

## Who This Is For

Boundary Contracts is for teams using AI assistants, code generation, or fast-moving contributors in layered TypeScript and JavaScript codebases. It helps reviewers answer a concrete question:

Did this code change stay inside the architecture and change-scope boundaries it claimed to operate within?

## What It Does

- Declares layers, owners, protected paths, forbidden imports, and change scopes in `boundary.contracts.yaml`.
- Scans TypeScript and JavaScript files for relative imports.
- Checks layer import rules and explicit forbidden import rules.
- Checks git diffs or `--changed-files` fixtures against declared change scopes.
- Fails protected path edits unless there is a valid exception.
- Requires exceptions to have an owner, reason, and expiry.
- Writes terminal, Markdown, and JSON reports.

## Design Principles

- Architecture rules should be executable, not tribal knowledge.
- Change scopes make patch intent reviewable.
- Exceptions should be explicit, owned, reasoned, and temporary.
- Local tools should be deterministic before they become platforms.

## Workflow

```sh
npm run cli -- init
npm run cli -- scan .
npm run cli -- diff . --since main --scope auth-login-fix
npm run cli -- report .
```

Example output:

```text
Boundary Contracts
Status: fail
Mode: diff
Scope: auth-login-fix
Violations:
- out_of_scope_change services/billingService.ts
- forbidden_import services/authService.ts -> app/api/login/route.ts
```

## Try It In 10 Minutes

Run the bundled scenarios:

```sh
npm run example:all
```

Then inspect:

- `examples/nextjs-auth/scenarios/healthy/reports/boundary-report.md`
- `examples/nextjs-auth/scenarios/drift-cross-boundary-import/reports/boundary-report.md`
- `examples/nextjs-auth/scenarios/drift-out-of-scope-change/reports/boundary-report.md`
- `examples/nextjs-auth/scenarios/drift-protected-path-change/reports/boundary-report.md`

## What This Catches That Normal Review Misses

A normal architecture checker asks whether one layer imported another. Boundary Contracts also asks whether the patch stayed inside its declared job.

That makes it useful for AI-assisted work:

- An auth fix that touches billing fails scope checks.
- A service importing an app route fails boundary checks.
- A generated file edited directly fails protected path checks.
- A stale exception warns or fails when expired.

## Use It On Your Own Repo

Create `boundary.contracts.yaml`:

```yaml
version: "0.1"
layers:
  app:
    paths: [app/**]
    mayImport: [services, domain]
  services:
    paths: [services/**]
    mayImport: [domain]
  domain:
    paths: [domain/**]
    mayImport: []
changeScopes:
  auth-login-fix:
    allowedPaths:
      - app/api/login/**
      - services/authService.ts
      - domain/auth.ts
    requiredOwners:
      - auth
```

Run:

```sh
npm run cli -- diff . --since main --scope auth-login-fix
```

## Change Scopes

A change scope is a declared allowed area for a patch. It can restrict changed files to specific paths and require those files to belong to specific owners. This is the signature feature: the tool checks the claimed scope of the change, not only the current import graph.

## Relationship To Codebase Intel

Boundary Contracts is public, local, deterministic, and config-driven.

Codebase Intel is broader: automatic system and owner inference, evidence graph enrichment, runtime truth correlation, PR risk scoring, governance, and agent context.

This repo intentionally does not include those systems.

## Non-Goals

- No automatic owner or system inference.
- No runtime truth correlation.
- No PR risk scoring.
- No GitHub App.
- No SaaS dashboard.
- No agent memory or context.
- No LLM-generated boundaries.
- No deep semantic analysis.
- No multi-language support.

## Development

```sh
npm run typecheck
npm run test
npm run example:all
git diff --exit-code
```
