# Nyra

Nyra is a modern German learning platform for Persian speakers.

This repository currently contains the first complete playable A1 slice:

- Real routes for `/`, `/learn`, `/learn/[skillId]`, `/resources`, `/flashcards`, `/profile`, `/admin`, and `/pricing`.
- A backend-backed A1 path with 12 Units, 48 regular Skills, 12 Unit Checkpoints, and 1 Final A1 Test.
- A read-only Resource Library at `/resources`.
- A deterministic Question Engine for multiple choice, fill-in-the-blank, word-ordering, retry practice, and soft-gated assessments.
- Prisma/PostgreSQL models for Course, Level, Unit, Skill, Question, Learner Profile, Learning Session, Question Attempt, and Progress Event.
- Seed content for the full text-only Persian-to-German A1 Course and a development learner identity.
- Read-only admin, static pricing, deferred flashcards, and dev-profile scaffolds.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Database

Set `DATABASE_URL` in `.env`, then run:

```bash
npm run db:push
npm run db:seed
```

For local development on macOS, the current setup uses PostgreSQL 16 through Homebrew:

```bash
brew services start postgresql@16
createdb nyra_dev
```

Prisma client generation runs on `postinstall`, and can also be run manually:

```bash
npm run prisma:generate
```

## Verification

```bash
npm run typecheck
npm run lint
npm run build
```
