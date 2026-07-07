# Event-based progress model

Nyra will model learner progress from persisted activity events and attempts rather than relying only on mutable progress rows. Question attempts, skill starts, skill completions, checkpoint attempts, flashcard reviews, XP awards, and streak activity should be preserved so summaries can be derived from an auditable history.

## Consequences

Dashboards may use summary records for fast reads, but those summaries are derived state. The system should keep enough history to explain progress, repair counters, analyze weak areas, and requeue mistakes for review.
