# Single-course language-aware MVP

Nyra's MVP will support one Course: Persian speakers learning German. The domain model will still keep Source Language, Target Language, and Course separate so future courses can be added without renaming the product language or rebuilding the learning hierarchy.

## Consequences

The first implementation should avoid marketplace-style multi-course complexity. Admin and learner flows may assume the Persian-to-German Course at launch, but core content and profile language should not be hardcoded as if Nyra can never support another Course.
