import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { ProfileSettings } from "@/components/profile-settings";
import { BarChart3, Crown, Flame, Gem, ShieldCheck, Star, Target, Trophy } from "lucide-react";
import {
  interfaceCopy,
  resolveInterfaceLanguage
} from "@/lib/i18n/interface-language";
import { profileCopy, text } from "@/lib/i18n/page-copy";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import { devLearnerProfile } from "@/lib/learning/sample-content";
import { getPracticeJourney } from "@/lib/practice/journey";

const progressCopy = {
  fa: {
    label: "پیشرفت",
    title: "آمار پیشرفت",
    body: "پیشرفت شخصی، سطح فعلی و وضعیت یادگیری شما در یک نگاه.",
    currentLevel: "سطح فعلی",
    xp: "XP",
    dailyStreak: "روند روزانه",
    membership: "عضویت",
    completed: "مهارت‌های تکمیل‌شده",
    review: "نیازمند مرور",
    dailyGoal: "هدف روزانه",
    overall: "پیشرفت کلی",
    standard: "Standard",
    days: "روز",
    minutes: "دقیقه"
  },
  en: {
    label: "Progress",
    title: "Progress Stats",
    body: "Your personal progress, current level, and learning status at a glance.",
    currentLevel: "Current Level",
    xp: "XP",
    dailyStreak: "Daily Streak",
    membership: "Membership",
    completed: "Completed Skills",
    review: "Needs Review",
    dailyGoal: "Daily Goal",
    overall: "Overall Progress",
    standard: "Standard",
    days: "days",
    minutes: "min"
  },
  de: {
    label: "Fortschritt",
    title: "Fortschrittsstatistiken",
    body: "Dein persoenlicher Fortschritt, aktuelles Niveau und Lernstatus auf einen Blick.",
    currentLevel: "Aktuelles Level",
    xp: "XP",
    dailyStreak: "Daily Streak",
    membership: "Mitgliedschaft",
    completed: "Abgeschlossene Skills",
    review: "Wiederholen",
    dailyGoal: "Tagesziel",
    overall: "Gesamtfortschritt",
    standard: "Standard",
    days: "Tage",
    minutes: "Min."
  }
};

function formatPercent(done: number, total: number) {
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

export default async function ProfilePage({
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
  const journey = await getPracticeJourney({
    interfaceLanguage: language
  });
  const progress = progressCopy[language];
  const currentLevelLabel = journey.currentNode?.levelLabel ?? preferences.currentLevel;
  const currentLevel = journey.levels.find((level) => level.label === currentLevelLabel);
  const progressPercent = formatPercent(journey.completedCount, journey.totalCount);
  const profileStats = [
    {
      label: progress.currentLevel,
      value: currentLevelLabel,
      detail: currentLevel?.title ?? devLearnerProfile.currentLevel,
      icon: Crown
    },
    {
      label: progress.xp,
      value: journey.totalXp.toLocaleString("en-US"),
      detail: journey.course?.title ?? "Learning Path",
      icon: Gem
    },
    {
      label: progress.dailyStreak,
      value: "12",
      detail: progress.days,
      icon: Flame
    },
    {
      label: progress.membership,
      value: progress.standard,
      detail: "Lingoix",
      icon: Star
    },
    {
      label: progress.completed,
      value: `${journey.completedCount} / ${journey.totalCount}`,
      detail: `${progressPercent}% ${progress.overall}`,
      icon: ShieldCheck
    },
    {
      label: progress.review,
      value: String(journey.needsReviewCount),
      detail: progress.review,
      icon: Trophy
    },
    {
      label: progress.dailyGoal,
      value: String(devLearnerProfile.dailyGoalMinutes),
      detail: progress.minutes,
      icon: Target
    }
  ];

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={language} currentPath="/profile" />

      <section className="route-page">
        <div className="route-hero">
          <span className="section-label">{text(profileCopy.label, language)}</span>
          <h1>{text(profileCopy.title, language)}</h1>
          <p>{text(profileCopy.body, language)}</p>
        </div>

        <section className="app-panel profile-progress-section" aria-labelledby="profile-progress-title">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">{progress.label}</p>
              <h2 id="profile-progress-title">{progress.title}</h2>
              <p>{progress.body}</p>
            </div>
            <span className="status-pill bright">
              <BarChart3 size={16} />
              {progressPercent}%
            </span>
          </div>

          <div className="profile-progress-grid">
            {profileStats.map((stat) => {
              const Icon = stat.icon;

              return (
                <article className="profile-progress-card" key={stat.label}>
                  <Icon size={20} />
                  <span>{stat.label}</span>
                  <strong>{stat.value}</strong>
                  <small>{stat.detail}</small>
                </article>
              );
            })}
          </div>
        </section>

        <ProfileSettings
          language={language}
          initialValues={{
            displayName: devLearnerProfile.displayName,
            sourceLanguage: devLearnerProfile.sourceLanguage,
            targetLanguage: devLearnerProfile.targetLanguage,
            currentLevel: preferences.currentLevel,
            dailyGoalMinutes: devLearnerProfile.dailyGoalMinutes
          }}
        />
      </section>
    </main>
  );
}
