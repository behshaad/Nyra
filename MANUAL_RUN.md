# Manual Run

Use these steps to run Nyra locally by hand.

## Prerequisites

- Node.js is installed.
- Dependencies are installed with `npm install`.
- PostgreSQL is running.
- `DATABASE_URL` points at the project database.
- `NEXTAUTH_SECRET` is set to a stable random value.

## Authentication Environment

Nyra authentication uses Auth.js with Nyra-owned users, bcrypt password hashes, Google OAuth provider links, email verification/reset tokens, disabled-account status, and secure HTTP-only session cookies.

Local development:

```text
DATABASE_URL=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
```

`NEXTAUTH_SECRET` is required because `lib/auth/options.ts` passes
`process.env.NEXTAUTH_SECRET` to Auth.js and `middleware.ts` uses the same value
to decode JWTs. This project does not read `AUTH_SECRET`.

Production required values:

```text
DATABASE_URL=...
NEXTAUTH_SECRET=...
NEXTAUTH_URL=https://nyra-jet.vercel.app
```

Optional integrations:

```text
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
RESEND_API_KEY=...
AUTH_EMAIL_FROM=...
```

If `RESEND_API_KEY` and `AUTH_EMAIL_FROM` are missing, authentication emails are logged to the local server console for development.

Check local auth configuration without printing secret values:

```bash
npm run auth:check-env
```

Generate a local Auth.js secret if needed:

```bash
openssl rand -base64 32
```

## Database Setup

Generate the Prisma client after dependency or schema changes:

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

Reset the local database when you want a clean run:

```bash
dropdb nyra_dev
createdb nyra_dev
npm run db:push
npm run db:seed
npm run auth:seed-users
```

## Seed Authentication Users

The auth seed script creates or updates two verified active Nyra `User` records, bcrypt-hashes their passwords, reconciles their Learner Profiles, and grants AdminAccess only to the admin user. It is idempotent and safe to run multiple times.

```bash
npm run auth:seed-users
```

Seeded admin:

```text
Email: admin@nyra.local
Password: Admin123!
```

Expected records:

- `User` exists with a bcrypt `passwordHash`.
- `emailVerifiedAt` is set and `status = ACTIVE`.
- Learner Profile exists.
- AdminAccess exists and has `revokedAt = null`.

Seeded student:

```text
Email: student@nyra.local
Password: Student123!
```

Expected records:

- `User` exists with a bcrypt `passwordHash`.
- `emailVerifiedAt` is set and `status = ACTIVE`.
- Learner Profile exists.
- No AdminAccess record exists.

Grant AdminAccess manually for a user id:

```sql
insert into "AdminAccess" ("id", "authUserId", "grantedBy")
values (gen_random_uuid(), '<user-id>', '<granting-operator-id>')
on conflict ("authUserId")
do update set "revokedAt" = null, "updatedAt" = now();
```

Revoke AdminAccess:

```sql
update "AdminAccess"
set "revokedAt" = now(), "updatedAt" = now()
where "authUserId" = '<user-id>';
```

## Start the Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

Useful local pages:

```text
http://localhost:3000/login?ui=en
http://localhost:3000/signup?ui=en
http://localhost:3000/forgot-password
http://localhost:3000/profile?ui=en
http://localhost:3000/admin?ui=en
http://localhost:3000/admin-access-denied
http://localhost:3000/practice?ui=en
http://localhost:3000/learn?ui=en
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
- Refresh and confirm the session is restored.

3. Login as student:

- Logout.
- Open `/login?ui=en`.
- Sign in with `student@nyra.local` and `Student123!`.
- Confirm the app redirects to `/profile` or the requested `returnTo` URL.
- Refresh and confirm the session is restored.

4. Verify signup:

- Open `/signup?ui=en`.
- Create a new account with a unique email and an 8+ character password.
- Confirm the account is created, logged in, and redirected to `/profile`.
- Confirm a verification email is sent through Resend or logged locally.
- Confirm exactly one Learner Profile exists for the new user id.

5. Verify admin page:

- As the admin user, open `/admin?ui=en`.
- Confirm the admin dashboard loads.
- Confirm an admin API mutation reaches validation instead of returning `401` or `403`.

6. Verify student admin denial:

- As the student user, open `/admin?ui=en`.
- Confirm the app shows `/admin-access-denied`.
- Confirm an admin API mutation returns `403` with `Admin Access is required.`

7. Verify learner profile provisioning:

- Delete a user's Learner Profile row only.
- Login or refresh as that user.
- Confirm exactly one Learner Profile row is recreated for that `authUserId`.
- Login or refresh again and confirm no duplicate Learner Profile is created.

8. Verify logout:

- Use the logout control.
- Confirm the app redirects to `/login`.
- Open `/profile` and confirm it redirects to `/login?returnTo=/profile`.

9. Verify errors:

- Submit login with an invalid password and confirm a form error appears.
- Try signing up with an existing email and confirm a uniqueness error appears.

10. Verify email verification:

- Use the verification link from the local console or email provider.
- Confirm `/verify-email` marks `emailVerifiedAt`.
- Confirm the profile no longer prompts for verification.

11. Verify password reset:

- Open `/forgot-password`.
- Submit a verified account email and confirm the public response is generic.
- Use the reset link from the local console or email provider.
- Confirm `/reset-password` changes the password.
- Submit an unverified account email and confirm no reset email is sent.

12. Verify Google OAuth when configured:

- Set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.
- Sign in with a Google account whose email matches an existing Nyra user.
- Confirm no duplicate `User` or Learner Profile is created.
- Confirm a new verified Google email creates one Nyra `User`, one ProviderAccount, and one Learner Profile.

13. Verify disabled accounts:

- Set a user's `status` to `DISABLED`.
- Confirm credentials login fails with the same generic invalid-credentials behavior.
- Confirm existing server-side session resolution no longer treats the user as signed in.

## Verification Commands

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Stop the Server

Press `Ctrl+C` in the terminal running `npm run dev`.
