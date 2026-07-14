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
