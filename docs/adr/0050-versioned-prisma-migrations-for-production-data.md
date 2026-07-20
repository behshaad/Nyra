# Versioned Prisma migrations for production data

Nyra will apply Admin Panel and future production schema changes through committed Prisma migrations rather than relying on `prisma db push`. Migrations must preserve existing learner and authored content through explicit backfills when required, giving deployments a reviewable schema history and preventing destructive drift once the database contains operational data.
