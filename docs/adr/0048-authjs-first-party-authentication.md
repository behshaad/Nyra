# Auth.js first-party authentication

Nyra will use Auth.js as its authentication framework while owning the account system in the project database. Nyra owns users, password hashes, roles, AdminAccess, Learner Profiles, password changes, password reset, email verification, and account data; Auth.js provides the framework for credentials, OAuth providers, and secure HTTP-only session handling.

Supabase Auth is no longer part of Nyra's authentication architecture. Supabase may be used only as a PostgreSQL database service if Nyra chooses that deployment shape later.

## Consequences

The authentication system does not depend on Supabase Auth or another external identity provider for email/password login. Every authenticated person has a Nyra `User`, every `User` can be provisioned with one Learner Profile, and AdminAccess remains a separate Nyra-owned permission keyed to the authenticated user id.

Google Sign-In remains in scope through an Auth.js OAuth provider rather than Supabase Auth.
