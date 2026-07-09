# Graph Report - Nyra  (2026-07-09)

## Corpus Check
- 87 files · ~31,448 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 402 nodes · 779 edges · 29 communities (20 shown, 9 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `7a6059a1`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Prisma Database Access
- App Header Components
- Nyra Course Glossary Terms
- Content Creation & Management
- Node.js Project Dependencies
- Skill Session Evaluation Logic
- A1 Unit Progress Tracking
- TypeScript Compiler Configuration
- Admin Question Form Interface
- A1 Content Progression Data
- Backend Development Setup
- Resource Management Forms
- Skill Input Validation
- Graphify & Prisma Schema
- Next.js Configuration Settings
- TypeScript Environment Definitions
- Course Definition
- Learner Profile Data
- UI/UX Design Summary
- A1 MVP Scope Details
- Admin-Reviewed AI Features
- Event-Based Progress Model
- Supabase Auth Domain Limits
- Next.js Development Server
- Nyra Implementation Phases
- Nyra Project Review Findings
- Flashcard Study Components

## God Nodes (most connected - your core abstractions)
1. `getPrisma()` - 42 edges
2. `getLearnerPreferences()` - 27 edges
3. `resolveInterfaceLanguage()` - 23 edges
4. `AppHeader()` - 22 edges
5. `AnimatedBackdrop()` - 17 edges
6. `withInterfaceLanguage()` - 17 edges
7. `Nyra Domain Glossary` - 17 edges
8. `compilerOptions` - 16 edges
9. `InterfaceCopy` - 13 edges
10. `Text` - 13 edges

## Surprising Connections (you probably didn't know these)
- `AdminPage()` --calls--> `getAdminSkillUnits()`  [EXTRACTED]
  app/admin/page.tsx → lib/admin/skill-repository.ts
- `NewResourcePage()` --calls--> `getResourceFormOptions()`  [EXTRACTED]
  app/admin/resources/new/page.tsx → lib/resources/resource-repository.ts
- `EditSkillPage()` --calls--> `getAdminSkillBySlug()`  [EXTRACTED]
  app/admin/skills/[skillSlug]/edit/page.tsx → lib/admin/skill-repository.ts
- `NewQuestionPage()` --calls--> `getAdminSkillBySlug()`  [EXTRACTED]
  app/admin/skills/[skillSlug]/questions/new/page.tsx → lib/admin/skill-repository.ts
- `AdminSkillsPage()` --calls--> `getAdminSkillUnits()`  [EXTRACTED]
  app/admin/skills/page.tsx → lib/admin/skill-repository.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **MVP Workflow** — docs_adr_0005_single_course_language_aware_mvp, docs_adr_0006_content_publication_workflow, docs_adr_0007_prisma_postgresql_domain_store [EXTRACTED 0.80]
- **A1 Curriculum Flow** — setup_py, stw_a1_kb_pdf, netzwerk_neue_a1_1_pdf, a1_skill_assessment_count [EXTRACTED 0.80]

## Communities (29 total, 9 thin omitted)

### Community 0 - "Prisma Database Access"
Cohesion: 0.08
Nodes (37): MoveDirection, parseDirection(), PATCH(), PATCH(), PATCH(), PATCH(), POST(), POST() (+29 more)

### Community 1 - "App Header Components"
Cohesion: 0.11
Nodes (45): AdminPage(), labels, FlashcardsPage(), inter, metadata, RootLayout(), vazirmatn, LearnPage() (+37 more)

### Community 2 - "Nyra Course Glossary Terms"
Cohesion: 0.11
Nodes (18): Course, Final A1 Test, Interface Language, Interface Theme, Learner Profile, Learning Path, Learning Session, Level (+10 more)

### Community 3 - "Content Creation & Management"
Cohesion: 0.08
Nodes (32): buildUnits(), choiceSet(), cloneQuestion(), devLearnerProfile, getPublishedResource(), getPublishedResources(), getPublishedSkill(), getPublishedSkills() (+24 more)

### Community 4 - "Node.js Project Dependencies"
Cohesion: 0.06
Nodes (35): dependencies, clsx, lucide-react, next, pg, @prisma/adapter-pg, @prisma/client, react (+27 more)

### Community 5 - "Skill Session Evaluation Logic"
Cohesion: 0.13
Nodes (21): BackendSkillSession(), getTextDirection(), LastFeedback, LoadState, NextSkillLink, EvaluatableQuestion, evaluateAnswer(), normalizeAnswer() (+13 more)

### Community 6 - "A1 Unit Progress Tracking"
Cohesion: 0.19
Nodes (16): generateStaticParams(), SkillPage(), getPublishedSkillBySlug(), CompletionMetadata, DbSkillForPath, DbUnitForPath, getA1UnitsFromDb(), getFlatA1Skills() (+8 more)

### Community 7 - "TypeScript Compiler Configuration"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 8 - "Admin Question Form Interface"
Cohesion: 0.19
Nodes (11): asStringArray(), EditQuestionPage(), asStringArray(), SkillQuestionsPage(), AdminQuestionForm(), publicationStatuses, QuestionInitialValues, questionTypes (+3 more)

### Community 9 - "A1 Content Progression Data"
Cohesion: 0.18
Nodes (12): A1 question volume, A1 Skill and assessment count, Single-course language-aware MVP, Content publication workflow, Prisma and PostgreSQL domain store, Twelve-unit A1 progression, Fully playable A1 content rollout, Netzwerk neue A1.1.pdf (+4 more)

### Community 10 - "Backend Development Setup"
Cohesion: 0.17
Nodes (12): brew services start postgresql@16, createdb nyra_dev, Set DATABASE_URL, http://localhost:3000, npm install, npm run build, npm run db:push, npm run db:seed (+4 more)

### Community 11 - "Resource Management Forms"
Cohesion: 0.21
Nodes (12): NewResourcePage(), EditResourcePage(), AdminResourceForm(), publicationStatuses, resourceIcons, ResourceInitialValues, resourceTypes, SkillOption (+4 more)

### Community 12 - "Skill Input Validation"
Cohesion: 0.24
Nodes (8): AdminSkillsPage(), EditSkillPage(), NewQuestionPage(), AdminSkillForm(), publicationStatuses, SkillInitialValues, getAdminSkillBySlug(), getAdminSkillUnits()

### Community 13 - "Graphify & Prisma Schema"
Cohesion: 0.20
Nodes (9): Best Practices, Graphify, Ignore Rules, Indexed Scope, Installation, Query Workflow, Rebuild The Graph, Troubleshooting (+1 more)

### Community 16 - "Course Definition"
Cohesion: 0.33
Nodes (5): Content Hierarchy, Database Schema, Enums, Important Relationships, Learner Runtime

### Community 43 - "Nyra Implementation Phases"
Cohesion: 0.15
Nodes (13): Nyra Implementation Plan, Phase 0 Repository And Documentation Baseline, Phase 1 Project Scaffold, Phase 10 Subscriptions And Premium Boundaries, Phase 11 Admin Reviewed AI Drafting, Phase 2 Design System Foundation, Phase 3 Authentication And Profiles, Phase 4 Core Content Schema (+5 more)

### Community 44 - "Nyra Project Review Findings"
Cohesion: 0.20
Nodes (10): Nyra Project Review Report, AI Review, Architecture Review, Backend Review, Database Review, Frontend Review, Performance Review, Final Recommendations (+2 more)

### Community 45 - "Flashcard Study Components"
Cohesion: 0.33
Nodes (5): CardStatus, FlashcardStudy(), Flashcard, FlashcardDifficulty, flashcards

## Knowledge Gaps
- **188 isolated node(s):** `graphify`, `Repository workflow`, `Enums`, `Content Hierarchy`, `Learner Runtime` (+183 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `getPrisma()` connect `Prisma Database Access` to `App Header Components`, `A1 Unit Progress Tracking`, `Admin Question Form Interface`, `Resource Management Forms`, `Skill Input Validation`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Why does `prisma` connect `Node.js Project Dependencies` to `Prisma Database Access`?**
  _High betweenness centrality (0.079) - this node is a cross-community bridge._
- **What connects `graphify`, `Repository workflow`, `Enums` to the rest of the system?**
  _189 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Prisma Database Access` be split into smaller, more focused modules?**
  _Cohesion score 0.07547169811320754 - nodes in this community are weakly interconnected._
- **Should `App Header Components` be split into smaller, more focused modules?**
  _Cohesion score 0.1110523532522475 - nodes in this community are weakly interconnected._
- **Should `Nyra Course Glossary Terms` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `Content Creation & Management` be split into smaller, more focused modules?**
  _Cohesion score 0.08235294117647059 - nodes in this community are weakly interconnected._