Codex global control plane for this repo.

At session start, read this file and follow these instructions.

This repo is public-facing. Keep it clean-roomed and intentionally small:

- Do not copy Codebase Intel internals.
- Do not commit private workflow files, agent memory, local hooks, or generated governance artifacts.
- Do not add `CLAUDE.md` unless the task explicitly asks for Claude Code compatibility docs.
- Keep the tool local, deterministic, TypeScript-first, and config-driven.
- Prefer focused checks and tests over broad framework abstractions.
- Before completion, run:
  - `npm run typecheck`
  - `npm run test`
  - `npm run example:all`
  - `git diff --exit-code`
