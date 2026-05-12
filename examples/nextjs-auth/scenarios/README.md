# Scenario Suite

| Scenario | Expected status | What changed |
|---|---|---|
| Healthy | pass | all imports and changes stay inside boundaries |
| Cross-boundary import | fail | service imports app route |
| Out-of-scope change | fail | auth-scoped change touches billing |
| Protected path change | fail | generated file changed directly |

## Scenario Notes

### Healthy

The app route calls the auth service, the service calls domain code, and all files live inside declared layers and owners.

### Cross-boundary import

A service imports an app route. This makes business logic depend on the transport layer. The report currently shows both the generic `layer_import` violation and the explicit `forbidden_import` rule so the structural breach and named policy are both visible.

### Out-of-scope change

A patch claiming to fix auth touches billing. This is the AI-assisted review failure mode Boundary Contracts is built to catch: a plausible-looking change that escaped the declared job.

### Protected path change

A generated file changes directly instead of through the generator. Protected paths make those edits fail unless there is an explicit, owned, unexpired exception.
