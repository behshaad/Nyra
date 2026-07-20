# Public Vercel Blob for MVP learning media

Nyra will store administrator-uploaded images, PDFs, audio, and video in a public Vercel Blob store for the MVP. Public Blob fits Nyra's Vercel Deployment Target and serves learner-facing media directly without routing downloads through application functions; admin authorization, file-type and size validation, randomized paths, and database-backed media metadata remain application responsibilities. Private or access-controlled storage is deferred until Nyra has media that must not be publicly retrievable.
