# Flashcard review retry queue

Nyra Flashcard review sessions will keep an in-session retry queue: when a learner marks a Flashcard as Unknown, that card returns to the back of the current review queue and the session completes only after every included card is eventually marked Known in that session. Spaced Repetition scheduling still records Unknown results and keeps weak cards due, but the session experience supports immediate retry after a short gap.

The default Review Queue will include up to 20 New Flashcards and Due Flashcards, ordered with Due Flashcards before New Flashcards. Larger decks can leave additional New or Due cards for a later review session rather than turning one session into an unbounded task.

Deck order controls Study mode browsing and the order New Flashcards enter review. Due Flashcards are ordered by oldest due date first, and in-session Unknown retries return to the back of the current queue.
