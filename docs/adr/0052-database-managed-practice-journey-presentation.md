# Database-managed Practice Journey presentation

Nyra will move Practice Journey presentation from code-owned constants into database-backed administration: Level world titles, region labels, tones, background media, and Level and Unit node coordinates can be edited with drag-and-drop or exact coordinate entry and previewed responsively. Content hierarchy and Questions remain managed through their canonical Course, Level, Unit, Skill, and Question records, while learner availability, completion, locking, XP, and review state remain derived from published content and learner progress rather than editable map state.

Practice Journey presentation changes remain Draft until an Admin publishes the complete validated configuration atomically. Draft preview and discard operate independently of content publication, so publishing a Journey never publishes Draft Skills or Questions and incomplete visual edits never leak into the learner experience.
