import Link from "next/link";
import { ArrowRight, CheckCircle2, FileCheck2, Trophy } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import {
  getA1ContentSummary,
  sampleCourse
} from "@/lib/learning/sample-content";

export default function LearnPage() {
  const summary = getA1ContentSummary();
  const a1Level = sampleCourse.levels[0];
  const firstSkill = a1Level.units[0]?.skills[0];

  return (
    <main className="site-shell">
      <AnimatedBackdrop />
      <AppHeader />

      <section className="route-page">
        <div className="route-hero">
          <span className="section-label">Learning path</span>
          <h1>A1 first, polished before broad.</h1>
          <p>
            The MVP Course is {sampleCourse.sourceLanguage} speakers learning{" "}
            {sampleCourse.targetLanguage}. A1 now includes the complete playable path:
            Skills, Unit Checkpoints, and the Final A1 Test.
          </p>
        </div>

        <section className="app-panel route-panel" aria-label="Published skills">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Published A1</p>
              <h2>{a1Level.title}</h2>
            </div>
            <span className="status-pill">
              {summary.regularSkillCount} Skills · {summary.questionCount} Questions
            </span>
          </div>
          <div className="path-column">
            {a1Level.units.map((unit, unitIndex) => (
              <section className="unit-band" key={unit.slug}>
                <div className="unit-band-header">
                  <div>
                    <small>Unit {unitIndex + 1}</small>
                    <h3>{unit.title}</h3>
                    <p>{unit.summary}</p>
                  </div>
                  <strong>{unit.skills.length} items</strong>
                </div>
                <div className="path-column compact">
                  {unit.skills.map((skill) => (
                    <Link
                      className="skill-node current"
                      href={`/learn/${skill.slug}`}
                      key={skill.slug}
                    >
                      <span className="node-icon">
                        {skill.kind === "FINAL_TEST" ? (
                          <Trophy size={17} />
                        ) : skill.kind === "UNIT_CHECKPOINT" ? (
                          <FileCheck2 size={17} />
                        ) : (
                          <CheckCircle2 size={17} />
                        )}
                      </span>
                      <div>
                        <small>
                          {skill.kind === "FINAL_TEST"
                            ? "Final A1 Test"
                            : skill.kind === "UNIT_CHECKPOINT"
                              ? "Unit Checkpoint"
                              : unit.title}
                        </small>
                        <h3>{skill.title}</h3>
                        <p>{skill.description}</p>
                      </div>
                      <strong>
                        {skill.passingScore
                          ? `${skill.passingScore}%`
                          : `${skill.xp} XP`}
                      </strong>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>

        {firstSkill ? (
          <div className="route-actions">
            <Link className="primary-button" href={`/learn/${firstSkill.slug}`}>
              Start A1
              <ArrowRight size={18} />
            </Link>
          </div>
        ) : null}
      </section>
    </main>
  );
}
