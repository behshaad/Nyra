# Nyra

Nyra is a German learning product for Persian speakers. This context defines the product language used when discussing learning, content, progress, subscriptions, and administration.

## Language

**Nyra**:
The canonical product name for the German learning platform for Persian speakers.
_Avoid_: Nira

**Course**:
A complete learning offering for a source-language audience learning a target language.
_Avoid_: Program, track

**Level**:
A major proficiency band inside a Course, such as A1 or A2.
_Avoid_: Stage

**Level Selector**:
A learner-facing control for choosing which Level's Learning Path to view or continue, such as A1 or A2.
_Avoid_: Language toggle, course switcher

**Current Level**:
The earliest learner-available Level that the learner has not completed. Current Level is derived from progress and is distinct from the Level the learner has selected to view.
_Avoid_: Selected Level, currentLevel preference

**Selected Level**:
The learner-available Level a learner has chosen to view or most recently visited. Selecting a Level does not change progression or make it the Current Level.
_Avoid_: Current Level, active proficiency

**Level World**:
A learner-facing adventure map owned by a Level, where the learner sees that Level's Units as nodes on a themed path.
_Avoid_: Lesson world, module map

**Unit Node**:
A learner-facing node inside a Level World that represents one Unit and leads the learner into that Unit's Skills. A Unit Node can use localized map-label language such as Lesson, درس, or Lektion without changing the canonical domain term Unit.
_Avoid_: Skill node, lesson node

**Curriculum Reference**:
An external learning source used to understand topic progression, skill coverage, and proficiency expectations without copying its exact wording, exercises, or proprietary sequence as Nyra content.
_Avoid_: Source content, imported textbook

**Unit**:
A themed group of Skills inside a Level. For A1, a Unit represents a major learner-facing theme aligned to the Curriculum Reference's broad lesson progression, not a copied textbook chapter.
_Avoid_: Module, chapter

**Skill**:
The smallest learner-visible learning unit that a learner opens, completes, reviews, and earns progress for. In A1, a Skill represents a communicative outcome, while grammar summaries, vocabulary support, pronunciation notes, and readings are Resources unless they need their own completion loop.
_Avoid_: Lesson

**Question**:
A learner-facing prompt that expects an answer and can produce feedback.
_Avoid_: Exercise item, quiz item

**Question Type**:
The authored answer pattern for a Question, such as multiple choice, fill-in-blank, or word ordering.
_Avoid_: UI widget, answer mode

**Question Attempt**:
A learner's submitted response to an exact Question Revision at a specific moment.
_Avoid_: Answer, response record

**Question Review**:
A learner-facing review of a previously answered Question, showing the submitted response and feedback without changing the original Question Attempt.
_Avoid_: Edit answer, retake question

**Accepted Answer**:
An authored answer variant that should be treated as correct for a Question, alongside the Question's canonical correct answer. Accepted Answers are used for deterministic tolerance such as spelling variants, umlaut alternatives, or harmless punctuation differences, not for broad subjective equivalence.
_Avoid_: Fuzzy answer, approximate answer

**Suggested Flashcard**:
A Flashcard explicitly linked to a Question to help a learner review the gap revealed by an incorrect Question Attempt. A Question can have multiple Suggested Flashcards, ordered by author priority.
_Avoid_: Related card, automatic recommendation

**Resource**:
Supporting learning material that helps a learner study outside a Skill's required Questions. In A1, Resources can include warmups, grammar summaries, vocabulary support, pronunciation notes, reading support, and worksheets attached to a Unit or Skill.
_Avoid_: Extra, asset

**Resource Library**:
The learner-facing collection of Published Resources.
_Avoid_: Materials page

**Resource Type**:
The kind of support a Resource provides, such as book, video, audio lesson, external link, grammar resource, reading material, or learning guide.
_Avoid_: Category

**Learning Session**:
A learner's active or completed run through an exact Skill Revision and its ordered Question Revisions, including feedback, retries, completion, and summary.
_Avoid_: Lesson session, practice run

**Unit Checkpoint**:
A short assessment at the end of a Unit that samples the Unit's vocabulary, grammar, reading-style comprehension, and communicative phrases.
_Avoid_: Quiz, mini exam

**Final Level Test**:
A level-level assessment that samples across all Units in a Level and gives the learner a clear score or readiness result for that Level.
_Avoid_: Final A1 Test, Final A2 Test, final quiz, placement test

**Soft Gate**:
A progress signal that marks a Unit or Level as needing review when the learner scores below the passing threshold, without blocking continued exploration.
_Avoid_: Locked gate, hard prerequisite

**Flashcard Deck**:
A named group of Flashcards organized for review by Level, category, and optionally a Unit. A learner-created Flashcard Deck can be empty while the learner is preparing it. A Flashcard Deck can be admin-authored for learner study or learner-created for personal study; learners can study admin-authored decks but do not edit them.
_Avoid_: Flashcard unit, card folder, collection

**Flashcard**:
A review card inside a Flashcard Deck that pairs a German prompt with Persian support. Admin-authored Flashcards usually include example usage and study metadata such as difficulty or optional pronunciation support, while learner-created Flashcards can be lighter-weight.
_Avoid_: Vocabulary item, term card

**Pronunciation Audio**:
An optional audio recording attached to a Flashcard to demonstrate the German prompt's pronunciation during study or review.
_Avoid_: Speech evaluation, audio lesson

**Spaced Repetition**:
A review scheduling method that decides when a learner should see a Flashcard again based on the learner's previous review result for that Flashcard.
_Avoid_: Random review, simple shuffle

**New Flashcard**:
A Flashcard the learner has not reviewed yet.
_Avoid_: Due card, unseen item

**Due Flashcard**:
A Flashcard the learner has reviewed before and should review again now according to Spaced Repetition.
_Avoid_: New card, overdue-only card

**Review Queue**:
The ordered set of exact Flashcard Revisions selected for an intentional review session from a learner's New Flashcards and Due Flashcards.
_Avoid_: Study list, random deck

**Learning Path**:
The ordered learner-facing route through a Level's Units and Skills. A Learning Path can show upcoming Skills before all of them are fully authored, as long as publication state makes learner availability clear.
_Avoid_: Course outline, syllabus

**Practice Journey**:
The complete learner-facing progression experience for a Course, composed of its Level Worlds and their Learning Paths.
_Avoid_: Learning Path, Level World, curriculum hierarchy

**Journey Presentation**:
The authored visual configuration of a Practice Journey, including Level World copy, artwork, tones, and node placement. Journey Presentation does not own curriculum hierarchy, learning content, Learner Availability, or progress.
_Avoid_: Practice Journey, Course Structure, learner progress

**Learner Availability**:
The derived determination that content can appear in the learner experience. A structural container is available only through learner-available content within it, rather than through its own publication state.
_Avoid_: Publication Status, Content Readiness, visibility flag

**Learner Preview**:
An administrator-facing simulation of the Published learner experience using an isolated learner state. Learner Preview does not use or change the administrator's own Learner Profile or learning progress.
_Avoid_: Admin learning session, administrator progress, Draft Journey Preview

**Compact Learning Path**:
A learner-facing Learning Path view that shows the Level structure without listing every Skill at once. The learner should see a selected Unit, its Skills, and the recommended next action without excessive scrolling.
_Avoid_: Full syllabus list, long path page

**Next Skill**:
The next recommended Skill or assessment in the learner's current Learning Path sequence. After a regular Skill it is usually the following Skill in the Unit; after the final regular Skill it is the Unit Checkpoint; after a Unit Checkpoint it is the next Unit's first Skill.
_Avoid_: Next lesson

**Learner Profile**:
The learner-owned product identity that describes a person's learning goal, languages, current level, daily goal, preferences, and onboarding state. A Learner Profile can be provisioned when an authenticated person first enters Nyra, but it remains distinct from the Account.
_Avoid_: Account, user metadata

**Active Learner**:
A Learner Profile that performs at least one meaningful learning action during a measured period, such as starting a Skill, submitting a Question answer, completing a Skill, or reviewing a Flashcard. Signing in or viewing a page without a learning action does not make a learner active.
_Avoid_: Active User, logged-in user, page visitor

**Demo Learner Profile**:
A seeded Learner Profile used only for local development, testing, sample data, or demonstration. A Demo Learner Profile is not a real authenticated learner and must remain isolated from real learner progress, preferences, and achievements.
_Avoid_: Test user, default account

**Account**:
The identity, credentials, access, contact, and subscription-facing settings around an authenticated person using Nyra. For the MVP, an Account is unique by verified email and has one Learner Profile for now; multiple Courses or Levels belong under that Learner Profile.
_Avoid_: Learner Profile, learning identity, provider identity

**Disabled Account**:
An Account that Nyra has soft-disabled so it can no longer sign in or create new authenticated sessions. A Disabled Account retains its Learner Profile, progress, flashcards, and history rather than being hard-deleted.
_Avoid_: Deleted account, banned user

**Email Verification**:
An account trust signal proving that an Account's email address can receive messages for that person. Email Verification can be required for sensitive account, billing, recovery, and admin-adjacent operations, but it does not block learning access and does not grant Admin Access.
_Avoid_: Login approval, admin approval

**Admin Access**:
The single durable permission that lets a trusted operator manage Nyra content and review operational surfaces. Admin Access remains distinct from a Learner Profile; session roles such as Admin or User are derived views, not a separate authorization model.
_Avoid_: Admin preview, shared admin password, role system

**Admin Notification**:
An actionable operational event shown to administrators, such as content awaiting review, a failed media operation, a high-severity application error, a security action, or a content-integrity warning. Admin Notifications are distinct from learner messages and must represent real system state.
_Avoid_: Learner notification, placeholder alert, marketing message

**Source Language**:
The language a learner uses as their base for explanations, translations, and learning support.
_Avoid_: Native language

**Persian-First Support**:
A content style where explanations, grammar help, and learning scaffolding use Persian to reduce friction, while practice increasingly asks learners to recognize, choose, order, or produce German.
_Avoid_: Persian-only teaching, translation-only content

**Persian-First Learner UI**:
A learner-facing interface style where navigation, controls, feedback, progress labels, and system messages are Persian and right-to-left, while German learning phrases remain left-to-right where readability requires it.
_Avoid_: English learner UI, mixed-direction guessing

**Target Language**:
The language a learner is studying in a Course.
_Avoid_: Learning language

**Interface Language**:
The language used by Nyra's navigation, controls, account screens, and other product UI. Nyra can offer Persian, English, and German Interface Languages without changing the Course's Source Language or Target Language.
_Avoid_: App language

**Interface Language Toggle**:
A learner-facing control for changing Nyra's Interface Language, such as Persian, English, or German, without changing the learner's Level, Source Language, Target Language, or Course.
_Avoid_: Level selector, learning language switcher

**Interface Theme**:
The learner-facing display preference for Nyra's visual mode, such as light, dark, or system.
_Avoid_: Color palette, skin

**Deployment Target**:
The external platform that serves Nyra to learners and runs the production web application. Nyra's current Deployment Target is Vercel.
_Avoid_: Hosting account, server, environment

**Draft**:
Content that is being created or edited and is not visible to learners.
_Avoid_: Unpublished

**In Review**:
Content that is ready for human review but is not yet visible to learners.
_Avoid_: Pending

**Published**:
Content that has been approved and can be shown to learners.
_Avoid_: Live

**Archived**:
Content that has been removed from normal learner access without deleting its history.
_Avoid_: Deleted, hidden

**Protected Deletion**:
Permanent removal of a never-published content identity that has no learner history or protected references. A Draft Revision of an existing identity can be discarded without deleting that identity, while previously Published or historically referenced content must be Archived.
_Avoid_: Cascade deletion, deleting published content

**Content Readiness**:
An administrator-facing assessment of whether learning content is complete enough for its publication state and applicable authored-content target. Content Readiness is derived independently of Publication Status, so Published or Runnable content can still need attention.
_Avoid_: Publication Status, ready to publish

**Runnable Skill**:
A Published Skill with enough Published required Questions to start and complete a Learning Session. Runnable does not mean the Skill meets its Content Readiness target.
_Avoid_: Content-ready Skill, playable Skill

**Content Revision**:
An authored version of a stable learning-content identity. Revisions allow content to change without breaking learner history, ordering, or analytics tied to that identity.
_Avoid_: Duplicate content, copied item

**Draft Revision**:
The editable Content Revision being prepared for review while the current Published Revision, if any, remains learner-visible.
_Avoid_: Editing Published content, replacement item

**Published Revision**:
The approved Content Revision currently used by the learner experience. A content identity has at most one Published Revision at a time.
_Avoid_: Published item, live draft

**Skill Revision**:
A Content Revision containing a Skill's authored metadata and complete ordered set of Question Revisions. A Skill Revision is reviewed and published as one unit.
_Avoid_: Independent Question release, partial Skill update

**Flashcard Deck Revision**:
A Content Revision containing an admin-authored Flashcard Deck's metadata and complete ordered set of Flashcard Revisions. A Flashcard Deck Revision is reviewed and published as one unit.
_Avoid_: Independent admin Flashcard release, partial Deck update

**Resource Revision**:
A Content Revision containing a Resource's authored content, metadata, destinations, and media references. A Resource Revision is reviewed and published independently of the Unit or Skill it supports.
_Avoid_: Parent Skill revision, partial Resource update

**Course Structure Revision**:
A Content Revision containing the membership and ordering of Levels, Units, and Skills within a Course. It is reviewed and published as one hierarchy without owning learning content or Journey Presentation.
_Avoid_: Course publication status, Journey Presentation, Skill Revision

**Course Release**:
An atomic promotion of compatible reviewed Course Structure and Journey Presentation revisions when a structural change affects the learner-visible Practice Journey.
_Avoid_: Course publication status, content release, independent structure publish
