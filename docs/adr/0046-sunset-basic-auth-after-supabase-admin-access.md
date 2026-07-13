# Sunset Basic Auth after Supabase Admin Access

Basic Auth may remain as a temporary local or emergency path for operator access while Nyra's real authentication path is being integrated. Production Admin Access should move to Supabase-authenticated identity plus Nyra-owned roles, and Basic Auth should be removed or disabled once that path is proven, because shared credentials do not provide the same identity boundary or auditability.
