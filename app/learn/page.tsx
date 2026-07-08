import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, FileCheck2, RotateCcw, Trophy } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import {
  getA1ContentSummary,
  sampleCourse
} from "@/lib/learning/sample-content";
import { getLearningPathProgress } from "@/lib/learning/path-progress";

export default async function LearnPage({
  searchParams
}: {
  searchParams: Promise<{
    unit?: string;
  }>;
}) {
  const { unit: selectedUnitParam } = await searchParams;
  const summary = getA1ContentSummary();
  const a1Level = sampleCourse.levels[0];
  const progress = await getLearningPathProgress();
  const selectedUnit =
    progress.units.find((unit) => unit.slug === selectedUnitParam) ??
    progress.units.find((unit) => unit.slug === progress.selectedUnitSlug) ??
    progress.units[0];
  const nextSkill = progress.nextSkill ?? selectedUnit?.skills[0] ?? null;

  return (
    <main className="site-shell learner-rtl" dir="rtl">
      <AnimatedBackdrop />
      <AppHeader />

      <section className="route-page">
        <div className="route-hero compact">
          <span className="section-label">مسیر یادگیری A1</span>
          <h1>ادامه بده، بدون گم شدن بین درس‌ها.</h1>
          <p>
            این نمای فشرده فقط واحد انتخاب‌شده، مهارت‌های همان واحد، و قدم بعدی
            را نشان می‌دهد. کل A1 شامل {summary.regularSkillCount} مهارت،{" "}
            {summary.checkpointCount} آزمونک واحد و {summary.questionCount} سؤال است.
          </p>
        </div>

        <section className="learn-dashboard" aria-label="مسیر فشرده A1">
          <aside className="app-panel unit-rail" aria-label="واحدهای A1">
            <div className="app-panel-header">
              <div>
                <p className="panel-kicker">پیشرفت A1</p>
                <h2>
                  {progress.completedCount}/{progress.totalCount}
                </h2>
              </div>
              <span className="status-pill">{a1Level.title}</span>
            </div>
            <div className="mini-progress" aria-hidden="true">
              <span
                style={{
                  width: `${Math.round(
                    (progress.completedCount / progress.totalCount) * 100
                  )}%`
                }}
              />
            </div>
            <div className="unit-rail-list">
              {progress.units.map((unit) => (
                <Link
                  className={`unit-chip ${
                    unit.slug === selectedUnit?.slug ? "active" : ""
                  } ${unit.needsReviewCount > 0 ? "needs-review" : ""}`}
                  href={`/learn?unit=${unit.slug}`}
                  key={unit.slug}
                >
                  <span>{unit.order}</span>
                  <div>
                    <strong>{unit.title}</strong>
                    <small>
                      {unit.completedCount}/{unit.skills.length} کامل شده
                    </small>
                  </div>
                </Link>
              ))}
            </div>
          </aside>

          <section className="app-panel unit-focus" aria-label="واحد انتخاب‌شده">
            {nextSkill ? (
              <div className="continue-card">
                <div>
                  <span className="section-label">قدم بعدی</span>
                  <h2>{nextSkill.title}</h2>
                  <p>{nextSkill.description}</p>
                </div>
                <Link className="primary-button" href={`/learn/${nextSkill.slug}`}>
                  ادامه
                  <ArrowLeft size={18} />
                </Link>
              </div>
            ) : (
              <div className="continue-card">
                <div>
                  <span className="section-label">A1 کامل شد</span>
                  <h2>همه‌ی مسیر را تمام کرده‌ای.</h2>
                  <p>برای مرور، یکی از واحدها را انتخاب کن و مهارت‌ها را دوباره بزن.</p>
                </div>
                <Link className="secondary-button" href="/learn?unit=a1-first-contacts">
                  مرور از ابتدا
                  <RotateCcw size={18} />
                </Link>
              </div>
            )}

          <div className="app-panel-header">
            <div>
                <p className="panel-kicker">واحد {selectedUnit?.order}</p>
                <h2>{selectedUnit?.title}</h2>
                <p className="muted-line">{selectedUnit?.summary}</p>
            </div>
            <span className="status-pill">
                {selectedUnit?.progressPercent}% پیشرفت
            </span>
          </div>

            <div className="skill-grid-compact">
              {selectedUnit?.skills.map((skill) => {
                const isAssessment = skill.kind !== "REGULAR";
                const stateLabel =
                  skill.state === "completed"
                    ? "کامل"
                    : skill.state === "needs_review"
                      ? "نیاز به مرور"
                      : skill.state === "current"
                        ? "فعلی"
                        : "بعدی";

                return (
                    <Link
                    className={`skill-tile ${skill.state}`}
                      href={`/learn/${skill.slug}`}
                      key={skill.slug}
                    >
                      <span className="node-icon">
                        {skill.kind === "FINAL_TEST" ? (
                          <Trophy size={17} />
                        ) : skill.kind === "UNIT_CHECKPOINT" ? (
                          <FileCheck2 size={17} />
                      ) : skill.state === "upcoming" ? (
                        <Circle size={17} />
                        ) : (
                          <CheckCircle2 size={17} />
                        )}
                      </span>
                      <div>
                        <small>
                          {skill.kind === "FINAL_TEST"
                          ? "آزمون نهایی A1"
                            : skill.kind === "UNIT_CHECKPOINT"
                            ? "آزمونک واحد"
                            : isAssessment
                              ? "سنجش"
                              : "مهارت"}
                        </small>
                        <h3>{skill.title}</h3>
                        <p>{skill.description}</p>
                      </div>
                    <strong>{skill.scorePercent ?? stateLabel}</strong>
                    </Link>
                );
              })}
            </div>
          </section>
        </section>
      </section>
    </main>
  );
}
