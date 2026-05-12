# Relationship To Codebase Intel

Boundary Contracts is a public local CLI for explicit boundary checks.

It is intentionally limited to:

- Config-driven layer rules.
- Config-driven owners.
- Config-driven protected paths.
- Config-driven forbidden imports.
- Config-driven change scopes.
- Local TypeScript and JavaScript scanning.
- Markdown, JSON, and terminal reports.

Codebase Intel is broader:

- Automatic owner and system inference.
- Evidence graph enrichment.
- Runtime truth correlation.
- PR risk scoring.
- Governance workflows.
- Agent context.
- Hosted product workflows.

Boundary Contracts does not expose Codebase Intel internals. It is a small public tool for teams that want executable architecture and change-scope contracts without adopting a larger system.
