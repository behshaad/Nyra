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

Authentication uses Auth.js v4 with Nyra-owned accounts in the project database.
Credentials, Google OAuth provider links, email verification, password reset
tokens, Learner Profiles, and AdminAccess are stored in PostgreSQL.

Copy `.env.example` to `.env` for local development. Required values:

```bash
DATABASE_URL=...
NEXTAUTH_SECRET=...
```

`NEXTAUTH_SECRET` is the Auth.js secret this project reads in
`lib/auth/options.ts` and `middleware.ts`. `AUTH_SECRET` is not used by this
project.

Production should also set the canonical URL:

```bash
NEXTAUTH_URL=https://nyra-jet.vercel.app
```

Optional integrations:

```bash
# Optional, enables Google Sign-In
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
# Optional, sends auth mail through Resend instead of local console logging
RESEND_API_KEY=...
AUTH_EMAIL_FROM=...
```

Create the seeded admin and student accounts:

```bash
npm run db:push
npm run auth:seed-users
```

Seeded users:

```text
admin@nyra.local / Admin123!
student@nyra.local / Student123!
```

## Database

Set `DATABASE_URL` in `.env`, then run:

```bash
npm run db:push
npm run db:seed
```

Production schema changes use committed Prisma migrations:

```bash
npm run db:migrate:status
npm run db:migrate:deploy
```

Databases created before `prisma/migrations` was introduced must be checked
against the baseline schema, then marked once before deployment:

```bash
npx prisma migrate diff --from-config-datasource --to-schema prisma/migrations/20260720000100_baseline/schema.prisma --exit-code
npx prisma migrate resolve --applied 20260720000100_baseline
npm run db:migrate:deploy
```

Do not mark the baseline as applied when the schema-diff command reports
unexpected drift. Back up production data before the first migration deployment.

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
npm test
npm run build
```
