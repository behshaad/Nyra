# Nyra

Nyra is a modern German learning platform for Persian speakers.

This repository currently contains the first complete playable A1 slice:

- Real routes for `/`, `/learn`, `/learn/[skillId]`, `/resources`, `/flashcards`, `/profile`, `/admin`, and `/pricing`.
- A backend-backed A1 path with 12 Units, 48 regular Skills, 12 Unit Checkpoints, and 1 Final A1 Test.
- A Postgres-backed Resource Library at `/resources` with detail pages, dev-admin creation/editing, and Resource archiving.
- Dev-admin Skill metadata editing and existing Question editing at `/admin/skills`.
- A deterministic Question Engine for multiple choice, fill-in-the-blank, word-ordering, retry practice, and soft-gated assessments.
- Prisma/PostgreSQL models for Course, Level, Unit, Skill, Question, Learner Profile, Learning Session, Question Attempt, and Progress Event.
- Seed content for the full text-only Persian-to-German A1 Course and a development learner identity.
- Dev-admin Skill metadata editing, existing Question editing, Resource creation/editing/archive, static pricing, deferred flashcards, and dev-profile scaffolds.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Admin routes are protected by a temporary Basic Auth bridge until Supabase Auth
and Nyra-owned admin roles are wired in. Set these values outside local
development when accessing `/admin` or `/api/admin/*`:

```bash
ADMIN_USERNAME=...
ADMIN_PASSWORD=...
```

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
