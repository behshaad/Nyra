import Link from "next/link";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { getPublishedSkills, sampleCourse } from "@/lib/learning/sample-content";

export default function LearnPage() {
  const skills = getPublishedSkills();

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
            {sampleCourse.targetLanguage}. Higher levels stay future scope until the A1 loop
            proves itself.
          </p>
        </div>

        <section className="app-panel route-panel" aria-label="Published skills">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Published now</p>
              <h2>A1 Foundations</h2>
            </div>
            <span className="status-pill">{skills.length} Skill</span>
          </div>
          <div className="path-column">
            {skills.map((skill) => (
              <Link className="skill-node current" href={`/learn/${skill.slug}`} key={skill.slug}>
                <span className="node-icon">
                  <CheckCircle2 size={17} />
                </span>
                <div>
                  <small>{skill.unitTitle}</small>
                  <h3>{skill.title}</h3>
                  <p>{skill.description}</p>
                </div>
                <strong>{skill.xp} XP</strong>
              </Link>
            ))}
            <article className="skill-node locked">
              <span className="node-icon">
                <Lock size={17} />
              </span>
              <div>
                <small>Coming later</small>
                <h3>Checkpoints</h3>
                <p>Unit gates are deferred until the core Skill loop is stable.</p>
              </div>
              <strong>Later</strong>
            </article>
          </div>
        </section>

        <div className="route-actions">
          <Link className="primary-button" href="/learn/family-basics">
            Start Family basics
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}
