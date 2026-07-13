# Admin Access owned outside Learner Profile

Nyra will store Admin Access as a Nyra-owned permission keyed to the authenticated identity, separate from the Learner Profile. Supabase Auth verifies identity and sessions, while Nyra decides whether that identity can use operator surfaces; this keeps learning identity separate from operational permission and avoids depending on Supabase roles, user metadata, or email naming rules for authorization.
