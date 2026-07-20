# Database-managed Practice Journey presentation

Nyra will move Practice Journey presentation from code-owned constants into database-backed administration: Level world titles, region labels, tones, background media, and Level and Unit node coordinates can be edited with drag-and-drop or exact coordinate entry and previewed responsively. Content hierarchy and Questions remain managed through their canonical Course, Level, Unit, Skill, and Question records, while learner availability, completion, locking, XP, and review state remain derived from published content and learner progress rather than editable map state.

Level and Unit node positions are stored as normalized x/y percentages relative to a presentation canvas whose intended artwork aspect ratio is explicit metadata. Dragging and exact inputs edit the same normalized values, rendering validates and clamps nodes to safe bounds, and one canonical layout scales responsively; device-specific overrides are deferred unless visual testing demonstrates that a shared layout cannot preserve usability.

Course, Level, and Unit remain structural containers without independent publication states. Their learner availability is derived from learner-available descendant content; administrators can still see empty or Draft-only containers so they can complete the hierarchy before it appears to learners.

Practice Journey presentation changes remain Draft until an Admin publishes the complete validated configuration atomically. Draft preview and discard operate independently of content publication, so publishing a Journey never publishes Draft Skills or Questions and incomplete visual edits never leak into the learner experience.

Administrator previews use isolated simulated learner progress rather than the administrator's Learner Profile. Previewing must neither depend on nor mutate the operator's personal learning history.

Learner Preview and Draft Journey Preview live behind the server-verified Admin Access boundary and reuse the production learner renderer with authorized preview inputs. Public Practice routes and query parameters cannot activate preview behavior or expose Draft content.

Learner Preview defaults to the Persian Interface Language and lets administrators switch temporarily among all supported Interface Languages inside the preview. Preview language selection does not change administrator or learner preferences, the Course, or simulated progression.
