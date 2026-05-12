# Next.js Auth Example

This example shows a small app boundary:

- `app/**` may call `services`, `domain`, and `ui`.
- `services/**` may call `domain`.
- `domain/**` may not call higher layers.
- `generated/**` is protected.

The scenario suite under `scenarios/` demonstrates healthy and drift states.
