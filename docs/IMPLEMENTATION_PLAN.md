# Nyra Implementation Plan

Status: Draft for approval
Review date: 2026-07-08

This plan intentionally breaks the project into small, independently buildable and reviewable milestones. Each phase should be approved before implementation begins.

## Phase 0: Repository And Documentation Baseline

Goal: Create a clean project home with approved docs and decision records.

Tasks:

- Move or copy approved planning docs into `docs/`.
- Create `CONTEXT.md` glossary for domain terms.
- Create `docs/adr/` for major architecture decisions.
- Add README with current project status and development workflow.

Files to create:

- `README.md`
- `CONTEXT.md`
- `docs/adr/0001-content-hierarchy.md`
- `docs/adr/0002-mvp-ai-scope.md`

Files to modify:

- Existing docs after approval.

Dependencies:

- Approval of terminology and MVP scope.

Acceptance Criteria:

- Repo contains the canonical documentation.
- Core terms are defined.
- MVP scope contradictions are resolved.

Estimated Complexity: Low
Estimated Development Time: 0.5-1 day
Possible Risks: Copying draft docs without resolving contradictions.

## Phase 1: Project Scaffold

Goal: Set up the application foundation.

Tasks:

- Initialize Next.js with TypeScript.
- Configure TailwindCSS.
- Add linting, formatting, and strict TypeScript.
- Add base app layout.
- Add environment configuration pattern.

Files to create:

- `package.json`
- `tsconfig.json`
- `next.config.ts`
- `app/layout.tsx`
- `app/page.tsx`
- `styles/globals.css`

Files to modify:

- `README.md`

Dependencies:

- Phase 0.

Acceptance Criteria:

- App runs locally.
- Typecheck and lint pass.
- No placeholder feature code.

Estimated Complexity: Low
Estimated Development Time: 0.5-1 day
Possible Risks: Premature folder complexity.

## Phase 2: Design System Foundation

Goal: Establish reusable UI primitives for a premium, mobile-first product.

Tasks:

- Define typography, colors, spacing, and RTL/LTR rules.
- Build accessible base components.
- Add layout primitives for learner and admin surfaces.

Files to create:

- `components/ui/button.tsx`
- `components/ui/input.tsx`
- `components/ui/card.tsx`
- `components/ui/dialog.tsx`
- `components/layout/app-shell.tsx`
- `components/layout/admin-shell.tsx`

Files to modify:

- `styles/globals.css`
- `tailwind.config.ts`

Dependencies:

- Phase 1.

Acceptance Criteria:

- Components are typed and accessible.
- Persian and German text render correctly together.
- Mobile layout works without clipping.

Estimated Complexity: Medium
Estimated Development Time: 1-2 days
Possible Risks: Creating too many components before real screens need them.

## Phase 3: Authentication And Profiles

Goal: Let users sign up, sign in, and own a learner profile.

Tasks:

- Configure Auth.js credentials and Google OAuth.
- Build sign up, login, logout, email verification, and password reset.
- Create Nyra-owned User, provider-link, verification/reset token, AdminAccess, and Learner Profile models.
- Add protected route and admin API handling.

Files to create:

- `lib/auth/*`
- `app/(auth)/login/page.tsx`
- `app/(auth)/signup/page.tsx`
- `app/(learner)/onboarding/page.tsx`
- `prisma/schema.prisma`

Files to modify:

- `app/layout.tsx`

Dependencies:

- Phase 1.
- `DATABASE_URL` and `NEXTAUTH_SECRET`.
- Optional `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `RESEND_API_KEY`, and `AUTH_EMAIL_FROM`.

Acceptance Criteria:

- User can sign up, login, logout, verify email, reset a password after verification, and create a profile.
- Protected pages reject unauthenticated users.
- AdminAccess remains the only durable admin authorization source.
- Disabled accounts cannot sign in.
- Profile stores native language, learning goal, daily goal, and current level.

Estimated Complexity: Medium
Estimated Development Time: 2-4 days
Possible Risks: session and Learner Profile provisioning edge cases.

## Phase 4: Core Content Schema

Goal: Model the approved learning hierarchy.

Tasks:

- Implement course/content tables.
- Implement content statuses.
- Implement vocabulary, grammar, examples, exercises, questions, resources.
- Add seed data for a tiny A1 sample.

Files to create:

- `prisma/migrations/*`
- `lib/content/content-types.ts`
- `lib/content/content-repository.ts`
- `prisma/seed.ts`

Files to modify:

- `prisma/schema.prisma`

Dependencies:

- Phase 0 hierarchy decision.
- Phase 3 database setup.

Acceptance Criteria:

- Published content can be queried by course/level/unit/skill.
- Draft content is not visible to learner queries.
- Sample A1 path loads from the database.

Estimated Complexity: High
Estimated Development Time: 3-5 days
Possible Risks: Ambiguous `Lesson`/`Skill` decision causing schema churn.

## Phase 5: Admin Content Management MVP

Goal: Let admins manage the learning hierarchy without direct database editing.

Tasks:

- Add admin authorization.
- Build admin dashboard shell.
- CRUD levels, units, skills.
- CRUD vocabulary, grammar, examples, exercises, questions.
- Publish/archive content.
- Log admin actions.

Files to create:

- `app/(admin)/admin/page.tsx`
- `app/(admin)/admin/content/*`
- `lib/admin/authorization.ts`
- `lib/admin/audit-log.ts`
- `components/admin/*`

Files to modify:

- `prisma/schema.prisma`

Dependencies:

- Phase 4.

Acceptance Criteria:

- Admin can create and publish a complete sample skill.
- Learners only see published content.
- Important admin actions are logged.

Estimated Complexity: High
Estimated Development Time: 5-8 days
Possible Risks: CMS scope expanding into version history/import/export too early.

## Phase 6: Learner Dashboard And Learning Path

Goal: Show learners where they are and what to do next.

Tasks:

- Build dashboard summary.
- Build learning path by level/unit/skill.
- Show locked, available, completed, and reviewable states.
- Recommend next skill.

Files to create:

- `app/(learner)/dashboard/page.tsx`
- `app/(learner)/learn/page.tsx`
- `lib/progress/progress-summary.ts`
- `components/learning-path/*`

Files to modify:

- `lib/content/content-repository.ts`

Dependencies:

- Phase 4.

Acceptance Criteria:

- User sees current level, XP, streak, progress, daily goal, and next skill.
- Locked units clearly explain how to unlock.
- Completed skills remain reviewable.

Estimated Complexity: Medium
Estimated Development Time: 3-5 days
Possible Risks: Progress model under-specified.

## Phase 7: Skill Learning Session

Goal: Deliver the core learning loop for one Skill.

Tasks:

- Start/resume a skill session.
- Present content blocks and questions.
- Evaluate MVP question types.
- Provide feedback and explanations.
- Requeue incorrect questions later in the session.
- Complete a skill.

Files to create:

- `app/(learner)/learn/skills/[skillId]/page.tsx`
- `lib/question-engine/*`
- `lib/learning-session/*`
- `components/exercises/*`

Files to modify:

- `prisma/schema.prisma`

Dependencies:

- Phase 4.
- Phase 6.

Acceptance Criteria:

- Learner can complete one published skill end to end.
- Incorrect answers show explanation and repeat later.
- Attempts are persisted.
- XP is awarded through server-side rules.

Estimated Complexity: High
Estimated Development Time: 5-8 days
Possible Risks: Question Engine interface chosen too narrowly or too generically.

## Phase 8: Checkpoints And Unit Unlocking

Goal: Gate unit progression through checkpoints.

Tasks:

- Implement checkpoint sessions.
- Configure passing score.
- Persist attempts and results.
- Unlock next unit after passing.
- Allow unlimited retries.

Files to create:

- `app/(learner)/learn/checkpoints/[checkpointId]/page.tsx`
- `lib/checkpoints/*`
- `components/checkpoints/*`

Files to modify:

- `lib/progress/*`
- `prisma/schema.prisma`

Dependencies:

- Phase 7.

Acceptance Criteria:

- Unit checkpoint can be taken and retried.
- Passing unlocks the next unit.
- Failing gives review guidance without punishment.

Estimated Complexity: Medium
Estimated Development Time: 3-5 days
Possible Risks: Unlock rules mixed into UI instead of server-side policy.

## Phase 9A: Spaced Repetition Core

Goal: Add review memory support tied to vocabulary.

Tasks:

- Allow personal flashcards.
- Implement spaced repetition state.
- Store one current review state per Learner Profile and Flashcard.
- Append `FLASHCARD_REVIEWED` Progress Events for review history.
- Build flashcard review screen.
- Treat new Flashcards as due now.
- Support focused review for one Flashcard Deck and all-due review across decks.

Files to create:

- `app/(learner)/flashcards/page.tsx`
- `lib/flashcards/*`
- `components/flashcards/*`

Files to modify:

- `prisma/schema.prisma`

Dependencies:

- Phase 4.
- Phase 7.

Acceptance Criteria:

- Due flashcards appear in review.
- Review answers update due dates.
- Review history is preserved as Progress Events.
- Unknown Flashcards reappear later in the same review session.
- Study mode does not update spaced repetition state.

Estimated Complexity: Medium
Estimated Development Time: 3-5 days
Possible Risks: Overcomplicated spaced repetition algorithm in MVP.

## Phase 9B: Flashcard Mistake Suggestions

Goal: Connect wrong Question attempts to explicitly linked Flashcards.

Tasks:

- Add explicit Question-to-Flashcard linking.
- Add admin UI for attaching Flashcards to Questions.
- Suggest linked Flashcards when a learner answers a Question incorrectly.
- Avoid inferred text matching for the first version.

Files to modify:

- `prisma/schema.prisma`
- `lib/question-engine/*`
- `components/admin-question-form.tsx`
- `components/backend-skill-session.tsx`

Dependencies:

- Phase 9A.

Acceptance Criteria:

- Admin can link a Question to one or more relevant Flashcards.
- Wrong-answer feedback can suggest explicitly linked Flashcards.
- Suggestions never depend on fuzzy text matching.

Estimated Complexity: Medium
Estimated Development Time: 2-4 days
Possible Risks: Suggesting too many cards and distracting from the active learning session.

## Phase 10: Gamification

Goal: Encourage consistency without distracting from learning.

Tasks:

- Implement XP events.
- Implement streak calculation.
- Implement daily goals.
- Implement basic achievements and badges.
- Show progress confirmation UI.

Files to create:

- `lib/gamification/*`
- `components/gamification/*`

Files to modify:

- `app/(learner)/dashboard/page.tsx`
- `prisma/schema.prisma`

Dependencies:

- Phase 7.

Acceptance Criteria:

- XP and streak are derived from learning activity.
- Daily goal progress updates after study.
- Achievements are awarded once and remain permanent.

Estimated Complexity: Medium
Estimated Development Time: 3-4 days
Possible Risks: Mutable counters drifting from event history.

## Phase 11: Resource Library

Goal: Provide curated resources connected to learning.

Tasks:

- Build learner resource library.
- Add admin resource management.
- Support PDFs, videos, songs, podcasts, websites, and books.
- Filter by level, category, and related skill.

Files to create:

- `app/(learner)/resources/page.tsx`
- `app/(admin)/admin/resources/*`
- `lib/resources/*`
- `components/resources/*`

Files to modify:

- `prisma/schema.prisma`

Dependencies:

- Phase 5.

Acceptance Criteria:

- Admin can publish resources.
- Learners can browse published resources.
- Premium gating can be applied later without rewriting resource access.

Estimated Complexity: Medium
Estimated Development Time: 2-4 days
Possible Risks: File storage/security skipped for uploads.

## Phase 12: Student Profile And Settings

Goal: Give learners account, progress, subscription, and preference controls.

Tasks:

- Build profile tabs.
- Edit profile fields.
- Manage daily goal, learning goal, language preferences, notification preferences.
- Add data export/delete request entry points.
- Show active sessions if supported.

Files to create:

- `app/(learner)/profile/page.tsx`
- `lib/profile/*`
- `components/profile/*`

Files to modify:

- `prisma/schema.prisma`

Dependencies:

- Phase 3.
- Phase 6.

Acceptance Criteria:

- User can view and update profile/settings.
- Privacy actions exist and are server-handled.
- Subscription status placeholder is wired to the billing model when available.

Estimated Complexity: Medium
Estimated Development Time: 3-5 days
Possible Risks: Privacy workflows treated as UI-only.

## Phase 13: Basic Analytics

Goal: Provide meaningful learner and admin metrics.

Tasks:

- Capture analytics events.
- Build learner progress history.
- Build basic admin analytics.
- Identify difficult questions from attempt data.

Files to create:

- `lib/analytics/*`
- `components/analytics/*`
- `app/(admin)/admin/analytics/page.tsx`

Files to modify:

- `app/(learner)/dashboard/page.tsx`
- `app/(learner)/profile/page.tsx`

Dependencies:

- Phase 7.
- Phase 10.

Acceptance Criteria:

- Learner sees study time, XP history, completed skills, and flashcard stats.
- Admin sees active users, completion rates, and difficult questions.
- Analytics are based on persisted events/attempts.

Estimated Complexity: Medium
Estimated Development Time: 3-5 days
Possible Risks: Dashboard queries becoming expensive.

## Phase 14: Payment And Subscription

Goal: Implement Free/Premium access safely.

Tasks:

- Choose payment provider.
- Model plans, subscriptions, invoices, coupons, and payment events.
- Implement checkout/upgrade.
- Implement webhook handling with signature verification.
- Gate premium content server-side.
- Build subscription profile UI.

Files to create:

- `lib/billing/*`
- `app/(learner)/pricing/page.tsx`
- `app/(learner)/profile/subscription/*`
- `app/api/billing/webhook/route.ts`

Files to modify:

- `prisma/schema.prisma`
- `lib/content/content-repository.ts`

Dependencies:

- Payment provider decision.
- Phase 6.

Acceptance Criteria:

- Free users can access approved free content.
- Premium users can access full content.
- Subscription changes are driven by verified webhooks.
- Completed free content remains accessible after expiration.

Estimated Complexity: High
Estimated Development Time: 5-8 days
Possible Risks: Provider limitations for target market.

## Phase 15: Admin AI Drafting

Goal: Let admins use AI to draft content without auto-publishing.

Tasks:

- Add local Ollama provider wrapper.
- Build admin AI draft actions.
- Store AI provenance.
- Require human review before publish.
- Add usage/error handling.

Files to create:

- `lib/ai/*`
- `app/(admin)/admin/ai/*`
- `components/admin/ai-draft-panel.tsx`

Files to modify:

- `prisma/schema.prisma`
- Admin content edit screens.

Dependencies:

- Phase 5.
- Explicit approval that MVP AI is admin-only.

Acceptance Criteria:

- Admin can generate draft vocabulary/grammar/examples/questions.
- AI output cannot become learner-visible without publish approval.
- AI failures do not block manual content creation.

Estimated Complexity: Medium
Estimated Development Time: 3-5 days
Possible Risks: Local Ollama availability differs between development and production.

## Phase 16: QA, Hardening, And Launch Readiness

Goal: Prepare the MVP for real users.

Tasks:

- Add integration and end-to-end tests for critical flows.
- Add rate limiting and security headers.
- Add error monitoring.
- Add backup/restore process.
- Add deployment documentation.
- Run accessibility and mobile QA.

Files to create:

- `tests/*`
- `docs/deployment.md`
- `docs/security.md`

Files to modify:

- App and service files as issues are found.

Dependencies:

- All launch-scope phases.

Acceptance Criteria:

- Critical flows pass automated tests.
- Production env variables are documented.
- Admin, payment, auth, and learning flows have security review.
- Mobile QA passes.

Estimated Complexity: High
Estimated Development Time: 5-10 days
Possible Risks: Treating QA as a final cleanup instead of continuous validation.

## Recommended Approval Order

Approve these decisions before Phase 1 implementation:

1. MVP scope: A1-only polished launch versus A1-B2 broad launch.
2. Content hierarchy: define or remove `Lesson`.
3. AI scope: admin-only MVP versus learner-facing MVP.
4. Payment provider and target-market constraints.
5. Progress model: event-based attempts plus summaries versus mutable progress rows.

## Question Engine Interface Design Notes

The Question Engine should not be a generic database CRUD wrapper. It should hide session ordering, answer evaluation, XP policy hooks, delayed repetition, and feedback construction behind a small learner-runtime interface.

Preferred initial shape:

```ts
interface QuestionEngine {
  startOrResumeSession(input: StartSessionInput): Promise<LearningSessionView>;
  submitAnswer(input: SubmitAnswerInput): Promise<AnswerFeedbackView>;
  advance(input: AdvanceSessionInput): Promise<LearningSessionView | SessionSummary>;
}
```

Why this direction:

- It is deep enough to hide runtime complexity.
- It fits the common learner flow.
- It keeps admin content authoring separate from learner session evaluation.
- It can evolve later for adaptive practice without exposing internal queue logic too early.

Synthesis from three interface alternatives:

- Avoid separate public methods per exercise type. That would make the interface shallow and hard to extend.
- Avoid exposing admin publishing in the runtime engine. Draft/review/publish belongs to the CMS workflow.
- Keep `advance()` separate from `submitAnswer()` so the UI can show feedback before moving to the next question.
- Internally, use typed exercise handlers or plugins for multiple choice, fill-in blank, word ordering, and reading comprehension.
- Do not expose a fully generic plugin/policy system to application callers in MVP. It is useful internally, but too flexible as the first public module boundary.
