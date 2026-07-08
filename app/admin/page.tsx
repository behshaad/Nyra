import { Circle } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import {
  getA1ContentSummary,
  getPublishedResources,
  sampleCourse
} from "@/lib/learning/sample-content";

export default function AdminPage() {
  const summary = getA1ContentSummary();
  const skills = sampleCourse.levels.flatMap((level) =>
    level.units.flatMap((unit) =>
      unit.skills.map((skill) => ({
        level,
        unit,
        skill
      }))
    )
  );
  const resources = getPublishedResources();

  return (
    <main className="site-shell">
      <AnimatedBackdrop />
      <AppHeader />

      <section className="route-page">
        <div className="route-hero">
          <span className="section-label">Admin CMS</span>
          <h1>Read-only content view first.</h1>
          <p>
            Admin write forms, audit logs, billing tools, analytics, and AI drafting are deferred.
            This page shows the current content hierarchy and publication state.
          </p>
        </div>

        <section className="app-panel route-panel" aria-label="Read-only admin content">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Content hierarchy</p>
              <h2>Published A1 Content</h2>
            </div>
            <span className="status-pill">
              {summary.unitCount} Units · {summary.questionCount} Questions
            </span>
          </div>
          <div className="admin-preview">
            {skills.map(({ level, unit, skill }) => (
              <article className="admin-row" key={skill.slug}>
                <Circle size={12} />
                <div>
                  <h3>{skill.title}</h3>
                  <p>
                    {sampleCourse.title} / {level.label} / {unit.title} /{" "}
                    {skill.questions.length} Questions
                  </p>
                </div>
                <span>{skill.kind.replaceAll("_", " ")}</span>
              </article>
            ))}
          </div>
        </section>

        <section className="app-panel route-panel" aria-label="Read-only admin resources">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Resource Library</p>
              <h2>Published Resources</h2>
            </div>
            <span className="status-pill">{resources.length} Resources</span>
          </div>
          <div className="admin-preview">
            {resources.map((resource) => (
              <article className="admin-row" key={resource.slug}>
                <Circle size={12} />
                <div>
                  <h3>{resource.title}</h3>
                  <p>
                    {resource.levelLabel} / {resource.type.replaceAll("_", " ")}
                  </p>
                </div>
                <span>{resource.publicationStatus}</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
