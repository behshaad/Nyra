# Admin Access owned outside Learner Profile

Nyra will store AdminAccess as the single durable authorization model for the MVP, keyed to the authenticated user id and separate from the Learner Profile. Auth.js may expose a derived User/Admin role in the session for UI and middleware convenience, but authorization decisions must ultimately be validated against active AdminAccess; this keeps learning identity separate from operational permission and avoids introducing a broader role system before the product needs it.
