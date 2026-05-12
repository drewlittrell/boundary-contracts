# Scenario Suite

| Scenario | Expected status | What changed |
|---|---|---|
| Healthy | pass | all imports and changes stay inside boundaries |
| Cross-boundary import | fail | service imports app route |
| Out-of-scope change | fail | auth-scoped change touches billing |
| Protected path change | fail | generated file changed directly |
