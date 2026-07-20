# Database-owned localized content metadata

Nyra will store Persian, English, and German learner-facing presentation metadata in PostgreSQL for Levels, Units, Skills, Practice worlds, and translatable Resource fields, replacing runtime display-copy fallbacks from static sample content. The English/Persian Admin Panel will provide locale-aware editing for all three learner languages, while Questions, Flashcards, and other intentionally mixed Persian/German learning material remain authored content rather than automatically translated interface copy.

Drafts may contain incomplete translations, but review reports missing locale fields and publication requires every mandatory learner-facing field in Persian, English, and German. Nyra does not automatically translate or silently substitute one Interface Language for another after migration; optional fields may remain absent where the field itself is optional.
