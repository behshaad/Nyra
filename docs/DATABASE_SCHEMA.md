# Database Schema

This document mirrors the domain concepts in `prisma/schema.prisma` so repository knowledge tools can index the database model even when they do not parse Prisma schema files directly.

## Enums

- `PublicationStatus`: `DRAFT`, `IN_REVIEW`, `PUBLISHED`, `ARCHIVED`.
- `QuestionType`: `MULTIPLE_CHOICE`, `FILL_IN_BLANK`, `WORD_ORDERING`.
- `SkillKind`: `REGULAR`, `UNIT_CHECKPOINT`, `FINAL_TEST`.
- `ResourceType`: `BOOK`, `VIDEO`, `AUDIO_LESSON`, `EXTERNAL_LINK`, `GRAMMAR_RESOURCE`, `READING_MATERIAL`, `LEARNING_GUIDE`.
- `InterfaceTheme`: `SYSTEM`, `LIGHT`, `DARK`.
- `LearningSessionStatus`: `ACTIVE`, `COMPLETED`.
- `QuestionAttemptResult`: `CORRECT`, `INCORRECT`.
- `ProgressEventType`: `SKILL_STARTED`, `QUESTION_ANSWERED`, `SKILL_COMPLETED`, `XP_AWARDED`, `FLASHCARD_REVIEWED`.

## Content Hierarchy

- `Course` is the top-level learning offering. It owns `Level` records and stores source language, target language, and interface language.
- `Level` belongs to a `Course` and owns ordered `Unit` records.
- `Unit` belongs to a `Level` and owns ordered `Skill` records plus attached `Resource` records.
- `Skill` belongs to a `Unit`, owns ordered `Question` records, can start `LearningSession` records, can emit `ProgressEvent` records, and can have attached `Resource` records.
- `Question` belongs to a `Skill` and records learner submissions through `QuestionAttempt`.
- `Resource` may attach to a `Unit`, a `Skill`, or both. It uses publication status so learner-facing pages can hide drafts and archived material.

## Learner Runtime

- `LearnerProfile` is the Nyra-owned learner identity. It stores display name, auth user reference, source and target languages, interface language and theme, current level, daily goal, and onboarding state.
- `LearningSession` belongs to a `LearnerProfile` and a `Skill`. It stores the active or completed question queue and completion/XP timestamps.
- `QuestionAttempt` belongs to a `LearningSession` and a `Question`. It stores the submitted answer, correctness result, feedback, and submission time.
- `ProgressEvent` belongs to a `LearnerProfile` and can reference a `LearningSession` and `Skill`. It records auditable activity such as skill starts, question answers, completions, XP awards, and flashcard reviews.

## Important Relationships

- `Course` -> `Level` -> `Unit` -> `Skill` -> `Question` is the authored learning path.
- `LearnerProfile` -> `LearningSession` -> `QuestionAttempt` is the learner's runtime answer flow.
- `LearnerProfile` -> `ProgressEvent` is the auditable progress event stream.
- `Resource` supports the learning path through optional `Unit` and `Skill` relationships.
- Publication status controls learner visibility for Skills, Questions, and Resources.
