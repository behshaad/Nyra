import Link from "next/link";
import {
  Archive,
  Circle,
  FileText,
  GraduationCap,
  ListChecks,
  Pencil,
  Plus,
  Rocket,
  ShieldCheck
} from "lucide-react";
import { AnimatedBackdrop } from "@/components/animated-backdrop";
import { AppHeader } from "@/components/app-header";
import {
  getA1ContentSummary,
  sampleCourse
} from "@/lib/learning/sample-content";
import { getAdminSkillUnits } from "@/lib/admin/skill-repository";
import { getAdminResourcesFromDb } from "@/lib/resources/resource-repository";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const summary = getA1ContentSummary();
  const [skillUnits, resources] = await Promise.all([
    getAdminSkillUnits(),
    getAdminResourcesFromDb()
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
  const metrics = [
    {
      label: "Units",
      value: summary.unitCount,
      detail: "A1 structure",
      icon: GraduationCap
    },
    {
      label: "Skills",
      value: skills.length,
      detail: `${publishedSkills} published`,
      icon: Rocket
    },
    {
      label: "Questions",
      value: summary.questionCount,
      detail: `${assessmentCount} assessments`,
      icon: ListChecks
    },
    {
      label: "Resources",
      value: resources.length,
      detail: `${archivedResources} archived`,
      icon: FileText
    }
  ];

  return (
    <main className="site-shell admin-ltr" dir="ltr">
      <AnimatedBackdrop />
      <AppHeader currentPath="/admin" />

      <section className="route-page admin-route">
        <div className="admin-hero">
          <div>
            <span className="section-label">Admin CMS</span>
            <h1>Content control room.</h1>
          </div>
          <p>
            Manage the A1 learning path, Skill metadata, Questions, and Resources from one dense
            operational view. This remains a dev-admin surface until auth and audit logs land.
          </p>
          <div className="route-actions">
            <Link className="primary-button" href="/admin/skills">
              <GraduationCap size={18} />
              Manage Skills
            </Link>
            <Link className="secondary-button" href="/admin/resources/new">
              <Plus size={18} />
              Create Resource
            </Link>
          </div>
        </div>

        <section className="admin-metric-grid" aria-label="A1 content health">
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

        <section className="admin-command-grid" aria-label="Admin command shortcuts">
          <Link className="admin-command-card" href="/admin/skills">
            <GraduationCap size={22} />
            <div>
              <strong>Skill Studio</strong>
              <span>Edit Skill metadata, publication states, Question order, and Question content.</span>
            </div>
          </Link>
          <Link className="admin-command-card" href="/admin/resources/new">
            <Plus size={22} />
            <div>
              <strong>New Resource</strong>
              <span>Create learner-facing grammar, pronunciation, worksheet, or link support.</span>
            </div>
          </Link>
          <Link className="admin-command-card" href="/learn">
            <ShieldCheck size={22} />
            <div>
              <strong>Learner QA</strong>
              <span>Jump into the learner path after publishing or reordering content.</span>
            </div>
          </Link>
        </section>

        <section className="app-panel route-panel admin-list-panel" aria-label="Admin content">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Content hierarchy</p>
              <h2>A1 Skills and assessments</h2>
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

        <section className="app-panel route-panel admin-list-panel" aria-label="Admin resources">
          <div className="app-panel-header">
            <div>
              <p className="panel-kicker">Resource Library</p>
              <h2>Resource queue</h2>
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
                  {resource.publicationStatus}
                </span>
                <Link
                  className="ghost-button compact-link"
                  href={`/admin/resources/${resource.slug}/edit`}
                >
                  <Pencil size={16} />
                  Edit
                </Link>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
