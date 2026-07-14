# Auth.js first-party authentication

Nyra will use Auth.js as its authentication framework while owning the account system in the project database. Nyra owns users, password hashes, AdminAccess, Learner Profiles, password changes, password reset, email verification, and account data; Auth.js provides the framework for credentials, OAuth providers, and secure HTTP-only session handling.

Supabase Auth is no longer part of Nyra's authentication architecture. Supabase may be used only as a PostgreSQL database service if Nyra chooses that deployment shape later.

## Consequences

The authentication system does not depend on Supabase Auth or another external identity provider for email/password login. Every authenticated person has a Nyra `User`, every `User` can be provisioned with one Learner Profile, and AdminAccess remains a separate Nyra-owned permission keyed to the authenticated user id.

Google Sign-In remains in scope through an Auth.js OAuth provider rather than Supabase Auth.

For the MVP, Nyra has only two effective session roles: User and Admin. AdminAccess is the source of truth for Admin; the session role is a derived convenience and should not become a separate persistent role model.

For the MVP, Nyra has one Account per verified email address. A Google OAuth identity with a verified email should link to the existing Nyra `User` for that email instead of creating a duplicate account, and an email/password credential added later for the same verified email should point to the same `User`.

Email/password registration should not block learning while the email is unverified. Unverified learners may sign in, complete lessons, earn XP, use flashcards, and use resources; Email Verification is required for sensitive account operations such as password recovery, email changes, future billing/subscription features, and any admin-adjacent operation. Admin authorization still comes only from active AdminAccess, never from Email Verification alone.

Password reset requires Email Verification. Public password reset requests should use generic responses to avoid revealing whether an email address is registered or eligible; internally, Nyra should send reset mail only when the account exists and its email is verified. If a signed-in or otherwise safely identified unverified account needs recovery help, Nyra should guide the person toward resending the verification email before allowing reset.

Anonymous authentication flows must not reveal whether an email exists, is verified, is registered, or is disabled. Forgot-password, login, and password reset requests should use generic public responses; personalized guidance such as "verify your email" or "resend verification email" belongs only in authenticated or cryptographically verified contexts.

MVP sessions should use one simple Auth.js policy: a rolling 30-day session for all signed-in accounts. Nyra should not implement Remember Me, trusted devices, device/session management, session revocation, or login history until a future requirement justifies that complexity.

For the MVP, Account lifecycle supports active accounts and soft-disabled accounts only. A Disabled Account cannot sign in or create new sessions, but Nyra retains its Learner Profile, progress, flashcards, and history; self-service account deletion, data export, scheduled deletion, and broader privacy workflows are post-MVP features.

Production Auth.js configuration requires `NEXTAUTH_SECRET`; Nyra's current Auth.js v4 integration does not read `AUTH_SECRET`. Production should also set `NEXTAUTH_URL` to the public deployment origin for canonical callback and email links.
