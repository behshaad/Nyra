import { Circle } from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { sampleCourse } from "@/lib/learning/sample-content";

export default function AdminPage() {
  const skills = sampleCourse.levels.flatMap((level) =>
    level.units.flatMap((unit) =>
      unit.skills.map((skill) => ({
        level,
        unit,
        skill
      }))
    )
  );

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
          <div className="admin-preview">
            {skills.map(({ level, unit, skill }) => (
              <article className="admin-row" key={skill.slug}>
                <Circle size={12} />
                <div>
                  <h3>{skill.title}</h3>
                  <p>
                    {sampleCourse.title} / {level.label} / {unit.title}
                  </p>
                </div>
                <span>{skill.publicationStatus}</span>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
