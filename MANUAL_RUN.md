# Manual Run

Use these steps to run Nyra locally by hand.

## Prerequisites

- Node.js is installed.
- Dependencies are installed with `npm install`.
- The database connection required by Prisma is available in your environment.

## Authentication Environment

Supabase Auth is required for real sign in, sign up, Google Sign-In, password reset, and protected-route QA.

Local development:

```text
DATABASE_URL=...
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
```

Vercel Preview and Production need the same auth variables configured in the matching Vercel environment. `DATABASE_URL` must point to a database reachable from Vercel. If a server-side service key is introduced later, keep `SUPABASE_SERVICE_ROLE_KEY` server-only and never expose it with a `NEXT_PUBLIC_` prefix.

## Supabase Auth Setup

- Enable Email/Password authentication in Supabase Auth.
- Configure Google Sign-In through Supabase Auth only.
- Add local and deployed callback URLs to the Supabase redirect allow-list:

```text
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
https://<preview-domain>/auth/callback
https://<production-domain>/auth/callback
```

- Password reset emails should redirect to `/auth/callback?next=/auth/update-password`.
- Email verification is supported whether the Supabase project returns an immediate session or requires email confirmation first.

## Start the Development Server

```bash
npm run dev
```

The app should be available at:

```text
http://localhost:3000
```

If another process already uses port `3000`, Next.js may choose another port. In this workspace, the app is often run at:

```text
http://localhost:3001
```

## Useful Local Pages

```text
http://localhost:3001/login?ui=en
http://localhost:3001/signup?ui=en
http://localhost:3001/auth/update-password?ui=en
http://localhost:3001/profile?ui=en
http://localhost:3001/admin?ui=en
http://localhost:3001/practice?ui=en
http://localhost:3001/practice/a1?ui=en
http://localhost:3001/learn?ui=en
```

## Database Setup

Generate the Prisma client after dependency changes:

```bash
npm run prisma:generate
```

Push the Prisma schema to the database:

```bash
npm run db:push
```

Seed local sample content:

```bash
npm run db:seed
```

## Admin Access

Admin Access is Nyra-owned and stored in the application database. Do not use Supabase roles, JWT claims, email prefixes, or production administrator credentials.

Grant Admin Access manually for a real authenticated Supabase user id:

```sql
insert into "AdminAccess" ("id", "authUserId", "grantedBy")
values (gen_random_uuid(), '<supabase-user-id>', '<granting-operator-id>')
on conflict ("authUserId")
do update set "revokedAt" = null, "updatedAt" = now();
```

Revoke Admin Access:

```sql
update "AdminAccess"
set "revokedAt" = now(), "updatedAt" = now()
where "authUserId" = '<supabase-user-id>';
```

## Verification Commands

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Authentication QA Checklist

- Email sign up provisions a new Learner Profile when Supabase returns a session.
- Email sign up shows a check-email success state when email verification is required.
- Email sign in restores the session on refresh.
- Google Sign-In completes through Supabase and provisions the same kind of Learner Profile.
- Password reset email opens `/auth/update-password` through `/auth/callback`.
- Sign out clears the session and returns to `/login`.
- Logged-out `/profile` redirects to `/login?returnTo=/profile`.
- Logged-out `/admin` redirects to login or Basic Auth challenge depending on admin env vars.
- Normal users cannot access admin pages or admin APIs.
- Users with active `AdminAccess` can access admin pages and admin APIs.

## Deferred Account Features

These are intentionally deferred to the future `account-profile` milestone:

- Profile photo upload
- Supabase Storage integration
- Avatar management
- Account settings
- Notification preferences

## Stop the Server

Press `Ctrl+C` in the terminal running `npm run dev`.
