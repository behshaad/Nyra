# Admin Access owned outside Learner Profile

Nyra will store AdminAccess as a Nyra-owned permission keyed to the authenticated user id, separate from the Learner Profile. Auth.js participates in session handling, while Nyra owns accounts, roles, and operator permission; this keeps learning identity separate from operational permission and avoids depending on email naming rules for authorization.
