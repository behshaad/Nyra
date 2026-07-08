import Link from "next/link";
import { ArrowLeft, CheckCircle2, Circle, FileCheck2, RotateCcw, Trophy } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import {
  interfaceCopy,
  resolveInterfaceLanguage,
  withInterfaceLanguage
} from "@/lib/i18n/interface-language";
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
    ui?: string;
  }>;
}) {
  const { unit: selectedUnitParam, ui } = await searchParams;
  const language = resolveInterfaceLanguage(ui);
  const copy = interfaceCopy[language];
  const summary = getA1ContentSummary();
  const a1Level = sampleCourse.levels[0];
  const progress = await getLearningPathProgress();
  const selectedUnit =
    progress.units.find((unit) => unit.slug === selectedUnitParam) ??
    progress.units.find((unit) => unit.slug === progress.selectedUnitSlug) ??
    progress.units[0];
  const nextSkill = progress.nextSkill ?? selectedUnit?.skills[0] ?? null;

  return (
    <main className="site-shell learner-rtl" dir={copy.dir}>
      <AnimatedBackdrop />
      <AppHeader
        language={language}
        currentPath={selectedUnitParam ? `/learn?unit=${selectedUnitParam}` : "/learn"}
      />

      <section className="route-page">
        <div className="route-hero compact">
          <span className="section-label">{copy.learn.label}</span>
          <h1>{copy.learn.title}</h1>
          <p>{copy.learn.body(summary)}</p>
          <div className="level-selector" aria-label={copy.learn.levelLabel}>
            <Link className="level-pill active" href={withInterfaceLanguage("/learn", language)}>
              A1
            </Link>
            <span className="level-pill disabled">A2 · {copy.learn.levelComingSoon}</span>
          </div>
        </div>

        <section className="learn-dashboard" aria-label={copy.learn.label}>
          <aside className="app-panel unit-rail" aria-label="A1 units">
            <div className="app-panel-header">
              <div>
                <p className="panel-kicker">{copy.learn.progress}</p>
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
                  href={withInterfaceLanguage(`/learn?unit=${unit.slug}`, language)}
                  key={unit.slug}
                >
                  <span>{unit.order}</span>
                  <div>
                    <strong>{unit.title}</strong>
                    <small>
                      {unit.completedCount}/{unit.skills.length} {copy.learn.completed}
                    </small>
                  </div>
                </Link>
              ))}
            </div>
          </aside>

          <section className="app-panel unit-focus" aria-label={copy.learn.unit}>
            {nextSkill ? (
              <div className="continue-card">
                <div>
                  <span className="section-label">{copy.learn.nextStep}</span>
                  <h2>{nextSkill.title}</h2>
                  <p>{nextSkill.description}</p>
                </div>
                <Link
                  className="primary-button"
                  href={withInterfaceLanguage(`/learn/${nextSkill.slug}`, language)}
                >
                  {copy.learn.continue}
                  <ArrowLeft size={18} />
                </Link>
              </div>
            ) : (
              <div className="continue-card">
                <div>
                  <span className="section-label">{copy.learn.completeLabel}</span>
                  <h2>{copy.learn.completeTitle}</h2>
                  <p>{copy.learn.completeBody}</p>
                </div>
                <Link
                  className="secondary-button"
                  href={withInterfaceLanguage("/learn?unit=a1-first-contacts", language)}
                >
                  {copy.learn.reviewFromStart}
                  <RotateCcw size={18} />
                </Link>
              </div>
            )}

            <div className="app-panel-header">
              <div>
                <p className="panel-kicker">
                  {copy.learn.unit} {selectedUnit?.order}
                </p>
                <h2>{selectedUnit?.title}</h2>
                <p className="muted-line">{selectedUnit?.summary}</p>
              </div>
              <span className="status-pill">
                {selectedUnit?.progressPercent}% {copy.learn.progressPercent}
              </span>
            </div>

            <div className="skill-grid-compact">
              {selectedUnit?.skills.map((skill) => {
                const isAssessment = skill.kind !== "REGULAR";
                const stateLabel =
                  skill.state === "completed"
                    ? copy.learn.completedState
                    : skill.state === "needs_review"
                      ? copy.learn.reviewState
                      : skill.state === "current"
                        ? copy.learn.currentState
                        : copy.learn.upcomingState;

                return (
                  <Link
                    className={`skill-tile ${skill.state}`}
                    href={withInterfaceLanguage(`/learn/${skill.slug}`, language)}
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
                          ? copy.learn.finalTest
                          : skill.kind === "UNIT_CHECKPOINT"
                            ? copy.learn.checkpoint
                            : isAssessment
                              ? copy.learn.assessment
                              : copy.learn.skill}
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
