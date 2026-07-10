import Link from "next/link";
import {
  Archive,
  BookOpen,
  Circle,
  FileText,
  GraduationCap,
  Languages,
  Layers3,
  ListChecks,
  Pencil,
  Plus,
  Rocket,
  ShieldCheck,
  Sparkles,
  UsersRound
} from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import {
  interfaceCopy,
  resolveInterfaceLanguage,
  withInterfaceLanguage
} from "@/lib/i18n/interface-language";
import {
  adminCopy,
  publicationStatusCopy,
  resourceTypeCopy,
  skillKindCopy,
  text
} from "@/lib/i18n/page-copy";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import {
  getA1ContentSummary,
  sampleCourse
} from "@/lib/learning/sample-content";
import { getAdminSkillUnits } from "@/lib/admin/skill-repository";
import { getAdminFlashcardDecks } from "@/lib/flashcards/flashcard-repository";
import { getAdminResourcesFromDb } from "@/lib/resources/resource-repository";

export const dynamic = "force-dynamic";

const labels = {
  fa: {
    manageSkills: "مدیریت مهارت‌ها",
    createResource: "منبع جدید",
    units: "واحدها",
    skills: "مهارت‌ها",
    questions: "سؤال‌ها",
    resources: "منابع",
    published: "منتشر شده",
    assessments: "سنجش‌ها",
    archived: "آرشیو",
    commandCenter: "ابزارهای اصلی",
    contentHealth: "سلامت محتوا",
    hierarchy: "ساختار محتوا",
    resourceQueue: "صف منابع",
    flashcardDecks: "دسته‌های فلش‌کارت",
    flashcardDeckQueue: "کنترل دسته‌های فلش‌کارت",
    newFlashcardDeck: "دسته فلش‌کارت جدید",
    manage: "مدیریت",
    preview: "پیش‌نمایش",
    prepared: "آماده برای توسعه",
    skillStudio: "استودیوی مهارت",
    skillStudioBody: "ویرایش متادیتا، وضعیت انتشار، ترتیب سؤال‌ها و محتوای سؤال.",
    resourceStudio: "استودیوی منابع",
    resourceStudioBody: "ساخت کتاب، ویدئو، صوت، گرامر، خواندن، راهنما و لینک آموزشی.",
    flashcardStudio: "استودیوی فلش‌کارت",
    flashcardStudioBody: "ساخت دسته‌ها، یونیت‌ها و کارت‌های سطح‌بندی‌شده برای مرور.",
    learnerQa: "بازبینی یادگیرنده",
    learnerQaBody: "بعد از انتشار، مسیر یادگیری را مثل کاربر واقعی بررسی کن.",
    flashcards: "مدیریت فلش‌کارت",
    profiles: "پروفایل‌ها",
    localization: "بومی‌سازی",
    levels: "سطح‌ها",
    reviews: "بازبینی‌ها",
    questionsLink: "سؤال‌ها",
    edit: "ویرایش"
  },
  en: {
    manageSkills: "Manage Skills",
    createResource: "Create Resource",
    units: "Units",
    skills: "Skills",
    questions: "Questions",
    resources: "Resources",
    published: "published",
    assessments: "assessments",
    archived: "archived",
    commandCenter: "Command center",
    contentHealth: "Content health",
    hierarchy: "Content hierarchy",
    resourceQueue: "Resource queue",
    flashcardDecks: "Flashcard Decks",
    flashcardDeckQueue: "Flashcard Deck controls",
    newFlashcardDeck: "New Flashcard Deck",
    manage: "Manage",
    preview: "Preview",
    prepared: "Prepared module",
    skillStudio: "Skill Studio",
    skillStudioBody: "Edit metadata, publication states, Question order, and Question content.",
    resourceStudio: "Resource Studio",
    resourceStudioBody: "Create books, videos, audio, grammar, reading, guides, and educational links.",
    flashcardStudio: "Flashcard Studio",
    flashcardStudioBody: "Create categorized decks, learner-ready units, and review cards by Level.",
    learnerQa: "Learner QA",
    learnerQaBody: "Review the learner path after publishing or reordering content.",
    flashcards: "Flashcards",
    profiles: "Profiles",
    localization: "Localization",
    levels: "Levels",
    reviews: "Reviews",
    questionsLink: "Questions",
    edit: "Edit"
  },
  de: {
    manageSkills: "Skills verwalten",
    createResource: "Ressource erstellen",
    units: "Einheiten",
    skills: "Skills",
    questions: "Fragen",
    resources: "Ressourcen",
    published: "veroeffentlicht",
    assessments: "Pruefungen",
    archived: "archiviert",
    commandCenter: "Kommandozentrale",
    contentHealth: "Inhaltsstatus",
    hierarchy: "Inhaltsstruktur",
    resourceQueue: "Ressourcenliste",
    flashcardDecks: "Kartendecks",
    flashcardDeckQueue: "Kartendeck-Steuerung",
    newFlashcardDeck: "Neues Kartendeck",
    manage: "Verwalten",
    preview: "Vorschau",
    prepared: "Vorbereitetes Modul",
    skillStudio: "Skill Studio",
    skillStudioBody: "Metadaten, Veroeffentlichung, Fragenreihenfolge und Frageninhalt bearbeiten.",
    resourceStudio: "Ressourcen Studio",
    resourceStudioBody: "Buecher, Videos, Audio, Grammatik, Lesen, Guides und Lernlinks erstellen.",
    flashcardStudio: "Karten Studio",
    flashcardStudioBody: "Kategorisierte Decks, Einheiten und Wiederholungskarten nach Niveau erstellen.",
    learnerQa: "Lernenden-QA",
    learnerQaBody: "Den Lernpfad nach Veroeffentlichungen aus Sicht der Lernenden pruefen.",
    flashcards: "Karten",
    profiles: "Profile",
    localization: "Lokalisierung",
    levels: "Niveaus",
    reviews: "Reviews",
    questionsLink: "Fragen",
    edit: "Bearbeiten"
  }
};

export default async function AdminPage({
  searchParams
}: {
  searchParams: Promise<{
    ui?: string;
  }>;
}) {
  const { ui } = await searchParams;
  const preferences = await getLearnerPreferences();
  const language = ui
    ? resolveInterfaceLanguage(ui)
    : preferences.interfaceLanguage;
  const copy = interfaceCopy[language];
  const t = labels[language];
  const summary = getA1ContentSummary();
  const [skillUnits, resources, flashcardDecks] = await Promise.all([
    getAdminSkillUnits(),
    getAdminResourcesFromDb(),
    getAdminFlashcardDecks()
  ]);
  const skills = skillUnits.flatMap((unit) =>
    unit.skills.map((skill) => ({
      level: unit.level,
      unit,
      skill
    }))
  );
  const publishedSkills = skills.filter(
    ({ skill }) => skill.publicationStatus === "PUBLISHED"
  ).length;
  const assessmentCount = skills.filter(
    ({ skill }) => skill.kind !== "REGULAR"
  ).length;
  const archivedResources = resources.filter(
    (resource) => resource.publicationStatus === "ARCHIVED"
  ).length;
  const adminFlashcardDecks = flashcardDecks.filter(
    (deck) => deck.ownerType === "ADMIN"
  );
  const metrics = [
    {
      label: t.units,
      value: summary.unitCount,
      detail: "A1",
      icon: GraduationCap
    },
    {
      label: t.skills,
      value: skills.length,
      detail: `${publishedSkills} ${t.published}`,
      icon: Rocket
    },
    {
      label: t.questions,
      value: summary.questionCount,
      detail: `${assessmentCount} ${t.assessments}`,
      icon: ListChecks
    },
    {
      label: t.resources,
      value: resources.length,
      detail: `${archivedResources} ${t.archived}`,
      icon: FileText
    },
    {
      label: t.flashcards,
      value: flashcardDecks.reduce((total, deck) => total + deck.flashcards.length, 0),
      detail: `${flashcardDecks.length} decks`,
      icon: Sparkles
    }
  ];
  const preparedModules = [
    { label: t.profiles, icon: UsersRound },
    { label: t.localization, icon: Languages },
    { label: t.levels, icon: Layers3 },
    { label: t.reviews, icon: ShieldCheck }
  ];

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={language} currentPath="/admin" />

      <section className="route-page admin-route">
        <div className="admin-hero">
          <div>
            <span className="section-label">{text(adminCopy.label, language)}</span>
            <h1>{text(adminCopy.title, language)}</h1>
          </div>
          <p>{text(adminCopy.body, language)}</p>
          <div className="route-actions">
            <Link className="primary-button" href={withInterfaceLanguage("/admin/skills", language)}>
              <GraduationCap size={18} />
              {t.manageSkills}
            </Link>
            <Link className="secondary-button" href={withInterfaceLanguage("/admin/resources/new", language)}>
              <Plus size={18} />
              {t.createResource}
            </Link>
          </div>
        </div>

        <section className="admin-metric-grid" aria-label={t.contentHealth}>
          {metrics.map((metric) => {
            const Icon = metric.icon;

            return (
              <article className="admin-metric-card" key={metric.label}>
                <Icon size={19} />
                <span>{metric.label}</span>
                <strong>{metric.value}</strong>
                <small>{metric.detail}</small>
              </article>
            );
          })}
        </section>

        <section className="admin-command-grid" aria-label={t.commandCenter}>
          <Link className="admin-command-card" href={withInterfaceLanguage("/admin/skills", language)}>
            <GraduationCap size={22} />
            <div>
              <strong>{t.skillStudio}</strong>
              <span>{t.skillStudioBody}</span>
            </div>
          </Link>
          <Link className="admin-command-card" href={withInterfaceLanguage("/admin/resources/new", language)}>
            <BookOpen size={22} />
            <div>
              <strong>{t.resourceStudio}</strong>
              <span>{t.resourceStudioBody}</span>
            </div>
          </Link>
          <Link className="admin-command-card" href={withInterfaceLanguage("/admin/flashcards", language)}>
            <Sparkles size={22} />
            <div>
              <strong>{t.flashcardStudio}</strong>
              <span>{t.flashcardStudioBody}</span>
            </div>
          </Link>
          <Link className="admin-command-card" href={withInterfaceLanguage("/learn", language)}>
            <ShieldCheck size={22} />
            <div>
              <strong>{t.learnerQa}</strong>
              <span>{t.learnerQaBody}</span>
            </div>
          </Link>
        </section>

        <section className="admin-prepared-grid" aria-label={t.prepared}>
          {preparedModules.map((module) => {
            const Icon = module.icon;

            return (
              <article className="admin-prepared-card" key={module.label}>
                <Icon size={18} />
                <strong>{module.label}</strong>
                <span>{t.prepared}</span>
              </article>
            );
          })}
        </section>

        <section className="admin-two-column">
          <section className="app-panel route-panel admin-list-panel" aria-label={t.hierarchy}>
            <div className="app-panel-header">
              <div>
                <p className="panel-kicker">{t.hierarchy}</p>
                <h2>{t.skills}</h2>
              </div>
              <span className="status-pill">
                {summary.unitCount} {t.units} · {summary.questionCount} {t.questions}
              </span>
            </div>
            <div className="admin-preview compact-preview">
              {skills.slice(0, 10).map(({ level, unit, skill }) => (
                <article className="admin-row" key={skill.slug}>
                  <Circle size={12} />
                  <div>
                    <h3>{skill.title}</h3>
                    <p>
                      {sampleCourse.title} / {level.label} / {unit.title} /{" "}
                      {skill.questions.length} {t.questions}
                    </p>
                  </div>
                  <span>{text(skillKindCopy[skill.kind], language)}</span>
                  <Link
                    className="ghost-button compact-link"
                    href={withInterfaceLanguage(`/admin/skills/${skill.slug}/questions`, language)}
                  >
                    <ListChecks size={16} />
                    {t.questionsLink}
                  </Link>
                </article>
              ))}
            </div>
          </section>

          <section className="app-panel route-panel admin-list-panel" aria-label={t.resourceQueue}>
            <div className="app-panel-header">
              <div>
                <p className="panel-kicker">{t.resources}</p>
                <h2>{t.resourceQueue}</h2>
              </div>
              <span className="status-pill">{resources.length} {t.resources}</span>
            </div>
            <div className="admin-preview compact-preview">
              {resources.map((resource) => (
                <article className="admin-row" key={resource.slug}>
                  <Circle size={12} />
                  <div>
                    <h3>{resource.title}</h3>
                    <p>
                      {resource.levelLabel} / {text(resourceTypeCopy[resource.type], language)}
                      {resource.unit ? ` / ${resource.unit.title}` : ""}
                    </p>
                  </div>
                  <span
                    className={
                      resource.publicationStatus === "ARCHIVED"
                        ? "status-archived"
                        : undefined
                    }
                  >
                    {resource.publicationStatus === "ARCHIVED" ? <Archive size={13} /> : null}
                    {text(publicationStatusCopy[resource.publicationStatus], language)}
                  </span>
                  <Link
                    className="ghost-button compact-link"
                    href={withInterfaceLanguage(`/admin/resources/${resource.slug}/edit`, language)}
                  >
                    <Pencil size={16} />
                    {t.edit}
                  </Link>
                </article>
              ))}
            </div>
          </section>
        </section>

        <section className="app-panel route-panel admin-list-panel" aria-label={t.flashcardDeckQueue}>
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">{t.flashcards}</p>
              <h2>{t.flashcardDecks}</h2>
            </div>
            <div className="route-actions compact-actions">
              <Link
                className="primary-button compact"
                href={withInterfaceLanguage("/admin/flashcards", language)}
              >
                <Plus size={16} />
                {t.newFlashcardDeck}
              </Link>
            </div>
          </div>
          <div className="admin-preview compact-preview">
            {adminFlashcardDecks.map((deck) => (
              <article className="admin-row" key={deck.slug}>
                <Circle size={12} />
                <div>
                  <h3>{deck.title}</h3>
                  <p>
                    {deck.levelLabel} / {deck.category}
                    {deck.unit ? ` / ${deck.unit.title}` : ""} / {deck.flashcards.length}{" "}
                    {t.flashcards}
                  </p>
                </div>
                <span
                  className={
                    deck.publicationStatus === "ARCHIVED"
                      ? "status-archived"
                      : undefined
                  }
                >
                  {deck.publicationStatus === "ARCHIVED" ? <Archive size={13} /> : null}
                  {text(publicationStatusCopy[deck.publicationStatus], language)}
                </span>
                <Link
                  className="ghost-button compact-link"
                  href={withInterfaceLanguage("/admin/flashcards", language)}
                >
                  <Pencil size={16} />
                  {t.manage}
                </Link>
                <Link
                  className="ghost-button compact-link"
                  href={withInterfaceLanguage("/flashcards", language)}
                >
                  <BookOpen size={16} />
                  {t.preview}
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
