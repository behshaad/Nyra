# Nyra Project Review Report

Status: Draft for approval
Reviewed source docs: `/Users/happyman/Desktop/nyra`
Review date: 2026-07-08

## 1. Executive Summary

Nyra has a strong product foundation: a Persian-first German learning platform with structured CEFR progression, human-reviewed content, smart review, gamification, premium subscriptions, and AI assistance that supports rather than replaces education.

The main risk is not the product idea. The main risk is that the current documentation is still too high-level to implement safely. Several core terms are overloaded, especially `Lesson`, `Skill`, `Exercise`, `Question`, `Checkpoint`, `Progress`, and `AI Assistance`. The docs also mix MVP and future scope in ways that would cause scope creep.

Recommended direction:

- Treat Version 1 as a guided learning MVP with admin-authored, human-reviewed content.
- Keep learner-facing AI out of the first public MVP unless explicitly approved as a separate milestone.
- Model learning content, learning sessions, progress events, subscriptions, and publication workflow as separate concepts.
- Build the admin CMS early, because the product depends on content quality and operational editing.
- Avoid building adaptive learning, AI tutor flows, community, mobile apps, or advanced analytics until the learning loop is proven.

## 2. Product Strengths

- Clear target audience: Persian speakers learning German.
- Strong differentiation through Persian-first explanations, goals, examples, and migration/exam context.
- Good learning philosophy: structured CEFR progression, practical grammar, real-life examples, and review.
- Healthy premium philosophy: no hearts, forced waiting, ads, or punishment-driven monetization.
- Good AI philosophy: AI assists learning and content creation, but human-reviewed content remains authoritative.
- Documentation-first workflow is appropriate for an education product.
- Admin-first principle is correct because content operations are central to the business.

## 3. Product Weaknesses

- MVP scope is too broad: A1-B2, admin CMS, flashcards, resource library, analytics, AI, payments, checkpoints, and profile all in one MVP is high risk.
- The learning unit model is unclear: docs alternate between `Skill`, `Lesson`, `Exercise`, `Question`, and `Checkpoint`.
- "First 30 lessons" conflicts with the documented hierarchy if `Lesson` is not a formal entity.
- Free/Premium boundaries are not aligned across docs.
- Learner-facing AI is contradictory: PRD and roadmap say admin-only MVP AI, while AI and payment docs mention learner AI in Version 1.
- Placement test appears optional in rules/payment, future in AI/roadmap, and absent from the MVP implementation detail.
- No clear source of truth for content publishing, review, versioning, or rollback.

## 4. Missing Features

- Onboarding flow: goal selection, current level, daily goal, and placement-test choice.
- Email verification, password reset, account recovery, and session management.
- Content preview and learner-facing locked-content preview.
- Search inside lessons/resources.
- Accessibility requirements, including RTL Persian support and keyboard navigation.
- Audio playback requirements and audio asset management.
- Notification delivery rules for reminders.
- Subscription webhooks and billing-provider reconciliation.
- Admin audit log viewer.
- Content import/export.
- Error reporting and support/contact flow.

## 5. Missing Documentation

- Glossary/domain model defining `Level`, `Unit`, `Skill`, `Lesson`, `Exercise`, `Question`, `Checkpoint`, `Flashcard`, and `Progress`.
- MVP scope contract separating launch requirements from future features.
- API design.
- UI/UX flows and wireframes.
- Authorization matrix for learner/admin/editor roles.
- Data privacy policy and data-retention rules.
- Payment provider decision and webhook lifecycle.
- Content publication workflow with review, version history, and rollback.
- Testing strategy.
- Deployment and environment strategy.
- Observability strategy: logs, metrics, errors, analytics events.
- SEO and public marketing strategy, if the website will include public pages.

## 6. UX Improvements

- Define a first-session path: sign up, choose learning goal, choose daily goal, start first skill.
- Replace "users should never feel lost" with concrete UI states: next lesson card, locked unit explanation, checkpoint retry guidance, and review suggestions.
- Use Persian-first explanations, but keep German content visually distinct from Persian translations.
- Make the learning screen focused: one primary action, immediate feedback, and a clear path to continue.
- Add a "why this matters" micro-section to each Skill, aligned with the Vision document.
- Avoid gamification overload in early screens; show XP/streak but keep learning task central.
- For premium prompts, use gentle previews at boundaries, never interruption during an active lesson.
- Plan mobile-first lesson interactions from day one.

## 7. Architecture Review

The planned stack is reasonable: Next.js, React, TypeScript, TailwindCSS, PostgreSQL, Prisma, Supabase Auth/Storage, Vercel.

Recommended architecture:

- Next.js app with domain-oriented modules rather than generic `backend/` folders.
- Server-side authorization for all admin and subscription-gated routes.
- PostgreSQL as the source of truth for content, progress, billing state, and events.
- Supabase Auth only for identity/session management, not as the full domain model.
- A clear separation between authored content and runtime learning sessions.
- Event-style records for progress, XP, streaks, and answers, with derived summaries for dashboards.

Architectural risk:

- If `Progress` is a single mutable row, analytics, streak repair, auditability, and adaptive learning will become difficult.
- If exercise types are stored as unstructured JSON without typed validation, admin content quality will decline.
- If AI and human-authored content share the same publication path without status and provenance, trust will be weakened.

## 8. Database Review

The database doc lists the right broad entities but is not yet implementable.

Needed changes:

- Add `Language`, `Course`, or `LearningTrack` now, even if Version 1 only teaches German to Persian speakers.
- Add formal `Lesson` or remove the term everywhere. Current docs mention "First 30 Lessons" but the hierarchy does not define Lesson consistently.
- Split content definitions from user progress.
- Add content status, publication timestamps, author/reviewer fields, and versioning.
- Represent many-to-many relationships explicitly: vocabulary-to-skill, grammar-to-skill, resources-to-skill/unit, questions-to-vocabulary/grammar.
- Store answer attempts, not just completed skills.
- Model subscriptions, invoices, coupons, payment provider customer IDs, and webhook events.
- Store notification preferences and privacy/account lifecycle states.
- Add audit logs for admin actions.

Recommended core data groups:

- Identity and access: users, profiles, roles, admin audit logs.
- Content: courses, levels, units, skills, content blocks, exercises, questions, vocabulary, grammar, examples, resources.
- Publication: content status, versions, review approvals.
- Learning runtime: sessions, question attempts, checkpoint attempts, completion events.
- Retention: XP events, streak events, achievements, badges, daily goals.
- Review: flashcards, user flashcards, spaced repetition state.
- Commerce: plans, subscriptions, invoices, coupons, payment events.

## 9. Backend Review

Missing backend requirements:

- API route boundaries.
- Authorization rules.
- Rate limiting, especially for AI, auth, and payment endpoints.
- Idempotency for payments and progress writes.
- Input validation strategy.
- Error model.
- Background job strategy for reminders, streaks, reports, and subscription reconciliation.
- File upload validation for audio/PDF/image resources.

Recommendation:

- Build a typed service layer behind route handlers.
- Use Zod or equivalent validation at API boundaries.
- Keep content reads optimized for published learner content.
- Keep admin mutations explicit and auditable.

## 10. Frontend Review

The docs specify the product feel but not enough UI behavior.

Needed frontend flows:

- Public landing/pricing page.
- Auth pages.
- Onboarding.
- Learner dashboard.
- Learning path.
- Skill learning session.
- Checkpoint session.
- Flashcard review.
- Resource library.
- Student profile.
- Subscription upgrade/manage.
- Admin CMS.

Risks:

- Admin CMS can become large quickly; start with the content hierarchy and publishing workflow.
- Mobile lesson UX needs careful design for word ordering, reading comprehension, and feedback.
- RTL Persian plus LTR German needs component-level design rules.

## 11. AI Review

The AI philosophy is strong, but scope is contradictory.

Contradiction:

- PRD and roadmap: MVP AI is admin-only.
- AI doc and payment doc: Version 1 includes learner-facing AI assistance.

Recommendation:

- Phase 1: no AI in learner runtime.
- Phase 2: admin-only AI drafting with provenance and human review.
- Phase 3: limited learner AI explanations only after core lessons, progress, and content quality are stable.

AI guardrails needed:

- AI output status must be `Draft` until reviewed.
- Store prompt, model, source content, and reviewer metadata for AI-assisted content.
- Never let AI unlock progression or grade subjective answers without deterministic rules or human review.
- Add daily usage limits and provider abstraction before any paid AI provider.

## 12. Security Review

Missing security requirements:

- Role-based access control beyond listing roles.
- Admin route protection.
- Content publishing permissions.
- Audit logs for admin and billing actions.
- File upload scanning/type validation.
- Rate limiting.
- CSRF/session strategy depending on auth approach.
- Payment webhook signature verification.
- Data deletion/export workflow.
- Secret management and environment separation.

High-risk areas:

- Admin user management and subscription changes.
- AI endpoints, if exposed to learners.
- Payment webhooks.
- Resource uploads.

## 13. Scalability Review

The product claims future multilingual expansion, but the current content model is German/Persian-specific.

Needed for scalability:

- Model source language, target language, and interface language separately.
- Do not hardcode CEFR as the only possible progression system, though it can be the first supported framework.
- Design exercise types as typed variants.
- Add indexes for published content lookup, progress queries, due flashcards, and admin search.
- Plan CDN/storage strategy for audio and PDFs.
- Use event records for analytics rather than relying only on mutable summary fields.

## 14. Performance Review

Likely bottlenecks:

- Learning path page if it loads all nested content.
- Admin CMS search/filter across content.
- Flashcard due-card queries.
- Analytics dashboards.
- Audio/resource loading.
- AI responses if learner-facing AI is enabled too early.

Recommendations:

- Load learning path summaries separately from lesson content.
- Precompute dashboard summaries from event records.
- Paginate admin lists.
- Use optimistic UI carefully for answer submission but commit progress server-side.
- Cache published content reads where safe.

## 15. Technical Debt Risks

- Building too many modules before the core learning loop is proven.
- Treating docs as fixed specs despite contradictions.
- Creating a generic CMS that is not tailored to educational workflow.
- Storing questions as loose JSON without validation.
- Mixing admin AI drafts with approved content.
- Making premium gating rules ad hoc in the frontend.
- Delaying billing and permission models until after content is built.
- Ignoring RTL/LTR design until late.

## 16. Business Risks

- Content creation effort is the biggest business cost. A1-B2 launch scope may be too ambitious.
- Premium conversion depends on enough free value and a visible path to paid value.
- Local Ollama may help during development but does not automatically solve production AI operations.
- Iranian/Persian-speaking payment access may require provider research, regional pricing, and local constraints.
- If the product launches with shallow content across many levels, it may feel less trustworthy than a smaller but polished A1 path.

## 17. Final Recommendations

1. Narrow MVP to a polished A1 learning loop before attempting full A1-B2.
2. Resolve the content hierarchy: either introduce `Lesson` formally or remove it and call the paid boundary "first 30 Skills".
3. Decide whether learner-facing AI is in MVP. Recommendation: no.
4. Create a domain glossary before schema work.
5. Create ADRs for the hard-to-reverse choices: content hierarchy, progress/event model, auth provider, payment provider, and AI scope.
6. Build the product in thin vertical slices: auth, content schema, admin authoring, learner skill session, progress, checkpoint, flashcards, subscriptions.
7. Treat analytics as event capture first and dashboards second.
8. Build with mobile-first Persian/German typography and RTL/LTR handling from the first UI milestone.
9. Add security and audit requirements before implementing admin or payments.
10. Do not implement code until the contradictions above are approved or revised.

