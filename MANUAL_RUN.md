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
SUPABASE_SERVICE_ROLE_KEY=...
```

`SUPABASE_SERVICE_ROLE_KEY` is required only for the local seed-user script. It must stay server-only and must never be exposed with a `NEXT_PUBLIC_` prefix.

Check local auth configuration without printing secret values:

```bash
npm run auth:check-env
```

Vercel Preview and Production need the same public auth variables configured in the matching Vercel environment. `DATABASE_URL` must point to a database reachable from Vercel. Keep `SUPABASE_SERVICE_ROLE_KEY` out of browser-exposed environments.

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

## Seed Authentication Users

The seed script creates or updates two Supabase Auth users through the Supabase Admin API and reconciles Nyra-owned records in the application database. It is idempotent and can be run repeatedly without creating duplicate Learner Profiles or AdminAccess records.

```bash
npm run auth:seed-users
```

Seeded admin:

```text
Email: admin@nyra.local
Password: Admin123!
```

Expected records:

- Supabase Auth user exists and is email-confirmed.
- Learner Profile exists.
- AdminAccess exists and has `revokedAt = null`.

Seeded student:

```text
Email: student@nyra.local
Password: Student123!
```

Expected records:

- Supabase Auth user exists and is email-confirmed.
- Learner Profile exists.
- No AdminAccess record exists.

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

1. Create seed users:

```bash
npm run auth:seed-users
```

2. Login as admin:

- Open `/login?ui=en`.
- Sign in with `admin@nyra.local` and `Admin123!`.
- Confirm the app redirects to `/profile` or the requested `returnTo` URL.
- Refresh the page and confirm the session is restored.

3. Login as student:

- Logout.
- Open `/login?ui=en`.
- Sign in with `student@nyra.local` and `Student123!`.
- Confirm the app redirects to `/profile` or the requested `returnTo` URL.
- Refresh the page and confirm the session is restored.

4. Verify admin page:

- As the admin user, open `/admin?ui=en`.
- Confirm the admin dashboard loads.
- Confirm an admin API route does not return `401` or `403`.

5. Verify student admin denial:

- As the student user, open `/admin?ui=en`.
- Confirm the app shows `/admin-access-denied`.
- Confirm an admin API route returns `403` with `Admin Access is required.`

6. Verify learner profile provisioning:

- Delete the seeded user's Learner Profile row only.
- Login again as that user.
- Confirm exactly one Learner Profile row is recreated for that `authUserId`.
- Login/refresh again and confirm no duplicate Learner Profile is created.

7. Verify logout:

- Use the logout control.
- Confirm the app redirects to `/login`.
- Open `/profile` and confirm it redirects to `/login?returnTo=/profile`.

8. Verify Google login:

- Enable Google Sign-In in Supabase Auth.
- Ensure `/auth/callback` is on the Supabase redirect allow-list for local and deployed domains.
- Open `/login?ui=en`.
- Click Continue with Google.
- Complete the provider flow.
- Confirm the app returns through `/auth/callback`, lands on `/profile` or the requested `returnTo`, creates exactly one Learner Profile, and restores the session after refresh.

9. Verify error handling:

- Submit login with an invalid password and confirm a form error appears.
- Open `/auth/callback` without a `code` and confirm it redirects to `/login` with an invalid-link error.
- Temporarily remove `NEXT_PUBLIC_SUPABASE_URL` or `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, restart the dev server, and confirm login actions show a normal error instead of the Next.js runtime overlay.

## Deferred Account Features

These are intentionally deferred to the future `account-profile` milestone:

- Profile photo upload
- Supabase Storage integration
- Avatar management
- Account settings
- Notification preferences

## Stop the Server

Press `Ctrl+C` in the terminal running `npm run dev`.
