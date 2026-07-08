# Nyra

Nyra is a modern German learning platform for Persian speakers.

This repository currently contains the first real product architecture slice:

- Real routes for `/`, `/learn`, `/learn/[skillId]`, `/flashcards`, `/profile`, `/admin`, and `/pricing`.
- A backend-backed A1 Skill learning session for `family-basics`.
- A deterministic Question Engine for multiple choice, fill-in-the-blank, and word-ordering questions.
- Prisma/PostgreSQL models for Course, Level, Unit, Skill, Question, Learner Profile, Learning Session, Question Attempt, and Progress Event.
- Seed content for one Persian-to-German A1 Course slice and a development learner identity.
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
