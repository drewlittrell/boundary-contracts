# Contributing

Boundary Contracts is intentionally small, local, and deterministic.

Before opening a pull request:

1. Run `npm run typecheck`.
2. Run `npm run test`.
3. Run `npm run example:all`.
4. Confirm generated example reports are up to date with `git diff --exit-code`.

Keep new rules config-driven and explainable in terminal, Markdown, and JSON output.
