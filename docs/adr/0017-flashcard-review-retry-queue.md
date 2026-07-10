# Flashcard review retry queue

Nyra Flashcard review sessions will keep an in-session retry queue: when a learner marks a Flashcard as Unknown, that card returns to the back of the current review queue and the session completes only after every included card is eventually marked Known in that session. Spaced Repetition scheduling still records Unknown results and keeps weak cards due, but the session experience supports immediate retry after a short gap.
