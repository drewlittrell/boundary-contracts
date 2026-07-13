# CLI Reference

Run Boundary Contracts from this repository with `npm run cli -- <command>`. The CLI accepts the commands below. In commands with an optional `[root]` argument, the root defaults to the current directory (`.`).

## Commands at a glance

- `init` creates starter configuration in a repository.
- `scan` checks the current repository files and imports against its boundaries.
- `diff` checks changed files against a declared change scope as well as the repository boundaries.
- `report` performs a full scan and writes Markdown and JSON reports to default or specified paths.
- `render-report` converts an existing JSON report to Markdown on standard output without running a check.

Checks performed by `scan`, `diff`, and `report` refresh `.boundary-contracts/scan.json` and `.boundary-contracts/report.json` under the repository root. Each command also prints a terminal summary. The `--out` and `--json-out` options control additional report outputs as described below.

## `init`

```sh
npm run cli -- init [root]
```

Creates starter `boundary.contracts.yaml` and `boundary.exceptions.yaml` files when they do not already exist, and creates the `.boundary-contracts` directory.

Arguments:

- `[root]`: repository root; defaults to `.`.

This command has no command-specific options and does not run a boundary check.

## `scan`

```sh
npm run cli -- scan [root] [--out <path>] [--json-out <path>] [--strict]
```

Inspects the current repository files and relative imports against the configured boundaries. It prints a terminal summary. Markdown and additional JSON report files are optional.

Arguments:

- `[root]`: repository root; defaults to `.`.

Options:

- `--out <path>`: write a Markdown report to the given path.
- `--json-out <path>`: write a JSON report to the given path.
- `--strict`: exit non-zero on warnings as well as failures.

## `diff`

```sh
npm run cli -- diff [root] --scope <id> (--since <ref> | --changed-files <path>) [--out <path>] [--json-out <path>] [--strict]
```

Inspects changed files against the required declared change scope and the configured boundaries. Supply exactly one change source: either a Git reference with `--since` or a newline-delimited fixture with `--changed-files`. Supplying neither source or both sources exits non-zero with a validation error. It prints a terminal summary. Markdown and additional JSON report files are optional.

Arguments:

- `[root]`: repository root; defaults to `.`.

Options:

- `--scope <id>`: declared change scope; required.
- `--since <ref>`: Git reference to diff against; mutually exclusive with `--changed-files`.
- `--changed-files <path>`: path to a newline-delimited changed-files fixture; mutually exclusive with `--since`.
- `--out <path>`: write a Markdown report to the given path.
- `--json-out <path>`: write a JSON report to the given path.
- `--strict`: exit non-zero on warnings as well as failures.

For example:

```sh
npm run cli -- diff . --since main --scope auth-login-fix
npm run cli -- diff . --changed-files changed-files.txt --scope auth-login-fix
```

## `report`

```sh
npm run cli -- report [root] [--out <path>] [--json-out <path>] [--strict]
```

Performs a full scan, prints a terminal summary, and writes both Markdown and JSON reports.

Arguments:

- `[root]`: repository root; defaults to `.`.

Options:

- `--out <path>`: write the Markdown report; defaults to `.boundary-contracts/report.md` under the repository root.
- `--json-out <path>`: write the JSON report; defaults to `.boundary-contracts/report.json` under the repository root.
- `--strict`: exit non-zero on warnings as well as failures.

## `render-report`

```sh
npm run cli -- render-report <json>
```

Reads an existing JSON report and renders it as Markdown on standard output. It does not scan the repository or write a Markdown file.

Arguments:

- `<json>`: report JSON path; required.

This command has no command-specific options.

## Exit behavior

For `scan`, `diff`, and `report`:

- A passing result exits successfully.
- A warning result exits successfully by default.
- A failure result exits non-zero.
- With `--strict`, a warning result also exits non-zero.

Command errors, such as invalid input or an unreadable report passed to `render-report`, exit non-zero. Successful `init` and `render-report` commands exit successfully.
