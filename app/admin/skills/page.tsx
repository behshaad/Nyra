import Link from "next/link";
import {
  ArrowLeft,
  Circle,
  FileCheck2,
  ListChecks,
  Pencil,
  Trophy
} from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import { getAdminSkillUnits } from "@/lib/admin/skill-repository";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const units = await getAdminSkillUnits();
  const skillCount = units.reduce((total, unit) => total + unit.skills.length, 0);

  return (
    <main className="site-shell admin-ltr" dir="ltr">
      <AnimatedBackdrop />
      <AppHeader currentPath="/admin/skills" />

      <section className="route-page admin-route">
        <div className="route-hero admin-title-row">
          <Link className="ghost-button" href="/admin">
            <ArrowLeft size={17} />
            Back to Admin
          </Link>
          <span className="section-label">Admin CMS</span>
          <h1>Skill Studio.</h1>
          <p>
            Manage the authored A1 path by Unit. Regular Skills, Unit Checkpoints, and the Final
            A1 Test share the same editing surface so publication and QA stay visible.
          </p>
        </div>

        <section className="app-panel route-panel admin-list-panel" aria-label="Admin Skills">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Learning path</p>
              <h2>{skillCount} Skills and assessments</h2>
            </div>
            <span className="status-pill">{units.length} Units</span>
          </div>

          <div className="path-column">
            {units.map((unit) => (
              <section className="unit-band" key={unit.slug}>
                <div className="unit-band-header">
                  <div>
                    <small>{unit.level.label}</small>
                    <h3>{unit.title}</h3>
                    <p>{unit.summary}</p>
                  </div>
                  <strong>{unit.skills.length} items</strong>
                </div>

                <div className="admin-preview">
                  {unit.skills.map((skill) => (
                    <article className="admin-row" key={skill.slug}>
                      {skill.kind === "FINAL_TEST" ? (
                        <Trophy size={12} />
                      ) : skill.kind === "UNIT_CHECKPOINT" ? (
                        <FileCheck2 size={12} />
                      ) : (
                        <Circle size={12} />
                      )}
                      <div>
                        <h3>{skill.title}</h3>
                        <p>
                          {skill.kind.replaceAll("_", " ")} / {skill.questions.length} Questions /{" "}
                          {skill.xp} XP
                        </p>
                      </div>
                      <span
                        className={
                          skill.publicationStatus === "ARCHIVED"
                            ? "status-archived"
                            : undefined
                        }
                      >
                        {skill.publicationStatus}
                      </span>
                      <Link
                        className="ghost-button compact-link"
                        href={`/admin/skills/${skill.slug}/edit`}
                      >
                        <Pencil size={16} />
                        Edit
                      </Link>
                      <Link
                        className="ghost-button compact-link"
                        href={`/admin/skills/${skill.slug}/questions`}
                      >
                        <ListChecks size={16} />
                        Questions
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
