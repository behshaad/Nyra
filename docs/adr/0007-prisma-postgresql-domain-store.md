# Prisma and PostgreSQL domain store

Nyra will use Prisma with PostgreSQL as the durable store for Nyra-owned domain data. Content, learner profiles, learning sessions, question attempts, progress events, publication state, and later billing records belong in the product database rather than auth metadata or frontend state.

## Consequences

Auth.js provides session handling, but Nyra's users, AdminAccess, learner profiles, and product behavior should read and write through the domain store. The first implementation should establish the Prisma schema around the approved learning hierarchy and progress model.
