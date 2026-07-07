# Supabase Auth domain boundary

Nyra will use Supabase Auth for identity and session management while keeping Nyra-specific product data in its own domain models. Supabase Auth owns signup, login, password reset, email verification, and sessions; Nyra owns learner profiles, roles, progress, content, subscriptions, and admin audit history.

## Consequences

Application code should not treat Supabase user metadata as the source of truth for learning or business state. Nyra records may reference the authenticated user identity, but product behavior should be driven by Nyra-owned domain data.
