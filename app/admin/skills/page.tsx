import Link from "next/link";
import {
  AlertTriangle, CheckCircle2, Circle, ExternalLink, FileCheck2,
  ListChecks, LockKeyhole, Search, SlidersHorizontal, Trophy
} from "lucide-react";
import { PublicationStatus, SkillKind } from "@/lib/generated/prisma/enums";
import { getAdminSkillUnits } from "@/lib/admin/skill-repository";
import {
  filterSkillStudioUnits, groupSkillStudioByLevel, skillStudioReadiness
} from "@/lib/admin/skill-studio";

export const dynamic = "force-dynamic";

const statusLabels: Record<PublicationStatus, string> = {
  DRAFT: "Draft", IN_REVIEW: "In Review", PUBLISHED: "Published", ARCHIVED: "Archived"
};
const kindLabels: Record<SkillKind, string> = {
  REGULAR: "Regular Skill", UNIT_CHECKPOINT: "Unit Checkpoint", FINAL_TEST: "Final Level Test"
};
const readinessLabels = {
  ready: "Ready", needs_attention: "Needs attention", in_preparation: "In preparation", archived: "Archived"
};

function KindIcon({ kind }: { kind: SkillKind }) {
  if (kind === SkillKind.FINAL_TEST) return <Trophy aria-hidden="true" size={15} />;
  if (kind === SkillKind.UNIT_CHECKPOINT) return <FileCheck2 aria-hidden="true" size={15} />;
  return <Circle aria-hidden="true" size={13} />;
}

export default async function AdminSkillsPage({
  searchParams
}: {
  searchParams: Promise<{ q?: string; status?: string; kind?: string; level?: string; readiness?: string }>;
}) {
  const filters = await searchParams;
  const units = await getAdminSkillUnits();
  const filteredUnits = filterSkillStudioUnits(units, filters);
  const levels = groupSkillStudioByLevel(filteredUnits);
  const allSkills = units.flatMap((unit) => unit.skills);
  const visibleSkillCount = filteredUnits.reduce((total, unit) => total + unit.skills.length, 0);
  const levelOptions = [...new Set(units.map((unit) => unit.level.label))].sort();
  const activeFilters = Boolean(filters.q || filters.status || filters.kind || filters.level || filters.readiness);

  return (
    <div className="skill-studio-page">
      <header className="skill-studio-hero">
        <div>
          <span className="section-label">Curriculum operations · مدیریت برنامه آموزشی</span>
          <h1>Skill Studio</h1>
          <p>Find and inspect authored Skills and assessments without losing their Level and Unit context.</p>
        </div>
        <div className="skill-studio-summary" aria-label="Skill summary">
          <strong>{allSkills.length}</strong><span>authored Skills</span>
          <strong>{allSkills.filter((skill) => skill.publicationStatus === PublicationStatus.PUBLISHED).length}</strong><span>Published</span>
          <strong>{allSkills.filter((skill) => skillStudioReadiness(skill).readiness === "needs_attention").length}</strong><span>need attention</span>
        </div>
      </header>

      <form className="skill-studio-filters" action="/admin/skills">
        <label className="skill-studio-search"><Search aria-hidden="true" size={19} /><span className="sr-only">Search Skills</span><input name="q" defaultValue={filters.q} placeholder="Search title, slug, Unit, or Level" /></label>
        <label><span className="sr-only">Publication Status</span><select name="status" defaultValue={filters.status ?? ""}><option value="">All statuses</option>{Object.values(PublicationStatus).map((status) => <option key={status} value={status}>{statusLabels[status]}</option>)}</select></label>
        <label><span className="sr-only">Skill Kind</span><select name="kind" defaultValue={filters.kind ?? ""}><option value="">All Skill Kinds</option>{Object.values(SkillKind).map((kind) => <option key={kind} value={kind}>{kindLabels[kind]}</option>)}</select></label>
        <label><span className="sr-only">Level</span><select name="level" defaultValue={filters.level ?? ""}><option value="">All Levels</option>{levelOptions.map((level) => <option key={level} value={level}>{level}</option>)}</select></label>
        <label><span className="sr-only">Content Readiness</span><select name="readiness" defaultValue={filters.readiness ?? ""}><option value="">All readiness</option><option value="ready">Ready</option><option value="needs_attention">Needs attention</option><option value="in_preparation">In preparation</option></select></label>
        <button className="secondary-button" type="submit"><SlidersHorizontal aria-hidden="true" size={17} />Apply</button>
        {activeFilters ? <Link className="ghost-button" href="/admin/skills">Clear</Link> : null}
      </form>

      {allSkills.length === 0 ? (
        <section className="skill-studio-empty"><ListChecks aria-hidden="true" size={30} /><h2>No Skills exist yet</h2><p>Skills will appear here after Course, Level, and Unit organization creates the first authored Skill.</p></section>
      ) : visibleSkillCount === 0 ? (
        <section className="skill-studio-empty"><Search aria-hidden="true" size={30} /><h2>No matching Skills</h2><p>Try a broader search or clear one of the lifecycle, Skill Kind, Level, or readiness filters.</p><Link className="secondary-button" href="/admin/skills">Clear filters</Link></section>
      ) : (
        <div className="skill-studio-levels">
          {levels.map((level) => (
            <section className="skill-studio-level" key={level.id}>
              <header><div><span>{level.label}</span><h2>{level.title}</h2></div><small>{level.units.reduce((total, unit) => total + unit.skills.length, 0)} matching Skills</small></header>
              <div className="skill-studio-units">
                {level.units.map((unit) => (
                  <section className="skill-studio-unit" key={unit.id}>
                    <header><div><span>Unit {unit.order}</span><h3>{unit.title}</h3><p>{unit.summary}</p></div><strong>{unit.skills.length} items</strong></header>
                    <div className="skill-studio-list">
                      {unit.skills.map((skill) => {
                        const readiness = skillStudioReadiness(skill);
                        const editable = skill.publicationStatus === PublicationStatus.DRAFT;
                        const questionAction = editable ? "Manage Questions" : skill.publicationStatus === PublicationStatus.IN_REVIEW ? "Review Questions" : "Inspect Questions";
                        const ReadinessIcon = readiness.readiness === "ready" ? CheckCircle2 : readiness.readiness === "archived" ? LockKeyhole : AlertTriangle;
                        return (
                          <article className="skill-studio-row" key={skill.id}>
                            <div className="skill-studio-kind"><KindIcon kind={skill.kind} /><span>{skill.order}</span></div>
                            <div className="skill-studio-main">
                              <div className="skill-studio-title"><h3>{skill.title}</h3><span className={`skill-studio-status is-${skill.publicationStatus.toLowerCase()}`}>{statusLabels[skill.publicationStatus]}</span></div>
                              <p>{skill.description}</p>
                              <div className="skill-studio-meta"><span>{kindLabels[skill.kind]}</span><span>{skill.xp} XP</span><span>{readiness.publishedRequiredQuestions}/{readiness.target} Published required Questions</span><span className={`is-${readiness.readiness}`}><ReadinessIcon aria-hidden="true" size={13} />{readinessLabels[readiness.readiness]}</span></div>
                            </div>
                            <div className="skill-studio-actions">
                              <Link className="secondary-button" href={`/admin/skills/${skill.slug}/edit`}>{editable ? "Edit Draft" : "View"}</Link>
                              <Link className="ghost-button" href={`/admin/skills/${skill.slug}/questions`}><ListChecks aria-hidden="true" size={15} />{questionAction}</Link>
                              {readiness.learnerAvailable ? <Link className="ghost-button" href={`/learn/${skill.slug}`} target="_blank">Learner Preview<ExternalLink aria-hidden="true" size={14} /></Link> : skill.publicationStatus === PublicationStatus.PUBLISHED ? <small>Preview unavailable: not runnable</small> : <small>Preview available when Published</small>}
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
