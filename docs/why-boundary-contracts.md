# Why Boundary Contracts

AI can change code faster than reviewers can reconstruct architecture intent.

Boundary Contracts makes that intent executable. A repo declares which layers, owners, paths, and change scopes are allowed to interact. The CLI checks whether the current repo or a proposed diff stayed inside those boundaries.

The important shift is from generic import linting to declared patch intent:

- Import checks ask whether the architecture is still coherent.
- Change-scope checks ask whether the patch stayed inside the area it claimed to change.

That second question is especially useful for AI-assisted codebases, where a small prompt can produce broad, plausible-looking edits.
