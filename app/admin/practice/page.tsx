import Link from "next/link";
import {
  AlertTriangle,
  ArrowUpRight,
  BookOpen,
  CheckCircle2,
  CircleDot,
  Eye,
  FileQuestion,
  Languages,
  Layers3,
  LockKeyhole,
  Map,
  Plus,
  Route,
  Settings2
} from "lucide-react";
import { getAuthSession } from "@/lib/auth/server";
import { getLearnerPreferencesForAuthUser } from "@/lib/learner/preferences";
import { getAdminPracticeSelection } from "@/lib/admin/practice-repository";
import type {
  AdminPracticeHealth,
  AdminPracticeOverview,
  AdminPracticeSkill
} from "@/lib/admin/practice-overview";
import { getLevelWorldConfig } from "@/lib/practice/level-worlds";
import { WORLD_LAYOUT } from "@/components/practice/world-map/worldLayout";
import { UNIT_WORLD_LAYOUT } from "@/components/practice/world/unitWorldLayout";

export const dynamic = "force-dynamic";

const copy = {
  en: {
    eyebrow: "Practice operations",
    title: "Practice Journey",
    body: "Inspect the authored Course hierarchy, learner availability, content readiness, and the presentation learners receive.",
    preview: "Learner Preview",
    manageSkills: "Manage Skills",
    course: "Course",
    chooseCourse: "Choose a Course to inspect its Practice Journey.",
    noCourseTitle: "No Course exists yet",
    noCourseBody: "The Practice Journey needs a database-owned Course before Levels, Units, and Skills can be inspected.",
    backToAdmin: "Back to Admin",
    levels: "Levels",
    units: "Units",
    skills: "Skills",
    questions: "Questions",
    learnerAvailable: "learner-available",
    requiredPublished: "Published required",
    needsAttention: "need attention",
    hierarchy: "Course hierarchy",
    hierarchyBody: "All authored records are shown. Learners only receive runnable Published Skills.",
    presentation: "Journey Presentation",
    legacy: "Legacy code-managed",
    legacyBody: "The active visual configuration is read-only until database-backed Draft and Published presentation revisions are implemented.",
    configuredWorlds: "configured Level Worlds",
    configuredUnits: "Units with static coordinates",
    nextMilestone: "Next: database-backed presentation",
    emptyStructure: "This Course has no Levels yet.",
    emptyLevel: "This Level has no Units.",
    emptyUnit: "This Unit has no Skills.",
    items: "items",
    questionTarget: "required Published Questions",
    editSkill: "Edit Draft",
    viewSkill: "View",
    manageQuestions: "Manage Questions",
    addQuestion: "Add Question",
    readOnly: "Read-only until Draft Revisions",
    regular: "Regular Skill",
    checkpoint: "Unit Checkpoint",
    finalTest: "Final Level Test",
    notRunnable: "Published but not runnable: no Published required Questions.",
    belowTarget: "Runnable, but below its Content Readiness target.",
    status: {
      available: "Available",
      needs_attention: "Needs attention",
      in_preparation: "In preparation",
      archived_only: "Archived only",
      empty: "Empty"
    }
  },
  fa: {
    eyebrow: "عملیات تمرین",
    title: "مسیر تمرین",
    body: "ساختار دوره، دسترسی یادگیرنده، آمادگی محتوا و نمایشی را که یادگیرنده می‌بیند بررسی کنید.",
    preview: "پیش‌نمایش یادگیرنده",
    manageSkills: "مدیریت مهارت‌ها",
    course: "دوره",
    chooseCourse: "یک دوره را برای بررسی مسیر تمرین انتخاب کنید.",
    noCourseTitle: "هنوز دوره‌ای وجود ندارد",
    noCourseBody: "پیش از بررسی سطح‌ها، یونیت‌ها و مهارت‌ها باید یک دوره در پایگاه داده وجود داشته باشد.",
    backToAdmin: "بازگشت به مدیریت",
    levels: "سطح‌ها",
    units: "یونیت‌ها",
    skills: "مهارت‌ها",
    questions: "سؤال‌ها",
    learnerAvailable: "در دسترس یادگیرنده",
    requiredPublished: "الزامی و منتشرشده",
    needsAttention: "نیازمند توجه",
    hierarchy: "ساختار دوره",
    hierarchyBody: "همه رکوردهای تألیف‌شده نمایش داده می‌شوند. یادگیرنده فقط مهارت‌های منتشرشده و قابل اجرا را می‌بیند.",
    presentation: "نمایش مسیر",
    legacy: "قدیمی و مدیریت‌شده در کد",
    legacyBody: "پیکربندی تصویری فعلی تا پیاده‌سازی نسخه‌های پیش‌نویس و منتشرشدهٔ پایگاه‌داده فقط خواندنی است.",
    configuredWorlds: "دنیای سطح پیکربندی‌شده",
    configuredUnits: "یونیت با مختصات ثابت",
    nextMilestone: "مرحله بعد: نمایش مبتنی بر پایگاه داده",
    emptyStructure: "این دوره هنوز سطحی ندارد.",
    emptyLevel: "این سطح هنوز یونیتی ندارد.",
    emptyUnit: "این یونیت هنوز مهارتی ندارد.",
    items: "مورد",
    questionTarget: "سؤال الزامی منتشرشده",
    editSkill: "ویرایش پیش‌نویس",
    viewSkill: "مشاهده",
    manageQuestions: "مدیریت سؤال‌ها",
    addQuestion: "افزودن سؤال",
    readOnly: "فقط خواندنی تا پیاده‌سازی نسخه‌های پیش‌نویس",
    regular: "مهارت عادی",
    checkpoint: "ارزیابی یونیت",
    finalTest: "آزمون نهایی سطح",
    notRunnable: "منتشرشده اما غیرقابل اجرا: سؤال الزامی منتشرشده ندارد.",
    belowTarget: "قابل اجرا است، اما به هدف آمادگی محتوا نرسیده است.",
    status: {
      available: "در دسترس",
      needs_attention: "نیازمند توجه",
      in_preparation: "در حال آماده‌سازی",
      archived_only: "فقط آرشیو",
      empty: "خالی"
    }
  }
};

type PracticeCopy = (typeof copy)["en"];

function healthIcon(health: AdminPracticeHealth) {
  if (health === "needs_attention") return AlertTriangle;
  if (health === "available") return CheckCircle2;
  if (health === "archived_only") return LockKeyhole;
  return CircleDot;
}

function StatusBadge({ health, t }: { health: AdminPracticeHealth; t: PracticeCopy }) {
  const Icon = healthIcon(health);

  return (
    <span className={`practice-admin-status is-${health}`}>
      <Icon aria-hidden="true" size={13} />
      {t.status[health]}
    </span>
  );
}

function skillKindLabel(skill: AdminPracticeSkill, t: PracticeCopy) {
  if (skill.kind === "UNIT_CHECKPOINT") return t.checkpoint;
  if (skill.kind === "FINAL_TEST") return t.finalTest;
  return t.regular;
}

function SkillRow({ skill, t }: { skill: AdminPracticeSkill; t: PracticeCopy }) {
  return (
    <article className={`practice-admin-skill is-${skill.health}`}>
      <div className="practice-admin-skill-order" aria-hidden="true">
        {skill.order}
      </div>
      <div className="practice-admin-skill-main">
        <div className="practice-admin-skill-heading">
          <div>
            <span>{skillKindLabel(skill, t)}</span>
            <h4>{skill.title}</h4>
          </div>
          <StatusBadge health={skill.health} t={t} />
        </div>
        <p>{skill.description}</p>
        <div className="practice-admin-skill-meta">
          <span>{skill.publicationStatus.replaceAll("_", " ")}</span>
          <span>
            {skill.requiredPublishedQuestionCount}/{skill.questionTarget} {t.questionTarget}
          </span>
          {skill.issue ? (
            <strong>
              {skill.issue === "not_runnable" ? t.notRunnable : t.belowTarget}
            </strong>
          ) : null}
        </div>
      </div>
      <div className="practice-admin-skill-actions">
        <Link className="ghost-button compact-link" href={`/admin/skills/${skill.slug}/edit`}>
          {skill.canEdit ? t.editSkill : t.viewSkill}
        </Link>
        <Link className="ghost-button compact-link" href={`/admin/skills/${skill.slug}/questions`}>
          <FileQuestion aria-hidden="true" size={15} />
          {t.manageQuestions}
        </Link>
        {skill.canEdit ? (
          <Link
            className="ghost-button compact-link"
            href={`/admin/skills/${skill.slug}/questions/new`}
          >
            <Plus aria-hidden="true" size={15} />
            {t.addQuestion}
          </Link>
        ) : (
          <small>{t.readOnly}</small>
        )}
      </div>
    </article>
  );
}

function Hierarchy({ overview, t }: { overview: AdminPracticeOverview; t: PracticeCopy }) {
  if (overview.levels.length === 0) {
    return <div className="practice-admin-empty">{t.emptyStructure}</div>;
  }

  return (
    <div className="practice-admin-levels">
      {overview.levels.map((level) => (
        <details
          className={`practice-admin-level is-${level.health}`}
          key={level.id}
          open={level.health === "needs_attention" || level.order === 1}
        >
          <summary>
            <div className="practice-admin-level-title">
              <span>{level.label}</span>
              <div>
                <h3>{level.title}</h3>
                <small>
                  {level.units.length} {t.units}
                </small>
              </div>
            </div>
            <StatusBadge health={level.health} t={t} />
          </summary>
          <div className="practice-admin-units">
            {level.units.length === 0 ? (
              <div className="practice-admin-empty">{t.emptyLevel}</div>
            ) : (
              level.units.map((unit) => (
                <section className={`practice-admin-unit is-${unit.health}`} key={unit.id}>
                  <header>
                    <div>
                      <span>
                        {level.label} · {unit.order}
                      </span>
                      <h3>{unit.title}</h3>
                      <p>{unit.summary}</p>
                    </div>
                    <StatusBadge health={unit.health} t={t} />
                  </header>
                  <div className="practice-admin-skills">
                    {unit.skills.length === 0 ? (
                      <div className="practice-admin-empty">{t.emptyUnit}</div>
                    ) : (
                      unit.skills.map((skill) => <SkillRow key={skill.id} skill={skill} t={t} />)
                    )}
                  </div>
                </section>
              ))
            )}
          </div>
        </details>
      ))}
    </div>
  );
}

export default async function AdminPracticePage({
  searchParams
}: {
  searchParams: Promise<{ course?: string }>;
}) {
  const { course } = await searchParams;
  const session = await getAuthSession();
  const preferences = session ? await getLearnerPreferencesForAuthUser(session.id) : null;
  const language = preferences?.interfaceLanguage === "fa" ? "fa" : "en";
  const t = copy[language];
  const selection = await getAdminPracticeSelection(course);
  const overview = selection.overview;
  const configuredWorldCount = overview
    ? overview.levels.filter((level) => getLevelWorldConfig(level.label)).length
    : 0;
  const configuredUnitCount = overview
    ? overview.levels.reduce(
        (total, level) =>
          total +
          level.units.filter((unit) => `Lesson${unit.order}` in UNIT_WORLD_LAYOUT).length,
        0
      )
    : 0;
  const configuredLevelCoordinateCount = overview
    ? overview.levels.filter((level) => level.label in WORLD_LAYOUT).length
    : 0;

  return (
    <div className="practice-admin-page">
      <header className="practice-admin-hero">
        <div>
          <span className="section-label">{t.eyebrow}</span>
          <h1>{t.title}</h1>
          <p>{t.body}</p>
        </div>
        <div className="practice-admin-hero-actions">
          {overview ? (
            <Link
              className="primary-button"
              href={`/admin/practice/preview?course=${encodeURIComponent(overview.slug)}`}
            >
              <Eye aria-hidden="true" size={17} />
              {t.preview}
            </Link>
          ) : null}
          <Link className="secondary-button" href="/admin/skills">
            <BookOpen aria-hidden="true" size={17} />
            {t.manageSkills}
          </Link>
        </div>
      </header>

      {selection.courses.length > 1 ? (
        <nav className="practice-admin-course-switcher" aria-label={t.course}>
          <strong>{t.course}</strong>
          <div>
            {selection.courses.map((option) => (
              <Link
                aria-current={overview?.slug === option.slug ? "page" : undefined}
                className={overview?.slug === option.slug ? "active" : undefined}
                href={`/admin/practice?course=${encodeURIComponent(option.slug)}`}
                key={option.slug}
              >
                {option.title}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}

      {!overview ? (
        <section className="practice-admin-zero-state">
          <Map aria-hidden="true" size={30} />
          <h2>{selection.selectionRequired ? t.chooseCourse : t.noCourseTitle}</h2>
          <p>{selection.selectionRequired ? t.chooseCourse : t.noCourseBody}</p>
          <Link className="secondary-button" href="/admin">
            {t.backToAdmin}
          </Link>
        </section>
      ) : (
        <>
          <section className="practice-admin-course-summary">
            <div>
              <span>{t.course}</span>
              <h2>{overview.title}</h2>
              <p>
                {overview.sourceLanguage.toUpperCase()} → {overview.targetLanguage.toUpperCase()}
              </p>
            </div>
            <Route aria-hidden="true" size={32} />
          </section>

          <section className="practice-admin-metrics" aria-label={t.hierarchy}>
            {[
              {
                label: t.levels,
                value: overview.metrics.levels.authored,
                detail: `${overview.metrics.levels.learnerAvailable} ${t.learnerAvailable}`,
                icon: Languages
              },
              {
                label: t.units,
                value: overview.metrics.units.authored,
                detail: `${overview.metrics.units.learnerAvailable} ${t.learnerAvailable}`,
                icon: Layers3
              },
              {
                label: t.skills,
                value: overview.metrics.skills.authored,
                detail: `${overview.metrics.skills.learnerAvailable} ${t.learnerAvailable} · ${overview.metrics.skills.needsAttention} ${t.needsAttention}`,
                icon: BookOpen
              },
              {
                label: t.questions,
                value: overview.metrics.questions.authored,
                detail: `${overview.metrics.questions.learnerAvailableRequired} ${t.requiredPublished}`,
                icon: FileQuestion
              }
            ].map((metric) => {
              const Icon = metric.icon;
              return (
                <article key={metric.label}>
                  <Icon aria-hidden="true" size={18} />
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <small>{metric.detail}</small>
                </article>
              );
            })}
          </section>

          <div className="practice-admin-layout">
            <section className="practice-admin-hierarchy-panel">
              <header>
                <div>
                  <span className="panel-kicker">{overview.slug}</span>
                  <h2>{t.hierarchy}</h2>
                  <p>{t.hierarchyBody}</p>
                </div>
                <Settings2 aria-hidden="true" size={21} />
              </header>
              <Hierarchy overview={overview} t={t} />
            </section>

            <aside className="practice-admin-presentation-panel">
              <div className="practice-admin-presentation-heading">
                <Map aria-hidden="true" size={21} />
                <div>
                  <span>{t.presentation}</span>
                  <strong>{t.legacy}</strong>
                </div>
              </div>
              <p>{t.legacyBody}</p>
              <dl>
                <div>
                  <dt>{t.configuredWorlds}</dt>
                  <dd>
                    {configuredWorldCount}/{overview.levels.length}
                  </dd>
                </div>
                <div>
                  <dt>Level coordinates</dt>
                  <dd>
                    {configuredLevelCoordinateCount}/{overview.levels.length}
                  </dd>
                </div>
                <div>
                  <dt>{t.configuredUnits}</dt>
                  <dd>
                    {configuredUnitCount}/{overview.metrics.units.authored}
                  </dd>
                </div>
              </dl>
              <div className="practice-admin-next-milestone">
                <CircleDot aria-hidden="true" size={16} />
                <span>{t.nextMilestone}</span>
              </div>
              <Link
                className="ghost-button"
                href={`/admin/practice/preview?course=${encodeURIComponent(overview.slug)}`}
              >
                {t.preview}
                <ArrowUpRight aria-hidden="true" size={16} />
              </Link>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
