import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { ProfileAccountSection } from "@/components/profile-account-section";
import { CircleProgress } from "@/components/ui/circle-progress";
import { getAuthSession } from "@/lib/auth/server";
import {
  BarChart3,
  BookOpenCheck,
  Flame,
  Gem,
  GraduationCap,
  Languages,
  ShieldCheck,
  Target,
  Trophy,
  UserRound
} from "lucide-react";
import {
  interfaceCopy,
  resolveInterfaceLanguage
} from "@/lib/i18n/interface-language";
import { profileCopy, text } from "@/lib/i18n/page-copy";
import { getLearnerPreferences } from "@/lib/learner/preferences";
import { devLearnerProfile } from "@/lib/learning/sample-content";
import { getPracticeJourney } from "@/lib/practice/journey";
import type { CSSProperties } from "react";

const progressCopy = {
  fa: {
    label: "پیشرفت",
    title: "My Progress",
    body: "پیشرفت شخصی، سطح فعلی و وضعیت یادگیری شما در یک نگاه.",
    currentLevel: "سطح فعلی",
    xp: "XP",
    dailyStreak: "روند روزانه",
    lessons: "Lessons",
    completion: "Completion",
    review: "نیازمند مرور",
    dailyGoal: "هدف روزانه",
    overall: "پیشرفت کلی",
    days: "روز",
    minutes: "دقیقه",
    heroLabel: "Profile",
    learnerProfile: "Learner Profile",
    sourceLanguage: "زبان مبدا",
    targetLanguage: "زبان هدف",
    nextSkill: "قدم بعدی",
    role: "Role"
  },
  en: {
    label: "Progress",
    title: "My Progress",
    body: "Your personal progress, current level, and learning status at a glance.",
    currentLevel: "Current Level",
    xp: "XP",
    dailyStreak: "Daily Streak",
    lessons: "Lessons",
    completion: "Completion",
    review: "Needs Review",
    dailyGoal: "Daily Goal",
    overall: "Overall Progress",
    days: "days",
    minutes: "min",
    heroLabel: "Profile",
    learnerProfile: "Learner Profile",
    sourceLanguage: "Source Language",
    targetLanguage: "Target Language",
    nextSkill: "Next Skill",
    role: "Role"
  },
  de: {
    label: "Fortschritt",
    title: "My Progress",
    body: "Dein persoenlicher Fortschritt, aktuelles Niveau und Lernstatus auf einen Blick.",
    currentLevel: "Aktuelles Level",
    xp: "XP",
    dailyStreak: "Daily Streak",
    lessons: "Lessons",
    completion: "Completion",
    review: "Wiederholen",
    dailyGoal: "Tagesziel",
    overall: "Gesamtfortschritt",
    days: "Tage",
    minutes: "Min.",
    heroLabel: "Profile",
    learnerProfile: "Lernprofil",
    sourceLanguage: "Ausgangssprache",
    targetLanguage: "Zielsprache",
    nextSkill: "Naechster Skill",
    role: "Role"
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
  const session = await getAuthSession();
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
  const completedLessonsPercent = formatPercent(journey.completedCount, journey.totalCount);
  const dailyGoalPercent = formatPercent(devLearnerProfile.dailyGoalMinutes, 60);
  const dailyStreak = 12;
  const reviewReadinessPercent = journey.totalCount === 0
    ? 100
    : Math.max(0, 100 - Math.round((journey.needsReviewCount / journey.totalCount) * 100));
  const xpGoal = 20000;
  const xpProgressPercent = Math.min(100, Math.round((journey.totalXp / xpGoal) * 100));
  const displayName = session?.fullName ?? devLearnerProfile.displayName;
  const initials = displayName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "N";
  const heroFacts = [
    {
      label: progress.learnerProfile,
      value: journey.course?.title ?? "German Course",
      icon: GraduationCap
    },
    {
      label: progress.currentLevel,
      value: currentLevelLabel,
      icon: Trophy
    },
    {
      label: progress.xp,
      value: journey.totalXp.toLocaleString("en-US"),
      icon: Gem
    },
    {
      label: progress.dailyGoal,
      value: `${devLearnerProfile.dailyGoalMinutes} ${progress.minutes}`,
      icon: Target
    }
  ];
  const profileDetails = [
    {
      label: progress.sourceLanguage,
      value: devLearnerProfile.sourceLanguage,
      icon: Languages
    },
    {
      label: progress.targetLanguage,
      value: devLearnerProfile.targetLanguage,
      icon: Languages
    },
    {
      label: progress.nextSkill,
      value: journey.currentNode?.title ?? currentLevel?.title ?? currentLevelLabel,
      icon: BookOpenCheck
    },
    {
      label: progress.role,
      value: session?.role ?? "USER",
      icon: ShieldCheck
    }
  ];
  const profileStats = [
    {
      label: progress.currentLevel,
      value: currentLevelLabel,
      detail: currentLevel?.title ?? devLearnerProfile.currentLevel,
      icon: Trophy,
      accent: "level"
    },
    {
      label: progress.dailyGoal,
      value: String(devLearnerProfile.dailyGoalMinutes),
      detail: progress.minutes,
      icon: Target,
      accent: "goal",
      ringValue: dailyGoalPercent
    },
    {
      label: progress.lessons,
      value: `${journey.completedCount} / ${journey.totalCount}`,
      detail: progress.overall,
      icon: BookOpenCheck,
      accent: "lessons",
      ringValue: completedLessonsPercent
    },
    {
      label: progress.xp,
      value: journey.totalXp.toLocaleString("en-US"),
      detail: journey.course?.title ?? "Learning Path",
      icon: Gem,
      accent: "xp",
      barValue: xpProgressPercent,
      barLabel: `${xpProgressPercent}%`
    },
    {
      label: progress.dailyStreak,
      value: String(dailyStreak),
      detail: progress.days,
      icon: Flame,
      accent: "streak",
      ringValue: formatPercent(dailyStreak, 30)
    },
    {
      label: progress.completion,
      value: `${progressPercent}%`,
      detail: `${progressPercent}% ${progress.overall}`,
      icon: ShieldCheck,
      accent: "completion",
      ringValue: progressPercent
    },
    {
      label: progress.review,
      value: String(journey.needsReviewCount),
      detail: progress.review,
      icon: Trophy,
      accent: "review",
      ringValue: reviewReadinessPercent
    }
  ];

  return (
    <main className={`site-shell ${copy.dir === "rtl" ? "learner-rtl" : ""}`} dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader language={language} currentPath="/profile" />

      <section className="route-page">
        <section className="profile-hero" aria-labelledby="profile-hero-title">
          <div className="profile-hero-main">
            <div className="profile-hero-avatar" aria-hidden="true">
              {initials ? <span>{initials}</span> : <UserRound size={40} />}
            </div>
            <div className="profile-hero-copy">
              <span className="section-label">{progress.heroLabel}</span>
              <h1 id="profile-hero-title">{displayName}</h1>
              <p>{text(profileCopy.body, language)}</p>
              <div className="profile-detail-grid">
                {profileDetails.map((detail) => {
                  const Icon = detail.icon;

                  return (
                    <span className="profile-detail-pill" key={detail.label}>
                      <Icon size={16} aria-hidden="true" />
                      <span>{detail.label}</span>
                      <strong>{detail.value}</strong>
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="profile-hero-facts">
            {heroFacts.map((fact) => {
              const Icon = fact.icon;

              return (
                <article className="profile-hero-fact" key={fact.label}>
                  <Icon size={18} aria-hidden="true" />
                  <span>{fact.label}</span>
                  <strong>{fact.value}</strong>
                </article>
              );
            })}
          </div>
        </section>

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
                <article className={`profile-progress-card profile-progress-card-${stat.accent}`} key={stat.label}>
                  <div className="profile-progress-card-visual" aria-hidden="true">
                    {typeof stat.ringValue === "number" ? (
                      <CircleProgress value={stat.ringValue} maxValue={100} size={56} strokeWidth={5} />
                    ) : (
                      <span className="profile-progress-icon">
                        <Icon size={22} />
                      </span>
                    )}
                  </div>
                  <div className="profile-progress-card-copy">
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                    <small>{stat.detail}</small>
                    {typeof stat.barValue === "number" ? (
                      <div
                        aria-label={`${stat.label} ${stat.barLabel}`}
                        className="profile-linear-progress profile-linear-progress-striped"
                        role="progressbar"
                        style={
                          {
                            "--profile-linear-progress-value": `${stat.barValue}%`
                          } as CSSProperties
                        }
                        aria-valuemax={100}
                        aria-valuemin={0}
                        aria-valuenow={stat.barValue}
                      >
                        <span />
                      </div>
                    ) : null}
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        <ProfileAccountSection language={language} session={session} />
      </section>
    </main>
  );
}
